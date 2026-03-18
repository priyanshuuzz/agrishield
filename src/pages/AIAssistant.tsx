import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../store';
import { Sidebar, Header, cn } from '../components/Common';
import { MessageSquare, Send, Bot, User, Loader2, Sparkles, Zap, ShieldAlert, ArrowRight, Brain, HelpCircle, Mic, MicOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { t } from '../translations';
import { CROPS } from '../constants';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const EXAMPLE_PROMPTS = ['prompt_1', 'prompt_2', 'prompt_3', 'prompt_4'];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export const AIAssistant = () => {
  const { result, state, language, weather } = useApp();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Voice recognition
  const { isListening, transcript, isSupported, startListening, stopListening, resetTranscript } = useVoiceRecognition(language);

  // Update input when voice transcript changes
  useEffect(() => {
    if (transcript) {
      setInput(transcript);
      resetTranscript();
    }
  }, [transcript, resetTranscript]);

  // Simple template helper
  const format = (str: string, vars: Record<string, any>) => {
    let result = str;
    Object.entries(vars).forEach(([key, value]) => {
      // If the value is a known translation key (crop, season, etc.), translate it
      const translatedValue = t(value as any, language) !== value ? t(value as any, language) : value;
      result = result.replace(`{${key}}`, String(translatedValue));
    });
    return result;
  };

  useEffect(() => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: t('welcome_msg', language),
        timestamp: new Date()
      }
    ]);
  }, [language]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const generateResponse = (userInput: string) => {
    const input = userInput.toLowerCase();
    const topRanking = result.cropRankings[0];
    const topCrop = CROPS.find(c => c.id === topRanking.cropId);
    
    // Context-aware responses using weather and risk data
    if (input.includes('rainfall') || input.includes('rain') || input.includes('वर्षा') || input.includes('बारिश')) {
      const currentRain = weather.rainfall || state.forecastRain;
      return format(t('response_rainfall', language), {
        forecast: currentRain,
        relation: currentRain < state.histRain ? t('relation_below', language) : t('relation_above', language),
        hist: state.histRain,
        crop: topCrop?.id || 'crop'
      });
    }
    
    if (input.includes('why') || input.includes('क्यों') || input.includes('recommend')) {
      return format(t('response_why', language), {
        crop: topCrop?.id || 'wheat',
        resilience: topRanking.resilience,
        soil: state.soilType.toLowerCase() + '_soil',
        temp: state.tempShift
      });
    }

    if (input.includes('best crop') || input.includes('grow') || input.includes('सबसे अच्छी फसल') || input.includes('उगाएं')) {
      const top3 = result.cropRankings.slice(0, 3).map(r => r.cropId);
      return format(t('response_best', language), {
        district: state.districtId,
        c1: top3[0],
        c2: top3[1],
        c3: top3[2],
        score: Math.round(topRanking.finalScore)
      });
    }

    if (input.includes('weather') || input.includes('mausam') || input.includes('मौसम')) {
      return `Current weather: ${weather.temperature}°C, ${weather.condition}. ${weather.rainfall > 0 ? `Rainfall: ${weather.rainfall}mm.` : 'No rainfall.'} Based on this, ${topCrop?.name} is your best option with a risk score of ${result.riskScore}.`;
    }

    if (input.includes('risk') || input.includes('danger') || input.includes('जोखिम')) {
      return `Your current risk score is ${result.riskScore} (${result.riskLabel}). Rainfall deficit: ${result.rainfallDeficit}%, Temperature stress: ${result.tempStress}%. ${result.riskScore > 60 ? 'Consider drought-resistant crops.' : 'Conditions are favorable.'}`;
    }

    return t('response_default', language);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateResponse(input),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 overflow-hidden flex flex-col">
        <Header 
          title={t('assistant', language)} 
          subtitle={t('ai_assistant_desc', language)} 
        />

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 grid lg:grid-cols-12 gap-8 overflow-hidden"
        >
          {/* Left Side: Info & Prompts */}
          <motion.div variants={itemVariants} className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
                <Brain size={24} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">{t('ai_assistant_title', language)}</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-8">
                {t('ai_assistant_desc', language)}
              </p>

              <div className="space-y-3">
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">{t('example_prompts', language)}</p>
                {EXAMPLE_PROMPTS.map((key, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInput(t(key as any, language))}
                    className="w-full text-left p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 hover:border-primary hover:bg-primary/5 transition-all group flex items-center justify-between"
                  >
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-300 group-hover:text-primary">{t(key as any, language)}</span>
                    <ArrowRight size={16} className="text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-auto p-6 bg-primary/5 rounded-3xl border border-primary/10 flex items-start gap-4">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Sparkles size={18} />
              </div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                {t('ai_note', language)}
              </p>
            </div>
          </motion.div>

          {/* Right Side: Chat UI */}
          <motion.div variants={itemVariants} className="lg:col-span-8 flex flex-col bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
            {/* Chat Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                    <Bot size={24} />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
                </div>
                <div>
                  <h4 className="font-black text-slate-900 dark:text-white">{t('assistant_bot_name', language)}</h4>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">{t('online_ready', language)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                  <HelpCircle size={20} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-8 space-y-6 scroll-smooth"
            >
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={cn(
                      "flex gap-4 max-w-[80%]",
                      msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md",
                      msg.role === 'user' ? "bg-slate-900 text-white" : "bg-primary text-white"
                    )}>
                      {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                    </div>
                    <div className="space-y-1">
                      <div className={cn(
                        "p-4 rounded-2xl text-sm font-medium leading-relaxed shadow-sm",
                        msg.role === 'user' 
                          ? "bg-slate-900 text-white rounded-tr-none" 
                          : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-tl-none border border-slate-100 dark:border-slate-700"
                      )}>
                        {msg.content}
                      </div>
                      <p className={cn(
                        "text-[10px] font-bold text-slate-400 uppercase tracking-wider",
                        msg.role === 'user' ? "text-right" : ""
                      )}>
                        {msg.timestamp.toLocaleTimeString(language === 'hi' ? 'hi-IN' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-4"
                >
                  <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-md">
                    <Bot size={20} />
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl rounded-tl-none border border-slate-100 dark:border-slate-700 flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin text-primary" />
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('ai_thinking', language)}</span>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-6 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
              <div className="relative flex items-center gap-4">
                {/* Voice Button */}
                {isSupported && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={isListening ? stopListening : startListening}
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center transition-all shadow-lg",
                      isListening 
                        ? "bg-red-500 text-white animate-pulse" 
                        : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 hover:text-primary hover:border-primary"
                    )}
                    title={isListening ? t('listening', language) : t('voice_input', language)}
                  >
                    {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                  </motion.button>
                )}
                
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={isListening ? t('listening', language) : t('ask_anything', language)}
                  className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all pr-16 shadow-sm"
                  disabled={isListening}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping || isListening}
                  className="absolute right-2 w-12 h-12 bg-primary hover:bg-primary/90 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white rounded-xl flex items-center justify-center transition-all shadow-lg shadow-primary/20 active:scale-95"
                >
                  <Send size={20} />
                </button>
              </div>
              
              {isListening && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 flex items-center gap-2 text-xs font-bold text-red-500"
                >
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  {t('speak_now', language)}
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

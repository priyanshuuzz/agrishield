import React from 'react';
import { useApp } from '../store';
import { LayoutDashboard, FlaskConical, ShieldAlert, Map, Home, Settings, Plus, Info, TrendingUp, Sprout, Leaf, Flower2, Sparkles, AlertTriangle, Droplets, Thermometer, Layers, History, ArrowRight, ChevronRight, Satellite, ShieldCheck, Network, Brain, Play, TrendingDown, Flower, HelpCircle, User, LogOut, Bell, MessageSquare, Globe } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion } from 'motion/react';
import { t } from '../translations';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const LanguageSwitcher = () => {
  const { language, setLanguage } = useApp();
  
  return (
    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
      <button 
        onClick={() => setLanguage('hinglish')}
        className={cn(
          "px-3 py-1.5 rounded-lg text-[10px] font-black transition-all",
          language === 'hinglish' ? "bg-white dark:bg-slate-900 text-primary shadow-sm" : "text-slate-400 hover:text-slate-600"
        )}
      >
        Hinglish
      </button>
      <button 
        onClick={() => setLanguage('hi')}
        className={cn(
          "px-3 py-1.5 rounded-lg text-[10px] font-black transition-all",
          language === 'hi' ? "bg-white dark:bg-slate-900 text-primary shadow-sm" : "text-slate-400 hover:text-slate-600"
        )}
      >
        HI
      </button>
      <button 
        onClick={() => setLanguage('en')}
        className={cn(
          "px-3 py-1.5 rounded-lg text-[10px] font-black transition-all",
          language === 'en' ? "bg-white dark:bg-slate-900 text-primary shadow-sm" : "text-slate-400 hover:text-slate-600"
        )}
      >
        EN
      </button>
    </div>
  );
};

const navVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

const navItemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 }
};

export const Sidebar = () => {
  const { currentPage, setCurrentPage, language } = useApp();
  
  const navItems = [
    { id: 'dashboard', label: t('dashboard', language), icon: LayoutDashboard },
    { id: 'what-if', label: t('what_if', language), icon: FlaskConical },
    { id: 'resilience', label: t('resilience', language), icon: ShieldAlert },
    { id: 'districts', label: t('districts', language), icon: Map },
    { id: 'assistant', label: t('assistant', language), icon: MessageSquare },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col fixed h-full z-10 shadow-xl shadow-slate-200/50 dark:shadow-none">
      <div className="p-8 flex items-center gap-3 cursor-pointer group" onClick={() => setCurrentPage('landing')}>
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
          <Brain size={24} />
        </div>
        <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">AgriShield <span className="text-primary">AI</span></h1>
      </div>
      
      <motion.nav 
        variants={navVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 px-4 space-y-1.5"
      >
        <motion.button 
          variants={navItemVariants}
          onClick={() => setCurrentPage('landing')}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative overflow-hidden",
            currentPage === 'landing' 
              ? "bg-primary text-white shadow-lg shadow-primary/30" 
              : "text-slate-500 hover:text-primary hover:bg-primary/5 dark:hover:bg-primary/10"
          )}
        >
          <Home size={20} className={cn("transition-transform group-hover:scale-110", currentPage === 'landing' ? "text-white" : "text-slate-400 group-hover:text-primary")} />
          <span className="font-bold text-sm">{t('home', language)}</span>
          {currentPage === 'landing' && <motion.div layoutId="activeNav" className="absolute left-0 w-1 h-6 bg-white rounded-r-full" />}
        </motion.button>

        {navItems.map(item => (
          <motion.button
            key={item.id}
            variants={navItemVariants}
            onClick={() => setCurrentPage(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative overflow-hidden",
              currentPage === item.id 
                ? "bg-primary text-white shadow-lg shadow-primary/30" 
                : "text-slate-500 hover:text-primary hover:bg-primary/5 dark:hover:bg-primary/10"
            )}
          >
            <item.icon size={20} className={cn("transition-transform group-hover:scale-110", currentPage === item.id ? "text-white" : "text-slate-400 group-hover:text-primary")} />
            <span className="font-bold text-sm">{item.label}</span>
            {currentPage === item.id && <motion.div layoutId="activeNav" className="absolute left-0 w-1 h-6 bg-white rounded-r-full" />}
          </motion.button>
        ))}
      </motion.nav>

      <div className="p-6 space-y-6">
        <div className="px-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{t('language_label', language)}</p>
          <LanguageSwitcher />
        </div>

        <button 
          onClick={() => setCurrentPage('dashboard')}
          className="w-full bg-slate-900 dark:bg-white dark:text-slate-900 text-white py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-slate-900/20 dark:shadow-white/10"
        >
          <Plus size={18} />
          {t('new_analysis', language)}
        </button>

        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden">
            <img src="https://i.pravatar.cc/150?u=priyanshu" alt="User" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black text-slate-900 dark:text-white truncate">Priyanshu Ojha</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">{t('premium_plan', language)}</p>
          </div>
          <button className="text-slate-400 hover:text-red-500 transition-colors">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export const Header = ({ title, subtitle }: { title: string, subtitle: string }) => {
  const { language } = useApp();
  
  return (
    <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div>
        <div className="flex items-center gap-2 text-primary mb-1">
          <div className="w-1 h-4 bg-primary rounded-full"></div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">{t('agrishield_intelligence', language)}</span>
        </div>
        <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{title}</h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">{subtitle}</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm text-xs font-bold text-slate-500">
          <History size={16} className="text-primary" />
          <span>{t('updated', language)}: {new Date().toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>
        <button className="w-10 h-10 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 hover:text-primary hover:border-primary transition-all shadow-sm">
          <Bell size={20} />
        </button>
      </div>
    </div>
  );
};

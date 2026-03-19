import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../store';
import { Sidebar, Header, cn } from '../components/Common';
import { CROPS } from '../constants';
import { t } from '../translations';
import { ShieldAlert, Info, Thermometer, Droplets, History, Play, TrendingUp, TrendingDown, Sprout, ShieldCheck, ChevronRight, Sparkles, ArrowRight, Target, Zap, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

export const ResilienceAnalyzer = () => {
  const { state, language } = useApp();
  const [selectedCropId, setSelectedCropId] = useState(CROPS[0].id);
  const [showComparison, setShowComparison] = useState(false);
  const crop = CROPS.find(c => c.id === selectedCropId)!;

  // Dynamic resilience calculation based on current conditions
  const calculateResilience = (cropData: typeof crop) => {
    const baseScore = {
      rice: 70,
      wheat: 65,
      bajra: 80,
      soybean: 75,
      arhar: 78,
      cotton: 72,
      maize: 68,
      sugarcane: 60
    };

    const soilImpact = state.soilType.toLowerCase() === "loamy" ? 10 : 
                       state.soilType.toLowerCase() === "clayey" ? 5 : -5;
    
    const weatherImpact = (state.avgTemp > 35 ? -10 : 5) + 
                          (state.forecastRain < 500 ? -8 : 6);
    
    const cropSpecificBonus = (cropData.droughtResilience + cropData.rainResilience + cropData.tempResilience) / 30;

    return Math.min(100, Math.max(0, (baseScore[cropData.id as keyof typeof baseScore] || 70) + soilImpact + weatherImpact + cropSpecificBonus));
  };

  const resilienceScore = useMemo(() => calculateResilience(crop), [crop, state.soilType, state.avgTemp, state.forecastRain]);

  // Generate dynamic AI insight
  const generateInsight = (score: number) => {
    if (score > 80)
      return `Highly resilient crop under current climate conditions. ${crop.name} shows excellent adaptability to ${state.soilType} soil with ${state.avgTemp}°C temperature.`;
    if (score > 60)
      return `Moderately stable performance expected. Consider hybrid varieties of ${crop.name} to improve resilience in ${state.soilType} soil conditions.`;
    return `High climate risk detected for ${crop.name}. Current conditions (${state.avgTemp}°C, ${state.forecastRain}mm rainfall) may stress this crop. Consider switching to drought-resistant alternatives.`;
  };

  // Dynamic recommendation based on conditions
  const generateRecommendation = () => {
    if (resilienceScore < 60) {
      if (state.forecastRain < 500)
        return "Switch to drought-resistant crops like Bajra or Arhar for better yield security.";
      if (state.avgTemp > 35)
        return "Consider early sowing or heat-tolerant varieties to mitigate temperature stress.";
      return "Current conditions are challenging. Explore alternative crops with higher resilience scores.";
    }
    if (state.forecastRain < 500)
      return "Implement drip irrigation to maximize water efficiency for this crop.";
    if (state.avgTemp > 32)
      return "Monitor for heat stress. Consider shade nets or mulching techniques.";
    return "Conditions are favorable. Focus on optimizing nutrient management for maximum yield.";
  };

  const aiInsight = useMemo(() => generateInsight(resilienceScore), [resilienceScore, crop, state]);
  const recommendation = useMemo(() => generateRecommendation(), [resilienceScore, state]);

  // Comparative analysis for all crops
  const comparativeAnalysis = useMemo(() => {
    return CROPS.map(c => ({
      crop: c,
      score: calculateResilience(c),
      recommendation: calculateResilience(c) > 75 ? "Recommended" : calculateResilience(c) > 60 ? "Viable" : "High Risk"
    })).sort((a, b) => b.score - a.score);
  }, [state.soilType, state.avgTemp, state.forecastRain]);

  const resilienceMetrics = [
    { label: 'Rainfall Resilience', value: crop.rainResilience, icon: Droplets, color: 'from-blue-500 to-cyan-400', shadow: 'shadow-blue-500/30' },
    { label: 'Temperature Resilience', value: crop.tempResilience, icon: Thermometer, color: 'from-orange-500 to-amber-400', shadow: 'shadow-orange-500/30' },
    { label: 'Drought Resilience', value: crop.droughtResilience, icon: ShieldCheck, color: 'from-emerald-600 to-green-400', shadow: 'shadow-emerald-500/30' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <main className="ml-64 flex-1 p-10">
        <Header title={t('resilience_analyzer', language)} subtitle={t('resilience_analyzer_subtitle', language)} />

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-12 gap-8"
        >
          {/* Crop Selector - Sticky Sidebar within Main */}
          <section className="col-span-12 lg:col-span-4">
            <div className="sticky top-10 space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">{t('select_crop_variety', language)}</h3>
                <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-[8px] font-black text-slate-500 uppercase tracking-widest">{CROPS.length} {t('varieties_label', language)}</span>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {CROPS.map((c, idx) => (
                  <motion.button
                    variants={itemVariants}
                    key={c.id}
                    onClick={() => setSelectedCropId(c.id)}
                    whileHover={{ x: 8 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "p-5 rounded-2xl border text-left transition-all flex items-center justify-between group relative overflow-hidden",
                      selectedCropId === c.id 
                        ? "bg-white dark:bg-slate-900 border-primary shadow-2xl shadow-primary/10" 
                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-primary/50"
                    )}
                  >
                    {selectedCropId === c.id && (
                      <motion.div 
                        layoutId="active-indicator"
                        className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary z-10"
                      />
                    )}
                    <div className="flex items-center gap-4 relative z-10">
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500", 
                        selectedCropId === c.id ? "bg-primary text-white rotate-12 scale-110" : "bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:rotate-6"
                      )}>
                        <Sprout size={22} />
                      </div>
                      <div>
                        <p className={cn("font-black text-lg transition-colors", selectedCropId === c.id ? "text-primary" : "text-slate-700 dark:text-slate-300")}>{t(c.id as any, language)}</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t(c.type.toLowerCase() as any, language)} {t('variety_label', language)}</p>
                      </div>
                    </div>
                    <ChevronRight size={20} className={cn("transition-all relative z-10", selectedCropId === c.id ? "translate-x-1 text-primary opacity-100" : "opacity-0 group-hover:opacity-100 group-hover:translate-x-1 text-slate-300")} />
                  </motion.button>
                ))}
              </div>

              <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10 mt-8">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-1.5 bg-primary/20 rounded-lg text-primary">
                    <Info size={14} />
                  </div>
                  <span className="text-[10px] font-black uppercase text-primary tracking-widest">{t('analyzer_tip', language)}</span>
                </div>
                <p className="text-xs font-bold text-slate-600 dark:text-slate-400 leading-relaxed">
                  {t('analyzer_tip_desc', language)}
                </p>
              </div>
            </div>
          </section>

          {/* Resilience Profile */}
          <div className="col-span-12 lg:col-span-8 space-y-8">
            <AnimatePresence mode="wait">
              <motion.div 
                key={selectedCropId}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 p-10 relative overflow-hidden"
              >
                {/* Background Accent */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12 relative z-10">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center text-primary shadow-inner relative group">
                      <div className="absolute inset-0 bg-primary/20 rounded-[2rem] animate-ping opacity-20 group-hover:opacity-40" />
                      <ShieldAlert size={40} className="relative z-10" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 bg-primary/10 text-primary text-[8px] font-black uppercase tracking-widest rounded-full">{t('certified_profile', language)}</span>
                        <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[8px] font-black uppercase tracking-widest rounded-full">{t('high_resilience', language)}</span>
                      </div>
                      <h3 className="text-4xl font-black text-slate-900 dark:text-white">{t(crop.id as any, language)}</h3>
                      <p className="text-slate-500 font-bold mt-1">{t('genetic_adaptability', language)}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex flex-col items-center gap-1 bg-slate-50 dark:bg-slate-800 px-8 py-4 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('resilience_index_label', language)}</span>
                      <motion.span 
                        key={resilienceScore}
                        initial={{ scale: 1.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={cn("text-4xl font-black", 
                          resilienceScore > 80 ? "text-emerald-500" : 
                          resilienceScore > 60 ? "text-primary" : "text-red-500"
                        )}
                      >
                        {Math.round(resilienceScore)}
                      </motion.span>
                    </div>
                  </div>
                </div>

                <div className="space-y-12 relative z-10">
                  {resilienceMetrics.map((metric, idx) => (
                    <div key={idx} className="group">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-3">
                          <div className={cn("p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:text-primary group-hover:bg-primary/5 transition-all duration-300")}>
                            <metric.icon size={20} />
                          </div>
                          <div>
                            <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest block">{t(metric.label.toLowerCase().replace(/ /g, '_') as any, language)}</span>
                            <span className="text-[10px] font-bold text-slate-400">{t('field_trials_note', language)}</span>
                          </div>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <motion.span 
                            key={metric.value}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-2xl font-black text-slate-900 dark:text-white"
                          >
                            {metric.value}
                          </motion.span>
                          <span className="text-xs font-black text-slate-400">{t('percent', language)}</span>
                        </div>
                      </div>
                      <div className="h-6 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-1.5 shadow-inner relative">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${metric.value}%` }}
                          transition={{ duration: 1.5, ease: [0.34, 1.56, 0.64, 1], delay: 0.2 + idx * 0.1 }}
                          className={cn("h-full rounded-full shadow-lg bg-gradient-to-r relative", metric.color, metric.shadow)} 
                        >
                          <div className="absolute inset-0 bg-white/20 animate-pulse" />
                        </motion.div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                  <motion.div 
                    whileHover={{ y: -6, scale: 1.02 }}
                    className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-700 relative overflow-hidden group transition-all duration-500"
                  >
                    <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity group-hover:rotate-12 duration-700">
                      <Sparkles size={100} />
                    </div>
                    <h4 className="text-[10px] font-black uppercase text-slate-400 mb-4 flex items-center gap-2 tracking-widest">
                      <div className="p-1 bg-primary/20 rounded-md">
                        <Sparkles size={12} className="text-primary" />
                      </div>
                      {t('key_strength', language)}
                    </h4>
                    <p className="text-base font-bold leading-relaxed text-slate-600 dark:text-slate-300">
                      {crop.droughtResilience > 80 
                        ? t('strength_drought', language)
                        : crop.tempResilience > 80 
                        ? t('strength_heat', language)
                        : t('strength_balanced', language)}
                    </p>
                  </motion.div>
                  <motion.div 
                    whileHover={{ y: -6, scale: 1.02 }}
                    className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-700 relative overflow-hidden group transition-all duration-500"
                  >
                    <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity group-hover:rotate-12 duration-700">
                      <Target size={100} />
                    </div>
                    <h4 className="text-[10px] font-black uppercase text-slate-400 mb-4 flex items-center gap-2 tracking-widest">
                      <div className="p-1 bg-primary/20 rounded-md">
                        <Target size={12} className="text-primary" />
                      </div>
                      {t('soil_compatibility', language)}
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(crop.soilCompatibility).map(([soil, score]) => (
                        <div key={soil} className="flex flex-col gap-1">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black text-slate-500 uppercase">{t(soil.toLowerCase() as any, language)}</span>
                            <span className="text-[10px] font-black text-primary">{score}{t('percent', language)}</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${score}%` }}
                              transition={{ duration: 1, delay: 0.5 }}
                              className="h-full bg-primary rounded-full"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Comparison Tool Preview */}
            <motion.div 
              variants={itemVariants}
              className="bg-slate-900 dark:bg-slate-950 text-white rounded-[3rem] p-12 relative overflow-hidden group shadow-2xl shadow-slate-900/40"
            >
              <div className="absolute -right-12 -top-12 p-8 opacity-10 group-hover:scale-110 group-hover:rotate-12 transition-all duration-1000">
                <ShieldCheck size={280} />
              </div>
              <div className="absolute left-0 bottom-0 w-full h-1 bg-gradient-to-r from-primary via-emerald-500 to-primary" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2.5 bg-primary/20 rounded-2xl backdrop-blur-md border border-white/10">
                    <Zap className="text-primary" size={24} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{t('ai_resilience_insights', language)}</span>
                </div>
                <h3 className="text-4xl font-black mb-6 leading-tight">{t('ai_climate_resilience', language)}</h3>
                <p className="text-slate-400 font-bold text-xl leading-relaxed mb-8">
                  {aiInsight}
                </p>
                <div className="p-6 bg-white/5 rounded-2xl border border-white/10 mb-8">
                  <h4 className="text-sm font-black text-primary mb-3 uppercase tracking-widest">{t('recommendation', language)}</h4>
                  <p className="text-slate-300 font-medium leading-relaxed">
                    {recommendation}
                  </p>
                </div>
                <motion.button 
                  whileHover={{ x: 10 }}
                  onClick={() => setShowComparison(!showComparison)}
                  className="flex items-center gap-4 text-primary font-black text-xl group transition-all"
                >
                  {showComparison ? t('hide_comparison', language) : t('run_comparative_analysis', language)} 
                  <div className="w-12 h-12 rounded-full border border-primary/30 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                    {showComparison ? <ChevronRight size={24} className="rotate-90" /> : <ArrowRight size={24} />}
                  </div>
                </motion.button>
              </div>
            </motion.div>

            {/* Comparative Analysis Table */}
            <AnimatePresence>
              {showComparison && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 overflow-hidden"
                >
                  <div className="p-10">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="p-2.5 bg-primary/10 rounded-xl">
                        <BarChart3 className="text-primary" size={24} />
                      </div>
                      <h3 className="text-2xl font-black">{t('comparative_analysis', language)}</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-slate-200 dark:border-slate-800">
                            <th className="text-left py-4 px-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">{t('crop', language)}</th>
                            <th className="text-center py-4 px-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">{t('resilience_score', language)}</th>
                            <th className="text-center py-4 px-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">{t('status', language)}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {comparativeAnalysis.map((item, idx) => (
                            <motion.tr
                              key={item.crop.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.05 }}
                              className={cn(
                                "border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer",
                                item.crop.id === selectedCropId && "bg-primary/5"
                              )}
                              onClick={() => setSelectedCropId(item.crop.id)}
                            >
                              <td className="py-5 px-6">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center">
                                    <Sprout size={20} className="text-primary" />
                                  </div>
                                  <div>
                                    <p className="font-black text-slate-900 dark:text-white">{t(item.crop.id as any, language)}</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase">{t(item.crop.type.toLowerCase() as any, language)}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-5 px-6 text-center">
                                <span className={cn("text-2xl font-black",
                                  item.score > 80 ? "text-emerald-500" :
                                  item.score > 60 ? "text-primary" : "text-red-500"
                                )}>
                                  {Math.round(item.score)}
                                </span>
                              </td>
                              <td className="py-5 px-6 text-center">
                                <span className={cn("px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest",
                                  item.recommendation === "Recommended" ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" :
                                  item.recommendation === "Viable" ? "bg-primary/10 text-primary" :
                                  "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                                )}>
                                  {item.recommendation}
                                </span>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

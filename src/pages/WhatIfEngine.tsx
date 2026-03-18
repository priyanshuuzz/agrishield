import React from 'react';
import { useApp } from '../store';
import { Sidebar, Header, cn } from '../components/Common';
import { CROPS } from '../constants';
import { t } from '../translations';
import { getRiskMetadata, computeRisk, rankCrops } from '../logic';
import { FlaskConical, Info, Thermometer, Droplets, History, Play, TrendingUp, TrendingDown, Sprout, Sparkles, Zap, ShieldAlert, ChevronRight } from 'lucide-react';
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

export const WhatIfEngine = () => {
  const { state, updateState, language } = useApp();
  
  // Compute simulated results on the fly
  const simulatedRisk = computeRisk(state);
  const simulatedRankings = rankCrops(state);
  const riskMeta = getRiskMetadata(simulatedRisk);

  const baselineState = { ...state, rainfallVariance: 0, tempShift: 0, monsoonDelayOverride: state.monsoonDelay };
  const baselineRisk = computeRisk(baselineState);
  const baselineRankings = rankCrops(baselineState);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <main className="ml-64 flex-1 p-10">
        <Header 
          title={t('what_if_engine', language)} 
          subtitle={t('what_if_subtitle', language)} 
        />

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-12 gap-8"
        >
          {/* Simulation Controls */}
          <motion.section 
            variants={itemVariants}
            className="col-span-12 lg:col-span-4 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 p-10 sticky top-10 h-fit"
          >
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-2xl font-black flex items-center gap-3">
                <div className="p-2.5 bg-primary/10 rounded-xl">
                  <FlaskConical className="text-primary" size={24} />
                </div>
                {t('stress_controls', language)}
              </h3>
              <div className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-[10px] font-black uppercase tracking-widest">
                {t('active_simulation', language)}
              </div>
            </div>
            
            <div className="space-y-12">
              {/* Rainfall Variance */}
              <div className="group">
                <div className="flex justify-between items-center mb-5">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2 tracking-[0.2em]">
                      <Droplets size={14} className="text-primary" />
                      {t('rainfall_variance', language)}
                    </label>
                    <span className="text-[10px] font-bold text-slate-300 italic">{t('simulate_drought_flood', language)}</span>
                  </div>
                  <motion.div 
                    key={state.rainfallVariance}
                    initial={{ scale: 1.2, color: '#10b981' }}
                    animate={{ scale: 1, color: state.rainfallVariance < 0 ? '#ef4444' : '#10b981' }}
                    className="text-xl font-black"
                  >
                    {state.rainfallVariance > 0 ? '↑' : state.rainfallVariance < 0 ? '↓' : ''} {Math.abs(state.rainfallVariance)}%
                  </motion.div>
                </div>
                <input 
                  type="range" 
                  min="-50" 
                  max="50" 
                  value={state.rainfallVariance}
                  onChange={(e) => updateState({ rainfallVariance: Number(e.target.value) })}
                  className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-4 font-black uppercase tracking-tighter">
                  <span className="text-red-500">{t('severe_drought', language)}</span>
                  <span>{t('normal', language)}</span>
                  <span className="text-primary">{t('excessive_rain', language)}</span>
                </div>
              </div>

              {/* Temperature Shift */}
              <div className="group">
                <div className="flex justify-between items-center mb-5">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2 tracking-[0.2em]">
                      <Thermometer size={14} className="text-orange-500" />
                      {t('temperature_shift', language)}
                    </label>
                    <span className="text-[10px] font-bold text-slate-300 italic">{t('simulate_heatwaves', language)}</span>
                  </div>
                  <motion.div 
                    key={state.tempShift}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    className={cn("text-xl font-black", state.tempShift > 2 ? "text-red-500" : "text-primary")}
                  >
                    {state.tempShift > 0 ? '+' : ''}{state.tempShift}°C
                  </motion.div>
                </div>
                <input 
                  type="range" 
                  min="-5" 
                  max="10" 
                  step="0.5"
                  value={state.tempShift}
                  onChange={(e) => updateState({ tempShift: Number(e.target.value) })}
                  className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-orange-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-4 font-black uppercase tracking-tighter">
                  <span>{t('cooler', language)}</span>
                  <span>{t('normal', language)}</span>
                  <span className="text-red-500">{t('extreme_heat', language)}</span>
                </div>
              </div>

              {/* Monsoon Delay */}
              <div className="group">
                <div className="flex justify-between items-center mb-5">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2 tracking-[0.2em]">
                      <History size={14} className="text-indigo-500" />
                      {t('monsoon_timing', language)}
                    </label>
                    <span className="text-[10px] font-bold text-slate-300 italic">{t('impact_sowing_window', language)}</span>
                  </div>
                  <motion.div 
                    key={state.monsoonDelayOverride}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    className="text-xl font-black text-primary"
                  >
                    {state.monsoonDelayOverride} {t('days_late', language)}
                  </motion.div>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="45" 
                  value={state.monsoonDelayOverride}
                  onChange={(e) => updateState({ monsoonDelayOverride: Number(e.target.value) })}
                  className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-indigo-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-4 font-black uppercase tracking-tighter">
                  <span className="text-emerald-500">{t('on_time', language)}</span>
                  <span className="text-red-500">{t('extreme_delay', language)}</span>
                </div>
              </div>

              <div className="pt-10 border-t border-slate-100 dark:border-slate-800">
                <div className="bg-primary/5 dark:bg-primary/10 p-6 rounded-[2rem] flex items-start gap-5 border border-primary/10">
                  <div className="p-2 bg-primary/20 rounded-xl text-primary">
                    <Info size={20} />
                  </div>
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-400 leading-relaxed">
                    {t('simulation_info_desc', language)}
                  </p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Simulation Results */}
          <div className="col-span-12 lg:col-span-8 space-y-10">
            {/* Comparison View */}
            <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 p-10">
              <div className="flex items-center justify-between mb-12">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">{t('before_vs_after', language)}</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('baseline', language)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('simulated', language)}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                {/* Visual Risk Comparison */}
                <div className="relative aspect-square flex items-center justify-center">
                  {/* Outer Ring (Simulated) */}
                  <div className="absolute inset-0 rounded-full border-[32px] border-slate-50 dark:border-slate-800"></div>
                  <motion.div 
                    initial={{ rotate: 0 }}
                    animate={{ rotate: (simulatedRisk / 100) * 360 }}
                    transition={{ duration: 1.5, ease: "backOut" }}
                    className={cn("absolute inset-0 rounded-full border-[32px] border-transparent border-t-current transition-colors duration-1000", riskMeta.color)}
                  ></motion.div>
                  
                  {/* Inner Ring (Baseline) */}
                  <div className="absolute inset-16 rounded-full border-[24px] border-slate-50 dark:border-slate-800"></div>
                  <motion.div 
                    initial={{ rotate: 0 }}
                    animate={{ rotate: (baselineRisk / 100) * 360 }}
                    className="absolute inset-16 rounded-full border-[24px] border-transparent border-t-slate-300"
                  ></motion.div>

                  <div className="flex flex-col items-center z-10">
                    <motion.span 
                      key={simulatedRisk}
                      initial={{ scale: 1.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={cn("text-7xl font-black tracking-tighter", riskMeta.color)}
                    >
                      {simulatedRisk}%
                    </motion.span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">{t('simulated_risk', language)}</span>
                  </div>
                </div>

                {/* Impact Insights */}
                <div className="space-y-8">
                  <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('risk_variance', language)}</span>
                      <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-xl font-black text-sm", simulatedRisk > baselineRisk ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600")}>
                        {simulatedRisk > baselineRisk ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                        {simulatedRisk > baselineRisk ? '+' : ''}{simulatedRisk - baselineRisk}%
                      </div>
                    </div>
                    <p className="text-sm font-bold text-slate-600 dark:text-slate-300 leading-relaxed">
                      {simulatedRisk > baselineRisk 
                        ? t('risk_increase_desc', language)
                        : t('risk_stable_desc', language)}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">{t('baseline', language)}</span>
                      <p className="text-2xl font-black text-slate-400">{baselineRisk}{t('percent', language)}</p>
                    </div>
                    <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">{t('simulated', language)}</span>
                      <p className={cn("text-2xl font-black", riskMeta.color)}>{simulatedRisk}{t('percent', language)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* AI Strategy & Ranking */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Strategy Card */}
              <motion.div variants={itemVariants} className="bg-slate-900 dark:bg-slate-950 text-white rounded-[2.5rem] p-10 relative overflow-hidden group shadow-2xl shadow-slate-900/40">
                <div className="absolute -right-10 -top-10 w-64 h-64 bg-primary/20 rounded-full blur-[80px] group-hover:scale-125 transition-transform duration-1000"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-2.5 bg-primary/20 rounded-xl backdrop-blur-xl border border-white/10">
                      <Sparkles className="text-primary" size={24} />
                    </div>
                    <span className="text-white/60 font-black text-[10px] uppercase tracking-[0.3em]">{t('ai_strategy_recommendation', language)}</span>
                  </div>

                  <motion.h4 
                    key={simulatedRisk > 70 ? 'defensive' : 'yield'}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-4xl font-black mb-6 leading-tight tracking-tighter"
                  >
                    {simulatedRisk > 70 ? t('adopt_defensive_strategy', language) : t('maximize_yield_potential', language)}
                  </motion.h4>
                  
                  <p className="text-slate-400 font-bold text-lg leading-relaxed mb-10">
                    {simulatedRisk > 70 
                      ? t('defensive_strategy_desc', language).replace('{crop}', t(simulatedRankings[0].cropId as any, language))
                      : t('yield_strategy_desc', language).replace('{crop}', t(simulatedRankings[0].cropId as any, language))}
                  </p>

                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-primary py-5 rounded-2xl font-black text-lg shadow-2xl shadow-primary/30 hover:bg-primary/90 transition-all flex items-center justify-center gap-3"
                  >
                    <Zap size={22} />
                    {t('apply_strategy', language)}
                  </motion.button>
                </div>
              </motion.div>

              {/* Dynamic Crop Ranking */}
              <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 p-10">
                <h3 className="text-xl font-black mb-8 flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-xl text-primary">
                    <TrendingUp size={20} />
                  </div>
                  {t('simulated_rankings', language)}
                </h3>
                <div className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {simulatedRankings.slice(0, 5).map((rank, idx) => {
                      const crop = CROPS.find(c => c.id === rank.cropId)!;
                      const baselineRank = baselineRankings.find(r => r.cropId === rank.cropId)!;
                      const impact = ((rank.yield - baselineRank.yield) / baselineRank.yield) * 100;

                      return (
                        <motion.div 
                          layout
                          key={rank.cropId}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.4, delay: idx * 0.05 }}
                          className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 group hover:border-primary transition-all"
                        >
                          <div className="flex items-center gap-4">
                            <span className="text-xs font-black text-slate-300 w-5">{idx + 1}</span>
                            <div>
                              <p className="font-black text-slate-900 dark:text-white">{t(crop.id as any, language)}</p>
                              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{t(crop.type.toLowerCase() as any, language)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="text-right">
                              <p className="text-lg font-black text-slate-900 dark:text-white">{rank.yield} <span className="text-[10px] text-slate-400">{t('tha', language)}</span></p>
                              <p className={cn("text-[10px] font-black", impact >= 0 ? "text-emerald-500" : "text-red-500")}>
                                {impact > 0 ? '+' : ''}{impact.toFixed(1)}{t('percent', language)}
                              </p>
                            </div>
                            <ChevronRight size={18} className="text-slate-300 group-hover:text-primary transition-all group-hover:translate-x-1" />
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

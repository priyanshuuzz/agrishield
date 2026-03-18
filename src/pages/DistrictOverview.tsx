import React from 'react';
import { useApp } from '../store';
import { Sidebar, Header, cn } from '../components/Common';
import { t } from '../translations';
import { DISTRICTS } from '../constants';
import { computeRisk, getRiskMetadata } from '../logic';
import { Map, LayoutGrid, TrendingUp, TrendingDown, Info, ShieldAlert, ChevronRight, Satellite, Globe, Target, Activity, Zap, ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
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

export const DistrictOverview = () => {
  const { state, updateState, setCurrentPage, language } = useApp();

  const districtStats = DISTRICTS.map(d => {
    const dState = { ...state, districtId: d.id, histRain: d.baseRainfall, forecastRain: d.baseRainfall * 0.85, avgTemp: d.baseTemp };
    const risk = computeRisk(dState);
    const meta = getRiskMetadata(risk);
    return { ...d, risk, meta };
  }).sort((a, b) => b.risk - a.risk);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <main className="ml-64 flex-1 p-10">
        <Header title={t('district_monitoring', language)} subtitle={t('district_monitoring_subtitle', language)} />

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-12 gap-8"
        >
          {/* Summary Cards */}
          <div className="col-span-12 grid grid-cols-1 md:grid-cols-4 gap-6">
            <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity group-hover:rotate-12 duration-700">
                <Globe size={100} />
              </div>
              <p className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-[0.2em]">{t('monitored_districts', language)}</p>
              <h4 className="text-5xl font-black text-slate-900 dark:text-white">{DISTRICTS.length}</h4>
              <div className="mt-6 flex items-center gap-2 text-[10px] text-primary font-black uppercase tracking-widest bg-primary/5 w-fit px-3 py-1.5 rounded-full border border-primary/10">
                <Satellite size={14} /> {t('coverage_stat', language)}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity group-hover:rotate-12 duration-700">
                <Activity size={100} />
              </div>
              <p className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-[0.2em]">{t('avg_risk_score', language)}</p>
              <h4 className="text-5xl font-black text-slate-900 dark:text-white">
                {Math.round(districtStats.reduce((acc, d) => acc + d.risk, 0) / DISTRICTS.length)}
              </h4>
              <div className="mt-6 flex items-center gap-2 text-[10px] text-orange-500 font-black uppercase tracking-widest bg-orange-500/5 w-fit px-3 py-1.5 rounded-full border border-orange-500/10">
                <TrendingUp size={14} /> {t('vs_last_week', language)}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity group-hover:rotate-12 duration-700">
                <ShieldAlert size={100} />
              </div>
              <p className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-[0.2em]">{t('critical_zones', language)}</p>
              <h4 className="text-5xl font-black text-red-500">
                {districtStats.filter(d => d.risk > 70).length}
              </h4>
              <div className="mt-6 flex items-center gap-2 text-[10px] text-red-500 font-black uppercase tracking-widest bg-red-500/5 w-fit px-3 py-1.5 rounded-full border border-red-500/10">
                {t('immediate_action', language)}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-primary p-8 rounded-[2.5rem] shadow-2xl shadow-primary/30 text-white relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 opacity-20 group-hover:opacity-30 transition-opacity group-hover:rotate-12 duration-700">
                <Zap size={100} />
              </div>
              <p className="text-[10px] font-black uppercase text-white/60 mb-2 tracking-[0.2em]">{t('yield_protection', language)}</p>
              <h4 className="text-5xl font-black">82{t('percent', language)}</h4>
              <div className="mt-6 flex items-center gap-2 text-[10px] text-white/80 font-black uppercase tracking-widest bg-white/10 w-fit px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-sm">
                <ShieldAlert size={14} /> {t('shield_active', language)}
              </div>
            </motion.div>
          </div>

          {/* Heatmap Placeholder / List */}
          <motion.section variants={itemVariants} className="col-span-12 lg:col-span-8 bg-white dark:bg-slate-900 rounded-[3rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-10 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50 backdrop-blur-md">
              <div>
                <h3 className="text-2xl font-black flex items-center gap-3">
                  <div className="p-2.5 bg-primary/10 rounded-2xl text-primary">
                    <Map size={24} />
                  </div>
                  {t('regional_heatmap', language)}
                </h3>
                <p className="text-xs font-bold text-slate-400 mt-1 ml-12">{t('heatmap_desc', language)}</p>
              </div>
              <div className="flex gap-4">
                <button className="p-4 bg-white dark:bg-slate-700 shadow-sm border border-slate-200 dark:border-slate-600 rounded-2xl text-primary transition-all hover:shadow-lg hover:scale-105 active:scale-95"><LayoutGrid size={20} /></button>
                <button className="p-4 bg-white dark:bg-slate-700 shadow-sm border border-slate-200 dark:border-slate-600 rounded-2xl text-slate-400 transition-all hover:shadow-lg hover:scale-105 active:scale-95"><Map size={20} /></button>
              </div>
            </div>
            <div className="relative aspect-[16/9] bg-slate-950 flex items-center justify-center group">
              {/* Simulated Map Background */}
              <div className="absolute inset-0 opacity-40">
                <img 
                  alt="Regional Map" 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" 
                  src="https://picsum.photos/seed/agri-satellite/1600/900"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/50" />
              </div>
              
              {/* Map Hotspots */}
              <div className="absolute inset-0 p-12 grid grid-cols-4 gap-8 relative z-10">
                {districtStats.slice(0, 12).map((d, idx) => (
                  <motion.div 
                    key={d.id} 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + idx * 0.04, type: "spring", stiffness: 100 }}
                    whileHover={{ scale: 1.05, y: -8 }}
                    className={cn(
                      "rounded-3xl p-6 border-2 shadow-2xl backdrop-blur-xl flex flex-col justify-between cursor-pointer transition-all duration-500 group/card",
                      d.risk > 70 
                        ? "bg-red-500/10 border-red-500/40 shadow-red-500/20" 
                        : d.risk > 40 
                        ? "bg-orange-500/10 border-orange-500/40 shadow-orange-500/20" 
                        : "bg-emerald-500/10 border-emerald-500/40 shadow-emerald-500/20"
                    )}
                    onClick={() => {
                      updateState({ districtId: d.id });
                      setCurrentPage('dashboard');
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-black uppercase truncate text-white/60 tracking-[0.2em] group-hover/card:text-white transition-colors">{t(d.id as any, language)}</span>
                      <div className={cn(
                        "w-3 h-3 rounded-full shadow-[0_0_15px_rgba(0,0,0,0.5)]", 
                        d.risk > 70 ? "bg-red-500 animate-ping" : d.risk > 40 ? "bg-orange-500" : "bg-emerald-500"
                      )} />
                    </div>
                    <div className="flex items-end justify-between mt-4">
                      <div className="flex flex-col">
                        <span className={cn("text-3xl font-black leading-none", d.meta.color)}>{d.risk}</span>
                        <span className="text-[8px] font-black uppercase text-white/40 tracking-widest mt-1">{t('risk_index_label', language)}</span>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 group-hover/card:bg-primary group-hover/card:text-white group-hover/card:border-primary transition-all">
                        <ArrowRight size={18} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Map Overlay Controls */}
              <div className="absolute bottom-8 left-8 flex items-center gap-4 z-20">
                <div className="px-4 py-2 bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-xl flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">{t('live_feed', language)}</span>
                </div>
                <div className="px-4 py-2 bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-xl flex items-center gap-3">
                  <Satellite size={14} className="text-primary" />
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">{t('satellite_data', language)}</span>
                </div>
              </div>
            </div>
          </motion.section>

          {/* District Ranking */}
          <motion.section variants={itemVariants} className="col-span-12 lg:col-span-4 bg-white dark:bg-slate-900 rounded-[3rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 p-10 flex flex-col">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-2xl font-black flex items-center gap-3">
                <div className="p-2.5 bg-orange-500/10 rounded-2xl text-orange-500">
                  <Target size={24} />
                </div>
                {t('district_rankings', language)}
              </h3>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('sorted_by_risk', language)}</span>
            </div>
            <div className="space-y-4 flex-1">
              {districtStats.slice(0, 7).map((d, idx) => (
                <motion.div 
                  key={d.id} 
                  whileHover={{ x: 8, backgroundColor: "rgba(var(--primary-rgb), 0.05)" }}
                  className="flex items-center justify-between p-5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer group border border-transparent hover:border-slate-100 dark:hover:border-slate-700"
                >
                  <div className="flex items-center gap-5">
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black",
                      idx === 0 ? "bg-red-500 text-white shadow-lg shadow-red-500/20" : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                    )}>
                      {idx + 1}
                    </div>
                    <div>
                      <p className="text-base font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors">{t(d.id as any, language)}</p>
                      <p className="text-[10px] text-slate-400 uppercase font-black tracking-[0.15em]">{t(d.state.toLowerCase() as any, language)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-5">
                    <div className="text-right">
                      <span className={cn("text-xl font-black block", d.meta.color)}>{d.risk}</span>
                      <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest">{t('score_label', language)}</span>
                    </div>
                    <div className="w-8 h-8 rounded-full border border-slate-100 dark:border-slate-700 flex items-center justify-center group-hover:border-primary/30 group-hover:bg-primary/5 transition-all">
                      <ChevronRight size={18} className="text-slate-300 group-hover:text-primary transition-all group-hover:translate-x-1" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <button className="w-full mt-10 py-5 bg-slate-900 dark:bg-slate-800 text-white border border-slate-800 dark:border-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary hover:border-primary transition-all shadow-xl shadow-slate-900/20 group">
              {t('view_all_districts', language)} <ArrowRight size={14} className="inline-block ml-2 group-hover:translate-x-2 transition-transform" />
            </button>
          </motion.section>

          {/* Yield Risk Analysis Chart Placeholder */}
          <motion.div variants={itemVariants} className="col-span-12 bg-white dark:bg-slate-900 rounded-[3rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 p-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
              <div>
                <h3 className="text-2xl font-black flex items-center gap-3">
                  <div className="p-2.5 bg-primary/10 rounded-2xl text-primary">
                    <TrendingUp size={24} />
                  </div>
                  {t('yield_risk_analysis', language)}
                </h3>
                <p className="text-xs font-bold text-slate-400 mt-1 ml-12">{t('yield_risk_desc', language)}</p>
              </div>
              <div className="flex flex-wrap items-center gap-8 bg-slate-50 dark:bg-slate-800/50 px-8 py-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]"></span>
                  <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{t('predicted_yield', language)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></span>
                  <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{t('risk_exposure', language)}</span>
                </div>
              </div>
            </div>
            <div className="flex items-end gap-4 h-80 px-4">
              {districtStats.map((d, idx) => (
                <div key={d.id} className="flex-1 flex flex-col items-center gap-4 group relative h-full">
                  <div className="w-full h-full flex flex-col justify-end gap-1">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${70 + Math.random() * 30}%` }}
                      transition={{ duration: 1.2, delay: 0.6 + idx * 0.04, ease: [0.34, 1.56, 0.64, 1] }}
                      className="w-full bg-primary/10 rounded-t-2xl relative overflow-hidden group-hover:bg-primary/20 transition-all duration-500"
                    >
                      {/* Yield Bar */}
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${40 + Math.random() * 40}%` }}
                        transition={{ duration: 1.4, delay: 0.8 + idx * 0.04 }}
                        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary to-emerald-400 rounded-t-2xl shadow-lg shadow-primary/20"
                      >
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </motion.div>
                      
                      {/* Risk Overlay Bar */}
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${d.risk}%` }}
                        transition={{ duration: 1.6, delay: 1 + idx * 0.04 }}
                        className="absolute bottom-0 left-[20%] right-[20%] bg-red-500/40 rounded-t-xl backdrop-blur-[2px] border-x border-t border-red-500/20"
                      />
                    </motion.div>
                  </div>
                  
                  {/* Tooltip */}
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl shadow-2xl z-20 pointer-events-none whitespace-nowrap border border-white/10">
                    {t(d.id as any, language)}: {d.risk} {t('risk_index_label', language)}
                  </div>
                  
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest truncate w-full text-center group-hover:text-primary transition-colors">
                    {t(d.id as any, language).substring(0, 3)}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Action Footer */}
          <motion.div variants={itemVariants} className="col-span-12 bg-slate-900 dark:bg-slate-950 rounded-[3.5rem] p-16 text-white relative overflow-hidden group shadow-2xl shadow-slate-900/40">
            <div className="absolute -right-20 -top-20 opacity-10 group-hover:scale-110 group-hover:rotate-12 transition-all duration-1000">
              <Satellite size={400} />
            </div>
            <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-primary via-emerald-500 to-primary" />
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="max-w-3xl">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-primary/20 rounded-2xl backdrop-blur-md border border-white/10">
                    <Sparkles className="text-primary" size={24} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">{t('satellite_intelligence', language)}</span>
                </div>
                <h3 className="text-5xl font-black mb-8 leading-tight">{t('generate_report', language)}</h3>
                <p className="text-slate-400 font-bold text-2xl leading-relaxed">
                  {t('generate_report_desc', language)}
                </p>
              </div>
              <motion.button 
                whileHover={{ scale: 1.05, x: 10 }}
                whileTap={{ scale: 0.95 }}
                className="px-12 py-6 bg-primary text-white font-black text-xl rounded-2xl shadow-2xl shadow-primary/40 flex items-center gap-6 group whitespace-nowrap"
              >
                {t('export_report', language)} 
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-primary transition-all">
                  <ArrowRight size={20} />
                </div>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

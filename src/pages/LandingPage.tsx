import React from 'react';
import { useApp } from '../store';
import { ArrowRight, CloudOff, Scale, LineChart, ChevronRight, Satellite, Droplets, LayoutGrid, ShieldCheck, Brain, Play, ShieldAlert, Sparkles, Zap, CheckCircle2, TrendingUp, Bot, User, Send, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';
import { t } from '../translations';
import { LanguageSwitcher } from '../components/Common';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

export const LandingPage = () => {
  const { currentPage, setCurrentPage, language } = useApp();

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-sans selection:bg-primary/30">
      <header className="sticky top-0 z-50 w-full bg-background-light/70 dark:bg-background-dark/70 backdrop-blur-xl border-b border-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setCurrentPage('landing')}>
              <div className="p-2 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                <Brain className="text-primary" size={28} />
              </div>
              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-slate-100">AgriShield <span className="text-primary">AI</span></span>
            </div>
            <nav className="hidden md:flex items-center gap-10">
              {[
                { id: 'landing', label: t('home', language) },
                { id: 'dashboard', label: t('dashboard', language) },
                { id: 'what-if', label: t('what_if', language) },
                { id: 'resilience', label: t('resilience', language) },
                { id: 'districts', label: t('districts', language) },
                { id: 'assistant', label: t('assistant', language) }
              ].map((item) => (
                <button 
                  key={item.id}
                  onClick={() => setCurrentPage(item.id as any)} 
                  className={`text-sm font-bold tracking-wide transition-all relative py-2 group ${currentPage === item.id ? 'text-primary' : 'text-slate-500 hover:text-primary'}`}
                >
                  {item.label}
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 ${currentPage === item.id ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                </button>
              ))}
            </nav>
            <div className="flex items-center gap-6">
              <div className="hidden sm:block">
                <LanguageSwitcher />
              </div>
              <button onClick={() => setCurrentPage('dashboard')} className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-primary/20 hover:scale-105 active:scale-95">
                {t('get_started', language)}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative pt-24 pb-32 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30 dark:opacity-10 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/40 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-400/30 rounded-full blur-[120px]"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-10"
              >
                <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest w-fit border border-primary/20">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  {t('v2_live', language)}
                </motion.div>
                <motion.h1 variants={itemVariants} className="text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight text-slate-900 dark:text-slate-100">
                  {t('hero_title', language)}
                </motion.h1>
                <motion.p variants={itemVariants} className="text-xl text-slate-500 dark:text-slate-400 max-w-lg leading-relaxed font-medium">
                  {t('hero_subtitle', language)}
                </motion.p>
                <motion.div variants={itemVariants} className="flex flex-wrap gap-6 mt-4">
                  <button 
                    onClick={() => setCurrentPage('dashboard')} 
                    className="group bg-primary hover:bg-primary/90 text-white px-10 py-5 rounded-2xl font-black text-lg shadow-[0_20px_50px_rgba(16,185,129,0.3)] transition-all flex items-center gap-3 hover:-translate-y-1 active:translate-y-0"
                  >
                    {t('start_analysis', language)} <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button 
                    onClick={() => window.open("https://youtu.be/bdZbvmZrcvo", "_blank")}
                    className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-10 py-5 rounded-2xl font-black text-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center gap-3 shadow-sm hover:shadow-md"
                  >
                    <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <Play size={16} className="text-slate-600 dark:text-slate-300 group-hover:text-primary fill-current" />
                    </div>
                    {t('view_demo', language)}
                  </button>
                </motion.div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative group"
              >
                <div className="absolute -inset-4 bg-primary/20 rounded-[2rem] blur-3xl group-hover:bg-primary/30 transition-all duration-700"></div>
                <div className="relative bg-white dark:bg-slate-800 p-3 rounded-[2.5rem] shadow-2xl border border-primary/10 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-40 pointer-events-none"></div>
                  <img 
                    alt="Agriculture Intelligence" 
                    className="rounded-[2rem] w-full object-cover aspect-[4/3] shadow-inner" 
                    src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=1200"
                    referrerPolicy="no-referrer"
                  />
                  {/* Floating Card 1: Risk Index */}
                  <motion.div 
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1, duration: 0.5 }}
                    className="absolute bottom-8 left-8 right-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-2xl"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center text-primary">
                          <ShieldAlert size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{t('risk_index_label', language)}</p>
                          <p className="text-sm font-bold">{t('drought_warning', language)}</p>
                        </div>
                      </div>
                      <span className="text-red-500 font-black text-lg">84%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-red-500 w-[84%] rounded-full"></div>
                    </div>
                  </motion.div>

                  {/* Floating Card 2: Yield Prediction */}
                  <motion.div 
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.5 }}
                    className="absolute top-12 -right-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-4 rounded-xl border border-white/20 shadow-2xl flex items-center gap-3"
                  >
                    <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-500">
                      <TrendingUp size={18} />
                    </div>
                    <div>
                      <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest">{t('yield_forecast', language)}</p>
                      <p className="text-xs font-bold text-emerald-500">+12.4% {t('expected_yield', language)}</p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Why AgriShield AI? (Trust Signals) */}
        <section className="py-24 bg-white dark:bg-slate-900/50 border-y border-slate-100 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-4">{t('the_platform', language)}</h2>
              <h3 className="text-4xl font-black text-slate-900 dark:text-slate-100">{t('why_agrishield', language)}</h3>
            </motion.div>
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-3 gap-8"
            >
              {[
                { 
                  title: t('feature_risk_index', language), 
                  desc: t('feature_risk_index_desc', language), 
                  icon: ShieldAlert,
                  color: 'text-red-500',
                  bg: 'bg-red-500/10'
                },
                { 
                  title: t('feature_crop_rec', language), 
                  desc: t('feature_crop_rec_desc', language), 
                  icon: Sparkles,
                  color: 'text-primary',
                  bg: 'bg-primary/10'
                },
                { 
                  title: t('feature_whatif_sim', language), 
                  desc: t('feature_whatif_sim_desc', language), 
                  icon: Zap,
                  color: 'text-amber-500',
                  bg: 'bg-amber-500/10'
                }
              ].map((card, idx) => (
                <motion.div variants={itemVariants} key={idx} className="group p-10 rounded-[2rem] bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-primary transition-all hover:-translate-y-2 hover:shadow-xl">
                  <div className={`w-14 h-14 ${card.bg} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                    <card.icon className={card.color} size={28} />
                  </div>
                  <h4 className="text-xl font-black mb-4">{card.title}</h4>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{card.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Early Insights (Social Proof) */}
        <section className="py-24 bg-primary text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 p-20 opacity-10">
            <ShieldCheck size={400} />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-white/60 mb-6">{t('social_proof', language)}</h2>
                <h3 className="text-4xl lg:text-5xl font-black mb-8 leading-tight">{t('trusted_by', language)}</h3>
                <p className="text-xl text-white/80 leading-relaxed font-medium mb-10">
                  {t('social_proof_desc', language)}
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-4">
                    {[1,2,3,4].map(i => (
                      <img key={i} className="w-12 h-12 rounded-full border-4 border-primary bg-slate-200" src={`https://i.pravatar.cc/150?u=${i}`} alt="User" />
                    ))}
                  </div>
                  <p className="font-bold text-lg">{t('join_farmers', language)}</p>
                </div>
              </motion.div>
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 gap-6"
              >
                <motion.div variants={itemVariants} className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl border border-white/20">
                  <div className="flex items-center gap-4 mb-4">
                    <CheckCircle2 className="text-white" size={32} />
                    <span className="text-4xl font-black">70%</span>
                  </div>
                  <p className="text-lg font-bold text-white/90">{t('stat_capital', language)}</p>
                </motion.div>
                <motion.div variants={itemVariants} className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl border border-white/20">
                  <div className="flex items-center gap-4 mb-4">
                    <CheckCircle2 className="text-white" size={32} />
                    <span className="text-4xl font-black">~90%</span>
                  </div>
                  <p className="text-lg font-bold text-white/90">{t('stat_alignment', language)}</p>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="py-32 bg-slate-50 dark:bg-slate-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-4">{t('the_challenge', language)}</h2>
              <h3 className="text-4xl font-black text-slate-900 dark:text-slate-100 mb-6">{t('breaking_point', language)}</h3>
              <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium">{t('breaking_point_desc', language)}</p>
            </motion.div>
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-3 gap-8"
            >
              {[
                { 
                  title: t('challenge_uncertainty', language), 
                  desc: t('challenge_uncertainty_desc', language), 
                  icon: CloudOff 
                },
                { 
                  title: t('challenge_comparison', language), 
                  desc: t('challenge_comparison_desc', language), 
                  icon: Scale 
                },
                { 
                  title: t('challenge_planning', language), 
                  desc: t('challenge_planning_desc', language), 
                  icon: LineChart 
                }
              ].map((item, idx) => (
                <motion.div variants={itemVariants} key={idx} className="bg-white dark:bg-slate-900 p-10 rounded-[2rem] border border-slate-200 dark:border-slate-800 hover:border-primary transition-all hover:shadow-lg">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-8">
                    <item.icon className="text-primary" size={32} />
                  </div>
                  <h4 className="text-xl font-black mb-4">{item.title}</h4>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Solution Section */}
        <section className="py-32 bg-white dark:bg-slate-900/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-10">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="max-w-2xl"
              >
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-4">{t('our_solution', language)}</h2>
                <h3 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-slate-100 mb-6 tracking-tight">{t('solution_title', language)}</h3>
                <p className="text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                  {t('solution_desc', language)}
                </p>
              </motion.div>
              <motion.button 
                whileHover={{ x: 5 }}
                onClick={() => setCurrentPage('dashboard')}
                className="text-primary font-black text-lg flex items-center gap-2 transition-all group pb-2"
              >
                {t('see_how_it_works', language)} <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </div>
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12"
            >
              {[
                { 
                  title: t('solution_risk_score', language), 
                  desc: t('solution_risk_score_desc', language), 
                  img: 'https://images.unsplash.com/photo-1504109586057-7a2ae83d1338?auto=format&fit=crop&q=80&w=800',
                  icon: ShieldAlert,
                  stat: `84% ${t('drought_risk_detected', language)}`,
                  color: 'text-red-500'
                },
                { 
                  title: t('solution_yield_pred', language), 
                  desc: t('solution_yield_pred_desc', language), 
                  img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800',
                  icon: TrendingUp,
                  stat: `+12.4% ${t('yield_potential_stat', language)}`,
                  color: 'text-emerald-500'
                },
                { 
                  title: t('solution_crop_ranking', language), 
                  desc: t('solution_crop_ranking_desc', language), 
                  img: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=800',
                  icon: LayoutGrid,
                  stat: t('resilient_varieties_stat', language),
                  color: 'text-primary'
                },
                { 
                  title: t('solution_whatif_sim', language), 
                  desc: t('solution_whatif_sim_desc', language), 
                  img: 'https://images.unsplash.com/photo-1534274988757-a28bf1f539cf?auto=format&fit=crop&q=80&w=800',
                  icon: Zap,
                  stat: t('weather_scenarios_stat', language),
                  color: 'text-amber-500'
                }
              ].map((item, idx) => (
                <motion.div 
                  variants={itemVariants}
                  key={idx} 
                  className="group cursor-pointer flex flex-col h-full bg-white dark:bg-slate-900 rounded-[24px] p-4 border border-slate-200/50 dark:border-slate-800/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500" 
                  onClick={() => setCurrentPage(idx === 3 ? 'what-if' : 'dashboard')}
                  whileHover={{ y: -12 }}
                >
                  {/* Image Container: Fixed 220px height, 16px radius */}
                  <div className="h-[220px] w-full rounded-[16px] overflow-hidden mb-6 bg-slate-100 dark:bg-slate-800 relative">
                    <img 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                      src={item.img}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://picsum.photos/seed/agri-shield-${idx}/800/600`;
                      }}
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  
                  {/* Content Area */}
                  <div className="flex flex-col flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-2 rounded-lg bg-slate-50 dark:bg-slate-800 ${item.color} group-hover:bg-primary/10 group-hover:text-primary transition-colors`}>
                        <item.icon size={20} />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-primary transition-colors">{item.stat}</span>
                    </div>
                    <h4 className="text-2xl font-black group-hover:text-primary transition-colors mb-3 tracking-tight">{item.title}</h4>
                    <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed text-sm line-clamp-3">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-20 text-center"
            >
              <p className="text-sm font-bold text-slate-400 flex items-center justify-center gap-2">
                <Sparkles size={16} className="text-primary" />
                {t('powered_by_ai', language)}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Features Preview */}
        <section className="py-32 bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.2),transparent_70%)]"></div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-4">{t('advanced_tech', language)}</h2>
              <h3 className="text-4xl font-black mb-6">{t('enterprise_intelligence', language)}</h3>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium">{t('enterprise_intelligence_desc', language)}</p>
            </motion.div>
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {[
                { title: t('tech_satellite', language), desc: t('tech_satellite_desc', language), icon: Satellite },
                { title: t('tech_moisture', language), desc: t('tech_moisture_desc', language), icon: Droplets },
                { title: t('tech_district', language), desc: t('tech_district_desc', language), icon: LayoutGrid },
                { title: t('tech_insurance', language), desc: t('tech_insurance_desc', language), icon: ShieldCheck }
              ].map((feat, idx) => (
                <motion.div variants={itemVariants} key={idx} className="flex flex-col gap-6 p-10 bg-slate-800/50 rounded-[2rem] border border-slate-700 hover:border-primary transition-all hover:-translate-y-2">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                    <feat.icon className="text-primary" size={32} />
                  </div>
                  <h5 className="font-black text-xl">{feat.title}</h5>
                  <p className="text-slate-400 font-medium leading-relaxed">{feat.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* AI Assistant Section */}
        <section className="py-32 bg-slate-50 dark:bg-slate-900/50 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-4">{t('interactive_intelligence', language)}</h2>
              <h3 className="text-5xl font-black mb-6 tracking-tight">{t('ai_assistant_title', language)}</h3>
              <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
                {t('ai_assistant_full_desc', language)}
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-12 gap-16 items-center">
              {/* Left Side: Info & Prompts */}
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="lg:col-span-5 space-y-10"
              >
                <div>
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-8">
                    <Brain size={32} />
                  </div>
                  <h4 className="text-3xl font-black mb-6 tracking-tight">{t('ai_assistant_info', language)}</h4>
                  <p className="text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                    {t('ai_assistant_training', language)}
                  </p>
                </div>

                <div className="space-y-4">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">{t('try_asking', language)}</p>
                  {[
                    t('prompt_low_rainfall', language),
                    t('prompt_bajra', language),
                    t('prompt_rainfall_drop', language)
                  ].map((prompt, idx) => (
                    <div 
                      key={idx}
                      className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between group cursor-pointer hover:border-primary transition-all"
                      onClick={() => setCurrentPage('assistant')}
                    >
                      <span className="font-bold text-slate-600 dark:text-slate-300 group-hover:text-primary transition-colors">{prompt}</span>
                      <ArrowRight size={18} className="text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  ))}
                </div>

                <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10 flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Sparkles size={20} />
                  </div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                    {t('ai_disclaimer', language)}
                  </p>
                </div>
              </motion.div>

              {/* Right Side: Chat UI Preview */}
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="lg:col-span-7"
              >
                <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden relative group">
                  {/* Chat Header */}
                  <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4 bg-slate-50/50 dark:bg-slate-800/50">
                    <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                      <Bot size={24} />
                    </div>
                    <div>
                      <h5 className="font-black text-slate-900 dark:text-white">{t('ai_bot_name', language)}</h5>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                        <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">{t('online_ready', language)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Chat Messages Preview */}
                  <div className="p-8 space-y-6 h-[400px] overflow-hidden relative">
                    <div className="flex gap-4 max-w-[80%]">
                      <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white flex-shrink-0">
                        <Bot size={20} />
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl rounded-tl-none border border-slate-100 dark:border-slate-700">
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-200 leading-relaxed">
                          {t('welcome_msg', language)}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 max-w-[80%] ml-auto flex-row-reverse">
                      <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center flex-shrink-0">
                        <User size={20} />
                      </div>
                      <div className="bg-slate-900 text-white p-4 rounded-2xl rounded-tr-none">
                        <p className="text-sm font-medium leading-relaxed">
                          {t('prompt_low_rainfall', language)}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 max-w-[80%]">
                      <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white flex-shrink-0">
                        <Bot size={20} />
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl rounded-tl-none border border-slate-100 dark:border-slate-700">
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-200 leading-relaxed">
                          {t('ai_note', language)}
                        </p>
                      </div>
                    </div>

                    {/* Gradient Overlay for Preview */}
                    <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-slate-900 via-transparent to-transparent"></div>
                  </div>

                  {/* Chat Input Preview */}
                  <div className="p-6 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
                    <div className="relative flex items-center gap-4">
                      <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl px-6 py-4 text-sm font-medium text-slate-400">
                        {t('ask_anything', language)}
                      </div>
                      <div className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                        <Send size={20} />
                      </div>
                    </div>
                  </div>

                  {/* Overlay Button to go to full assistant */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-primary/5 backdrop-blur-[2px]">
                    <button 
                      onClick={() => setCurrentPage('assistant')}
                      className="bg-white dark:bg-slate-900 text-primary px-8 py-4 rounded-2xl font-black shadow-2xl border border-primary/20 flex items-center gap-3 hover:scale-105 transition-all"
                    >
                      <MessageSquare size={20} />
                      {t('open_full_assistant', language)}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary opacity-5"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-slate-800 p-12 lg:p-24 rounded-[4rem] shadow-2xl border border-primary/10 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
              <h2 className="text-5xl lg:text-7xl font-black mb-8 text-slate-900 dark:text-slate-100 tracking-tight">{t('ready_to_secure', language)}</h2>
              <p className="text-2xl text-slate-500 dark:text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
                {t('ready_to_secure_desc', language)}
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentPage('dashboard')} 
                  className="bg-primary hover:bg-primary/90 text-white px-12 py-6 rounded-2xl font-black text-xl shadow-2xl shadow-primary/30 transition-all"
                >
                  {t('go_to_dashboard', language)}
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 px-12 py-6 rounded-2xl font-black text-xl transition-all"
                >
                  {t('contact_support', language)}
                </motion.button>
              </div>
              
              <div className="mt-20 pt-10 border-t border-slate-100 dark:border-slate-700">
                <p className="text-xl font-black text-primary italic tracking-tight">
                  {t('footer_quote', language)}
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-emerald-500/5 border-y border-primary/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl font-black mb-4 text-slate-900 dark:text-slate-100">{t('stay_updated', language)}</h3>
            <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 font-medium">
              {t('newsletter_desc', language)}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder={t('enter_email', language)}
                className="flex-1 px-6 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl font-black transition-all shadow-lg shadow-primary/20 hover:scale-105 active:scale-95">
                {t('subscribe', language)}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Brand Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded-xl">
                  <Brain className="text-primary" size={28} />
                </div>
                <span className="text-2xl font-black tracking-tight">AgriShield AI</span>
              </div>
              <p className="text-slate-400 font-medium leading-relaxed">
                AI-powered climate intelligence for smarter farming decisions.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-primary/20 rounded-lg flex items-center justify-center transition-all hover:scale-110">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path></svg>
                </a>
                <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-primary/20 rounded-lg flex items-center justify-center transition-all hover:scale-110">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path><circle cx="4" cy="4" r="2"></circle></svg>
                </a>
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">{t('product', language)}</h4>
              <ul className="space-y-4">
                {[
                  { label: t('dashboard', language), page: 'dashboard' },
                  { label: t('what_if', language), page: 'what-if' },
                  { label: t('assistant', language), page: 'assistant' },
                  { label: t('resilience', language), page: 'resilience' }
                ].map((item) => (
                  <li key={item.page}>
                    <button
                      onClick={() => setCurrentPage(item.page as any)}
                      className="text-slate-400 hover:text-primary transition-colors font-medium"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">{t('resources', language)}</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-slate-400 hover:text-primary transition-colors font-medium">{t('documentation', language)}</a></li>
                <li><a href="#" className="text-slate-400 hover:text-primary transition-colors font-medium">{t('api_reference', language)}</a></li>
                <li><a href="#" className="text-slate-400 hover:text-primary transition-colors font-medium">{t('blog', language)}</a></li>
                <li><a href="#" className="text-slate-400 hover:text-primary transition-colors font-medium">{t('help_center', language)}</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">{t('legal', language)}</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-slate-400 hover:text-primary transition-colors font-medium">{t('privacy_policy', language)}</a></li>
                <li><a href="#" className="text-slate-400 hover:text-primary transition-colors font-medium">{t('terms_of_service', language)}</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-slate-800">
            <p className="text-center text-slate-400 font-medium">
              © 2026 AgriShield AI | Built for Climate-Resilient Farming
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

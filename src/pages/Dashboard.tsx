import React, { useState, useEffect } from 'react';
import { useApp } from '../store';
import { Sidebar, Header, cn } from '../components/Common';
import { getWeather } from '../services/weatherService';
import { DISTRICTS, CROPS } from '../constants';
import { getRiskMetadata } from '../logic';
import { Sliders, Info, TrendingUp, Sprout, Leaf, Flower2, Sparkles, AlertTriangle, Droplets, Thermometer, Layers, History, ArrowRight, Target, Zap, ShieldCheck, Loader2, MapPin, Cloud, CloudRain, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { t } from '../translations';

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

const analyzeWeatherImpact = (weather: any) => {
  if (!weather?.current) return 0;
  let risk = 0;
  if (weather.current.temp_c > 35) risk += 30;
  if (weather.current.precip_mm < 1) risk += 25;
  if (weather.current.humidity > 85) risk += 20;
  if (weather.current.temp_c < 15) risk += 15;
  if (weather.current.precip_mm > 50) risk += 20;
  return Math.min(risk, 100);
};

const recommendCrop = (weather: any) => {
  if (!weather?.current) return "Wheat";
  if (weather.current.precip_mm < 1 && weather.current.temp_c > 30) return "Bajra";
  if (weather.current.humidity > 80 && weather.current.precip_mm > 5) return "Rice";
  if (weather.current.temp_c < 25 && weather.current.precip_mm < 10) return "Wheat";
  if (weather.current.temp_c > 25 && weather.current.humidity > 60) return "Cotton";
  return "Soybean";
};

const generateAdvice = (weather: any) => {
  if (!weather?.current) return "⏳ Loading weather data...";
  if (weather.current.precip_mm < 1 && weather.current.temp_c > 30)
    return "⚠️ Irrigation required — low rainfall detected";
  if (weather.current.temp_c > 35)
    return "🔥 High heat risk — delay sowing or use heat-resistant varieties";
  if (weather.current.humidity > 85)
    return "💧 High humidity — monitor for fungal diseases";
  if (weather.current.precip_mm > 50)
    return "🌧️ Heavy rainfall — ensure proper drainage";
  return "✅ Conditions are stable for farming operations";
};

const getRiskLabel = (risk: number): 'Low' | 'Moderate' | 'High' | 'Critical' => {
  if (risk < 30) return 'Low';
  if (risk < 60) return 'Moderate';
  if (risk < 80) return 'High';
  return 'Critical';
};

export const Dashboard = () => {
  const { state, result, updateState, runAnalysis, language, isAnalyzing, lastUpdate } = useApp();
  
  const [weather, setWeather] = useState<any>(null);
  const [location, setLocation] = useState<string>("");
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [coords, setCoords] = useState<{lat: number; lon: number} | null>(null);

  // Dynamic risk calculation based on weather
  const dynamicRiskScore = weather ? analyzeWeatherImpact(weather) : result.riskScore;
  const dynamicRiskLabel = getRiskLabel(dynamicRiskScore);
  const riskMeta = getRiskMetadata(dynamicRiskScore);
  
  // Dynamic crop recommendation
  const recommendedCrop = weather ? recommendCrop(weather) : result.cropRankings[0].cropId;
  
  // Dynamic advice
  const smartAdvice = weather ? generateAdvice(weather) : "Analyzing conditions...";

  // Auto-detect user location on mount
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      () => {
        console.log("Location permission denied, using default");
        setLocation("Delhi");
      }
    );
  }, []);

  // Fetch weather when location or coords change
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let query = "";
        if (location) {
          query = location;
        } else if (coords) {
          query = `${coords.lat},${coords.lon}`;
        } else {
          return;
        }
        
        const data = await getWeather(query);
        setWeather(data);
      } catch (err) {
        console.error("Weather fetch error:", err);
        setError("⚠️ Live weather unavailable");
      } finally {
        setLoading(false);
      }
    };
    
    if (location || coords) {
      fetchData();
    }
  }, [location, coords]);

  const format = (text: string, params?: Record<string, string>) => {
    if (!params) return text;
    let resultText = text;
    Object.entries(params).forEach(([key, value]) => {
      // If the value is a known translation key (crop, season, etc.), translate it
      const translatedValue = t(value as any, language) !== value ? t(value as any, language) : value;
      resultText = resultText.replace(`{${key}}`, translatedValue);
    });
    return resultText;
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <main className="ml-64 flex-1 p-10">
        <Header 
          title={t('predictive_dashboard', language)} 
          subtitle={t('dashboard_subtitle', language)} 
        />
        
        {/* Weather Widget at Top */}
        <div className="mb-8">
          <div className="bg-gradient-to-br from-primary/10 to-blue-500/10 dark:from-primary/20 dark:to-blue-500/20 rounded-2xl border border-primary/20 p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Cloud className="text-primary" size={24} />
                <span className="text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">
                  {t('current_weather', language)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Search city..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchInput.trim()) {
                      setLocation(searchInput.trim());
                      setCoords(null);
                    }
                  }}
                  className="px-3 py-1 bg-white/50 dark:bg-slate-800/50 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <div className="flex items-center gap-2 px-3 py-1 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                  <MapPin size={12} className="text-primary" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {loading ? 'Fetching live weather...' : weather?.location?.name || 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-8 gap-2">
                <Loader2 className="animate-spin text-primary" size={32} />
                <span className="text-xs text-slate-500">Fetching live weather...</span>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-amber-600 dark:text-amber-400">⚠️ {error}</div>
            ) : weather ? (
              <div className="grid grid-cols-4 gap-4">
                <div className="flex flex-col items-center p-3 bg-white/50 dark:bg-slate-800/50 rounded-xl backdrop-blur-sm">
                  <Thermometer size={18} className="text-orange-500 mb-2" />
                  <span className="text-2xl font-black text-slate-900 dark:text-white">
                    {weather.current.temp_c}°
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">
                    {t('temperature', language)}
                  </span>
                </div>

                <div className="flex flex-col items-center p-3 bg-white/50 dark:bg-slate-800/50 rounded-xl backdrop-blur-sm">
                  <CloudRain size={18} className="text-blue-500 mb-2" />
                  <span className="text-2xl font-black text-slate-900 dark:text-white">
                    {weather.current.precip_mm}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">mm</span>
                </div>

                <div className="flex flex-col items-center p-3 bg-white/50 dark:bg-slate-800/50 rounded-xl backdrop-blur-sm">
                  <Droplets size={18} className="text-cyan-500 mb-2" />
                  <span className="text-2xl font-black text-slate-900 dark:text-white">
                    {weather.current.humidity}%
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">
                    {t('humidity', language)}
                  </span>
                </div>

                <div className="flex flex-col items-center justify-center p-3 bg-white/50 dark:bg-slate-800/50 rounded-xl backdrop-blur-sm">
                  {weather.current.condition.icon ? (
                    <img src={`https:${weather.current.condition.icon}`} alt={weather.current.condition.text} className="w-8 h-8" />
                  ) : (
                    <Sun size={24} className="text-yellow-500" />
                  )}
                  <span className="text-xs font-black text-slate-900 dark:text-white mt-2 text-center">
                    {weather.current.condition.text}
                  </span>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Loading Overlay */}
        <AnimatePresence>
          {isAnalyzing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50 flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col items-center gap-4"
              >
                <Loader2 className="animate-spin text-primary" size={48} />
                <p className="text-lg font-black text-slate-900 dark:text-white">{t('analyzing', language)}</p>
                <p className="text-sm font-medium text-slate-500">{t('updating', language)}</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-12 gap-8"
        >
          {/* Input Panel */}
          <motion.section 
            variants={itemVariants}
            className="col-span-12 lg:col-span-4 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 p-10 sticky top-10 h-fit"
          >
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-2xl font-black flex items-center gap-3">
                <div className="p-2.5 bg-primary/10 rounded-xl">
                  <Sliders className="text-primary" size={24} />
                </div>
                {t('parameters', language)}
              </h3>
              <div className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {t('live_analysis', language)}
              </div>
            </div>

            <div className="space-y-8">
              <div className="grid grid-cols-1 gap-8">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 mb-3 block tracking-[0.2em]">{t('regional_district', language)}</label>
                  <select 
                    value={state.districtId}
                    onChange={(e) => updateState({ districtId: e.target.value })}
                    className="w-full rounded-2xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold focus:ring-2 focus:ring-primary focus:border-primary py-4 px-5 transition-all appearance-none cursor-pointer"
                  >
                    {DISTRICTS.map(d => (
                      <option key={d.id} value={d.id}>
                        {t(d.state.toLowerCase() as any, language)} - {t(d.id.split('-')[1] as any, language)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 mb-3 block tracking-[0.2em]">{t('season', language)}</label>
                    <input 
                      value={state.season}
                      onChange={(e) => updateState({ season: e.target.value })}
                      className="w-full rounded-2xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold focus:ring-2 focus:ring-primary focus:border-primary py-4 px-5 transition-all" 
                      placeholder={t('placeholder_kharif', language)} 
                      type="text"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 mb-3 block tracking-[0.2em]">{t('soil_type', language)}</label>
                    <input 
                      value={state.soilType}
                      onChange={(e) => updateState({ soilType: e.target.value })}
                      className="w-full rounded-2xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold focus:ring-2 focus:ring-primary focus:border-primary py-4 px-5 transition-all" 
                      placeholder={t('placeholder_loamy', language)} 
                      type="text"
                    />
                  </div>
                </div>

                <div className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">{t('rainfall_forecast', language)}</label>
                    <span className="text-sm font-black text-primary">{state.forecastRain} mm</span>
                  </div>
                  <input 
                    type="range" 
                    min="200" 
                    max="1500" 
                    step="10"
                    value={state.forecastRain}
                    onChange={(e) => updateState({ forecastRain: Number(e.target.value) })}
                    className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-primary"
                  />
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">{t('temperature_shift', language)}</label>
                    <span className="text-sm font-black text-orange-500">+{state.avgTemp - 25}°C</span>
                  </div>
                  <input 
                    type="range" 
                    min="20" 
                    max="45" 
                    value={state.avgTemp}
                    onChange={(e) => updateState({ avgTemp: Number(e.target.value) })}
                    className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-orange-500"
                  />
                </div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02, boxShadow: "0 20px 40px -10px rgba(16, 185, 129, 0.4)" }}
                whileTap={{ scale: 0.98 }}
                onClick={runAnalysis}
                className="w-full bg-primary text-white py-5 rounded-2xl font-black text-lg mt-10 shadow-2xl shadow-primary/30 hover:bg-primary/90 transition-all flex items-center justify-center gap-3 group" 
                type="button"
              >
                <Zap size={22} className="group-hover:animate-pulse" />
                {t('generate_intelligence', language)}
              </motion.button>
              
              <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-6 italic">
                {t('dashboard_quote', language)}
              </p>
            </div>
          </motion.section>

          {/* Results Column */}
          <div className="col-span-12 lg:col-span-8 space-y-10">
            {/* Top Priority: Risk & Recommendation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Climate Risk Card */}
              <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 p-10 flex flex-col items-center justify-center relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8">
                  <div className={cn("flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm", riskMeta.bg, riskMeta.color)}>
                    <AlertTriangle size={14} />
                    {t(`risk_${riskMeta.label.toLowerCase()}` as any, language)} {t('status', language)}
                  </div>
                </div>
                <h3 className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] mb-12 self-start">{t('climate_vulnerability', language)}</h3>
                
                <div className="relative w-64 h-32 overflow-hidden mb-8">
                  <div className="absolute w-64 h-64 rounded-full border-[24px] border-slate-100 dark:border-slate-800"></div>
                  <motion.div 
                    initial={{ rotate: 45 }}
                    animate={{ rotate: 45 + (dynamicRiskScore / 100) * 180 }}
                    transition={{ duration: 2, ease: "backOut" }}
                    className={cn("absolute w-64 h-64 rounded-full border-[24px] border-transparent border-t-current border-r-current transition-colors duration-1000", 
                      dynamicRiskScore < 30 ? "text-emerald-500" : dynamicRiskScore < 70 ? "text-amber-500" : "text-red-500"
                    )}
                  ></motion.div>
                  <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center">
                    <motion.div 
                      key={dynamicRiskScore}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-6xl font-black text-slate-900 dark:text-white leading-none tracking-tighter"
                    >
                      {dynamicRiskScore}
                    </motion.div>
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-2">{t('risk_index', language)}</span>
                  </div>
                </div>

                <p className="text-center text-sm font-bold text-slate-500 mb-8 max-w-[200px]">
                  {smartAdvice}
                </p>

                <div className="w-full grid grid-cols-2 gap-6 mt-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                      <Droplets size={14} className="text-primary" />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('rainfall', language)}</span>
                    </div>
                    <p className="text-lg font-black text-slate-900 dark:text-white">
                      {weather?.current?.precip_mm || result.rainfallDeficit}
                      {weather?.current?.precip_mm ? ' mm' : '%'}
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                      <Thermometer size={14} className="text-orange-500" />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('thermal', language)}</span>
                    </div>
                    <p className="text-lg font-black text-slate-900 dark:text-white">
                      {weather?.current?.temp_c || result.tempStress}
                      {weather?.current?.temp_c ? '°C' : '%'}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Recommended Crop Card */}
              <motion.div variants={itemVariants} className="bg-slate-900 dark:bg-slate-950 rounded-[2.5rem] shadow-2xl shadow-slate-900/40 p-10 text-white flex flex-col justify-between relative overflow-hidden group border border-white/5">
                <div className="absolute -right-10 -top-10 w-64 h-64 bg-primary/20 rounded-full blur-[80px] group-hover:scale-125 transition-transform duration-1000"></div>
                <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-[60px]"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-primary/20 rounded-xl backdrop-blur-xl border border-white/10">
                        <Sprout className="text-primary" size={24} />
                      </div>
                      <span className="text-white/60 font-black text-[10px] uppercase tracking-[0.3em]">{t('top_recommendation', language)}</span>
                    </div>
                    <div className="px-3 py-1 bg-primary/20 text-primary rounded-lg text-[10px] font-black uppercase tracking-widest border border-primary/20">
                      {t('high_yield', language)}
                    </div>
                  </div>

                  <motion.div 
                    key={recommendedCrop}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <h4 className="text-5xl font-black tracking-tighter">
                      {t(recommendedCrop as any, language)}
                    </h4>
                    <p className="text-slate-400 font-bold text-lg leading-relaxed">
                      {weather ? 
                        `Recommended based on current weather: ${weather.current.temp_c}°C, ${weather.current.humidity}% humidity, ${weather.current.precip_mm}mm rainfall.` :
                        `${t('optimized_for', language)} ${t(state.soilType.toLowerCase() + '_soil' as any, language)} ${t('soil_type', language).toLowerCase()} ${t('predicted_yield_of', language)} ${result.predictedYields[recommendedCrop] || 'N/A'} t/ha.`
                      }
                    </p>
                  </motion.div>
                </div>
                
                <div className="mt-12 pt-10 border-t border-white/5 flex justify-between items-center relative z-10">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">{t('resilience_score', language)}</span>
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className={cn("w-3 h-1.5 rounded-full", i <= (dynamicRiskScore < 30 ? 5 : dynamicRiskScore < 60 ? 4 : 3) ? "bg-primary" : "bg-white/10")}></div>
                      ))}
                    </div>
                  </div>
                  <motion.button 
                    whileHover={{ x: 5 }}
                    className="w-14 h-14 bg-white/5 hover:bg-primary rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/10 transition-all group"
                  >
                    <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </div>
              </motion.div>
            </div>

            {/* Crop Ranking & Insights */}
            <div className="space-y-10">
              <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="p-10 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50 backdrop-blur-md">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">{t('comparative_ranking', language)}</h3>
                    <p className="text-sm font-bold text-slate-400 mt-1">{t('ranking_subtitle', language)}</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="px-4 py-2 bg-white dark:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600 shadow-sm text-[10px] font-black uppercase tracking-widest text-slate-500">
                      {t('sort_yield', language)}
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/30 dark:bg-slate-800/20">
                        <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">{t('variety', language)}</th>
                        <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">{t('yield_tha', language)}</th>
                        <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">{t('shield_index', language)}</th>
                        <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">{t('status', language)}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {result.cropRankings.slice(0, 4).map((rank, idx) => {
                        const crop = CROPS.find(c => c.id === rank.cropId)!;
                        return (
                          <motion.tr 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + idx * 0.1 }}
                            key={rank.cropId} 
                            className={cn("group transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer", idx === 0 && "bg-primary/[0.02]")}
                          >
                            <td className="px-10 py-8">
                              <div className="flex items-center gap-5">
                                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 shadow-sm", idx === 0 ? "bg-primary text-white shadow-primary/20" : "bg-slate-100 dark:bg-slate-800 text-slate-500")}>
                                  <Sprout size={24} />
                                </div>
                                <div>
                                  <p className="font-black text-lg text-slate-900 dark:text-white">{t(crop.id as any, language)}</p>
                                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{t(crop.type.toLowerCase() as any, language)}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-10 py-8 text-center">
                              <span className="text-xl font-black text-slate-900 dark:text-white">{rank.yield}</span>
                              <span className="text-[10px] font-bold text-slate-400 ml-1">t/ha</span>
                            </td>
                            <td className="px-10 py-8 text-center">
                              <div className="flex flex-col items-center gap-2">
                                <span className={cn("font-black text-sm", rank.shieldScore > 80 ? "text-emerald-500" : "text-slate-500")}>
                                  {rank.shieldScore}%
                                </span>
                                <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${rank.shieldScore}%` }}
                                    className={cn("h-full rounded-full", rank.shieldScore > 80 ? "bg-emerald-500" : "bg-slate-400")}
                                  ></motion.div>
                                </div>
                              </div>
                            </td>
                            <td className="px-10 py-8 text-center">
                              {idx === 0 ? (
                                <span className="px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-xl shadow-sm border border-emerald-200/50 dark:border-emerald-800/50">
                                  {t('recommended', language)}
                                </span>
                              ) : (
                                <span className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-xl">
                                  {t('viable', language)}
                                </span>
                              )}
                            </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </motion.div>

              {/* AI Insights Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
              { 
                label: t('risk_intelligence', language), 
                icon: ShieldCheck, 
                data: weather ? smartAdvice : result.insights.risk.key, 
                color: 'text-emerald-500', 
                bg: 'bg-emerald-500/10' 
              },
              { 
                label: t('optimal_choice', language), 
                icon: Sparkles, 
                data: weather ? `${recommendedCrop} is optimal for current conditions` : result.insights.bestCrop.key, 
                color: 'text-primary', 
                bg: 'bg-primary/10' 
              },
              { 
                label: t('critical_alert', language), 
                icon: AlertTriangle, 
                data: weather ? (dynamicRiskScore > 60 ? "High risk detected — take preventive action" : "No critical alerts") : result.insights.warning.key, 
                color: 'text-orange-500', 
                bg: 'bg-orange-500/10' 
              }
            ].map((insight, idx) => (
              <motion.div 
                variants={itemVariants}
                key={idx} 
                className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none flex flex-col gap-5 hover:border-primary transition-all group"
              >
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform", insight.bg, insight.color)}>
                  <insight.icon size={24} />
                </div>
                <div>
                  <span className={cn("text-[10px] font-black uppercase tracking-[0.2em] mb-2 block", insight.color)}>{insight.label}</span>
                  <p className="text-sm font-bold leading-relaxed text-slate-600 dark:text-slate-300">
                    {typeof insight.data === 'string' ? insight.data : format(t(insight.data as any, language), (insight as any).params)}
                  </p>
                </div>
              </motion.div>
            ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Decision Factors */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12"
        >
          <h3 className="text-[10px] font-black uppercase text-slate-400 mb-6 tracking-[0.3em]">{t('decision_factors', language)}</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: t('rainfall_match', language), value: t('rainfall_alignment', language), icon: Droplets },
              { label: t('heat_index', language), value: t('heat_threshold', language), icon: Thermometer },
              { label: t('soil_suitability', language), value: `${t(state.soilType.toLowerCase() + '_soil' as any, language)} ${t('soil_drainage', language)}`, icon: Layers },
              { label: t('historical_data', language), value: t('historical_consistency', language), icon: History }
            ].map((factor, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-4 group hover:border-primary transition-all">
                <div className="p-2 bg-primary/10 rounded-xl text-primary group-hover:scale-110 transition-transform">
                  <factor.icon size={20} />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-900 dark:text-white mb-1">{factor.label}</p>
                  <p className="text-[10px] font-bold text-slate-500 leading-relaxed uppercase tracking-tight">{factor.value}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

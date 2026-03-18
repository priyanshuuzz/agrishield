import React from 'react';
import { Cloud, CloudRain, Sun, CloudSnow, Wind, Droplets, Thermometer, Loader2, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../store';
import { t } from '../translations';
import { cn } from './Common';

export const WeatherWidget = () => {
  const { weather, language } = useApp();

  const getWeatherIcon = (condition: string) => {
    const lower = condition.toLowerCase();
    if (lower.includes('clear')) return <Sun className="text-yellow-500" size={24} />;
    if (lower.includes('rain') || lower.includes('shower') || lower.includes('drizzle')) return <CloudRain className="text-blue-500" size={24} />;
    if (lower.includes('cloud')) return <Cloud className="text-slate-400" size={24} />;
    if (lower.includes('snow')) return <CloudSnow className="text-blue-300" size={24} />;
    if (lower.includes('thunder')) return <Wind className="text-purple-500" size={24} />;
    if (lower.includes('mist') || lower.includes('fog') || lower.includes('haze')) return <Cloud className="text-slate-300" size={20} />;
    return <Cloud className="text-slate-400" size={24} />;
  };

  if (weather.isLoading) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex items-center gap-4 shadow-sm"
      >
        <Loader2 className="animate-spin text-primary" size={24} />
        <div>
          <p className="text-sm font-bold text-slate-900 dark:text-white">{weather.location}</p>
          <p className="text-xs text-slate-500">{t('loading', language)}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        key={weather.location}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.3 }}
        className="bg-gradient-to-br from-primary/10 to-blue-500/10 dark:from-primary/20 dark:to-blue-500/20 rounded-2xl border border-primary/20 p-5 shadow-lg"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {getWeatherIcon(weather.condition)}
            <span className="text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">
              {t('current_weather', language)}
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-white/50 dark:bg-slate-800/50 rounded-lg">
            <MapPin size={12} className="text-primary" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {weather.location}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center p-3 bg-white/50 dark:bg-slate-800/50 rounded-xl backdrop-blur-sm"
          >
            <Thermometer size={18} className="text-orange-500 mb-2" />
            <span className="text-2xl font-black text-slate-900 dark:text-white">{weather.temperature}°</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">
              {t('temperature', language)}
            </span>
          </motion.div>

          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center p-3 bg-white/50 dark:bg-slate-800/50 rounded-xl backdrop-blur-sm"
          >
            <CloudRain size={18} className="text-blue-500 mb-2" />
            <span className="text-2xl font-black text-slate-900 dark:text-white">{weather.rainfall}</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">mm</span>
          </motion.div>

          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center p-3 bg-white/50 dark:bg-slate-800/50 rounded-xl backdrop-blur-sm"
          >
            <Droplets size={18} className="text-cyan-500 mb-2" />
            <span className="text-2xl font-black text-slate-900 dark:text-white">{weather.humidity}%</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">
              {t('humidity', language)}
            </span>
          </motion.div>

          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col items-center justify-center p-3 bg-white/50 dark:bg-slate-800/50 rounded-xl backdrop-blur-sm"
          >
            {getWeatherIcon(weather.condition)}
            <span className="text-xs font-black text-slate-900 dark:text-white mt-2">
              {weather.condition}
            </span>
          </motion.div>
        </div>

        {weather.error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 pt-4 border-t border-white/20 dark:border-slate-700/50"
          >
            <p className="text-xs text-amber-600 dark:text-amber-400 font-medium text-center">
              ⚠️ {weather.error}
            </p>
          </motion.div>
        )}

        <div className="mt-4 pt-4 border-t border-white/20 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
              {t('condition', language)}:
            </span>
            <span className="text-xs font-black text-slate-900 dark:text-white">
              {t(`weather_${weather.condition.toLowerCase().replace(' ', '_')}` as any, language) || weather.condition}
            </span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

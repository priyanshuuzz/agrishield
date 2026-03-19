import React, { createContext, useContext, useState, useEffect } from 'react';
import { SimulationState, AnalysisResult } from './types';
import { DISTRICTS } from './constants';
import { runFullAnalysis } from './logic';
import { Language } from './translations';

interface AppContextType {
  state: SimulationState;
  result: AnalysisResult;
  updateState: (updates: Partial<SimulationState>) => void;
  runAnalysis: () => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  isAnalyzing: boolean;
  lastUpdate: string;
}

const defaultState: SimulationState = {
  districtId: DISTRICTS[0].id,
  season: 'Kharif',
  soilType: 'Loamy',
  histRain: 850,
  forecastRain: 720,
  avgTemp: 28,
  monsoonDelay: 12,
  rainfallVariance: 15,
  tempShift: 2.5,
  monsoonDelayOverride: 12
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<SimulationState>(() => {
    const saved = localStorage.getItem('agrishield_state');
    return saved ? JSON.parse(saved) : defaultState;
  });
  
  const [currentPage, setCurrentPage] = useState('landing');
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('agrishield_lang') as Language) || 'hinglish';
  });
  const [result, setResult] = useState<AnalysisResult>(() => runFullAnalysis(state));
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState('');

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('agrishield_lang', lang);
  };

  useEffect(() => {
    localStorage.setItem('agrishield_state', JSON.stringify(state));
    
    // Simulate analysis delay for better UX
    setIsAnalyzing(true);
    const timer = setTimeout(() => {
      setResult(runFullAnalysis(state));
      setIsAnalyzing(false);
      setLastUpdate(new Date().toISOString());
    }, 300);
    
    return () => clearTimeout(timer);
  }, [state]);

  const updateState = (updates: Partial<SimulationState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const runAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setResult(runFullAnalysis(state));
      setIsAnalyzing(false);
      setLastUpdate(new Date().toISOString());
    }, 500);
  };

  return (
    <AppContext.Provider value={{ 
      state, 
      result, 
      updateState, 
      runAnalysis, 
      currentPage, 
      setCurrentPage, 
      language, 
      setLanguage,
      isAnalyzing,
      lastUpdate
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

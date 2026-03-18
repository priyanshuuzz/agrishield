import React from 'react';
import { useApp } from './store';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { WhatIfEngine } from './pages/WhatIfEngine';
import { ResilienceAnalyzer } from './pages/ResilienceAnalyzer';
import { DistrictOverview } from './pages/DistrictOverview';
import { AIAssistant } from './pages/AIAssistant';

const App: React.FC = () => {
  const { currentPage } = useApp();

  const renderPage = () => {
    switch (currentPage) {
      case 'landing': return <LandingPage />;
      case 'dashboard': return <Dashboard />;
      case 'what-if': return <WhatIfEngine />;
      case 'resilience': return <ResilienceAnalyzer />;
      case 'districts': return <DistrictOverview />;
      case 'assistant': return <AIAssistant />;
      default: return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {renderPage()}
    </div>
  );
};

export default App;

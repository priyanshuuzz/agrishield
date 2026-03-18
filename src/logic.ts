import { SimulationState, AnalysisResult, Crop } from './types';
import { CROPS, DISTRICTS } from './constants';

export function computeRisk(state: SimulationState, weatherTemp?: number): number {
  const rainDeficit = Math.max(0, (state.histRain - state.forecastRain) / state.histRain) * 100;
  
  // Use real weather temperature if available
  const actualTemp = weatherTemp || state.avgTemp;
  const tempStress = Math.max(0, (actualTemp + state.tempShift - 25) / 15) * 100;
  const delayImpact = (state.monsoonDelayOverride / 30) * 100;
  
  const score = (rainDeficit * 0.4) + (tempStress * 0.3) + (delayImpact * 0.3);
  return Math.min(100, Math.max(0, Math.round(score)));
}

export function getRiskMetadata(score: number) {
  if (score < 30) return { label: 'Low', color: 'text-primary', bg: 'bg-primary/10' };
  if (score < 60) return { label: 'Moderate', color: 'text-orange-500', bg: 'bg-orange-100' };
  if (score < 85) return { label: 'High', color: 'text-red-500', bg: 'bg-red-100' };
  return { label: 'Critical', color: 'text-red-700', bg: 'bg-red-200' };
}

export function computeYield(crop: Crop, state: SimulationState): number {
  const soilScore = (crop.soilCompatibility[state.soilType] || 50) / 100;
  const rainFactor = 1 - Math.abs((state.forecastRain * (1 + state.rainfallVariance / 100)) - state.histRain) / state.histRain;
  const tempFactor = 1 - Math.max(0, (state.avgTemp + state.tempShift - 25) / 20);
  
  const multiplier = (soilScore * 0.4) + (Math.max(0.5, rainFactor) * 0.3) + (Math.max(0.5, tempFactor) * 0.3);
  return Number((crop.baseYield * multiplier).toFixed(2));
}

export function rankCrops(state: SimulationState): AnalysisResult['cropRankings'] {
  return CROPS.map(crop => {
    const yieldVal = computeYield(crop, state);
    const riskPenalty = Math.round((100 - (crop.rainResilience + crop.tempResilience + crop.droughtResilience) / 3) * (computeRisk(state) / 100));
    const shieldScore = Math.round(Math.min(100, (yieldVal / crop.baseYield) * 100 - riskPenalty));
    
    return {
      cropId: crop.id,
      finalScore: shieldScore,
      yield: yieldVal,
      shieldScore: shieldScore,
      riskPenalty: -riskPenalty,
      resilience: Math.ceil((crop.rainResilience + crop.tempResilience + crop.droughtResilience) / 60)
    };
  }).sort((a, b) => b.finalScore - a.finalScore);
}

export function generateInsights(state: SimulationState, rankings: AnalysisResult['cropRankings']): AnalysisResult['insights'] {
  const risk = computeRisk(state);
  const bestCrop = CROPS.find(c => c.id === rankings[0].cropId);
  
  return {
    risk: risk > 50 
      ? { key: 'insight_risk_high', params: { crop: bestCrop?.id || '' } }
      : { key: 'insight_risk_stable', params: { season: state.season.toLowerCase() } },
    bestCrop: { 
      key: 'insight_best_crop', 
      params: { crop: bestCrop?.id || '', penalty: Math.abs(rankings[0].riskPenalty).toString() } 
    },
    warning: state.avgTemp + state.tempShift > 32 
      ? { key: 'insight_warning_heat', params: { season: state.season.toLowerCase() } }
      : { key: 'insight_warning_pest' }
  };
}

export function runFullAnalysis(state: SimulationState): AnalysisResult {
  const riskScore = computeRisk(state);
  const meta = getRiskMetadata(riskScore);
  const rankings = rankCrops(state);
  
  return {
    riskScore,
    riskLabel: meta.label as any,
    riskColor: meta.color,
    rainfallDeficit: Math.round(Math.max(0, (state.histRain - state.forecastRain) / state.histRain) * 100),
    tempStress: Math.round(Math.max(0, (state.avgTemp + state.tempShift - 25) / 15) * 100),
    predictedYields: rankings.reduce((acc, r) => ({ ...acc, [r.cropId]: r.yield }), {}),
    cropRankings: rankings,
    insights: generateInsights(state, rankings)
  };
}

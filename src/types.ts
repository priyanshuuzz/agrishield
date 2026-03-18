export interface Crop {
  id: string;
  name: string;
  type: string;
  baseYield: number; // tons/ha
  rainResilience: number; // 0-100
  tempResilience: number; // 0-100
  droughtResilience: number; // 0-100
  soilCompatibility: Record<string, number>; // soilType -> score (0-100)
  description: string;
}

export interface District {
  id: string;
  name: string;
  state: string;
  baseRainfall: number; // mm
  baseTemp: number; // °C
  soilType: string;
}

export interface SimulationState {
  districtId: string;
  season: string;
  soilType: string;
  histRain: number;
  forecastRain: number;
  avgTemp: number;
  monsoonDelay: number; // days
  
  // Scenario Overrides (What-If)
  rainfallVariance: number; // percentage (-40 to +30)
  tempShift: number; // degrees (-3 to +6)
  monsoonDelayOverride: number; // days (0 to 30)
}

export interface AnalysisResult {
  riskScore: number;
  riskLabel: 'Low' | 'Moderate' | 'High' | 'Critical';
  riskColor: string;
  rainfallDeficit: number;
  tempStress: number;
  predictedYields: Record<string, number>; // cropId -> yield
  cropRankings: Array<{
    cropId: string;
    finalScore: number;
    yield: number;
    shieldScore: number;
    riskPenalty: number;
    resilience: number; // 1-5
  }>;
  insights: {
    risk: { key: string; params?: Record<string, string> };
    bestCrop: { key: string; params?: Record<string, string> };
    warning: { key: string; params?: Record<string, string> };
  };
}

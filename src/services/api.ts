/**
 * API Service Layer - AgriShield AI
 * 
 * Centralized API communication layer for backend integration.
 * All backend calls MUST go through this service.
 * 
 * CRITICAL: This layer provides fallback mechanisms to ensure UI never breaks.
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const API_TIMEOUT = 10000; // 10 seconds

// ============================================================================
// TYPES
// ============================================================================

export interface ChatRequest {
  message: string;
  context: {
    riskScore?: number;
    rainfall?: number;
    temperature?: number;
    humidity?: number;
    condition?: string;
    topCrop?: string;
  };
}

export interface ChatResponse {
  response: string;
  timestamp: string;
  suggestions?: string[];
}

export interface RiskAnalysisRequest {
  rainfall: number;
  temperature: number;
  soilType: string;
  season: string;
}

export interface RiskAnalysisResponse {
  riskScore: number;
  factors: Array<{
    name: string;
    impact: string;
    description: string;
  }>;
  recommendations: string[];
  timestamp: string;
}

export interface CropRecommendationRequest {
  rainfall: number;
  temperature: number;
  soilType: string;
}

export interface CropRecommendationResponse {
  crops: Array<{
    name: string;
    score: number;
    reason: string;
    suitability: string;
  }>;
  timestamp: string;
}

export interface WhatIfRequest {
  current: {
    rainfall: number;
    temperature: number;
    riskScore: number;
    soilType?: string;
    season?: string;
  };
  changes: {
    rainfall?: number;
    temperature?: number;
    soilType?: string;
    season?: string;
  };
}

export interface WhatIfResponse {
  newRiskScore: number;
  oldRiskScore: number;
  impact: {
    riskChange: number;
    direction: string;
    magnitude: number;
    factors: Array<{
      factor: string;
      change: string;
      effect: string;
    }>;
  };
  recommendations: string[];
  timestamp: string;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Fetch with timeout
 */
async function fetchWithTimeout(url: string, options: RequestInit, timeout: number = API_TIMEOUT): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

/**
 * Generic API call with error handling
 */
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {},
  fallback: T
): Promise<T> {
  try {
    const response = await fetchWithTimeout(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
    
    if (!response.ok) {
      console.warn(`API call failed: ${endpoint} - ${response.status}`);
      return fallback;
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`API error: ${endpoint}`, error);
    return fallback;
  }
}

// ============================================================================
// API SERVICE
// ============================================================================

export const apiService = {
  /**
   * Send message to chatbot
   */
  async chat(message: string, context: ChatRequest['context']): Promise<ChatResponse> {
    const fallback: ChatResponse = {
      response: 'Main abhi available nahi hoon. Kripya thodi der baad try karein.',
      timestamp: new Date().toISOString(),
      suggestions: []
    };
    
    return apiCall<ChatResponse>(
      '/chat',
      {
        method: 'POST',
        body: JSON.stringify({ message, context })
      },
      fallback
    );
  },
  
  /**
   * Get risk analysis
   */
  async getRiskAnalysis(input: RiskAnalysisRequest): Promise<RiskAnalysisResponse> {
    const fallback: RiskAnalysisResponse = {
      riskScore: 50,
      factors: [],
      recommendations: ['Using default risk calculation'],
      timestamp: new Date().toISOString()
    };
    
    return apiCall<RiskAnalysisResponse>(
      '/risk-analysis',
      {
        method: 'POST',
        body: JSON.stringify(input)
      },
      fallback
    );
  },
  
  /**
   * Get crop recommendations
   */
  async getCropRecommendations(input: CropRecommendationRequest): Promise<CropRecommendationResponse> {
    const fallback: CropRecommendationResponse = {
      crops: [
        { name: 'Bajra', score: 75, reason: 'Using default recommendations', suitability: 'Medium' },
        { name: 'Jowar', score: 70, reason: 'Using default recommendations', suitability: 'Medium' }
      ],
      timestamp: new Date().toISOString()
    };
    
    return apiCall<CropRecommendationResponse>(
      '/crop-recommendations',
      {
        method: 'POST',
        body: JSON.stringify(input)
      },
      fallback
    );
  },
  
  /**
   * Run what-if scenario
   */
  async runWhatIfScenario(scenario: WhatIfRequest): Promise<WhatIfResponse> {
    const fallback: WhatIfResponse = {
      newRiskScore: scenario.current.riskScore,
      oldRiskScore: scenario.current.riskScore,
      impact: {
        riskChange: 0,
        direction: 'unchanged',
        magnitude: 0,
        factors: []
      },
      recommendations: ['Using default scenario analysis'],
      timestamp: new Date().toISOString()
    };
    
    return apiCall<WhatIfResponse>(
      '/what-if',
      {
        method: 'POST',
        body: JSON.stringify(scenario)
      },
      fallback
    );
  },
  
  /**
   * Health check
   */
  async healthCheck(): Promise<{ status: string; service: string }> {
    try {
      const response = await fetchWithTimeout(`${API_BASE}/health`, {}, 5000);
      if (response.ok) {
        return await response.json();
      }
      return { status: 'unavailable', service: 'AgriShield AI Backend' };
    } catch (error) {
      return { status: 'unavailable', service: 'AgriShield AI Backend' };
    }
  },
  
  /**
   * Get available soil types
   */
  async getSoilTypes(): Promise<string[]> {
    const fallback = ['Sandy', 'Clay', 'Loamy', 'Black', 'Red'];
    
    try {
      const response = await apiCall<{ soilTypes: string[] }>(
        '/soil-types',
        { method: 'GET' },
        { soilTypes: fallback }
      );
      return response.soilTypes;
    } catch (error) {
      return fallback;
    }
  }
};

// ============================================================================
// BACKEND STATUS HOOK
// ============================================================================

/**
 * Check if backend is available
 */
export async function checkBackendStatus(): Promise<boolean> {
  try {
    const health = await apiService.healthCheck();
    return health.status === 'healthy';
  } catch (error) {
    return false;
  }
}

/**
 * Get API base URL (for debugging)
 */
export function getApiBaseUrl(): string {
  return API_BASE;
}

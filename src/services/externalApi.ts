/**
 * External Backend API Service - AgriShield AI
 * 
 * Integration with deployed ML backend at https://backendml-3.onrender.com
 * This service provides advanced ML-based recommendations and analysis.
 * 
 * IMPORTANT: This is a separate service layer that can be used alongside
 * the existing local API service without breaking current functionality.
 */

const EXTERNAL_API_BASE = 'https://backendml-3.onrender.com';
const API_TIMEOUT = 15000; // 15 seconds (external API may be slower)

// ============================================================================
// TYPES
// ============================================================================

export interface QuickAdviceRequest {
  location: string;
}

export interface QuickAdviceResponse {
  recommended_crop: string;
  reason: string;
  risk_level: string;
  profit_insight: string;
  action_steps: string[];
  warnings: string[];
}

export interface AnalysisRequest {
  location: string;
  rainfall?: number;
  temperature?: number;
  soil_type?: string;
}

export interface AnalysisResponse {
  location: string;
  risk_score: number;
  recommended_crops: Array<{
    name: string;
    score: number;
    reason: string;
    suitability: string;
  }>;
  factors: Array<{
    name: string;
    impact: string;
    description: string;
  }>;
  recommendations: string[];
  weather_data?: {
    temperature: number;
    rainfall: number;
    humidity: number;
  };
}

export interface CompareCropsRequest {
  location: string;
  crops: string[];
}

export interface CompareCropsResponse {
  location: string;
  comparison: Array<{
    crop: string;
    score: number;
    pros: string[];
    cons: string[];
    best_for: string;
  }>;
  winner: string;
  recommendation: string;
}

// ============================================================================
// FORMATTED TYPES (UI-Friendly)
// ============================================================================

export interface FormattedAdvice {
  crop: string;
  reason: string;
  risk: string;
  profit: string;
  steps: string[];
  warnings: string[];
}

export interface FormattedAnalysis {
  location: string;
  riskScore: number;
  crops: Array<{
    name: string;
    score: number;
    reason: string;
    suitability: string;
  }>;
  factors: Array<{
    name: string;
    impact: string;
    description: string;
  }>;
  recommendations: string[];
  weather?: {
    temperature: number;
    rainfall: number;
    humidity: number;
  };
}

export interface FormattedComparison {
  location: string;
  crops: Array<{
    name: string;
    score: number;
    pros: string[];
    cons: string[];
    bestFor: string;
  }>;
  winner: string;
  recommendation: string;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Fetch with timeout
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeout: number = API_TIMEOUT
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
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
async function externalApiCall<T>(
  endpoint: string,
  options: RequestInit = {},
  fallback: T
): Promise<T> {
  try {
    console.log(`[External API] Calling: ${EXTERNAL_API_BASE}${endpoint}`);
    
    const response = await fetchWithTimeout(`${EXTERNAL_API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      console.warn(
        `[External API] Call failed: ${endpoint} - ${response.status}`
      );
      return fallback;
    }

    const data = await response.json();
    console.log(`[External API] Success: ${endpoint}`, data);
    return data;
  } catch (error) {
    console.error(`[External API] Error: ${endpoint}`, error);
    return fallback;
  }
}

// ============================================================================
// RESPONSE FORMATTERS
// ============================================================================

/**
 * Format quick advice response for UI
 */
export function formatAdvice(data: QuickAdviceResponse): FormattedAdvice {
  return {
    crop: data.recommended_crop,
    reason: data.reason,
    risk: data.risk_level,
    profit: data.profit_insight,
    steps: data.action_steps || [],
    warnings: data.warnings || [],
  };
}

/**
 * Format analysis response for UI
 */
export function formatAnalysis(data: AnalysisResponse): FormattedAnalysis {
  return {
    location: data.location,
    riskScore: data.risk_score,
    crops: data.recommended_crops.map((crop) => ({
      name: crop.name,
      score: crop.score,
      reason: crop.reason,
      suitability: crop.suitability,
    })),
    factors: data.factors.map((factor) => ({
      name: factor.name,
      impact: factor.impact,
      description: factor.description,
    })),
    recommendations: data.recommendations || [],
    weather: data.weather_data
      ? {
          temperature: data.weather_data.temperature,
          rainfall: data.weather_data.rainfall,
          humidity: data.weather_data.humidity,
        }
      : undefined,
  };
}

/**
 * Format crop comparison response for UI
 */
export function formatComparison(
  data: CompareCropsResponse
): FormattedComparison {
  return {
    location: data.location,
    crops: data.comparison.map((item) => ({
      name: item.crop,
      score: item.score,
      pros: item.pros || [],
      cons: item.cons || [],
      bestFor: item.best_for,
    })),
    winner: data.winner,
    recommendation: data.recommendation,
  };
}

// ============================================================================
// EXTERNAL API SERVICE
// ============================================================================

export const externalApiService = {
  /**
   * Get quick advice for a location
   * 
   * @param location - District or location name
   * @returns Quick advice with crop recommendation
   * 
   * @example
   * const advice = await externalApiService.getQuickAdvice('Pune');
   * console.log(advice.crop); // "Bajra"
   */
  async getQuickAdvice(location: string): Promise<FormattedAdvice | null> {
    const fallback: QuickAdviceResponse = {
      recommended_crop: 'Bajra',
      reason: 'Using default recommendation',
      risk_level: 'Medium',
      profit_insight: 'Moderate profit potential',
      action_steps: ['Monitor weather', 'Ensure irrigation'],
      warnings: ['External API unavailable'],
    };

    const response = await externalApiCall<QuickAdviceResponse>(
      `/quick-advice/${encodeURIComponent(location)}`,
      { method: 'GET' },
      fallback
    );

    return formatAdvice(response);
  },

  /**
   * Get detailed analysis for a location
   * 
   * @param location - District or location name
   * @param options - Optional parameters (rainfall, temperature, soil_type)
   * @returns Detailed analysis with risk score and recommendations
   * 
   * @example
   * const analysis = await externalApiService.getAnalysis('Pune', {
   *   rainfall: 850,
   *   temperature: 28,
   *   soil_type: 'Loamy'
   * });
   */
  async getAnalysis(
    location: string,
    options?: {
      rainfall?: number;
      temperature?: number;
      soil_type?: string;
    }
  ): Promise<FormattedAnalysis | null> {
    const fallback: AnalysisResponse = {
      location,
      risk_score: 50,
      recommended_crops: [
        {
          name: 'Bajra',
          score: 75,
          reason: 'Using default analysis',
          suitability: 'Medium',
        },
      ],
      factors: [],
      recommendations: ['External API unavailable'],
    };

    // Build query string
    const params = new URLSearchParams();
    if (options?.rainfall) params.append('rainfall', options.rainfall.toString());
    if (options?.temperature) params.append('temperature', options.temperature.toString());
    if (options?.soil_type) params.append('soil_type', options.soil_type);

    const queryString = params.toString();
    const endpoint = `/analyze/${encodeURIComponent(location)}${queryString ? `?${queryString}` : ''}`;

    const response = await externalApiCall<AnalysisResponse>(
      endpoint,
      { method: 'GET' },
      fallback
    );

    return formatAnalysis(response);
  },

  /**
   * Compare multiple crops for a location
   * 
   * @param location - District or location name
   * @param crops - Array of crop names to compare
   * @returns Comparison with pros/cons for each crop
   * 
   * @example
   * const comparison = await externalApiService.compareCrops('Pune', ['Bajra', 'Wheat', 'Rice']);
   */
  async compareCrops(
    location: string,
    crops: string[]
  ): Promise<FormattedComparison | null> {
    const fallback: CompareCropsResponse = {
      location,
      comparison: crops.map((crop) => ({
        crop,
        score: 70,
        pros: ['Drought resistant'],
        cons: ['Requires monitoring'],
        best_for: 'General farming',
      })),
      winner: crops[0] || 'Bajra',
      recommendation: 'External API unavailable',
    };

    const cropsParam = crops.join(',');
    const response = await externalApiCall<CompareCropsResponse>(
      `/compare-crops/${encodeURIComponent(location)}?crops=${encodeURIComponent(cropsParam)}`,
      { method: 'GET' },
      fallback
    );

    return formatComparison(response);
  },

  /**
   * Health check for external API
   */
  async healthCheck(): Promise<{ status: string; available: boolean }> {
    try {
      const response = await fetchWithTimeout(
        `${EXTERNAL_API_BASE}/health`,
        {},
        5000
      );
      if (response.ok) {
        return { status: 'healthy', available: true };
      }
      return { status: 'unavailable', available: false };
    } catch (error) {
      return { status: 'unavailable', available: false };
    }
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Check if external API is available
 */
export async function checkExternalApiStatus(): Promise<boolean> {
  try {
    const health = await externalApiService.healthCheck();
    return health.available;
  } catch (error) {
    return false;
  }
}

/**
 * Get external API base URL (for debugging)
 */
export function getExternalApiBaseUrl(): string {
  return EXTERNAL_API_BASE;
}

/**
 * Convert district ID to location name for external API
 */
export function districtIdToLocation(districtId: string): string {
  const districtMap: Record<string, string> = {
    'pune': 'Pune',
    'nashik': 'Nashik',
    'aurangabad': 'Aurangabad',
    'solapur': 'Solapur',
    'ahmednagar': 'Ahmednagar',
    'satara': 'Satara',
    'sangli': 'Sangli',
  };
  
  return districtMap[districtId.toLowerCase()] || districtId;
}

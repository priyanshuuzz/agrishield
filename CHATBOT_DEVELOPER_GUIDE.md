# 🤖 AgriShield AI Chatbot - Developer Guide

**For**: Developers who need to understand, modify, or extend the chatbot  
**Last Updated**: March 19, 2026

---

## 🎯 QUICK START

### Understanding the Chatbot in 60 Seconds:

1. **User types a message** → "Give me detailed analysis for Pune"
2. **Intent detection** → Determines if user wants detailed or quick advice
3. **Location extraction** → Finds "Pune" in the message
4. **API call** → Calls appropriate ML backend endpoint
5. **Response formatting** → Cleans and formats the response
6. **Display** → Shows clean, readable message to user

---

## 📁 FILE STRUCTURE

```
src/
├── services/
│   └── externalApi.ts          # API service layer (7 endpoints)
└── pages/
    └── AIAssistant.tsx          # Chatbot UI and logic
```

---

## 🔧 KEY FUNCTIONS

### 1. Intent Detection
**Location**: `AIAssistant.tsx`  
**Function**: `detectIntent(userInput: string): 'detailed' | 'quick'`

**Purpose**: Determines if user wants detailed analysis or quick advice

**How it works**:
```typescript
const detectIntent = (userInput: string): 'detailed' | 'quick' => {
  const input = userInput.toLowerCase();
  
  // Keywords that indicate detailed analysis needed
  const detailedKeywords = [
    'analysis', 'analyze', 'profit', 'risk', 'rainfall', 
    'weather', 'detailed', 'complete', 'full', 'temperature',
    'humidity', 'factors', 'recommendations', 'why'
  ];
  
  // Check if any keyword is present
  for (const keyword of detailedKeywords) {
    if (input.includes(keyword)) {
      return 'detailed';
    }
  }
  
  return 'quick';
};
```

**Examples**:
- "What should I grow?" → `'quick'`
- "Give me detailed analysis" → `'detailed'`
- "What's the profit for Bajra?" → `'detailed'` (contains "profit")
- "Best crop?" → `'quick'`

**To modify**: Add/remove keywords in the `detailedKeywords` array

---

### 2. Location Extraction
**Location**: `AIAssistant.tsx`  
**Function**: `extractLocation(userInput: string): { location: string; isMapped: boolean }`

**Purpose**: Finds location name in user's message

**How it works**:
```typescript
const extractLocation = (userInput: string): { location: string; isMapped: boolean } => {
  const input = userInput.toLowerCase();
  
  // List of supported locations
  const locations = [
    'pune', 'nashik', 'aurangabad', 'solapur', 'ahmednagar', 
    'satara', 'sangli', 'mumbai', 'delhi', 'bangalore', 
    'hyderabad', 'haryana', 'punjab', 'rajasthan', 'gujarat'
  ];
  
  // Check if any location is mentioned
  for (const loc of locations) {
    if (input.includes(loc)) {
      const capitalizedLoc = loc.charAt(0).toUpperCase() + loc.slice(1);
      return mapToFarmingRegion(capitalizedLoc);
    }
  }
  
  // Default to Haryana if no location found
  return { location: 'Haryana', isMapped: false };
};
```

**Examples**:
- "What to grow in Pune?" → `{ location: 'Pune', isMapped: false }`
- "Best crop for Mumbai?" → `{ location: 'Pune', isMapped: true }` (mapped)
- "Recommend a crop" → `{ location: 'Haryana', isMapped: false }` (default)

**To modify**: Add locations to the `locations` array

---

### 3. Location Mapping
**Location**: `AIAssistant.tsx`  
**Function**: `mapToFarmingRegion(location: string): { location: string; isMapped: boolean }`

**Purpose**: Maps non-farming cities to nearby agricultural regions

**How it works**:
```typescript
const mapToFarmingRegion = (location: string): { location: string; isMapped: boolean } => {
  const farmingMap: Record<string, string> = {
    'mumbai': 'Pune',
    'thane': 'Nashik',
    'navi mumbai': 'Pune',
    'bangalore': 'Pune',
    'hyderabad': 'Aurangabad',
    'chennai': 'Pune',
    'kolkata': 'Pune',
  };
  
  const lowerLocation = location.toLowerCase();
  if (farmingMap[lowerLocation]) {
    return { location: farmingMap[lowerLocation], isMapped: true };
  }
  
  return { location, isMapped: false };
};
```

**Examples**:
- "Mumbai" → `{ location: 'Pune', isMapped: true }`
- "Pune" → `{ location: 'Pune', isMapped: false }`
- "Bangalore" → `{ location: 'Pune', isMapped: true }`

**To modify**: Add/change mappings in the `farmingMap` object

---

### 4. Text Cleaning
**Location**: `AIAssistant.tsx`  
**Function**: `cleanText(text: any): string`

**Purpose**: Removes markdown, null values, extra spaces

**How it works**:
```typescript
const cleanText = (text: any): string => {
  if (!text || text === 'null' || text === 'undefined' || 
      text === 'N/A' || text === 'Unknown') return '';
  return String(text)
    .replace(/\*\*/g, '') // Remove bold markdown
    .replace(/\*/g, '')   // Remove italic markdown
    .replace(/\n\n+/g, '\n') // Remove extra newlines
    .trim();
};
```

**Examples**:
- `"**Bajra**"` → `"Bajra"`
- `"null"` → `""`
- `"N/A"` → `""`
- `"text\n\n\nmore"` → `"text\nmore"`

**To modify**: Add more filters in the function

---

### 5. Text Shortening
**Location**: `AIAssistant.tsx`  
**Function**: `shortenText(text: string, maxWords: number): string`

**Purpose**: Limits text to maximum word count

**How it works**:
```typescript
const shortenText = (text: string, maxWords: number): string => {
  if (!text) return '';
  const words = text.split(' ');
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(' ') + '...';
};
```

**Examples**:
- `shortenText("This is a long text", 3)` → `"This is a..."`
- `shortenText("Short", 10)` → `"Short"`

**Current limits**:
- Reason: 25 words
- Profit: 15 words

**To modify**: Change the `maxWords` parameter in function calls

---

### 6. Response Formatting (Quick Advice)
**Location**: `AIAssistant.tsx`  
**Function**: `formatQuickAdviceResponse(advice: any): string`

**Purpose**: Formats quick advice API response for display

**How it works**:
```typescript
const formatQuickAdviceResponse = (advice: any): string => {
  // Extract and clean fields
  const crop = cleanText(advice.crop) || 'Bajra';
  const reason = cleanText(advice.reason) || 'Best suited for current conditions';
  const profit = cleanText(advice.profit) || 'Moderate profit potential';
  const risk = cleanText(advice.risk) || 'Medium';
  const steps = Array.isArray(advice.steps) ? advice.steps.filter(s => s && s !== 'null' && s !== 'N/A') : [];
  
  // Shorten text
  const shortReason = shortenText(reason, 25); // ~2 lines
  const shortProfit = shortenText(profit, 15); // ~1 line
  
  // Build response
  let response = `🌾 Recommended Crop: ${crop}\n\n`;
  response += `📊 Why this crop?\n${shortReason}\n\n`;
  response += `💰 Profit: ${shortProfit}\n\n`;
  response += `⚠️ Risk: ${risk}\n\n`;
  
  // Add top 3 steps
  if (steps.length > 0) {
    response += `✅ What to do:\n`;
    const topSteps = steps.slice(0, 3);
    topSteps.forEach((step: string) => {
      const cleanStep = cleanText(step);
      if (cleanStep) {
        response += `• ${cleanStep}\n`;
      }
    });
  }
  
  return response.trim();
};
```

**Output format**:
```
🌾 Recommended Crop: Bajra

📊 Why this crop?
[25 words max]

💰 Profit: [15 words max]

⚠️ Risk: Low

✅ What to do:
• [step 1]
• [step 2]
• [step 3]
```

**To modify**: Change emojis, section titles, or word limits

---

### 7. Response Formatting (Detailed Analysis)
**Location**: `AIAssistant.tsx`  
**Function**: `formatAnalysisResponse(analysis: any): string`

**Purpose**: Formats detailed analysis API response for display

**How it works**:
```typescript
const formatAnalysisResponse = (analysis: any): string => {
  if (!analysis) return 'Unable to get detailed analysis. Please try again.';
  
  // Extract fields
  const location = cleanText(analysis.location) || 'your area';
  const riskScore = analysis.riskScore || 50;
  const crops = analysis.crops || [];
  const weather = analysis.weather;
  const recommendations = analysis.recommendations || [];
  
  // Get top crop
  const topCrop = crops.length > 0 ? crops[0] : null;
  
  // Build response
  let response = `📍 Analysis for ${location}\n\n`;
  
  if (topCrop) {
    response += `🌾 Recommended Crop: ${cleanText(topCrop.name) || 'Bajra'}\n\n`;
    
    const reason = cleanText(topCrop.reason);
    if (reason) {
      response += `📊 Why this crop?\n${shortenText(reason, 25)}\n\n`;
    }
    
    response += `💯 Suitability Score: ${topCrop.score || 75}/100\n\n`;
  }
  
  // Risk level
  const riskLevel = riskScore < 30 ? 'Low' : riskScore < 60 ? 'Medium' : 'High';
  response += `⚠️ Risk Level: ${riskLevel} (${riskScore}%)\n\n`;
  
  // Weather data
  if (weather) {
    response += `🌦 Weather Conditions:\n`;
    if (weather.temperature) response += `• Temperature: ${weather.temperature}°C\n`;
    if (weather.rainfall) response += `• Rainfall: ${weather.rainfall}mm\n`;
    if (weather.humidity) response += `• Humidity: ${weather.humidity}%\n`;
    response += '\n';
  }
  
  // Recommendations
  if (recommendations.length > 0) {
    response += `✅ Recommendations:\n`;
    recommendations.slice(0, 3).forEach((rec: string) => {
      const cleanRec = cleanText(rec);
      if (cleanRec) {
        response += `• ${cleanRec}\n`;
      }
    });
  }
  
  return response.trim();
};
```

**Output format**:
```
📍 Analysis for Pune

🌾 Recommended Crop: Bajra

📊 Why this crop?
[25 words max]

💯 Suitability Score: 85/100

⚠️ Risk Level: Low (25%)

🌦 Weather Conditions:
• Temperature: 28°C
• Rainfall: 850mm
• Humidity: 65%

✅ Recommendations:
• [recommendation 1]
• [recommendation 2]
• [recommendation 3]
```

**To modify**: Change sections, emojis, or risk level thresholds

---

### 8. Main Response Generator
**Location**: `AIAssistant.tsx`  
**Function**: `generateResponse(userInput: string): Promise<string>`

**Purpose**: Orchestrates the entire response generation process

**How it works**:
```typescript
const generateResponse = async (userInput: string): Promise<string> => {
  try {
    // Step 1: Detect intent
    const intent = detectIntent(userInput);
    
    // Step 2: Extract location
    const { location, isMapped } = extractLocation(userInput);
    
    console.log(`[AI Assistant] Intent: ${intent}, Location: ${location}${isMapped ? ' (mapped)' : ''}`);
    
    let response = '';
    
    // Step 3: Add mapping message if needed
    if (isMapped) {
      response = `ℹ️ Showing results for nearby farming region: ${location}\n\n`;
    }
    
    // Step 4: Call appropriate API
    if (intent === 'detailed') {
      console.log('[AI Assistant] Calling detailed analysis API');
      
      const analysis = await externalApiService.getAnalysis(location, {
        rainfall: state.forecastRain,
        temperature: weather.temperature || state.avgTemp,
        soil_type: state.soilType
      });
      
      if (analysis) {
        console.log('[AI Assistant] Analysis API response received:', analysis);
        response += formatAnalysisResponse(analysis);
        return response;
      }
      
      console.log('[AI Assistant] Analysis API returned null, trying quick advice');
    }
    
    // Step 5: Fall back to quick advice
    console.log('[AI Assistant] Calling quick advice API');
    const advice = await externalApiService.getQuickAdvice(location);
    
    if (advice) {
      console.log('[AI Assistant] Quick advice API response received:', advice);
      response += formatQuickAdviceResponse(advice);
      return response;
    }
    
    // Step 6: Final fallback to template
    console.log('[AI Assistant] Both APIs returned null, using fallback');
    return generateFallbackResponse(userInput);
    
  } catch (error) {
    console.error('[AI Assistant] API error:', error);
    return generateFallbackResponse(userInput);
  }
};
```

**Flow**:
```
User Input
    ↓
Detect Intent (detailed/quick)
    ↓
Extract Location
    ↓
Map to Farming Region (if needed)
    ↓
Call API (getAnalysis or getQuickAdvice)
    ↓
Format Response
    ↓
Return to User
```

**Fallback chain**:
1. Try detailed analysis API
2. Try quick advice API
3. Use template-based fallback

**To modify**: Change API call parameters or fallback logic

---

## 🔌 API SERVICE LAYER

### Location: `src/services/externalApi.ts`

### Available Endpoints:

```typescript
// 1. Quick Advice
await externalApiService.getQuickAdvice('Pune');

// 2. Detailed Analysis
await externalApiService.getAnalysis('Pune', {
  rainfall: 850,
  temperature: 28,
  soil_type: 'Loamy'
});

// 3. Crop Comparison
await externalApiService.compareCrops('Pune', ['Bajra', 'Wheat', 'Rice']);

// 4. Weather
await externalApiService.getWeather('Pune');

// 5. Soil
await externalApiService.getSoil('Pune');

// 6. Price
await externalApiService.getPrice('Bajra');

// 7. Crops List
await externalApiService.getCrops();
```

### All endpoints include:
- ✅ Type-safe interfaces
- ✅ Response formatters
- ✅ Error handling
- ✅ Timeout protection (15s)
- ✅ Fallback data
- ✅ Console logging

---

## 🛠️ COMMON MODIFICATIONS

### 1. Add New Intent Keyword

**File**: `AIAssistant.tsx`  
**Function**: `detectIntent()`

```typescript
const detailedKeywords = [
  'analysis', 'analyze', 'profit', 'risk', 'rainfall', 
  'weather', 'detailed', 'complete', 'full', 'temperature',
  'humidity', 'factors', 'recommendations', 'why',
  'YOUR_NEW_KEYWORD' // Add here
];
```

---

### 2. Add New Location

**File**: `AIAssistant.tsx`  
**Function**: `extractLocation()`

```typescript
const locations = [
  'pune', 'nashik', 'aurangabad', 'solapur', 'ahmednagar', 
  'satara', 'sangli', 'mumbai', 'delhi', 'bangalore', 
  'hyderabad', 'haryana', 'punjab', 'rajasthan', 'gujarat',
  'your_new_location' // Add here (lowercase)
];
```

---

### 3. Add New City Mapping

**File**: `AIAssistant.tsx`  
**Function**: `mapToFarmingRegion()`

```typescript
const farmingMap: Record<string, string> = {
  'mumbai': 'Pune',
  'thane': 'Nashik',
  'navi mumbai': 'Pune',
  'bangalore': 'Pune',
  'hyderabad': 'Aurangabad',
  'chennai': 'Pune',
  'kolkata': 'Pune',
  'your_city': 'Nearby_Farming_Region' // Add here
};
```

---

### 4. Change Default Location

**File**: `AIAssistant.tsx`  
**Function**: `extractLocation()`

```typescript
// Default to Haryana if no location found
return { location: 'Haryana', isMapped: false };

// Change to:
return { location: 'YOUR_DEFAULT_LOCATION', isMapped: false };
```

---

### 5. Change Text Limits

**File**: `AIAssistant.tsx`  
**Functions**: `formatQuickAdviceResponse()`, `formatAnalysisResponse()`

```typescript
// Current limits
const shortReason = shortenText(reason, 25); // ~2 lines
const shortProfit = shortenText(profit, 15); // ~1 line

// Change to:
const shortReason = shortenText(reason, YOUR_WORD_LIMIT);
const shortProfit = shortenText(profit, YOUR_WORD_LIMIT);
```

---

### 6. Change Response Format

**File**: `AIAssistant.tsx`  
**Function**: `formatQuickAdviceResponse()` or `formatAnalysisResponse()`

```typescript
// Current format
let response = `🌾 Recommended Crop: ${crop}\n\n`;
response += `📊 Why this crop?\n${shortReason}\n\n`;
response += `💰 Profit: ${shortProfit}\n\n`;

// Change emojis, titles, or structure as needed
let response = `🌱 Best Crop: ${crop}\n\n`;
response += `💡 Reason:\n${shortReason}\n\n`;
response += `💵 Expected Profit: ${shortProfit}\n\n`;
```

---

### 7. Add New API Endpoint

**File**: `src/services/externalApi.ts`

```typescript
// 1. Add interface
export interface YourNewResponse {
  field1: string;
  field2: number;
}

// 2. Add formatted type
export interface FormattedYourNew {
  field1: string;
  field2: number;
}

// 3. Add formatter
export function formatYourNew(data: YourNewResponse): FormattedYourNew {
  return {
    field1: data.field1,
    field2: data.field2,
  };
}

// 4. Add to service
export const externalApiService = {
  // ... existing methods
  
  async getYourNew(param: string): Promise<FormattedYourNew | null> {
    const fallback: YourNewResponse = {
      field1: 'default',
      field2: 0,
    };

    const response = await externalApiCall<YourNewResponse>(
      `/your-endpoint/${encodeURIComponent(param)}`,
      { method: 'GET' },
      fallback
    );

    return formatYourNew(response);
  },
};
```

---

## 🐛 DEBUGGING

### Console Logs:

The chatbot includes comprehensive logging:

```typescript
console.log(`[AI Assistant] Intent: ${intent}, Location: ${location}`);
console.log('[AI Assistant] Calling detailed analysis API');
console.log('[AI Assistant] Analysis API response received:', analysis);
console.log('[AI Assistant] Quick advice API response received:', advice);
console.log('[AI Assistant] Both APIs returned null, using fallback');
console.error('[AI Assistant] API error:', error);
```

### To debug:
1. Open browser console (F12)
2. Type a message in chatbot
3. Watch console logs to see:
   - Detected intent
   - Extracted location
   - API calls
   - Responses
   - Errors

---

## 🧪 TESTING

### Test Cases:

```typescript
// 1. Simple query
"What should I grow?"
// Expected: Quick advice for Haryana

// 2. Detailed query
"Give me detailed analysis of profit and risk"
// Expected: Detailed analysis for Haryana

// 3. Location-specific
"Best crop for Pune?"
// Expected: Quick advice for Pune

// 4. Non-farming city
"What to grow in Mumbai?"
// Expected: Quick advice for Pune (mapped) with info message

// 5. Detailed with location
"Detailed profit analysis for Nashik"
// Expected: Detailed analysis for Nashik
```

---

## 📊 PERFORMANCE

### Metrics:
- API Timeout: 15 seconds max
- Typical Response: < 3 seconds
- Fallback Response: Instant
- UI Blocking: None (async)

### Optimization Tips:
1. Keep formatters simple
2. Limit text processing
3. Use fallback data
4. Cache API responses (optional)

---

## 🔒 SECURITY

### Current Measures:
- ✅ Timeout protection (15s)
- ✅ Error handling (try-catch)
- ✅ Input sanitization (encodeURIComponent)
- ✅ Fallback data (no raw errors shown)

### Best Practices:
1. Never show raw API errors to users
2. Always validate API responses
3. Use fallback data
4. Log errors for debugging

---

## 📚 RESOURCES

### Documentation:
- `CONTEXT_TRANSFER_STATUS.md` - Complete status
- `PROJECT_COMPLETION_SUMMARY.md` - Summary
- `FULL_API_INTEGRATION_COMPLETE.md` - API docs
- `CHATBOT_UX_IMPROVEMENTS.md` - UX details

### Code Files:
- `src/services/externalApi.ts` - API service
- `src/pages/AIAssistant.tsx` - Chatbot logic

---

## 🎯 QUICK REFERENCE

### Import API Service:
```typescript
import { externalApiService } from '../services/externalApi';
```

### Call API:
```typescript
const advice = await externalApiService.getQuickAdvice('Pune');
const analysis = await externalApiService.getAnalysis('Pune', options);
```

### Format Response:
```typescript
const formatted = formatQuickAdviceResponse(advice);
const formatted = formatAnalysisResponse(analysis);
```

### Handle Errors:
```typescript
try {
  const data = await externalApiService.getQuickAdvice(location);
  if (data) {
    // Use data
  } else {
    // Use fallback
  }
} catch (error) {
  console.error('Error:', error);
  // Use fallback
}
```

---

**Status**: ✅ Complete Developer Guide  
**For**: Developers working on AgriShield AI chatbot  
**Last Updated**: March 19, 2026

🤖 **Happy Coding!**

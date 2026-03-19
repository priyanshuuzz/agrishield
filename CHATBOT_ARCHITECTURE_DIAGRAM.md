# 🏗️ AgriShield AI Chatbot - Architecture Diagram

**Visual representation of the complete chatbot system**

---

## 📊 SYSTEM OVERVIEW

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER INTERFACE                            │
│                     (AIAssistant.tsx)                            │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Text Input │  │ Voice Input  │  │ Example      │          │
│  │              │  │ (Microphone) │  │ Prompts      │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                  │                  │                   │
│         └──────────────────┴──────────────────┘                   │
│                            │                                      │
│                            ▼                                      │
│                   ┌────────────────┐                             │
│                   │  handleSend()  │                             │
│                   └────────┬───────┘                             │
└────────────────────────────┼──────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CHATBOT LOGIC LAYER                           │
│                     (AIAssistant.tsx)                            │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              generateResponse(userInput)                  │   │
│  │                                                            │   │
│  │  Step 1: detectIntent()                                   │   │
│  │          ├─ Check for detailed keywords                   │   │
│  │          └─ Return 'detailed' or 'quick'                  │   │
│  │                                                            │   │
│  │  Step 2: extractLocation()                                │   │
│  │          ├─ Search for location in input                  │   │
│  │          ├─ Default to 'Haryana' if not found             │   │
│  │          └─ Return location name                          │   │
│  │                                                            │   │
│  │  Step 3: mapToFarmingRegion()                             │   │
│  │          ├─ Check if city needs mapping                   │   │
│  │          ├─ Map to nearby farming region                  │   │
│  │          └─ Return mapped location + flag                 │   │
│  │                                                            │   │
│  │  Step 4: Call API                                         │   │
│  │          ├─ If detailed: getAnalysis()                    │   │
│  │          ├─ If quick: getQuickAdvice()                    │   │
│  │          └─ If fail: generateFallbackResponse()           │   │
│  │                                                            │   │
│  │  Step 5: Format Response                                  │   │
│  │          ├─ cleanText() - remove markdown, nulls          │   │
│  │          ├─ shortenText() - limit word count              │   │
│  │          ├─ formatAnalysisResponse() or                   │   │
│  │          └─ formatQuickAdviceResponse()                   │   │
│  │                                                            │   │
│  │  Step 6: Return formatted response                        │   │
│  └──────────────────────────────────────────────────────────┘   │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    API SERVICE LAYER                             │
│                   (externalApi.ts)                               │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │           externalApiService                              │   │
│  │                                                            │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │  getQuickAdvice(location)                          │  │   │
│  │  │  GET /quick-advice/{location}                      │  │   │
│  │  │  ├─ Timeout: 15s                                   │  │   │
│  │  │  ├─ Fallback: Default advice                       │  │   │
│  │  │  └─ Returns: FormattedAdvice                       │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  │                                                            │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │  getAnalysis(location, options)                    │  │   │
│  │  │  GET /analyze/{location}?params                    │  │   │
│  │  │  ├─ Timeout: 15s                                   │  │   │
│  │  │  ├─ Fallback: Default analysis                     │  │   │
│  │  │  └─ Returns: FormattedAnalysis                     │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  │                                                            │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │  Other Endpoints (ready to use)                    │  │   │
│  │  │  ├─ compareCrops()                                 │  │   │
│  │  │  ├─ getWeather()                                   │  │   │
│  │  │  ├─ getSoil()                                      │  │   │
│  │  │  ├─ getPrice()                                     │  │   │
│  │  │  └─ getCrops()                                     │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL ML BACKEND                           │
│              https://backendml-3.onrender.com                    │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Endpoints:                                               │   │
│  │  ├─ GET /quick-advice/{location}                         │   │
│  │  ├─ GET /analyze/{location}                              │   │
│  │  ├─ GET /compare-crops/{location}?crops=...              │   │
│  │  ├─ GET /weather/{location}                              │   │
│  │  ├─ GET /soil/{location}                                 │   │
│  │  ├─ GET /price/{crop}                                    │   │
│  │  └─ GET /crops                                           │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 DATA FLOW

### Example: User asks "Give me detailed analysis for Pune"

```
┌─────────────────────────────────────────────────────────────────┐
│ STEP 1: USER INPUT                                               │
└─────────────────────────────────────────────────────────────────┘
    Input: "Give me detailed analysis for Pune"
    ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 2: INTENT DETECTION                                         │
└─────────────────────────────────────────────────────────────────┘
    detectIntent("Give me detailed analysis for Pune")
    ├─ Check keywords: "detailed", "analysis"
    └─ Result: 'detailed'
    ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 3: LOCATION EXTRACTION                                      │
└─────────────────────────────────────────────────────────────────┘
    extractLocation("Give me detailed analysis for Pune")
    ├─ Search locations: found "pune"
    └─ Result: { location: 'Pune', isMapped: false }
    ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 4: API CALL                                                 │
└─────────────────────────────────────────────────────────────────┘
    externalApiService.getAnalysis('Pune', {
      rainfall: 850,
      temperature: 28,
      soil_type: 'Loamy'
    })
    ├─ URL: GET /analyze/Pune?rainfall=850&temperature=28&soil_type=Loamy
    ├─ Timeout: 15 seconds
    └─ Response: {
        location: 'Pune',
        riskScore: 42,
        crops: [
          { name: 'Bajra', score: 85, reason: '...', suitability: 'High' }
        ],
        weather: { temperature: 28, rainfall: 850, humidity: 65 },
        recommendations: ['...', '...', '...']
      }
    ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 5: RESPONSE FORMATTING                                      │
└─────────────────────────────────────────────────────────────────┘
    formatAnalysisResponse(analysis)
    ├─ cleanText() on all fields
    ├─ shortenText() on reason (25 words)
    └─ Build formatted response:
        📍 Analysis for Pune
        
        🌾 Recommended Crop: Bajra
        
        📊 Why this crop?
        Bajra is drought-resistant and thrives in semi-arid conditions...
        
        💯 Suitability Score: 85/100
        
        ⚠️ Risk Level: Low (42%)
        
        🌦 Weather Conditions:
        • Temperature: 28°C
        • Rainfall: 850mm
        • Humidity: 65%
        
        ✅ Recommendations:
        • Prepare field with deep plowing
        • Apply organic manure
        • Ensure proper seed treatment
    ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 6: DISPLAY TO USER                                          │
└─────────────────────────────────────────────────────────────────┘
    Show formatted response in chat UI
```

---

## 🔀 DECISION TREE

```
User Input
    │
    ├─ Contains detailed keywords?
    │   ├─ YES → Intent: 'detailed'
    │   └─ NO  → Intent: 'quick'
    │
    ├─ Contains location name?
    │   ├─ YES → Extract location
    │   └─ NO  → Default: 'Haryana'
    │
    ├─ Is non-farming city?
    │   ├─ YES → Map to farming region
    │   └─ NO  → Use as-is
    │
    ├─ Intent = 'detailed'?
    │   ├─ YES → Call getAnalysis()
    │   │         ├─ Success? → Format & return
    │   │         └─ Fail?    → Try getQuickAdvice()
    │   │
    │   └─ NO  → Call getQuickAdvice()
    │             ├─ Success? → Format & return
    │             └─ Fail?    → Use fallback template
    │
    └─ Display response to user
```

---

## 🎯 INTENT DETECTION LOGIC

```
Input: User message (string)
    ↓
Convert to lowercase
    ↓
Check for keywords:
    ├─ "analysis"        → detailed
    ├─ "analyze"         → detailed
    ├─ "profit"          → detailed
    ├─ "risk"            → detailed
    ├─ "rainfall"        → detailed
    ├─ "weather"         → detailed
    ├─ "detailed"        → detailed
    ├─ "complete"        → detailed
    ├─ "full"            → detailed
    ├─ "temperature"     → detailed
    ├─ "humidity"        → detailed
    ├─ "factors"         → detailed
    ├─ "recommendations" → detailed
    └─ "why"             → detailed
    ↓
If any keyword found → 'detailed'
Otherwise           → 'quick'
```

---

## 📍 LOCATION EXTRACTION LOGIC

```
Input: User message (string)
    ↓
Convert to lowercase
    ↓
Check for locations:
    ├─ "pune"        → Pune
    ├─ "nashik"      → Nashik
    ├─ "aurangabad"  → Aurangabad
    ├─ "solapur"     → Solapur
    ├─ "ahmednagar"  → Ahmednagar
    ├─ "satara"      → Satara
    ├─ "sangli"      → Sangli
    ├─ "mumbai"      → Mumbai (will be mapped)
    ├─ "delhi"       → Delhi
    ├─ "bangalore"   → Bangalore (will be mapped)
    ├─ "hyderabad"   → Hyderabad (will be mapped)
    ├─ "haryana"     → Haryana
    ├─ "punjab"      → Punjab
    ├─ "rajasthan"   → Rajasthan
    └─ "gujarat"     → Gujarat
    ↓
If location found → Return location
Otherwise         → Default: 'Haryana'
    ↓
Check if needs mapping:
    ├─ Mumbai     → Pune
    ├─ Thane      → Nashik
    ├─ Bangalore  → Pune
    ├─ Hyderabad  → Aurangabad
    ├─ Chennai    → Pune
    └─ Kolkata    → Pune
```

---

## 🛡️ ERROR HANDLING FLOW

```
Try API Call
    │
    ├─ Success?
    │   ├─ YES → Format response
    │   │         ├─ Has data?
    │   │         │   ├─ YES → Return formatted
    │   │         │   └─ NO  → Try fallback API
    │   │         │
    │   │         └─ Try fallback API
    │   │             ├─ Success? → Format & return
    │   │             └─ Fail?    → Use template
    │   │
    │   └─ NO  → Catch error
    │             ├─ Log error
    │             └─ Use template fallback
    │
    └─ Always return a response (never show raw error)
```

---

## 📦 COMPONENT STRUCTURE

```
AIAssistant.tsx
├─ State Management
│  ├─ messages: Message[]
│  ├─ input: string
│  ├─ isTyping: boolean
│  └─ voice recognition state
│
├─ Helper Functions
│  ├─ detectIntent()
│  ├─ extractLocation()
│  ├─ mapToFarmingRegion()
│  ├─ cleanText()
│  ├─ shortenText()
│  ├─ formatQuickAdviceResponse()
│  ├─ formatAnalysisResponse()
│  ├─ generateFallbackResponse()
│  └─ generateResponse()
│
├─ Event Handlers
│  ├─ handleSend()
│  ├─ startListening()
│  └─ stopListening()
│
└─ UI Components
   ├─ Chat Header
   ├─ Messages Area
   │  ├─ User messages
   │  ├─ Assistant messages
   │  └─ Typing indicator
   │
   └─ Input Area
      ├─ Voice button
      ├─ Text input
      └─ Send button
```

---

## 🔌 API SERVICE STRUCTURE

```
externalApi.ts
├─ Configuration
│  ├─ EXTERNAL_API_BASE: string
│  └─ API_TIMEOUT: number (15000ms)
│
├─ Type Definitions
│  ├─ Request interfaces
│  ├─ Response interfaces
│  └─ Formatted interfaces
│
├─ Utility Functions
│  ├─ fetchWithTimeout()
│  ├─ externalApiCall()
│  └─ districtIdToLocation()
│
├─ Response Formatters
│  ├─ formatAdvice()
│  ├─ formatAnalysis()
│  ├─ formatComparison()
│  ├─ formatWeather()
│  ├─ formatSoil()
│  ├─ formatPrice()
│  └─ formatCropsList()
│
└─ API Service
   ├─ getQuickAdvice()
   ├─ getAnalysis()
   ├─ compareCrops()
   ├─ getWeather()
   ├─ getSoil()
   ├─ getPrice()
   ├─ getCrops()
   └─ healthCheck()
```

---

## 🎨 RESPONSE FORMATTING FLOW

```
Raw API Response
    ↓
Extract fields
    ├─ crop
    ├─ reason
    ├─ profit
    ├─ risk
    ├─ steps
    └─ weather
    ↓
Clean each field
    ├─ Remove markdown (**text**)
    ├─ Filter null/undefined
    ├─ Filter "N/A"/"Unknown"
    └─ Trim whitespace
    ↓
Shorten long text
    ├─ Reason: max 25 words
    ├─ Profit: max 15 words
    └─ Steps: top 3 only
    ↓
Build formatted response
    ├─ Add emojis
    ├─ Add section titles
    ├─ Add bullet points
    └─ Add line breaks
    ↓
Return clean, readable response
```

---

## 🔄 FALLBACK CHAIN

```
Level 1: Primary API
    ├─ Intent = 'detailed' → getAnalysis()
    └─ Intent = 'quick'    → getQuickAdvice()
    ↓
    ├─ Success? → Format & return
    └─ Fail?    → Level 2
    
Level 2: Secondary API
    └─ getQuickAdvice() (if not already tried)
    ↓
    ├─ Success? → Format & return
    └─ Fail?    → Level 3
    
Level 3: Template Fallback
    └─ generateFallbackResponse()
        ├─ Use local state data
        ├─ Use CROPS constants
        └─ Generate context-aware response
    ↓
    Always returns a response
```

---

## 📊 PERFORMANCE METRICS

```
┌─────────────────────────────────────────────────────────────────┐
│                      PERFORMANCE TARGETS                         │
├─────────────────────────────────────────────────────────────────┤
│ API Timeout:           15 seconds (max)                          │
│ Typical Response:      < 3 seconds                               │
│ Fallback Response:     Instant                                   │
│ UI Blocking:           None (async)                              │
│ Memory Usage:          Minimal (no caching)                      │
│ Network Requests:      1-2 per message                           │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔒 SECURITY LAYERS

```
┌─────────────────────────────────────────────────────────────────┐
│                      SECURITY MEASURES                           │
├─────────────────────────────────────────────────────────────────┤
│ Input Sanitization:    encodeURIComponent()                      │
│ Timeout Protection:    15 seconds max                            │
│ Error Handling:        try-catch on all API calls                │
│ Fallback Data:         Never show raw errors                     │
│ Response Validation:   Check for null/undefined                  │
│ Console Logging:       Debug info only (no sensitive data)       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 KEY DESIGN PRINCIPLES

```
┌─────────────────────────────────────────────────────────────────┐
│                      DESIGN PRINCIPLES                           │
├─────────────────────────────────────────────────────────────────┤
│ 1. Modularity:         Separate concerns (UI, logic, API)       │
│ 2. Type Safety:        TypeScript interfaces everywhere          │
│ 3. Error Resilience:   Three-tier fallback system                │
│ 4. User Experience:    Clean, readable responses                 │
│ 5. Performance:        Async, non-blocking operations            │
│ 6. Maintainability:    Clear function names, comments            │
│ 7. Debugging:          Comprehensive console logging             │
│ 8. Scalability:        Easy to add new endpoints/features        │
└─────────────────────────────────────────────────────────────────┘
```

---

**Status**: ✅ Complete Architecture Documentation  
**Last Updated**: March 19, 2026

🏗️ **AgriShield AI - Well-Architected Chatbot System**

# 🔌 Backend Integration Guide - AgriShield AI

**Status**: ✅ Ready for Integration  
**Date**: March 19, 2026  
**Integration Type**: Non-Destructive API Layer

---

## 📋 OVERVIEW

This guide explains how to integrate the backend API with the existing frontend WITHOUT modifying any UI components.

### Integration Approach:
- ✅ API Service Layer created (`src/services/api.ts`)
- ✅ Mock Backend API ready (`backend/app.py`)
- ✅ Zero UI changes required
- ✅ Fallback mechanisms in place
- ✅ Production-ready error handling

---

## 🚀 QUICK START

### Step 1: Start Backend
```bash
cd backend
pip install -r requirements.txt
python app.py
```

Backend will run at: `http://localhost:5000`

### Step 2: Configure Frontend
Add to `.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### Step 3: Run Frontend
```bash
npm run dev
```

Frontend will run at: `http://localhost:3000`

---

## 🔧 INTEGRATION STATUS

### ✅ Completed:
1. Backend API created with all endpoints
2. API service layer implemented
3. Fallback mechanisms added
4. CORS configured
5. Error handling implemented

### 🔄 Next Steps (Optional):
1. Connect chatbot to backend API
2. Replace risk calculation with backend
3. Use backend for crop recommendations
4. Integrate what-if engine with backend

---

## 📡 API ENDPOINTS AVAILABLE

### 1. Chatbot
```typescript
import { apiService } from './services/api';

const response = await apiService.chat('Kaunsi fasal best hai?', {
  riskScore: 45,
  rainfall: 25,
  temperature: 28,
  topCrop: 'Bajra'
});

console.log(response.response);
// "Aapke area mein 25mm rainfall hai. Bajra best option hai."
```

### 2. Risk Analysis
```typescript
const analysis = await apiService.getRiskAnalysis({
  rainfall: 25,
  temperature: 28,
  soilType: 'Loamy',
  season: 'Kharif'
});

console.log(analysis.riskScore); // 42
console.log(analysis.recommendations);
```

### 3. Crop Recommendations
```typescript
const crops = await apiService.getCropRecommendations({
  rainfall: 25,
  temperature: 28,
  soilType: 'Loamy'
});

console.log(crops.crops[0]);
// { name: 'Bajra', score: 85.5, reason: '...', suitability: 'High' }
```

### 4. What-If Scenario
```typescript
const result = await apiService.runWhatIfScenario({
  current: {
    rainfall: 25,
    temperature: 28,
    riskScore: 45
  },
  changes: {
    rainfall: 35
  }
});

console.log(result.newRiskScore); // 38
console.log(result.impact.direction); // 'decreased'
```

---

## 🔄 INTEGRATION PHASES

### Phase 1: Chatbot Integration (PRIORITY)

**File**: `src/pages/AIAssistant.tsx`

**Current Code** (Mock):
```typescript
const handleSend = async () => {
  // Mock response
  const mockResponse = "This is a mock response";
  setMessages([...messages, { role: 'assistant', content: mockResponse }]);
};
```

**Integrated Code** (Backend):
```typescript
import { apiService } from '../services/api';

const handleSend = async () => {
  try {
    setIsLoading(true);
    
    // Get context from store
    const context = {
      riskScore: riskScore,
      rainfall: weather.rainfall,
      temperature: weather.temperature,
      humidity: weather.humidity,
      condition: weather.condition,
      topCrop: cropRankings[0]?.name
    };
    
    // Call backend API
    const response = await apiService.chat(input, context);
    
    // Update UI (same as before)
    setMessages([...messages, { 
      role: 'assistant', 
      content: response.response 
    }]);
  } catch (error) {
    // Fallback to mock (UI never breaks)
    setMessages([...messages, { 
      role: 'assistant', 
      content: 'Main abhi available nahi hoon. Kripya thodi der baad try karein.' 
    }]);
  } finally {
    setIsLoading(false);
  }
};
```

**Changes**:
- ✅ Import API service
- ✅ Add loading state
- ✅ Call backend with context
- ✅ Keep fallback for errors
- ❌ NO UI changes

---

### Phase 2: Risk Analysis Integration

**File**: `src/logic.ts`

**Current Code** (Mock):
```typescript
export function calculateRiskScore(/* params */): number {
  // Mock calculation
  return 45;
}
```

**Integrated Code** (Backend):
```typescript
import { apiService } from './services/api';

export async function calculateRiskScore(
  rainfall: number,
  temperature: number,
  soilType: string,
  season: string
): Promise<number> {
  try {
    const analysis = await apiService.getRiskAnalysis({
      rainfall,
      temperature,
      soilType,
      season
    });
    return analysis.riskScore;
  } catch (error) {
    // Fallback to frontend calculation
    return calculateRiskScoreFallback(rainfall, temperature, soilType, season);
  }
}

// Keep original function as fallback
function calculateRiskScoreFallback(/* params */): number {
  // Original mock logic
  return 45;
}
```

**Changes**:
- ✅ Make function async
- ✅ Call backend API
- ✅ Keep original logic as fallback
- ❌ NO UI changes

---

### Phase 3: Crop Recommendations Integration

**File**: `src/logic.ts`

**Current Code** (Mock):
```typescript
export function getCropRankings(/* params */): Crop[] {
  // Mock rankings
  return mockCrops;
}
```

**Integrated Code** (Backend):
```typescript
import { apiService } from './services/api';

export async function getCropRankings(
  rainfall: number,
  temperature: number,
  soilType: string
): Promise<Crop[]> {
  try {
    const response = await apiService.getCropRecommendations({
      rainfall,
      temperature,
      soilType
    });
    
    // Transform backend response to frontend format
    return response.crops.map(crop => ({
      name: crop.name,
      score: crop.score,
      reason: crop.reason,
      suitability: crop.suitability
    }));
  } catch (error) {
    // Fallback to frontend calculation
    return getCropRankingsFallback(rainfall, temperature, soilType);
  }
}

// Keep original function as fallback
function getCropRankingsFallback(/* params */): Crop[] {
  // Original mock logic
  return mockCrops;
}
```

**Changes**:
- ✅ Make function async
- ✅ Call backend API
- ✅ Transform response format
- ✅ Keep original logic as fallback
- ❌ NO UI changes

---

### Phase 4: What-If Engine Integration

**File**: `src/pages/WhatIfEngine.tsx`

**Current Code** (Mock):
```typescript
const handleRunScenario = () => {
  // Mock calculation
  const newRisk = calculateRiskScore(/* params */);
  setScenarioResult({ newRisk });
};
```

**Integrated Code** (Backend):
```typescript
import { apiService } from '../services/api';

const handleRunScenario = async () => {
  try {
    setIsLoading(true);
    
    const result = await apiService.runWhatIfScenario({
      current: {
        rainfall: currentRainfall,
        temperature: currentTemperature,
        riskScore: currentRiskScore
      },
      changes: {
        rainfall: scenarioRainfall,
        temperature: scenarioTemperature
      }
    });
    
    // Update UI (same format as before)
    setScenarioResult({
      newRisk: result.newRiskScore,
      oldRisk: result.oldRiskScore,
      impact: result.impact,
      recommendations: result.recommendations
    });
  } catch (error) {
    // Fallback to frontend calculation
    const newRisk = calculateRiskScore(/* params */);
    setScenarioResult({ newRisk });
  } finally {
    setIsLoading(false);
  }
};
```

**Changes**:
- ✅ Make function async
- ✅ Add loading state
- ✅ Call backend API
- ✅ Keep fallback calculation
- ❌ NO UI changes

---

## 🛡️ FALLBACK MECHANISMS

### Automatic Fallbacks:
1. **API Timeout**: 10 seconds → fallback to frontend logic
2. **Network Error**: Catch → fallback to frontend logic
3. **Backend Down**: Health check fails → use frontend only
4. **Invalid Response**: Parse error → fallback to frontend logic

### User Experience:
- ✅ UI never breaks
- ✅ No error messages shown to user
- ✅ Seamless degradation
- ✅ App always functional

---

## 🧪 TESTING CHECKLIST

### Backend Testing:
- [ ] Backend starts without errors
- [ ] All endpoints respond correctly
- [ ] CORS headers present
- [ ] Error handling works
- [ ] Timeout handling works

### Frontend Testing:
- [ ] API service imports correctly
- [ ] Chatbot connects to backend
- [ ] Risk analysis uses backend
- [ ] Crop recommendations use backend
- [ ] What-if engine uses backend
- [ ] Fallbacks work when backend down
- [ ] UI remains unchanged
- [ ] No console errors

### Integration Testing:
- [ ] Frontend → Backend communication works
- [ ] Data format matches expectations
- [ ] Loading states display correctly
- [ ] Error states handled gracefully
- [ ] Performance acceptable (<500ms)

---

## 📊 PERFORMANCE CONSIDERATIONS

### API Timeouts:
- Default: 10 seconds
- Health check: 5 seconds
- Adjust in `src/services/api.ts` if needed

### Caching (Future Enhancement):
```typescript
// Add to api.ts
const cache = new Map();

async function cachedApiCall(key: string, fetcher: () => Promise<any>, ttl: number) {
  if (cache.has(key)) {
    const { data, timestamp } = cache.get(key);
    if (Date.now() - timestamp < ttl) {
      return data;
    }
  }
  
  const data = await fetcher();
  cache.set(key, { data, timestamp: Date.now() });
  return data;
}
```

---

## 🔒 SECURITY CONSIDERATIONS

### Current Setup (Development):
- CORS: Enabled for all origins
- Authentication: None
- Rate limiting: None

### Production Requirements:
1. **CORS**: Restrict to frontend domain
2. **Authentication**: Add API key or JWT
3. **Rate Limiting**: Implement per-IP limits
4. **HTTPS**: Use SSL certificates
5. **Input Validation**: Sanitize all inputs

---

## 🚀 DEPLOYMENT

### Backend Deployment:

#### Option 1: Railway
```bash
cd backend
railway login
railway init
railway up
```

Update `.env`:
```env
VITE_API_BASE_URL=https://your-backend.railway.app/api
```

#### Option 2: Heroku
```bash
cd backend
heroku create agrishield-backend
git push heroku main
```

#### Option 3: Docker
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["python", "app.py"]
```

### Frontend Deployment:
No changes needed - just update `VITE_API_BASE_URL` to production backend URL.

---

## 🐛 TROUBLESHOOTING

### Backend Not Starting:
```bash
# Check Python version
python --version  # Should be 3.8+

# Reinstall dependencies
pip install -r requirements.txt --force-reinstall

# Check port availability
netstat -an | findstr :5000
```

### CORS Errors:
```python
# In backend/app.py, update CORS:
CORS(app, origins=['http://localhost:3000'])
```

### API Not Responding:
```bash
# Test backend directly
curl http://localhost:5000/api/health

# Check firewall
# Ensure port 5000 is open
```

### Frontend Can't Connect:
```bash
# Verify API URL in .env
echo $VITE_API_BASE_URL

# Check network tab in browser DevTools
# Look for failed requests
```

---

## 📝 INTEGRATION CHECKLIST

### Pre-Integration:
- [x] Backend API created
- [x] API service layer created
- [x] Fallback mechanisms implemented
- [x] Documentation complete

### Integration Steps:
- [ ] Start backend server
- [ ] Test all endpoints with curl
- [ ] Update `.env` with API URL
- [ ] Integrate chatbot (Phase 1)
- [ ] Test chatbot functionality
- [ ] Integrate risk analysis (Phase 2)
- [ ] Test risk calculations
- [ ] Integrate crop recommendations (Phase 3)
- [ ] Test crop rankings
- [ ] Integrate what-if engine (Phase 4)
- [ ] Test scenario simulations
- [ ] Full end-to-end testing
- [ ] Performance testing
- [ ] Error scenario testing

### Post-Integration:
- [ ] Verify UI unchanged
- [ ] Verify all features working
- [ ] Verify fallbacks working
- [ ] Document any issues
- [ ] Deploy to production

---

## 🎯 SUCCESS CRITERIA

### Integration is successful when:
1. ✅ Backend API responds to all endpoints
2. ✅ Frontend connects to backend
3. ✅ All features use backend data
4. ✅ UI looks exactly the same
5. ✅ No visual changes
6. ✅ Fallbacks work when backend down
7. ✅ Performance is acceptable
8. ✅ No console errors
9. ✅ App is stable and demo-ready

---

## 📞 SUPPORT

### Issues:
- Check `BACKEND_AUDIT.md` for backend details
- Check `PROJECT_STATUS.md` for frontend details
- Review console logs for errors
- Test endpoints individually

### Next Steps:
1. Start backend: `python backend/app.py`
2. Test health: `curl http://localhost:5000/api/health`
3. Start frontend: `npm run dev`
4. Begin Phase 1 integration (chatbot)

---

**Status**: ✅ Ready for Integration  
**Backend**: Fully functional mock API  
**Frontend**: API service layer ready  
**Risk**: Low - Fallbacks ensure stability

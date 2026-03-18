# 🏗️ AgriShield AI - Technical Architecture

## System Overview

AgriShield AI is a React-based climate decision intelligence platform built with TypeScript, featuring real-time weather integration, voice recognition, and AI-powered crop recommendations.

---

## 🎯 Tech Stack

### Core
- **React 19** - UI framework
- **TypeScript 5.8** - Type safety
- **Vite 6.2** - Build tool & dev server

### Styling
- **Tailwind CSS 4.1** - Utility-first CSS
- **Framer Motion 12** - Animations

### State Management
- **React Context API** - Global state
- **localStorage** - Persistence

### APIs & Services
- **Open-Meteo API** - Weather data (free, no key)
- **Web Speech API** - Voice recognition (browser native)
- **Geolocation API** - Location detection (browser native)

---

## 📁 Project Structure

```
agrishield-ai/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Common.tsx       # Sidebar, Header, utilities
│   │   └── WeatherWidget.tsx # Weather display
│   │
│   ├── hooks/               # Custom React hooks
│   │   ├── useWeather.ts    # Weather fetching
│   │   └── useVoiceRecognition.ts # Voice input
│   │
│   ├── pages/               # Main application pages
│   │   ├── LandingPage.tsx  # Marketing/intro page
│   │   ├── Dashboard.tsx    # Main analysis dashboard
│   │   ├── WhatIfEngine.tsx # Scenario simulation
│   │   ├── ResilienceAnalyzer.tsx # Crop comparison
│   │   ├── DistrictOverview.tsx # Regional view
│   │   └── AIAssistant.tsx  # Chatbot interface
│   │
│   ├── constants.ts         # Static data (crops, districts)
│   ├── logic.ts             # Business logic & calculations
│   ├── store.tsx            # Global state management
│   ├── translations.ts      # i18n translations
│   ├── types.ts             # TypeScript interfaces
│   ├── App.tsx              # Root component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
│
├── public/                  # Static assets
├── index.html               # HTML template
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
├── vite.config.ts           # Vite config
└── tailwind.config.js       # Tailwind config
```

---

## 🔄 Data Flow Architecture

### 1. State Management Flow

```
┌─────────────────────────────────────────────────┐
│           AppProvider (store.tsx)               │
│  ┌───────────────────────────────────────────┐  │
│  │  Global State:                            │  │
│  │  - SimulationState (user inputs)          │  │
│  │  - AnalysisResult (computed outputs)      │  │
│  │  - WeatherData (real-time weather)        │  │
│  │  - Language preference                    │  │
│  │  - UI state (page, loading)               │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
                      ↓
        ┌─────────────┴─────────────┐
        ↓                           ↓
   Components                   Custom Hooks
   - Dashboard                  - useWeather
   - AIAssistant               - useVoiceRecognition
   - WhatIfEngine              - useApp (context)
   - etc.
```

### 2. Weather Integration Flow

```
User Opens App
     ↓
Geolocation Request
     ↓
┌────────────────┐
│ useWeather()   │
│ Hook Executes  │
└────────────────┘
     ↓
Get Coordinates
     ↓
Fetch from Open-Meteo API
     ↓
┌────────────────────────┐
│ Weather Data Received  │
│ - Temperature          │
│ - Rainfall             │
│ - Humidity             │
│ - Condition            │
└────────────────────────┘
     ↓
Update Global State
     ↓
┌──────────────────────────┐
│ Auto-update:             │
│ - state.avgTemp          │
│ - state.forecastRain     │
│ - Risk calculations      │
│ - Crop recommendations   │
└──────────────────────────┘
     ↓
UI Re-renders
     ↓
Weather Widget Displays
```

### 3. Voice Recognition Flow

```
User Clicks Mic Button
     ↓
startListening()
     ↓
┌──────────────────────────┐
│ Web Speech API Starts    │
│ - Set language (hi-IN)   │
│ - Start recording        │
└──────────────────────────┘
     ↓
User Speaks
     ↓
Speech Recognition
     ↓
Transcript Generated
     ↓
Update Input Field
     ↓
User Sends Message
     ↓
AI Response Generated
```

### 4. Analysis Calculation Flow

```
User Changes Input
(district, rainfall, temp)
     ↓
updateState() Called
     ↓
State Updated in Context
     ↓
useEffect Triggered
     ↓
┌──────────────────────────┐
│ runFullAnalysis()        │
│ 1. computeRisk()         │
│ 2. rankCrops()           │
│ 3. generateInsights()    │
└──────────────────────────┘
     ↓
Result Stored in State
     ↓
All Components Re-render
     ↓
UI Updates Smoothly
```

---

## 🧩 Core Components

### 1. AppProvider (store.tsx)

**Purpose:** Global state management

**State:**
```typescript
{
  state: SimulationState,      // User inputs
  result: AnalysisResult,       // Computed results
  weather: WeatherData,         // Real-time weather
  language: Language,           // UI language
  currentPage: string,          // Active page
  isAnalyzing: boolean,         // Loading state
  lastUpdate: string            // Timestamp
}
```

**Methods:**
- `updateState()` - Update simulation parameters
- `runAnalysis()` - Trigger recalculation
- `setLanguage()` - Change UI language
- `setCurrentPage()` - Navigate

**Key Features:**
- Persists to localStorage
- Auto-syncs weather data
- Debounced analysis (300ms)
- Provides context to all components

---

### 2. useWeather Hook

**Purpose:** Fetch and manage real-time weather data

**Flow:**
1. Request geolocation permission
2. Get user coordinates
3. Fetch from Open-Meteo API
4. Parse weather data
5. Update every 30 minutes
6. Fallback on errors

**API Endpoint:**
```
https://api.open-meteo.com/v1/forecast
?latitude={lat}
&longitude={lon}
&current=temperature_2m,relative_humidity_2m,precipitation,weather_code
&timezone=auto
```

**Returns:**
```typescript
{
  temperature: number,
  rainfall: number,
  condition: string,
  humidity: number,
  location: string,
  isLoading: boolean,
  error: string | null
}
```

**Error Handling:**
- Geolocation denied → Use fallback data
- API failure → Use fallback data
- Network error → Use fallback data
- Timeout (10s) → Use fallback data

---

### 3. useVoiceRecognition Hook

**Purpose:** Enable voice input for AI assistant

**Browser API:**
```typescript
const SpeechRecognition = 
  window.SpeechRecognition || 
  window.webkitSpeechRecognition;
```

**Configuration:**
```typescript
recognition.continuous = false;      // Single utterance
recognition.interimResults = false;  // Final only
recognition.lang = 'hi-IN';          // Language
```

**Methods:**
- `startListening()` - Begin recording
- `stopListening()` - End recording
- `resetTranscript()` - Clear text

**Returns:**
```typescript
{
  isListening: boolean,
  transcript: string,
  isSupported: boolean,
  error: string | null,
  startListening: () => void,
  stopListening: () => void,
  resetTranscript: () => void
}
```

**Browser Support:**
- Chrome/Edge: ✅ Full support
- Safari: ✅ Full support
- Firefox: ⚠️ Limited support
- Mobile: ✅ Chrome Android, Safari iOS

---

### 4. Business Logic (logic.ts)

**Core Functions:**

#### computeRisk()
```typescript
function computeRisk(
  state: SimulationState, 
  weatherTemp?: number
): number
```

**Formula:**
```
riskScore = 
  (rainfallDeficit * 0.4) + 
  (tempStress * 0.3) + 
  (monsoonDelay * 0.3)
```

**Factors:**
- Rainfall deficit: Historical vs forecast
- Temperature stress: Deviation from 25°C
- Monsoon delay: Days late (0-30)

#### rankCrops()
```typescript
function rankCrops(
  state: SimulationState
): CropRanking[]
```

**Algorithm:**
1. Calculate yield for each crop
2. Compute risk penalty based on resilience
3. Calculate shield score (yield - penalty)
4. Sort by shield score descending

**Yield Calculation:**
```
yield = baseYield * (
  soilCompatibility * 0.4 +
  rainfallFactor * 0.3 +
  tempFactor * 0.3
)
```

#### generateInsights()
```typescript
function generateInsights(
  state: SimulationState,
  rankings: CropRanking[]
): Insights
```

**Returns:**
- Risk insight (high/stable)
- Best crop recommendation
- Warning (heat/pest)

---

## 🌐 Internationalization (i18n)

### Translation System

**File:** `src/translations.ts`

**Structure:**
```typescript
export const translations = {
  key: {
    en: "English text",
    hi: "हिंदी पाठ",
    hinglish: "Hinglish text"
  }
}
```

**Usage:**
```typescript
import { t } from '../translations';

// In component
const { language } = useApp();
const text = t('dashboard', language);
```

**Helper Function:**
```typescript
export function t(
  key: keyof typeof translations,
  lang: Language
): string {
  return translations[key]?.[lang] || key;
}
```

**Coverage:**
- 200+ translation keys
- All UI elements covered
- Crop names translated
- District names translated
- Error messages translated

---

## 🎨 Styling Architecture

### Tailwind CSS Setup

**Config:** `tailwind.config.js`

**Custom Theme:**
```javascript
{
  colors: {
    primary: '#10b981',  // Emerald green
    // ... other colors
  },
  borderRadius: {
    '2xl': '1rem',
    '3xl': '1.5rem',
    // ... custom radii
  }
}
```

**Utility Classes:**
- `rounded-[2.5rem]` - Extra rounded corners
- `shadow-2xl` - Deep shadows
- `backdrop-blur-sm` - Glass effect
- `tracking-[0.2em]` - Wide letter spacing

### Animation System

**Library:** Framer Motion

**Common Patterns:**

1. **Stagger Children:**
```typescript
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};
```

2. **Fade In:**
```typescript
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};
```

3. **Loading Overlay:**
```typescript
<AnimatePresence>
  {isAnalyzing && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Loading content */}
    </motion.div>
  )}
</AnimatePresence>
```

---

## 🔐 Security & Privacy

### Data Privacy
- ✅ No user data sent to servers
- ✅ All processing done client-side
- ✅ Location data not stored
- ✅ Voice data not recorded
- ✅ localStorage only for preferences

### API Security
- ✅ Open-Meteo: No API key needed
- ✅ HTTPS only
- ✅ No sensitive data in requests
- ✅ Rate limiting handled by browser

### Browser Permissions
- **Geolocation:** Optional, fallback available
- **Microphone:** Optional, text input available
- **localStorage:** Required for persistence

---

## ⚡ Performance Optimizations

### 1. Debounced Calculations
```typescript
useEffect(() => {
  const timer = setTimeout(() => {
    setResult(runFullAnalysis(state));
  }, 300);
  return () => clearTimeout(timer);
}, [state]);
```

### 2. Memoization
```typescript
const memoizedResult = useMemo(
  () => runFullAnalysis(state),
  [state]
);
```

### 3. Lazy Loading
- Components loaded on demand
- Images optimized
- Code splitting by route

### 4. Efficient Re-renders
- Context split by concern
- useCallback for functions
- React.memo for pure components

---

## 🧪 Testing Strategy

### Unit Tests (Recommended)
```typescript
// logic.test.ts
describe('computeRisk', () => {
  it('should calculate risk correctly', () => {
    const state = { /* ... */ };
    const risk = computeRisk(state);
    expect(risk).toBe(45);
  });
});
```

### Integration Tests
```typescript
// Dashboard.test.tsx
describe('Dashboard', () => {
  it('should update risk on slider change', () => {
    render(<Dashboard />);
    // Test slider interaction
  });
});
```

### E2E Tests (Recommended)
```typescript
// e2e/dashboard.spec.ts
test('complete analysis flow', async ({ page }) => {
  await page.goto('/dashboard');
  await page.click('[data-testid="district-select"]');
  // ... test full flow
});
```

---

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

**Output:** `dist/` folder

### Environment Variables
None required! All APIs are free and public.

### Hosting Options
- **Vercel** (Recommended)
- **Netlify**
- **GitHub Pages**
- **AWS S3 + CloudFront**

### Build Optimization
- Tree shaking enabled
- Code splitting automatic
- CSS purging via Tailwind
- Asset optimization via Vite

---

## 📊 Monitoring & Analytics

### Recommended Tools
- **Sentry** - Error tracking
- **Google Analytics** - Usage analytics
- **LogRocket** - Session replay
- **Lighthouse** - Performance monitoring

### Key Metrics to Track
- Page load time
- Time to interactive
- API response times
- Error rates
- User engagement

---

## 🔧 Development Workflow

### Local Development
```bash
npm run dev
```

### Type Checking
```bash
npm run lint
```

### Build
```bash
npm run build
```

### Preview Build
```bash
npm run preview
```

---

## 🐛 Debugging

### React DevTools
- Install React DevTools extension
- Inspect component tree
- View context values
- Profile performance

### Network Tab
- Monitor API calls
- Check weather API responses
- Verify CORS

### Console Logs
```typescript
// Weather debugging
console.log('Weather data:', weather);

// State debugging
console.log('Current state:', state);

// Voice debugging
console.log('Transcript:', transcript);
```

---

## 🔮 Future Architecture Improvements

### 1. Backend API
- User authentication
- Data persistence
- Historical analysis
- Multi-farm support

### 2. Database
- PostgreSQL for user data
- Redis for caching
- TimescaleDB for time-series

### 3. Real-time Updates
- WebSocket for live weather
- Server-sent events for alerts
- Push notifications

### 4. Microservices
- Weather service
- Analysis service
- Recommendation service
- Notification service

### 5. Mobile App
- React Native
- Offline-first architecture
- Native voice recognition
- Camera for crop health

---

## 📚 Additional Resources

### Documentation
- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Framer Motion Docs](https://www.framer.com/motion)

### APIs
- [Open-Meteo API](https://open-meteo.com/en/docs)
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)

---

## 🤝 Contributing

### Code Style
- Use TypeScript strict mode
- Follow ESLint rules
- Use Prettier for formatting
- Write meaningful comments

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes
git add .
git commit -m "feat: add new feature"

# Push and create PR
git push origin feature/new-feature
```

### Commit Convention
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting
- `refactor:` Code restructuring
- `test:` Tests
- `chore:` Maintenance

---

## 📝 License

MIT License - Feel free to use and modify!

---

**Built with ❤️ for farmers by developers**

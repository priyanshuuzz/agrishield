# 🌾 AgriShield AI - Climate Decision Intelligence Platform

> **Production-Ready SaaS Platform for Smart Farming**

AgriShield AI is an intelligent agricultural decision support system that helps farmers make data-driven crop choices based on real-time weather, climate risk analysis, and AI-powered recommendations.

![Version](https://img.shields.io/badge/version-2.0-green)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## ✨ Key Features

### 🌦️ Real-Time Weather Integration
- Auto-detects user location via geolocation
- Fetches live weather data (temperature, rainfall, humidity)
- Updates every 30 minutes automatically
- Integrates weather into risk calculations
- Beautiful weather widget on dashboard

### 🎤 Voice Assistant
- Speak your questions in Hinglish, Hindi, or English
- Hands-free operation for farmers in the field
- Instant speech-to-text conversion
- Works on mobile and desktop browsers

### 🤖 Context-Aware AI Chatbot
- Understands your farm parameters
- Uses real-time weather in responses
- Provides crop recommendations
- Explains risk scores
- Answers "what-if" questions

### 📊 Intelligent Risk Analysis
- Real-time climate risk scoring (0-100)
- Rainfall deficit calculation
- Temperature stress analysis
- Monsoon delay impact
- Visual risk gauges with animations

### 🌱 Smart Crop Recommendations
- Ranks crops by suitability
- Considers soil type, weather, and resilience
- Shows predicted yields
- Provides resilience scores (1-5 stars)
- Explains why each crop is recommended

### 🔬 What-If Scenario Engine
- Test drought scenarios (-50% to +50% rainfall)
- Simulate heatwaves (-5°C to +10°C)
- Model monsoon delays (0-45 days)
- Compare before/after risk scores
- See how crop rankings change

### 🛡️ Resilience Analyzer
- Compare crop durability profiles
- View drought, heat, and pest resilience
- Check soil compatibility
- Get AI optimization suggestions

### 🗺️ District Overview
- Monitor multiple districts
- Regional risk heatmaps
- Vulnerability index
- Satellite intelligence integration

### 🌐 Multi-Language Support
- **Hinglish** - Mix of Hindi and English (Default)
- **Hindi** - Pure Hindi interface
- **English** - Pure English interface
- Instant language switching
- 200+ translated UI elements

### ⚡ Real-Time Updates
- No page reloads needed
- Smooth animations (<500ms)
- Loading indicators
- Instant feedback
- Optimistic UI updates

---

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/agrishield-ai.git

# Navigate to project
cd agrishield-ai

# Install dependencies
npm install
```

### Weather API Setup (Required)

The app uses OpenWeatherMap API for real-time weather data.

**Quick Setup (2 minutes):**

1. **Get free API key:** https://openweathermap.org/api
2. **Create `.env` file** in project root
3. **Add your key:**
   ```env
   VITE_OPENWEATHER_API_KEY=your_api_key_here
   ```
4. **Start the app:**
   ```bash
   npm run dev
   ```

📖 **Detailed guide:** See [WEATHER_SETUP.md](WEATHER_SETUP.md)

### First Time Setup

1. **Allow Location Access** - Click "Allow" when browser asks for location
2. **Select Language** - Choose Hinglish/Hindi/English in sidebar
3. **Explore Dashboard** - See your risk score and recommendations with real-time weather
4. **Try Voice Input** - Click microphone in AI Assistant
5. **Test Scenarios** - Use What-If Engine to simulate weather changes

The app will open at `http://localhost:3000`

---

## 📖 Documentation

- **[Quick Start Guide](QUICK_START.md)** - User guide for farmers
- **[Upgrade Summary](UPGRADE_SUMMARY.md)** - Complete feature list
- **[Architecture](ARCHITECTURE.md)** - Technical documentation for developers

---

## 🎯 Use Cases

### For Farmers
- **Crop Selection:** Get AI recommendations for best crops
- **Risk Assessment:** Understand climate risks before planting
- **Scenario Planning:** Test "what-if" scenarios for different weather
- **Voice Queries:** Ask questions hands-free while working
- **Multi-language:** Use in your preferred language

### For Agricultural Advisors
- **District Monitoring:** Track risk across multiple regions
- **Data-Driven Advice:** Provide evidence-based recommendations
- **Scenario Analysis:** Show farmers impact of different choices
- **Report Generation:** Export analysis for documentation

### For Researchers
- **Climate Impact:** Study crop resilience under stress
- **Yield Prediction:** Model harvest outcomes
- **Risk Modeling:** Analyze climate vulnerability
- **Data Visualization:** Interactive charts and gauges

---

## 🛠️ Technology Stack

### Frontend
- **React 19** - Modern UI framework
- **TypeScript 5.8** - Type-safe development
- **Tailwind CSS 4.1** - Utility-first styling
- **Framer Motion 12** - Smooth animations
- **Vite 6.2** - Fast build tool

### APIs & Services
- **Open-Meteo API** - Free weather data (no API key needed)
- **Web Speech API** - Browser-native voice recognition
- **Geolocation API** - Browser-native location detection

### State Management
- **React Context API** - Global state
- **localStorage** - Data persistence

---

## 📱 Browser Support

| Browser | Desktop | Mobile | Voice Input |
|---------|---------|--------|-------------|
| Chrome  | ✅ Full | ✅ Full | ✅ Yes |
| Edge    | ✅ Full | ✅ Full | ✅ Yes |
| Safari  | ✅ Full | ✅ Full | ✅ Yes |
| Firefox | ✅ Full | ✅ Full | ⚠️ Limited |

---

## 🎨 Screenshots

### Dashboard
![Dashboard](https://via.placeholder.com/800x400?text=Dashboard+Screenshot)
*Real-time risk analysis with weather integration*

### AI Assistant
![AI Assistant](https://via.placeholder.com/800x400?text=AI+Assistant+Screenshot)
*Voice-enabled chatbot with context-aware responses*

### What-If Engine
![What-If Engine](https://via.placeholder.com/800x400?text=What-If+Engine+Screenshot)
*Scenario simulation with before/after comparison*

---

## 🔧 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run lint

# Clean build artifacts
npm run clean
```

### Project Structure

```
src/
├── components/       # Reusable UI components
├── hooks/           # Custom React hooks
├── pages/           # Main application pages
├── constants.ts     # Static data
├── logic.ts         # Business logic
├── store.tsx        # State management
├── translations.ts  # i18n translations
└── types.ts         # TypeScript types
```

---

## 🌟 Key Highlights

### Production-Ready Features
✅ Real-time weather integration  
✅ Voice recognition (3 languages)  
✅ Context-aware AI chatbot  
✅ Smooth animations & loading states  
✅ Error handling & fallbacks  
✅ Mobile-responsive design  
✅ Offline-capable (cached data)  
✅ No backend required  
✅ Free APIs (no costs)  

### User Experience
✅ <500ms response time  
✅ Intuitive interface  
✅ Clear feedback messages  
✅ Loading indicators  
✅ Smooth transitions  
✅ Accessible design  

### Data Integrity
✅ Single source of truth  
✅ Consistent state across pages  
✅ Persistent storage  
✅ Real-time synchronization  

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contribution Guidelines
- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation
- Ensure code passes linting

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Open-Meteo** - Free weather API
- **React Team** - Amazing framework
- **Tailwind CSS** - Beautiful styling
- **Framer Motion** - Smooth animations
- **All farmers** - Who inspired this project

---

## 📞 Support

### Need Help?
- 📖 Read the [Quick Start Guide](QUICK_START.md)
- 🏗️ Check [Architecture Docs](ARCHITECTURE.md)
- 🐛 Report issues on GitHub
- 💬 Join our community discussions

### Contact
- **Email:** support@agrishield.ai
- **Twitter:** @AgriShieldAI
- **Website:** https://agrishield.ai

---

## 🗺️ Roadmap

### Version 2.1 (Coming Soon)
- [ ] Text-to-speech for AI responses
- [ ] Weather alerts & notifications
- [ ] Historical weather trends (7 days)
- [ ] Crop calendar with sowing dates
- [ ] PDF report generation

### Version 3.0 (Future)
- [ ] User authentication
- [ ] Multi-farm management
- [ ] Social sharing features
- [ ] Mobile app (React Native)
- [ ] Offline-first PWA
- [ ] Backend API integration

---

## 📊 Stats

- **200+** Translation keys
- **6** Main pages
- **10+** Custom hooks
- **50+** Reusable components
- **3** Languages supported
- **7** Districts monitored
- **6** Crop varieties analyzed

---

## 🎓 Learn More

### Resources
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Open-Meteo API](https://open-meteo.com/en/docs)

### Related Projects
- [Climate FieldView](https://climate.com/fieldview)
- [FarmLogs](https://farmlogs.com)
- [Cropio](https://cropio.com)

---

## ⭐ Star History

If you find this project useful, please consider giving it a star on GitHub!

[![Star History Chart](https://api.star-history.com/svg?repos=yourusername/agrishield-ai&type=Date)](https://star-history.com/#yourusername/agrishield-ai&Date)

---

## 🌾 Built with ❤️ for Farmers

**AgriShield AI** - Empowering farmers with climate intelligence

---

**Made in India 🇮🇳 | Open Source | Free Forever**

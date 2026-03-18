# ⚡ Weather Setup - Quick Start (2 Minutes)

## 🎯 Goal
Get real-time weather on your AgriShield AI dashboard

---

## 📝 Steps

### 1. Get API Key (1 minute)
```
1. Go to: https://openweathermap.org/api
2. Click "Sign Up"
3. Verify email
4. Copy your API key from: https://home.openweathermap.org/api_keys
```

### 2. Add to Project (30 seconds)
```bash
# Open .env file and paste your key:
VITE_OPENWEATHER_API_KEY=your_actual_key_here
```

### 3. Restart Server (30 seconds)
```bash
# Stop server (Ctrl+C), then:
npm run dev
```

---

## ✅ Done!

Open the app and:
- Allow location when browser asks
- See your city's real-time weather
- Temperature, rainfall, humidity all live!

---

## 🆘 Issues?

**Weather shows Delhi?**
→ You denied location. Click the 🔒 icon in browser address bar → Allow location → Refresh

**"401 Error"?**
→ Wait 10 minutes after creating API key (activation time)

**Still not working?**
→ Check `.env` file has no extra spaces around the key

---

## 📖 Full Guide
See `WEATHER_SETUP.md` for detailed instructions and troubleshooting.

---

**That's it! Weather is now live! 🌦️**

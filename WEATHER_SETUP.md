# 🌦️ Weather API Setup Guide

## Quick Setup (5 minutes)

### Step 1: Get Your Free API Key

1. **Go to OpenWeatherMap:**
   - Visit: https://openweathermap.org/api
   - Click "Sign Up" (top right)

2. **Create Account:**
   - Enter your email
   - Choose a username
   - Create a password
   - Agree to terms
   - Click "Create Account"

3. **Verify Email:**
   - Check your email inbox
   - Click the verification link
   - Wait for confirmation

4. **Get API Key:**
   - Log in to your account
   - Go to: https://home.openweathermap.org/api_keys
   - You'll see a default API key already created
   - Copy the API key (looks like: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`)

### Step 2: Add API Key to Your Project

1. **Open the `.env` file** in your project root
2. **Replace `your_api_key_here`** with your actual API key:

```env
VITE_OPENWEATHER_API_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

3. **Save the file**

### Step 3: Restart Development Server

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

---

## ✅ Testing

1. **Open the app** in your browser
2. **Allow location access** when prompted
3. **Check the Dashboard** - you should see:
   - Your city name
   - Current temperature
   - Rainfall amount
   - Humidity percentage
   - Weather condition

---

## 🔧 Troubleshooting

### Problem: "401 Unauthorized" Error

**Cause:** Invalid or missing API key

**Solution:**
1. Check that your API key is correct in `.env`
2. Make sure there are no extra spaces
3. Wait 10-15 minutes after creating the key (activation time)
4. Restart the dev server

### Problem: Weather shows "Delhi" instead of my location

**Cause:** Location permission denied or geolocation failed

**Solution:**
1. Check browser permissions (Settings → Site Settings → Location)
2. Click "Allow" when browser asks for location
3. Refresh the page
4. If still fails, the app will use Delhi as fallback (this is normal)

### Problem: "Fetching your location..." never finishes

**Cause:** Geolocation timeout or API issue

**Solution:**
1. Check your internet connection
2. Try refreshing the page
3. Check browser console for errors (F12)
4. The app will automatically fallback to Delhi after 5 seconds

### Problem: Weather data not updating

**Cause:** API rate limit or network issue

**Solution:**
1. Free tier allows 60 calls/minute (more than enough)
2. Weather updates every 30 minutes automatically
3. Refresh the page to force update
4. Check browser console for errors

---

## 📊 API Limits (Free Tier)

- **Calls per minute:** 60
- **Calls per day:** Unlimited
- **Data update frequency:** Every 10 minutes
- **Cost:** FREE forever

**Note:** The app only makes 1 call on page load, then refreshes every 30 minutes. You'll never hit the limit!

---

## 🔐 Security Notes

### ✅ Safe Practices:
- `.env` file is in `.gitignore` (not committed to Git)
- API key is only used client-side for weather data
- Free tier has no billing risk

### ⚠️ Important:
- **Never commit `.env` to Git**
- **Don't share your API key publicly**
- **Use `.env.example` for documentation only**

---

## 🌍 Supported Locations

OpenWeatherMap supports:
- ✅ All major cities worldwide
- ✅ Latitude/longitude coordinates
- ✅ 200,000+ cities in database
- ✅ Accurate data for India (all states)

---

## 📱 Browser Compatibility

### Geolocation Support:
- ✅ Chrome/Edge (Desktop & Mobile)
- ✅ Firefox (Desktop & Mobile)
- ✅ Safari (Desktop & Mobile)
- ✅ Opera
- ⚠️ Requires HTTPS (or localhost)

### Fallback Behavior:
If geolocation fails:
1. App shows "Fetching your location..."
2. After 5 seconds, switches to Delhi
3. Weather data still loads normally
4. No errors shown to user

---

## 🎯 What the Weather System Does

### On Page Load:
1. **Detects location** via browser geolocation
2. **Shows loading state:** "Fetching your location..."
3. **Fetches weather** from OpenWeatherMap API
4. **Updates UI** with real data:
   - City name
   - Temperature (°C)
   - Rainfall (mm)
   - Humidity (%)
   - Weather condition
5. **Integrates with risk calculation** automatically

### Auto-Refresh:
- Updates every 30 minutes
- No page reload needed
- Smooth transitions
- Always shows latest data

### Error Handling:
- Location denied → Use Delhi
- API fails → Show default values
- Network error → Use cached data
- Never breaks the UI

---

## 🚀 Advanced: Custom Default Location

Want to change the fallback city from Delhi?

**Edit:** `src/hooks/useWeather.ts`

```typescript
// Change these coordinates:
const DELHI_COORDS = {
  lat: 28.7041,  // Your city latitude
  lon: 77.1025   // Your city longitude
};

// And update the fallback name:
const FALLBACK_WEATHER: WeatherData = {
  // ...
  location: 'Your City',  // Change this
  // ...
};
```

**Find coordinates:**
- Google Maps: Right-click → "What's here?"
- Or use: https://www.latlong.net/

---

## 📞 Need Help?

### OpenWeatherMap Support:
- Docs: https://openweathermap.org/api
- FAQ: https://openweathermap.org/faq
- Support: https://openweathermap.org/support

### Common Questions:

**Q: Is it really free?**
A: Yes! Free tier is unlimited for personal use.

**Q: Do I need a credit card?**
A: No! Just email verification.

**Q: How accurate is the data?**
A: Very accurate. Used by millions of apps worldwide.

**Q: Can I use it in production?**
A: Yes! Free tier is production-ready.

**Q: What if I exceed limits?**
A: You won't. App only calls API once per 30 minutes.

---

## ✨ Features Enabled

With weather integration, you get:

✅ **Real-time location detection**
✅ **Live weather data**
✅ **Automatic updates every 30 minutes**
✅ **Smart fallback to Delhi**
✅ **No page reloads needed**
✅ **Integrated with risk calculations**
✅ **Beautiful animated UI**
✅ **Error handling**
✅ **Loading states**
✅ **Multi-language support**

---

**Setup complete! Your AgriShield AI now has real-time weather intelligence! 🌾**

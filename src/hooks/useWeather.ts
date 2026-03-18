import { useState, useEffect } from 'react';

export interface WeatherData {
  temperature: number;
  rainfall: number;
  condition: string;
  humidity: number;
  location: string;
  isLoading: boolean;
  error: string | null;
}

// OpenWeatherMap API key - Replace with your actual key
// Get free key from: https://openweathermap.org/api
const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || 'demo_key';

// Fallback weather for Delhi
const FALLBACK_WEATHER: WeatherData = {
  temperature: 28,
  rainfall: 0,
  condition: 'Clear',
  humidity: 65,
  location: 'Delhi',
  isLoading: false,
  error: null
};

// Default coordinates for Delhi (fallback)
const DELHI_COORDS = {
  lat: 28.7041,
  lon: 77.1025
};

export const useWeather = () => {
  const [weather, setWeather] = useState<WeatherData>({
    ...FALLBACK_WEATHER,
    location: 'Fetching your location...',
    isLoading: true
  });

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        // Step 1: Get user location
        if (!navigator.geolocation) {
          console.log('Geolocation not supported → using Delhi');
          await fetchWeatherByCoords(DELHI_COORDS.lat, DELHI_COORDS.lon);
          return;
        }

        // Request geolocation with timeout
        navigator.geolocation.getCurrentPosition(
          // Success callback
          async (position) => {
            const { latitude, longitude } = position.coords;
            console.log('Location detected:', latitude, longitude);
            await fetchWeatherByCoords(latitude, longitude);
          },
          // Error callback
          async (error) => {
            console.log('Location denied or failed:', error.message);
            console.log('Using fallback location: Delhi');
            await fetchWeatherByCoords(DELHI_COORDS.lat, DELHI_COORDS.lon);
          },
          // Options
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          }
        );
      } catch (error) {
        console.error('Geolocation error:', error);
        await fetchWeatherByCoords(DELHI_COORDS.lat, DELHI_COORDS.lon);
      }
    };

    const fetchWeatherByCoords = async (lat: number, lon: number) => {
      try {
        setWeather(prev => ({
          ...prev,
          location: 'Fetching weather data...',
          isLoading: true
        }));

        // Fetch from OpenWeatherMap API
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_API_KEY}`
        );

        if (!response.ok) {
          throw new Error(`Weather API error: ${response.status}`);
        }

        const data = await response.json();
        
        // Extract rainfall (optional field)
        const rainfall = data.rain ? (data.rain['1h'] || data.rain['3h'] || 0) : 0;

        // Update state with real data
        setWeather({
          temperature: Math.round(data.main.temp),
          rainfall: rainfall,
          condition: data.weather[0].main,
          humidity: data.main.humidity,
          location: data.name,
          isLoading: false,
          error: null
        });

        console.log('Weather data loaded:', data.name);
      } catch (error) {
        console.error('Weather fetch failed:', error);
        
        // Use fallback data but don't break UI
        setWeather({
          ...FALLBACK_WEATHER,
          isLoading: false,
          error: 'Using default weather data'
        });
      }
    };

    // Initial fetch
    fetchWeatherData();
    
    // Refresh every 30 minutes
    const interval = setInterval(fetchWeatherData, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return weather;
};

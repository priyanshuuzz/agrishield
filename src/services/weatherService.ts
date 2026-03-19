export const getWeather = async (location: string) => {
  try {
    const res = await fetch(`https://api.weatherapi.com/v1/current.json?key=55dd10545d664f91a7e132129261903&q=${encodeURIComponent(location)}&aqi=yes`, {
      mode: 'cors'
    });
    if (!res.ok) {
      console.error("Weather API error:", res.status, res.statusText);
      throw new Error("Weather API failed");
    }
    return res.json();
  } catch (err) {
    console.error("Weather API error:", err);
    throw err;
  }
};

export const getForecast = async (location: string, days: number = 7) => {
  try {
    const res = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=55dd10545d664f91a7e132129261903&q=${encodeURIComponent(location)}&days=${days}&aqi=no`, {
      mode: 'cors'
    });
    if (!res.ok) {
      console.error("Forecast API error:", res.status, res.statusText);
      throw new Error("Forecast API failed");
    }
    return res.json();
  } catch (err) {
    console.error("Forecast API error:", err);
    throw err;
  }
};

export const analyzeTrend = (forecastData: any) => {
  if (!forecastData?.forecast?.forecastday) return null;
  
  const days = forecastData.forecast.forecastday;
  const totalRain = days.reduce((sum: number, d: any) => sum + (d.day.totalprecip_mm || 0), 0);
  const avgTemp = days.reduce((sum: number, d: any) => sum + (d.day.avgtemp_c || 0), 0) / days.length;
  const maxTemp = Math.max(...days.map((d: any) => d.day.maxtemp_c || 0));
  const minTemp = Math.min(...days.map((d: any) => d.day.mintemp_c || 0));
  
  return {
    rainTrend: Math.round(totalRain),
    tempTrend: Math.round(avgTemp * 10) / 10,
    maxTemp: Math.round(maxTemp * 10) / 10,
    minTemp: Math.round(minTemp * 10) / 10,
    days: days.length
  };
};

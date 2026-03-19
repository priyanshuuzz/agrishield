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

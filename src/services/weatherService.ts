export const getWeather = async (location: string) => {
  const res = await fetch(`http://api.weatherapi.com/v1/current.json?key=55dd10545d664f91a7e132129261903&q=${encodeURIComponent(location)}&aqi=yes`);
  if (!res.ok) throw new Error("Weather API failed");
  return res.json();
};

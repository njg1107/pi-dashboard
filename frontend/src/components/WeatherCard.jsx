fetch("http://localhost:8000/api/weather")
  .then(res => (res.ok ? res.json() : null))
  .then(data => setWeather(data));

export default function WeatherCard({ weather }) {
  return (
    <div>
      <p className="text-6xl">{weather.temp}°F</p>
      <p className="text-6xl">{weather.condition}</p>
    </div>
  );
}
//
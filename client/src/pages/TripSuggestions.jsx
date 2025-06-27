import React, { useState, useEffect } from 'react';
import styles from '../styles/TripSuggestions.module.css';
import { FaHotel, FaCloudSun, FaShoppingBag, FaUtensils, FaCalendarAlt, FaRupeeSign, FaDownload } from 'react-icons/fa';
import Footer from '../components/Footer/Footer';
import { useUser } from '../UserContext';
import { getTripSuggestions } from '../utils/tripPlannerAPI';

const TripSuggestions = () => {
  const { tripDetails } = useUser();
  const [weather, setWeather] = useState([]);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [weatherError, setWeatherError] = useState(null);

  const [deepSeekResult, setDeepSeekResult] = useState(null);
  const [loadingDeepSeek, setLoadingDeepSeek] = useState(false);
  const [deepSeekError, setDeepSeekError] = useState(null);

  const city = tripDetails.city || '';
  const checkin = tripDetails.checkin || '';
  const checkout = tripDetails.checkout || '';
  const preference = tripDetails.preference || '';
  const budget = tripDetails.budget || 10000;

  useEffect(() => {
    const fetchWeather = async () => {
      const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
      if (!apiKey) {
        setWeatherError("OpenWeatherMap API key not found. Please add it to your client/.env file.");
        setLoadingWeather(false);
        return;
      }
      setLoadingWeather(true);
      try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&cnt=40&appid=${apiKey}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch weather data.');
        }
        const data = await response.json();
        const dailyForecasts = data.list.filter(item => item.dt_txt.includes("12:00:00")).slice(0, 4);
        if (dailyForecasts.length === 0 && data.list.length > 0) {
          const seenDays = new Set();
          const fallbackForecasts = [];
          for (const item of data.list) {
            const day = new Date(item.dt * 1000).toISOString().split('T')[0];
            if (!seenDays.has(day) && fallbackForecasts.length < 4) {
              fallbackForecasts.push(item);
              seenDays.add(day);
            }
          }
          dailyForecasts.push(...fallbackForecasts);
        }
        const formattedWeather = dailyForecasts.map(item => ({
          day: new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' }),
          temp: `${Math.round(item.main.temp)}°C`,
          icon: item.weather[0].main,
        }));
        setWeather(formattedWeather);
      } catch (err) {
        setWeatherError(err.message);
      } finally {
        setLoadingWeather(false);
      }
    };
    fetchWeather();
  }, [city]);

  useEffect(() => {
    if (!city || !checkin || !checkout || !preference || !budget) return;
    setLoadingDeepSeek(true);
    setDeepSeekError(null);
    setDeepSeekResult(null);
    getTripSuggestions({ city, checkIn: checkin, checkOut: checkout, preference, budget })
      .then(result => {
        let parsed = null;
        if (typeof result === 'string') {
          // Try to extract JSON from within markdown or extra text
          const firstBrace = result.indexOf('{');
          const lastBrace = result.lastIndexOf('}');
          if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
            const jsonString = result.substring(firstBrace, lastBrace + 1);
            try {
              parsed = JSON.parse(jsonString);
            } catch (e) {
              setDeepSeekResult(result);
              return;
            }
            setDeepSeekResult(parsed);
          } else {
            setDeepSeekResult(result);
          }
        } else {
          setDeepSeekResult(result);
        }
      })
      .catch(err => setDeepSeekError(err.message))
      .finally(() => setLoadingDeepSeek(false));
  }, [city, checkin, checkout, preference, budget]);

  const weatherIconMap = {
    Clear: '☀️', Clouds: '⛅', Rain: '🌧️', Drizzle: '🌦️', Thunderstorm: '⛈️',
    Snow: '❄️', Mist: '🌫️', Smoke: '🌫️', Haze: '🌫️', Dust: '🌫️', Fog: '🌫️',
    Sand: '🌫️', Ash: '🌫️', Squall: '🌬️', Tornado: '🌪️'
  };

  return (
    <>
      <div className={styles.pageContainer}>
        <h1 className={styles.mainTitle}>Your Trip Suggestions</h1>
        <p className={styles.mainSubtitle}>Personalized recommendations for your upcoming adventure</p>

        <div className={styles.card}>
          <h2>AI Trip Plan (DeepSeek)</h2>
          <div style={{ marginBottom: '1rem' }}>
            <b>City:</b> {city} <br/>
            <b>Check-in:</b> {checkin} <br/>
            <b>Check-out:</b> {checkout} <br/>
            <b>Preference:</b> {preference} <br/>
            <b>Budget:</b> ₹{budget}
          </div>

          {loadingDeepSeek ? (
            <p>Loading AI trip plan...</p>
          ) : deepSeekError ? (
            <p style={{ color: 'red' }}>{deepSeekError}</p>
          ) : deepSeekResult && typeof deepSeekResult === 'object' ? (
            <>
              {deepSeekResult.hotel && (
                <section>
                  <h3>Hotel</h3>
                  <p><b>{deepSeekResult.hotel.name}</b></p>
                  <p>{deepSeekResult.hotel.type}</p>
                  <p><b>Cost:</b> {deepSeekResult.hotel.totalCost}</p>
                  <p><b>Features:</b> {deepSeekResult.hotel.features?.join(', ')}</p>
                </section>
              )}

              {deepSeekResult.meals && (
                <section>
                  <h3>Meals</h3>
                  {Object.entries(deepSeekResult.meals).map(([mealType, mealInfo]) => (
                    <div key={mealType} style={{ marginBottom: '0.5em' }}>
                      <b>{mealType.charAt(0).toUpperCase() + mealType.slice(1)}:</b> {mealInfo.suggestion} - {mealInfo.costPerDay}<br/>
                      <i>Recommended: {mealInfo.recommendedSpots?.join(', ')}</i>
                    </div>
                  ))}
                </section>
              )}

              {deepSeekResult.itinerary && (
                <section className={styles.itinerarySection}>
                {Object.entries(deepSeekResult.itinerary).map(([dayKey, details]) => (
                  <div className={styles.itineraryDayCard} key={dayKey}>
                    <h4>{dayKey.toUpperCase()}</h4>
                    <ul>
                      {Object.entries(details).map(([k, v]) => (
                        <li key={k}><b>{k}:</b> {v}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </section>
              
              
              )}

              {deepSeekResult.estimatedTotal && (
                <section>
                  <h3>Estimated Budget</h3>
                  <ul>
                    {Object.entries(deepSeekResult.estimatedTotal.breakdown || {}).map(([k, v]) => (
                      <li key={k}><b>{k}:</b> {v}</li>
                    ))}
                  </ul>
                  <p><b>Total:</b> {deepSeekResult.estimatedTotal.total}</p>
                </section>
              )}
            </>
          ) : typeof deepSeekResult === 'string' ? (
            <pre>{deepSeekResult}</pre>
          ) : null}
        </div>

        <div className={styles.topGrid}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}><FaCloudSun /> Weather Forecast</h2>
            <input type="text" value={city} readOnly style={{ padding: '0.5rem' }} />
            {loadingWeather ? (
              <p>Loading weather forecast...</p>
            ) : weatherError ? (
              <p>{weatherError}</p>
            ) : (
              <ul className={styles.weatherList}>
                {weather.map(day => (
                  <li key={day.day}><span>{day.day}</span> <span>{weatherIconMap[day.icon] || '❓'} {day.temp}</span></li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className={styles.downloadSection}>
          <button className={styles.downloadBtn}><FaDownload /> Download Trip Plan (PDF)</button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TripSuggestions;

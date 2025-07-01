import React, { useState, useEffect, useRef } from 'react';
import styles from '../styles/TripSuggestions.module.css';
import { FaHotel, FaCloudSun, FaShoppingBag, FaUtensils, FaCalendarAlt, FaRupeeSign, FaDownload, FaSuitcase, FaCheckCircle } from 'react-icons/fa';
import Footer from '../components/Footer/Footer';
import { useUser } from '../UserContext';
import { getTripSuggestions } from '../utils/tripPlannerAPI';
import { fetchPredictHQEvents, getEventCategoryIcon, formatEventDate, getAttendanceLabel } from '../utils/predicthqAPI';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { fetchMealImage as fetchMealImageFromAPI } from '../utils/mealImageAPI';

const TripSuggestions = () => {
  const { tripDetails, user } = useUser();
  const pageRef = useRef(null);
  const [weather, setWeather] = useState([]);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [weatherError, setWeatherError] = useState(null);

  const [deepSeekResult, setDeepSeekResult] = useState(null);
  const [loadingDeepSeek, setLoadingDeepSeek] = useState(false);
  const [deepSeekError, setDeepSeekError] = useState(null);

  const [phqEvents, setPhqEvents] = useState([]);
  const [loadingPhq, setLoadingPhq] = useState(false);
  const [phqErr, setPhqErr] = useState(null);

  const [savingTrip, setSavingTrip] = useState(false);
  const [tripSaved, setTripSaved] = useState(false);

  const [hotelImage, setHotelImage] = useState('');

  const [mealImages, setMealImages] = useState({});

  const city = tripDetails.city || '';
  const checkin = tripDetails.checkin || '';
  const checkout = tripDetails.checkout || '';
  const preference = tripDetails.preference || '';
  const budget = tripDetails.budget || 10000;

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Function to save trip to MongoDB
  const saveTrip = async (suggestions) => {
    if (!user?.uid) {
      console.log('No user logged in, skipping trip save');
      return;
    }

    setSavingTrip(true);
    try {
      const requestBody = {
        userId: user.uid,
        city,
        checkIn: checkin,
        checkOut: checkout,
        preference,
        budget,
        suggestions
      };
      
      console.log('Sending saveTrip request:', requestBody);
      
      const response = await fetch(`${backendUrl}/api/saveTrip`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const result = await response.json();
        setTripSaved(true);
        console.log('Trip saved successfully:', result);
      } else {
        const errorData = await response.json();
        console.error('Failed to save trip:', response.status, errorData);
      }
    } catch (error) {
      console.error('Error saving trip:', error);
    } finally {
      setSavingTrip(false);
    }
  };

  const fetchHotelImage = async (hotelName, city) => {
    try {
      const response = await fetch(`${backendUrl}/api/fetchHotelImage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hotelName, city }),
      });
      const data = await response.json();
      return data.imageUrl || '';
    } catch (err) {
      console.error('Error fetching hotel image:', err.message);
      return '';
    }
  };

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
          description: item.weather[0].description
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
    setTripSaved(false);
    setHotelImage('');
    
    getTripSuggestions({ city, checkIn: checkin, checkOut: checkout, preference, budget })
      .then(async result => {
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
            // Save trip after successful parsing
            saveTrip(parsed);
          } else {
            setDeepSeekResult(result);
            // Save trip even if it's a string response
            saveTrip(result);
          }
        } else {
          setDeepSeekResult(result);
          // Save trip after successful response
          saveTrip(result);
        }
        // Fetch hotel image if hotel name exists
        const hotelName = parsed?.hotel?.name || result?.hotel?.name;
        if (hotelName) {
          const img = await fetchHotelImage(hotelName, city);
          setHotelImage(img);
        }
      })
      .catch(err => setDeepSeekError(err.message))
      .finally(() => setLoadingDeepSeek(false));
  }, [city, checkin, checkout, preference, budget]);

  useEffect(() => {
    if (!city || !checkin || !checkout) return;
    setLoadingPhq(true);
    setPhqErr(null);

    fetchPredictHQEvents(city, checkin, checkout)
      .then(setPhqEvents)
      .catch(err => setPhqErr(err.message))
      .finally(() => setLoadingPhq(false));
  }, [city, checkin, checkout]);

  useEffect(() => {
    if (!deepSeekResult?.meals) return;
    const loadImages = async () => {
      const imgs = {};
      for (const [mealType, info] of Object.entries(deepSeekResult.meals)) {
        const q = info.famousDish || info.cuisineType;
        const img = await fetchMealImageFromAPI(q);
        if (img) imgs[mealType] = img;
      }
      setMealImages(imgs);
    };
    loadImages();
  }, [deepSeekResult]);

  const weatherIconMap = {
    Clear: '☀️', Clouds: '⛅', Rain: '🌧️', Drizzle: '��️', Thunderstorm: '⛈️',
    Snow: '❄️', Mist: '🌫️', Smoke: '🌫️', Haze: '🌫️', Dust: '🌫️', Fog: '🌫️',
    Sand: '🌫️', Ash: '🌫️', Squall: '🌬️', Tornado: '🌪️'
  };

  const formatLocal = iso =>
    new Date(iso).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const handleDownloadPdf = async () => {
    if (!pageRef.current) return;

    try {
      const canvas = await html2canvas(pageRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const fileName = `TripPlan_${city}_${checkin}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  return (
    <>
      <div className={styles.pageContainer}>
        <div ref={pageRef}>
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
                {savingTrip && (
                  <div style={{ 
                    background: '#e3f2fd', 
                    padding: '0.5rem', 
                    borderRadius: '4px', 
                    marginBottom: '1rem',
                    color: '#1976d2',
                    fontSize: '0.9rem'
                  }}>
                    💾 Saving trip to your profile...
                  </div>
                )}
                {tripSaved && (
                  <div style={{ 
                    background: '#e8f5e8', 
                    padding: '0.5rem', 
                    borderRadius: '4px', 
                    marginBottom: '1rem',
                    color: '#2e7d32',
                    fontSize: '0.9rem'
                  }}>
                    ✅ Trip saved to your profile!
                  </div>
                )}
                
                {Array.isArray(deepSeekResult.hotels) && deepSeekResult.hotels.length > 0 && (
                  <section>
                    <h3>Hotels</h3>
                    <div className={styles.hotelsRow}>
                      {deepSeekResult.hotels.map((hotel, idx) => (
                        <div key={hotel.name + idx} className={styles.hotelCard}>
                          <p><b>{hotel.name}</b></p>
                          <p>{hotel.type}</p>
                          {hotel.location && <p><b>Location:</b> {hotel.location}</p>}
                          <p><b>Cost:</b> {hotel.totalCost}</p>
                          <b>Features:</b>
                          {Array.isArray(hotel.features) && hotel.features.length > 0 ? (
                            <ul>
                              {hotel.features.map((feature, fidx) => (
                                <li key={fidx}>{feature}</li>
                              ))}
                            </ul>
                          ) : (
                            <span> Not specified</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {deepSeekResult.meals && (
                  <section>
                    <h3>Meals</h3>
                    <div className={styles.mealsColumn}>
                      {Object.entries(deepSeekResult.meals).map(([mealType, mealInfo]) => (
                        <div key={mealType} className={styles.mealCard}>
                          <div className={styles.mealImageWrapper}>
                            {mealImages[mealType] && (
                              <img
                                src={mealImages[mealType]}
                                alt={mealInfo.famousDish || mealType}
                                className={styles.mealImage}
                                onError={e => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'; }}
                              />
                            )}
                            <span className={styles.mealTypeOverlay}>{mealType.charAt(0).toUpperCase() + mealType.slice(1)}</span>
                          </div>
                          <div>
                            <b>{mealType.charAt(0).toUpperCase() + mealType.slice(1)}:</b><br/>
                            {mealInfo.cuisineType && <span><b>Cuisine:</b> {mealInfo.cuisineType}<br/></span>}
                            {mealInfo.famousDish && <span><b>Famous Dish:</b> {mealInfo.famousDish}<br/></span>}
                            {mealInfo.minCost && <span><b>Min Cost:</b> ₹{mealInfo.minCost}<br/></span>}
                            {mealInfo.suggestion && <span><b>Suggestion:</b> {mealInfo.suggestion}<br/></span>}
                            {mealInfo.costPerDay && <span><b>Cost/Day:</b> {mealInfo.costPerDay}<br/></span>}
                            {mealInfo.recommendedSpots && mealInfo.recommendedSpots.length > 0 && (
                              <span><i>Recommended: {mealInfo.recommendedSpots.join(', ')}</i></span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {deepSeekResult.itinerary && (
                  <section className={styles.itinerarySection}>
                    <h3><FaCalendarAlt /> Daywise Itinerary</h3>
                    <div className={styles.itineraryGrid}>
                      {Object.entries(deepSeekResult.itinerary).map(([dayKey, details]) => (
                        <div className={styles.itineraryDayCard} key={dayKey}>
                          <h4>{dayKey}</h4>
                          <ul>
                            {Object.entries(details).map(([k, v]) => (
                              <li key={k}>
                                <b>{k}:</b> {v && typeof v === 'object' && v.place ? (
                                  <>
                                    {v.place} {v.minTransportCost !== undefined && (
                                      <span style={{ color: '#007bff' }}> (Min Transport: ₹{v.minTransportCost})</span>
                                    )}
                                  </>
                                ) : (
                                  v
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {deepSeekResult.estimatedTotal && (
                  <section>
                    <h3>Estimated Budget</h3>
                    <table className={styles.budgetTable}>
                      <tbody>
                        {Object.entries(deepSeekResult.estimatedTotal.breakdown || {}).map(([k, v]) => (
                          <tr key={k}>
                            <td>{k.charAt(0).toUpperCase() + k.slice(1)}</td>
                            <td>₹{v}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td><strong>Total</strong></td>
                          <td><strong>₹{deepSeekResult.estimatedTotal.total}</strong></td>
                        </tr>
                      </tfoot>
                    </table>
                  </section>
                )}

                {deepSeekResult.packingList && Array.isArray(deepSeekResult.packingList) && deepSeekResult.packingList.length > 0 && (
                  <section>
                    <h3><FaSuitcase /> Packing List</h3>
                    <div className={styles.packingList}>
                      {deepSeekResult.packingList.map((item, idx) => (
                        <div key={idx} className={styles.packingListItem}>
                          <FaCheckCircle className={styles.packingIcon} />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
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
              <input type="text" value={city} readOnly style={{ padding: '0.8rem', fontSize: '1rem', border: '1px solid rgb(94, 154, 239)', borderRadius: '4px', marginBottom: '1rem' }} />
              {loadingWeather ? (
                <p>Loading weather forecast...</p>
              ) : weatherError ? (
                <p>{weatherError}</p>
              ) : (
                <ul className={styles.weatherList}>
                  {weather.map((day, idx) => {
                    let dateLabel = day.day;
                    if (checkin) {
                      const checkinDate = new Date(checkin);
                      const forecastDate = new Date(checkinDate.getTime() + idx * 24 * 60 * 60 * 1000);
                      dateLabel = forecastDate.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
                    }
                    return (
                      <li key={dateLabel}>
                        <span className={styles.weatherDay}>{dateLabel}</span>
                        <span className={styles.weatherTemp}>{weatherIconMap[day.icon] || '❓'} {day.temp}</span>
                        <span className={styles.weatherDesc}>{day.description}</span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>

          <div className={styles.card}>
            <h2>Local Events (PredictHQ)</h2>

            {loadingPhq ? (
              <p>Loading events…</p>
            ) : phqErr ? (
              <p style={{ color: 'red' }}>{phqErr}</p>
            ) : phqEvents.length === 0 ? (
              <p>No events found for your dates.</p>
            ) : (
              <div className={styles.eventsGrid}>
                {phqEvents.map(ev => (
                  <div key={ev.id} className={styles.eventCard}>
                    <div className={styles.eventHeader}>
                      <span className={styles.eventIcon}>
                        {getEventCategoryIcon(ev.category)}
                      </span>
                      <h3 className={styles.eventTitle}>
                        {ev.url ? (
                          <a href={ev.url} target="_blank" rel="noopener noreferrer">
                            {ev.name}
                          </a>
                        ) : (
                          ev.name
                        )}
                      </h3>
                    </div>

                    <div className={styles.eventDetails}>
                      <p className={styles.eventDate}>📅 {formatLocal(ev.start)}</p>
                      <p className={styles.eventVenue}>📍 {ev.venue.name}</p>
                      <p className={styles.eventAddress}>🏠 {ev.venue.address}</p>

                      {ev.phq_attendance && (
                        <p className={styles.eventAttendance}>
                          👥 {getAttendanceLabel(ev.phq_attendance)}
                        </p>
                      )}

                      {ev.description && (
                        <p className={styles.eventDescription}>
                          {ev.description.length > 150
                            ? `${ev.description.slice(0, 150)}…`
                            : ev.description}
                        </p>
                      )}

                      <span className={styles.eventCategory}>
                        {ev.category.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ------------ Download & footer ------------ */}
        <div className={styles.downloadSection}>
          <button className={styles.downloadBtn} onClick={handleDownloadPdf}>
            <FaDownload /> Download Trip Plan (PDF)
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TripSuggestions;


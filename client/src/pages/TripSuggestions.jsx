import React from 'react';
import styles from '../styles/TripSuggestions.module.css';
import { FaHotel, FaCloudSun, FaShoppingBag, FaUtensils, FaCalendarAlt, FaRupeeSign, FaDownload } from 'react-icons/fa';
import Footer from '../components/Footer/Footer';

const TripSuggestions = () => {
  // Dummy Data
  const hotel = {
    name: 'Grand Palace Resort',
    rating: 4.5,
    reviews: 324,
    distance: '2.5km from city center',
    price: '3,500',
    image: '/hotel.jpg',
  };

  const weather = [
    { day: 'Today', temp: '28°C', icon: '☀️' },
    { day: 'Tomorrow', temp: '24°C', icon: '🌧️' },
    { day: 'Day 3', temp: '26°C', icon: '⛅' },
    { day: 'Day 4', temp: '30°C', icon: '☀️' },
  ];

  const packingList = {
    clothing: ['T-shirts (3-4)', 'Pants (2)', 'Jacket'],
    essentials: ['Toiletries', 'Medications', 'Phone Charger'],
    documents: ['ID/Passport', 'Travel Tickets', 'Hotel Booking'],
  };

  const meals = [
    { name: 'Local Street Food', desc: 'Authentic local flavors', image: '/meal1.jpg' },
    { name: 'Rooftop Restaurant', desc: 'Fine dining experience', image: '/meal2.jpg' },
    { name: 'Cafe Corner', desc: 'Coffee and pastries', image: '/meal3.jpg' },
  ];

  const itinerary = [
    {
      day: 'Day 1 - Arrival & City Tour',
      places: ['Central Market', 'Historic Temple', 'City Museum'],
      activities: 'Walking tour, Market visit',
      transportCost: 200,
    },
    {
      day: 'Day 2 - Adventure & Nature',
      places: ['Mountain Trail', 'Scenic Viewpoint', 'Adventure Park'],
      activities: 'Hiking, Photography',
      transportCost: 350,
    },
  ];

  const budget = [
    { item: 'Hotel (3 nights)', category: 'Accommodation', cost: 10500 },
    { item: 'Meals', category: 'Food', cost: 3000 },
    { item: 'Activities', category: 'Entertainment', cost: 2500 },
    { item: 'Transport', category: 'Travel', cost: 1500 },
  ];
  const totalBudget = budget.reduce((acc, item) => acc + item.cost, 0);

  return (
    <>
      <div className={styles.pageContainer}>
        <h1 className={styles.mainTitle}>Your Trip Suggestions</h1>
        <p className={styles.mainSubtitle}>Personalized recommendations for your upcoming adventure</p>

        <div className={styles.topGrid}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}><FaHotel /> Hotel Recommendation</h2>
            <div className={styles.hotelContent}>
              <img src={hotel.image} alt={hotel.name} className={styles.hotelImage} />
              <div className={styles.hotelDetails}>
                <h3>{hotel.name}</h3>
                <p>{'⭐'.repeat(Math.round(hotel.rating))} ({hotel.reviews} reviews)</p>
                <p>{hotel.distance}</p>
                <p className={styles.hotelPrice}>₹{hotel.price}/night</p>
              </div>
            </div>
          </div>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}><FaCloudSun /> Weather Forecast</h2>
            <ul className={styles.weatherList}>
              {weather.map(day => (
                <li key={day.day}>
                  <span>{day.day}</span>
                  <span>{day.icon} {day.temp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}><FaShoppingBag /> Packing List</h2>
          <div className={styles.packingGrid}>
            <div>
              <h4>Clothing</h4>
              {packingList.clothing.map(item => <label key={item}><input type="checkbox"/> {item}</label>)}
            </div>
            <div>
              <h4>Essentials</h4>
              {packingList.essentials.map(item => <label key={item}><input type="checkbox"/> {item}</label>)}
            </div>
            <div>
              <h4>Documents</h4>
              {packingList.documents.map(item => <label key={item}><input type="checkbox"/> {item}</label>)}
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}><FaUtensils /> Meal Suggestions</h2>
          <div className={styles.mealsGrid}>
            {meals.map(meal => (
              <div key={meal.name} className={styles.mealCard}>
                <img src={meal.image} alt={meal.name} />
                <h3>{meal.name}</h3>
                <p>{meal.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}><FaCalendarAlt /> Day-Wise Itinerary</h2>
          <div className={styles.itinerary}>
            {itinerary.map(day => (
              <div key={day.day} className={styles.dayCard}>
                <h4>{day.day}</h4>
                <p><b>Places to Visit:</b> {day.places.join(', ')}</p>
                <p><b>Activities:</b> {day.activities}</p>
                <p><b>Transport Cost:</b> ₹{day.transportCost}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}><FaRupeeSign /> Trip Budget</h2>
          <table className={styles.budgetTable}>
            <thead>
              <tr>
                <th>Item</th>
                <th>Category</th>
                <th>Cost (₹)</th>
              </tr>
            </thead>
            <tbody>
              {budget.map(item => (
                <tr key={item.item}>
                  <td>{item.item}</td>
                  <td>{item.category}</td>
                  <td>{item.cost.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="2">Estimated Total Budget</td>
                <td>₹{totalBudget.toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
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

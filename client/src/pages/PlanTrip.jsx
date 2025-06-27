import React, { useState } from 'react';
import styles from '../styles/PlanTrip.module.css';
import { FaMapMarkerAlt, FaPlane, FaUserCircle } from 'react-icons/fa';
import { useUser } from '../UserContext';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer/Footer';

const PlanTrip = () => {
  const { user, setTripDetails } = useUser();
  const navigate = useNavigate();
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [preference, setPreference] = useState('relaxation');
  const [budget, setBudget] = useState(25000);
  const [minBudget, setMinBudget] = useState(5000);
  const [maxBudget, setMaxBudget] = useState(50000);

  const handleSlider = (e) => {
    setBudget(Number(e.target.value));
    setMinBudget(5000);
    setMaxBudget(Number(e.target.value));
  };

  const handleMinBudget = (e) => {
    setMinBudget(Number(e.target.value));
  };
  const handleMaxBudget = (e) => {
    setMaxBudget(Number(e.target.value));
    setBudget(Number(e.target.value));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTripDetails({
      city: destination,
      checkin: checkIn,
      checkout: checkOut,
      preference,
      budget
    });
    navigate('/results');
  };

  return (
    <>
      <div className={styles.bg}>
        <div className={styles.centerCard}>
          <h2 className={styles.title}>Plan Your Trip</h2>
          <p className={styles.subtitle}>Tell us about your trip and let TravelBuddy take care of the rest.</p>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>
                <FaMapMarkerAlt className={styles.inputIcon} />
                <input
                  type="text"
                  placeholder="Where would you like to go?"
                  value={destination}
                  onChange={e => setDestination(e.target.value)}
                  className={styles.input}
                  required
                />
              </label>
            </div>
            <div className={styles.datesRow}>
              <label className={styles.dateLabel}>
                Check-in Date
                <input
                  type="date"
                  value={checkIn}
                  onChange={e => setCheckIn(e.target.value)}
                  className={styles.input}
                  required
                />
              </label>
              <label className={styles.dateLabel}>
                Check-out Date
                <input
                  type="date"
                  value={checkOut}
                  onChange={e => setCheckOut(e.target.value)}
                  className={styles.input}
                  required
                />
              </label>
            </div>
            <div className={styles.preferenceRow}>
              <span>Travel Preference</span>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="preference"
                  value="relaxation"
                  checked={preference === 'relaxation'}
                  onChange={() => setPreference('relaxation')}
                />
                Relaxation
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="preference"
                  value="adventurous"
                  checked={preference === 'adventurous'}
                  onChange={() => setPreference('adventurous')}
                />
                Adventurous
              </label>
            </div>
            <div className={styles.budgetSection}>
              <span>Budget Range</span>
              <input
                type="range"
                min={5000}
                max={1000000}
                step={1000}
                value={budget}
                onChange={handleSlider}
                className={styles.slider}
              />
              <div className={styles.budgetLabels}>
                <span>₹5,000</span>
                <span>₹{budget.toLocaleString()}</span>
                <span>₹10,00,000</span>
              </div>
              <div className={styles.budgetInputs}>
                <input
                  type="number"
                  min={5000}
                  max={maxBudget}
                  value={minBudget}
                  onChange={handleMinBudget}
                  className={styles.input}
                  placeholder="Min Budget"
                />
                <input
                  type="number"
                  min={minBudget}
                  max={1000000}
                  value={maxBudget}
                  onChange={handleMaxBudget}
                  className={styles.input}
                  placeholder="Max Budget"
                />
              </div>
            </div>
            <button className={styles.submitBtn} type="submit">
              <FaPlane className={styles.planeIcon} /> Generate Trip Plan
            </button>
          </form>
          <div className={styles.infoText}>
            Your information is secure and will only be used to create your personalized trip plan.
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PlanTrip; 
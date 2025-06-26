import React from 'react';
import styles from './HowItWorks.module.css';
import { FaUserEdit, FaRobot, FaRegSave } from 'react-icons/fa';

const HowItWorks = () => {
  return (
    <section className={styles.howItWorks}>
      <h2 className={styles.title}>How It Works</h2>
      <p className={styles.subtitle}>Three simple steps to create your perfect travel itinerary</p>
      <div className={styles.steps}>
        <div className={styles.step}>
          <div className={styles.icon}><FaUserEdit /></div>
          <h3>1. Enter Your Details</h3>
          <p>Share your destination, travel dates, preferences, and budget with our smart assistant.</p>
        </div>
        <div className={styles.step}>
          <div className={styles.icon}><FaRobot /></div>
          <h3>2. AI Creates Your Plan</h3>
          <p>Our AI generates a smart day-wise itinerary with places, activities, and packing recommendations.</p>
        </div>
        <div className={styles.step}>
          <div className={styles.icon}><FaRegSave /></div>
          <h3>3. Customize & Save</h3>
          <p>Review, customize, and save your personalized plan. Access it anywhere, anytime.</p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks; 
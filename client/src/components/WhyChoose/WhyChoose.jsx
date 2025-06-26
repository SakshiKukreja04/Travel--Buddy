import React from 'react';
import styles from './WhyChoose.module.css';
import { FaRobot, FaRegClock, FaWallet } from 'react-icons/fa';

const WhyChoose = () => {
  return (
    <section className={styles.whyChoose}>
      <h2 className={styles.title}>Why Choose TravelBuddy?</h2>
      <div className={styles.cards}>
        <div className={styles.card}>
          <div className={styles.icon}><FaRobot /></div>
          <h3>AI-Powered</h3>
          <p>Smart recommendations based on your preferences.</p>
        </div>
        <div className={styles.card}>
          <div className={styles.icon}><FaRegClock /></div>
          <h3>Time-Saving</h3>
          <p>Get detailed itineraries in minutes, not hours.</p>
        </div>
        <div className={styles.card}>
          <div className={styles.icon}><FaWallet /></div>
          <h3>Budget-Friendly</h3>
          <p>Plans that fit your budget without compromising quality.</p>
        </div>
      </div>
    </section>
  );
};

export default WhyChoose; 
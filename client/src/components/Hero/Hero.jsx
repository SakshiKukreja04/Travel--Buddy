import React from 'react';
import styles from './Hero.module.css';

const Hero = () => {
  return (
    <div className={styles.hero}>
      <div className={styles.heroOverlay}></div>
      <div className={styles.heroContent}>
        <h1 className={styles.title}>Plan Smart. Travel Smarter.</h1>
        <p className={styles.subtitle}>Your personalized day-by-day travel assistant powered by AI.</p>
        <button className={styles.getStartedBtn}>Get Started</button>
      </div>
    </div>
  );
};

export default Hero; 
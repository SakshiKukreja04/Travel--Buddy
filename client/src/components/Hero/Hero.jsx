import React from 'react';
import styles from './Hero.module.css';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../UserContext';

const Hero = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      navigate('/plan');
    } else {
      navigate('/signup');
    }
  };

  return (
    <div className={styles.hero}>
      <div className={styles.heroOverlay}></div>
      <div className={styles.heroContent}>
        <h1 className={styles.title}>Plan Smart. Travel Smarter.</h1>
        <p className={styles.subtitle}>Your personalized day-by-day travel assistant powered by AI.</p>
        <button className={styles.getStartedBtn} onClick={handleGetStarted}>Get Started</button>
      </div>
    </div>
  );
};

export default Hero; 
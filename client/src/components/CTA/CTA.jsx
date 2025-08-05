import React from 'react';
import styles from './CTA.module.css';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../UserContext';

const CTA = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const handleStartPlanning = () => {
    if (user) {
      navigate('/plan');
    } else {
      navigate('/signup');
    }
  };

  return (
    <section className={styles.cta}>
      <h2 className={styles.title}>Ready to Start Your Next Adventure?</h2>
      <p className={styles.subtitle}>Join thousands of travelers who trust TravelBuddy for their perfect trips.</p>
      <button className={styles.ctaBtn} onClick={handleStartPlanning}>Start Planning Now</button>
    </section>
  );
};

export default CTA; 
import React from 'react';
import styles from './CTA.module.css';

const CTA = () => {
  return (
    <section className={styles.cta}>
      <h2 className={styles.title}>Ready to Start Your Next Adventure?</h2>
      <p className={styles.subtitle}>Join thousands of travelers who trust TravelBuddy for their perfect trips.</p>
      <button className={styles.ctaBtn}>Start Planning Now</button>
    </section>
  );
};

export default CTA; 
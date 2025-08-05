import React from 'react';
import Footer from '../components/Footer/Footer';
import styles from './AboutUs.module.css';

const AboutUs = () => (
  <>
    <div className={styles.aboutContainer}>
      <h1 className={styles.aboutHeading}>About Us</h1>
      <p className={styles.aboutParagraph}>
        <b>TravelBuddy</b> is your AI-powered travel companion, dedicated to making your journeys easier, smarter, and more enjoyable. Our mission is to help you create perfect itineraries tailored to your preferences and budget, using the power of artificial intelligence.
      </p>
      <p className={styles.aboutParagraphSecondary}>
        Whether you're planning a solo adventure, a family vacation, or a business trip, TravelBuddy is here to provide personalized recommendations, save you time, and ensure you get the most out of every journey. We believe travel should be stress-free and full of memorable experiences!
      </p>
    </div>
    <div style={{ maxWidth: "100%", margin: "0 auto" }}>
      <Footer />
    </div>
  </>
);

export default AboutUs; 
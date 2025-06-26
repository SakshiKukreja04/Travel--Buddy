import React from 'react';
import styles from './Footer.module.css';
import { FaTwitter, FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.brand}>
          <div className={styles.logoContainer}>
            <img src="/logo.jpg" alt="TravelBuddy Logo" className={styles.logoImg} />
            <h3 className={styles.logo}>TravelBuddy</h3>
          </div>
          <p>Your AI-powered travel companion for creating perfect itineraries tailored to your preferences and budget.</p>
        </div>
        <div className={styles.links}>
          <div>
            <h4>Company</h4>
            <ul>
              <li><a href="#about">About</a></li>
              <li><a href="#contact">Contact</a></li>
              <li><a href="#careers">Careers</a></li>
            </ul>
          </div>
          <div>
            <h4>Legal</h4>
            <ul>
              <li><a href="#terms">Terms of Service</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#cookie">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
      </div>
      <hr className={styles.divider} />
      <div className={styles.footerBottom}>
        <p>© 2025 TravelBuddy. All rights reserved.</p>
        <div className={styles.socialIcons}>
          <a href="#" aria-label="Twitter"><FaTwitter /></a>
          <a href="#" aria-label="Facebook"><FaFacebookF /></a>
          <a href="#" aria-label="Instagram"><FaInstagram /></a>
          <a href="#" aria-label="LinkedIn"><FaLinkedinIn /></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';
import { useUser } from '../../UserContext';

const Navbar = () => {
  const location = useLocation();
  const { user } = useUser();
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <img src="/logo.jpg" alt="TravelBuddy logo" className={styles.logoImg} />
        <span>TravelBuddy</span>
      </div>
      <ul className={styles.navLinks}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About us</Link></li>
        <li><Link to="/contact">Contact us</Link></li>
        {user && (
          <li>
            <Link to="/plan" className={styles.exploreLink}>Explore</Link>
          </li>
        )}
      </ul>
      <div className={styles.profileRight}>
        {user && (
          <>
            <span className={styles.userName}>{user.displayName || 'User'}</span>
            <Link to="/profile">
              <button className={styles.profileBtn + (location.pathname === '/profile' ? ' ' + styles.active : '')}>Profile</button>
            </Link>
          </>
        )}
        {!user && (
          <>
            <Link to="/login">
              <button className={styles.loginBtn + (location.pathname === '/login' ? ' ' + styles.active : '')}>Login</button>
            </Link>
            <Link to="/signup">
              <button className={styles.signupBtn + (location.pathname === '/signup' ? ' ' + styles.active : '')}>Sign Up</button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 
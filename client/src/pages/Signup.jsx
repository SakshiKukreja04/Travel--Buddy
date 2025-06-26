import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Signup.module.css';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, updateProfile } from 'firebase/auth';
import Footer from '../components/Footer/Footer';

const Signup = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: fullName });
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignup = async () => {
    setError('');
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <div className={styles.bg}>
        <div className={styles.centerBox}>
          <div className={styles.icon}>✈️</div>
          <h2 className={styles.title}>Join TravelBuddy</h2>
          <p className={styles.subtitle}>Create your free account to start planning</p>
          {error && <div style={{color: 'red', marginBottom: 8}}>{error}</div>}
          <form className={styles.form} onSubmit={handleSignup}>
            <label>Full Name</label>
            <input type="text" placeholder="Enter your full name" value={fullName} onChange={e => setFullName(e.target.value)} required />
            <label>Email</label>
            <input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} required />
            <label>Password</label>
            <input type="password" placeholder="Create a password" value={password} onChange={e => setPassword(e.target.value)} required />
            <label>Confirm Password</label>
            <input type="password" placeholder="Confirm your password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
            <button className={styles.signupBtn} type="submit">Sign Up</button>
          </form>
          <div className={styles.orRow}><span>OR</span></div>
          <button className={styles.googleBtn} type="button" onClick={handleGoogleSignup}>
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className={styles.googleLogo} />
            Sign up with Google
          </button>
          <div className={styles.bottomText}>
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Signup; 
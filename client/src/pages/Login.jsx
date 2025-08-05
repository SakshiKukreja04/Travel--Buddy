import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import Footer from '../components/Footer/Footer';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
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
          <h2 className={styles.title}>TravelBuddy</h2>
          <p className={styles.subtitle}>Welcome Back to TravelBuddy</p>
          <p className={styles.desc}>Log in to plan your next adventure</p>
          {error && <div style={{color: 'red', marginBottom: 8}}>{error}</div>}
          <form className={styles.form} onSubmit={handleLogin}>
            <label>Email</label>
            <input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} required />
            <label>Password</label>
            <input type="password" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} required />
            <div className={styles.forgotRow}>
              <Link to="#" className={styles.forgot}>Forgot Password?</Link>
            </div>
            <button className={styles.loginBtn} type="submit"> <span className={styles.loginIcon}>⇨</span> Login</button>
          </form>
          <div className={styles.orRow}><span>OR</span></div>
          <button className={styles.googleBtn} type="button" onClick={handleGoogleLogin}>
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className={styles.googleLogo} />
            Login with Google
          </button>
          <div className={styles.bottomText}>
            Don&apos;t have an account? <Link to="/signup">Sign up</Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login; 
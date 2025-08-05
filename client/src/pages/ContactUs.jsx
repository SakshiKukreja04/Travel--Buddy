import React, { useState } from 'react';
import Footer from "../components/Footer/Footer";
import styles from './ContactUs.module.css';

const ContactUs = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <div className={styles.contactContainer}>
        <h1 className={styles.contactHeading}>Contact Us</h1>
        {submitted ? (
          <div style={{ color: '#2e7d32', textAlign: 'center', fontWeight: 500 }}>
            Thank you for reaching out! We'll get back to you soon.
          </div>
        ) : (
          <form className={styles.contactForm} onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Your Name" value={form.name} onChange={handleChange} required />
            <input type="email" name="email" placeholder="Your Email" value={form.email} onChange={handleChange} required />
            <textarea name="message" placeholder="Your Message" value={form.message} onChange={handleChange} required rows={5} />
            <button type="submit">Send Message</button>
          </form>
        )}
      </div>
      <div style={{ maxWidth: "100%", margin: "0 auto" }}>
        <Footer />
      </div>
    </>
  );
};

export default ContactUs; 
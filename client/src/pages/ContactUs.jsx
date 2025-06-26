import React, { useState } from 'react';

const ContactUs = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div style={{ maxWidth: 500, margin: '3rem auto', background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px #0001', padding: '2.5rem 2rem' }}>
      <h1 style={{ fontSize: '2.2rem', marginBottom: '1.2rem', color: '#6B5B95', textAlign: 'center' }}>Contact Us</h1>
      <form style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          style={{ padding: '0.8rem', borderRadius: 7, border: '1px solid #ccc', fontSize: '1rem' }}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={form.email}
          onChange={handleChange}
          style={{ padding: '0.8rem', borderRadius: 7, border: '1px solid #ccc', fontSize: '1rem' }}
          required
        />
        <textarea
          name="message"
          placeholder="Your Message"
          value={form.message}
          onChange={handleChange}
          rows={5}
          style={{ padding: '0.8rem', borderRadius: 7, border: '1px solid #ccc', fontSize: '1rem', resize: 'vertical' }}
          required
        />
        <button type="submit" style={{ background: '#6B5B95', color: '#fff', border: 'none', borderRadius: 7, padding: '0.9rem', fontSize: '1.1rem', fontWeight: 600, cursor: 'pointer' }} disabled>
          Send Message
        </button>
      </form>
    </div>
  );
};

export default ContactUs; 
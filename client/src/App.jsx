import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import HowItWorks from './components/HowItWorks/HowItWorks';
import WhyChoose from './components/WhyChoose/WhyChoose';
import CTA from './components/CTA/CTA';
import Footer from './components/Footer/Footer';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import PlanTrip from './pages/PlanTrip';
import TripSuggestions from './pages/TripSuggestions';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';

function Home() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <WhyChoose />
      <CTA />
      <Footer />
    </>
  );
}

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/plan" element={<PlanTrip />} />
        <Route path="/results" element={<TripSuggestions />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
      </Routes>
    </>
  );
}

export default App;




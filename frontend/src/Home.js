import React from 'react';
import Navbar from './Navbar';
import './Auth.css';
import { FaInstagram, FaEnvelope, FaWhatsapp, FaLinkedin } from 'react-icons/fa';
import image1 from './assests/image1.png';
import image2 from './assests/image2.png';
import image3 from './assests/image3.png';

function Home() {
  return (
    <div className="home-wrapper">
      <Navbar />

      <section className="hero-section">
        {/* Left Side: Text + Buttons */}
        <div className="hero-text">
          <h2>Welcome to Smart QR Parking</h2>
          <p>
            Scan a QR, park instantly! Our smart parking system helps you find, reserve,
            and manage parking slots in real-time with ease and convenience.
          </p>
          <div className="button-group">
            <button className="book-btn" onClick={() => window.location.href = '/booking'}>Book Now</button>
            <button className="login-btn" onClick={() => window.location.href = '/login'}>Back to Login</button>
          </div>
        </div>

        {/* Right Side: Carousel */}
        <div className="carousel-container">
          <div className="carousel-track">
            <img src={image1} alt="Slide 1" />
            <img src={image2} alt="Slide 2" />
            <img src={image3} alt="Slide 3" />
            <img src={image1} alt="Slide 4" />
            <img src={image2} alt="Slide 5" />
            <img src={image3} alt="Slide 6" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <a href="/instagram" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
        <a href="/gmail" target="_blank" rel="noopener noreferrer"><FaEnvelope /></a>
        <a href="/whatsapp" target="_blank" rel="noopener noreferrer"><FaWhatsapp /></a>
        <a href="/linkedin" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
      </footer>
    </div>
  );
}

export default Home;

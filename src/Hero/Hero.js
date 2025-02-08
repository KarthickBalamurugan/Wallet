import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Hero.css';

function Hero() {
  const navigate = useNavigate();

  return (
    <div className="hero-container">
      <div className="hero-content">
        <h1 className="hero-title">
          DigiWallet <span className="hero-title-highlight">AI</span>
        </h1>
        <p className="hero-description">
          An AI-powered digital wallet designed for security and financial growth. 
          With AI-driven scam prevention, smart forecasting, and interactive financial insights, 
          managing your money has never been easier.
        </p>
        <p className="hero-tagline">
          Take control of your finances—securely and intelligently.
        </p>
        <button className="hero-cta" onClick={() => navigate('/wallet')}>
          Get Started
        </button>
      </div>
    </div>
  );
}

export default Hero;

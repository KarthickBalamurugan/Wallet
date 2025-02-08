import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar/Navbar';
import Home from './Hero/Hero';
import Wallet from './pages/Wallet/Wallet';
import PayNow from './pages/PayNow/PayNow';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/paynow" element={<PayNow />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

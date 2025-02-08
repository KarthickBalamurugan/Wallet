import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className='navbar'>
      <div className='nav-container'>
        <Link to="/" className='nav-logo'>
          <h1>
            <span className="logo-text-white">DigiWallet</span>
            
            <span className="logo-text-green">AI</span>
          </h1>
        </Link>
        
        <div className={`hamburger ${isOpen ? 'active' : ''}`} onClick={toggleMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>

        <ul className={`nav-menu ${isOpen ? 'active' : ''}`}>
          <li className='nav-item'>
            <Link to="/wallet" className='nav-link' onClick={toggleMenu}>Wallet</Link>
          </li>
          <li className='nav-item'>
            <Link to="/payNow" className='nav-link' onClick={toggleMenu}>PayNow</Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar

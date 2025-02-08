import React, { useState } from 'react'
import './Navbar.css'

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className='navbar'>
      <div className='nav-container'>
        <div className='nav-logo'>
          <h1>
            <span className="logo-text-white">DigiWallet</span>
            
            <span className="logo-text-green">AI</span>
          </h1>
        </div>
        
        <div className={`hamburger ${isOpen ? 'active' : ''}`} onClick={toggleMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>

        <ul className={`nav-menu ${isOpen ? 'active' : ''}`}>
          <li className='nav-item'>
            <a href="#" className='nav-link' onClick={toggleMenu}>Wallet</a>
          </li>
          <li className='nav-item'>
            <a href="#" className='nav-link' onClick={toggleMenu}>PayNow</a>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
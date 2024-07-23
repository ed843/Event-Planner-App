import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import '../styles/MobileNavigation.css';

const MobileNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("access");

  const handleLogout = () => {
    navigate("/logout");
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    document.body.style.overflow = isOpen ? 'visible' : 'hidden';
  };

  return (
    <nav className="mobile-navbar">
      <div className="mobile-navbar-header">
        <div className="navbar-logo">
          <Link to="/">EventPlanner</Link>
        </div>
        <button className={`hamburger ${isOpen ? 'active' : ''}`} onClick={toggleMenu}>
          <span className="hamburger-box">
            <span className="hamburger-inner"></span>
          </span>
        </button>
      </div>
      <div className={`mobile-navbar-overlay ${isOpen ? 'active' : ''}`} onClick={toggleMenu}></div>
      <ul className={`mobile-navbar-links ${isOpen ? 'active' : ''}`}>
        <li><Link to="/" onClick={toggleMenu}>Home</Link></li>
        <li><Link to="/events" onClick={toggleMenu}>Events</Link></li>
        {isLoggedIn ? (
          <>
            <li><Link to="/dashboard" onClick={toggleMenu}>Dashboard</Link></li>
            <li><button onClick={() => { handleLogout(); toggleMenu(); }} className="navbar-button-mobile">Logout</button></li>
          </>
        ) : (
          <>
            <li><Link to="/login" onClick={toggleMenu}>Login</Link></li>
            <li><Link to="/register" onClick={toggleMenu}>Register</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default MobileNavigation;
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/DesktopNavigation.css';

const DesktopNavigation = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("access");
  const handleLogout = () => {
    navigate("/logout");
  };
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">EventPlanner</Link>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/events">Events</Link>
        </li>
        {isLoggedIn ? (
          <>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <button onClick={handleLogout} className="navbar-button-desktop">
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default DesktopNavigation;
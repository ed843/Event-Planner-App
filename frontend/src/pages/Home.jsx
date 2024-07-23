import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

function Home() {
  return (
    <div className="hero-container">
      <div className="hero-content">
        <h1>Discover Amazing Events Near You</h1>
        <p>Join, create, and share experiences that matter.</p>
        <div className="hero-buttons">
          <Link to="/events" className="btn btn-primary">Find Events</Link>
          <Link to="/dashboard" className="btn btn-secondary">Create Event</Link>
        </div>
      </div>
      <div className="hero-image">
        <img src='https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' alt="People enjoying an event" />
      </div>
    </div>
  );
}

export default Home;
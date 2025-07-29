import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <h1 className="logo" onClick={() => navigate('/home')}>Smart Parking System</h1>
      <div className="nav-links">
        <span className="nav-icon" onClick={() => navigate('/home')}>HOME</span>
        <span className="nav-icon" onClick={() => navigate('/booking')}>BOOKING</span>

        <span className="nav-icon" onClick={() => navigate('/summary')}>SUMMARY</span> {/* Or change to '/eats' */}
        <span className="nav-icon" onClick={() => navigate('/return')}>RETURN</span>

      </div>
    </nav>
  );
}

export default Navbar;

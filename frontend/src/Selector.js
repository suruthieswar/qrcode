import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

function Selector() {
  const navigate = useNavigate();

  return (
    <div className="selector-container">
      <h2>Select Page</h2>

      {/* Button wrapper with spacing */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
        <button onClick={() => navigate('/home')}>Client</button>
        <button onClick={() => navigate('/manager-login')}>Manager</button>
      </div>
    </div>
  );
}

export default Selector;

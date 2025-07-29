import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

function ManagerLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showReset, setShowReset] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [enteredCode, setEnteredCode] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        navigate('/manager-page');
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Server error');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, oldPass, newPass }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        setShowReset(false);
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Server error');
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, newPass, secretCode: enteredCode }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        setShowForgot(false);
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Server error');
    }
  };

  return (
    <div className="auth-container">
      <h2>Manager Login</h2>
      <form onSubmit={handleLogin} className="auth-form">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="small-btn">Login</button>
      </form>

      <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button className="small-btn" onClick={() => setShowReset(!showReset)}>
          {showReset ? 'Cancel Reset' : 'Reset Password'}
        </button>
        <button className="small-btn" onClick={() => setShowForgot(!showForgot)}>
          {showForgot ? 'Cancel Forgot' : 'Forgot Password?'}
        </button>
      </div>

      {showReset && (
        <form onSubmit={handleResetPassword} className="auth-form">
          <h4>Reset Password</h4>
          <input
            type="password"
            placeholder="Enter current password"
            value={oldPass}
            onChange={(e) => setOldPass(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Enter new password"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            required
          />
          <button type="submit" className="small-btn">Update Password</button>
        </form>
      )}

      {showForgot && (
        <form onSubmit={handleForgotPassword} className="auth-form">
          <h4>Forgot Password</h4>
          <input
            type="text"
            placeholder="Enter secret code"
            value={enteredCode}
            onChange={(e) => setEnteredCode(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Enter new password"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            required
          />
          <button type="submit" className="small-btn">Recover Password</button>
        </form>
      )}

      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <button onClick={() => navigate('/')} className="small-btn">
          ← Back to Home
        </button>
      </div>
    </div>
  );
}

export default ManagerLogin;

// src/Auth.js
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { loginUser, registerUser, logoutUser, handleAuthError } from './authService';
import './Auth.css';

const Auth = () => {
  const [activeTab, setActiveTab] = useState('form');
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState(''); // State for handling error messages

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await loginUser(email, password);
    } catch (error) {
      setError(handleAuthError(error));
    }
  };

  const handleRegister = async () => {
    try {
      await registerUser(email, password);
    } catch (error) {
      setError(handleAuthError(error));
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  };

  const handleCloseError = () => {
    setError('');
  };

  if (!user) {
    return (
      <div className="auth-container">
        <h2>{isRegistering ? 'Register' : 'Login'} to Pitch Tracker</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="auth-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="auth-input"
        />
        <button onClick={isRegistering ? handleRegister : handleLogin} className="auth-button">
          {isRegistering ? 'Register' : 'Login'}
        </button>
        <p style={{ marginTop: '10px' }}>
          {isRegistering ? 'Already have an account?' : 'Need an account?'}{' '}
          <span
            onClick={() => setIsRegistering(!isRegistering)}
            style={{ color: '#4CAF50', cursor: 'pointer', fontWeight: 'bold' }}
          >
            {isRegistering ? 'Login here' : 'Register here'}
          </span>
        </p>

        {/* Error Popup Modal */}
        {error && (
          <div className="error-modal">
            <div className="error-modal-content">
              <span className="error-modal-close" onClick={handleCloseError}>×</span>
              <p>{error}</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="header">
        <h1>Pitch Tracker</h1>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>
      <div className="content-area">
        {/* Render your other content here */}
      </div>
    </div>
  );
};

export default Auth;

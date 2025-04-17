// src/AuthScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { loginUser, registerUser, resetPassword } from './authService';
//import './App.css';
import './Auth.css';

const AuthScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [resetPasswordMode, setResetPasswordMode] = useState(false);
  const resetPasswordModalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (resetPasswordModalRef.current && !resetPasswordModalRef.current.contains(event.target)) {
        setResetPasswordMode(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogin = async () => {
    const errorMessage = await loginUser(email, password);
    if (errorMessage) setError(errorMessage);
  };

  const handleRegister = async () => {
    const errorMessage = await registerUser(email, password);
    if (errorMessage) setError(errorMessage);
  };

  const handleResetPassword = async () => {
    const message = await resetPassword(email);
    if (message === 'Password reset email sent. Please check your inbox.') {
      setSuccessMessage(message);
      setResetPasswordMode(false);
    } else {
      setError(message);
    }
  };

  const handleCloseError = () => setError('');
  const handleCloseSuccess = () => setSuccessMessage('');

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

      {error && (
        <div className="error-modal">
          <div className="error-modal-content">
            <span className="error-modal-close" onClick={handleCloseError}>×</span>
            <p>{error}</p>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="success-modal">
          <div className="success-modal-content">
            <span className="success-modal-close" onClick={handleCloseSuccess}>×</span>
            <p>{successMessage}</p>
          </div>
        </div>
      )}

      {resetPasswordMode && (
        <div className="reset-password-modal">
          <div className="reset-password-modal-content" ref={resetPasswordModalRef}>
            <span className="reset-password-modal-close" onClick={() => setResetPasswordMode(false)}>×</span>
            <h3>Reset Your Password</h3>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
            />
            <button onClick={handleResetPassword} className="auth-button">
              Send Reset Email
            </button>
          </div>
        </div>
      )}

      {!resetPasswordMode && (
        <div className="reset-password-link">
          <span
            onClick={() => setResetPasswordMode(true)}
            style={{ color: '#4CAF50', cursor: 'pointer' }}
          >
            Forgot Password?
          </span>
        </div>
      )}
    </div>
  );
};

export default AuthScreen;
// src/App.js
import React, { useState, useEffect, useRef } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import { loginUser, registerUser, resetPassword } from './authService';
import PitchTrackingForm from './PitchTrackingForm';
import CurrentSession from './CurrentSession';
import PitchLogs from './PitchLogs';
import './App.css';

const App = () => {
  const [activeTab, setActiveTab] = useState('form');
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [resetPasswordMode, setResetPasswordMode] = useState(false);

  const resetPasswordModalRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

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

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error.message);
    }
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

  const renderContent = () => {
    switch (activeTab) {
      case 'form':
        return <PitchTrackingForm setActiveTab={setActiveTab} />;
      case 'session':
        return <CurrentSession setActiveTab={setActiveTab} />;
      case 'logs':
        return <PitchLogs />;
      default:
        return <PitchTrackingForm setActiveTab={setActiveTab} />;
    }
  };

  if (!user) {
    return (
      <div className="auth-container">
        <h2>{isRegistering ? 'Register' : 'Login'} to Pitch Tracker</h2>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="auth-input" />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="auth-input" />
        <button onClick={isRegistering ? handleRegister : handleLogin} className="auth-button">
          {isRegistering ? 'Register' : 'Login'}
        </button>
        <p style={{ marginTop: '10px' }}>
          {isRegistering ? 'Already have an account?' : 'Need an account?'}{' '}
          <span onClick={() => setIsRegistering(!isRegistering)} style={{ color: '#4CAF50', cursor: 'pointer', fontWeight: 'bold' }}>
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
              <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} className="auth-input" />
              <button onClick={handleResetPassword} className="auth-button">
                Send Reset Email
              </button>
            </div>
          </div>
        )}

        {!resetPasswordMode && (
          <div className="reset-password-link">
            <span onClick={() => setResetPasswordMode(true)} style={{ color: '#4CAF50', cursor: 'pointer' }}>
              Forgot Password?
            </span>
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
        {renderContent()}
      </div>

      <div className="tab-container">
        <div
          className={activeTab === 'form' ? 'active-tab' : 'inactive-tab'}
          onClick={() => setActiveTab('form')}
        >
          Pitch Tracking Form
        </div>
        <div
          className={activeTab === 'session' ? 'active-tab' : 'inactive-tab'}
          onClick={() => setActiveTab('session')}
        >
          Current Session
        </div>
        <div
          className={activeTab === 'logs' ? 'active-tab' : 'inactive-tab'}
          onClick={() => setActiveTab('logs')}
        >
          Pitch Logs
        </div>
      </div>
    </div>
  );
};

export default App;

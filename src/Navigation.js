// src/Navigation.js
import React, { useState } from 'react';
import './App.css';

const Navigation = ({ activeTab, setActiveTab, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div className="header">
        <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
        <h1>Pitch Tracker</h1>
        <button onClick={onLogout} className="logout-button">Logout</button>
      </div>

      {menuOpen && (
        <div className="dropdown-menu">
          <div onClick={() => { setActiveTab('form'); setMenuOpen(false); }}>Pitch Tracking Form</div>
          <div onClick={() => { setActiveTab('session'); setMenuOpen(false); }}>Current Session</div>
          <div onClick={() => { setActiveTab('logs'); setMenuOpen(false); }}>Pitch Logs</div>
        </div>
      )}

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
    </>
  );
};

export default Navigation;

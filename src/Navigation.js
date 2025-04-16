// src/Navigation.js
import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const Navigation = ({ activeTab, setActiveTab, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  return (
    <>
      <div className="header">
        <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
        <h1>Pitch Tracker</h1>
      </div>

      <div ref={menuRef} className={`slide-out-menu ${menuOpen ? 'open' : ''}`}>
        <div onClick={() => { setActiveTab('form'); setMenuOpen(false); }}>Pitch Tracking Form</div>
        <div onClick={() => { setActiveTab('session'); setMenuOpen(false); }}>Current Session</div>
        <div onClick={() => { setActiveTab('logs'); setMenuOpen(false); }}>Pitch Logs</div>
        <div onClick={() => { onLogout(); setMenuOpen(false); }} className="logout-menu">Logout</div>
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
    </>
  );
};

export default Navigation;

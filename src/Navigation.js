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
      <div className="header themed-header">
      <div className={`menu-icon ${menuOpen ? 'hidden' : ''}`} onClick={() => setMenuOpen(true)}>
          <div className="bar themed-bar"></div>
          <div className="bar themed-bar"></div>
          <div className="bar themed-bar"></div>
        </div>
        <h1 className="themed-title">Pitch Tracker</h1>
      </div>

      <div ref={menuRef} className={`slide-out-menu ${menuOpen ? 'open' : ''} themed-menu`}>
        <div className="menu-content">
          <div className="menu-items">
            <div className="menu-item" onClick={() => { setActiveTab('form'); setMenuOpen(false); }}>Pitch Tracking Form</div>
            <div className="menu-item" onClick={() => { setActiveTab('session'); setMenuOpen(false); }}>Current Session</div>
            <div className="menu-item" onClick={() => { setActiveTab('logs'); setMenuOpen(false); }}>Pitch Logs</div>
          </div>
          <div onClick={() => { onLogout(); setMenuOpen(false); }} className="logout-menu">
            Logout
          </div>
        </div>
      </div>

      <div className="tab-container themed-tab-container">
        <div
          className={activeTab === 'form' ? 'active-tab themed-active-tab' : 'inactive-tab themed-inactive-tab'}
          onClick={() => setActiveTab('form')}
        >
          Pitch Form
        </div>
        <div
          className={activeTab === 'session' ? 'active-tab themed-active-tab' : 'inactive-tab themed-inactive-tab'}
          onClick={() => setActiveTab('session')}
        >
          Session
        </div>
        <div
          className={activeTab === 'logs' ? 'active-tab themed-active-tab' : 'inactive-tab themed-inactive-tab'}
          onClick={() => setActiveTab('logs')}
        >
          Logs
        </div>
      </div>
    </>
  );
};

export default Navigation;

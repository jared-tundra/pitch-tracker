// src/App.js
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import PitchTrackingForm from './PitchTrackingForm';
import CurrentSession from './CurrentSession';
import PitchLogs from './PitchLogs';
import AuthScreen from './AuthScreen';
import Navigation from './Navigation';
import './App.css';

const App = () => {
  const [activeTab, setActiveTab] = useState('form');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error.message);
    }
  };

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

  if (!user) return <AuthScreen />;

  return (
    <div className="app-container">
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />
      <div className="content-area">{renderContent()}</div>
    </div>
  );
};

export default App;

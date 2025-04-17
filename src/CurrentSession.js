// src/CurrentSession.js
import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  updateDoc,
  doc,
  addDoc,
  where,
  deleteDoc
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';



const CurrentSession = ({ setActiveTab }) => {
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSubmitConfirmation, setShowSubmitConfirmation] = useState(false);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);

  const auth = getAuth();
  const user = auth.currentUser;

  const fetchCurrentSession = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const sessionRef = collection(db, 'CurrentPitchSession');
      const q = query(
        sessionRef,
        where('submittedBy', '==', user.email),
        where('submitted', '==', false),
        limit(1)
      );

      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const session = querySnapshot.docs[0];
        setSessionData({ id: session.id, ...session.data() });
      } else {
        setSessionData(null);
      }
    } catch (error) {
      console.error('Error fetching current session: ', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentSession();
  }, [user]);

  const updatePitchCount = async (increment) => {
    if (!sessionData) return;

    try {
      const sessionRef = doc(db, 'CurrentPitchSession', sessionData.id);
      const currentPitchCount = sessionData.pitchCount || 0;

      await updateDoc(sessionRef, {
        pitchCount: currentPitchCount + increment,
      });

      setSessionData(prev => ({
        ...prev,
        pitchCount: currentPitchCount + increment,
      }));
    } catch (error) {
      console.error('Error updating pitch count: ', error);
    }
  };

  const submitSession = async () => {
    if (!sessionData || !user) return;

    try {
      await addDoc(collection(db, 'PitchLogs'), {
        playerName: sessionData.player,
        pitchCount: sessionData.pitchCount,
        notes: sessionData.notes,
        date: sessionData.date,
        submittedBy: user.email,
        createdAt: new Date(),
      });

      const sessionRef = doc(db, 'CurrentPitchSession', sessionData.id);
      await updateDoc(sessionRef, { submitted: true });

      setSessionData(null);
      setShowSubmitConfirmation(false);
      setActiveTab('form');
    } catch (error) {
      console.error('Error submitting pitch session: ', error);
    }
  };

  const cancelSession = async () => {
    if (!sessionData) return;

    try {
      await deleteDoc(doc(db, 'CurrentPitchSession', sessionData.id));
      setSessionData(null);
      setShowCancelConfirmation(false);
      setActiveTab('form');
    } catch (error) {
      console.error('Error canceling session: ', error);
    }
  };

  if (loading) {
    return <p>Loading session...</p>;
  }

  return (
    <div className="session-container">
      <h2 className="form-title">Current Session</h2>
      {sessionData ? (
        <div className="session-info">
          <p><strong>Date:</strong> {sessionData.date}</p>
          <p><strong>Player:</strong> {sessionData.player}</p>
          <p><strong>Notes:</strong> {sessionData.notes}</p>


          <div className="pitch-count-display">{sessionData.pitchCount}</div>
          <div className="pitch-buttons-row">
            <button className="pitch-button" onClick={() => updatePitchCount(-1)}>
              <img src="/assets/minus.svg" alt="-1" className="pitch-icon" />
            </button>
            <button className="pitch-button" onClick={() => updatePitchCount(1)}>
              <img src="/assets/plus.svg" alt="+1" className="pitch-icon" />
            </button>
          </div>



          <div className="action-buttons-row">
            <button className="session-button" onClick={() => setShowSubmitConfirmation(true)}>Submit</button>
            <button className="session-button cancel" onClick={() => setShowCancelConfirmation(true)}>Cancel</button>
          </div>

          {showSubmitConfirmation && (
            <div className="confirmation-modal">
              <p>Are you sure you want to submit {sessionData.player}'s pitch session?</p>
              <button onClick={submitSession}>Yes</button>
              <button onClick={() => setShowSubmitConfirmation(false)}>No</button>
            </div>
          )}

          {showCancelConfirmation && (
            <div className="confirmation-modal">
              <p>Are you sure you want to cancel {sessionData.player}'s pitch session?</p>
              <button onClick={cancelSession}>Yes</button>
              <button onClick={() => setShowCancelConfirmation(false)}>No</button>
            </div>
          )}
        </div>
      ) : (
        <p>No active session.</p>
      )}
    </div>
  );
};

export default CurrentSession;

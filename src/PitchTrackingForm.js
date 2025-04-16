import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const PitchTrackingForm = ({ setActiveTab }) => {
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
  });
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const playersCollection = collection(db, 'Players');
        const playerSnapshot = await getDocs(playersCollection);
        const playerList = playerSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPlayers(playerList);
      } catch (error) {
        console.error('Error fetching players: ', error);
      }
    };

    fetchPlayers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError('You must be signed in to start a session.');
      return;
    }

    try {
      const existingSessionQuery = query(
        collection(db, 'CurrentPitchSession'),
        where('submittedBy', '==', user.email),
        where('submitted', '==', false)
      );

      const existingSessionSnapshot = await getDocs(existingSessionQuery);

      if (!existingSessionSnapshot.empty) {
        setError(
          'You already have an active session. Please submit or cancel it before creating a new one.'
        );
        return;
      }

      await addDoc(collection(db, 'CurrentPitchSession'), {
        date,
        player: selectedPlayer,
        notes,
        createdAt: Timestamp.now(),
        submitted: false,
        submittedBy: user.email,
      });

      setDate(new Date().toISOString().split('T')[0]); // reset to today's date
      setSelectedPlayer('');
      setNotes('');
      setError('');

      setActiveTab('session');
    } catch (error) {
      console.error('Error adding pitch tracking session: ', error);
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div>
      <h2>Start Pitch Tracking Session</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Date: </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Player: </label>
          <select
            value={selectedPlayer}
            onChange={(e) => setSelectedPlayer(e.target.value)}
            required
          >
            <option value="">Select a player</option>
            {players.map((player) => (
              <option key={player.id} value={player.fullName}>
                {player.fullName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Notes: </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div>
          <button type="submit">Start Session</button>
        </div>
      </form>
    </div>
  );
};

export default PitchTrackingForm;

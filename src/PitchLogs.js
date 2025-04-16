// src/PitchLogs.js
import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const PitchLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchLogs = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const logsRef = collection(db, 'PitchLogs');
        const q = query(
          logsRef,
          where('submittedBy', '==', user.email),
          //orderBy('createdAt', 'desc')
        );

        const snapshot = await getDocs(q);
        const logsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setLogs(logsData);
      } catch (error) {
        console.error('Error fetching pitch logs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [user]);

  return (
    <div>
      <h2>Pitch Logs</h2>
      {loading ? (
        <p>Loading logs...</p>
      ) : logs.length === 0 ? (
        <p>No pitch logs available.</p>
      ) : (
        <ul>
          {logs.map(log => (
            <li key={log.id}>
              <strong>{log.date}</strong> - {log.playerName} - {log.pitchCount} pitches<br />
              <em>{log.notes}</em>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PitchLogs;

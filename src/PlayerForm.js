// PlayerForm.js

import React, { useState } from 'react';
import { db } from './firebase'; // Import your Firebase setup
import { collection, addDoc } from 'firebase/firestore'; // Import Firestore functions

const AddPlayerForm = () => {
  const [fullName, setFullName] = useState(''); // State to store the player's name

  // Function to handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    try {
      // Add a new document to the "Players" collection with the full name
      await addDoc(collection(db, 'Players'), {
        fullName: fullName, // Document field "fullName"
      });

      console.log('Player added to database');
      setFullName(''); // Clear the input field after submission
    } catch (error) {
      console.error('Error adding player: ', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter player's full name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)} // Update the state when typing
      />
      <button type="submit">Add Player</button>
    </form>
  );
};

export default AddPlayerForm;

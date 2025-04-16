// src/authService.js
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from './firebase';

export const loginUser = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    return handleAuthError(error);  // Return error message instead of throwing
  }
};

export const registerUser = async (email, password) => {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
  } catch (error) {
    return handleAuthError(error);  // Return error message instead of throwing
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout error:", error.message);
  }
};

export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return 'Password reset email sent. Please check your inbox.';
  } catch (error) {
    return handleAuthError(error);
  }
};

export const handleAuthError = (error) => {
  let errorMessage = '';

  switch (error.code) {
    case 'auth/weak-password':
      errorMessage = 'Password is too weak. It must be at least 6 characters long.';
      break;
    case 'auth/invalid-email':
      errorMessage = 'The email address is invalid. Please enter a valid email address.';
      break;
    case 'auth/email-already-in-use':
      errorMessage = 'The email address is already in use by another account. Please use a different email.';
      break;
    case 'auth/user-not-found':
      errorMessage = 'No user found with this email. Please register or check the email address.';
      break;
    case 'auth/wrong-password':
      errorMessage = 'Incorrect password. Please try again.';
      break;
    case 'auth/password-reset-required':
      errorMessage = 'Password reset required. Please reset your password to continue.';
      break;
    case 'auth/missing-email':
      errorMessage = 'Please enter an email address.';
      break;
    case 'auth/user-disabled':
      errorMessage = 'This user account has been disabled. Contact support for more details.';
      break;
    case 'auth/invalid-credential':
      errorMessage = 'The provided credentials are invalid. Please check your email and password.';
      break;
    default:
      errorMessage = error.message || 'An error has occurred, please try again later.';
      break;
  }

  return errorMessage;  // Return error message
};

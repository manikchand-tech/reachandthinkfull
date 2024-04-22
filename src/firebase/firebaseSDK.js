// firebaseSDK.js
// Correct import for a default export

// Import Firebase SDK

import { getStorage } from "firebase/storage";
import { getAuth } from 'firebase/auth';
import { app } from './firebaseConfig';
// Your web app's Firebase configuration


// Initialize Firebase

const auth = getAuth(app);

const firebase = {
  // Example method to sign in with email and password
  signInWithEmailAndPassword: async (email, password) => {
    try {
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  },

  // Example method to sign out
  signOut: async () => {
    try {
      await auth.signOut();
    } catch (error) {
      throw error;
    }
  },

  // Add more methods as needed for your project
  
};
const storage = getStorage(app);

export default firebase;

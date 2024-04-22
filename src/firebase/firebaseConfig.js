// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import '@firebase/storage';
import firebase from "./firebaseSDK";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
    apiKey: "AIzaSyDgKVCavuOM3N0ZXksQOBcugG5VOjUsA0s",
    authDomain: "rntimagestore.firebaseapp.com",
    projectId: "rntimagestore",
    storageBucket: "rntimagestore.appspot.com",
    messagingSenderId: "109777450621",
    appId: "1:109777450621:web:17b59660b5a5650cfee314",
    measurementId: "G-EEJ91S68F2"
};

// Initialize Firebase
 
    // Handle the case when the application is offline
    
  
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app);

export { app, analytics, storage };
// In firebaseConfig.js

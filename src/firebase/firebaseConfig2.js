// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCo7euKA__O0P9IMqR05QNQqOKFC_CHna4",
  authDomain: "rntlocation-44f24.firebaseapp.com",
  projectId: "rntlocation-44f24",
  storageBucket: "rntlocation-44f24.appspot.com",
  messagingSenderId: "562986325859",
  appId: "1:562986325859:web:b264d8cf64f62298abe556",
  measurementId: "G-CZT55NBY98"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
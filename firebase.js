// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCg9U1SFbqqyUKYaHPmAx65meCNa5pyS6E",
  authDomain: "footy-scouter.firebaseapp.com",
  projectId: "footy-scouter",
  storageBucket: "footy-scouter.firebasestorage.app",
  messagingSenderId: "579237468582",
  appId: "1:579237468582:web:d50ce4b72853d26d5a1767",
  measurementId: "G-8Z68KN622T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
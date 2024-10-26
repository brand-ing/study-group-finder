// firebaseConfig.js
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC4-8Ig7PL2w0K4uJ2pv3POEnLlI5RNxaE",
  authDomain: "study-group-finder-833f3.firebaseapp.com",
  projectId: "study-group-finder-833f3",
  storageBucket: "study-group-finder-833f3.appspot.com",
  messagingSenderId: "1026694256185",
  appId: "1:1026694256185:web:6d53cd3f1c86d60e45dfe8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

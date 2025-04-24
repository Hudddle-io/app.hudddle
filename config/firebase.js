// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth, GoogleAuthProvider} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAMzeqvtJO758DGjg-KzF_--OeVoJtT4P8",
  authDomain: "hudddle-329d4.firebaseapp.com",
  projectId: "hudddle-329d4",
  storageBucket: "hudddle-329d4.firebasestorage.app",
  messagingSenderId: "566444544330",
  appId: "1:566444544330:web:6467f0dda53c1353dbb1b3",
  measurementId: "G-M2WCZ1ZJEH"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
// const analytics = getAnalytics(app);
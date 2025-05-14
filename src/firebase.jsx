// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { logEvent } from "firebase/analytics";

if (analytics) {
  logEvent(analytics, 'notification_received');
}
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDX6Cxm_jwQG_g5GEwXv59pIVgkPnJXQHM",
  authDomain: "frontend2-fe1b7.firebaseapp.com",
  projectId: "frontend2-fe1b7",
  storageBucket: "frontend2-fe1b7.firebasestorage.app",
  messagingSenderId: "334935590505",
  appId: "1:334935590505:web:a61d79a1ad27111de904f8",
  measurementId: "G-MXK4P7NCVJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
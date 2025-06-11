import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDX6Cxm_jwQG_g5GEwXv59pIVgkPnJXQHM", // your API key
  authDomain: "frontend2-fe1b7.firebaseapp.com",
  projectId: "frontend2-fe1b7",
  storageBucket: "frontend2-fe1b7.appspot.com",
  messagingSenderId: "334935590505",
  appId: "1:334935590505:web:a61d79a1ad27111de904f8",
  measurementId: "G-MXK4P7NCVJ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const db = getFirestore(app);
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBd4z6q0OXrnx_oO3lulY7fdLWftYcNNjg",
  authDomain: "travelbuddy-e100f.firebaseapp.com",
  projectId: "travelbuddy-e100f",
  storageBucket: "travelbuddy-e100f.firebasestorage.app",
  messagingSenderId: "685712711397",
  appId: "1:685712711397:web:54671cda536ec7e9fa7e0c",
  measurementId: "G-MQW0GVSZ28"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); 
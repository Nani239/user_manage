import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA25i6aDl8l7QHhO2bRSeRMan-5z3RhKa8",
  authDomain: "chatting-app-81499.firebaseapp.com",
  projectId: "chatting-app-81499",
  storageBucket: "chatting-app-81499.appspot.com",
  messagingSenderId: "45158523354",
  appId: "1:45158523354:web:5f47c3a7871654eb12e0e3",
  measurementId: "G-2VJ7K0JVZK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export const auth = getAuth(app);
export const firestore = getFirestore(app);

export default app;

export { db };

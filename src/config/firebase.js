import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Replace with your Firebase project configuration
// You will get this from Firebase Console > Project Settings > General > Your apps
const firebaseConfig = {
  apiKey: "AIzaSyD4yrIwq_9fJRXcZL4f8naMtBvdpLK-0G0",
  authDomain: "resumate-7b399.firebaseapp.com",
  projectId: "resumate-7b399",
  storageBucket: "resumate-7b399.firebasestorage.app",
  messagingSenderId: "828559715376",
  appId: "1:828559715376:web:9ed71233a26d80d72a91f5",
  measurementId: "G-SW72B4PHWD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;

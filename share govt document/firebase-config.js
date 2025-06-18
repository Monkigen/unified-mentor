// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-analytics.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-storage.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBVqkJYXDkqo5osRdFc2xhMbVCbXlDw_VQ",
  authDomain: "my-learnings-c61f0.firebaseapp.com",
  projectId: "my-learnings-c61f0",
  storageBucket: "my-learnings-c61f0.firebasestorage.app",
  messagingSenderId: "76225945246",
  appId: "1:76225945246:web:d09292ef70e4c7e23e258f",
  measurementId: "G-KZT6SCVVTY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app); // Initialize Firebase Storage
const db = getFirestore(app); // Initialize Firestore

export { storage, db };
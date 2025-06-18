// script.js
import { auth } from './firebase-config.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

// Register
const regForm = document.getElementById("register-form");
if (regForm) {
  regForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("reg-email").value;
    const password = document.getElementById("reg-password").value;

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Registered successfully!");
      window.location.href = "dashboard.html";
    } catch (error) {
      alert(error.message);
    }
  });
}

// Login
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful!");
      window.location.href = "dashboard.html";
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  });
}

// Google Sign-In
const googleSignInButton = document.getElementById("google-signin");
if (googleSignInButton) {
  googleSignInButton.addEventListener("click", async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      alert("Google Sign-In successful!");
      window.location.href = "dashboard.html";
    } catch (error) {
      alert("Google Sign-In failed: " + error.message);
    }
  });
}

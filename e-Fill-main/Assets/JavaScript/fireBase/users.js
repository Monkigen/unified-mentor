import { dBase, auth, USERS } from "./app.js"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js"
import { ref, set } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"
import { startProgress } from "../common/utils/animations.js"
import { showInfo } from "../common/utils/form.js"
import { getParam, redirect } from "../common/utils/urls.js"


const ERR_KEYWORDS = ["email-already-in-use", "user-not-found", "wrong-password"]

import { createLogger } from '../common/utils/logger.js';

const logger = createLogger('firebase-users');

// Register User
export const registerUser = (newData, redirectLink, sumtBtn) => {
    const progRef = startProgress(newData);
    logger.info('Attempting to register new user', { email: newData.email });
    
    createUserWithEmailAndPassword(auth, newData.email, newData.password)
        .then((creds) => {
            logger.info('User registered successfully', { uid: creds.user.uid });
            delete newData.password;
            createUser(creds.user.uid, newData, redirectLink, progRef, sumtBtn);
        })
        .catch((error) => {
            let errCode = error.code;
            logger.error('Registration failed', { code: errCode, message: error.message });
            
            if (errCode.endsWith(ERR_KEYWORDS[0])) {
                showInfo("User Already Exists", "incomplete", progRef, sumtBtn, true);
            } else {
                showInfo("Registration failed. Please try again.", "incomplete", progRef, sumtBtn, true);
                logger.error('Unexpected error during registration', error);
            }
        });
}

// Create new user
const createUser = (uid, newData, redirectLink, progRef, sumtBtn) => {
    let newUserRef = ref(dBase, USERS + uid)
    set(newUserRef, newData)
        .then(() => {
            showInfo("Registered", "complete", progRef, sumtBtn)
            setTimeout(() => {
                redirect(redirectLink, getParam("searchfor", false))
            }, 1000)
        })
        .catch(error => console.log(error))
}

// Login User
export const loginUser = (newData, redirectLink, sumtBtn) => {
    const progRef = startProgress(newData);
    logger.info('Attempting to login user', { email: newData.email });

    signInWithEmailAndPassword(auth, newData.email, newData.password)
        .then((userCredential) => {
            logger.info('User logged in successfully', { uid: userCredential.user.uid });
            showInfo("Login successful", "complete", progRef, sumtBtn);
            setTimeout(() => {
                redirect(redirectLink, getParam("searchfor", false));
            }, 500);
        })
        .catch((error) => {
            let errCode = error.code;
            logger.error('Login failed', { code: errCode, message: error.message });

            if (errCode.endsWith(ERR_KEYWORDS[1])) {
                showInfo("User not found", "incomplete", progRef, sumtBtn, true);
            } else if (errCode.endsWith(ERR_KEYWORDS[2])) {
                showInfo("Invalid password", "incomplete", progRef, sumtBtn, true);
            } else {
                showInfo("Login failed. Please try again.", "incomplete", progRef, sumtBtn, true);
                logger.error('Unexpected error during login', error);
            }
        });
}
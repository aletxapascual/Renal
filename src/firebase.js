// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDM4euL666ZlgnYabzJeqDjZyMisuHgYd8",
    authDomain: "renal-c6452.firebaseapp.com",
    projectId: "renal-c6452",
    storageBucket: "renal-c6452.firebasestorage.app",
    messagingSenderId: "843927060911",
    appId: "1:843927060911:web:d17390a1418c287d63af5a",
    measurementId: "G-QYX8EJRRZ4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, googleProvider,db };

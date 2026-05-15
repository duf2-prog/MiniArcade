// Import the functions you need from the SDKs you need
import { getApps, initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBCxx09UT0ccxYxlAGF6Gyqp_98evenfHE",
    authDomain: "miniarcade-bd154.firebaseapp.com",
    databaseURL: "https://miniarcade-bd154-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "miniarcade-bd154",
    storageBucket: "miniarcade-bd154.firebasestorage.app",
    messagingSenderId: "808495057130",
    appId: "1:808495057130:web:8dbaf2aecba07130af6f93"
};

// Initialize Firebase
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getDatabase(app);
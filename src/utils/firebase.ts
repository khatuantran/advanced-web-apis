// Import the functions you need from the SDKs you need
import "dotenv/config";
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "advanced-web-apis.firebaseapp.com",
  projectId: "advanced-web-apis",
  storageBucket: "advanced-web-apis.appspot.com",
  messagingSenderId: "94163554845",
  appId: "1:94163554845:web:0cae8845013c3c0e6d6cf4",
  measurementId: "G-0VHD8P1N60",
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDdZhh4k4DgrJiT7TjgHg5Qnd6VjFXlfoU",
  authDomain: "bingecinema-6d07a.firebaseapp.com",
  projectId: "bingecinema-6d07a",
  storageBucket: "bingecinema-6d07a.firebasestorage.app",
  messagingSenderId: "531365996088",
  appId: "1:531365996088:web:b35ba25ff9bbd03c7e68cd",
  measurementId: "G-MWHK0T1V9Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
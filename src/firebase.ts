// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCKaIqwAC5DE-EqtecQZec2p2QmnqFbjEs",
  authDomain: "pomodo-8a0fb.firebaseapp.com",
  projectId: "pomodo-8a0fb",
  storageBucket: "pomodo-8a0fb.firebasestorage.app",
  messagingSenderId: "1004602329425",
  appId: "1:1004602329425:web:6b637b565a6415a0612b70",
  measurementId: "G-5ZCTFFPMLR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
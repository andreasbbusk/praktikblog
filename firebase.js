// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBzKTmNwQ6aLFZ1hftnH4IcDxBJDgyDxtQ",
  authDomain: "praktikblog-28d44.firebaseapp.com",
  projectId: "praktikblog-28d44",
  storageBucket: "praktikblog-28d44.firebasestorage.app",
  messagingSenderId: "1094674152744",
  appId: "1:1094674152744:web:11c76580e6854a0e96241d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

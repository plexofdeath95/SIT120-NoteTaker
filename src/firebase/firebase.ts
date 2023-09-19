// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDB5GMCZrh8NtNuF0VZ-r8hOztHS5E7YJA",
  authDomain: "sit120-581c8.firebaseapp.com",
  projectId: "sit120-581c8",
  storageBucket: "sit120-581c8.appspot.com",
  messagingSenderId: "191849867262",
  appId: "1:191849867262:web:738bb91d6aa857f55fc2af"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app)

export default db;
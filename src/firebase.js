// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCvo5M25qm95Y8qXxxcamjZCwPxACByuRk",
  authDomain: "facerec-eddc0.firebaseapp.com",
  projectId: "facerec-eddc0",
  storageBucket: "facerec-eddc0.appspot.com",
  messagingSenderId: "31351843636",
  appId: "1:31351843636:web:5de1d32a5dfc613c53d361"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup };

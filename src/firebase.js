import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCB22TCtXkIebR3n8R1urpCMfCd0RlCriQ",
  authDomain: "mern-auth-876f8.firebaseapp.com",
  projectId: "mern-auth-876f8",
  storageBucket: "mern-auth-876f8.appspot.com",
  messagingSenderId: "322680448950",
  appId: "1:322680448950:web:3e3c323eb047caad0b8317",
  measurementId: "G-0RJRHYWJE3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Google sign-in error:", error.message);
    throw error;
  }
};

const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Sign-out error:", error.message);
    throw error;
  }
};

export { auth, googleProvider, signInWithGoogle, logOut };

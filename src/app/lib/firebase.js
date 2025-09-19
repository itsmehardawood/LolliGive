import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAblQ6mZFfSMR8UExYBKX0ePbSP0-ZoN68",
  authDomain: "lolligive.firebaseapp.com",
  projectId: "lolligive",
  storageBucket: "lolligive.firebasestorage.app",
  messagingSenderId: "502014264447",
  appId: "1:502014264447:web:edbfa35b251dcd7757af75",
  measurementId: "G-64EM26JYS5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export { RecaptchaVerifier, signInWithPhoneNumber };   
import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDqKNn1eMDFsdD9JW1LYqKntBKMQ3gVeuA",
  authDomain: "lolligive-llc.firebaseapp.com",
  projectId: "lolligive-llc",
  storageBucket: "lolligive-llc.firebasestorage.app",
  messagingSenderId: "58751947659",
  appId: "1:58751947659:web:de164c916128e61a57958e",
  measurementId: "G-12N2S8JYRZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export { RecaptchaVerifier, signInWithPhoneNumber };   
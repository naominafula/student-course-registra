import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyC3sMjQCZD-DMhBmvnSyD8uFJ4SkxJNGFY",
  authDomain: "student-course-registar.firebaseapp.com",
  projectId: "student-course-registar",
  storageBucket: "student-course-registar.firebasestorage.app",
  messagingSenderId: "766761680570",
  appId: "1:766761680570:web:f8f5f2b1bbc6e01374cc83",
  measurementId: "G-JGZFDG0TX3"
};

export const isFirebaseConfigured = true;

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
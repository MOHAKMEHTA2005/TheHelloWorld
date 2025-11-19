// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDfhPXbPqOPcHRAdQdnL7FeaHlyGv4GNGU",
  authDomain: "thehelloworld-v1.firebaseapp.com",
  projectId: "thehelloworld-v1",
  storageBucket: "thehelloworld-v1.firebasestorage.app",
  messagingSenderId: "950519603054",
  appId: "1:950519603054:web:4cce0db9f577aad5056b7f",
  measurementId: "G-RPWYNN01Q6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Auth providers
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();

// Export the app instance for other services
export { app };

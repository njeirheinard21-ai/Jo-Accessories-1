import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAMrnVQw8GkfQUEalpDf5JJ8qXEJKejSno",
  authDomain: "jo-accessories-44ffa.firebaseapp.com",
  projectId: "jo-accessories-44ffa",
  storageBucket: "jo-accessories-44ffa.firebasestorage.app",
  messagingSenderId: "558382097899",
  appId: "1:558382097899:web:9cc2520959604ed4d325ae",
  measurementId: "G-NNRGJSKPD0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

// Enable offline persistence for enterprise reliability
if (typeof window !== "undefined") {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code == 'failed-precondition') {
      console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code == 'unimplemented') {
      console.warn('The current browser does not support all of the features required to enable persistence');
    }
  });
}

export { app, analytics, auth, db, storage, googleProvider };

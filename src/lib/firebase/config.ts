
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore"; // Uncomment if using Firestore
// import { getStorage } from "firebase/storage"; // Uncomment if using Storage

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Optional
};

let app: FirebaseApp;
let auth: Auth;

// Check if Firebase API Key is provided
if (!firebaseConfig.apiKey) {
  console.error("Firebase initialization error: Missing Firebase API Key. Make sure NEXT_PUBLIC_FIREBASE_API_KEY environment variable is set.");
  // Throw an error or handle the missing key scenario appropriately.
  // For this app, auth is critical, so we throw.
  throw new Error("Missing Firebase API Key environment variable.");
}

try {
  // Initialize Firebase
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  // const db = getFirestore(app); // Uncomment if using Firestore
  // const storage = getStorage(app); // Uncomment if using Storage
} catch (error: any) {
  // Catch potential errors during initialization (e.g., invalid config values)
  console.error("Firebase initialization error:", error.message);
  // Re-throw the error to halt execution if Firebase is critical
  throw new Error(`Firebase initialization failed: ${error.message}`);
}


export { app, auth }; // Add db, storage to export if used



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
  // measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Optional
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let firebaseInitializationError: string | null = null;

// Check if Firebase API Key is provided
if (!firebaseConfig.apiKey || firebaseConfig.apiKey === "YOUR_API_KEY") {
  const errorMessage = "Firebase initialization error: Missing or placeholder Firebase API Key. Make sure NEXT_PUBLIC_FIREBASE_API_KEY environment variable is set correctly in your .env.local file.";
  console.error(errorMessage);
  firebaseInitializationError = errorMessage;
  // Throw error only during build/server-side execution, not on client
  if (typeof window === 'undefined') {
    throw new Error(errorMessage);
  }
} else {
  try {
    // Initialize Firebase only if the config seems valid
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    // const db = getFirestore(app); // Uncomment if using Firestore
    // const storage = getStorage(app); // Uncomment if using Storage
  } catch (error: any) {
    // Catch potential errors during initialization (e.g., invalid config values)
    firebaseInitializationError = `Firebase initialization failed: ${error.message}`;
    console.error(firebaseInitializationError, error);
     // Throw error only during build/server-side execution
    if (typeof window === 'undefined') {
        throw new Error(firebaseInitializationError);
    }
  }
}

export { app, auth, firebaseInitializationError }; // Add db, storage to export if used


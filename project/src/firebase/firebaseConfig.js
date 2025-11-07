import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Option 1: Use environment variables (recommended for production)
// Create .env.local file with VITE_FIREBASE_* variables
// Option 2: Hardcode your Firebase config directly below (works for development)
// Get your config from: Firebase Console → Project Settings → Your apps → Web app config

// Replace the values below with your actual Firebase config from Firebase Console
const hardcodedConfig = {
  apiKey: "AIzaSyAD3kCatYW1kKDRZqlHMHrCtd21MPvYsnk",
  authDomain: "devyonira.firebaseapp.com",
  projectId: "devyonira",
  storageBucket: "devyonira.firebasestorage.app",
  messagingSenderId: "1004781720481",
  appId: "1:1004781720481:web:479eae25a55ef0d64e31e0",
};

// Use environment variables if available, otherwise fall back to hardcoded config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || hardcodedConfig.apiKey,
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || hardcodedConfig.authDomain,
  projectId:
    import.meta.env.VITE_FIREBASE_PROJECT_ID || hardcodedConfig.projectId,
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    hardcodedConfig.storageBucket,
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ||
    hardcodedConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || hardcodedConfig.appId,
};

// Validation: warn if config is still incomplete
if (
  String(firebaseConfig.apiKey).includes("YOUR_") ||
  String(firebaseConfig.authDomain).includes("YOUR_") ||
  String(firebaseConfig.projectId).includes("YOUR_") ||
  String(firebaseConfig.appId).includes("YOUR_")
) {
  // eslint-disable-next-line no-console
  console.error(
    "⚠️ Firebase config is incomplete! Replace 'YOUR_*' values in firebaseConfig.js with your actual Firebase config from Firebase Console."
  );
}

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;

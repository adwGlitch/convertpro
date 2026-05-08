import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

let app;
let auth;
let googleProvider;

try {
  if (firebaseConfig.apiKey !== "YOUR_API_KEY") {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
  } else {
    console.warn("Firebase is not configured. Using mock auth.");
    auth = { onAuthStateChanged: (cb) => { cb(null); return () => {}; } };
    googleProvider = {};
  }
} catch (error) {
  console.error("Firebase initialization error", error);
  auth = { onAuthStateChanged: (cb) => { cb(null); return () => {}; } };
  googleProvider = {};
}

export { auth, googleProvider };

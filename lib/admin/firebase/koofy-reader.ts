import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";

// Public client configuration. Existing administrator Auth remains on the default app.
export const koofyReaderFirebaseConfig = {
  apiKey: "AIzaSyCMzpMFHwvfQlOqUQCXISz25Wk_5yEfapk",
  authDomain: "koofy-reader.firebaseapp.com",
  projectId: "koofy-reader",
  storageBucket: "koofy-reader.firebasestorage.app",
  messagingSenderId: "573216627685",
  appId: "1:573216627685:web:444a0ee95c828999b72d0c",
  measurementId: "G-LKS50RXYR0",
};

const APP_NAME = "koofy-reader-admin";

export function getKoofyReaderFirebaseApp(): FirebaseApp {
  return getApps().some((app) => app.name === APP_NAME)
    ? getApp(APP_NAME)
    : initializeApp(koofyReaderFirebaseConfig, APP_NAME);
}

// Do not sign in again here or send the default project's token to a normal
// koofy-reader callable. The reader backend must explicitly verify the existing
// administrator token against its trusted issuer and check superAdmin.
// Analytics is intentionally not initialized for the administrative console.

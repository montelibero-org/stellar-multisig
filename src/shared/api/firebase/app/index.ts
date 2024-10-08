// shared/api/firebase/app/index.ts
import { initializeApp, getApps, FirebaseApp } from "firebase/app";

let firebaseApp: FirebaseApp | undefined;

if (typeof window !== "undefined") {
  const firebaseConfig = {
    apiKey:
      localStorage.getItem("Firebase-apiKey") || process.env.NEXT_PUBLIC_API_KEY,
    authDomain:
      localStorage.getItem("Firebase-authDomain") ||
      process.env.NEXT_PUBLIC_AUTH_DOMAIN,
    projectId:
      localStorage.getItem("Firebase-projectId") ||
      process.env.NEXT_PUBLIC_PROJECT_ID,
    storageBucket:
      localStorage.getItem("Firebase-storageBucket") ||
      process.env.NEXT_PUBLIC_STORAGE_BUCKET,
    messagingSenderId:
      localStorage.getItem("Firebase-messagingSenderId") ||
      process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
    appId:
      localStorage.getItem("Firebase-appId") || process.env.NEXT_PUBLIC_APP_ID,
    measurementId:
      localStorage.getItem("Firebase-measurementId") ||
      process.env.NEXT_PUBLIC_MEASUREMENT_ID,
  };

  // Проверяем, были ли уже инициализированы приложения Firebase
  if (!getApps().length) {
    firebaseApp = initializeApp(firebaseConfig);
  } else {
    firebaseApp = getApps()[0];
  }
}

export default firebaseApp;

import { FirebaseApp, FirebaseOptions } from "firebase/app";
import { Firestore } from "firebase/firestore";

export interface FirebaseAppState {
  firebaseApp: FirebaseApp | undefined;
  firestore: Firestore | undefined;
}

export interface FirebaseAppActions {
  initializeFirebase: (config: FirebaseOptions) => FirebaseApp;
  setFirestore: (firestore: Firestore) => void;
}

interface IFirebaseSettingsSlice extends FirebaseAppState, FirebaseAppActions {}

export default IFirebaseSettingsSlice;

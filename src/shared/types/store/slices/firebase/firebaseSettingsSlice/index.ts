import { FirebaseApp, FirebaseOptions } from "firebase/app";
import { Firestore } from "firebase/firestore";

export interface FirebaseAppState {
  firebaseApp: FirebaseApp | undefined;
  firestore: Firestore | undefined;
}

export interface FirebaseAppActions {
  initializeFirebase: (
    config: FirebaseOptions,
    appName?: string
  ) => FirebaseApp | undefined;
  setFirestore: (firestore: Firestore | undefined) => void;
}

interface IFirebaseSettingsSlice extends FirebaseAppState, FirebaseAppActions {}

export default IFirebaseSettingsSlice;

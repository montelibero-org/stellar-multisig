import { IFirebaseSettingsSlice } from "@/shared/types/index";
import {
  FirebaseApp,
  FirebaseOptions,
  getApps,
  initializeApp,
  deleteApp,
} from "firebase/app";
import { Firestore, getFirestore } from "firebase/firestore";
import { StateCreator } from "zustand";

export const firebaseSettingsSlice: StateCreator<
  IFirebaseSettingsSlice,
  [["zustand/immer", never]],
  [],
  IFirebaseSettingsSlice
> = (set /*, get*/) => {
  const firebaseApp: FirebaseApp | undefined = undefined;
  const firestore: Firestore | undefined = undefined;

  const initializeFirebase = (config: FirebaseOptions, appName?: string) => {
    const name = appName || "[DEFAULT]";
    const existingApps = getApps();

    if (existingApps.length) {
      for (const app of existingApps) {
        if (app.name === name) {
          deleteApp(app);
        }
      }
    }

    if (
      config.apiKey &&
      config.appId &&
      config.messagingSenderId &&
      config.storageBucket &&
      config.projectId &&
      config.authDomain
    ) {
      const newFirebaseApp = initializeApp(config, name);
      set({ firebaseApp: newFirebaseApp });

      if (newFirebaseApp) {
        const newFirestore = getFirestore(newFirebaseApp);
        set({ firestore: newFirestore });
        return newFirebaseApp;
      }
    }

  };

  const setFirestore = (newFirestore: Firestore | undefined) => {
    set({ firestore: newFirestore });
  };

  return {
    firestore,
    firebaseApp,
    setFirestore,
    initializeFirebase,
  };
};

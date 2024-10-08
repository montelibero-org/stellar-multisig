// shared/api/firebase/firestore/index.ts
import { getFirestore, Firestore } from "firebase/firestore";
import firebaseApp from "../app";

let firestore: Firestore | undefined;

if (firebaseApp) {
  firestore = getFirestore(firebaseApp);
}

export default firestore;


// global.d.ts
declare global {
  interface Window {
    firebaseTimeout?: NodeJS.Timeout;
  }
}

export {};

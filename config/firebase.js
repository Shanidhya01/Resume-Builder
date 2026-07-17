import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, getFirestore } from 'firebase/firestore';

// Firebase Storage is intentionally omitted: this app uses only Authentication
// and Cloud Firestore. Every resume — content, sharing, analytics — lives inside
// Firestore documents; nothing is ever uploaded to a storage bucket.
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);

// Force long-polling. Many networks (VPNs, corporate proxies, ad-blockers,
// Brave shields) silently block Firestore's WebChannel write/listen stream. The
// symptom is "Failed to get document because the client is offline" — reads/writes
// give up as offline instead of reaching the server. Auto-detection probes the
// stream first and does not always fall back in time, so we force plain-HTTP
// long-polling, which those environments don't block. initializeFirestore can
// only run once per app, so guard against HMR re-init.
let firestore;
try {
    firestore = initializeFirestore(app, { experimentalForceLongPolling: true });
} catch {
    firestore = getFirestore(app);
}
export const db = firestore;

export default app;

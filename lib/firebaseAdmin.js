import 'server-only';
import { getApps, getApp, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Server-only Firebase Admin SDK. The `server-only` import above makes this
// module a hard build error if it is ever pulled into a client bundle, so the
// service-account credentials can never reach the browser.
//
// Credentials come from environment variables (never committed, set in Vercel):
//   FIREBASE_ADMIN_PROJECT_ID
//   FIREBASE_ADMIN_CLIENT_EMAIL
//   FIREBASE_ADMIN_PRIVATE_KEY   (PEM; \n escaped when stored as a single line)
//
// Initialization is lazy (first use) rather than at module load, so `next build`
// — which imports these routes for analysis but does not execute them — succeeds
// even in environments where the admin credentials are not present.
let cachedDb;

const buildCredential = () => {
    const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
    // Vercel/Env stores the multi-line PEM with literal "\n"; restore real newlines.
    const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!projectId || !clientEmail || !privateKey) {
        throw new Error(
            'Firebase Admin is not configured. Set FIREBASE_ADMIN_PROJECT_ID, ' +
                'FIREBASE_ADMIN_CLIENT_EMAIL and FIREBASE_ADMIN_PRIVATE_KEY.',
        );
    }
    return { credential: cert({ projectId, clientEmail, privateKey }) };
};

const getAdminApp = () => (getApps().length ? getApp() : initializeApp(buildCredential()));

// Returns the singleton Admin Firestore instance, initializing the app once.
export const getAdminDb = () => {
    if (!cachedDb) cachedDb = getFirestore(getAdminApp());
    return cachedDb;
};

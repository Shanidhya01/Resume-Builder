// Firestore-backed import history (Phase 7). One document per import attempt,
// owned by the importing user — see the importHistory block in firestore.rules.

import {
    collection,
    doc,
    addDoc,
    getDocs,
    deleteDoc,
    query,
    where,
    serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/config/firebase';

const HISTORY_COLLECTION = 'importHistory';

const historyRef = () => collection(db, HISTORY_COLLECTION);

// entry: { fileName, source: 'pdf'|'docx'|'json'|'backup', status: 'success'|'failed',
//          parseSuccess, confidence, resumeId, resumeName, error }
export const recordImport = async (uid, entry) => {
    const payload = {
        ownerId: uid,
        fileName: entry.fileName || 'unknown',
        source: entry.source || 'unknown',
        status: entry.status || 'failed',
        parseSuccess: Boolean(entry.parseSuccess),
        confidence: typeof entry.confidence === 'number' ? entry.confidence : null,
        resumeId: entry.resumeId || null,
        resumeName: entry.resumeName || null,
        error: entry.error || null,
        importedAt: serverTimestamp(),
    };
    const docRef = await addDoc(historyRef(), payload);
    return docRef.id;
};

export const listImportHistory = async uid => {
    const q = query(historyRef(), where('ownerId', '==', uid));
    const snap = await getDocs(q);
    const entries = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    // Sorted client-side to avoid needing a composite Firestore index.
    entries.sort((a, b) => (b.importedAt?.toMillis?.() ?? 0) - (a.importedAt?.toMillis?.() ?? 0));
    return entries;
};

export const deleteImportEntry = async id => {
    await deleteDoc(doc(db, HISTORY_COLLECTION, id));
};

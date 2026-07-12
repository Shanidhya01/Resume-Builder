import {
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    serverTimestamp,
    writeBatch,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { DEFAULT_TEMPLATE_ID } from '@/config/templates';

const RESUMES_COLLECTION = 'resumes';

const emptyResumeFields = () => ({
    contact: {},
    summary: {},
    education: [],
    experience: [],
    projects: [],
    skills: {},
    certificates: [],
    languages: [],
});

const resumesRef = () => collection(db, RESUMES_COLLECTION);
const resumeDocRef = id => doc(db, RESUMES_COLLECTION, id);
const versionsRef = id => collection(db, RESUMES_COLLECTION, id, 'versions');

const assertOwner = (resume, uid) => {
    if (!resume || resume.ownerId !== uid) {
        throw new Error('You do not have permission to access this resume.');
    }
};

export const createResume = async (uid, name = 'Untitled Resume', template = DEFAULT_TEMPLATE_ID) => {
    const payload = {
        ownerId: uid,
        name,
        selectedTemplate: template,
        ...emptyResumeFields(),
        isDefault: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    };
    const docRef = await addDoc(resumesRef(), payload);
    return docRef.id;
};

export const getResume = async id => {
    const snap = await getDoc(resumeDocRef(id));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() };
};

export const listResumesForUser = async uid => {
    const q = query(resumesRef(), where('ownerId', '==', uid));
    const snap = await getDocs(q);
    const resumes = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    resumes.sort((a, b) => (b.updatedAt?.toMillis?.() ?? 0) - (a.updatedAt?.toMillis?.() ?? 0));
    return resumes;
};

export const updateResume = async (id, data, uid) => {
    if (uid) {
        const existing = await getResume(id);
        assertOwner(existing, uid);
    }
    await updateDoc(resumeDocRef(id), { ...data, updatedAt: serverTimestamp() });
};

export const renameResume = async (id, name, uid) => {
    return updateResume(id, { name }, uid);
};

export const duplicateResume = async (id, uid) => {
    const original = await getResume(id);
    assertOwner(original, uid);

    const { id: _omit, createdAt, updatedAt, ...rest } = original;
    const payload = {
        ...rest,
        name: `${original.name} (Copy)`,
        isDefault: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    };
    const docRef = await addDoc(resumesRef(), payload);
    return docRef.id;
};

export const deleteResume = async (id, uid) => {
    const existing = await getResume(id);
    assertOwner(existing, uid);

    const versionsSnap = await getDocs(versionsRef(id));
    const batch = writeBatch(db);
    versionsSnap.docs.forEach(versionDoc => batch.delete(versionDoc.ref));
    batch.delete(resumeDocRef(id));
    await batch.commit();
};

export const setDefaultResume = async (uid, id) => {
    const resumes = await listResumesForUser(uid);
    const batch = writeBatch(db);
    resumes.forEach(resume => {
        batch.update(resumeDocRef(resume.id), { isDefault: resume.id === id });
    });
    await batch.commit();
};

export const saveVersionSnapshot = async (id, data) => {
    const payload = { ...data, savedAt: serverTimestamp() };
    const docRef = await addDoc(versionsRef(id), payload);
    return docRef.id;
};

export const listVersions = async id => {
    const q = query(versionsRef(id), orderBy('savedAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const restoreVersion = async (id, versionId, uid) => {
    const existing = await getResume(id);
    assertOwner(existing, uid);

    const versionSnap = await getDoc(doc(db, RESUMES_COLLECTION, id, 'versions', versionId));
    if (!versionSnap.exists()) throw new Error('Version not found.');

    const { savedAt, ...fields } = versionSnap.data();
    await updateDoc(resumeDocRef(id), { ...fields, updatedAt: serverTimestamp() });
    return fields;
};

export const deleteAllResumesForUser = async uid => {
    const resumes = await listResumesForUser(uid);
    for (const resume of resumes) {
        await deleteResume(resume.id, uid);
    }
};

export { emptyResumeFields };

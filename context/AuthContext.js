'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    setPersistence,
    browserLocalPersistence,
    browserSessionPersistence,
    signOut,
    sendPasswordResetEmail,
    sendEmailVerification,
    updatePassword,
    updateProfile,
    deleteUser,
    reauthenticateWithCredential,
    EmailAuthProvider,
    GoogleAuthProvider,
    signInWithPopup,
    signInWithRedirect,
    getRedirectResult,
    reauthenticateWithPopup,
} from 'firebase/auth';
import { auth } from '@/config/firebase';

const AuthContext = createContext(undefined);

// Error codes where the popup genuinely never opened (blocked by the browser,
// or unsupported in the current environment e.g. an in-app webview) — a
// signInWithRedirect retry sidesteps the popup entirely. Deliberately excludes
// codes like `auth/popup-closed-by-user`, where the user intentionally
// dismissed it and a surprise full-page redirect would be unwelcome.
const POPUP_FALLBACK_CODES = new Set(['auth/popup-blocked', 'auth/operation-not-supported-in-this-environment']);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [googleRedirectError, setGoogleRedirectError] = useState('');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, currentUser => {
            setUser(currentUser);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    // Completes a signInWithRedirect started on a previous page load (the
    // browser navigates away and back, so there's no promise to await at the
    // call site — this is the only place the result/error can be observed).
    useEffect(() => {
        getRedirectResult(auth).catch(err => {
            setGoogleRedirectError(err.message?.replace('Firebase: ', '') || 'Could not sign in with Google.');
        });
    }, []);

    const signUp = useCallback(async (email, password) => {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(credential.user);
        return credential.user;
    }, []);

    const logIn = useCallback(async (email, password, rememberMe = true) => {
        await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
        const credential = await signInWithEmailAndPassword(auth, email, password);
        return credential.user;
    }, []);

    // Returns the signed-in user, or `null` if a redirect fallback was
    // triggered instead (the browser is navigating away — there's nothing
    // more for the caller to do; `getRedirectResult` above and the normal
    // `onAuthStateChanged` listener pick up the session on return).
    const signInWithGoogle = useCallback(async () => {
        const provider = new GoogleAuthProvider();
        try {
            const credential = await signInWithPopup(auth, provider);
            return credential.user;
        } catch (err) {
            if (POPUP_FALLBACK_CODES.has(err.code)) {
                await signInWithRedirect(auth, provider);
                return null;
            }
            throw err;
        }
    }, []);

    const logOut = useCallback(() => signOut(auth), []);

    const resetPassword = useCallback(email => sendPasswordResetEmail(auth, email), []);

    const sendVerificationEmail = useCallback(() => {
        if (!auth.currentUser) throw new Error('No user is signed in.');
        return sendEmailVerification(auth.currentUser);
    }, []);

    const updateUserProfile = useCallback(async updates => {
        if (!auth.currentUser) throw new Error('No user is signed in.');
        await updateProfile(auth.currentUser, updates);
        setUser({ ...auth.currentUser });
    }, []);

    const reloadUser = useCallback(async () => {
        if (!auth.currentUser) return;
        await auth.currentUser.reload();
        setUser({ ...auth.currentUser });
    }, []);

    const reauthenticate = useCallback(currentPassword => {
        if (!auth.currentUser?.email) throw new Error('No user is signed in.');
        const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
        return reauthenticateWithCredential(auth.currentUser, credential);
    }, []);

    const reauthenticateWithGoogle = useCallback(() => {
        if (!auth.currentUser) throw new Error('No user is signed in.');
        return reauthenticateWithPopup(auth.currentUser, new GoogleAuthProvider());
    }, []);

    const updateUserPassword = useCallback(async (currentPassword, newPassword) => {
        if (!auth.currentUser) throw new Error('No user is signed in.');
        await reauthenticate(currentPassword);
        return updatePassword(auth.currentUser, newPassword);
    }, [reauthenticate]);

    const deleteCurrentUser = useCallback(() => {
        if (!auth.currentUser) throw new Error('No user is signed in.');
        return deleteUser(auth.currentUser);
    }, []);

    const deleteUserAccount = useCallback(async currentPassword => {
        await reauthenticate(currentPassword);
        return deleteCurrentUser();
    }, [reauthenticate, deleteCurrentUser]);

    const deleteUserAccountWithGoogle = useCallback(async () => {
        await reauthenticateWithGoogle();
        return deleteCurrentUser();
    }, [reauthenticateWithGoogle, deleteCurrentUser]);

    const value = {
        user,
        loading,
        googleRedirectError,
        signUp,
        logIn,
        signInWithGoogle,
        logOut,
        resetPassword,
        sendVerificationEmail,
        updateUserProfile,
        updateUserPassword,
        deleteUserAccount,
        deleteUserAccountWithGoogle,
        deleteCurrentUser,
        reauthenticate,
        reauthenticateWithGoogle,
        reloadUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) throw new Error('useAuth must be used within an AuthProvider.');
    return context;
};

export default AuthContext;

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
    reauthenticateWithPopup,
} from 'firebase/auth';
import { auth } from '@/config/firebase';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, currentUser => {
            setUser(currentUser);
            setLoading(false);
        });
        return unsubscribe;
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

    const signInWithGoogle = useCallback(async () => {
        const provider = new GoogleAuthProvider();
        const credential = await signInWithPopup(auth, provider);
        return credential.user;
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

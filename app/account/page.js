'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { deleteAllResumesForUser } from '@/lib/resumes';

const AccountContent = () => {
    const {
        user,
        updateUserProfile,
        updateUserPassword,
        reauthenticate,
        reauthenticateWithGoogle,
        deleteCurrentUser,
        sendVerificationEmail,
        reloadUser,
        logOut,
    } = useAuth();
    const router = useRouter();
    const isPasswordUser = user.providerData.some(p => p.providerId === 'password');

    const [displayName, setDisplayName] = useState(user.displayName || '');
    const [photoURL, setPhotoURL] = useState(user.photoURL || '');
    const [profileMsg, setProfileMsg] = useState('');
    const [profileError, setProfileError] = useState('');
    const [savingProfile, setSavingProfile] = useState(false);

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [passwordMsg, setPasswordMsg] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [savingPassword, setSavingPassword] = useState(false);

    const [verificationSent, setVerificationSent] = useState(false);
    const [refreshingStatus, setRefreshingStatus] = useState(false);

    const [deleteConfirmText, setDeleteConfirmText] = useState('');
    const [deletePassword, setDeletePassword] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteError, setDeleteError] = useState('');
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        if (user.emailVerified) return undefined;
        const interval = setInterval(() => {
            reloadUser();
        }, 5000);
        return () => clearInterval(interval);
    }, [user.emailVerified, reloadUser]);

    const onSaveProfile = async e => {
        e.preventDefault();
        setProfileMsg('');
        setProfileError('');
        setSavingProfile(true);
        try {
            await updateUserProfile({ displayName, photoURL });
            setProfileMsg('Profile updated.');
        } catch (err) {
            setProfileError(err.message?.replace('Firebase: ', '') || 'Could not update profile.');
        } finally {
            setSavingProfile(false);
        }
    };

    const onChangePassword = async e => {
        e.preventDefault();
        setPasswordMsg('');
        setPasswordError('');

        if (newPassword.length < 6) {
            setPasswordError('New password must be at least 6 characters.');
            return;
        }

        setSavingPassword(true);
        try {
            await updateUserPassword(currentPassword, newPassword);
            setPasswordMsg('Password updated.');
            setCurrentPassword('');
            setNewPassword('');
        } catch (err) {
            setPasswordError(err.message?.replace('Firebase: ', '') || 'Could not update password.');
        } finally {
            setSavingPassword(false);
        }
    };

    const onSendVerification = async () => {
        try {
            await sendVerificationEmail();
            setVerificationSent(true);
        } catch (err) {
            setProfileError('Could not send verification email.');
        }
    };

    const onRefreshStatus = async () => {
        setRefreshingStatus(true);
        try {
            await reloadUser();
        } finally {
            setRefreshingStatus(false);
        }
    };

    const onDeleteAccount = async () => {
        setDeleteError('');
        setDeleting(true);
        try {
            if (isPasswordUser) {
                await reauthenticate(deletePassword);
            } else {
                await reauthenticateWithGoogle();
            }
            await deleteAllResumesForUser(user.uid);
            await deleteCurrentUser();
            router.push('/');
        } catch (err) {
            setDeleteError(err.message?.replace('Firebase: ', '') || 'Could not delete account.');
            setDeleting(false);
        }
    };

    const onLogout = async () => {
        await logOut();
        router.push('/');
    };

    return (
        <div className="mx-auto mt-10 max-w-2xl px-4 pb-16 md:mt-12">
            <div className="mb-8 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white md:text-3xl">Account</h1>
                <button
                    onClick={onLogout}
                    className="rounded-lg border border-gray-600 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-white/5"
                >
                    Logout
                </button>
            </div>

            {!user.emailVerified && (
                <div className="mb-6 flex items-center justify-between rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-200">
                    <span>Your email isn&apos;t verified yet.</span>
                    <div className="flex items-center gap-4">
                        <button onClick={onRefreshStatus} disabled={refreshingStatus} className="font-semibold underline disabled:opacity-60">
                            {refreshingStatus ? 'Checking...' : 'Refresh status'}
                        </button>
                        <button onClick={onSendVerification} className="font-semibold underline">
                            {verificationSent ? 'Sent!' : 'Resend email'}
                        </button>
                    </div>
                </div>
            )}

            <div className="card mb-6">
                <h2 className="mb-4 text-lg font-semibold text-white">Profile</h2>
                {profileMsg && <p className="mb-3 text-sm text-green-400">{profileMsg}</p>}
                {profileError && <p className="mb-3 text-sm text-red-400">{profileError}</p>}
                <form onSubmit={onSaveProfile} className="flex flex-col gap-4">
                    <div>
                        <label className="mb-1 block text-sm text-gray-300">Email</label>
                        <input
                            disabled
                            value={user.email}
                            className="w-full rounded-md border border-gray-700 bg-gray-800/50 px-3 py-2 text-gray-400"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm text-gray-300">Display Name</label>
                        <input
                            value={displayName}
                            onChange={e => setDisplayName(e.target.value)}
                            className="w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white outline-none focus:border-primary-400"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm text-gray-300">Profile Picture URL</label>
                        <div className="flex items-center gap-4">
                            {photoURL ? (
                                <img src={photoURL} alt="Profile" className="h-14 w-14 rounded-full object-cover" />
                            ) : (
                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-700 text-lg font-semibold text-gray-300">
                                    {(displayName || user.email || '?').charAt(0).toUpperCase()}
                                </div>
                            )}
                            <input
                                value={photoURL}
                                onChange={e => setPhotoURL(e.target.value)}
                                className="w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white outline-none focus:border-primary-400"
                                placeholder="https://..."
                            />
                        </div>
                    </div>
                    <button type="submit" disabled={savingProfile} className="btn-filled w-full justify-center disabled:opacity-60">
                        {savingProfile ? 'Saving...' : 'Save Profile'}
                    </button>
                </form>
            </div>

            {isPasswordUser ? (
                <div className="card mb-6">
                    <h2 className="mb-4 text-lg font-semibold text-white">Change Password</h2>
                    {passwordMsg && <p className="mb-3 text-sm text-green-400">{passwordMsg}</p>}
                    {passwordError && <p className="mb-3 text-sm text-red-400">{passwordError}</p>}
                    <form onSubmit={onChangePassword} className="flex flex-col gap-4">
                        <div>
                            <label className="mb-1 block text-sm text-gray-300">Current Password</label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={e => setCurrentPassword(e.target.value)}
                                className="w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white outline-none focus:border-primary-400"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm text-gray-300">New Password</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                                className="w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white outline-none focus:border-primary-400"
                            />
                        </div>
                        <button type="submit" disabled={savingPassword} className="btn-filled w-full justify-center disabled:opacity-60">
                            {savingPassword ? 'Updating...' : 'Update Password'}
                        </button>
                    </form>
                </div>
            ) : (
                <div className="card mb-6">
                    <h2 className="mb-2 text-lg font-semibold text-white">Sign-in Method</h2>
                    <p className="text-sm text-slate-400">
                        You&apos;re signed in with Google. Password management isn&apos;t available for this account.
                    </p>
                </div>
            )}

            <div className="card border-red-500/30">
                <h2 className="mb-2 text-lg font-semibold text-red-300">Danger Zone</h2>
                <p className="mb-4 text-sm text-slate-400">
                    Deleting your account permanently removes all your resumes. This cannot be undone.
                </p>
                <button
                    onClick={() => setShowDeleteModal(true)}
                    className="rounded-lg border border-red-500/40 px-4 py-2 text-sm font-semibold text-red-300 hover:bg-red-500/10"
                >
                    Delete Account
                </button>
            </div>

            {showDeleteModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
                    <div className="w-full max-w-sm rounded-xl border border-red-500/30 bg-slate-900 p-6 shadow-2xl">
                        <h3 className="mb-2 text-lg font-semibold text-white">Delete Account</h3>
                        <p className="mb-4 text-sm text-slate-400">
                            Type <span className="font-mono text-red-300">DELETE</span> and enter your password to confirm.
                        </p>
                        {deleteError && <p className="mb-3 text-sm text-red-400">{deleteError}</p>}
                        <input
                            value={deleteConfirmText}
                            onChange={e => setDeleteConfirmText(e.target.value)}
                            placeholder="Type DELETE"
                            className="mb-3 w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white outline-none focus:border-red-400"
                        />
                        {isPasswordUser ? (
                            <input
                                type="password"
                                value={deletePassword}
                                onChange={e => setDeletePassword(e.target.value)}
                                placeholder="Password"
                                className="mb-6 w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white outline-none focus:border-red-400"
                            />
                        ) : (
                            <p className="mb-6 text-xs text-slate-400">
                                You&apos;ll be asked to confirm with Google when you click Delete Account.
                            </p>
                        )}
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/5"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onDeleteAccount}
                                disabled={deleteConfirmText !== 'DELETE' || (isPasswordUser && !deletePassword) || deleting}
                                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-50"
                            >
                                {deleting ? 'Deleting...' : 'Delete Account'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const AccountPage = () => (
    <ProtectedRoute>
        <AccountContent />
    </ProtectedRoute>
);

export default AccountPage;

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, ShieldCheck, TriangleAlert, LogOut, MailWarning } from 'lucide-react';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { deleteAllResumesForUser } from '@/lib/resumes';
import Card from '@/components/UI/Card';
import Button from '@/components/UI/Button';
import Alert from '@/components/UI/Alert';
import Avatar from '@/components/UI/Avatar';
import Badge from '@/components/UI/Badge';
import Modal from '@/components/UI/Modal';
import Tabs from '@/components/UI/Tabs';

const fieldClass =
    'block h-11 w-full rounded-xl border border-line bg-surface-2 px-3.5 text-sm text-fg outline-none transition-colors placeholder:text-fg-subtle focus:border-accent focus:ring-2 focus:ring-accent/30 disabled:opacity-60';

function Field({ label, ...props }) {
    return (
        <div>
            <label className="mb-1.5 block text-sm font-medium text-fg">{label}</label>
            <input className={fieldClass} {...props} />
        </div>
    );
}

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

    const [tab, setTab] = useState('profile');

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

    const tabs = [
        { value: 'profile', label: 'Profile', icon: User },
        { value: 'security', label: 'Security', icon: ShieldCheck },
        { value: 'danger', label: 'Danger zone', icon: TriangleAlert },
    ];

    return (
        <div className="mx-auto mt-10 max-w-3xl px-4 pb-20 md:mt-12">
            {/* Header */}
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Avatar src={user.photoURL} name={user.displayName} email={user.email} size="lg" />
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-fg md:text-3xl">
                            {user.displayName || 'Your account'}
                        </h1>
                        <div className="mt-1 flex items-center gap-2 text-sm text-fg-muted">
                            {user.email}
                            {user.emailVerified ? (
                                <Badge tone="success" size="sm">Verified</Badge>
                            ) : (
                                <Badge tone="warning" size="sm">Unverified</Badge>
                            )}
                        </div>
                    </div>
                </div>
                <Button variant="outline" size="md" leftIcon={<LogOut className="h-4 w-4" />} onClick={onLogout}>
                    Log out
                </Button>
            </div>

            {!user.emailVerified && (
                <Alert tone="warning" title="Verify your email" className="mb-6">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                        <span>Confirm your address to secure your account.</span>
                        <button onClick={onRefreshStatus} disabled={refreshingStatus} className="font-semibold text-fg underline disabled:opacity-60">
                            {refreshingStatus ? 'Checking…' : 'Refresh status'}
                        </button>
                        <button onClick={onSendVerification} className="font-semibold text-fg underline">
                            {verificationSent ? 'Sent!' : 'Resend email'}
                        </button>
                    </div>
                </Alert>
            )}

            <Tabs tabs={tabs} value={tab} onChange={setTab} className="mb-6" />

            <motion.div
                key={tab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
            >
                {tab === 'profile' && (
                    <Card title="Profile" subtitle="Update how you appear across HireReady.">
                        {profileMsg && <Alert tone="success" className="mb-4">{profileMsg}</Alert>}
                        {profileError && <Alert tone="danger" className="mb-4">{profileError}</Alert>}
                        <form onSubmit={onSaveProfile} className="flex flex-col gap-4">
                            <Field label="Email" disabled value={user.email} />
                            <Field
                                label="Display name"
                                value={displayName}
                                onChange={e => setDisplayName(e.target.value)}
                                placeholder="Your name"
                            />
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-fg">Profile picture URL</label>
                                <div className="flex items-center gap-4">
                                    <Avatar src={photoURL} name={displayName} email={user.email} size="lg" />
                                    <input
                                        value={photoURL}
                                        onChange={e => setPhotoURL(e.target.value)}
                                        className={fieldClass}
                                        placeholder="https://…"
                                    />
                                </div>
                            </div>
                            <div className="pt-1">
                                <Button type="submit" loading={savingProfile}>
                                    {savingProfile ? 'Saving…' : 'Save profile'}
                                </Button>
                            </div>
                        </form>
                    </Card>
                )}

                {tab === 'security' && (
                    isPasswordUser ? (
                        <Card title="Change password" subtitle="Choose a strong, unique password.">
                            {passwordMsg && <Alert tone="success" className="mb-4">{passwordMsg}</Alert>}
                            {passwordError && <Alert tone="danger" className="mb-4">{passwordError}</Alert>}
                            <form onSubmit={onChangePassword} className="flex flex-col gap-4">
                                <Field
                                    label="Current password"
                                    type="password"
                                    autoComplete="current-password"
                                    value={currentPassword}
                                    onChange={e => setCurrentPassword(e.target.value)}
                                />
                                <Field
                                    label="New password"
                                    type="password"
                                    autoComplete="new-password"
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                />
                                <div className="pt-1">
                                    <Button type="submit" loading={savingPassword}>
                                        {savingPassword ? 'Updating…' : 'Update password'}
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    ) : (
                        <Card title="Sign-in method">
                            <div className="flex items-start gap-3">
                                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line bg-surface-2 text-accent">
                                    <ShieldCheck className="h-5 w-5" />
                                </span>
                                <p className="text-sm text-fg-muted">
                                    You&apos;re signed in with Google. Password management isn&apos;t
                                    available for this account.
                                </p>
                            </div>
                        </Card>
                    )
                )}

                {tab === 'danger' && (
                    <Card className="border-red-500/30">
                        <div className="flex items-start gap-3">
                            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-red-500/30 bg-red-500/10 text-red-500">
                                <TriangleAlert className="h-5 w-5" />
                            </span>
                            <div>
                                <h2 className="text-base font-semibold text-fg">Delete account</h2>
                                <p className="mt-1 text-sm text-fg-muted">
                                    Deleting your account permanently removes all your resumes. This
                                    cannot be undone.
                                </p>
                                <Button variant="danger" size="md" className="mt-4" onClick={() => setShowDeleteModal(true)}>
                                    Delete account
                                </Button>
                            </div>
                        </div>
                    </Card>
                )}
            </motion.div>

            <Modal
                open={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title="Delete account"
                description="This permanently removes your account and all resumes."
                size="sm"
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                        <Button
                            variant="danger"
                            loading={deleting}
                            disabled={deleteConfirmText !== 'DELETE' || (isPasswordUser && !deletePassword)}
                            onClick={onDeleteAccount}
                        >
                            {deleting ? 'Deleting…' : 'Delete account'}
                        </Button>
                    </>
                }
            >
                {deleteError && <Alert tone="danger" className="mb-4">{deleteError}</Alert>}
                <p className="mb-4 flex items-center gap-2 text-sm text-fg-muted">
                    <MailWarning className="h-4 w-4 shrink-0 text-red-500" />
                    Type <span className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-red-500">DELETE</span> to confirm.
                </p>
                <input
                    value={deleteConfirmText}
                    onChange={e => setDeleteConfirmText(e.target.value)}
                    placeholder="Type DELETE"
                    className={`${fieldClass} mb-3`}
                />
                {isPasswordUser ? (
                    <input
                        type="password"
                        value={deletePassword}
                        onChange={e => setDeletePassword(e.target.value)}
                        placeholder="Password"
                        className={fieldClass}
                    />
                ) : (
                    <p className="text-xs text-fg-subtle">
                        You&apos;ll be asked to confirm with Google when you click Delete account.
                    </p>
                )}
            </Modal>
        </div>
    );
};

const AccountPage = () => (
    <ProtectedRoute>
        <AccountContent />
    </ProtectedRoute>
);

export default AccountPage;

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/UI/Button';
import {
    AuthShell,
    AuthHeading,
    AuthError,
    AuthSuccess,
    AuthField,
} from '@/components/Auth/AuthUI';

const ForgotPasswordPage = () => {
    const { resetPassword } = useAuth();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const onSubmit = async e => {
        e.preventDefault();
        setError('');

        if (!email) {
            setError('Please enter your email.');
            return;
        }

        setLoading(true);
        try {
            await resetPassword(email);
            setSent(true);
        } catch (err) {
            setError(err.message?.replace('Firebase: ', '') || 'Could not send reset email.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthShell>
            <AuthHeading
                title="Reset your password"
                subtitle="Enter your email and we'll send you a reset link."
            />

            {sent ? (
                <AuthSuccess>
                    If an account exists for <strong>{email}</strong>, a password reset link has been
                    sent. Check your inbox and spam folder.
                </AuthSuccess>
            ) : (
                <>
                    <AuthError>{error}</AuthError>
                    <form onSubmit={onSubmit} className="flex flex-col gap-4">
                        <AuthField
                            label="Email"
                            id="email"
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="you@example.com"
                        />
                        <Button type="submit" size="lg" fullWidth loading={loading} className="mt-2">
                            {loading ? 'Sending…' : 'Send reset link'}
                        </Button>
                    </form>
                </>
            )}

            <Link
                href="/login"
                className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-fg-muted transition-colors hover:text-fg"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to log in
            </Link>
        </AuthShell>
    );
};

export default ForgotPasswordPage;

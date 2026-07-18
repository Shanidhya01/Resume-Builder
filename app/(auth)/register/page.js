'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import GoogleButton from '@/components/Auth/GoogleButton';
import Button from '@/components/UI/Button';
import {
    AuthShell,
    AuthHeading,
    AuthError,
    AuthField,
    PasswordField,
    AuthDivider,
} from '@/components/Auth/AuthUI';

const RegisterPage = () => {
    const { signUp, updateUserProfile, signInWithGoogle, googleRedirectError, user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    useEffect(() => {
        if (!authLoading && user) router.replace('/dashboard');
    }, [authLoading, user, router]);

    const onGoogleSignIn = async () => {
        setError('');
        setGoogleLoading(true);
        try {
            const signedInUser = await signInWithGoogle();
            // `null` means a signInWithRedirect fallback was triggered instead
            // (the browser is already navigating away) — nothing left to do here.
            if (signedInUser) router.push('/dashboard');
        } catch (err) {
            setError(err.message?.replace('Firebase: ', '') || 'Could not sign in with Google.');
        } finally {
            setGoogleLoading(false);
        }
    };

    const onSubmit = async e => {
        e.preventDefault();
        setError('');

        if (!name || !email || !password || !confirmPassword) {
            setError('Please fill in all fields.');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);
        try {
            await signUp(email, password);
            await updateUserProfile({ displayName: name });
            router.push('/dashboard');
        } catch (err) {
            setError(err.message?.replace('Firebase: ', '') || 'Could not create account.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthShell>
            <AuthHeading
                title="Create your account"
                subtitle="Start building a standout resume in minutes."
            />

            <AuthError>{error || googleRedirectError}</AuthError>

            <form onSubmit={onSubmit} className="flex flex-col gap-4">
                <AuthField
                    label="Full name"
                    id="name"
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Jane Doe"
                />
                <AuthField
                    label="Email"
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                />
                <PasswordField
                    label="Password"
                    id="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    showStrength
                />
                <PasswordField
                    label="Confirm password"
                    id="confirmPassword"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                />

                <Button type="submit" size="lg" fullWidth loading={loading} className="mt-2">
                    {loading ? 'Creating account…' : 'Create account'}
                </Button>
            </form>

            <AuthDivider />

            <GoogleButton
                onClick={onGoogleSignIn}
                disabled={googleLoading}
                loading={googleLoading}
                label={googleLoading ? 'Signing in…' : 'Continue with Google'}
            />

            <p className="mt-8 text-center text-sm text-fg-muted">
                Already have an account?{' '}
                <Link href="/login" className="font-semibold text-accent hover:underline">
                    Log in
                </Link>
            </p>
        </AuthShell>
    );
};

export default RegisterPage;

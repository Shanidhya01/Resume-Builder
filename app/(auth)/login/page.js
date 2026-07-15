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

const LoginPage = () => {
    const { logIn, signInWithGoogle, user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(true);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    useEffect(() => {
        if (!authLoading && user) router.replace('/dashboard');
    }, [authLoading, user, router]);

    const onSubmit = async e => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please fill in both fields.');
            return;
        }

        setLoading(true);
        try {
            await logIn(email, password, rememberMe);
            router.push('/dashboard');
        } catch (err) {
            setError(err.message?.replace('Firebase: ', '') || 'Could not log in.');
        } finally {
            setLoading(false);
        }
    };

    const onGoogleSignIn = async () => {
        setError('');
        setGoogleLoading(true);
        try {
            await signInWithGoogle();
            router.push('/dashboard');
        } catch (err) {
            setError(err.message?.replace('Firebase: ', '') || 'Could not sign in with Google.');
        } finally {
            setGoogleLoading(false);
        }
    };

    return (
        <AuthShell>
            <AuthHeading title="Welcome back" subtitle="Log in to continue building your resume." />

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
                <PasswordField
                    label="Password"
                    id="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                />

                <div className="flex items-center justify-between text-sm">
                    <label className="flex cursor-pointer items-center gap-2 text-fg-muted">
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={e => setRememberMe(e.target.checked)}
                            className="h-4 w-4 rounded border-line-strong bg-surface-2 accent-accent"
                        />
                        Remember me
                    </label>
                    <Link href="/forgot-password" className="font-medium text-accent hover:underline">
                        Forgot password?
                    </Link>
                </div>

                <Button type="submit" size="lg" fullWidth loading={loading} className="mt-2">
                    {loading ? 'Logging in…' : 'Log in'}
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
                Don&apos;t have an account?{' '}
                <Link href="/register" className="font-semibold text-accent hover:underline">
                    Sign up
                </Link>
            </p>
        </AuthShell>
    );
};

export default LoginPage;

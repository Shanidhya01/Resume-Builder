'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import GoogleButton from '@/components/Auth/GoogleButton';

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
        <div className="mx-auto mt-16 max-w-md px-4 pb-10">
            <div className="card">
                <h1 className="mb-6 text-2xl font-bold text-white">Log In</h1>

                {error && (
                    <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-300">
                        {error}
                    </div>
                )}

                <form onSubmit={onSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="mb-1 block text-sm text-gray-300">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white outline-none focus:border-primary-400"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm text-gray-300">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white outline-none focus:border-primary-400"
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 text-gray-300">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={e => setRememberMe(e.target.checked)}
                                className="h-4 w-4 rounded border-gray-600 bg-gray-800 accent-primary-400"
                            />
                            Remember me
                        </label>
                        <Link href="/forgot-password" className="text-primary-400 hover:underline">
                            Forgot password?
                        </Link>
                    </div>

                    <button type="submit" disabled={loading} className="btn-filled mt-2 w-full justify-center disabled:opacity-60">
                        {loading ? 'Logging in...' : 'Log In'}
                    </button>
                </form>

                <div className="my-6 flex items-center gap-3 text-xs text-gray-500">
                    <div className="h-px flex-1 bg-gray-700" />
                    OR
                    <div className="h-px flex-1 bg-gray-700" />
                </div>

                <GoogleButton onClick={onGoogleSignIn} disabled={googleLoading} label={googleLoading ? 'Signing in...' : 'Continue with Google'} />

                <p className="mt-6 text-center text-sm text-gray-400">
                    Don&apos;t have an account?{' '}
                    <Link href="/register" className="text-primary-400 hover:underline">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;

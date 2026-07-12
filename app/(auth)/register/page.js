'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import GoogleButton from '@/components/Auth/GoogleButton';

const RegisterPage = () => {
    const { signUp, updateUserProfile, signInWithGoogle, user, loading: authLoading } = useAuth();
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
            await signInWithGoogle();
            router.push('/dashboard');
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
        <div className="mx-auto mt-16 max-w-md px-4 pb-10">
            <div className="card">
                <h1 className="mb-6 text-2xl font-bold text-white">Create Account</h1>

                {error && (
                    <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-300">
                        {error}
                    </div>
                )}

                <form onSubmit={onSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="mb-1 block text-sm text-gray-300">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white outline-none focus:border-primary-400"
                            placeholder="Jane Doe"
                        />
                    </div>
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
                            placeholder="At least 6 characters"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm text-gray-300">Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            className="w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white outline-none focus:border-primary-400"
                            placeholder="••••••••"
                        />
                    </div>

                    <button type="submit" disabled={loading} className="btn-filled mt-2 w-full justify-center disabled:opacity-60">
                        {loading ? 'Creating account...' : 'Register'}
                    </button>
                </form>

                <div className="my-6 flex items-center gap-3 text-xs text-gray-500">
                    <div className="h-px flex-1 bg-gray-700" />
                    OR
                    <div className="h-px flex-1 bg-gray-700" />
                </div>

                <GoogleButton onClick={onGoogleSignIn} disabled={googleLoading} label={googleLoading ? 'Signing in...' : 'Continue with Google'} />

                <p className="mt-6 text-center text-sm text-gray-400">
                    Already have an account?{' '}
                    <Link href="/login" className="text-primary-400 hover:underline">
                        Log In
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;

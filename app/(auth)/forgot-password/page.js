'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

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
        <div className="mx-auto mt-16 max-w-md px-4 pb-10">
            <div className="card">
                <h1 className="mb-6 text-2xl font-bold text-white">Reset Password</h1>

                {sent ? (
                    <p className="rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300">
                        If an account exists for {email}, a password reset link has been sent.
                    </p>
                ) : (
                    <>
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
                            <button type="submit" disabled={loading} className="btn-filled mt-2 w-full justify-center disabled:opacity-60">
                                {loading ? 'Sending...' : 'Send Reset Link'}
                            </button>
                        </form>
                    </>
                )}

                <p className="mt-6 text-center text-sm text-gray-400">
                    Remembered your password?{' '}
                    <Link href="/login" className="text-primary-400 hover:underline">
                        Log In
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;

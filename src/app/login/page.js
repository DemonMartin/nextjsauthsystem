"use client";
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Page() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSignIn = async () => {
        try {
            setError('');

            const response = await axios.post('/api/login', {
                username,
                password
            });

            if (response.data.error) {
                setError(response.data.error);
                return;
            }

            router.push('/dashboard');
        } catch (error) {
            setError(error.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleSignIn();
    };

    return (
        <main>
            <div className="shadow-xl p-6 rounded-lg border-t-4 border-blue-500 bg-white max-w-sm w-full animate__animated animate__bounceIn">
                <h1 className="text-2xl font-bold text-gray-700 my-4">Login</h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label htmlFor="username" className="text-gray-600 font-semibold">Username</label>
                        <input
                            onChange={(e) => setUsername(e.target.value)}
                            type="text"
                            placeholder="Enter your username"
                            className="mt-1 w-full p-2 border rounded-md"
                            id="username"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="text-gray-600 font-semibold">Password</label>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            placeholder="Enter your password"
                            className="mt-1 w-full p-2 border rounded-md"
                            id="password"
                            required
                        />
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer px-6 py-2 rounded-md transition-colors duration-200">
                        Login
                    </button>
                    {error && (
                        <div className="bg-red-600 text-white w-full text-sm py-2 px-4 rounded-md mt-3">
                            {error}
                        </div>
                    )}

                    <div className="text-sm text-gray-600">
                        Don&apos;t have an account? <button type="button" className="text-blue-600 hover:text-blue-700" onClick={() => router.push('/register')}>Register</button>
                    </div>
                </form>
            </div>
        </main>
    )
}
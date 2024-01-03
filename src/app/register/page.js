"use client";
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import validator from 'validator';

export default function RegisterPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [inviteCode, setInviteCode] = useState('');
    const [error, setError] = useState('');

    const handleRegister = async () => {
        try {
            setError('');

            if (!validator.isEmail(email)) throw new Error("Invalid email address");
            if (!validator.isStrongPassword(password)) throw new Error("Password is not strong enough, ensure it has LowerCase, UpperCase, Numbers and Symbols in it");
            if (!validator.isAscii(inviteCode)) throw new Error("Invalid invite code");

            const response = await axios.post('/api/auth/register', {
                email,
                username,
                password,
                invite: inviteCode
            });

            if (response?.data?.success !== true) {
                setError(response?.data?.error || "An unknown error occurred");
                return;
            }

            router.push('/login');
        } catch (error) {
            console.log(error)
            // on code 400
            if (error?.response?.status === 400) {
                setError(error?.response?.data?.error || "An unknown error occurred");
                return;
            } else {
                setError(error.message);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleRegister();
    };

    return (
        <main className='grid place-items-center h-screen'>
            <div className="shadow-xl p-6 rounded-lg border-t-4 border-blue-500 bg-white max-w-sm w-full animate__animated animate__bounceIn">
                <h1 className="text-2xl font-bold text-gray-700 my-4">Register</h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label htmlFor="email" className="text-gray-600 font-semibold">Email</label>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            placeholder="Enter your email"
                            className="mt-1 w-full p-2 border rounded-md"
                            id="email"
                            required
                        />
                    </div>
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
                    <div>
                        <label htmlFor="inviteCode" className="text-gray-600 font-semibold">Invite Code</label>
                        <input
                            onChange={(e) => setInviteCode(e.target.value)}
                            type="text"
                            placeholder="Enter your invite code"
                            className="mt-1 w-full p-2 border rounded-md"
                            id="inviteCode"
                            required
                        />
                    </div>
                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer px-6 py-2 rounded-md transition-colors duration-200">
                        Register
                    </button>
                    {error && (
                        <div className="bg-red-600 text-white w-full text-sm py-2 px-4 rounded-md mt-3">
                            {error}
                        </div>
                    )}
                    <div className="text-sm text-gray-600">
                        Already have an account? <button type="button" className="text-blue-600 hover:text-blue-700" onClick={() => router.push('/login')}>Login</button>
                    </div>
                </form>
            </div>
        </main>
    )
}

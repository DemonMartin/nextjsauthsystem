"use client";
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import {
    AiOutlineEye as EyeIcon, AiOutlineEyeInvisible as EyeOffIcon
} from 'react-icons/ai';
import { IoCloseSharp } from "react-icons/io5";
import ClipLoader from "react-spinners/ClipLoader";

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [animationClass, setAnimationClass] = useState('animate__fadeIn');
    const [isLoading, setIsLoading] = useState(false);

    const handleSignIn = async () => {
        try {
            setIsLoading(true);
            setError('');

            const response = await axios.post('/api/auth/login', {
                username,
                password
            });

            if (response.data.error) {
                setError(response.data.error);
            } else {
                router.push('/dashboard');
            }
        } catch (error) {
            console.log(error)
            setError(error?.response?.data?.error || error.message);
        }

        setIsLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleSignIn();
    };

    return (
        <main className='grid place-items-center min-h-screen'>
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
                            minLength={4}
                            maxLength={32}
                            required
                        />
                    </div>
                    <div className="relative">
                        <label htmlFor="password" className="text-gray-600 font-semibold">Password</label>
                        <div className="flex">
                            <input
                                onChange={(e) => setPassword(e.target.value)}
                                onInput={(e) => setPassword(e.target.value)}
                                onBlur={(e) => setPassword(e.target.value)}
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                className="mt-1 w-full p-2 border rounded-md"
                                autoComplete="new-password"
                                id="password"
                                minLength={8}
                                maxLength={128}
                                required
                            />
                            <button
                                type="button"
                                className="flex items-center justify-center p-2"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                            </button>
                        </div>
                    </div>
                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer px-6 py-2 rounded-md transition-colors duration-200">
                        {isLoading ? <ClipLoader color="#ffffff" size={20} /> : 'Login'}
                    </button>
                </form>
                <div className="text-sm text-gray-600">
                    Don&apos;t have an account? <button type="button" className="text-blue-600 hover:text-blue-700" onClick={() => router.push('/register')}>Register</button>
                </div>

                {error && (
                    <div className={`bg-red-600 text-white w-full p-2 rounded-md mt-3 relative animate__animated ${animationClass} animate__faster flex items-center overflow-auto max-h-64 break-words`}>
                        <span className="flex-1 overflow-auto">{error}</span>
                        <button
                            onClick={() => {
                                setAnimationClass('animate__fadeOut');
                                setTimeout(() => {
                                    setError('');
                                    setAnimationClass('animate__fadeIn');
                                }, 400);
                            }}
                            className="ml-2 p-2 transition-colors duration-200 hover:bg-red-700 rounded-md"
                        >
                            <IoCloseSharp className="h-5 w-5" />
                        </button>
                    </div>
                )}
            </div>
        </main>
    )
}

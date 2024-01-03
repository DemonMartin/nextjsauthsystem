"use client";
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import validator from 'validator';
import {
    AiOutlineEye as EyeIcon, AiOutlineEyeInvisible as EyeOffIcon
} from 'react-icons/ai';

import { IoCloseSharp } from "react-icons/io5";
import ClipLoader from "react-spinners/ClipLoader";
import PasswordStrenghBar from '@/components/PasswordStrenghBar';

export default function RegisterPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [inviteCode, setInviteCode] = useState('');
    const [error, setError] = useState('');
    const [buttonText, setButtonText] = useState('Generate');
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [animationClass, setAnimationClass] = useState('animate__fadeIn');
    const [isLoading, setIsLoading] = useState(false);

    const generatePassword = () => {
        const length = 12;
        const charSets = [
            "abcdefghijklmnopqrstuvwxyz",
            "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "0123456789",
            "!#$%&_+=-"
        ];

        const getRandomChar = (set) => set[Math.floor(Math.random() * set.length)];

        let password = charSets.map(getRandomChar).join('');
        while (password.length < length) {
            password += getRandomChar(charSets[Math.floor(Math.random() * charSets.length)]);
        }

        // Shuffle password to ensure randomness
        password = password.split('').sort(() => 0.5 - Math.random()).join('');

        document.getElementById('password').value = password;
        setPassword(password);
        setShowPassword(true);

        // save to clipboard
        navigator.clipboard.writeText(password);

        // change button text and revert after 1.5 seconds
        setButtonText('Saved to Clipboard');
        setButtonDisabled(true);
        setTimeout(() => {
            setButtonText('Generate');
            setButtonDisabled(false);
        }, 1500);
    }

    const handleRegister = async () => {
        try {
            setIsLoading(true);
            setError('');

            if (!validator.isEmail(email)) throw new Error("Invalid email address");
            if (!validator.isStrongPassword(password)) throw new Error("Password is not strong enough.");
            if (!validator.isAscii(inviteCode)) throw new Error("Invalid invite code");

            const response = await axios.post('/api/auth/register', {
                email,
                username,
                password,
                invite: inviteCode
            });

            if (response?.data?.success !== true) {
                setError(response?.data?.error || "An unknown error occurred");
            } else {
                router.push('/login');
            }
        } catch (error) {
            console.log(error)
            if (error?.response?.status === 400) {
                setError(error?.response?.data?.error || "An unknown error occurred");
            } else {
                setError(error.message);
            }
        }
        setIsLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleRegister();
    };

    return (
        <main className='bg-wave-pattern bg-no-repeat bg-center bg-cover grid place-items-center h-screen'>
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
                            {/* Show/Hide Password Button */}
                            <button
                                type="button"
                                className="flex items-center justify-center p-2"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                            </button>
                        </div>
                        {/* Generate Password Button */}
                        <button
                            type="button"
                            className={`mt-1 w-full p-2 border rounded-md transition-colors duration-200 ${!buttonDisabled ? 'hover:bg-gray-200' : ''} hover:border-gray-300 ${buttonDisabled ? 'bg-gray-300 cursor-not-allowed' : ''}`}
                            onClick={() => generatePassword()}
                            disabled={buttonDisabled}
                        >
                            {buttonText}
                        </button>
                        <PasswordStrenghBar pw={password}/>
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
                        {isLoading ? <ClipLoader color="#ffffff" size={20} /> : 'Register'}
                    </button>
                </form>
                <div className="text-sm text-gray-600">
                    Already have an account? <button type="button" className="text-blue-600 hover:text-blue-700" onClick={() => router.push('/login')}>Login</button>
                </div>
                {error && (
                    <div className={`bg-red-600 text-white w-full py-2 px-4 rounded-md mt-3 relative animate__animated ${animationClass} animate__faster flex items-center`}>
                        <span className="flex-1">{error}</span>
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
            </div >
        </main >
    )
}

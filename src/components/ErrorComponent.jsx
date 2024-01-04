"use client";
import { AiOutlineWarning } from 'react-icons/ai';
import { useRouter } from 'next/navigation';

export default function ErrorComponent({ description = "Unknown Error", error }) {
    const router = useRouter();

    return (
        <div className="max-w-md w-full space-y-6 p-6 bg-white rounded-xl shadow-md animate__animated animate__bounceIn transform transition-transform duration-500 hover:scale-105">
            <div className="text-center">
                <AiOutlineWarning size={50} className="text-red-600 mx-auto" />
                <h2 className="mt-2 text-3xl font-extrabold text-gray-900">Oops!</h2>
                <p className="mt-2 text-lg text-gray-800">{description}</p>
                <div className="mt-2 p-3 bg-red-100 rounded-md overflow-auto break-words">
                    <p className="text-md text-gray-900">{error}</p>
                </div>
            </div>
            <button
                onClick={() => router.push("/")}
                className="w-full py-2 px-3 border border-transparent rounded-md shadow-sm text-md font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-500"
            >
                Back to Home
            </button>
        </div>
    );
}
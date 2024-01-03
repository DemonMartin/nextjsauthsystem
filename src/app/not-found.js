"use client";
import { MdError } from 'react-icons/md';
import { useRouter } from 'next/navigation';

export default function NotFound() {
    const router = useRouter();

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
            <div className="p-6 rounded-full bg-gray-200 mb-8 inline-flex">
                <MdError size={100} className="text-red-600" />
            </div>
            <h1 className="text-6xl font-bold">Error</h1>
            <p className="text-2xl mt-8 mb-8">The page you&apos;re looking for was not found.</p>
            <button
                onClick={() => router.push('/')}
                className="px-6 py-2 rounded text-white bg-blue-500 hover:bg-blue-600 transition-colors duration-200"
            >
                Go to Main Page
            </button>
        </main>
    )
}
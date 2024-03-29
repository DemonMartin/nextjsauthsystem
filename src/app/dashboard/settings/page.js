"use client";
import { useRouter } from "next/navigation";

export default function Settings() {
    const router = useRouter();

    const goToSettings = () => {
        router.push('/dashboard');
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <h1>Settings</h1>
            <button onClick={goToSettings} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Go to Dashboard</button>
        </main>
    )
}
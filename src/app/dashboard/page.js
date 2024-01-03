"use client";
import { useRouter } from "next/navigation";

export default function Dashboard() {
    const router = useRouter();

    const goToSettings = () => {
        router.push('/dashboard/settings');
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <h1>Dashboard</h1>
            <button onClick={goToSettings} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Go to Settings</button>
        </main>
    )
}
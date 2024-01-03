"use client";
import { useState, useEffect } from 'react';
import isUserAuthed from '@/libs/isUserAuthed';
import { useRouter } from 'next/navigation';
import Loading from '@/components/Loading';

export default function Layout({ children }) {
    const router = useRouter(); 
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const user = await isUserAuthed();
                if (user.authed) {
                    router.push('/dashboard');
                } else {
                    setLoading(false);
                }
            } catch (err) {
                console.error('Error in authentication check:', err);
                setLoading(false);
            }
        };

        if (loading) checkAuthStatus();
    }, [loading, router]);

    return (
        <main className="grid place-items-center h-screen">
            {loading && (<Loading />)}
            {!loading && children}
        </main>
    );
}

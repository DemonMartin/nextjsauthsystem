"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Loading from "@/components/Loading";
import ErrorComponent from "@/components/ErrorComponent";
import SuccessComponent from "@/components/SuccessComponent";

export default function VerifyPage({ params }) {
    const token = params?.token;
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const verify = async () => {
        try {
            const { data } = await axios.post("/api/auth/verify-email", { token });

            if (!data.success) {
                setError(data.error);
            }
        } catch (err) {
            if (typeof err.response?.data?.error !== "undefined") {
                setError(err.response.data.error);
            } else {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        verify();
    }

    return (
        <main className="bg-wave-pattern bg-no-repeat bg-center bg-cover grid place-items-center h-screen">
            {loading && (<Loading />)}
            {!loading && error && (<ErrorComponent description="Failed Email Verification." error={`${error}`} />)}
            {!loading && !error && (<SuccessComponent description="Successfully Verified Email." message={"You can now freely use the Dashboard."} />)}
        </main>
    );
}
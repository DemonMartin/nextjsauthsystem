import axios from "axios";

export default async function fetchFingerprint() {
    try {
        const { data } = await axios.post("/api/auth/fingerprint", {
        }, {
            headers: {
                'Content-Type': 'application/json',
                'x-timestamp': `${new Date()}`
            }
        });

        return data;
    } catch (error) {
        return { error: "Error fetching fingerprint." }
    }
}
import axios from "axios";

export default async function isUserAuthed() {
    try {
        const { data } = await axios.get("/api/authed");

        if (typeof data === 'object' && data !== null) {
            return data;
        }

        return { authed: false }
    } catch (error) {
        console.error(error);
        return { authed: false };
    }
}
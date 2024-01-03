import axios from "axios";
import validator from "validator";
export default async function isUserAuthed() {
    try {
        const response = await axios.get("/api/authed");

        if (validator.isJSON(response.data)) {
            return JSON.parse(response.data);
        }

        return { authed: false }
    } catch (error) {
        return { authed: false };
    }
}
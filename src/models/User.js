import mongoose from "mongoose";

const Schema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String
    },
    role: {
        type: String,
        enum: ["unverified", "user", "admin"],
        default: "unverified"
    }
}, {
    timestamps: true
});

export default mongoose.models.User || mongoose.model("User", Schema);
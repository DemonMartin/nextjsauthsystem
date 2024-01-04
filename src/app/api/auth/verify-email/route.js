import dbConnect from "@/db/connection";
import User from "@/models/User";
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';

export async function POST(req) {
    try {
        const { token } = await req.json();

        const email = verifyTokenAndGetEmail(token);
        if (!email) {
            return NextResponse.json({ error: "Invalid token" }, { status: 400 });
        }

        await dbConnect();
        const user = await findUserByEmail(email);
        if (!user) {
            return NextResponse.json({ error: "User does not exist" }, { status: 404 });
        }

        await updateUserRole(user);

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Server Error:" + error.message }, { status: 500 });
    }
}

function verifyTokenAndGetEmail(token) {
    try {
        return jwt.verify(token, process.env.EMAIL_JWT_SECRET).email;
    } catch (err) {
        return null;
    }
}

async function findUserByEmail(email) {
    return await User.findOne({ email }).exec();
}

async function updateUserRole(user) {
    user.role = "user";
    await user.save();
}
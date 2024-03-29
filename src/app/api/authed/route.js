import jwt from "jsonwebtoken";
import dbConnect from "@/db/connection";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { cookies } from 'next/headers'
import { COOKIE_NAME } from "@/constant";
import argon2 from "argon2";

export async function GET() {
    const cookieStore = cookies();
    const jwtTokenCookie = cookieStore.get(COOKIE_NAME);
    const jwtToken = jwtTokenCookie?.value;
    if (!cookieStore.has(COOKIE_NAME) || !jwtToken) {
        return unauthenticatedResponse();
    }

    await dbConnect();

    try {
        const user = jwt.verify(jwtToken, process.env.JWT_SECRET);

        if (!user || !user?.password || !user?.id) {
            return unauthenticatedResponse();
        }

        const dbUser = await User.findById(user.id).exec();

        if (!dbUser) {
            return unauthenticatedResponse();
        }

        // check whether current password hash matches saved one (incase user changes password)
        if (dbUser.password != user.password) {
            return unauthenticatedResponse();
        }

        return NextResponse.json({ authed: true, ...(process.env.EMAIL_VERIFY_REQUIRED ? { verified: dbUser.role != "unverified" } : {}) });
    } catch (error) {
        return unauthenticatedResponse();
    }
}

function unauthenticatedResponse(t) {
    return NextResponse.json({ authed: false }, { status: 401 });
}
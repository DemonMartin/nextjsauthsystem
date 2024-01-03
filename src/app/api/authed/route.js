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
        return unauthenticatedResponse(1);
    }

    await dbConnect();

    try {
        const user = jwt.verify(jwtToken, process.env.JWT_SECRET);

        if (!user || !user?.password || !user?.id) {
            return unauthenticatedResponse(2);
        }

        const dbUser = await User.findById(user.id).exec();

        if (!dbUser) {
            return unauthenticatedResponse(3);
        }

        // check whether current password hash matches saved one (incase user changes password)
        if (dbUser.password != user.password) {
            return unauthenticatedResponse(4);
        }

        return NextResponse.json({ authed: true });
    } catch (error) {
        return unauthenticatedResponse(5);
    }
}

function unauthenticatedResponse(t) {
    console.log(t)
    return NextResponse.json({ authed: false }, { status: 401 });
}
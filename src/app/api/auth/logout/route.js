import { COOKIE_NAME } from "@/constant";
import { NextResponse } from "next/server";

export const GET = async (request) => {
    try {
        const url = request.nextUrl.clone();
        url.pathname = '/api/auth/logout';
        const response = NextResponse.rewrite(url);
        response.cookies.delete(COOKIE_NAME);
        return response;
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
};
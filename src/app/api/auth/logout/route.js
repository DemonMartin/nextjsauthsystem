import { COOKIE_NAME } from "@/constant";
import { NextResponse } from "next/server";

const createSuccessResponse = () => {
    const response = NextResponse.redirect("/login", { status: 307 })
    response.cookies.delete(COOKIE_NAME);
    return response;
}

const createErrorResponse = (error) => {
    return NextResponse.json({ error: error.message }, { status: 500 });
}

export const GET = async (request) => {
    try {
        return createSuccessResponse();
    } catch (error) {
        return createErrorResponse(error);
    }
};
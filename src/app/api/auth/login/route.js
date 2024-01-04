import dbConnect from "@/db/connection";
import User from "@/models/User";
import argon2 from "argon2";
import { NextResponse } from "next/server";
import Ajv from "ajv";
import addFormats from "ajv-formats"
import jwt from "jsonwebtoken";
import { COOKIE_NAME } from "@/constant";
import { Cookie } from "tough-cookie"

const ajv = new Ajv();
addFormats(ajv);

async function hasUser(obj) {
    await dbConnect();
    const user = await User.findOne({ ...obj });
    return user;
}

export async function POST(req) {
    try {
        let { username, password } = await req.json();

        // convert username to lowercase
        username = username.toLowerCase();

        // Validate username and password
        const schema = {
            type: "object",
            properties: {
                username: {
                    type: "string",
                    minLength: 4,
                    maxLength: 32,
                    pattern: "^[a-zA-Z0-9_]*$"
                },
                password: {
                    type: "string",
                    minLength: 8,
                    maxLength: 128
                }
            },
            required: ["username", "password"]
        };

        const validate = ajv.compile(schema);
        const valid = validate({ username, password });

        if (!valid) {
            return NextResponse.json({ error: "Invalid username or password" }, { status: 400 });
        }

        // Check if user exists
        const user = await hasUser({ username });
        if (!user) {
            return NextResponse.json({ error: "User does not exist" }, { status: 404 });
        }

        // Verify password
        const validPassword = await argon2.verify(user.password, password);
        if (!validPassword) {
            return NextResponse.json({ error: "Invalid password" }, { status: 401 });
        }

        // Generate JWT
        const jwtToken = jwt.sign({ id: user._id, password: user.password }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES });

        // Set JWT as cookie
        const cookie = Cookie.parse(`${COOKIE_NAME}=${jwtToken}`);
        cookie.path = '/';
        cookie.httpOnly = true;
        cookie.sameSite = 'lax';

        if (process.env.NODE_ENV === 'production') {
            cookie.secure = true;
        }

        return new NextResponse({
            body: { success: true },
        }, {
            headers: {
                'Set-Cookie': cookie.toString()
            },
            status: 200
        })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: `Unexpected Error, please contact an Administrator: ${error.message}` }, { status: 500 });
    }
}
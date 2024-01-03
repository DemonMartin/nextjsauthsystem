import dbConnect from "@/db/connection";
import User from "@/models/User";
import argon2 from "argon2";
import { NextResponse } from "next/server";
import Ajv from "ajv";
import addFormats from "ajv-formats"
import jwt from "jsonwebtoken";

const ajv = new Ajv();
addFormats(ajv);

async function hasUser(obj) {
    const user = await User.findOne({ ...obj });
    return user;
}

export async function POST(req) {
    try {
        const { username, password } = await req.json();

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
                    minLength: 8
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

        // Login successful

        // Generate JWT
        const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES });

        return NextResponse.json({  });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
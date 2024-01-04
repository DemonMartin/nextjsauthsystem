import dbConnect from "@/db/connection";
import User from "@/models/User";
import argon2 from "argon2";
import { NextResponse } from "next/server";
import Ajv from "ajv";
import addFormats from "ajv-formats"
import validator from "validator";
import validateFingerprint from "@/libs/validateFingerprint";
import { verifyEmail } from '@devmehq/email-validator-js';

const ajv = new Ajv();
addFormats(ajv);

async function hasUser(obj) {
    const user = await User.findOne({ ...obj }).exec();
    return user;
}

export async function POST(req) {
    try {
        // email, password, invite, username 
        const requestBody = await req.json();

        const schema = {
            type: "object",
            properties: {
                email: { type: "string", format: "email" },
                password: {
                    type: "string",
                    minLength: 8,
                    maxLength: 128
                },
                invite: { type: "string" },
                username: {
                    type: "string",
                    minLength: 4,
                    maxLength: 32,
                    pattern: "^[a-zA-Z0-9_]*$"
                },
                fingerprint: {
                    type: "string"
                }
            },
            required: ["email", "password", "invite", "username", "fingerprint"]
        };

        const validate = ajv.compile(schema);

        if (!validate(requestBody)) {
            // convert validate Error into human readable:
            const firstHumanError =
                validate.errors[0].instancePath + " " + validate.errors[0].message;

            return NextResponse.json({ error: firstHumanError }, { status: 400 });
        }

        const { email, password, invite, username, fingerprint } = requestBody;

        // check if fingerprint is valid
        if (!(await validateFingerprint(req.headers, fingerprint))) {
            return NextResponse.json({ error: "Invalid fingerprint" }, { status: 400 });
        }

        // check if invite is valid
        if (invite !== process.env.INVITE_CODE) {
            return NextResponse.json({ error: "Invalid invite code" }, { status: 400 });
        }

        await dbConnect();

        // check if email is already in use
        if (await hasUser({ email })) {
            return NextResponse.json({ error: "Email is already in use" }, { status: 400 });
        }

        // check if username is already in use
        if (await hasUser({ username })) {
            return NextResponse.json({ error: "Username is already taken" }, { status: 400 });
        }

        // check if password is strong enough
        if (!validator.isStrongPassword(password)) {
            return NextResponse.json({ error: "Password is not strong enough, ensure it has LowerCase, UpperCase, Numbers and Symbols in it" }, { status: 400 });
        }

        if (process.env.EMAIL_VERIFY_PRECHECK) {
            const { validFormat, validSmtp, validMx } = await verifyEmail({ emailAddress: email, verifyMx: true, verifySmtp: true, timeout: 5000 });
            if (!validFormat) {
                return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
            }

            if (!validSmtp) {
                return NextResponse.json({ error: "Invalid email smtp" }, { status: 400 });
            }

            if (!validMx) {
                return NextResponse.json({ error: "Invalid email mx" }, { status: 400 });
            }
        }

        // hash password
        const hashedPassword = await argon2.hash(password, {
            type: argon2.argon2id
        });
        // create user
        const user = await User.create({
            email,
            password: hashedPassword,
            username
        });

        // return success
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: "An unexpected error occurred while registering the user. Please contact an Administrator." },
            { status: 500 }
        );
    }
}
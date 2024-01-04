import dbConnect from "@/db/connection";
import User from "@/models/User";
import argon2 from "argon2";
import { NextResponse } from "next/server";
import Ajv from "ajv";
import addFormats from "ajv-formats"
import validator from "validator";
import validateFingerprint from "@/libs/validateFingerprint";
import { verifyEmail } from '@devmehq/email-validator-js';
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer"

const ajv = new Ajv();
addFormats(ajv);

async function hasUser(obj) {
    const user = await User.findOne({ ...obj }).exec();
    return user;
}

function NextError(error) {
    return NextResponse.json({ error }, { status: 400 });
}

async function sendVerificationEmail(email) {
    try {
        const token = jwt.sign({ email }, process.env.EMAIL_JWT_SECRET, {
            expiresIn: process.env.EMAIL_JWT_EXPIRES
        });
        let msg = `
        <h1>Verify your email</h1>
        <p>Click the link below to verify your email address.</p>
        <a href="${process.env.SITE_URL}/verify/${token}">Verify Email</a>
        `;

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_SERVER,
            port: +process.env.SMTP_PORT,
            secure: process.env.SMPT_SECURE === "true",
            auth: {
                user: process.env.SMTP_USERNAME,
                pass: process.env.SMTP_PASSWORD
            }
        });

        await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to: email,
            subject: "Verify your email",
            html: msg
        });

        return { success: true }
    } catch (error) {
        console.log(error);
        return { success: false }
    }
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

            return NextError(firstHumanError)
        }

        const { email, password, invite, username, fingerprint } = requestBody;

        // check if fingerprint is valid
        if (!(await validateFingerprint(req.headers, fingerprint))) {
            return NextError("Invalid fingerprint")
        }

        // check if invite is valid
        if (invite !== process.env.INVITE_CODE) {
            return NextError("Invalid invite code")
        }

        if (username === password) {
            return NextError("Username and password cannot be the same")
        }

        await dbConnect();

        // check if email is already in use
        if (await hasUser({ email })) {
            return NextError("Email is already in use")
        }

        // check if username is already in use
        if (await hasUser({ username })) {
            return NextError("Username is already taken")
        }

        // check if password is strong enough
        if (!validator.isStrongPassword(password)) {
            return NextError("Password needs lower and uppercase letters, numbers, and symbols")
        }

        if (process.env.EMAIL_VERIFY_PRECHECK) {
            const { validFormat, validSmtp, validMx } = await verifyEmail({ emailAddress: email, verifyMx: true, verifySmtp: true, timeout: 5000 });
            if (!validFormat) {
                return NextError("Invalid email format (please report issues)")
            }

            if (!validSmtp) {
                return NextError("Invalid email smtp (please report issues)")
            }

            if (!validMx) {
                return NextError("Invalid email mx (please report issues)")
            }
        }

        // send verification email
        if (process.env.EMAIL_VERIFY_SENDING === "true") {
            const EmailRequest = await sendVerificationEmail(email);

            if (!EmailRequest.success) {
                return NextError("Error sending verification email")
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
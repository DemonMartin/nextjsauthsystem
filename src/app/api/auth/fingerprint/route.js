import argon2 from 'argon2';
import { isbot } from "isbot";
import Ajv from 'ajv';
import { NextResponse } from 'next/server';

const ajv = new Ajv();

const schema = {
    type: 'object',
    properties: {
        'user-agent': { type: 'string' },
        'x-forwarded-for': { type: 'string' },
        'x-timestamp': {
            type: 'string'
        },
        'accept-language': { type: 'string' }
    },
    required: ['user-agent', 'x-forwarded-for', 'accept-language', 'x-timestamp']
};

const validate = ajv.compile(schema);

function validateHeaders(headers) {
    const headersObject = {
        'user-agent': headers.get('user-agent'),
        'x-forwarded-for': headers.get('x-forwarded-for'),
        'x-timestamp': headers.get('x-timestamp'),
        'accept-language': headers.get('accept-language')
    }

    const valid = validate(headersObject);
    if (!valid) {
        throw new Error('Invalid Request.');
    }
}

function checkIfBot(userAgent) {
    if (isbot(userAgent)) {
        throw new Error('Invalid Request.');
    }
}

function validateTimestamp(timestamp) {
    const now = new Date();
    if (now.getTime() - new Date(timestamp).getTime() > 300000) {
        throw new Error('Invalid Request.');
    }
}

async function createFingerprint(headers) {
    const userAgent = headers.get('user-agent');
    const forwardedFor = headers.get('x-forwarded-for');
    const acceptLanguage = headers.get('accept-language');
    const referer = headers.get('referer');
    const secChUa = headers.get('sec-ch-ua');
    const secChUaMobile = headers.get('sec-ch-ua-mobile');
    const secChUaPlatform = headers.get('sec-ch-ua-platform');
    const FPKey = process.env.FINGERPRINT_KEY;

    return await argon2.hash(`${userAgent}${forwardedFor}${acceptLanguage}${referer}${secChUa}${secChUaMobile}${secChUaPlatform}${FPKey}`);
}

function validateContentType(headers) {
    if (headers.get('content-type') !== 'application/json') {
        throw new Error('Invalid Request.');
    }
}

export async function POST(req) {
    try {
        const { headers } = req;

        // Needs to pass these requirements.
        validateHeaders(headers);
        checkIfBot(headers.get('user-agent'));
        validateTimestamp(headers.get('x-timestamp'));
        validateContentType(headers);

        const fingerprint = await createFingerprint(headers);

        return NextResponse.json({ fingerprint }, {
            status: 200
        });
    } catch (error) {
        return NextResponse.json({
            error: error.message
        }, {
            status: 400
        })
    }
}
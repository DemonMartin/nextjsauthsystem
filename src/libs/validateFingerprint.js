import argon2 from 'argon2';

export default async function validateFingerprint(headers, receivedFingerprint) {
    const userAgent = headers.get('user-agent');
    const forwardedFor = headers.get('x-forwarded-for');
    const acceptLanguage = headers.get('accept-language');
    const referer = headers.get('referer');
    const secChUa = headers.get('sec-ch-ua');
    const secChUaMobile = headers.get('sec-ch-ua-mobile');
    const secChUaPlatform = headers.get('sec-ch-ua-platform');
    const FPKey = process.env.FINGERPRINT_KEY;

    const generatedFingerprint = await argon2.hash(`${userAgent}${forwardedFor}${acceptLanguage}${referer}${secChUa}${secChUaMobile}${secChUaPlatform}${FPKey}`);

    return generatedFingerprint !== receivedFingerprint;
}
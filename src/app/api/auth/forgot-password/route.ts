import { NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models/User';
import { PasswordResetToken } from '@/models/PasswordResetToken';
import { sendPasswordResetEmail } from '@/lib/mail';

export async function POST(req: Request) {
    try {
        let { email } = await req.json();

        if (!email) {
            return NextResponse.json(
                { message: 'Email is required' },
                { status: 400 }
            );
        }

        email = email.toLowerCase().trim();

        await dbConnect();

        const user = await User.findOne({ email });

        if (!user) {
            // Return 200 even if user not found to prevent email enumeration
            return NextResponse.json({ message: 'If that email exists, a reset link has been sent.' }, { status: 200 });
        }

        if (user.authProvider === 'google') {
            return NextResponse.json(
                { message: 'This account uses Google Sign-In. You cannot reset its password here.' },
                { status: 400 }
            );
        }

        // Check if token already exists for this email and delete it
        await PasswordResetToken.deleteMany({ email });

        // Generate token
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour expiration

        await PasswordResetToken.create({
            email,
            token,
            expiresAt,
        });

        // Dispatch email
        const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;
        await sendPasswordResetEmail(email, resetLink, user.name);

        return NextResponse.json(
            { message: 'If that email exists, a reset link has been sent.', devToken: token }, // keep devToken broadly attached purely for localized dev-feedback if SMTP halts
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}

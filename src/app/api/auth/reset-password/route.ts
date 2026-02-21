import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models/User';
import { PasswordResetToken } from '@/models/PasswordResetToken';

export async function POST(req: Request) {
    try {
        const { token, password } = await req.json();

        if (!token || !password) {
            return NextResponse.json(
                { message: 'Token and new password are required' },
                { status: 400 }
            );
        }

        await dbConnect();

        const resetTokenDocument = await PasswordResetToken.findOne({ token });

        if (!resetTokenDocument || resetTokenDocument.expiresAt < new Date()) {
            return NextResponse.json(
                { message: 'Invalid or expired token' },
                { status: 400 }
            );
        }

        const user = await User.findOne({ email: resetTokenDocument.email });

        if (!user) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 404 }
            );
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Update user password explicitly
        await User.updateOne({ _id: user._id }, { password: hashedPassword });

        // Consume (delete) the token
        await PasswordResetToken.deleteOne({ _id: resetTokenDocument._id });

        return NextResponse.json(
            { message: 'Password has been successfully reset' },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}

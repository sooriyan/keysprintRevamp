import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models/User';

export async function POST(req: Request) {
    try {
        const { firstName, lastName, email, password, username } = await req.json();

        if (!email || !password || !firstName || !username) {
            return NextResponse.json(
                { message: 'Missing required fields' },
                { status: 400 }
            );
        }

        await dbConnect();

        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return NextResponse.json(
                { message: 'User already exists' },
                { status: 409 }
            );
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const cleanedUsername = username.trim();
        if (/\s/.test(cleanedUsername)) {
            return NextResponse.json(
                { message: 'Username cannot contain spaces' },
                { status: 400 }
            );
        }

        // Create user
        await User.create({
            name: cleanedUsername,
            firstName: firstName?.trim(),
            lastName: lastName?.trim(),
            email,
            password: hashedPassword,
            authProvider: 'credentials',
            themePreference: 'system',
        });

        return NextResponse.json(
            { message: 'User created successfully' },
            { status: 201 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}

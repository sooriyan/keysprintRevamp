import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import { TypingResult } from '@/models/TypingResult';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        // If not logged in, just return success (local play is allowed)
        if (!(session?.user as any)?.id) {
            return NextResponse.json({ message: "Guest result processed locally", saved: false }, { status: 200 });
        }

        const { challengeType, wpm, accuracy, timeTaken } = await req.json();

        if (!challengeType || wpm === undefined || accuracy === undefined || timeTaken === undefined) {
            return NextResponse.json({ message: "Invalid payload data" }, { status: 400 });
        }

        await connectToDatabase();

        const newResult = await TypingResult.create({
            user: (session!.user as any).id,
            challengeType,
            wpm,
            accuracy,
            timeTaken
        });

        return NextResponse.json({ message: "Result saved to database", saved: true, result: newResult }, { status: 201 });

    } catch (error) {
        console.error("Error saving typing result:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

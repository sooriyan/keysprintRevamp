import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models/User';
import { TypingResult } from '@/models/TypingResult';
import { ACHIEVEMENTS } from '@/app/api/user/stats/route';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ username: string }> }
) {
    try {
        const { username } = await params;
        const usernameDecoded = decodeURIComponent(username);

        await dbConnect();

        // Find user by their display name (case-insensitive for better UX)
        const user = await User.findOne({ name: { $regex: new RegExp(`^${usernameDecoded}$`, "i") } });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Fetch tests to calculate public stats
        const tests = await TypingResult.find({ user: user._id });

        const totalTests = tests.length;
        const avgWpm = totalTests > 0
            ? Math.round(tests.reduce((acc, t) => acc + t.wpm, 0) / totalTests)
            : 0;

        const highestAccuracy = totalTests > 0
            ? Math.max(...tests.map(t => t.accuracy))
            : 0;

        // Map unlocked achievement instances to their static definitions
        const unlockedBadges = (user.unlockedAchievements || []).map((unlocked: any) => {
            const definition = ACHIEVEMENTS.find(a => a.id === unlocked.achievementId);
            return definition ? { ...definition, unlockedAt: unlocked.unlockedAt } : null;
        }).filter(Boolean);

        return NextResponse.json({
            user: {
                id: user._id.toString(),
                name: user.name,
                image: user.image || null,
                createdAt: user.createdAt
            },
            stats: {
                totalTests,
                avgWpm,
                highestAccuracy,
            },
            badges: unlockedBadges
        }, { status: 200 });

    } catch (error: any) {
        console.error("Public profile fetch error:", error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

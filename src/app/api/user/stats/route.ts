import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models/User';
import { TypingResult } from '@/models/TypingResult';

// Static achievement definitions
export const ACHIEVEMENTS = [
    { id: 'FIRST_TEST', title: 'First Steps', description: 'Complete your first typing test.', icon: 'Zap' },
    { id: 'WPM_100_CLUB', title: '100 WPM Club', description: 'Break the 100 WPM barrier.', icon: 'Flame' },
    { id: 'ACCURACY_KING', title: 'Flawless Victory', description: 'Achieve 100% accuracy on a test.', icon: 'Target' },
    { id: 'NIGHT_OWL', title: 'Night Owl', description: 'Complete 10 tests between midnight and 4AM.', icon: 'Moon' },
    { id: 'VETERAN_50', title: 'Veteran', description: 'Complete 50 total typing tests.', icon: 'Shield' },
    { id: 'SPEED_DEVIL', title: 'Speed Devil', description: 'Achieve over 130 WPM.', icon: 'Crown' },
];

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const user = await User.findOne({ email: session.user.email });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Fetch tests to calculate stats
        const tests = await TypingResult.find({ user: user._id });

        // Calculate best scores per challenge type
        const bestScores: Record<string, number> = {
            standard: 0,
            paragraph: 0,
            developer: 0,
            daily: 0
        };

        let totalTime = 0;

        tests.forEach(t => {
            totalTime += (t.timeTaken || 0);
            if (t.challengeType && t.wpm > (bestScores[t.challengeType] || 0)) {
                bestScores[t.challengeType] = t.wpm;
            }
        });

        const totalTests = tests.length;
        const avgWpm = totalTests > 0
            ? Math.round(tests.reduce((acc, t) => acc + t.wpm, 0) / totalTests)
            : 0;

        const highestAccuracy = totalTests > 0
            ? Math.max(...tests.map(t => t.accuracy))
            : 0;

        // Achievements Logic
        if (!user.unlockedAchievements) user.unlockedAchievements = [];
        let achievementsChanged = false;
        const unlockedMap = new Set((user.unlockedAchievements).map((a: any) => a.achievementId));

        const unlock = (id: string) => {
            if (!unlockedMap.has(id)) {
                user.unlockedAchievements.push({ achievementId: id, unlockedAt: new Date() });
                unlockedMap.add(id);
                achievementsChanged = true;
            }
        };

        if (totalTests >= 1) unlock('FIRST_TEST');
        if (totalTests >= 50) unlock('VETERAN_50');
        if (highestAccuracy >= 100) unlock('ACCURACY_KING');
        if (tests.some(t => t.wpm >= 100)) unlock('WPM_100_CLUB');
        if (tests.some(t => t.wpm >= 130)) unlock('SPEED_DEVIL');
        if (tests.filter(t => {
            const h = new Date(t.createdAt).getHours();
            return h >= 0 && h < 4;
        }).length >= 10) unlock('NIGHT_OWL');

        if (achievementsChanged) {
            await user.save();
        }

        const recentTests = tests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

        // Build All-Time Performance History for Recharts
        // We'll return all tests sorted, so the frontend can slice/filter by 7, 30 days or all-time.
        const performanceHistory = tests
            .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
            .map(t => ({
                isoDate: t.createdAt.toISOString(),
                date: new Date(t.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
                wpm: t.wpm
            }));

        // Send back calculated static stats + db unlocked achievements
        return NextResponse.json({
            stats: {
                totalTests,
                avgWpm,
                highestAccuracy,
                totalTime,
                bestScores,
            },
            recentTests,
            performanceHistory,
            achievements: {
                unlocked: user.unlockedAchievements || [],
                allList: ACHIEVEMENTS
            }
        }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}

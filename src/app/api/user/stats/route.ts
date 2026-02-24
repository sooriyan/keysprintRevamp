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

        // --- Analytics / Training Insights Engine ---
        let weakArea = "Not enough data";
        let strongArea = "Keep practicing!";
        let accuracyInsight = "Play more to get insights on your precision.";
        let recommendation = "Take a few more tests across different modes to get personalized insights!";
        let suggestedChallenge = "/challenge";

        let struggledLetters: string[] = [];
        let struggledWords: string[] = [];

        if (totalTests >= 5) {
            // Aggregate struggled letters and words
            const globalMissedChars: Record<string, number> = {};
            const globalMissedWords: Record<string, number> = {};

            tests.forEach(t => {
                const missedCharsMap = t.get('missedChars');
                if (missedCharsMap) {
                    for (const [char, count] of missedCharsMap.entries()) {
                        globalMissedChars[char] = (globalMissedChars[char] || 0) + (count as number);
                    }
                }
                const missedWordsMap = t.get('missedWords');
                if (missedWordsMap) {
                    for (const [word, count] of missedWordsMap.entries()) {
                        globalMissedWords[word] = (globalMissedWords[word] || 0) + (count as number);
                    }
                }
            });

            struggledLetters = Object.entries(globalMissedChars)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3)
                .map(e => e[0]);

            struggledWords = Object.entries(globalMissedWords)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3)
                .map(e => e[0]);

            // Group tests by type
            const typeMetrics: Record<string, { totalWpm: number, totalAcc: number, count: number }> = {};
            tests.forEach(t => {
                const type = (t.challengeType || 'standard').toLowerCase();
                if (!typeMetrics[type]) typeMetrics[type] = { totalWpm: 0, totalAcc: 0, count: 0 };
                typeMetrics[type].totalWpm += t.wpm;
                typeMetrics[type].totalAcc += t.accuracy;
                typeMetrics[type].count += 1;
            });

            // Find the active type where they perform the worst and best relative to global average
            let lowestDelta = Infinity;
            let highestDelta = -Infinity;
            let weakestType = null;
            let strongestType = null;

            for (const [type, data] of Object.entries(typeMetrics)) {
                if (data.count > 0) {
                    const typeAvgWpm = data.totalWpm / data.count;
                    const delta = typeAvgWpm - avgWpm;

                    if (delta < lowestDelta) {
                        lowestDelta = delta;
                        weakestType = type;
                    }
                    if (delta > highestDelta) {
                        highestDelta = delta;
                        strongestType = type;
                    }
                }
            }

            // Strong Area Text
            if (strongestType === 'developer') strongArea = "Developer Snippets";
            else if (strongestType === 'paragraph') strongArea = "Paragraph Endurance";
            else if (strongestType === 'standard') strongArea = "Standard Reflexes";
            else if (strongestType === 'daily') strongArea = "Daily Global";
            else strongArea = "Consistency";

            // Weak Area & Recommendations Text
            if (weakestType) {
                if (weakestType === 'developer') {
                    weakArea = "Developer Snippets";
                    recommendation = "You're dropping speed on special characters and symbols. Practice the Developer mode specifically to build muscle memory for brackets, semi-colons, and syntax format.";
                    suggestedChallenge = "/challenge/developer";
                } else if (weakestType === 'paragraph') {
                    weakArea = "Paragraph Endurance";
                    recommendation = "Your endurance is wavering on longer prose. Start focusing on rhythm rather than raw speed bursts. Run the Paragraph challenge daily.";
                    suggestedChallenge = "/challenge/paragraph";
                } else if (weakestType === 'standard') {
                    weakArea = "Standard Reflexes";
                    recommendation = "Your raw reflex speed on random words is holding you back. Warm up with 5 quick Standard tests to increase baseline input speed.";
                    suggestedChallenge = "/challenge/standard";
                } else {
                    weakArea = "Global Modifiers";
                    recommendation = "You're performing well consistently, but you can push deeper on the daily challenges to compete with the globe.";
                    suggestedChallenge = "/challenge/daily";
                }
            }

            // Formulate dynamic recommendation based on missed elements if sufficient
            if (struggledLetters.length > 0) {
                recommendation += ` Watch your accuracy on the specific keys: ${struggledLetters.map(l => `'${l}'`).join(', ')}.`;
            }

            // Accuracy Insight
            const avgOverallAcc = tests.reduce((acc, t) => acc + t.accuracy, 0) / totalTests;
            if (avgOverallAcc < 90) {
                accuracyInsight = `Your overall accuracy is ${avgOverallAcc.toFixed(1)}%. You are rushing! Slow down to build accuracy, and speed will follow naturally.`;
            } else if (avgOverallAcc < 95) {
                accuracyInsight = `Solid precision at ${avgOverallAcc.toFixed(1)}%. Aim for 96%+ to eliminate time wasted on backspaces.`;
            } else {
                accuracyInsight = `Incredible precision (${avgOverallAcc.toFixed(1)}%). You are ready to start pushing your raw speed to the absolute limit.`;
            }
        }

        const analytics = {
            weakestArea: weakArea,
            strongestArea: strongArea,
            accuracyInsight,
            recommendation,
            suggestedChallenge,
            struggledLetters,
            struggledWords
        };

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
            },
            analytics
        }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}

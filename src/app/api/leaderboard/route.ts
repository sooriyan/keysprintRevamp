import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { TypingResult } from '@/models/TypingResult';
import { User } from '@/models/User';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const range = searchParams.get('range') || 'daily';
        const protocol = searchParams.get('protocol');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');
        const skip = (page - 1) * limit;

        await connectToDatabase();

        const dateFilter = new Date();
        if (range === 'daily') {
            dateFilter.setDate(dateFilter.getDate() - 1);
        } else if (range === 'weekly') {
            dateFilter.setDate(dateFilter.getDate() - 7);
        } else {
            // all-time (so a very old date)
            dateFilter.setFullYear(2000);
        }

        const matchQuery: any = { createdAt: { $gte: dateFilter } };
        if (protocol) {
            matchQuery.challengeType = protocol;
        }

        // Aggregate results by looking up users in DB and their best scores
        const results = await User.aggregate([
            {
                $lookup: {
                    from: "typingresults",
                    let: { userId: "$_id" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$user", "$$userId"] } } },
                        { $match: matchQuery }
                    ],
                    as: "tests"
                }
            },
            {
                $addFields: {
                    testCount: { $size: "$tests" },
                    topSpeed: { $max: "$tests.wpm" },
                    avgWpm: { $avg: "$tests.wpm" },
                    accuracy: { $max: "$tests.accuracy" }
                }
            },
            {
                $project: {
                    _id: 1,
                    user: "$name",
                    image: "$image",
                    type: { $cond: [{ $ifNull: ["$isPro", false] }, "Pro Member", "Member"] },
                    avgWpm: { $ifNull: [{ $round: ["$avgWpm", 0] }, 0] },
                    topSpeed: { $ifNull: ["$topSpeed", 0] },
                    accuracy: { $ifNull: ["$accuracy", 0] },
                    trend: { $cond: [{ $gt: ["$testCount", 5] }, "up", "flat"] }
                }
            },
            { $sort: { topSpeed: -1, user: 1 } },
            { $skip: skip },
            { $limit: limit }
        ]);

        // Get total count of all users for pagination
        const totalUsers = await User.countDocuments();
        const totalPages = Math.ceil(totalUsers / limit);

        return NextResponse.json({
            success: true,
            data: results,
            pagination: {
                total: totalUsers,
                page,
                limit,
                totalPages
            }
        }, {
            status: 200,
            headers: {
                'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=300'
            }
        });

    } catch (error) {
        console.error("Leaderboard api error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

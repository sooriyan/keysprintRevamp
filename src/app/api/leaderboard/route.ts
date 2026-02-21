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

        // Aggregate results to find the highest WPM per user in the given timeframe
        const results = await TypingResult.aggregate([
            { $match: matchQuery },
            { $sort: { wpm: -1 } },
            {
                $group: {
                    _id: "$user",
                    topSpeed: { $first: "$wpm" },
                    avgWpm: { $avg: "$wpm" },
                    accuracy: { $max: "$accuracy" },
                    testCount: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "userData"
                }
            },
            { $unwind: "$userData" },
            { $sort: { topSpeed: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
                $project: {
                    user: "$userData.name",
                    image: "$userData.image",
                    type: { $cond: [{ $ifNull: ["$userData.isPro", false] }, "Pro Member", "Member"] },
                    avgWpm: { $round: ["$avgWpm", 0] },
                    topSpeed: 1,
                    accuracy: 1,
                    trend: { $cond: [{ $gt: ["$testCount", 5] }, "up", "flat"] }
                }
            }
        ]);

        // Get total count for pagination
        const totalCountParams = await TypingResult.aggregate([
            { $match: matchQuery },
            {
                $group: {
                    _id: "$user"
                }
            },
            { $count: "total" }
        ]);

        const totalUsers = totalCountParams.length > 0 ? totalCountParams[0].total : 0;
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

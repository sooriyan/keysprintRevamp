import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import { CustomChallenge } from "@/models/CustomChallenge";

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        // Fetch all challenges, sorted by newest
        const challenges = await CustomChallenge.find({})
            .sort({ createdAt: -1 })
            .limit(50); // Pagination could be added later

        return NextResponse.json({ success: true, count: challenges.length, data: challenges }, { status: 200 });
    } catch (error: any) {
        console.error("Failed to fetch custom challenges:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { title, content } = body;

        if (!title || !content) {
            return NextResponse.json({ success: false, error: "Title and content are required" }, { status: 400 });
        }

        if (content.length < 50 || content.length > 2000) {
            return NextResponse.json({ success: false, error: "Content must be between 50 and 2000 characters." }, { status: 400 });
        }

        await dbConnect();

        const newChallenge = await CustomChallenge.create({
            title,
            content,
            creator: (session.user as any).id,
            creatorName: session.user.name || "Anonymous",
        });

        return NextResponse.json({ success: true, data: newChallenge }, { status: 201 });
    } catch (error: any) {
        console.error("Error creating custom challenge:", error);
        return NextResponse.json({ success: false, error: "Failed to create challenge" }, { status: 500 });
    }
}

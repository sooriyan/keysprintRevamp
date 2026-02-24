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

        // Aggressively normalize text so that it uses standard typeable keyboard characters
        const normalizedContent = content
            .replace(/[\u2018\u2019\u201B\u201A\u2039\u203A\u00B4\u0060]/g, "'") // Various single/smart quotes
            .replace(/[\u201C\u201D\u201E\u201F\u00AB\u00BB]/g, '"') // Various double quotes
            .replace(/[\u2010\u2011\u2012\u2013\u2014\u2015\u2212]/g, "-") // Various dashes and hyphens
            .replace(/\u2026/g, "...")        // Ellipsis
            .replace(/[\u00A0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]/g, " ") // Unicode spaces to normal space
            .replace(/[\u200B-\u200D\uFEFF]/g, "") // Remove zero-width chars
            .replace(/\t/g, "    ")           // Convert tabs to 4 spaces
            .replace(/[^\x20-\x7E\n]/g, "") // STRICT: Keep only basic printable ASCII + newline
            .trim();

        if (normalizedContent.length < 50 || normalizedContent.length > 2000) {
            return NextResponse.json({ success: false, error: "Content must be between 50 and 2000 characters." }, { status: 400 });
        }

        await dbConnect();

        const newChallenge = await CustomChallenge.create({
            title,
            content: normalizedContent,
            creator: (session.user as any).id,
            creatorName: session.user.name || "Anonymous",
        });

        return NextResponse.json({ success: true, data: newChallenge }, { status: 201 });
    } catch (error: any) {
        console.error("Error creating custom challenge:", error);
        return NextResponse.json({ success: false, error: "Failed to create challenge" }, { status: 500 });
    }
}

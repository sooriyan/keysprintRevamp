import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { CustomChallenge } from "@/models/CustomChallenge";
import mongoose from "mongoose";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ success: false, error: "Invalid Challenge ID" }, { status: 400 });
        }

        await dbConnect();

        const challenge = await CustomChallenge.findById(id);

        if (!challenge) {
            return NextResponse.json({ success: false, error: "Challenge not found" }, { status: 404 });
        }

        // Technically, we should increment playCount here or in a separate result endpoint 
        // For simplicity, we can do it on fetch, or let the client do it later. Doing on fetch for now:
        challenge.playCount += 1;
        await challenge.save();

        return NextResponse.json({ success: true, data: challenge }, { status: 200 });

    } catch (error: any) {
        console.error("Failed to fetch custom challenge:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}

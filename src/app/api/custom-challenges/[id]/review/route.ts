import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import { CustomChallenge } from "@/models/CustomChallenge";
import mongoose from "mongoose";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ success: false, error: "Unauthorized. You must be signed in to leave a review." }, { status: 401 });
        }

        const body = await req.json();
        const { rating, comment } = body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ success: false, error: "Invalid Challenge ID" }, { status: 400 });
        }

        if (!rating || !['Easy', 'Medium', 'Hard'].includes(rating)) {
            return NextResponse.json({ success: false, error: "Invalid rating. Must be Easy, Medium, or Hard." }, { status: 400 });
        }

        if (!comment || comment.trim().length === 0) {
            return NextResponse.json({ success: false, error: "Comment is required." }, { status: 400 });
        }

        await dbConnect();
        const challenge = await CustomChallenge.findById(id);

        if (!challenge) {
            return NextResponse.json({ success: false, error: "Challenge not found" }, { status: 404 });
        }

        // Check if user already reviewed
        const alreadyReviewed = challenge.reviews.some(
            (r: any) => r.user.toString() === (session.user as any).id
        );

        if (alreadyReviewed) {
            return NextResponse.json({ success: false, error: "You have already reviewed this challenge." }, { status: 400 });
        }

        const newReview = {
            user: new mongoose.Types.ObjectId((session.user as any).id),
            username: session.user.name || "Anonymous",
            rating,
            comment: comment.trim(),
            createdAt: new Date()
        };

        // Push new review
        challenge.reviews.push(newReview as any);

        // Recalculate average difficulty based on simple majority or weighted average.
        // Let's use simple logic: compute score Easy=1, Medium=2, Hard=3.
        let totalScore = 0;
        challenge.reviews.forEach((r: any) => {
            if (r.rating === 'Easy') totalScore += 1;
            else if (r.rating === 'Medium') totalScore += 2;
            else if (r.rating === 'Hard') totalScore += 3;
        });

        const avgScore = totalScore / challenge.reviews.length;

        let avgRating = 'Unrated';
        if (avgScore <= 1.5) avgRating = 'Easy';
        else if (avgScore <= 2.5) avgRating = 'Medium';
        else avgRating = 'Hard';

        challenge.averageDifficulty = avgRating as any;

        await challenge.save();

        return NextResponse.json({ success: true, message: "Review added successfully", data: challenge.reviews }, { status: 201 });

    } catch (error: any) {
        console.error("Error adding review:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}

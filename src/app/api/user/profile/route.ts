import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models/User';
import { TypingResult } from '@/models/TypingResult';

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!(session?.user as any)?.id) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const user = await User.findById((session!.user as any).id);

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            user: {
                firstName: user.firstName || "",
                lastName: user.lastName || ""
            }
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!(session?.user as any)?.id) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { name, firstName, lastName } = await req.json();

        const cleanedName = name.trim();
        if (cleanedName.length < 2) {
            return NextResponse.json({ message: 'Name must be at least 2 characters long' }, { status: 400 });
        }

        if (/\s/.test(cleanedName)) {
            return NextResponse.json({ message: 'Username cannot contain spaces' }, { status: 400 });
        }

        await dbConnect();

        await User.findByIdAndUpdate((session!.user as any).id, {
            name: cleanedName,
            firstName: firstName?.trim() || "",
            lastName: lastName?.trim() || ""
        });

        return NextResponse.json({ success: true, message: 'Profile updated exactly!' }, { status: 200 });

    } catch (error) {
        console.error("Profile update error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!(session?.user as any)?.id) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const userId = (session!.user as any).id;

        // Cascade delete: Remove all typing results associated with this user
        await TypingResult.deleteMany({ user: userId });

        // Remove the user document completely
        await User.findByIdAndDelete(userId);

        return NextResponse.json({ success: true, message: 'Account permanently deleted' }, { status: 200 });
    } catch (error) {
        console.error("Profile deletion error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

import connectDB from "@/lib/db";
import User from "@/models/user";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const { token } = await request.json();
        const user = await User.findOne({ verificationToken: token, verificationTokenExpiry: { $gt: new Date() } });

        if (!user) {
            return NextResponse.json({ message: "Invalid verification token" }, { status: 400 });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiry = undefined;

        await user.save();
        return NextResponse.json({ message: "Email verified successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
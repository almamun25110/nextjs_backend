import connectDB from "@/lib/db";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const { email, password } = await request.json();
        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ message: "Invalid email or password" }, { status: 400 });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return NextResponse.json({ message: "Invalid email or password" }, { status: 400 });
        }

        const token = jsonwebtoken.sign({ userId: user._id }, process.env.JWT_SECRET as string, { expiresIn: "1d" });

        const response = NextResponse.json({ message: "Login successful", token }, { status: 200 });
        response.cookies.set("token", token, { httpOnly: true });
        return response;

    } catch (error) {
        console.error("Error logging in:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
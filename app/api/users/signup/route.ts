import connectDB from "@/lib/db";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const { name, email, password } = await request.json();
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: "User email already exists" }, { status: 400 });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ 
            name, 
            email, 
            password: hashedPassword
        });
        
        await newUser.save();
        await sendEmail({ email, emailType: "VERIFY", userId: newUser._id });

        return NextResponse.json({ message: "User created successfully" }, { status: 201 });
    } catch (error) {
        console.error("Error during user signup:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
};
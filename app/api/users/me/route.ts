import { getDataFromToken } from "@/helpers/getDataFormToken";
import connectDB from "@/lib/db";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    await connectDB();
    const userId = getDataFromToken(request);
    const user = await User.findById({_id: userId}).select("-password");
    
    if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user);
}
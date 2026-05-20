import connectDB from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    try {
        await connectDB();
        const response = NextResponse.json({ message: "Logout successful" }, { status: 200 });
        response.cookies.delete("token");
        return response;

    } catch (error) {
        console.error("Error logging out:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
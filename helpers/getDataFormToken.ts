import jsonwebtoken from "jsonwebtoken";
import { NextRequest } from "next/server";

export const getDataFromToken = (request: NextRequest) => {
   try {
    const token = request.cookies.get("token")?.value || "";
    const userData: any = jsonwebtoken.verify(token, process.env.JWT_SECRET!);
    return userData.userId;
   } catch (error) {
    throw new Error("Invalid token");
   }
};
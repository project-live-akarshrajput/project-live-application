import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongodb";
import User from "@/lib/models/User";

export async function GET() {
  try {
    await connectToDatabase();

    const onlineCount = await User.countDocuments({ isOnline: true });
    const totalUsers = await User.countDocuments({ isBanned: false });

    return NextResponse.json({
      success: true,
      data: {
        onlineUsers: onlineCount,
        totalUsers,
        serverTime: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch stats" },
      { status: 500 },
    );
  }
}

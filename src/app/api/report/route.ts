import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth/options";
import connectToDatabase from "@/lib/db/mongodb";
import Report from "@/lib/models/Report";
import User from "@/lib/models/User";
import { reportSchema } from "@/lib/validations/schemas";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await request.json();

    // Validate input
    const validationResult = reportSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: validationResult.error.errors[0].message,
        },
        { status: 400 },
      );
    }

    const { reportedUserId, callId, reason, description } =
      validationResult.data;

    // Prevent self-reporting
    if (reportedUserId === session.user.id) {
      return NextResponse.json(
        { success: false, error: "You cannot report yourself" },
        { status: 400 },
      );
    }

    await connectToDatabase();

    // Check if reported user exists
    const reportedUser = await User.findById(reportedUserId);
    if (!reportedUser) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
      );
    }

    // Check for duplicate recent report
    const recentReport = await Report.findOne({
      reporterId: session.user.id,
      reportedUserId,
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    });

    if (recentReport) {
      return NextResponse.json(
        {
          success: false,
          error: "You have already reported this user recently",
        },
        { status: 429 },
      );
    }

    // Create report
    const report = await Report.create({
      reporterId: session.user.id,
      reportedUserId,
      callId,
      reason,
      description,
    });

    // Increment report count for the reported user
    await User.findByIdAndUpdate(reportedUserId, {
      $inc: { reportCount: 1 },
    });

    // Auto-ban if report count exceeds threshold
    const updatedUser = await User.findById(reportedUserId);
    if (updatedUser && updatedUser.reportCount >= 10) {
      await User.findByIdAndUpdate(reportedUserId, {
        isBanned: true,
        banReason: "Multiple user reports",
        bannedUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      });
    }

    return NextResponse.json({
      success: true,
      message: "Report submitted successfully",
    });
  } catch (error) {
    console.error("Report error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit report" },
      { status: 500 },
    );
  }
}

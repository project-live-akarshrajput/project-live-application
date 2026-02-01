import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth/options";
import connectToDatabase from "@/lib/db/mongodb";
import User from "@/lib/models/User";
import { uploadProfileImage, deleteProfileImage } from "@/lib/db/supabase";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 },
      );
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "Invalid file type. Use JPEG, PNG, or WebP" },
        { status: 400 },
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: "File size must be less than 5MB" },
        { status: 400 },
      );
    }

    await connectToDatabase();

    // Get current user to check for existing image
    const currentUser = await User.findById(session.user.id);
    if (currentUser?.profileImage) {
      // Extract path from URL and delete old image
      const urlParts = currentUser.profileImage.split("/");
      const oldPath = urlParts.slice(-2).join("/");
      await deleteProfileImage(oldPath);
    }

    // Upload new image
    const imageUrl = await uploadProfileImage(session.user.id, file);

    if (!imageUrl) {
      return NextResponse.json(
        { success: false, error: "Failed to upload image" },
        { status: 500 },
      );
    }

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      { profileImage: imageUrl },
      { new: true },
    ).select("-password");

    return NextResponse.json({
      success: true,
      data: { profileImage: imageUrl },
      message: "Profile image updated successfully",
    });
  } catch (error) {
    console.error("Upload image error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to upload image" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    await connectToDatabase();

    const user = await User.findById(session.user.id);

    if (!user?.profileImage) {
      return NextResponse.json(
        { success: false, error: "No profile image to delete" },
        { status: 400 },
      );
    }

    // Extract path and delete
    const urlParts = user.profileImage.split("/");
    const path = urlParts.slice(-2).join("/");
    await deleteProfileImage(path);

    // Update user
    await User.findByIdAndUpdate(session.user.id, { profileImage: null });

    return NextResponse.json({
      success: true,
      message: "Profile image deleted successfully",
    });
  } catch (error) {
    console.error("Delete image error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete image" },
      { status: 500 },
    );
  }
}

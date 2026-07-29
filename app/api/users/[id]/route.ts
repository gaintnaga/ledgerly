import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 401 }
      );
    }

    if (authUser.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Forbidden. Admin privileges required." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await req.json();
    const { isActive, role } = body;

    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const updateData: Record<string, any> = {};

    if (typeof isActive === "boolean") {
      updateData.isActive = isActive;
      if (isActive && !existingUser.approvedAt) {
        updateData.approvedAt = new Date();
        updateData.approvedBy = authUser.id;
      }
    }

    if (role && (role === "ADMIN" || role === "USER")) {
      updateData.role = role;
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        provider: true,
        profileImage: true,
        isActive: true,
        approvedAt: true,
        lastLogin: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: `User updated successfully`,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user status:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update user status" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 401 }
      );
    }

    if (authUser.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Forbidden. Admin privileges required." },
        { status: 403 }
      );
    }

    const { id } = await params;

    // Prevent user from deleting themselves
    if (authUser.id === id) {
      return NextResponse.json(
        { success: false, message: "You cannot delete your own account." },
        { status: 400 }
      );
    }

    const userToDelete = await prisma.user.findUnique({
      where: { id },
      include: {
        purchasesPaid: { select: { id: true } },
        purchasesCreated: { select: { id: true } },
      },
    });

    if (!userToDelete) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Check if user has associated purchases
    if (
      userToDelete.purchasesPaid.length > 0 ||
      userToDelete.purchasesCreated.length > 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Cannot delete user with active recorded purchases. Deactivate the account instead.",
        },
        { status: 400 }
      );
    }

    // Clean up dependent non-restrictive relations before deleting
    await prisma.user.updateMany({
      where: { approvedBy: id },
      data: { approvedBy: null },
    });

    await prisma.purchaseParticipant.deleteMany({
      where: { userId: id },
    });

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete user" },
      { status: 500 }
    );
  }
}

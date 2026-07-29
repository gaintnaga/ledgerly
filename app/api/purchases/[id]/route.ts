/**
 * @swagger
 * /api/purchases/{id}:
 *   get:
 *     summary: Get single purchase by ID
 *     description: Retrieves details of a specific purchase including items and payer details. Requires authentication.
 *     tags:
 *       - Purchases
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Purchase ID
 *     responses:
 *       200:
 *         description: Purchase record details.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Purchase not found.
 *       500:
 *         description: Server error.
 *   delete:
 *     summary: Delete a purchase
 *     description: Deletes a purchase record by ID. Requires authentication.
 *     tags:
 *       - Purchases
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Purchase ID
 *     responses:
 *       200:
 *         description: Purchase deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Purchase not found.
 *       500:
 *         description: Server error.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const purchase = await prisma.purchase.findUnique({
      where: { id },
      include: {
        paidBy: {
          select: { id: true, name: true, email: true },
        },
        createdBy: {
          select: { id: true, name: true, email: true },
        },
        items: true,
        participants: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
        },
      },
    });

    if (!purchase) {
      return NextResponse.json(
        { success: false, message: "Purchase not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      purchase,
    });
  } catch (error) {
    console.error("Error fetching purchase detail:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch purchase" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const existing = await prisma.purchase.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Purchase not found" },
        { status: 404 }
      );
    }

    await prisma.purchase.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: `Purchase ${id} deleted successfully`,
    });
  } catch (error) {
    console.error("Error deleting purchase:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete purchase" },
      { status: 500 }
    );
  }
}

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
 *   put:
 *     summary: Update a purchase by ID
 *     description: Updates an existing purchase record, items, and participant splits. Requires authentication.
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
 *         description: Purchase updated successfully.
 *       400:
 *         description: Invalid input or missing fields.
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

export async function PUT(
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
    const body = await req.json();

    const existing = await prisma.purchase.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Purchase not found" },
        { status: 404 }
      );
    }

    // Input Validation
    if (!body.title || typeof body.title !== "string" || body.title.trim() === "") {
      return NextResponse.json(
        { success: false, message: "Purchase title is required." },
        { status: 400 }
      );
    }

    if (!body.paidById || typeof body.paidById !== "string") {
      return NextResponse.json(
        { success: false, message: "Valid paidById (payer user) is required." },
        { status: 400 }
      );
    }

    if (body.totalAmount === undefined || body.totalAmount === null || isNaN(Number(body.totalAmount))) {
      return NextResponse.json(
        { success: false, message: "Valid totalAmount is required." },
        { status: 400 }
      );
    }

    const participantIds: string[] = Array.isArray(body.participantIds) ? body.participantIds : [];
    const sharePerPerson = participantIds.length > 0
      ? Number((Number(body.totalAmount) / participantIds.length).toFixed(2))
      : 0;

    // Remove existing items and participants before updating
    await prisma.purchaseItem.deleteMany({ where: { purchaseId: id } });
    await prisma.purchaseParticipant.deleteMany({ where: { purchaseId: id } });

    const updatedPurchase = await prisma.purchase.update({
      where: { id },
      data: {
        title: body.title.trim(),
        description: body.description || null,
        purchaseDate: body.purchaseDate ? new Date(body.purchaseDate) : existing.purchaseDate,
        storeName: body.storeName || null,
        receiptImage: body.receiptImage || null,
        totalAmount: body.totalAmount,
        paidBy: {
          connect: { id: body.paidById },
        },
        items: Array.isArray(body.items) && body.items.length > 0
          ? {
              create: body.items.map((item: { itemName: string; quantity: number; unitPrice: number; unit?: string }) => ({
                itemName: item.itemName,
                quantity: item.quantity,
                unit: item.unit || null,
                price: item.unitPrice,
                total: (item.quantity || 1) * (item.unitPrice || 0),
              })),
            }
          : undefined,
        participants: participantIds.length > 0
          ? {
              create: participantIds.map((uId: string) => ({
                user: { connect: { id: uId } },
                shareAmount: sharePerPerson,
              })),
            }
          : undefined,
      },
      include: {
        paidBy: true,
        items: true,
        participants: {
          include: {
            user: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      purchase: updatedPurchase,
    });
  } catch (error) {
    console.error("Error updating purchase:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update purchase" },
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

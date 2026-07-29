/**
 * @swagger
 * /api/purchases:
 *   get:
 *     summary: Get all purchases
 *     description: Returns a list of purchases with payer and participant split details. Requires authentication.
 *     tags:
 *       - Purchases
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of purchases.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Server error.
 *   post:
 *     summary: Create a new purchase
 *     description: Logs a new purchase record with optional items, payer user ID, and participant split array. Requires authentication.
 *     tags:
 *       - Purchases
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - paidById
 *               - totalAmount
 *             properties:
 *               title:
 *                 type: string
 *                 example: Grocery Shopping
 *               storeName:
 *                 type: string
 *                 example: DMart
 *               purchaseDate:
 *                 type: string
 *                 example: "2026-07-29"
 *               totalAmount:
 *                 type: number
 *                 example: 1250.50
 *               paidById:
 *                 type: string
 *                 example: user_cuid_123
 *               participantIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["user_cuid_123", "user_cuid_456"]
 *               description:
 *                 type: string
 *                 example: Weekly supplies
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     itemName:
 *                       type: string
 *                     quantity:
 *                       type: number
 *                     unitPrice:
 *                       type: number
 *     responses:
 *       201:
 *         description: Purchase created successfully.
 *       400:
 *         description: Invalid input or missing fields.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Server error.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 401 }
      );
    }

    const purchases = await prisma.purchase.findMany({
      include: {
        paidBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: true,
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      purchases,
    });
  } catch (error) {
    console.error("Error fetching purchases:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch purchases",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 401 }
      );
    }

    const body = await req.json();

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

    // Verify paidBy user exists
    const paidByUser = await prisma.user.findUnique({
      where: { id: body.paidById },
    });

    if (!paidByUser) {
      return NextResponse.json(
        { success: false, message: "Selected payer user does not exist." },
        { status: 400 }
      );
    }

    const purchaseDate = body.purchaseDate ? new Date(body.purchaseDate) : new Date();

    const participantIds: string[] = Array.isArray(body.participantIds) ? body.participantIds : [];
    const sharePerPerson = participantIds.length > 0
      ? Number((Number(body.totalAmount) / participantIds.length).toFixed(2))
      : 0;

    const purchase = await prisma.purchase.create({
      data: {
        title: body.title.trim(),
        description: body.description || null,
        purchaseDate,
        storeName: body.storeName || null,
        receiptImage: body.receiptImage || null,
        totalAmount: body.totalAmount,
        paidBy: {
          connect: {
            id: body.paidById,
          },
        },
        createdBy: {
          connect: {
            id: user.id,
          },
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

    return NextResponse.json(
      {
        success: true,
        purchase,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating purchase:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create purchase",
      },
      { status: 500 }
    );
  }
}
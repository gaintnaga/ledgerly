import { NextRequest, NextResponse } from "next/server";
import { inventoryRepository } from "@/lib/repositories/inventoryRepository";
import { getAuthUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 401 }
      );
    }

    const items = await inventoryRepository.findAll();

    return NextResponse.json({
      success: true,
      data: items,
    });
  } catch (error) {
    console.error("Error fetching inventory items:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch inventory items",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name, categoryId, quantity, unit, unitPrice, minimumStock, notes } = body;

    if (!name || !categoryId) {
      return NextResponse.json(
        { success: false, message: "Item name and categoryId are required." },
        { status: 400 }
      );
    }

    const newItem = await inventoryRepository.create({
      name: name.trim(),
      categoryId,
      quantity: quantity ?? 0,
      unit: unit || "pcs",
      unitPrice: unitPrice ?? 0,
      minimumStock: minimumStock ?? 1,
      notes: notes || null,
    });

    return NextResponse.json({
      success: true,
      message: "Inventory item created successfully",
      data: newItem,
    });
  } catch (error) {
    console.error("Error creating inventory item:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create inventory item",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
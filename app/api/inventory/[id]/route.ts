import { NextRequest, NextResponse } from "next/server";
import { inventoryRepository } from "@/lib/repositories/inventoryRepository";
import { getAuthUser } from "@/lib/auth";

export async function GET(
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

    const { id } = await params;
    const item = await inventoryRepository.findById(id);

    if (!item) {
      return NextResponse.json(
        { success: false, message: "Inventory item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: item,
    });
  } catch (error) {
    console.error("Error fetching inventory item:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch item" },
      { status: 500 }
    );
  }
}

export async function PUT(
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

    const { id } = await params;
    const body = await req.json();

    const existing = await inventoryRepository.findById(id);

    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Inventory item not found" },
        { status: 404 }
      );
    }

    const updatedItem = await inventoryRepository.update(id, {
      ...(body.name ? { name: body.name.trim() } : {}),
      ...(body.categoryId ? { categoryId: body.categoryId } : {}),
      ...(body.quantity !== undefined ? { quantity: body.quantity } : {}),
      ...(body.unit ? { unit: body.unit } : {}),
      ...(body.unitPrice !== undefined ? { unitPrice: body.unitPrice } : {}),
      ...(body.minimumStock !== undefined ? { minimumStock: body.minimumStock } : {}),
      ...(body.notes !== undefined ? { notes: body.notes } : {}),
    });

    return NextResponse.json({
      success: true,
      message: "Inventory item updated successfully",
      data: updatedItem,
    });
  } catch (error) {
    console.error("Error updating inventory item:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update item" },
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

    const { id } = await params;
    const existing = await inventoryRepository.findById(id);

    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Inventory item not found" },
        { status: 404 }
      );
    }

    await inventoryRepository.delete(id);

    return NextResponse.json({
      success: true,
      message: "Inventory item deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting inventory item:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete item" },
      { status: 500 }
    );
  }
}

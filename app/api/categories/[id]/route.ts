import { NextRequest, NextResponse } from "next/server";
import { categoryService } from "@/lib/services/categoryService";
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
    const category = await categoryService.getCategoryById(id);

    return NextResponse.json({
      success: true,
      data: category,
    });
  } catch (error: any) {
    console.error("Error fetching category:", error);
    const isNotFound = error?.message?.includes("not found");
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch category" },
      { status: isNotFound ? 404 : 500 }
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
    const { name, description } = body;

    const updated = await categoryService.updateCategory(id, {
      ...(name ? { name: name.trim() } : {}),
      ...(description !== undefined ? { description: description.trim() } : {}),
    });

    return NextResponse.json({
      success: true,
      message: "Category updated successfully",
      data: updated,
    });
  } catch (error: any) {
    console.error("Error updating category:", error);
    const isNotFound = error?.message?.includes("not found");
    const isConflict = error?.message?.includes("already exists");
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update category" },
      { status: isNotFound ? 404 : isConflict ? 409 : 500 }
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
    await categoryService.deleteCategory(id);

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting category:", error);
    const isNotFound = error?.message?.includes("not found");
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete category" },
      { status: isNotFound ? 404 : 500 }
    );
  }
}

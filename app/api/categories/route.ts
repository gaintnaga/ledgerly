import { NextRequest, NextResponse } from "next/server";
import { categoryService } from "@/lib/services/categoryService";
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

    const categories = await categoryService.getAllCategories();

    return NextResponse.json(
      {
        success: true,
        data: categories,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get Categories Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch categories",
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
    const { name, description } = body;

    if (!name || name.trim() === "") {
      return NextResponse.json(
        {
          success: false,
          message: "Category name is required",
        },
        { status: 400 }
      );
    }

    const category = await categoryService.createCategory({
      name: name.trim(),
      description: description ? description.trim() : undefined,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Category created successfully",
        data: category,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Create Category Error:", error);
    const isConflict = error?.message?.includes("already exists");
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to create category",
      },
      { status: isConflict ? 409 : 500 }
    );
  }
}
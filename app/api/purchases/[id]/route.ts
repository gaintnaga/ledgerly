import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return NextResponse.json({
    success: true,
    purchase: {
      id,
      title: "Weekly Grocery & Supplies",
      store: "DMart Mega Store",
      paidBy: "Amit Kumar",
      amount: 2450.0,
      date: "2026-07-28",
    },
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return NextResponse.json({
    success: true,
    message: `Purchase ${id} deleted successfully`,
  });
}

import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const purchases = [
    {
      id: "1",
      title: "Weekly Grocery",
      store: "DMart",
      paidBy: "Amit",
      amount: 2450,
      date: "2026-07-28",
    },
    {
      id: "2",
      title: "Vegetables",
      store: "Reliance Fresh",
      paidBy: "Rahul",
      amount: 890,
      date: "2026-07-27",
    },
  ];

  return NextResponse.json({ success: true, purchases });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newPurchase = {
      id: String(Date.now()),
      ...body,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, purchase: newPurchase }, { status: 201 });
  } catch (error) {
    console.error("Error creating purchase:", error);
    return NextResponse.json({ success: false, message: "Invalid request body" }, { status: 400 });
  }
}

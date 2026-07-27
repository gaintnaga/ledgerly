/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Logout successful
 */

import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully"
  });

  response.cookies.set({
    name: "token",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires : new Date(0)
  })

  return response;
}

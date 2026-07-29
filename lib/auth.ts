import { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export interface AuthUser {
  id: string;
  email: string;
  role: string;
}

export async function getAuthUser(req: NextRequest): Promise<AuthUser | null> {
  // 1. Check HTTP-only cookie set during login
  let token = req.cookies.get("token")?.value;

  // 2. Fallback to Authorization: Bearer <token> header for Swagger UI / Postman / Mobile Apps
  if (!token) {
    const authHeader = req.headers.get("authorization");
    if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
      token = authHeader.substring(7).trim();
    }
  }

  if (!token) return null;

  try {
    const secretKey = process.env.JWT_SECRET || "ledgerly_super_secret_key_2026_change_me";
    const secret = new TextEncoder().encode(secretKey);
    const { payload } = await jwtVerify(token, secret);

    const userId = payload.id as string;
    if (!userId) return null;

    // Verify user exists and is active in DB
    const { prisma } = await import("@/lib/prisma");
    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, role: true, isActive: true },
    });

    if (!dbUser || !dbUser.isActive) {
      return null;
    }

    return {
      id: dbUser.id,
      email: dbUser.email,
      role: dbUser.role,
    };
  } catch (error) {
    console.error("JWT Auth Verification Error:", error);
    return null;
  }
}

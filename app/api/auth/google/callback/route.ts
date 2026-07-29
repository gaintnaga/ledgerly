import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";

import { PrismaClient, AuthProvider } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export async function GET(request: NextRequest) {
  try {
    const code = request.nextUrl.searchParams.get("code");

    if (!code) {
      return NextResponse.json(
        { sucess: false, message: "Authorization code missing" },
        { status: 400 }
      );
    }
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: "v2",
    });
    const { data } = await oauth2.userinfo.get();

    if (!data.email) {
      return NextResponse.json(
        { success: false, message: "Google email not found" },
        { status: 400 }
      );
    }

    let user = await prisma.user.findUnique({
      where: {
        email: data.email
      }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: data.name ?? "",
          email: data.email,
          password: "",
          provider: AuthProvider.GOOGLE,
          googleId: data.id ?? null,
          profileImage: data.picture ?? null
        }
      });
    } else if (!user.googleId) {
      user = await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          provider: AuthProvider.GOOGLE,
          googleId: data.id ?? null,
          profileImage: data.picture ?? null,
        },
      });
    }

    if (!user.isActive) {
      return NextResponse.redirect(new URL("/deactivated", request.url));
    }

    // Update lastLogin timestamp
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT({
      id: user.id,
      email: user.email,
      role: user.role,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1d")
      .sign(secret);
    const response = NextResponse.redirect(
      new URL("/dashboard", request.url)
    );

    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24
    });
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Google authentication failed" },
      {status :500}
    )
  }
}

import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { AUTH_API_URL, AUTH_COOKIE } from "@/lib/config";
import { http } from "@/lib/http";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    await http(`${AUTH_API_URL}/auth/register`, {
      method: "POST",
      json: body
    });

    const tokenResponse = await http<{ access_token: string }>(
      `${AUTH_API_URL}/auth/login`,
      {
        method: "POST",
        json: body
      }
    );

    const jar = await cookies();
    jar.set(AUTH_COOKIE, tokenResponse.access_token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Signup failed" },
      { status: 400 }
    );
  }
}

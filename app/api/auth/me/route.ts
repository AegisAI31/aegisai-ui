import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AUTH_API_URL, AUTH_COOKIE } from "@/lib/config";

export async function GET() {
  const jar = await cookies();
  const token = jar.get(AUTH_COOKIE)?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const res = await fetch(`${AUTH_API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await res.json();
  return NextResponse.json(user);
}

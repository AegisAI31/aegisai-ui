import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { AUTH_API_URL, AUTH_COOKIE } from "@/lib/config";

function getToken() {
  return cookies().then((jar) => jar.get(AUTH_COOKIE)?.value);
}

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET() {
  const token = await getToken();
  if (!token) return unauthorized();

  const res = await fetch(`${AUTH_API_URL}/api-keys`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const payload = await res.json();
  if (!res.ok) return NextResponse.json({ error: payload.detail }, { status: res.status });
  return NextResponse.json(payload);
}

export async function POST(request: NextRequest) {
  const token = await getToken();
  if (!token) return unauthorized();

  const body = await request.json();

  const res = await fetch(`${AUTH_API_URL}/api-keys`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name: body.name }),
  });

  const payload = await res.json();
  if (!res.ok) return NextResponse.json({ error: payload.detail }, { status: res.status });
  return NextResponse.json(payload, { status: 201 });
}

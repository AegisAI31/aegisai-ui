import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { AUTH_API_URL, AUTH_COOKIE } from "@/lib/config";
import { http } from "@/lib/http";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

async function getToken() {
  const jar = await cookies();
  return jar.get(AUTH_COOKIE)?.value;
}

export async function GET() {
  const token = await getToken();
  if (!token) return unauthorized();

  try {
    const keys = await http(`${AUTH_API_URL}/api-keys`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      cache: "no-store"
    });
    return NextResponse.json(keys);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch keys" },
      { status: 400 }
    );
  }
}

export async function POST(request: NextRequest) {
  const token = await getToken();
  if (!token) return unauthorized();

  try {
    const body = await request.json();
    const result = await http(`${AUTH_API_URL}/api-keys`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      json: body
    });
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create key" },
      { status: 400 }
    );
  }
}

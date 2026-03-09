import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { CORE_API_URL, AUTH_COOKIE } from "@/lib/config";

export async function POST(request: NextRequest) {
  const jar = await cookies();
  const token = jar.get(AUTH_COOKIE)?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const res = await fetch(`${CORE_API_URL}/trust/evaluate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const payload = await res.json();
  if (!res.ok) {
    return NextResponse.json(
      { error: payload.detail || "Evaluation failed" },
      { status: res.status }
    );
  }

  return NextResponse.json(payload);
}

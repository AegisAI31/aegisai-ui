import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { CONNECTORS_API_URL, AUTH_COOKIE } from "@/lib/config";

export async function POST(request: NextRequest) {
  const jar = await cookies();
  const token = jar.get(AUTH_COOKIE)?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const res = await fetch(`${CONNECTORS_API_URL}/api/prompts/extract-policy`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const payload = await res.json();
  if (!res.ok) return NextResponse.json({ error: payload.detail ?? "Extraction failed" }, { status: res.status });
  return NextResponse.json(payload);
}

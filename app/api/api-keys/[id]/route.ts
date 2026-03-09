import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { AUTH_API_URL, AUTH_COOKIE } from "@/lib/config";

async function getToken() {
  const jar = await cookies();
  return jar.get(AUTH_COOKIE)?.value;
}

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = await getToken();
  if (!token) return unauthorized();

  const { id } = await params;
  const body = await request.json();

  const res = await fetch(`${AUTH_API_URL}/api-keys/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name: body.name }),
  });

  const payload = await res.json();
  if (!res.ok) return NextResponse.json({ error: payload.detail }, { status: res.status });
  return NextResponse.json(payload);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = await getToken();
  if (!token) return unauthorized();

  const { id } = await params;

  const res = await fetch(`${AUTH_API_URL}/api-keys/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 204) return NextResponse.json({ ok: true });
  if (!res.ok) {
    const payload = await res.json().catch(() => ({}));
    return NextResponse.json({ error: payload.detail || "Not found" }, { status: res.status });
  }
  return NextResponse.json({ ok: true });
}

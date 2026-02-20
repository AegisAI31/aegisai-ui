import { NextResponse } from "next/server";
import pool, { initDB } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionUser();
  if (!session) return unauthorized();

  const { id } = await params;
  await initDB();
  const { name } = await request.json();

  const result = await pool.query(
    "UPDATE api_keys SET name = $1 WHERE id = $2 AND user_id = $3 RETURNING id, name, is_active, created_at",
    [name, id, session.sub]
  );

  if (result.rows.length === 0) {
    return NextResponse.json({ error: "Key not found" }, { status: 404 });
  }

  return NextResponse.json(result.rows[0]);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionUser();
  if (!session) return unauthorized();

  const { id } = await params;
  await initDB();

  const result = await pool.query(
    "UPDATE api_keys SET is_active = false WHERE id = $1 AND user_id = $2 RETURNING id",
    [id, session.sub]
  );

  if (result.rows.length === 0) {
    return NextResponse.json({ error: "Key not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}

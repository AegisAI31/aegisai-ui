import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import pool, { initDB } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET() {
  const session = await getSessionUser();
  if (!session) return unauthorized();

  await initDB();
  const result = await pool.query(
    "SELECT id, name, is_active, created_at, last_used_at, key_prefix FROM api_keys WHERE user_id = $1 ORDER BY created_at DESC",
    [session.sub]
  );

  return NextResponse.json(
    result.rows.map((row) => ({
      id: String(row.id),
      name: row.name,
      is_active: row.is_active,
      created_at: row.created_at,
      last_used_at: row.last_used_at,
      key_prefix: row.key_prefix,
    }))
  );
}

export async function POST(request: NextRequest) {
  const session = await getSessionUser();
  if (!session) return unauthorized();

  await initDB();
  const { name } = await request.json();

  const rawKey = `aegis_${crypto.randomBytes(32).toString("hex")}`;
  const keyHash = crypto.createHash("sha256").update(rawKey).digest("hex");
  const keyPrefix = rawKey.slice(0, 12) + "...";

  const result = await pool.query(
    "INSERT INTO api_keys (user_id, name, key_hash, key_prefix) VALUES ($1, $2, $3, $4) RETURNING id, name, is_active, created_at",
    [session.sub, name || null, keyHash, keyPrefix]
  );

  return NextResponse.json(
    {
      id: String(result.rows[0].id),
      name: result.rows[0].name,
      is_active: result.rows[0].is_active,
      created_at: result.rows[0].created_at,
      api_key: rawKey,
    },
    { status: 201 }
  );
}

import { NextResponse } from "next/server";
import { pool } from "@/data/sql";
import { requireSecretKey } from "@/lib/secret-key";

export const runtime = "nodejs";

export async function DELETE(req: Request) {
  try {
    const body: unknown = await req.json().catch(() => null);

    const authError = requireSecretKey(body);
    if (authError) return authError;

    const uuid =
      body && typeof body === "object" && body !== null
        ? (body as any).uuid
        : undefined;

    if (!uuid || typeof uuid !== "string") {
      return NextResponse.json({ error: "uuid is required" }, { status: 400 });
    }

    const [result] = await pool.execute(
      "DELETE FROM themes WHERE uuid = ?",
      [uuid]
    );

    const affectedRows =
      typeof (result as any)?.affectedRows === "number"
        ? (result as any).affectedRows
        : 0;

    if (affectedRows === 0) {
      return NextResponse.json({ error: "theme not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, uuid });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to delete theme" },
      { status: 500 }
    );
  }
}

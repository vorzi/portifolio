import { NextResponse } from "next/server";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function requireSecretKey(body: unknown) {
  const expected = process.env.SECRET_KEY;
  if (!expected) {
    return NextResponse.json(
      { error: "Server missing SECRET_KEY env var" },
      { status: 500 }
    );
  }

  const provided =
    isObject(body) && typeof body.secretKey === "string" ? body.secretKey : null;

  if (!provided) {
    return NextResponse.json(
      { error: "secretKey is required" },
      { status: 401 }
    );
  }

  if (provided !== expected) {
    return NextResponse.json({ error: "invalid secretKey" }, { status: 403 });
  }

  return null;
}


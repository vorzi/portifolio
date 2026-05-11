import { NextResponse } from "next/server";
import { pool } from "@/data/sql";
import type { Theme } from "@/types/themes";
import { requireSecretKey } from "@/lib/secret-key";

export const runtime = "nodejs";

type AddThemeBody =
  | {
      uuid?: string;
      theme?: Theme;
    }
  | Theme;

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export async function POST(req: Request) {
  try {
    const body: unknown = await req.json();

    const authError = requireSecretKey(body);
    if (authError) return authError;

    let theme: Theme | undefined;
    let uuid: string | undefined;

    if (isObject(body) && "settings" in body && "page" in body) {
      theme = body as unknown as Theme;
      uuid = theme.settings.uuid;
    } else if (isObject(body)) {
      const b = body as AddThemeBody & Record<string, unknown>;
      theme = (b.theme as Theme | undefined) ?? undefined;
      uuid = (b.uuid as string | undefined) ?? theme?.settings.uuid;
    }

    if (!uuid || typeof uuid !== "string") {
      return NextResponse.json({ error: "uuid is required" }, { status: 400 });
    }

    if (!theme) {
      return NextResponse.json({ error: "theme is required" }, { status: 400 });
    }

    const icon = theme.settings?.icon;
    if (!icon || typeof icon !== "string") {
      return NextResponse.json(
        { error: "theme.settings.icon is required" },
        { status: 400 }
      );
    }

    theme.settings.uuid = uuid;
    theme.settings.icon = icon;

    await pool.execute(
      "INSERT INTO themes (uuid, icon, settings, readme, page) VALUES (?, ?, ?, ?, ?)",
      [
        uuid,
        icon,
        JSON.stringify(theme.settings),
        theme.readme ? JSON.stringify(theme.readme) : null,
        JSON.stringify(theme.page),
      ]
    );

    return NextResponse.json({ ok: true, uuid }, { status: 201 });
  } catch (err: any) {
    if (err?.code === "ER_DUP_ENTRY") {
      return NextResponse.json(
        { error: "theme already exists" },
        { status: 409 }
      );
    }

    console.error(err);
    return NextResponse.json(
      {
        error: "Failed to add theme",
        code: err?.code ?? null,
        message: err?.message ?? String(err),
      },
      { status: 500 }
    );
  }
}

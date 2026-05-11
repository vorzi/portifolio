import { NextResponse } from "next/server";
import { pool } from "@/data/sql";
import type { Theme } from "@/types/themes";
import { requireSecretKey } from "@/lib/secret-key";

export const runtime = "nodejs";

type ChangeThemeBody = {
  uuid: string;
  theme: Theme;
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export async function POST(req: Request) {
  return changeTheme(req);
}

export async function PUT(req: Request) {
  return changeTheme(req);
}

async function changeTheme(req: Request) {
  try {
    const body: unknown = await req.json();

    if (!isObject(body)) {
      return NextResponse.json({ error: "invalid body" }, { status: 400 });
    }

    const authError = requireSecretKey(body);
    if (authError) return authError;

    const uuid = (body as any).uuid;
    const theme = (body as any).theme as Theme | undefined;

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
      `
      INSERT INTO themes (uuid, icon, settings, readme, page)
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        icon = VALUES(icon),
        settings = VALUES(settings),
        readme = VALUES(readme),
        page = VALUES(page)
      `,
      [
        uuid,
        icon,
        JSON.stringify(theme.settings),
        theme.readme ? JSON.stringify(theme.readme) : null,
        JSON.stringify(theme.page),
      ]
    );

    return NextResponse.json({ ok: true, uuid });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      {
        error: "Failed to change theme",
        code: (err as any)?.code ?? null,
        message: (err as any)?.message ?? String(err),
      },
      { status: 500 }
    );
  }
}

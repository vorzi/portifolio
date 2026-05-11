import { NextResponse } from "next/server";
import { pool } from "@/data/sql";
import type { Theme } from "@/types/themes";
import type { RowDataPacket } from "mysql2/promise";

export const runtime = "nodejs";

type ThemeRow = RowDataPacket & {
  uuid: string;
  icon: string;
  settings: unknown;
  readme: unknown;
  page: unknown;
};

function asJson<T>(value: unknown): T {
  if (typeof value === "string") return JSON.parse(value) as T;
  return value as T;
}

export async function GET() {
  try {
    const [rows] = await pool.query<ThemeRow[]>(
      "SELECT uuid, icon, settings, readme, page FROM themes ORDER BY updated_at DESC"
    );

    const themes: Theme[] = rows.map((r) => ({
      settings: {
        ...asJson<Partial<Theme["settings"]>>(r.settings),
        uuid: r.uuid,
        icon: r.icon,
      } as Theme["settings"],
      readme: r.readme ? asJson<NonNullable<Theme["readme"]>>(r.readme) : undefined,
      page: asJson<Theme["page"]>(r.page),
    }));

    return NextResponse.json(themes);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to load themes" },
      { status: 500 }
    );
  }
}

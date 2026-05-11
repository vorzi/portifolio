"use client";

import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import type { LanyardActivity, LanyardData } from "@/types/lanyard";

const inter = Inter({
  subsets: ["latin-ext"],
});

const STATUS_COLOR: Record<string, string> = {
  online: "#23a55a",
  idle: "#f0b232",
  dnd: "#f23f43",
  offline: "#80848e",
};

const STATUS_LABEL: Record<string, string> = {
  online: "Online",
  idle: "Ausente",
  dnd: "Não perturbe",
  offline: "Offline",
};

function avatarUrl(id: string, hash: string) {
  return `https://cdn.discordapp.com/avatars/${id}/${hash}.webp?size=128`;
}

function getTagIcon(id: string, imageId: string) {
  return `https://cdn.discordapp.com/clan-badges/${id}/${imageId}.png?size=16`;
}

function elapsed(start: number): string {
  const s = Math.floor((Date.now() - start) / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;

  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  }

  return `${m}:${String(sec).padStart(2, "0")}`;
}

function spotifyProgress(timestamps: { start: number; end: number }) {
  const total = timestamps.end - timestamps.start;
  const current = Date.now() - timestamps.start;

  return Math.min(100, Math.max(0, (current / total) * 100));
}

function activityImageUrl(
  activity: LanyardActivity,
  appIcons: Record<string, string>
): string | null {
  const img = activity.assets?.large_image;

  if (img && activity.application_id) {
    if (img.startsWith("mp:external/")) {
      return `https://media.discordapp.net/external/${img.replace(
        "mp:external/",
        ""
      )}`;
    }

    return `https://cdn.discordapp.com/app-assets/${activity.application_id}/${img}.png?size=160`;
  }

  return appIcons[activity.application_id ?? ""] ?? null;
}

const USER_ID = "1357773112296603799";

export default function Discord() {
  const [data, setData] = useState<LanyardData | null>(null);
  const [error, setError] = useState(false);
  const [, setTick] = useState(0);
  const [appIcons, setAppIcons] = useState<Record<string, string>>({});

  useEffect(() => {
    async function fetchLanyard() {
      try {
        const res = await fetch(
          `https://api.lanyard.rest/v1/users/${USER_ID}`
        );

        const json = await res.json();

        if (json.success) {
          setData(json.data);
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      }
    }

    fetchLanyard();

    const poll = setInterval(fetchLanyard, 30000);

    return () => clearInterval(poll);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setTick((n) => n + 1);
    }, 1000);

    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    async function loadIcons() {
      if (!data) return;

      const apps = data.activities.filter((a) => a.application_id);

      for (const app of apps) {
        const id = app.application_id!;

        if (appIcons[id]) continue;

        try {
          const res = await fetch(
            `https://discord.com/api/v10/applications/${id}/rpc`
          );

          if (!res.ok) continue;

          const json = await res.json();

          if (!json.icon) continue;

          setAppIcons((prev) => ({
            ...prev,
            [id]: `https://cdn.discordapp.com/app-icons/${id}/${json.icon}.png?size=160`,
          }));
        } catch {}
      }
    }

    loadIcons();
  }, [data, appIcons]);

  if (error) {
    return (
      <div className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white/40 text-sm text-center">
        Discord indisponível
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/10" />

          <div className="flex flex-col gap-1.5 flex-1">
            <div className="h-3 w-24 bg-white/10 rounded" />
            <div className="h-2.5 w-16 bg-white/5 rounded" />
          </div>
        </div>
      </div>
    );
  }

  const {
    discord_user,
    discord_status,
    activities,
    spotify,
    listening_to_spotify,
  } = data;

  const games = activities.filter(
    (a) => a.application_id && a.type === 0
  );

  const customStatus = activities.find((a) => a.type === 4);

  return (
    <div className="w-full rounded-xl bg-white/5 border border-white/10 overflow-hidden flex flex-col">
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="relative shrink-0">
          <div className="w-10 h-10 rounded-full overflow-hidden ring-1 ring-white/20">
            <img
              src={avatarUrl(discord_user.id, discord_user.avatar)}
              alt={discord_user.username}
              width={40}
              height={40}
              className="object-cover w-full h-full"
            />
          </div>

          <span
            className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-black/40"
            style={{
              backgroundColor: STATUS_COLOR[discord_status],
            }}
          />
        </div>

        <div className="flex flex-col min-w-0">
          <span className="text-white font-medium text-sm leading-tight truncate flex gap-2 items-center">
            {discord_user.display_name ?? discord_user.username}

            {discord_user.primary_guild?.identity_enabled && (
              <div
                className={`bg-[#2d2b2d] rounded-2xl px-2 py-0.5 text-xs text-white flex gap-1 items-center font-extrabold ${inter.className}`}
              >
                <img
                  src={getTagIcon(
                    discord_user.primary_guild.identity_guild_id,
                    discord_user.primary_guild.badge
                  )}
                  width={15}
                  height={15}
                  alt="Tag"
                />

                {discord_user.primary_guild.tag}
              </div>
            )}
          </span>

          <span className="text-white/50 text-xs leading-tight">
            {STATUS_LABEL[discord_status]}

            {customStatus?.state
              ? ` — ${customStatus.state}`
              : ""}
          </span>
        </div>
      </div>

      {listening_to_spotify && spotify && (
        <div className="mx-3 mb-3 rounded-lg bg-black/20 border border-white/5 p-3 flex gap-3">
          <div className="w-12 h-12 rounded-md overflow-hidden shrink-0">
            <img
              src={spotify.album_art_url}
              alt={spotify.album}
              className="object-cover w-full h-full"
            />
          </div>

          <div className="flex flex-col justify-between flex-1 min-w-0">
            <div className="flex flex-col min-w-0">
              <span className="text-white text-xs font-medium truncate leading-tight">
                {spotify.song}
              </span>

              <span className="text-white/50 text-xs truncate leading-tight">
                {spotify.artist}
              </span>
            </div>

            <div className="w-full h-0.5 rounded-full bg-white/10 mt-1.5 overflow-hidden">
              <div
                className="h-full rounded-full bg-[#1db954] transition-none"
                style={{
                  width: `${spotifyProgress(
                    spotify.timestamps
                  )}%`,
                }}
              />
            </div>
          </div>
        </div>
      )}

      {games.map((game, i) => (
        <div
          key={game.id + i}
          className="mx-3 mb-3 rounded-lg bg-black/20 border border-white/5 p-3 flex gap-3"
        >
          {activityImageUrl(game, appIcons) ? (
            <div className="w-12 h-12 rounded-md overflow-hidden shrink-0">
              <img
                src={activityImageUrl(game, appIcons)!}
                alt={game.name}
                className="object-cover w-full h-full"
              />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-md bg-white/5 flex items-center justify-center shrink-0">
              <span className="text-white/20 text-xs">?</span>
            </div>
          )}

          <div className="flex flex-col justify-center min-w-0">
            <span className="text-white/40 text-[10px] uppercase tracking-wider leading-tight mb-0.5">
              Jogando
            </span>

            <span className="text-white text-xs font-medium truncate leading-tight">
              {game.name}
            </span>

            {game.details && (
              <span className="text-white/50 text-xs truncate leading-tight">
                {game.details}
              </span>
            )}

            {game.state && (
              <span className="text-white/40 text-xs truncate leading-tight">
                {game.state}
              </span>
            )}

            {game.timestamps?.start && (
              <span className="text-white/30 text-[10px] leading-tight mt-0.5">
                {elapsed(game.timestamps.start)} decorrido
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

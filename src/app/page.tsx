"use client";

import LiquidGlass from "@/components/liquid-glass";
import { useEffect, useState, useRef } from "react";
import { redirect } from "next/navigation";
import { Theme } from "@/types/themes";
import Box from "@/components/box/box";
import Discord from "@/components/Discord";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import Image from "next/image";

export default function Home() {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [theme, setTheme] = useState<Theme | null>(null);
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [themesOpen, setThemesOpen] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const themesMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function loadTheme() {
      try {
        const storage = window.localStorage;

        const res = await fetch("/api/v1/getThemes");
        if (!res.ok) {
          setTheme(null);
          return;
        }

        const json: Theme[] = await res.json();
        setThemes(json);

        if (!json?.length) {
          setTheme(null);
          return;
        }

        let defaultTheme = storage.getItem("Theme_Default");
        if (
          !defaultTheme ||
          defaultTheme === "undefined" ||
          defaultTheme === "null"
        ) {
          defaultTheme = null;
          storage.removeItem("Theme_Default");
        }

        if (!defaultTheme) {
          defaultTheme = json[0]?.settings?.uuid ?? null;
          if (!defaultTheme) {
            setTheme(null);
            return;
          }
          storage.setItem("Theme_Default", defaultTheme);
        }

        let actualTheme = json.find((t) => t.settings.uuid === defaultTheme);

        if (!actualTheme) {
          actualTheme = json.find(t => t.settings.uuid === "Default Theme")!;
          storage.setItem("Theme_Default", actualTheme.settings.uuid);
        }

        setTheme(actualTheme);
      } catch (err) {
        console.error(err);
        setTheme(null);
      } finally {
        setLoading(false);
      }
    }

    loadTheme();
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setThemesOpen(false);
    }

    function onMouseDown(e: MouseEvent) {
      if (!themesMenuRef.current) return;
      if (!themesMenuRef.current.contains(e.target as Node)) {
        setThemesOpen(false);
      }
    }

    if (!themesOpen) return;

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("mousedown", onMouseDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("mousedown", onMouseDown);
    };
  }, [themesOpen]);

  const handleStart = () => {
    setStarted(true);

    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.5;
      audio.play().catch(() => {});
    }
  };

  const handleMove = (e: React.MouseEvent) => {
    const config = theme?.page.threeD;
    if (!config?.enabled || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const intensity = config.intensity ?? 15;
    const scale = config.scale ?? 1.05;

    const rotateX = (y / rect.height - 0.5) * -intensity;
    const rotateY = (x / rect.width - 0.5) * intensity;

    cardRef.current.style.transform = `
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      scale(${scale})
    `;
  };

  const reset3D = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
  };

  const handleSelectTheme = (nextTheme: Theme) => {
    window.localStorage.setItem("Theme_Default", nextTheme.settings.uuid);
    setThemesOpen(false);
    window.location.reload()
  };

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-black text-white">
        Loading...
      </div>
    );
  }

  if (!theme) {
    redirect('/errorcode?code=500&msg=Theme not founded')
  }

  const page = theme.page;
  const box = page.box;
  const threeD = page.threeD;

  const backgroundValue = page.background?.trim();
  const isColorBackground =
    Boolean(backgroundValue) &&
    (backgroundValue!.startsWith("#") ||
      backgroundValue!.startsWith("rgb(") ||
      backgroundValue!.startsWith("rgba(") ||
      backgroundValue!.startsWith("hsl(") ||
      backgroundValue!.startsWith("hsla("));
  const backgroundFit = page.backgroundFit ?? "cover";

  const normalizeMediaSrc = (value?: string) => {
    const raw = value?.trim();
    if (!raw) return undefined;
    const looksLikeAbsolute =
      raw.startsWith("/") ||
      raw.startsWith("./") ||
      raw.startsWith("../") ||
      raw.startsWith("http://") ||
      raw.startsWith("https://") ||
      raw.startsWith("data:") ||
      raw.startsWith("blob:");
    return looksLikeAbsolute ? raw : `/${raw}`;
  };

  const isVideoBackground = (() => {
    if (isColorBackground) return false;
    const raw = backgroundValue?.trim();
    if (!raw) return false;
    const lower = raw.toLowerCase();
    if (lower.startsWith("data:video/")) return true;
    const withoutQuery = lower.split(/[?#]/)[0];
    return withoutQuery.endsWith(".mp4") || withoutQuery.endsWith(".webm");
  })();

  const toCssBackgroundImage = (value?: string) => {
    const raw = value?.trim();
    if (!raw) return undefined;

    // Allow advanced CSS values (gradients, image-set, or already-wrapped url()).
    if (
      raw.startsWith("url(") ||
      raw.startsWith("image-set(") ||
      raw.includes("gradient(")
    ) {
      return raw;
    }

    // Treat as a URL/path. Prefix with "/" for public assets when user provides "bg.gif".
    const normalized = normalizeMediaSrc(raw) ?? raw;

    // Quote to support spaces and special chars (common in GIF URLs).
    const escaped = normalized.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
    return `url("${escaped}")`;
  };

  const componentMap: Record<string, React.ReactNode> = {
    discord: <Discord />,
  };

  return (
    <>
      <style>{`
        * {
          cursor: ${page.cursor ? `url(${page.cursor}) 16 16, auto` : "auto"} !important;
        }
      `}</style>

      {!started && (
        <div
          onClick={handleStart}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black cursor-pointer"
        >
          <span className="text-white text-2xl tracking-widest animate-pulse">
            Clique para entrar
          </span>
        </div>
      )}

      <div
        className="relative w-screen h-screen flex items-center justify-center overflow-hidden bg-cover bg-center"
        style={{
          backgroundColor: isColorBackground ? backgroundValue : undefined,
          backgroundImage:
            !isVideoBackground && !isColorBackground && backgroundValue
              ? toCssBackgroundImage(backgroundValue)
              : undefined,
          backgroundSize: !isColorBackground ? backgroundFit : undefined,
          backgroundRepeat: !isColorBackground ? "no-repeat" : undefined,
          pointerEvents: started ? "auto" : "none",
        }}
      >
        {isVideoBackground && (
          <video
            className="absolute inset-0 h-full w-full"
            style={{ objectFit: backgroundFit }}
            src={normalizeMediaSrc(backgroundValue)}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
          />
        )}

        {page.font && (
          <style>{`
            @font-face {
              font-family: 'ThemeFont';
              src: url('${page.font}');
            }
            body {
              font-family: 'ThemeFont', sans-serif;
            }
          `}</style>
        )}

        <div
          ref={themesMenuRef}
          className="absolute top-[35px] right-[40px] z-[9999]"
        >
          <LiquidGlass
            padding="10px"
            cornerRadius={12}
            displacementScale={40}
            blurAmount={0.05}
          >
            <button
              type="button"
              onClick={() => setThemesOpen((v) => !v)}
              className="w-6 h-6 flex items-center justify-center"
              aria-label="Abrir lista de temas"
            >
              <Image
                src="/menu.svg"
                alt="menu"
                width={24}
                height={24}
                priority
                className={page.menuWhite ? "img-reverse" : undefined}
                style={{ display: "block" }}
              />
            </button>
          </LiquidGlass>

          {themesOpen && (
            <div
  className="absolute right-full top-1/2 -translate-y-1/2 mr-1 max-w-[90vw]"
  style={{ width: `${themes.length * 70}px` }}
>
              <LiquidGlass
                padding="10px"
            cornerRadius={12}
            displacementScale={40}
            blurAmount={0.05}
              >
                <div>
                  <div className="max-h-[320px] overflow-auto rounded-xl">
                    <div className="flex-row gap-2 flex">
                      {themes.map((t) => {
                        const isActive = t.settings.uuid === theme.settings.uuid;

                        return (
                          <button
                            key={t.settings.uuid}
                            type="button"
                            onClick={() => handleSelectTheme(t)}
                            className={`w-6 h-6 rounded-full overflow-hidden ${
                              isActive ? "ring-2 ring-white/40" : ""
                            }`}
                            aria-label={`Selecionar tema ${t.settings.uuid}`}
                            disabled={isActive}
                          >
                            <img
                              src={t.settings.icon}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </button>
                        );
                      })}
                    </div>

                    {!themes.length && (
                      <div className="px-2 py-2 text-white/40 text-sm">
                        Nenhum tema.
                      </div>
                    )}
                  </div>
                </div>
              </LiquidGlass>
            </div>
          )}
        </div>
        <div style={{ perspective: threeD?.perspective ?? 1000 }}>
          <div
            ref={cardRef}
            onMouseMove={handleMove}
            onMouseLeave={reset3D}
            style={{
              transition: `transform ${threeD?.speed ?? 0.2}s ease`,
              transformStyle: "preserve-3d",
            }}
          >
            <Box
              fills={box?.fills}
              blurs={box?.blurs}
              shadows={box?.shadows}
              border={box?.border}
              opacity={box?.opacity}
              borderRadius={box?.borderRadius ?? 16}
              padding={box?.padding ?? "20px"}
              style={{
                width: "820px",
                maxWidth: "90vw",
                minHeight: "320px",
                display: "flex",
                flexDirection: "column",
                gap: "15px",
              }}
            >
              <div className="flex gap-4">
                {page.profile.icon && (
                  <div className="w-[140px] h-[140px] rounded-full ">
                    <img
                    src={page.profile.icon}
                  />
                  </div>
                )}

                <div className="flex-1">
                  <h1
                    style={{
                      color: page.profile.name.color ?? "#fff",
                      fontSize: "32px",
                    }}
                  >
                    {page.profile.name.content}
                  </h1>

                  <p
                    style={{
                      color: page.profile.biography.color ?? "rgba(255,255,255,0.7)",
                      marginTop: 10,
                    }}
                  >
                    {page.profile.biography.content}
                  </p>

                  {page.middle?.map((item, i) => {
                    if (item.type === "text") {
                      return <MarkdownRenderer key={i} content={item.content} />;
                    }

                    if (item.type === "component") {
                      return componentMap[item.name] ?? null;
                    }

                    return null;
                  })}
                </div>
              </div>

              <div className="h-[1px] bg-white/20" />

              <div className="flex justify-center gap-3">
                {page.end?.map((link, i) => (
                  <a key={i} href={link.href} target="_blank">
                    <img src={link.icon} className="w-9 h-9" />
                  </a>
                ))}
              </div>
            </Box>
          </div>
        </div>
      </div>

      <audio ref={audioRef} src={page.sound ?? undefined} loop />
    </>
  );
}

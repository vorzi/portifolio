import type { CSSProperties, ElementType, ReactNode } from "react"
import { cn } from "./utils"

export type BlurEffect = {
  type: "layer" | "background"
  radius: number
  enabled?: boolean
}

export type ShadowEffect = {
  x: number
  y: number
  blur: number
  spread: number
  color: string
  opacity: number
  inset?: boolean
  enabled?: boolean
}

export type FillEffect = {
  color: string
  alpha?: number
  enabled?: boolean
}

export type BorderEffect = {
  color: string
  width: number
  position?: "inside" | "outside" | "center"
  enabled?: boolean
}

export interface BoxProps {
  as?: ElementType
  children?: ReactNode
  className?: string
  style?: CSSProperties
  blurs?: BlurEffect[]
  shadows?: ShadowEffect[]
  fills?: FillEffect[]
  border?: BorderEffect
  opacity?: number
  blur?: number
  backdropBlur?: number
  shadow?: ShadowEffect
  fill?: string
  borderColor?: string
  borderWidth?: number
  borderPosition?: BorderEffect["position"]
  width?: string | number
  height?: string | number
  padding?: string | number
  borderRadius?: string | number
  onClick?: () => void
}

function hexToRgba(hex: string, opacity: number): string {
  const clean = hex.replace("#", "")
  const full = clean.length === 3 ? clean.split("").map(c => c + c).join("") : clean
  const r = parseInt(full.slice(0, 2), 16)
  const g = parseInt(full.slice(2, 4), 16)
  const b = parseInt(full.slice(4, 6), 16)
  return `rgba(${r},${g},${b},${(opacity / 100).toFixed(2)})`
}

function resolveColor(color: string, alpha = 1): string {
  if (color.startsWith("rgba") || color.startsWith("rgb")) return color
  if (color.startsWith("#")) {
    const clean = color.replace("#", "")
    const full = clean.length === 3 ? clean.split("").map(c => c + c).join("") : clean
    const r = parseInt(full.slice(0, 2), 16)
    const g = parseInt(full.slice(2, 4), 16)
    const b = parseInt(full.slice(4, 6), 16)
    return `rgba(${r},${g},${b},${alpha})`
  }
  return color
}

function buildFilter(blurs: BlurEffect[]): string {
  const active = blurs.filter(b => b.enabled !== false && b.type === "layer")
  if (!active.length) return ""
  return active.map(b => `blur(${b.radius}px)`).join(" ")
}

function buildBackdropFilter(blurs: BlurEffect[]): string {
  const active = blurs.filter(b => b.enabled !== false && b.type === "background")
  if (!active.length) return ""
  return active.map(b => `blur(${b.radius}px)`).join(" ")
}

function buildBoxShadow(shadows: ShadowEffect[], border?: BorderEffect): string {
  const parts: string[] = []

  shadows
    .filter(s => s.enabled !== false)
    .forEach(s => {
      const color = s.color.startsWith("#") ? hexToRgba(s.color, s.opacity) : s.color
      parts.push(`${s.inset ? "inset " : ""}${s.x}px ${s.y}px ${s.blur}px ${s.spread}px ${color}`)
    })

  if (border && border.enabled !== false) {
    const { color, width, position = "inside" } = border
    if (position === "inside") {
      parts.push(`inset 0 0 0 ${width}px ${color}`)
    } else if (position === "outside") {
      parts.push(`0 0 0 ${width}px ${color}`)
    } else {
      parts.push(`inset 0 0 0 ${width / 2}px ${color}`)
      parts.push(`0 0 0 ${width / 2}px ${color}`)
    }
  }

  return parts.join(", ")
}

function buildBackground(fills: FillEffect[]): string {
  const active = fills.filter(f => f.enabled !== false)
  if (!active.length) return ""
  return active.map(f => resolveColor(f.color, f.alpha ?? 1)).reverse().join(", ")
}

function normalizeDimension(val?: string | number): string | undefined {
  if (val === undefined) return undefined
  return typeof val === "number" ? `${val}px` : val
}

export function Box({
  as: Tag = "div",
  children,
  className,
  style,
  blurs: blursProp = [],
  shadows: shadowsProp = [],
  fills: fillsProp = [],
  border: borderProp,
  opacity,
  blur,
  backdropBlur,
  shadow,
  fill,
  borderColor,
  borderWidth = 1,
  borderPosition = "inside",
  width,
  height,
  padding,
  borderRadius,
  onClick,
}: BoxProps) {
  const allBlurs: BlurEffect[] = [
    ...blursProp,
    ...(blur !== undefined ? [{ type: "layer" as const, radius: blur }] : []),
    ...(backdropBlur !== undefined ? [{ type: "background" as const, radius: backdropBlur }] : []),
  ]

  const allShadows: ShadowEffect[] = [
    ...shadowsProp,
    ...(shadow ? [shadow] : []),
  ]

  const allFills: FillEffect[] = [
    ...fillsProp,
    ...(fill ? [{ color: fill }] : []),
  ]

  const resolvedBorder: BorderEffect | undefined = borderProp ?? (
    borderColor ? { color: borderColor, width: borderWidth, position: borderPosition } : undefined
  )

  const filter = buildFilter(allBlurs)
  const backdropFilter = buildBackdropFilter(allBlurs)
  const boxShadow = buildBoxShadow(allShadows, resolvedBorder)
  const background = buildBackground(allFills)

  const computedStyle: CSSProperties = {
    ...(filter ? { filter } : {}),
    ...(backdropFilter ? { backdropFilter, WebkitBackdropFilter: backdropFilter } : {}),
    ...(boxShadow ? { boxShadow } : {}),
    ...(background ? { background } : {}),
    ...(opacity !== undefined ? { opacity: opacity / 100 } : {}),
    ...(width !== undefined ? { width: normalizeDimension(width) } : {}),
    ...(height !== undefined ? { height: normalizeDimension(height) } : {}),
    ...(padding !== undefined ? { padding: normalizeDimension(padding) } : {}),
    ...(borderRadius !== undefined ? { borderRadius: normalizeDimension(borderRadius) } : {}),
    ...style,
  }

  return (
    <Tag className={cn("box", className)} style={computedStyle} onClick={onClick}>
      {children}
    </Tag>
  )
}

export default Box
interface ThemeSettings {
  uuid: string;
  icon: string;
}

type NameEffect = "pixels" | "glitch" | "wave" | "shake" | "rainbow" | "none";

interface ThemeProfileName {
  content: string;
  color?: string;
  effect?: NameEffect;
}

interface ThemeProfileBiography {
  content: string;
  color?: string;
}

interface ThemePageProfile {
  icon: string;
  name: ThemeProfileName;
  biography: ThemeProfileBiography;
}

type ThemePageMiddle =
  | { type: "text"; content: string }
  | { type: "component"; name: "discord" };

interface ThemePageEnd {
  icon: string;
  href: string;
}

interface BlurEffect {
  type: "layer" | "background";
  radius: number;
  enabled?: boolean;
}

interface ShadowEffect {
  x: number;
  y: number;
  blur: number;
  spread: number;
  color: string;
  opacity: number;
  inset?: boolean;
  enabled?: boolean;
}

interface FillEffect {
  color: string;
  alpha?: number;
  enabled?: boolean;
}

interface BorderEffect {
  color: string;
  width: number;
  position?: "inside" | "outside" | "center";
  enabled?: boolean;
}

interface ThemePageBox {
  fills?: FillEffect[];
  blurs?: BlurEffect[];
  shadows?: ShadowEffect[];
  border?: BorderEffect;
  opacity?: number;
  borderRadius?: string | number;
  padding?: string | number;
}

interface Theme3D {
  enabled: boolean;
  intensity?: number;
  scale?: number;
  perspective?: number;
  speed?: number;
}

interface ThemePage {
  cursor: string | null;
  sound: string | null;
  background: string;
  backgroundFit?: "cover" | "contain";
  font: string | null;
  menuWhite: boolean;
  threeD?: Theme3D;
  profile: ThemePageProfile;
  box?: ThemePageBox;
  middle: ThemePageMiddle[];
  end: ThemePageEnd[];
}

export interface Theme {
  settings: ThemeSettings;
  readme?: Record<string, string>;
  page: ThemePage;
}

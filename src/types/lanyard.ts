export interface LanyardNameplate {
  asset: string;
  expires_at: number | null;
  label: string;
  palette: string;
  sku_id: string;
}

export interface LanyardCollectibles {
  nameplate?: LanyardNameplate;
}

export interface LanyardDisplayNameStyles {
  colors?: number[];
  effect_id?: number;
  font_id?: number;
}

export interface LanyardPrimaryGuild {
  badge: string;
  identity_enabled: boolean;
  identity_guild_id: string;
  tag: string;
}

export interface LanyardDiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar: string;
  display_name?: string;
  global_name?: string;
  avatar_decoration_data?: unknown;
  collectibles?: LanyardCollectibles;
  display_name_styles?: LanyardDisplayNameStyles;
  primary_guild?: LanyardPrimaryGuild;
  bot?: boolean;
  public_flags?: number;
}

export interface LanyardEmoji {
  id: string;
  name: string;
  animated?: boolean;
}

export interface LanyardActivity {
  id: string;
  name: string;
  type: number;
  state?: string;
  details?: string;
  emoji?: LanyardEmoji;
  timestamps?: {
    start?: number;
    end?: number;
  };
  created_at?: number;
  session_id?: string;
  application_id?: string;
  assets?: {
    large_image?: string;
    large_text?: string;
    small_image?: string;
    small_text?: string;
  };
}

export interface LanyardSpotify {
  song: string;
  artist: string;
  album: string;
  album_art_url: string;
  track_id: string;
  timestamps: {
    start: number;
    end: number;
  };
}

export interface LanyardData {
  discord_user: LanyardDiscordUser;
  discord_status: "online" | "idle" | "dnd" | "offline";
  activities: LanyardActivity[];
  spotify: LanyardSpotify | null;
  listening_to_spotify: boolean;
  active_on_discord_web: boolean;
  active_on_discord_desktop: boolean;
  active_on_discord_mobile: boolean;
  active_on_discord_embedded: boolean;
  active_on_discord_vr: boolean;
  kv: Record<string, unknown>;
}


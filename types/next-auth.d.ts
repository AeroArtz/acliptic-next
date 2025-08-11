import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username?: string;
      phone_number?: string;
      youtube_channel_id?: string;
      presets?: Record<string, unknown>;
      onBoardingCompleted?: boolean;
      plugin_active?: boolean;
    } & DefaultSession["user"]
  }

  interface User {
    id: string;
    username?: string;
    phone_number?: string;
    youtube_channel_id?: string;
    presets?: Record<string, unknown>;
    onBoardingCompleted?: boolean;
    plugin_active?: boolean;
  }
}

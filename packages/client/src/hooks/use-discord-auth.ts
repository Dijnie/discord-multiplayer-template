import { create } from "zustand";
import { getDiscordSdk } from "@/lib/discord";
import type { CommandResponse } from "@discord/embedded-app-sdk";

type AuthResponse = CommandResponse<"authenticate">;

const TOKEN_KEY = "discord_access_token";

// Module-level promise to prevent concurrent init from React Strict Mode double-mount
let initPromise: Promise<void> | null = null;

interface DiscordAuthState {
  status: string;
  auth: AuthResponse | null;
  init: () => Promise<void>;
}

export const useDiscordAuth = create<DiscordAuthState>((set, get) => ({
  status: "Initializing...",
  auth: null,

  async init() {
    if (get().auth) return;
    if (initPromise) return initPromise;

    initPromise = (async () => {

    try {
      const discordSdk = getDiscordSdk();
      await discordSdk.ready();
      set({ status: "Authenticating..." });

      // Try cached token first
      const cachedToken = localStorage.getItem(TOKEN_KEY);
      if (cachedToken) {
        try {
          const result = await discordSdk.commands.authenticate({
            access_token: cachedToken,
          });
          if (!result) throw new Error("Authenticate command failed");
          set({ auth: result, status: "ready" });
          return;
        } catch {
          localStorage.removeItem(TOKEN_KEY);
        }
      }

      // Full flow: authorize → exchange → authenticate
      set({ status: "Authorizing..." });
      const { code } = await discordSdk.commands.authorize({
        client_id: process.env.NEXT_PUBLIC_CLIENT_ID!,
        response_type: "code",
        state: "",
        prompt: "none",
        scope: ["identify", "applications.commands"],
      });

      set({ status: "Exchanging token..." });
      const response = await fetch("/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      if (!response.ok) {
        throw new Error(`Token exchange failed: ${response.status}`);
      }
      const data = await response.json();

      localStorage.setItem(TOKEN_KEY, data.access_token);

      const result = await discordSdk.commands.authenticate({
        access_token: data.access_token,
      });
      if (!result) throw new Error("Authenticate command failed");
      set({ auth: result, status: "ready" });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : typeof err === "object" && err !== null
            ? JSON.stringify(err)
            : String(err);
      console.error(`Discord auth error: ${message}`);
      console.error("Full error object:", err);
      set({ status: `Auth failed: ${message}` });
    } finally {
      initPromise = null;
    }
    })();

    return initPromise;
  },
}));

/** Get authenticated username - usable outside React (e.g. Phaser scenes) */
export function getUserName(): string {
  return useDiscordAuth.getState().auth?.user.username ?? "User";
}

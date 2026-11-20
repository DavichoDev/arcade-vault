import type { AccentColor } from "@/lib/games";

export type ActivityRow = {
  player: string; // "NEONFOX"
  gameId: string; // id from GAMES: "drop", "muncher", ...
  score: number; // 184220
  ago: string; // "2 min ago"
  color: AccentColor; // neon-{color} class
};

export type TopPlayer = { rank: number; player: string; score: number };

// Static mock data for the Home page (no real-time activity yet).
export const ACTIVITY: ActivityRow[] = [
  { player: "NEONFOX", gameId: "drop", score: 184220, ago: "2 min ago", color: "magenta" },
  { player: "PX_KAI", gameId: "muncher", score: 96400, ago: "5 min ago", color: "yellow" },
  { player: "Z3R0COOL", gameId: "invaders", score: 54190, ago: "8 min ago", color: "green" },
  { player: "VAULT_07", gameId: "rocks", score: 41200, ago: "12 min ago", color: "cyan" },
  { player: "GLITCHA", gameId: "block-buster", score: 28450, ago: "18 min ago", color: "cyan" },
  { player: "ARKADYA", gameId: "serpent", score: 7820, ago: "24 min ago", color: "green" },
  { player: "CYBER_LU", gameId: "froggy", score: 18900, ago: "31 min ago", color: "yellow" },
];

export const TOP_PLAYERS: TopPlayer[] = [
  { rank: 1, player: "NEONFOX", score: 312840 },
  { rank: 2, player: "PX_KAI", score: 248110 },
  { rank: 3, player: "M00NRYU", score: 196720 },
  { rank: 4, player: "VAULT_07", score: 154300 },
  { rank: 5, player: "GLITCHA", score: 138900 },
];

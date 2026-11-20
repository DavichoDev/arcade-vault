export type Category = "ARCADE" | "PUZZLE" | "SHOOTER" | "VERSUS";
export type AccentColor = "cyan" | "magenta" | "yellow" | "green";

export type Game = {
  id: string; // URL slug, e.g. "block-buster"
  title: string; // uppercase
  short: string; // card description
  long: string; // detail description
  cat: Category;
  cover: string; // existing CSS class: "cover-bricks", "cover-tetro", ...
  color: AccentColor; // PLAY button color
  best: number;
  plays: string; // pre-formatted: "12.4K"
};

export type ScoreRow = {
  rank: number;
  name: string;
  score: number;
  date: string; // ISO "YYYY-MM-DD"; render with formatDate()
};

export type User = { name: string }; // localStorage["av_user"], null = guest

export const GAMES: Game[] = [
  {
    id: "block-buster",
    title: "BLOCK BUSTER",
    short: "Bounce the ball and smash neon walls.",
    long: "Pilot a paddle-ship and bounce a plasma core to pulverize walls of chromatic blocks. Every level rearranges the grid into impossible patterns. How far will your streak go?",
    cat: "ARCADE",
    cover: "cover-bricks",
    color: "cyan",
    best: 28450,
    plays: "12.4K",
  },
  {
    id: "drop",
    title: "DROP",
    short: "Lock the pieces in before the ceiling crushes you.",
    long: "Geometric pieces fall out of the darkness. Rotate them, slot them in and clear lines to survive. The speed climbs relentlessly every 10 lines.",
    cat: "PUZZLE",
    cover: "cover-tetro",
    color: "magenta",
    best: 184220,
    plays: "31.8K",
  },
  {
    id: "serpent",
    title: "SERPENT",
    short: "Grow without biting your own tail.",
    long: "A snake of light slithers across the grid hunting magenta cores. Every bite makes it longer and faster. One wrong move and it devours itself.",
    cat: "ARCADE",
    cover: "cover-snake",
    color: "green",
    best: 7820,
    plays: "9.1K",
  },
  {
    id: "muncher",
    title: "MUNCHER",
    short: "Gobble the dots and outrun the ghosts.",
    long: "A hungry circle patrols a maze collecting glowing dots. Four specters chase it, but every so often a power pill shows up and flips the roles.",
    cat: "ARCADE",
    cover: "cover-glot",
    color: "yellow",
    best: 96400,
    plays: "27.2K",
  },
  {
    id: "invaders",
    title: "INVADERS",
    short: "Defend the planet from rows of aliens.",
    long: "Waves of hostile pixels descend formation after formation. Slide your cannon sideways and fire with precision before they touch the surface.",
    cat: "SHOOTER",
    cover: "cover-invaders",
    color: "green",
    best: 54190,
    plays: "18.0K",
  },
  {
    id: "rocks",
    title: "ROCKS",
    short: "Pulverize asteroids in zero gravity.",
    long: "Your triangular ship drifts in absolute vacuum. Shoot and rotate to split rocks into ever smaller fragments. Watch out for UFOs on the horizon.",
    cat: "SHOOTER",
    cover: "cover-rocas",
    color: "yellow",
    best: 41200,
    plays: "15.6K",
  },
  {
    id: "froggy",
    title: "FROGGY",
    short: "Cross the pixel highway.",
    long: "Hop between lanes of speeding cars and logs drifting down the river. Reach the lily pads before time runs out.",
    cat: "ARCADE",
    cover: "cover-rana",
    color: "green",
    best: 18900,
    plays: "6.4K",
  },
  {
    id: "pixel-duel",
    title: "PIXEL DUEL",
    short: "Two paddles. One ball. Maximum reflexes.",
    long: "The purest duel: two vertical paddles fight over a glowing ball. Play solo against the CPU or a local two-player match.",
    cat: "VERSUS",
    cover: "cover-duelo",
    color: "cyan",
    best: 24,
    plays: "4.2K",
  },
];

export const CATS = ["ALL", "ARCADE", "PUZZLE", "SHOOTER", "VERSUS"] as const;

export function getGame(id: string): Game | undefined {
  return GAMES.find((g) => g.id === id);
}

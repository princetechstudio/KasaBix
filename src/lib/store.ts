export type Phase =
  | "attract"
  | "countdown"
  | "boot"
  | "playing"
  | "gameover"
  | "entry";

export type HighScore = { name: string; score: number; ts: number };

export const HALL_SIZE = 8;
const HS_KEY = "nw.hall";

const SEED: HighScore[] = [
  { name: "ACE", score: 50200, ts: 0 },
  { name: "MAV", score: 42100, ts: 0 },
  { name: "KIT", score: 33750, ts: 0 },
  { name: "ZAP", score: 21400, ts: 0 },
  { name: "REX", score: 12900, ts: 0 },
];

export function loadScores(): HighScore[] {
  try {
    const raw = localStorage.getItem(HS_KEY);
    if (!raw) return [...SEED];
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) return (parsed as HighScore[]).slice(0, HALL_SIZE);
    return [...SEED];
  } catch {
    return [...SEED];
  }
}

export function saveScores(list: HighScore[]) {
  try {
    localStorage.setItem(HS_KEY, JSON.stringify(list.slice(0, HALL_SIZE)));
  } catch {
    /* ignore */
  }
}

export function qualifies(list: HighScore[], score: number): boolean {
  if (score <= 0) return false;
  if (list.length < HALL_SIZE) return true;
  return score > list[list.length - 1].score;
}

export function insertScore(
  list: HighScore[],
  entry: HighScore
): { list: HighScore[]; index: number } {
  const next = [...list, entry]
    .sort((a, b) => b.score - a.score)
    .slice(0, HALL_SIZE);
  return { list: next, index: next.indexOf(entry) };
}

export function fmt(n: number): string {
  return Math.max(0, Math.floor(n)).toString().padStart(7, "0");
}

export function loadNumber(key: string, def = 0): number {
  try {
    const v = Number(localStorage.getItem(key));
    return Number.isFinite(v) && v >= 0 ? v : def;
  } catch {
    return def;
  }
}

export function saveNumber(key: string, v: number) {
  try {
    localStorage.setItem(key, String(v));
  } catch {
    /* ignore */
  }
}

import type { ScoreRow } from "@/lib/games";
import { formatDate, formatScore } from "@/lib/format";

export function Leaderboard({ rows }: { rows: ScoreRow[] }) {
  return (
    <div className="leaderboard">
      <h3>TOP SCORES</h3>
      {rows.map((r, i) => (
        <div
          key={r.name}
          className={
            "lb-row" + (i === 0 ? " top1" : i === 1 ? " top2" : i === 2 ? " top3" : "")
          }
        >
          <div className="rk">#{String(r.rank).padStart(2, "0")}</div>
          <div className="pl">
            {r.name}
            <div
              style={{ fontSize: 10, color: "var(--ink-faint)", letterSpacing: "0.1em" }}
            >
              {formatDate(r.date)}
            </div>
          </div>
          <div className="sc">{formatScore(r.score)}</div>
        </div>
      ))}
    </div>
  );
}

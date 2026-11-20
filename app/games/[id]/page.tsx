import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Leaderboard } from "@/components/leaderboard";
import { formatScore } from "@/lib/format";
import { GAMES, getGame } from "@/lib/games";
import { seededScores } from "@/lib/scores";

export function generateStaticParams() {
  return GAMES.map((g) => ({ id: g.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/games/[id]">): Promise<Metadata> {
  const { id } = await params;
  const game = getGame(id);
  if (!game) return { title: "Game not found" };
  return { title: game.title, description: game.short };
}

export default async function GameDetailPage({ params }: PageProps<"/games/[id]">) {
  const { id } = await params;
  const game = getGame(id);
  if (!game) notFound();

  const scores = seededScores(id.length * 17 + 3, 10);

  return (
    <main className="av-main">
      <div className="av-detail fade-in">
        <div>
          <div className="detail-cover">
            <div className={"cover-bg " + game.cover}></div>
          </div>
          <div style={{ marginTop: 20 }} className="detail-info">
            <div className="detail-tags">
              <span>{game.cat}</span>
              <span>1 PLAYER</span>
              <span>KEYBOARD / TOUCH</span>
              <span>RETRO 1985</span>
            </div>
            <h2 className="neon-cyan">{game.title}</h2>
            <p>{game.long}</p>
            <div className="stat-strip">
              <div>
                <div className="l">Plays</div>
                <div className="v">{game.plays}</div>
              </div>
              <div>
                <div className="l">Global best</div>
                <div
                  className="v"
                  style={{ color: "var(--magenta)", textShadow: "0 0 6px rgba(255,0,110,0.5)" }}
                >
                  {formatScore(game.best)}
                </div>
              </div>
              <div>
                <div className="l">Difficulty</div>
                <div
                  className="v"
                  style={{ color: "var(--yellow)", textShadow: "0 0 6px rgba(245,255,0,0.5)" }}
                >
                  ★ ★ ★ ☆ ☆
                </div>
              </div>
            </div>
            <div className="detail-actions">
              <Link href={`/games/${game.id}/play`} className="btn xl pulse">
                ▶ PLAY NOW
              </Link>
              <Link href="/games" className="btn ghost lg">
                BACK TO THE VAULT
              </Link>
            </div>
          </div>
        </div>

        <aside>
          <Leaderboard rows={scores} />
        </aside>
      </div>
    </main>
  );
}

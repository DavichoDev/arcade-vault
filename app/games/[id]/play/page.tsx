import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GamePlayer } from "@/components/game-player";
import { GAMES, getGame } from "@/lib/games";

export function generateStaticParams() {
  return GAMES.map((g) => ({ id: g.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/games/[id]/play">): Promise<Metadata> {
  const { id } = await params;
  const game = getGame(id);
  if (!game) return { title: "Game not found" };
  return { title: `Playing ${game.title}`, description: game.short };
}

export default async function PlayPage({ params }: PageProps<"/games/[id]/play">) {
  const { id } = await params;
  const game = getGame(id);
  if (!game) notFound();

  return (
    <main className="av-main">
      <GamePlayer id={game.id} title={game.title} />
    </main>
  );
}

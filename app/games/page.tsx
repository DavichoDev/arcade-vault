import type { Metadata } from "next";
import { Library } from "@/components/library";

export const metadata: Metadata = { title: "Library" };

export default function GamesPage() {
  return (
    <main className="av-main">
      <Library />
    </main>
  );
}

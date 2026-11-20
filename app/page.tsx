import type { Metadata } from "next";
import { Home } from "@/components/home";

export const metadata: Metadata = { title: { absolute: "Arcade Vault" } };

export default function HomePage() {
  return (
    <main className="av-main">
      <Home />
    </main>
  );
}

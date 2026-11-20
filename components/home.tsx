import Link from "next/link";
import { GAMES, getGame, type AccentColor } from "@/lib/games";
import { ACTIVITY, TOP_PLAYERS } from "@/lib/home";
import { formatScore } from "@/lib/format";
import { FeatureIcon, type FeatureIconKind } from "./feature-icon";
import { HomeSilhouettes } from "./home-silhouettes";
import { Reveal } from "./reveal";

const FEATURES: { icon: FeatureIconKind; title: string; desc: string; color: AccentColor }[] = [
  {
    icon: "GAMEPAD",
    title: "CLASSIC GAMES",
    desc: "Breakout, Tetris, Snake and many more. The best arcades of all time in one place.",
    color: "cyan",
  },
  {
    icon: "FREE",
    title: "100% FREE",
    desc: "No subscriptions, no hidden fees. Every game is available for free.",
    color: "yellow",
  },
  {
    icon: "TROPHY",
    title: "LADDER BOARDS",
    desc: "Compete with players from around the world. Climb the ranking and prove who is the best.",
    color: "magenta",
  },
  {
    icon: "ROCKET",
    title: "ALWAYS GROWING",
    desc: "We keep adding new games. Come back often, there is always something new to play.",
    color: "green",
  },
];

const STATS = [
  { n: "12+", unit: "GAMES", sub: "AND COUNTING" },
  { n: "1000s", unit: "OF PLAYS", sub: "EVERY SINGLE DAY" },
  { n: "GLOBAL", unit: "RANKING", sub: "COMPETE WITH THE WORLD" },
];

const PLAN_PERKS = [
  "Access to every game",
  "Global ranking and hall of fame",
  "No ads between games",
  "Save your scores",
  "New games every month",
  "Works in any browser",
];

const FAQ = [
  {
    q: "IS IT REALLY FREE?",
    a: 'Yes. Arcade Vault is a non-profit project made out of love for the classics. There is no hidden "premium" version.',
  },
  {
    q: "DO I NEED AN ACCOUNT?",
    a: "No. You can play as a guest. If you want to save your score and appear in the ranking, sign up in 10 seconds.",
  },
  {
    q: "HOW DO YOU SURVIVE WITHOUT CHARGING?",
    a: "It is a community project. If you like it, share it. That is the only currency we accept.",
  },
];

export function Home() {
  return (
    <div className="home fade-in">
      <Reveal />

      {/* HERO */}
      <section className="home-hero">
        <HomeSilhouettes />
        <div className="home-hero-inner">
          <div className="hero-eyebrow pixel neon-yellow">
            ▸ INSERT A COIN<span className="blink">_</span>
          </div>
          <h1 className="home-title">
            <span className="line-1">THE CLASSIC</span>
            <span className="line-2">ARCADE IS</span>
            <span className="line-3">BACK</span>
          </h1>
          <p className="home-sub">
            Play the best classics right in your browser.
            <br />
            No downloads. No cost. Just fun.
          </p>
          <div className="home-ctas">
            <Link href="/games" className="btn xl pulse">
              ▶ EXPLORE GAMES
            </Link>
            <Link href="/auth" className="btn xl magenta">
              ✦ CREATE ACCOUNT
            </Link>
          </div>
          <div className="hero-scroll" aria-hidden="true">
            <span>SCROLL</span>
            <span className="arrow">▼</span>
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="home-section reveal">
        <div className="section-head">
          <div className="kicker pixel neon-magenta">{"// 01"}</div>
          <h2 className="section-title">WHY ARCADE VAULT?</h2>
          <div className="section-rule"></div>
        </div>
        <div className="feature-grid">
          {FEATURES.map((f, i) => (
            <div
              key={f.icon}
              className={"feature-card " + f.color}
              style={{ transitionDelay: i * 80 + "ms" }}
            >
              <FeatureIcon kind={f.icon} />
              <div className="ft-title pixel">{f.title}</div>
              <div className="ft-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* GAMES PREVIEW */}
      <section className="home-section reveal">
        <div className="section-head">
          <div className="kicker pixel neon-cyan">{"// 02"}</div>
          <h2 className="section-title">GAMES AVAILABLE NOW</h2>
          <div className="section-rule"></div>
        </div>
        <div className="mini-rail">
          {GAMES.slice(0, 6).map((g) => (
            <Link key={g.id} href={`/games/${g.id}`} className="mini-card">
              <div className="mini-cover">
                <div className={"cover-bg " + g.cover}></div>
              </div>
              <div className="mini-meta">
                <div className="mini-title">{g.title}</div>
                <div className="mini-cat">{g.cat}</div>
              </div>
            </Link>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <Link href="/games" className="btn lg">
            VIEW ALL GAMES →
          </Link>
        </div>
      </section>

      {/* STATS */}
      <section className="home-stats reveal">
        <div className="stats-inner">
          {STATS.map((st, i) => (
            <div
              key={st.unit}
              className="stat-block"
              style={{ transitionDelay: i * 90 + "ms" }}
            >
              <div className="stat-n neon-yellow">{st.n}</div>
              <div className="stat-u pixel">{st.unit}</div>
              <div className="stat-s">{st.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* LIVE ACTIVITY */}
      <section className="home-section reveal">
        <div className="section-head">
          <div className="kicker pixel neon-yellow">{"// 03"}</div>
          <h2 className="section-title">LIVE ACTIVITY</h2>
          <div className="section-rule"></div>
        </div>
        <div className="activity-grid">
          <div className="activity-card">
            <div className="ac-head">
              <div className="ac-title pixel">▸ LATEST SCORES</div>
            </div>
            <div className="ticker">
              {ACTIVITY.map((r, i) => (
                <div
                  key={r.player}
                  className="tick-row"
                  style={{ animationDelay: i * 60 + "ms" }}
                >
                  <span className={"tk-p neon-" + r.color}>{r.player}</span>
                  <span className="tk-mid">▸ {getGame(r.gameId)?.title ?? r.gameId}</span>
                  <span className="tk-s">+{formatScore(r.score)}</span>
                  <span className="tk-t">{r.ago}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="activity-card">
            <div className="ac-head">
              <div className="ac-title pixel neon-magenta">▸ TOP PLAYERS · TODAY</div>
              <Link href="/hall-of-fame" className="lb-link">
                VIEW HALL →
              </Link>
            </div>
            <div className="top-list">
              {TOP_PLAYERS.map((r, i) => (
                <div
                  key={r.player}
                  className={
                    "top-row" + (i === 0 ? " top1" : i === 1 ? " top2" : i === 2 ? " top3" : "")
                  }
                >
                  <span className="tp-rk">#{String(r.rank).padStart(2, "0")}</span>
                  <span className="tp-bar">
                    <span className="tp-fill" style={{ width: 100 - i * 16 + "%" }}></span>
                  </span>
                  <span className="tp-p">{r.player}</span>
                  <span className="tp-s">{formatScore(r.score)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="home-section reveal">
        <div className="section-head">
          <div className="kicker pixel neon-green">{"// 04"}</div>
          <h2 className="section-title">PRICING</h2>
          <div className="section-rule"></div>
        </div>
        <div className="pricing-grid">
          <div className="price-card">
            <div className="pc-label pixel">SINGLE PLAN</div>
            <div className="pc-name pixel">VAULT PLAYER</div>
            <div className="pc-amount">
              <span className="pc-amount-n">$0</span>
              <span className="pc-amount-u">/ FOREVER</span>
            </div>
            <div className="pc-tag">NO TRICKS · NO FINE PRINT</div>
            <ul className="pc-list">
              {PLAN_PERKS.map((perk) => (
                <li key={perk}>✔ {perk}</li>
              ))}
            </ul>
            <Link href="/auth" className="btn xl pulse" style={{ width: "100%" }}>
              START FREE →
            </Link>
            <div className="pc-foot">We don&apos;t ask for a card. We never will.</div>
            <div className="pc-stamp pixel">
              FREE
              <br />
              PLAY
            </div>
          </div>

          <div className="pricing-faq">
            {FAQ.map((item) => (
              <div key={item.q} className="faq-item">
                <div className="faq-q pixel">{item.q}</div>
                <div className="faq-a">{item.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="home-final reveal">
        <h2 className="final-title pixel">READY TO PLAY?</h2>
        <Link href="/games" className="btn xl pulse final-cta">
          INSERT COIN →
        </Link>
        <div className="final-tag">Free. No sign-up required. Start in seconds.</div>
      </section>
    </div>
  );
}

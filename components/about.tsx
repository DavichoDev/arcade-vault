import { ContactForm } from "./contact-form";
import { HighlightIcon, type HighlightIconKind } from "./highlight-icon";
import { Reveal } from "./reveal";

const HIGHLIGHTS: { icon: HighlightIconKind; text: string; color: "magenta" | "cyan" | "green" }[] = [
  { icon: "HEART", text: "MADE WITH ❤️ FOR PLAYERS", color: "magenta" },
  { icon: "BROWSER", text: "HTML GAMES — RUN IN ANY BROWSER", color: "cyan" },
  { icon: "PLANT", text: "A PROJECT THAT KEEPS GROWING", color: "green" },
];

const TIPS: { label: string; led: string }[] = [
  { label: "REPLY WITHIN 24-48H", led: "" },
  { label: "SUGGESTIONS WELCOME", led: " y" },
  { label: "NO SPAM, EVER", led: " m" },
];

export function About() {
  return (
    <div className="about fade-in">
      <Reveal />

      {/* ABOUT */}
      <section className="about-hero">
        <div className="kicker pixel neon-yellow">▸ ABOUT</div>
        <h1 className="about-title">ABOUT ARCADE VAULT</h1>
        <p className="about-mission">
          ARCADE VAULT was born from a love of classic video games. Our mission is to preserve and
          celebrate the arcades that defined a generation, making them accessible to everyone,
          anywhere and at no cost.
        </p>

        <div className="highlight-row">
          {HIGHLIGHTS.map((h, i) => (
            <div key={h.icon} className={"highlight " + h.color} style={{ transitionDelay: i * 80 + "ms" }}>
              <HighlightIcon kind={h.icon} />
              <div className="hl-text pixel">{h.text}</div>
            </div>
          ))}
        </div>
      </section>

      {/* divider banner */}
      <div className="about-divider reveal" aria-hidden="true">
        <div className="div-bar" />
        <div className="div-pixels">
          {Array.from({ length: 24 }).map((_, i) => (
            <span key={i} style={{ animationDelay: i * 80 + "ms" }} />
          ))}
        </div>
        <div className="div-bar" />
      </div>

      {/* CONTACT */}
      <section className="about-contact reveal">
        <div className="contact-grid">
          <div className="contact-intro">
            <div className="kicker pixel neon-cyan">▸ CONTACT</div>
            <h2 className="contact-title">CONTACT US</h2>
            <p className="contact-sub">
              Got a suggestion, want to propose a game, or just want to say hi? Write to us.
            </p>
            <div className="contact-tips">
              {TIPS.map((t) => (
                <div key={t.label} className="tip">
                  <span className={"tip-led" + t.led} />
                  {t.label}
                </div>
              ))}
            </div>
          </div>

          <ContactForm />
        </div>
      </section>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

// Scroll cue for the hero: fades out once the user scrolls and, when clicked,
// smooth-scrolls to the section that follows the hero.
export function HeroScroll() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onScroll = () => setHidden(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollDown(e: React.MouseEvent<HTMLButtonElement>) {
    const hero = e.currentTarget.closest(".home-hero");
    const next = hero?.nextElementSibling;
    next?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <button
      type="button"
      className={"hero-scroll" + (hidden ? " hidden" : "")}
      onClick={scrollDown}
      aria-label="Scroll down"
      tabIndex={hidden ? -1 : 0}
    >
      <span>SCROLL</span>
      <span className="arrow" aria-hidden="true">▼</span>
    </button>
  );
}

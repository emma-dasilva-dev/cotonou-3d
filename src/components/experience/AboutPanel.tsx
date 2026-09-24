"use client";

import gsap from "gsap";
import { useLayoutEffect, useRef } from "react";
import { aboutText } from "./translations";
import type { Language } from "./translations";

type AboutPanelProps = {
  language: Language;
  onClose: () => void;
};

export function AboutPanel({ language, onClose }: AboutPanelProps) {
  const panelRef = useRef<HTMLElement>(null);
  const t = aboutText[language];

  useLayoutEffect(() => {
    if (!panelRef.current) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        panelRef.current,
        { opacity: 0, scale: 0.985, y: 24 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
        },
      );

      gsap.from("[data-about-reveal]", {
        y: 14,
        opacity: 0,
        duration: 0.55,
        stagger: 0.06,
        delay: 0.12,
        ease: "power2.out",
      });
    }, panelRef);

    return () => context.revert();
  }, []);

  return (
    <section
      ref={panelRef}
      className="about-panel"
      aria-label={t.aria}
    >
      <header className="about-panel__header" data-about-reveal>
        <div>
          <span>COTONOU / 3D</span>
          <span>{t.subtitle}</span>
        </div>

        <button
          type="button"
          className="about-panel__close"
          onClick={onClose}
          aria-label={t.close}
        >
          ×
        </button>
      </header>

      <div className="about-panel__hero" data-about-reveal>
        <span>{t.project}</span>
        <h2>{t.title}</h2>
        <p>{t.intro}</p>
      </div>

      <div className="about-panel__grid">
        <article data-about-reveal>
          <span>{t.observeLabel}</span>
          <h3>{t.observeTitle}</h3>
          <p>{t.observeBody}</p>
        </article>

        <article data-about-reveal>
          <span>{t.compareLabel}</span>
          <h3>{t.compareTitle}</h3>
          <p>{t.compareBody}</p>
        </article>

        <article data-about-reveal>
          <span>{t.understandLabel}</span>
          <h3>{t.understandTitle}</h3>
          <p>{t.understandBody}</p>
        </article>
      </div>

      <footer className="about-panel__footer" data-about-reveal>
        <span>{t.journey}</span>
        <strong>{t.placeYear}</strong>
      </footer>
    </section>
  );
}

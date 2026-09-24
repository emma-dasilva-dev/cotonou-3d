"use client";

import gsap from "gsap";
import { useLayoutEffect, useRef } from "react";

type AboutPanelProps = {
  onClose: () => void;
};

export function AboutPanel({ onClose }: AboutPanelProps) {
  const panelRef = useRef<HTMLElement>(null);

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
      aria-label="À propos de Cotonou 3D"
    >
      <header className="about-panel__header" data-about-reveal>
        <div>
          <span>COTONOU / 3D</span>
          <span>Étude interactive indépendante</span>
        </div>

        <button
          type="button"
          className="about-panel__close"
          onClick={onClose}
          aria-label="Fermer à propos"
        >
          ×
        </button>
      </header>

      <div className="about-panel__hero" data-about-reveal>
        <span>Le projet</span>
        <h2>Explorer Cotonou à travers ses lieux d’hospitalité.</h2>
        <p>
          COTONOU / 3D est une étude interactive de six hôtels de la ville.
          L’expérience observe comment architecture, paysage, eau, végétation,
          rues et mouvement donnent à chaque adresse une présence différente.
        </p>
      </div>

      <div className="about-panel__grid">
        <article data-about-reveal>
          <span>01 · Observer</span>
          <h3>Une ville, pas six objets isolés.</h3>
          <p>
            Les bâtiments prennent sens avec leurs routes, leurs jardins, leurs
            piscines, les passants, la circulation et les paysages qui les
            entourent.
          </p>
        </article>

        <article data-about-reveal>
          <span>02 · Comparer</span>
          <h3>Six façons d’habiter Cotonou.</h3>
          <p>
            Grand hôtel côtier, adresse urbaine, jardin-hôtel, bord de lac ou
            maison boutique : chaque étude met en évidence une relation
            différente entre hospitalité et ville.
          </p>
        </article>

        <article data-about-reveal>
          <span>03 · Comprendre</span>
          <h3>L’architecture comme récit.</h3>
          <p>
            Les articles ne se limitent pas aux services proposés. Ils donnent
            une lecture de la façade, du paysage et du rapport de chaque lieu à
            son environnement.
          </p>
        </article>
      </div>

      <footer className="about-panel__footer" data-about-reveal>
        <span>Observer → Explorer → Découvrir → Comprendre → Revenir</span>
        <strong>Cotonou · Bénin · 2026</strong>
      </footer>
    </section>
  );
}

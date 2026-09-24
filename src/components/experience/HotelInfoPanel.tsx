"use client";

import gsap from "gsap";
import { useLayoutEffect, useRef } from "react";
import type { HotelStudy } from "./hotels";

type HotelInfoPanelProps = {
  hotel: HotelStudy;
  onClose: () => void;
  delay?: number;
};

export function HotelInfoPanel({
  hotel,
  onClose,
  delay = 0,
}: HotelInfoPanelProps) {
  const panelRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (!panelRef.current) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        panelRef.current,
        { xPercent: 104 },
        {
          xPercent: 0,
          duration: 0.9,
          delay,
          ease: "power3.out",
        },
      );

      gsap.from("[data-panel-reveal]", {
        y: 18,
        opacity: 0,
        duration: 0.7,
        stagger: 0.06,
        delay: delay + 0.28,
        ease: "power2.out",
      });
    }, panelRef);

    return () => context.revert();
  }, [hotel.id, delay]);

  function closePanel() {
    if (!panelRef.current) {
      onClose();
      return;
    }

    gsap.to(panelRef.current, {
      xPercent: 104,
      duration: 0.6,
      ease: "power3.inOut",
      onComplete: onClose,
    });
  }



  return (
    <aside
      ref={panelRef}
      className="hotel-info-panel"
      aria-label={`À propos de ${hotel.name}`}
    >
      <header className="hotel-paper__header" data-panel-reveal>
        <div className="hotel-paper__kicker">
          <span>Cotonou / 3D</span>
          <span>Édition spéciale</span>
        </div>

        <div className="hotel-paper__masthead">
          <span>Le Journal de</span>
          <strong>Cotonou</strong>
        </div>

        <div className="hotel-paper__meta">
          <span>Architecture & hospitalité</span>
          <span>2026 · Bénin</span>
        </div>

        <button
          type="button"
          className="hotel-info-panel__close"
          onClick={closePanel}
          aria-label="Fermer les informations sur l'hôtel"
        >
          <span>Fermer</span>
          <span aria-hidden="true">×</span>
        </button>
      </header>

      <div className="hotel-paper__article">
        <div className="hotel-paper__headline" data-panel-reveal>
          <p>{hotel.descriptor}</p>
          <h2>{hotel.name}</h2>
          <span>{hotel.location}</span>
        </div>

        <div className="hotel-paper__rule" data-panel-reveal>
          <span>Chronique</span>
          <span>Une adresse de Cotonou</span>
        </div>

        <div className="hotel-paper__content" data-panel-reveal>
          <p className="hotel-paper__summary">{hotel.summary}</p>

          <section className="hotel-paper__facts" aria-label="En bref">
            <div className="hotel-paper__facts-title">
              <span>En bref</span>
              <span>—</span>
            </div>

            <dl>
              {hotel.facts.map((fact) => (
                <div key={fact.label}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>

        <div className="hotel-paper__analysis" data-panel-reveal>
          <section>
            <span>Lecture architecturale</span>
            <p>{hotel.architecturalReading}</p>
          </section>

          <section>
            <span>Rapport à la ville</span>
            <p>{hotel.cityRelationship}</p>
          </section>
        </div>
      </div>

      <footer className="hotel-paper__footer" data-panel-reveal>
        <div>
          <span>Étude visuelle indépendante</span>
          <span>Sources publiques · Cotonou / 3D</span>
        </div>

        <a href={hotel.website} target="_blank" rel="noreferrer">
          <span>Visiter le site officiel</span>
          <span aria-hidden="true">↗</span>
        </a>
      </footer>
    </aside>
  );
}

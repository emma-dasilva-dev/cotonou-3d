"use client";

import gsap from "gsap";
import { useLayoutEffect, useRef } from "react";
import { hotelStudies } from "./hotels";
import type { HotelStudy } from "./hotels";

type ArchivePanelProps = {
  onClose: () => void;
  onOpenHotel: (hotel: HotelStudy) => void;
};

export function ArchivePanel({
  onClose,
  onOpenHotel,
}: ArchivePanelProps) {
  const panelRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (!panelRef.current) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        panelRef.current,
        { opacity: 0, y: 30, scale: 0.985 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.75,
          ease: "power3.out",
        },
      );

      gsap.from("[data-archive-reveal]", {
        y: 16,
        opacity: 0,
        duration: 0.55,
        stagger: 0.055,
        delay: 0.15,
        ease: "power2.out",
      });
    }, panelRef);

    return () => context.revert();
  }, []);

  return (
    <section
      ref={panelRef}
      className="archives-panel"
      aria-label="Archives Cotonou 3D"
    >
      <header className="archives-panel__header" data-archive-reveal>
        <div>
          <span>COTONOU / 3D</span>
          <span>Collection 2026</span>
        </div>

        <div className="archives-panel__masthead">
          <small>La collection</small>
          <h2>Les Archives</h2>
        </div>

        <button
          type="button"
          className="archives-panel__close"
          onClick={onClose}
          aria-label="Fermer les archives"
        >
          ×
        </button>
      </header>

      <div className="archives-panel__status" data-archive-reveal>
        <span>Six lectures de Cotonou</span>
        <span>Comparez architecture, paysage et ville</span>
      </div>

      <div className="archives-grid">
        {hotelStudies.map((hotel) => (
          <article
            key={hotel.id}
            className="archive-card"
            data-archive-reveal
          >
            <div className="archive-card__topline">
              <span>Cotonou</span>
              <span>{hotel.descriptor}</span>
            </div>

            <div className="archive-card__body">
              <p>Architecture · Paysage · Ville</p>
              <h3>{hotel.name}</h3>
              <span>{hotel.location}</span>
            </div>

            <div className="archive-card__footer">
              <button type="button" onClick={() => onOpenHotel(hotel)}>
                <span>Ouvrir l’étude</span>
                <span aria-hidden="true">↗</span>
              </button>
            </div>
          </article>
        ))}
      </div>

      <footer className="archives-panel__footer" data-archive-reveal>
        <span>Une étude interactive de l’hospitalité à Cotonou</span>
        <strong>COTONOU / 3D — COLLECTION 2026</strong>
      </footer>
    </section>
  );
}

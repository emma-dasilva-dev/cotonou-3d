"use client";

import gsap from "gsap";
import { useLayoutEffect, useRef } from "react";
import { hotelStudies } from "./hotels";
import type { HotelStudy } from "./hotels";

type ArchivePanelProps = {
  discoveredIds: string[];
  onClose: () => void;
  onOpenHotel: (hotel: HotelStudy) => void;
};

export function ArchivePanel({
  discoveredIds,
  onClose,
  onOpenHotel,
}: ArchivePanelProps) {
  const panelRef = useRef<HTMLElement>(null);
  const discovered = new Set(discoveredIds);
  const complete = discoveredIds.length === hotelStudies.length;

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
        <span>{String(discoveredIds.length).padStart(2, "0")} / 06 découverts</span>
        <span>
          {complete
            ? "Édition complète débloquée"
            : "Explorez la ville pour compléter l’édition"}
        </span>
      </div>

      <div className="archives-grid">
        {hotelStudies.map((hotel) => {
          const isDiscovered = discovered.has(hotel.id);

          return (
            <article
              key={hotel.id}
              className={`archive-card${isDiscovered ? " archive-card--discovered" : ""}`}
              data-archive-reveal
            >
              <div className="archive-card__topline">
                <span>{hotel.index}</span>
                <span>{isDiscovered ? "Archivé" : "À découvrir"}</span>
              </div>

              <div className="archive-card__body">
                {isDiscovered ? (
                  <>
                    <p>{hotel.descriptor}</p>
                    <h3>{hotel.name}</h3>
                    <span>{hotel.location}</span>
                  </>
                ) : (
                  <>
                    <p>Étude verrouillée</p>
                    <h3>••••••••</h3>
                    <span>Explorez Cotonou</span>
                  </>
                )}
              </div>

              <div className="archive-card__footer">
                {isDiscovered ? (
                  <button type="button" onClick={() => onOpenHotel(hotel)}>
                    <span>Revoir l’étude</span>
                    <span aria-hidden="true">↗</span>
                  </button>
                ) : (
                  <span className="archive-card__lock">Non classé</span>
                )}
              </div>
            </article>
          );
        })}
      </div>

      <footer className="archives-panel__footer" data-archive-reveal>
        <span>Une publication interactive indépendante</span>
        <strong>
          {complete ? "COTONOU / 3D — ÉDITION COMPLÈTE" : "COTONOU / 3D — EN COURS"}
        </strong>
      </footer>
    </section>
  );
}

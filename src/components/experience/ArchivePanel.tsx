"use client";

import gsap from "gsap";
import { useLayoutEffect, useRef } from "react";
import { hotelStudies } from "./hotels";
import type { HotelStudy } from "./hotels";
import { archiveText, localizeHotel } from "./translations";
import type { Language } from "./translations";

type ArchivePanelProps = {
  language: Language;
  onClose: () => void;
  onOpenHotel: (hotel: HotelStudy) => void;
};

export function ArchivePanel({
  language,
  onClose,
  onOpenHotel,
}: ArchivePanelProps) {
  const panelRef = useRef<HTMLElement>(null);
  const t = archiveText[language];

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
      aria-label={t.aria}
    >
      <header className="archives-panel__header" data-archive-reveal>
        <div>
          <span>COTONOU / 3D</span>
          <span>{t.collection}</span>
        </div>

        <div className="archives-panel__masthead">
          <small>{t.theCollection}</small>
          <h2>{t.title}</h2>
        </div>

        <button
          type="button"
          className="archives-panel__close"
          onClick={onClose}
          aria-label={t.close}
        >
          ×
        </button>
      </header>

      <div className="archives-panel__status" data-archive-reveal>
        <span>{t.sixReadings}</span>
        <span>{t.compare}</span>
      </div>

      <div className="archives-grid">
        {hotelStudies.map((hotel) => {
          const displayHotel = localizeHotel(hotel, language);

          return (
          <article
            key={hotel.id}
            className="archive-card"
            data-archive-reveal
          >
            <div className="archive-card__topline">
              <span>Cotonou</span>
              <span>{displayHotel.descriptor}</span>
            </div>

            <div className="archive-card__body">
              <p>{t.theme}</p>
              <h3>{displayHotel.name}</h3>
              <span>{displayHotel.location}</span>
            </div>

            <div className="archive-card__footer">
              <button type="button" onClick={() => onOpenHotel(hotel)}>
                <span>{t.openStudy}</span>
                <span aria-hidden="true">↗</span>
              </button>
            </div>
          </article>
          );
        })}
      </div>

      <footer className="archives-panel__footer" data-archive-reveal>
        <span>{t.footer}</span>
        <strong>COTONOU / 3D — COLLECTION 2026</strong>
      </footer>
    </section>
  );
}

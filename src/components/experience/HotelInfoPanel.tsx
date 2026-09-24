"use client";

import gsap from "gsap";
import { useLayoutEffect, useRef } from "react";
import type { HotelStudy } from "./hotels";
import { panelText } from "./translations";
import type { Language } from "./translations";

type HotelInfoPanelProps = {
  hotel: HotelStudy;
  language: Language;
  onClose: () => void;
  delay?: number;
};

export function HotelInfoPanel({
  hotel,
  language,
  onClose,
  delay = 0,
}: HotelInfoPanelProps) {
  const panelRef = useRef<HTMLElement>(null);
  const t = panelText[language];

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
      aria-label={`${t.aboutHotel} ${hotel.name}`}
    >
      <header className="hotel-paper__header" data-panel-reveal>
        <div className="hotel-paper__kicker">
          <span>Cotonou / 3D</span>
          <span>{t.specialEdition}</span>
        </div>

        <div className="hotel-paper__masthead">
          <span>{t.journalPrefix}</span>
          <strong>Cotonou</strong>
        </div>

        <div className="hotel-paper__meta">
          <span>{t.architectureHospitality}</span>
          <span>{t.countryYear}</span>
        </div>

        <button
          type="button"
          className="hotel-info-panel__close"
          onClick={closePanel}
          aria-label={t.closeHotel}
        >
          <span>{t.close}</span>
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
          <span>{t.chronicle}</span>
          <span>{t.address}</span>
        </div>

        <div className="hotel-paper__content" data-panel-reveal>
          <p className="hotel-paper__summary">{hotel.summary}</p>

          <section className="hotel-paper__facts" aria-label={t.inBrief}>
            <div className="hotel-paper__facts-title">
              <span>{t.inBrief}</span>
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
            <span>{t.architecturalReading}</span>
            <p>{hotel.architecturalReading}</p>
          </section>

          <section>
            <span>{t.cityRelationship}</span>
            <p>{hotel.cityRelationship}</p>
          </section>
        </div>
      </div>

      <footer className="hotel-paper__footer" data-panel-reveal>
        <div>
          <span>{t.independentStudy}</span>
          <span>{t.publicSources}</span>
        </div>

        <a href={hotel.website} target="_blank" rel="noreferrer">
          <span>{t.officialSite}</span>
          <span aria-hidden="true">↗</span>
        </a>
      </footer>
    </aside>
  );
}

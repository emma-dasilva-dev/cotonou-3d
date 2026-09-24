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
        stagger: 0.07,
        delay: delay + 0.32,
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
      aria-label={`About ${hotel.name}`}
    >
      <div className="hotel-info-panel__top" data-panel-reveal>
        <span>{hotel.index} / 06</span>
        <button
          type="button"
          className="hotel-info-panel__close"
          onClick={closePanel}
          aria-label="Close hotel information"
        >
          <span>Close</span>
          <span aria-hidden="true">×</span>
        </button>
      </div>

      <div className="hotel-info-panel__body">
        <div data-panel-reveal>
          <p className="hotel-info-panel__eyebrow">Hospitality study</p>
          <h2>{hotel.name}</h2>
          <p className="hotel-info-panel__location">{hotel.location}</p>
        </div>

        <p className="hotel-info-panel__summary" data-panel-reveal>
          {hotel.summary}
        </p>

        <dl className="hotel-info-panel__facts" data-panel-reveal>
          {hotel.facts.map((fact) => (
            <div key={fact.label}>
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="hotel-info-panel__footer" data-panel-reveal>
        <a href={hotel.website} target="_blank" rel="noreferrer">
          <span>Official website</span>
          <span aria-hidden="true">↗</span>
        </a>

        <p>
          Independent visual study.
          <br />
          Information sourced from public hotel materials.
        </p>
      </div>
    </aside>
  );
}

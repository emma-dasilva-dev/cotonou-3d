"use client";

import gsap from "gsap";
import { useLayoutEffect, useRef } from "react";
import type { HotelStudy } from "./hotels";
import { localizeHotel, transitionText } from "./translations";
import type { Language } from "./translations";

type NewspaperTransitionProps = {
  hotel: HotelStudy;
  language: Language;
  mode: "open" | "close";
  onComplete: () => void;
};

export function NewspaperTransition({
  hotel,
  language,
  mode,
  onComplete,
}: NewspaperTransitionProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const displayHotel = localizeHotel(hotel, language);
  const t = transitionText[language];

  useLayoutEffect(() => {
    if (!rootRef.current) return;

    const context = gsap.context(() => {
      const strip = rootRef.current?.querySelector(
        ".newspaper-transition__strip",
      );
      const sheet = rootRef.current?.querySelector(
        ".newspaper-transition__sheet",
      );
      const lines = rootRef.current?.querySelectorAll(
        "[data-transition-line]",
      );

      const timeline = gsap.timeline({
        onComplete,
      });

      if (mode === "open") {
        timeline
          .set(rootRef.current, { opacity: 1 })
          .fromTo(
            strip,
            { scaleX: 0, transformOrigin: "left center" },
            {
              scaleX: 1,
              duration: 0.42,
              ease: "power4.inOut",
            },
          )
          .from(
            lines ?? [],
            {
              yPercent: 115,
              opacity: 0,
              duration: 0.4,
              stagger: 0.055,
              ease: "power3.out",
            },
            "-=0.16",
          )
          .fromTo(
            sheet,
            {
              scaleX: 0,
              transformOrigin: "right center",
            },
            {
              scaleX: 1,
              duration: 0.52,
              ease: "power4.inOut",
            },
            "-=0.12",
          )
          .to(
            strip,
            {
              scaleX: 0,
              transformOrigin: "right center",
              duration: 0.32,
              ease: "power3.inOut",
            },
            "-=0.08",
          )
          .to(
            rootRef.current,
            {
              opacity: 0,
              duration: 0.16,
              ease: "power2.out",
            },
            "-=0.04",
          );
      } else {
        timeline
          .set(rootRef.current, { opacity: 1 })
          .fromTo(
            sheet,
            {
              scaleX: 1,
              transformOrigin: "right center",
            },
            {
              scaleX: 0,
              duration: 0.42,
              ease: "power4.inOut",
            },
          )
          .fromTo(
            strip,
            {
              scaleX: 0,
              transformOrigin: "right center",
            },
            {
              scaleX: 1,
              duration: 0.32,
              ease: "power3.inOut",
            },
            "-=0.18",
          )
          .from(
            lines ?? [],
            {
              yPercent: -95,
              opacity: 0,
              duration: 0.26,
              stagger: 0.04,
              ease: "power2.out",
            },
            "-=0.12",
          )
          .to(strip, {
            scaleX: 0,
            transformOrigin: "left center",
            duration: 0.4,
            ease: "power4.inOut",
          })
          .to(
            rootRef.current,
            {
              opacity: 0,
              duration: 0.1,
            },
            "-=0.05",
          );
      }

      return () => timeline.kill();
    }, rootRef);

    return () => context.revert();
  }, [hotel.id, mode, onComplete]);

  return (
    <div
      ref={rootRef}
      className={`newspaper-transition newspaper-transition--${mode}`}
      aria-hidden="true"
    >
      <div className="newspaper-transition__shade" />

      <div className="newspaper-transition__strip">
        <div className="newspaper-transition__strip-inner">
          <span data-transition-line>COTONOU / 3D</span>
          <strong data-transition-line>{displayHotel.name}</strong>
          <span data-transition-line>{displayHotel.descriptor}</span>
        </div>
      </div>

      <div className="newspaper-transition__sheet">
        <div>
          <span>{t.journal}</span>
          <strong>{hotel.name}</strong>
          <small>{displayHotel.location}</small>
        </div>
      </div>
    </div>
  );
}

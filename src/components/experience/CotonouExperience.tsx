"use client";

import { Canvas } from "@react-three/fiber";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { CotonouScene } from "./CotonouScene";
import type { HotelStudy } from "./hotels";

export function CotonouExperience() {
  const introRef = useRef<HTMLDivElement>(null);
  const interfaceRef = useRef<HTMLDivElement>(null);
  const [entered, setEntered] = useState(false);
  const [activeHotel, setActiveHotel] = useState<HotelStudy | null>(null);
  const [focusHotelId, setFocusHotelId] = useState<string | undefined>();

  useEffect(() => {
    if (!introRef.current) return;

    const context = gsap.context(() => {
      gsap.from("[data-intro-line]", {
        y: 24,
        opacity: 0,
        duration: 1.05,
        stagger: 0.11,
        ease: "power3.out",
        delay: 0.25,
      });
    }, introRef);

    return () => context.revert();
  }, []);

  function enterExperience() {
    if (!introRef.current) return;

    gsap.to(introRef.current, {
      opacity: 0,
      duration: 0.8,
      ease: "power2.inOut",
      onComplete: () => setEntered(true),
    });

    if (interfaceRef.current) {
      gsap.fromTo(
        interfaceRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1.1, delay: 0.55, ease: "power2.out" },
      );
    }
  }

  function selectHotel(hotel: HotelStudy) {
    setActiveHotel(hotel);

    if (hotel.id === "hotel-du-lac") {
      setFocusHotelId(hotel.id);
      return;
    }

    setFocusHotelId(undefined);
  }

  function returnToCotonou() {
    setFocusHotelId(undefined);
    setActiveHotel(null);
  }

  const inHotelStudy = focusHotelId === "hotel-du-lac";

  return (
    <main className={`experience${entered ? " experience--entered" : ""}`}>
      <div className="scene-layer" aria-hidden={!entered}>
        <Canvas
          shadows
          dpr={[1, 1.5]}
          camera={{ position: [10.5, 9.5, 13.5], fov: 34 }}
          gl={{ antialias: true, alpha: false }}
        >
          <CotonouScene
            activeHotelId={activeHotel?.id}
            focusHotelId={focusHotelId}
            onSelectHotel={selectHotel}
          />
        </Canvas>
      </div>

      {!entered && (
        <div ref={introRef} className="intro">
          <div className="intro__topline" data-intro-line>
            <span>Independent interactive study</span>
            <span>Cotonou · Benin</span>
          </div>

          <div className="intro__main">
            <p className="eyebrow" data-intro-line>
              Six spaces. One city.
            </p>
            <h1 data-intro-line>
              COTONOU
              <span>/ 3D</span>
            </h1>
            <p className="intro__description" data-intro-line>
              A real-time architectural study of six hospitality spaces across
              Cotonou.
            </p>
            <button
              type="button"
              className="enter-button"
              data-intro-line
              onClick={enterExperience}
            >
              <span>Enter</span>
              <span aria-hidden="true">↗</span>
            </button>
          </div>

          <div className="intro__footer" data-intro-line>
            <span>WebGL / 2026</span>
            <span>Drag · Zoom · Explore</span>
          </div>
        </div>
      )}

      <div
        ref={interfaceRef}
        className={`interface${entered ? " interface--visible" : ""}${inHotelStudy ? " interface--study" : ""}`}
      >
        <header className="interface__header">
          <div className="brand">
            COTONOU <span>/ 3D</span>
          </div>
          <nav aria-label="Experience controls">
            <button type="button">About</button>
            <button type="button">Sound ○</button>
            <button type="button">FR</button>
          </nav>
        </header>

        {!inHotelStudy && (
          <>
            <div className="study-label">
              <span>01 — 06</span>
              <span>Architectural studies</span>
            </div>

            <div className="interaction-hint">
              <span className="interaction-hint__line" />
              <span>Drag to explore · Scroll to zoom</span>
            </div>

            <div className="coordinates">
              <span>06°21&apos;N</span>
              <span>Cotonou, Benin</span>
            </div>

            <div className="counter">
              <span>{activeHotel?.index ?? "—"}</span>
              <span>/ 06</span>
            </div>
          </>
        )}

        {inHotelStudy && (
          <>
            <div className="hotel-study-heading">
              <span>04 / 06</span>
              <h2>Hôtel du Lac</h2>
              <p>Exterior study · Lake Nokoué</p>
            </div>

            <button
              type="button"
              className="back-to-city"
              onClick={returnToCotonou}
            >
              <span aria-hidden="true">←</span>
              <span>Back to Cotonou</span>
            </button>

            <div className="study-interaction">
              <span className="interaction-hint__line" />
              <span>Drag to orbit · Scroll to zoom</span>
            </div>

            <div className="study-note">
              <span>Independent study</span>
              <span>Stylized from public exterior references</span>
            </div>
          </>
        )}

        {activeHotel && !inHotelStudy && (
          <aside className="hotel-selection" aria-live="polite">
            <span>{activeHotel.index} / 06</span>
            <h2>{activeHotel.name}</h2>
            <p>{activeHotel.descriptor}</p>
            <button type="button" disabled>
              Study not built yet
            </button>
          </aside>
        )}
      </div>
    </main>
  );
}

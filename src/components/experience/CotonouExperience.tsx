"use client";

import { Canvas } from "@react-three/fiber";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { CotonouScene } from "./CotonouScene";
import { HotelInfoPanel } from "./HotelInfoPanel";
import type { HotelStudy } from "./hotels";

export function CotonouExperience() {
  const introRef = useRef<HTMLDivElement>(null);
  const interfaceRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [entered, setEntered] = useState(false);
  const [activeHotel, setActiveHotel] = useState<HotelStudy | null>(null);
  const [focusHotelId, setFocusHotelId] = useState<string | undefined>();
  const [panelOpen, setPanelOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(true);

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

    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.32;
      audio.muted = !soundOn;
      void audio.play().catch(() => {
        setSoundOn(false);
      });
    }

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
    setPanelOpen(true);

    if (hotel.exteriorReady) {
      setFocusHotelId(hotel.id);
      return;
    }

    setFocusHotelId(undefined);
  }

  function returnToCotonou() {
    setPanelOpen(false);
    setFocusHotelId(undefined);
    setActiveHotel(null);
  }

  function toggleSound() {
    const audio = audioRef.current;
    const nextSoundOn = !soundOn;

    setSoundOn(nextSoundOn);

    if (!audio) return;

    audio.muted = !nextSoundOn;

    if (nextSoundOn && audio.paused) {
      void audio.play().catch(() => {
        setSoundOn(false);
      });
    }
  }

  const inHotelStudy = focusHotelId === "hotel-du-lac";

  return (
    <main className={`experience${entered ? " experience--entered" : ""}`}>
      <audio
        ref={audioRef}
        src="/audio/cotonou-ambient.mp3"
        loop
        preload="auto"
        playsInline
      />
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
            <span>Étude interactive indépendante</span>
            <span>Cotonou · Bénin</span>
          </div>

          <div className="intro__main">
            <p className="eyebrow" data-intro-line>
              Six lieux. Une ville.
            </p>
            <h1 data-intro-line>
              COTONOU
              <span>/ 3D</span>
            </h1>
            <p className="intro__description" data-intro-line>
              Une étude architecturale en temps réel de six espaces hôteliers à
              Cotonou.
            </p>
            <button
              type="button"
              className="enter-button"
              data-intro-line
              onClick={enterExperience}
            >
              <span>Entrer</span>
              <span aria-hidden="true">↗</span>
            </button>
          </div>

          <div className="intro__footer" data-intro-line>
            <span>WebGL / 2026</span>
            <span>Glisser · Zoomer · Explorer</span>
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
          <nav aria-label="Contrôles de l'expérience">
            <button type="button">À propos</button>
            <button
              type="button"
              onClick={toggleSound}
              aria-pressed={soundOn}
              aria-label={soundOn ? "Couper le son" : "Activer le son"}
            >
              Son {soundOn ? "●" : "○"}
            </button>
          </nav>
        </header>

        {!inHotelStudy && (
          <>
            <div className="study-label">
              <span>01 — 06</span>
              <span>Études architecturales</span>
            </div>

            <div className="interaction-hint">
              <span className="interaction-hint__line" />
              <span>Glisser pour explorer · Faire défiler pour zoomer</span>
            </div>

            <div className="coordinates">
              <span>06°21&apos;N</span>
              <span>Cotonou, Bénin</span>
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
              <p>Étude extérieure · Lac Nokoué</p>
            </div>

            <button
              type="button"
              className="back-to-city"
              onClick={returnToCotonou}
            >
              <span aria-hidden="true">←</span>
              <span>Retour à Cotonou</span>
            </button>

            <div className="study-interaction">
              <span className="interaction-hint__line" />
              <span>Glisser pour tourner · Faire défiler pour zoomer</span>
            </div>

            <div className="study-note">
              <span>Étude indépendante</span>
              <span>Interprétation stylisée à partir de références publiques</span>
            </div>
          </>
        )}

        {activeHotel && panelOpen && (
          <HotelInfoPanel
            key={activeHotel.id}
            hotel={activeHotel}
            delay={activeHotel.exteriorReady ? 0.45 : 0}
            onClose={() => setPanelOpen(false)}
          />
        )}
      </div>
    </main>
  );
}

"use client";

import { Canvas } from "@react-three/fiber";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { ArchivePanel } from "./ArchivePanel";
import { AboutPanel } from "./AboutPanel";
import { CotonouScene } from "./CotonouScene";
import { HotelInfoPanel } from "./HotelInfoPanel";
import { NewspaperTransition } from "./NewspaperTransition";
import { hotelStudies } from "./hotels";
import type { HotelStudy } from "./hotels";

type TransitionState = {
  hotel: HotelStudy;
  mode: "open" | "close";
};

export function CotonouExperience() {
  const introRef = useRef<HTMLDivElement>(null);
  const interfaceRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const enteringRef = useRef(false);
  const introExitTimerRef = useRef<number | null>(null);

  const [entered, setEntered] = useState(false);
  const [introVisible, setIntroVisible] = useState(true);
  const [activeHotel, setActiveHotel] = useState<HotelStudy | null>(null);
  const [focusHotelId, setFocusHotelId] = useState<string | undefined>();
  const [panelOpen, setPanelOpen] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [transition, setTransition] = useState<TransitionState | null>(null);
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

  useEffect(() => {
    return () => {
      if (introExitTimerRef.current !== null) {
        window.clearTimeout(introExitTimerRef.current);
      }
    };
  }, []);

  function enterExperience() {
    if (enteringRef.current || entered) return;

    enteringRef.current = true;
    setEntered(true);

    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.32;
      audio.muted = !soundOn;
      void audio.play().catch(() => {
        setSoundOn(false);
      });
    }

    const intro = introRef.current;

    if (intro) {
      intro.style.pointerEvents = "none";

      gsap.to(intro, {
        opacity: 0,
        duration: 0.65,
        ease: "power2.inOut",
        onComplete: () => setIntroVisible(false),
      });

      introExitTimerRef.current = window.setTimeout(() => {
        setIntroVisible(false);
      }, 800);
    } else {
      setIntroVisible(false);
    }

    if (interfaceRef.current) {
      gsap.fromTo(
        interfaceRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.9, delay: 0.18, ease: "power2.out" },
      );
    }
  }

  function selectHotel(hotel: HotelStudy) {
    if (transition) return;

    setArchiveOpen(false);
    setAboutOpen(false);
    setPanelOpen(false);
    setActiveHotel(hotel);
    setTransition({ hotel, mode: "open" });

    if (hotel.exteriorReady) {
      setFocusHotelId(hotel.id);
      return;
    }

    setFocusHotelId(undefined);
  }

  function finishTransition() {
    if (!transition) return;

    if (transition.mode === "open") {
      setPanelOpen(true);
    }

    setTransition(null);
  }

  function closeHotelPanel() {
    returnToCotonou();
  }

  function returnToCotonou() {
    setPanelOpen(false);
    setTransition(null);
    setFocusHotelId(undefined);
    setActiveHotel(null);
  }

  function openArchives() {
    setPanelOpen(false);
    setAboutOpen(false);
    setTransition(null);
    setArchiveOpen(true);
  }

  function openAbout() {
    setPanelOpen(false);
    setArchiveOpen(false);
    setTransition(null);
    setAboutOpen(true);
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

  const focusedHotel = focusHotelId
    ? hotelStudies.find((hotel) => hotel.id === focusHotelId)
    : undefined;
  const inHotelStudy = Boolean(focusedHotel);

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
          camera={{ position: [18, 16, 23], fov: 34 }}
          gl={{ antialias: true, alpha: false }}
        >
          <CotonouScene
            activeHotelId={activeHotel?.id}
            focusHotelId={focusHotelId}
            onSelectHotel={selectHotel}
          />
        </Canvas>
      </div>

      {introVisible && (
        <div
          ref={introRef}
          className={`intro${entered ? " intro--leaving" : ""}`}
        >
          <div className="intro__topline" data-intro-line>
            <div className="intro__edition">
              <span className="intro__status-dot" aria-hidden="true" />
              <span>Collection interactive · 2026</span>
            </div>
            <span>06°21′ N · 02°26′ E</span>
          </div>

          <div className="intro__main">
            <div className="intro__title-meta" data-intro-line>
              <span>Cotonou, Bénin</span>
              <span>Architecture · Hôtellerie · WebGL</span>
            </div>

            <div className="intro__title-lockup" data-intro-line>
              <h1 aria-label="Cotonou 3D">
                <span className="intro__title-city">COTONOU</span>
                <span className="intro__title-slash" aria-hidden="true">/</span>
                <span className="intro__title-3d">3D</span>
              </h1>

              <span className="intro__edition-mark" aria-hidden="true">
                Édition
                <strong>2026</strong>
              </span>
            </div>

            <div className="intro__rule" data-intro-line>
              <span aria-hidden="true" />
              <small>Six lieux · Une ville</small>
            </div>

            <div className="intro__lower" data-intro-line>
              <p className="intro__description">
                Une étude interactive de six lieux d’hospitalité à Cotonou,
                entre architecture, paysage et vie urbaine.
              </p>

              <button
                type="button"
                className="enter-button enter-button--premium"
                onPointerUp={(event) => {
                  if (event.pointerType !== "mouse") {
                    enterExperience();
                  }
                }}
                onClick={enterExperience}
              >
                <span className="enter-button__label">Entrer</span>
                <span className="enter-button__icon" aria-hidden="true">↗</span>
              </button>
            </div>
          </div>

          <div className="intro__footer" data-intro-line>
            <span>Expérience WebGL indépendante</span>
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
            <button type="button" onClick={openArchives}>
              Archives
            </button>
            <button type="button" onClick={openAbout}>
              À propos
            </button>
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
              <span>Architecture · Paysage · Ville</span>
            </div>

            <div className="interaction-hint">
              <span className="interaction-hint__line" />
              <span className="interaction-copy interaction-copy--desktop">
                Glisser pour explorer · Faire défiler pour zoomer
              </span>
              <span className="interaction-copy interaction-copy--touch">
                Glisser pour explorer · Pincer pour zoomer
              </span>
            </div>

            <div className="coordinates">
              <span>06°21&apos;N</span>
              <span>Cotonou, Bénin</span>
            </div>
          </>
        )}

        {inHotelStudy && (
          <>
            <div className="hotel-study-heading">
              <h2>{focusedHotel?.name}</h2>
              <p>
                Étude extérieure
                {focusedHotel?.studyContext
                  ? ` · ${focusedHotel.studyContext}`
                  : ""}
              </p>
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
              <span className="interaction-copy interaction-copy--desktop">
                Glisser pour tourner · Faire défiler pour zoomer
              </span>
              <span className="interaction-copy interaction-copy--touch">
                Glisser pour tourner · Pincer pour zoomer
              </span>
            </div>

          </>
        )}

        {activeHotel && panelOpen && (
          <HotelInfoPanel
            key={activeHotel.id}
            hotel={activeHotel}
            delay={0}
            onClose={closeHotelPanel}
          />
        )}

        {archiveOpen && (
          <ArchivePanel
            onClose={() => setArchiveOpen(false)}
            onOpenHotel={selectHotel}
          />
        )}

        {aboutOpen && <AboutPanel onClose={() => setAboutOpen(false)} />}

        {transition && (
          <NewspaperTransition
            key={`${transition.hotel.id}-${transition.mode}`}
            hotel={transition.hotel}
            mode={transition.mode}
            onComplete={finishTransition}
          />
        )}
      </div>
    </main>
  );
}

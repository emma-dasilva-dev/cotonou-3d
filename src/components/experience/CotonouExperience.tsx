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
import { experienceText, localizeHotel } from "./translations";
import type { Language } from "./translations";

type TransitionState = {
  hotel: HotelStudy;
  mode: "open" | "close";
};

function LanguageToggle({
  language,
  onChange,
}: {
  language: Language;
  onChange: (language: Language) => void;
}) {
  return (
    <div
      className="language-toggle"
      role="group"
      aria-label={language === "fr" ? "Langue" : "Language"}
    >
      <button
        type="button"
        className={language === "fr" ? "language-toggle__active" : ""}
        onClick={() => onChange("fr")}
        aria-pressed={language === "fr"}
      >
        FR
      </button>
      <span aria-hidden="true">/</span>
      <button
        type="button"
        className={language === "en" ? "language-toggle__active" : ""}
        onClick={() => onChange("en")}
        aria-pressed={language === "en"}
      >
        EN
      </button>
    </div>
  );
}

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
  const [mobileMode, setMobileMode] = useState(false);
  const [language, setLanguage] = useState<Language>("fr");

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

  useEffect(() => {
    const media = window.matchMedia("(max-width: 720px), (pointer: coarse)");

    const syncMobileMode = () => {
      setMobileMode(media.matches || window.innerWidth <= 720);
    };

    syncMobileMode();

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", syncMobileMode);
    } else {
      media.addListener(syncMobileMode);
    }

    window.addEventListener("resize", syncMobileMode, { passive: true });

    return () => {
      if (typeof media.removeEventListener === "function") {
        media.removeEventListener("change", syncMobileMode);
      } else {
        media.removeListener(syncMobileMode);
      }

      window.removeEventListener("resize", syncMobileMode);
    };
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

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

  function returnToEntry() {
    setPanelOpen(false);
    setArchiveOpen(false);
    setAboutOpen(false);
    setTransition(null);
    setFocusHotelId(undefined);
    setActiveHotel(null);
    setIntroVisible(true);
    setEntered(false);
    enteringRef.current = false;

    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
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

  const t = experienceText[language];
  const focusedHotel = focusHotelId
    ? hotelStudies.find((hotel) => hotel.id === focusHotelId)
    : undefined;
  const displayFocusedHotel = focusedHotel
    ? localizeHotel(focusedHotel, language)
    : undefined;
  const displayActiveHotel = activeHotel
    ? localizeHotel(activeHotel, language)
    : null;
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
          frameloop={entered ? "always" : "demand"}
          shadows={!mobileMode}
          dpr={mobileMode ? 1 : [1, 1.5]}
          camera={{ position: [18, 16, -23], fov: 34 }}
          gl={{
            antialias: !mobileMode,
            alpha: false,
            powerPreference: "high-performance",
          }}
        >
          <CotonouScene
            activeHotelId={activeHotel?.id}
            focusHotelId={focusHotelId}
            onSelectHotel={selectHotel}
            lowDetail={mobileMode}
            language={language}
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
              <span>{t.interactiveCollection}</span>
            </div>

            <div className="intro__top-actions">
              <span>06°21′ N · 02°26′ E</span>
              <LanguageToggle language={language} onChange={setLanguage} />
            </div>
          </div>

          <div className="intro__main">
            <div className="intro__title-meta" data-intro-line>
              <span>{t.cotonouBenin}</span>
              <span>{t.architectureHospitality}</span>
            </div>

            <div className="intro__title-lockup" data-intro-line>
              <h1 aria-label="Cotonou 3D">
                <span className="intro__title-city">COTONOU</span>
                <span className="intro__title-slash" aria-hidden="true">/</span>
                <span className="intro__title-3d">3D</span>
              </h1>

              <span className="intro__edition-mark" aria-hidden="true">
                {t.edition}
                <strong>2026</strong>
              </span>
            </div>

            <div className="intro__rule" data-intro-line>
              <span aria-hidden="true" />
              <small>{t.sixPlaces}</small>
            </div>

            <div className="intro__lower" data-intro-line>
              <p className="intro__description">{t.introDescription}</p>

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
                <span className="enter-button__label">{t.enter}</span>
                <span className="enter-button__icon" aria-hidden="true">↗</span>
              </button>
            </div>
          </div>

          <div className="intro__footer" data-intro-line>
            <span className="intro__copyright">© 2026 Emma Da Silva</span>

            <div className="intro__socials" aria-label={t.socialLinks}>
              <a href="mailto:emma.dasilva.dev@gmail.com">
                Email <span aria-hidden="true">↗</span>
              </a>
              <a
                href="https://github.com/emma-dasilva-dev"
                target="_blank"
                rel="noreferrer"
              >
                GitHub <span aria-hidden="true">↗</span>
              </a>
              <a
                href="https://www.instagram.com/emmadev.bj"
                target="_blank"
                rel="noreferrer"
              >
                Instagram <span aria-hidden="true">↗</span>
              </a>
            </div>

            <span className="intro__explore">{t.explore}</span>
          </div>
        </div>
      )}

      <div
        ref={interfaceRef}
        className={`interface${entered ? " interface--visible" : ""}${inHotelStudy ? " interface--study" : ""}`}
      >
        <header className="interface__header">
          <button
            type="button"
            className="brand brand--home"
            onClick={returnToEntry}
            aria-label={t.returnHome}
          >
            <span className="brand__title">
              COTONOU <span>/ 3D</span>
            </span>
            <span className="brand__home-hint" aria-hidden="true">
              {t.home} ↖
            </span>
          </button>

          <nav aria-label={t.controls}>
            <button type="button" onClick={openArchives}>
              {t.archives}
            </button>
            <button type="button" onClick={openAbout}>
              {t.about}
            </button>
            <button
              type="button"
              onClick={toggleSound}
              aria-pressed={soundOn}
              aria-label={soundOn ? t.soundOff : t.soundOn}
            >
              {t.sound} {soundOn ? "●" : "○"}
            </button>
            <LanguageToggle language={language} onChange={setLanguage} />
          </nav>
        </header>

        {!inHotelStudy && (
          <>
            <div className="study-label">
              <span>{t.studyLabel}</span>
            </div>

            <div className="interaction-hint">
              <span className="interaction-hint__line" />
              <span className="interaction-copy interaction-copy--desktop">
                {t.exploreDesktop}
              </span>
              <span className="interaction-copy interaction-copy--touch">
                {t.exploreTouch}
              </span>
            </div>

            <div className="coordinates">
              <span>06°21&apos;N</span>
              <span>{t.cotonouBenin}</span>
            </div>

          </>
        )}

        {inHotelStudy && (
          <>
            <div className="hotel-study-heading">
              <h2>{displayFocusedHotel?.name}</h2>
              <p>
                {t.outdoorStudy}
                {displayFocusedHotel?.studyContext
                  ? ` · ${displayFocusedHotel.studyContext}`
                  : ""}
              </p>
            </div>

            <button
              type="button"
              className="back-to-city"
              onClick={returnToCotonou}
            >
              <span aria-hidden="true">←</span>
              <span>{t.returnToCotonou}</span>
            </button>

            <div className="study-interaction">
              <span className="interaction-hint__line" />
              <span className="interaction-copy interaction-copy--desktop">
                {t.rotateDesktop}
              </span>
              <span className="interaction-copy interaction-copy--touch">
                {t.rotateTouch}
              </span>
            </div>

          </>
        )}

        {displayActiveHotel && panelOpen && (
          <HotelInfoPanel
            key={displayActiveHotel.id}
            hotel={displayActiveHotel}
            language={language}
            delay={0}
            onClose={closeHotelPanel}
          />
        )}

        {archiveOpen && (
          <ArchivePanel
            language={language}
            onClose={() => setArchiveOpen(false)}
            onOpenHotel={selectHotel}
          />
        )}

        {aboutOpen && (
          <AboutPanel
            language={language}
            onClose={() => setAboutOpen(false)}
          />
        )}

        {transition && (
          <NewspaperTransition
            key={`${transition.hotel.id}-${transition.mode}`}
            hotel={transition.hotel}
            language={language}
            mode={transition.mode}
            onComplete={finishTransition}
          />
        )}
      </div>
    </main>
  );
}

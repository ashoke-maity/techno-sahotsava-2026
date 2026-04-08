import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import API from "../services/api";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";
import { toast } from "react-toastify";
import { Star } from "lucide-react";

// Assets
import skullBg from "../assets/backgrounds/3. BGwithIllustrations.webp";
import leftFaceImg from "../assets/backgrounds/Left skull.webp";
import rightFaceImg from "../assets/backgrounds/RS3.webp";
import mainSkullImg from "../assets/backgrounds/Skull pro.webp";

import titleFont from "../assets/backgrounds/Untitled35_20260106001225.png";
import theOneByShubho from "../assets/backgrounds/TheOneByShubho.webp";
import bg6 from "../assets/backgrounds/6.webp";
import sahotsavaLogo from "../assets/logos/sahotsava logo posterize.png";
import sofTigLogo from "../assets/logos/sof_tig_tiu_white.png";
import sanskaranLogo from "../assets/logos/sanskaran logo png WHITE.png";
import cameraLogo from "../assets/logos/Chitraka white logo.png";
import loadingVideo from "../assets/loading_screen/loading_anim.mp4";

// Team Pics
import prithaPic from "../assets/team_pics/pritha.jpeg";
import ashokePic from "../assets/team_pics/ashoke.jpg";
import rohitPic from "../assets/team_pics/rohit.jpeg";
import roshniPic from "../assets/team_pics/roshni.jpeg";
import shrijitaPic from "../assets/team_pics/shrijita.png";
import shrayanPic from "../assets/team_pics/shrayan.jpeg.png";
import shreyosheePic from "../assets/team_pics/Shreyoshee.jpeg";
import subhadeepPic from "../assets/team_pics/shubhadeep.jpeg";
import swastickPic from "../assets/team_pics/swastick.jpeg";
import tathagataPic from "../assets/team_pics/tathagatha.jpeg";
import sanskarPic from "../assets/team_pics/sanskar.jpeg";

// New Leaders
import samiranImg from "../assets/leaders_img/samiran.jpeg";
import sujoyImg from "../assets/leaders_img/sujoy.webp";
import rinaImg from "../assets/leaders_img/rina.jpeg";
import ishanImg from "../assets/leaders_img/ishan.jpeg";

// Founder
import founderImg from "../assets/founder_img/sayan.jpeg";
import parthaImg from "../assets/founder_img/partha sarathi pal.jpeg";

// Gallery Images
import g1 from "../assets/Gallery/_MG_3475.jpg.jpeg";
import g2 from "../assets/Gallery/_MG_3354.jpg.jpeg";
import g3 from "../assets/Gallery/_DSC2253.jpg.jpeg";
import g4 from "../assets/Gallery/_DSC0446.jpg.jpeg";
import g5 from "../assets/Gallery/_DSC0464.jpg.jpeg";
import g6 from "../assets/Gallery/_DSC1377.jpg.jpeg";
import g7 from "../assets/Gallery/_DSC1411.jpg.jpeg";
import g8 from "../assets/Gallery/_DSC1469.jpg.jpeg";
import g9 from "../assets/Gallery/_DSC1717.jpg.jpeg";
import g10 from "../assets/Gallery/_DSC1944.jpg.jpeg";
import g11 from "../assets/Gallery/_DSC2047.jpg.jpeg";
import g12 from "../assets/Gallery/_MG_3269.jpg.jpeg";
import g13 from "../assets/Gallery/_MG_3323.jpg.jpeg";
import g14 from "../assets/Gallery/enthusia.jpeg";

gsap.registerPlugin(ScrollTrigger);

// ─── SUB-COMPONENTS ─────────────────────────────────────────────────────────

const GalleryCard = ({ images, index }) => {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  useEffect(() => {
    // Shuffle logic: each card changes its image at a random interval
    const interval = setInterval(
      () => {
        setCurrentImgIndex((prev) => (prev + 1) % images.length);
      },
      3000 + Math.random() * 3000,
    );
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="gallery-item flex-shrink-0 w-[80vw] md:w-[45vw] aspect-video group relative overflow-hidden ring-1 ring-white/10 hover:ring-[#FFB464]/50 transition-all duration-500 rounded-sm">
      {images.map((img, i) => (
        <img
          loading="lazy"
          key={i}
          src={img}
          className={`absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-1000 ease-in-out ${
            i === currentImgIndex
              ? "opacity-100 scale-100"
              : "opacity-0 scale-110"
          }`}
          alt={`Memory ${index}-${i}`}
        />
      ))}
      <div className="gallery-overlay absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
};

let hasPlayedLoading = false;

export default function Home() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const skipLoadingQuery = queryParams.get("skipLoading") === "true";
  const shouldSkipLoading =
    hasPlayedLoading || location.state?.skipLoading || skipLoadingQuery;

  // Update the global flag if we are skipping via location state or query
  if (location.state?.skipLoading || skipLoadingQuery) {
    hasPlayedLoading = true;
  }

  const [loading, setLoading] = useState(!shouldSkipLoading);
  const [heroSplit, setHeroSplit] = useState(shouldSkipLoading);
  const [year, setYear] = useState(shouldSkipLoading ? 2026 : 2015);
  const [preloaderStage, setPreloaderStage] = useState(
    shouldSkipLoading ? "done" : "tiu",
  ); // stages: tiu, main, done
  const [isPreloaderComplete, setIsPreloaderComplete] = useState(false);
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [resultMode, setResultMode] = useState(false);
  const [otseMode, setOTSEMode] = useState(false);
  const [eventDates, setEventDates] = useState("");
  const [featuredEventsEnabled, setFeaturedEventsEnabled] = useState(false);
  const [featuredEventsList, setFeaturedEventsList] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [isWarping, setIsWarping] = useState(false);
  const [officialBrochureUrl, setOfficialBrochureUrl] = useState("");
  const [collegeReferenceUrl, setCollegeReferenceUrl] = useState("");
  const [collegeList, setCollegeList] = useState([]);

  const navigate = useNavigate();
  const lenisRef = useRef(null);
  const totemRef = useRef(null);
  const timelineProgressRef = useRef(null);
  const galleryRef = useRef(null);
  const [showEnterButton, setShowEnterButton] = useState(false);
  const [isRepFormOpen, setIsRepFormOpen] = useState(false);
  const [isBlackSub, setIsBlackSub] = useState(false);
  const lastUpdateRef = useRef(0);

  // ─── DATA FETCHING ──────────────────────────────────────────────────────────
  useEffect(() => {
    const rawUrl = import.meta.env.VITE_SERVER_URL;
    if (!rawUrl) return;
    let serverOrigin = "";
    try {
      serverOrigin = new URL(rawUrl).origin;
    } catch (e) {
      serverOrigin = rawUrl.split("/technoSahotsava2026")[0];
    }

    const syncSystemState = async () => {
      const startTime = Date.now();
      lastUpdateRef.current = startTime;

      try {
        const apiPrefix = "/technoSahotsava2026";

        const results = await Promise.allSettled([
          API.get(
            `${serverOrigin}${apiPrefix}/admin/registration-status?t=${startTime}`,
          ),
          API.get(`${serverOrigin}${apiPrefix}/public/events?t=${startTime}`),
        ]);

        if (lastUpdateRef.current !== startTime) return;

        const statusRes = results[0];
        const eventsRes = results[1];

        if (statusRes.status === "fulfilled") {
          const data = statusRes.value.data;
          setRegistrationOpen(
            data.registration_open === true ||
              String(data.registration_open) === "true",
          );
          setResultMode(
            data.result_mode === true || String(data.result_mode) === "true",
          );
          setOTSEMode(
            data.otse_mode === true || String(data.otse_mode) === "true",
          );
          setEventDates(data.event_dates || "");

          // Migrate legacy strings
          const cListRaw = data.college_list || [];
          const cListMapped = cListRaw.map((item) => {
            if (typeof item === "string")
              return { original: item.toUpperCase(), display: "" };
            return item;
          });
          setCollegeList(cListMapped);
          setOfficialBrochureUrl(data.official_brochure_url || "");
          setCollegeReferenceUrl(data.college_reference_url || "");

          const isFeaturedEnabled =
            data.featured_events_enabled === true ||
            String(data.featured_events_enabled) === "true";
          setFeaturedEventsEnabled(isFeaturedEnabled);

          // Deep Parse Protection for robust array handling
          let fList = data.featured_events_list || [];
          if (typeof fList === "string" && fList.startsWith("[")) {
            try {
              fList = JSON.parse(fList);
            } catch (e) {
              console.error("Deep Parse Error:", e);
            }
          }
          setFeaturedEventsList(Array.isArray(fList) ? fList : []);
        } else {
          console.error(
            "[SYSTEM] Registration Status Fetch failed:",
            statusRes.reason,
          );
        }

        if (eventsRes.status === "fulfilled") {
          setAllEvents(eventsRes.value.data || []);
        } else {
          console.error(
            "[SYSTEM] Event Registry Fetch failed:",
            eventsRes.reason,
          );
        }
      } catch (err) {
        console.error("[SYSTEM] Critical Synchronization Error:", err);
      }
    };

    syncSystemState();
    const syncInterval = setInterval(syncSystemState, 60000);

    const socket = io(serverOrigin);
    socket.on("registrationStatusUpdate", (data) =>
      setRegistrationOpen(data.registration_open),
    );
    socket.on("resultModeUpdate", (data) => setResultMode(data.result_mode));
    socket.on("otseModeUpdate", (data) => {
      setOTSEMode(data.otse_mode);
    });
    socket.on("eventDatesUpdate", (data) => {
      setEventDates(data.event_dates);
    });
    socket.on("collegeListUpdate", (data) => {
      const updatedList = (data.college_list || []).map((item) => {
        if (typeof item === "string")
          return { original: item.toUpperCase(), display: "" };
        return item;
      });
      setCollegeList(updatedList);
    });
    socket.on("featuredEventsUpdate", (data) => {
      lastUpdateRef.current = Date.now();

      if (data.featured_events_enabled !== undefined) {
        const isEnabled =
          data.featured_events_enabled === true ||
          String(data.featured_events_enabled) === "true";
        setFeaturedEventsEnabled(isEnabled);
      }

      if (data.featured_events_list !== undefined) {
        let fList = data.featured_events_list || [];
        if (typeof fList === "string" && fList.startsWith("[")) {
          try {
            fList = JSON.parse(fList);
          } catch (e) {}
        }
        setFeaturedEventsList(Array.isArray(fList) ? fList : []);
      }
    });
    return () => socket.disconnect();
  }, []);

  // ─── WARP NAVIGATION Logic ───
  useEffect(() => {
    if (isWarping) {
      const timer = setTimeout(() => {
        navigate("/sponsors");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isWarping, navigate]);

  // Derived curated events list
  const curatedEvents = useMemo(() => {
    if (
      !allEvents ||
      !featuredEventsList ||
      !Array.isArray(allEvents) ||
      !Array.isArray(featuredEventsList)
    ) {
      return [];
    }

    const featuredIds = new Set(featuredEventsList.map(String));
    const filtered = allEvents.filter((ev) => {
      return featuredIds.has(String(ev.id));
    });

    return filtered;
  }, [allEvents, featuredEventsList, featuredEventsEnabled]);

  // Handle ScrollTrigger Refresh when dynamic sections toggle
  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 1000);
    return () => clearTimeout(timer);
  }, [featuredEventsEnabled, curatedEvents.length]);

  // ─── CULTURAL SEQUENCED PRELOADER Logic ───
  useEffect(() => {
    if (!loading) return;

    let countTimer;
    // Phase 1: Institutional Authority (Techno India Group)
    setPreloaderStage("tiu");

    const t2 = setTimeout(() => {
      setPreloaderStage("main");
      setYear(2015); // Explicit reset

      let currentY = 2015;
      const duration = 8000; // Slightly slower for clarity
      const step = duration / (2026 - 2015);

      countTimer = setInterval(() => {
        currentY += 1;
        if (currentY >= 2026) {
          currentY = 2026;
          clearInterval(countTimer);
          setIsPreloaderComplete(true);
          setShowEnterButton(true);
        }
        setYear(currentY);
      }, step);
    }, 3000);

    return () => {
      clearTimeout(t2);
      if (countTimer) clearInterval(countTimer);
    };
  }, [loading]);

  const handleEnter = () => {
    hasPlayedLoading = true;
    setLoading(false);
    setTimeout(() => setHeroSplit(true), 100);
  };

  // ─── MASTER JOURNEY INIT ────────────────────────────────────────────────────
  useEffect(() => {
    if (loading) return;

    const lenis = new Lenis({ duration: 2.5, lerp: 0.03, smoothWheel: true });
    lenisRef.current = lenis;
    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Sync ScrollTrigger with Lenis
    lenis.on("scroll", ScrollTrigger.update);

    const ctx = gsap.context(() => {
      // 1. Timeline Track + Totem Movement
      // Using end: "max" ensures it tracks the absolute bottom of the scrollable area
      ScrollTrigger.create({
        start: 0,
        end: "max",
        scrub: true,
        onUpdate: (self) => {
          gsap.set(timelineProgressRef.current, {
            height: `${self.progress * 100}%`,
          });
          gsap.set(totemRef.current, {
            top: `${self.progress * 100}%`,
            rotation: self.progress * 720,
          });
        },
      });

      // 2. HERO SECTION SCROLL EXPANSION
      // Left Face: Sliding further left on scroll
      gsap.to(".face-left", {
        x: "-50vw",
        ease: "none",
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // Right Face: Sliding further right on scroll
      gsap.to(".face-right", {
        x: "50vw",
        ease: "none",
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // Background illustration parallax
      gsap.to(".hero-bg-illo", {
        y: "30%",
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // 2. HERO PORTAL REVEAL TRANSITION (Sequential Portal Destruction)
      const heroPortalTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: () =>
            `+=${window.innerHeight * 5 + (galleryRef.current?.scrollWidth || 0)}`,
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      heroPortalTl
        // STAGE 1: Decisive Handover (Locked-in State)
        .set(".about-reveal-layer", { autoAlpha: 1 }) // Immediate activation
        .to(".face-left", { x: "-100%", ease: "none" }, 0)
        .to(".face-right", { x: "100%", ease: "none" }, 0)

        // Vanish the landing page elements Decisively & Fast
        .to(".hero-bg-illo", { autoAlpha: 0, duration: 0.1, ease: "none" }, 0)
        .to(
          ".hero-portal-content",
          { autoAlpha: 0, duration: 0.1, ease: "none" },
          0,
        )
        .to(
          ".main-skull",
          { autoAlpha: 0, duration: 0.2, ease: "power1.in" },
          0,
        )

        // Establish new scenery instantly beneath the sliding faces
        .to(
          ".about-reveal-bg",
          { autoAlpha: 1, duration: 0.2, ease: "none" },
          0,
        )

        // STAGE 2: Cleanup and focus
        .to(
          ".hero-bottom-mask",
          { autoAlpha: 0, duration: 0.2, ease: "none" },
          0,
        )

        // STAGE 4: CONTENT FOCUS
        .fromTo(
          ".about-reveal-content",
          { opacity: 0, y: 100 },
          { opacity: 1, y: 0, ease: "power3.out" },
          0.5,
        )

        // STAGE 5: THE DIMENSIONAL SHUTTER (Unified Dimensional Merge)
        // A. Background Slices arrive first to form the scenery
        .set(".transition-strips-layer", { display: "flex", opacity: 1 })
        .set(".gallery-reveal-layer", {
          opacity: 1,
          pointerEvents: "auto",
        })
        .fromTo(
          ".transition-strip",
          { yPercent: 100 },
          {
            yPercent: 0,
            stagger: {
              each: 0.08,
              from: "start",
            },
            duration: 1.5,
            ease: "power2.inOut",
          },
        )
        // B. Old Dimension Dissolve (Fades as scenery is established)
        .to(
          ".about-reveal-layer",
          {
            opacity: 0,
            duration: 1.2,
            ease: "power1.in",
          },
          2.0,
        )

        // C. Gallery Content emerges ONCE background is solidly formed
        .to(
          ".gallery-header, .gallery-container",
          {
            opacity: 1,
            y: 0,
            stagger: 0.15,
            duration: 1.2,
            ease: "power3.out",
          },
          2.5,
        ) // Significant delay to ensure slices have finished their primary travel
        .set(".about-reveal-layer", { display: "none" })

        // C. The Realization (Switching from Shutter background to real background)
        .to(".gallery-bg-container", { opacity: 1, duration: 0.5 })
        .set(".transition-strips-layer", { display: "none" })

        // D. The Horizontal Explorer
        .to(galleryRef.current, {
          x: () => -(galleryRef.current.scrollWidth - window.innerWidth),
          ease: "none",
          duration: 10,
        })
        // G. Final transition to Highlights
        .to(".gallery-header, .gallery-container, .gallery-bg-container", {
          opacity: 0,
          scale: 0.8,
          filter: "blur(100px)",
          duration: 1.5,
          ease: "power2.in",
        })
        .to(
          ".gallery-final-highlight",
          {
            opacity: 1,
            scale: 1,
            duration: 1.5,
            ease: "power4.out",
          },
          "-=1.5",
        )
        .fromTo(
          ".gallery-final-highlight img",
          { scale: 2.2, filter: "brightness(0) contrast(4)" },
          {
            scale: 1,
            filter: "brightness(1) contrast(1)",
            duration: 1.5,
          },
          "<",
        );

      // 4. LEADERS REVEAL
      gsap.from(".leader-circle", {
        scrollTrigger: {
          trigger: "#leaders",
          start: "top 80%",
        },
        y: 50,
        opacity: 0,
        stagger: 0.15,
        duration: 1.5,
        ease: "power4.out",
      });

      // 4b. FOUNDER REVEAL (Independent Trigger)
      gsap.from(".founder-content", {
        scrollTrigger: {
          trigger: "#founder",
          start: "top 80%",
        },
        y: 40,
        opacity: 0,
        stagger: 0.2,
        duration: 1.2,
        ease: "power3.out",
      });

      // 5. ARCHITECTS REVEAL
      gsap.from(".architect-card", {
        scrollTrigger: {
          trigger: ".architects-grid",
          start: "top 85%",
          onEnter: () => ScrollTrigger.refresh(),
        },
        y: 60,
        opacity: 0,
        stagger: 0.1,
        duration: 1.2,
        ease: "power3.out",
        clearProps: "transform",
      });

      ScrollTrigger.create({
        trigger: "#leaders",
        start: "top 50%",
        endTrigger: "#destiny",
        end: "top 50%",
        onEnter: () => setIsBlackSub(true),
        onLeave: () => setIsBlackSub(false),
        onEnterBack: () => setIsBlackSub(true),
        onLeaveBack: () => setIsBlackSub(false),
      });
    });

    // ─── FINAL REFRESH ───
    const handleResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", handleResize);

    // Initial recalibrations
    setTimeout(() => ScrollTrigger.refresh(), 500);
    setTimeout(() => ScrollTrigger.refresh(), 2000);
    setTimeout(() => ScrollTrigger.refresh(), 5000);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(rafId);
      lenis.destroy();
      ctx.revert();
    };
  }, [loading]);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el && lenisRef.current) {
      lenisRef.current.scrollTo(el, { offset: 0, duration: 2 });
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-black selection:bg-[#FFB464] selection:text-black overflow-x-hidden">
      {/* 1. TRANSCENDING LOADING OVERLAY: METAMORPHOSIS OF CIVILIZATION (CANVAS DRAWING) */}
      {loading && (
        <div
          id="preloader-wrapper"
          className={`${heroSplit ? "exit" : ""} cultural-theme`}
        >
          {/* Stage-Linked Fake Load - Only visible during year count */}
          <div
            className="fake-loading-wall"
            style={{
              opacity:
                preloaderStage === "main" && !isPreloaderComplete ? 0.25 : 0,
              transition: "opacity 0.5s ease",
            }}
          >
            {[
              "INIT_CULTURAL_CORE",
              "HERITAGE_SYNC_ACTIVE",
              "VOID_RECLAMATION...",
              "DECODING_SANSKARAN",
              "BEYOND_THE_HORIZON",
              "ASSET_STREAM_01",
              "RESTORING_PIXELS",
              "LEGACY_PROTOCOL",
              "TRADITION_ENCODER",
              "PHASE_SHIFT_2026",
              "DATA_HARVESTING...",
              "CULTURAL_MATRIX_ON",
              "SYSTEM_BREATHING",
              "SOUL_RENDER_INIT",
              "VIBRANCE_STABILIZER",
            ].map((text, i) => (
              <div
                key={i}
                className="fake-load-item"
                style={{
                  animationDelay: `${i * 0.3}s`,
                  left: `${(i * 17) % 100}%`,
                  top: `${(i * 11) % 100}%`,
                }}
              >
                {text}
              </div>
            ))}
          </div>

          {/* Core Loading Bar - Only visible during year count */}
          <div
            className="system-loading-bar-wrap"
            style={{
              opacity:
                preloaderStage === "main" && !isPreloaderComplete ? 1 : 0,
              transition: "opacity 0.5s ease",
            }}
          >
            <div
              className="system-loading-bar-fill"
              style={{
                width: `${((year - 2015) / (2026 - 2015)) * 100}%`,
              }}
            />
          </div>

          <div className="preloader-vertical-stack">
            {/* 1. Techno India Logo (Visible from start) */}
            <div
              className={`tiu-reveal ${preloaderStage === "tiu" || preloaderStage === "main" ? "active" : ""}`}
            >
              <img
                src={sofTigLogo}
                className="logo-tiu-top"
                alt="Techno India"
              />
            </div>

            {/* 2. Sahotsava Logo (Strictly from 2015) */}
            <div
              className={`sahotsava-reveal-box ${preloaderStage === "main" ? "active" : ""}`}
            >
              <img
                src={sahotsavaLogo}
                className="logo-sahotsava-mid"
                alt="Sahotsava"
              />
            </div>

            {/* 3. Techno Sahotsava 2026 Text */}
            <div
              className={`title-reveal-box ${preloaderStage === "main" ? "active" : ""}`}
            >
              <h1 className="festival-title-text">
                TECHNO SAHOTSAVA <span className="year-anim-span">{year}</span>
              </h1>
              {eventDates && (
                <div className="text-[#FFB464] font-medieval text-sm tracking-[0.4em] uppercase mt-4 animate-pulse opacity-80 text-center">
                  {eventDates}
                </div>
              )}
            </div>

            {/* 4. Powered by Sanskaran (MASSIVE Logo as requested) */}
            <div
              className={`sanskaran-reveal-box ${isPreloaderComplete ? "active" : ""}`}
            >
              <span className="pb-label">powered by</span>
              <img
                src={sanskaranLogo}
                className="logo-sanskaran-massive"
                alt="Sanskaran"
              />
            </div>

            {/* 5. Enter Button */}
            <div
              className={`enter-reveal-box ${isPreloaderComplete ? "active" : ""}`}
            >
              <button className="btn-final-enter" onClick={handleEnter}>
                <span className="enter-text-main">Enter</span>
              </button>
            </div>
          </div>

          <div className="cultural-glow-bg">
            <div className="g-red" />
            <div className="g-blue" />
          </div>
        </div>
      )}

      {/* 1. COORDINATED TIMELINE NAVIGATION TRACK */}
      <div
        className={`timeline-track hidden md:block ${isBlackSub ? "subs-black" : ""}`}
      >
        <div ref={timelineProgressRef} className="timeline-progress" />

        {/* traveling totem */}
        <div ref={totemRef} className="divine-totem top-0">
          <div className="totem-eye" />
        </div>

        {/* navigational chapters */}
        {[
          { id: "hero", sub: ["START"], top: "0%" },
          { id: "anchor-theme", sub: ["Theme"], top: "3%" },
          { id: "anchor-gallery", sub: ["Gallery"], top: "13%" },
          ...(featuredEventsEnabled && curatedEvents.length > 0
            ? [{ id: "featured-events", sub: ["Highlights"], top: "54%" }]
            : []),
          { id: "leaders", sub: ["Mentors"], top: "62%" },
          { id: "founder", sub: ["Founders"], top: "67%" },
          { id: "builders", sub: ["Meet the Team"], top: "77%" },
          { id: "destiny", sub: ["register rep", "sponsors"], top: "86.5%" },
        ].map((chap, i) => (
          <div
            key={i}
            className="chapter-marker-group absolute left-0 w-full"
            style={{ top: chap.top }}
          >
            {chap.sub &&
              chap.sub.map((s, si) => (
                <div
                  key={si}
                  className="sub-point cursor-pointer group/sub flex items-center gap-4"
                  onClick={() => scrollToSection(chap.id)}
                >
                  <div className="marker-dot group-hover/sub:scale-125 transition-transform" />
                  <span className="sub-label group-hover/sub:text-[#FFB464]">
                    {s}
                  </span>
                </div>
              ))}
          </div>
        ))}
      </div>

      <main
        className={`relative z-10 transition-opacity duration-1000 ${loading ? "opacity-0 invisible" : "opacity-100 visible"}`}
      >
        {/* Pinned Section Navigation Anchors (Invisible) */}
        <div className="absolute top-0 left-0 w-full h-0 pointer-events-none select-none">
          <div
            id="anchor-theme"
            className="absolute"
            style={{ top: "100vh" }}
          />
          <div
            id="anchor-gallery"
            className="absolute"
            style={{ top: "320vh" }}
          />
        </div>

        {/* HERO: SACRED SKULL PORTAL */}
        <section id="hero" className="hero-section hero-portal">
          {/* Background illustration */}
          <img
            loading="lazy"
            src={skullBg}
            className="hero-bg-illo grayscale-[80%]"
            alt="Void"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black z-[2]" />

          {/* The Bottom Mask (Hides sharp neck lines) */}
          <div className="hero-bottom-mask" />

          {/* Main Center Skull (Skull Pro) */}
          <img
            loading="lazy"
            src={mainSkullImg}
            className="main-skull"
            alt="The Core"
            style={{
              opacity: 1,
              transform: "translateX(-50%) scale(1.1)",
            }}
          />

          {/* Hugging Faces (Split-Face Reveal - framing the center) */}
          <img
            loading="lazy"
            src={leftFaceImg}
            className="hero-face face-left"
            style={{
              left: 0,
              transform: "translateX(-1%)",
            }}
            alt="Left Protector"
          />
          <img
            loading="lazy"
            src={rightFaceImg}
            className="hero-face face-right"
            style={{
              right: 0,
              transform: "translateX(-1.3%)",
            }}
            alt="Right Protector"
          />

          {/* LANDING PAGE CONTENT: Individual Control Slots */}
          <div className="relative z-[30] hero-portal-content h-full w-full flex flex-col items-center justify-center">
            {/* SLOT 2: TITLE + DATES — tight grouped block */}
            <div className="flex flex-col items-center">
              <img
                loading="lazy"
                src={titleFont}
                className="h-[45vh] md:h-[55vh] lg:h-[65vh] xl:h-[70vh] w-auto object-contain drop-shadow-[0_0_120px_rgba(255,180,100,0.6)] transition-all duration-700"
                alt="Sahotsava"
              />
              {eventDates && (
                <div className="-mt-[14vh] animate-fadeIn">
                  <div className="text-[#FFB464] font-medieval text-2xl md:text-3xl lg:text-4xl tracking-[0.35em] uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] text-center font-bold">
                    {eventDates}
                  </div>
                </div>
              )}
            </div>

            {/* SLOT 3: ACTION BUTTONS - Sleek pill row */}
            <div className="relative mt-8 flex flex-col items-center gap-4">
              {/* Sacred inscription buttons */}
              <div className="flex items-stretch gap-3">
                {/* SPONSOR */}
                <a
                  href={import.meta.env.VITE_SPONSOR_REDIRECT}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center justify-center gap-1.5 px-7 py-4 border-2 border-[#FFB464]/60 hover:border-[#FFB464]/80 bg-[#FFB464]/5 hover:bg-[#FFB464]/10 backdrop-blur-sm transition-all duration-400"
                >
                  <span className="text-[#FFB464] text-sm">✦</span>
                  <span className="font-medieval text-[10px] tracking-[0.4em] uppercase text-white font-bold">
                    Become a Sponsor
                  </span>
                  <span className="block h-[1.5px] w-6 bg-[#FFB464]/70 group-hover:w-10 group-hover:bg-[#FFB464] transition-all duration-500 ease-out" />
                </a>

                {/* LOGIN */}
                {registrationOpen ? (
                  <a
                    href={import.meta.env.VITE_REGISTER_URL}
                    className="group flex flex-col items-center justify-center gap-1.5 px-7 py-4 border-2 border-white/60 hover:border-white bg-white/25 hover:bg-white/35 backdrop-blur-sm transition-all duration-400"
                  >
                    <span className="text-[#FFB464] text-sm">✦</span>
                    <span className="font-medieval text-[10px] tracking-[0.4em] uppercase text-white font-bold">
                      Login
                    </span>
                    <span className="block h-[1.5px] w-6 bg-white/70 group-hover:w-10 group-hover:bg-[#FFB464] transition-all duration-500 ease-out" />
                  </a>
                ) : (
                  <div
                    onClick={() =>
                      toast.info("Registration is currently restricted.")
                    }
                    className="flex flex-col items-center justify-center gap-1.5 px-7 py-4 border-2 border-white/30 bg-white/10 backdrop-blur-sm cursor-pointer"
                  >
                    <span className="text-white/50 text-sm">✦</span>
                    <span className="font-medieval text-[10px] tracking-[0.4em] uppercase text-white/50 font-bold">
                      Closed
                    </span>
                    <span className="block h-[1.5px] w-6 bg-white/30" />
                  </div>
                )}

                {/* RESULTS */}
                <button
                  onClick={() => {
                    if (resultMode) navigate("/hall-of-fame");
                    else
                      toast.info("Result Portal is in Administrative Standby.");
                  }}
                  className={`group flex flex-col items-center justify-center gap-1.5 px-7 py-4 border-2 backdrop-blur-sm transition-all duration-400 ${
                    resultMode
                      ? "border-white/60 hover:border-white bg-white/25 hover:bg-white/35"
                      : "border-white/30 bg-white/10"
                  }`}
                >
                  {resultMode ? (
                    <>
                      <span className="text-emerald-400 text-sm group-hover:text-emerald-300 transition-colors duration-400">
                        ◈
                      </span>
                      <span className="font-medieval text-[10px] tracking-[0.4em] uppercase text-white font-bold group-hover:text-emerald-300 transition-colors duration-400">
                        Results
                      </span>
                      <span className="block h-[1.5px] w-6 bg-white/70 group-hover:w-10 group-hover:bg-emerald-400 transition-all duration-500 ease-out" />
                    </>
                  ) : (
                    <>
                      <span className="text-white/50 text-sm">◈</span>
                      <span className="font-medieval text-[10px] tracking-[0.4em] uppercase text-white/50 font-bold">
                        Results
                      </span>
                      <span className="block h-[1.5px] w-6 bg-white/30" />
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="absolute bottom-10 opacity-30">
              <span className="font-medieval font-bold text-[#FFB464] text-[8px] tracking-[0.5em] uppercase">
                Scroll Down
              </span>
            </div>
          </div>

          {/* IN-PLACE REVEAL: THE ABOUT CONTENT */}
          <div
            id="chapter-theme"
            className="about-reveal-layer absolute inset-0 z-[100]"
          >
            <div className="about-reveal-bg">
              <img loading="lazy" src={theOneByShubho} alt="" />
              <div className="absolute inset-0 bg-black/60" />
            </div>

            <div className="about-reveal-content relative z-10 w-full max-w-[1400px]">
              <div className="flex flex-col items-center mb-12">
                <div className="font-medieval text-[#FFB464] text-xs md:text-sm uppercase tracking-[0.8em] mb-4 text-center">
                  Chapter_01
                </div>
                <h2 className="text-4xl md:text-[8vw] font-medieval text-white leading-none tracking-tighter uppercase text-center w-full">
                  ABOUT THE THEME
                </h2>
              </div>

              <div className="max-w-3xl mx-auto pt-10 border-t border-white/10">
                <p className="font-outfit text-white/90 text-base md:text-lg leading-relaxed text-justify">
                  Technosahotsava 2026, the annual cultural fest of Techno India
                  University, celebrates creativity and transformation. 
                  Curated by Team Sanskaran, it unites talent and ideas.
                  The theme, “Metamorphosis of the Divine: Where the
                  universe expands in grandeur and the divine descends into the
                  void,” reflects growth, evolution, and powerful expression.
                </p>
              </div>
            </div>
          </div>

          {/* IN-PLACE REVEAL: THE GALLERY CONTENT (CHAPTER 02) */}
          <div
            id="chapter-gallery"
            className="gallery-reveal-layer absolute inset-0 opacity-0 pointer-events-none flex flex-col justify-center overflow-hidden z-[300]"
          >
            {/* Section Background with Overlay (Starts Hidden) */}
            <div className="gallery-bg-container absolute inset-0 z-0 opacity-0">
              <img
                loading="lazy"
                src={bg6}
                className="w-full h-full object-cover opacity-80"
                alt=""
              />
              <div className="absolute inset-0 bg-black/60" />
            </div>

            <div className="px-10 md:pl-56 md:pr-20 mb-8 relative z-20 gallery-header opacity-0 translate-y-10">
              <div className="font-medieval text-[#FFB464] text-sm uppercase tracking-[0.8em] mb-4">
                Chapter_02
              </div>
              <h2 className="text-5xl md:text-[8vw] font-medieval text-white uppercase tracking-tighter leading-none">
                Gallery
              </h2>
            </div>

            <div
              ref={galleryRef}
              className="gallery-container relative z-10 flex items-center gap-12 pl-10 md:pl-56 pr-[10vw] will-change-transform opacity-0 translate-y-10"
            >
              {[
                [g1, g2, g3],
                [g4, g5, g6],
                [g7, g8, g9],
                [g10, g11, g12],
                [g13, g1, g5],
                [g2, g4, g8],
                [g3, g7, g11],
                [g14, g10, g6],
              ].map((imgGroup, i) => (
                <GalleryCard key={i} images={imgGroup} index={i} />
              ))}
            </div>
            {/* FINAL HIGHLIGHT - SEPARATE FROM ROWS */}
            <div className="gallery-final-highlight absolute inset-0 z-[100] flex items-center justify-center opacity-0 pointer-events-none bg-black">
              <div className="w-[85vw] md:w-[70vw] aspect-video relative overflow-hidden ring-2 ring-[#FFB464] shadow-[0_0_150px_rgba(255,180,100,0.6)] rounded-sm">
                <img
                  loading="lazy"
                  src={g14}
                  className="w-full h-full object-cover"
                  alt="Final Memory"
                />
                <div className="absolute inset-x-0 bottom-0 p-10 bg-gradient-to-t from-black via-transparent to-transparent">
                  <div className="font-medieval text-[#FFB464] text-xs md:text-sm uppercase tracking-[1em]">
                    The Divine Conclusion
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* STRIP TRANSITION LAYER (The Shutter Mechanism) */}
          <div className="transition-strips-layer absolute inset-0 z-[200] flex pointer-events-none overflow-hidden">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="transition-strip flex-1 h-full relative overflow-hidden bg-black"
              >
                {/* THE BACKGROUND SLICE: Forms the new dimension behind the content */}
                <div
                  className="absolute top-0 h-full w-[100vw]"
                  style={{ left: `-${i * 10}vw` }}
                >
                  <img
                    loading="lazy"
                    src={bg6}
                    className="w-full h-full object-cover opacity-80"
                    alt=""
                  />
                  <div className="absolute inset-0 bg-black/60" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURED EVENTS SECTION */}
        {featuredEventsEnabled && curatedEvents.length > 0 && (
          <section
            id="featured-events"
            className="relative w-full py-32 px-10 md:pl-56 md:pr-20 bg-[#050505] border-b border-white/5"
          >
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[50vw] h-[50vh] bg-[#FFB464]/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="relative z-10 w-full max-w-7xl">
              <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                <div className="space-y-4">
                  <div className="font-medieval text-[#FFB464] text-xs uppercase tracking-[0.8em] opacity-50">
                    Showcase
                  </div>
                  <h2 className="text-white font-medieval text-5xl md:text-[8vw] leading-none tracking-tighter uppercase">
                    Featured <br /> Events.
                  </h2>
                </div>
                <p className="font-outfit text-white/30 text-[10px] md:text-sm uppercase tracking-[0.4em] max-w-xs text-right leading-relaxed">
                  The heart of the festival. Selected chronicles of divine
                  expression.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {curatedEvents.map((event) => (
                  <div
                    key={event.id}
                    className="group relative bg-white/[0.02] border border-white/10 p-8 rounded-sm hover:bg-white/[0.05] hover:border-[#FFB464]/30 transition-all duration-700"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#FFB464]/0 via-transparent to-[#FFB464]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    <div className="relative z-10 flex flex-col h-full">
                      <div className="flex justify-between items-start mb-6">
                        <span className="font-medieval text-[#FFB464] text-[9px] uppercase tracking-[0.2em] px-2 py-1 bg-[#FFB464]/10 border border-[#FFB464]/20">
                          {event.domain}
                        </span>
                      </div>

                      <h3 className="font-medieval text-2xl text-white mb-6 group-hover:translate-x-2 transition-transform duration-700 line-clamp-2">
                        {event.name}
                      </h3>

                      <div className="mt-auto pt-6 border-t border-white/5 group-hover:border-[#FFB464]/20 transition-colors flex items-center justify-between">
                        <span className="font-outfit text-[9px] text-white/40 uppercase tracking-widest">
                          {event.format}
                        </span>
                        <Star
                          size={12}
                          className="text-[#FFB464] opacity-30 group-hover:opacity-100 transition-opacity"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* LEADERS SECTION */}
        <section
          id="leaders"
          className="relative w-full py-40 px-10 md:pl-56 md:pr-20 bg-white text-black border-b border-black/5"
        >
          <div className="mb-4 font-medieval text-black/50 text-sm uppercase tracking-[0.8em]">
            Chapter_03
          </div>
          <h2 className="text-6xl md:text-[8vw] font-medieval leading-none tracking-tighter text-black mb-20">
            OUR LEADERS.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 items-start">
            {[
              {
                name: "Prof. Dr. Samiran Chattopadhyay",
                role: "Vice Chancellor, Techno India University - West Bengal",
                image: samiranImg,
              },
              {
                name: "Prof. Dr. Sujoy Biswas",
                role: "Director & CEO of Techno India Group & Registrar Techno India University, West Bengal",
                image: sujoyImg,
              },
              {
                name: "Prof. Dr. Rina Paladhi",
                role: "Director of Techno India University, West Bengal",
                image: rinaImg,
              },
              {
                name: "Prof. Ishan Ghosh",
                role: "Head of Administration, Chairman of Disciplinary commitee, Associate Dean of Student affairs of Techno India University-West Bengal",
                image: ishanImg,
              },
            ].map((leader, i) => (
              <div
                key={i}
                className="leader-circle flex flex-col items-center gap-6 w-full"
              >
                <div className="w-40 h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 rounded-full overflow-hidden border-2 border-black/10 shadow-xl">
                  <img
                    loading="lazy"
                    src={leader.image}
                    className="w-full h-full object-cover"
                    alt={leader.name}
                  />
                </div>
                <div className="text-center w-full">
                  <h3 className="font-medieval text-xl md:text-2xl uppercase leading-tight mb-2">
                    {leader.name}
                  </h3>
                  <p className="font-outfit text-[11px] leading-relaxed text-black/50 uppercase font-bold tracking-[0.1em] px-2">
                    {leader.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FOUNDER SECTION */}
        <section
          id="founder"
          className="relative w-full py-40 px-10 md:pl-56 md:pr-20 bg-white text-black"
        >
          {/* Header Row: Minimal & Deep */}
          <div className="founder-content flex flex-col md:flex-row justify-between items-baseline mb-20 gap-8 border-b border-black/10 pb-12">
            <h2 className="text-5xl md:text-[8vw] font-medieval leading-none tracking-tighter text-black">
              The Founders.
            </h2>
            <div className="flex flex-col items-end">
              <span className="font-medieval text-[#FFB464] text-sm tracking-[1em] mb-2">
                CHAPTER_04
              </span>
              <span className="font-outfit text-[10px] text-black/30 tracking-[0.5em] uppercase">
                Est. Sahotsava 2017
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-24">
            {/* Visual Row: Symmetrical Respect (Introduced First) */}
            <div className="founder-content grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
              <div className="relative group">
                <div className="aspect-[4/5] overflow-hidden bg-gray-50 border border-black/5 shadow-2xl">
                  <img
                    loading="lazy"
                    src={founderImg}
                    className="w-full h-full object-cover hover:scale-105 transition-all duration-700 ease-in-out"
                    alt="Sayan Chakraborty"
                  />
                </div>
                {/* Identification tag */}
                <div className="mt-8 border-l-2 border-[#FFB464] pl-6">
                  <h3 className="font-medieval text-3xl uppercase mb-2">
                    Sayan Chakraborty
                  </h3>
                  <p className="font-outfit text-[11px] text-black/40 uppercase font-bold tracking-[0.4em]">
                    Founder
                  </p>
                </div>
              </div>

              <div className="relative group">
                <div className="aspect-[4/5] overflow-hidden bg-gray-50 border border-black/5 shadow-2xl">
                  <img
                    loading="lazy"
                    src={parthaImg}
                    className="w-full h-full object-cover hover:scale-105 transition-all duration-700 ease-in-out"
                    alt="Partha Sarathi Pal"
                  />
                </div>
                {/* Identification tag */}
                <div className="mt-8 border-l-2 border-[#FFB464] pl-6">
                  <h3 className="font-medieval text-3xl uppercase mb-2">
                    Partha Sarathi Pal
                  </h3>
                  <p className="font-outfit text-[11px] text-black/40 uppercase font-bold tracking-[0.4em]">
                    Founder
                  </p>
                </div>
              </div>
            </div>

            {/* Narrative Row: The Story of Origin (Supports the Visuals) */}
            <div className="founder-content max-w-4xl">
              <div className="font-outfit text-lg md:text-xl text-black/70 leading-relaxed text-justify space-y-10">
                <p className="font-outfit text-2xl md:text-3xl text-black font-medium leading-snug">
                  Great movements are never accidental — they are born from
                  vision, courage, and an unshakable belief in the power of
                  people.
                </p>

                <div className="space-y-8">
                  <p>
                    Long before Technosahotsava became the grand cultural
                    phenomenon it is today, it existed as a dream in the mind of
                    these individuals who believed that art, culture, and
                    youthful passion could create something extraordinary. With
                    this vision, they founded Team Sanskaran, laying the
                    cultural foundation of the university and bringing together
                    individuals who shared the same fire for creativity and
                    expression.
                  </p>

                  <p>
                    What started as a collective of passionate minds soon
                    evolved into a force that would redefine the cultural
                    landscape of the campus. From this vision emerged
                    Technosahotsava — a celebration not merely of performances,
                    but of identity, spirit, and artistic freedom. The historic
                    Technosahotsava 2017 marked the dawn of this legacy,
                    transforming a bold idea into a living tradition that
                    continues to inspire generations of students.
                  </p>

                  <p>
                    Their vision was never limited to organizing events; it was
                    about creating a platform where talent could rise,
                    creativity could flourish, and culture could be celebrated
                    in its purest form. Today, every stage that lights up, every
                    rhythm that echoes across the campus, and every artist who
                    steps forward carries forward the legacy of that original
                    dream.
                  </p>

                  <p>
                    Technosahotsava stands today not just as a festival, but as
                    a testament to the passion, determination, and cultural
                    spirit ignited by the founder who dared to imagine something
                    timeless.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BUILDERS */}
        <section
          id="builders"
          className="relative w-full min-h-screen py-60 px-10 md:pl-56 md:pr-20 bg-white text-black"
        >
          <div className="mb-4 font-medieval text-black/50 text-sm uppercase tracking-[0.8em]">
            Chapter_05
          </div>
          <h2 className="text-8xl md:text-[10vw] font-medieval leading-none tracking-tighter text-black mb-32">
            MEET THE TEAM.
          </h2>
          <div className="architects-grid grid grid-cols-2 md:grid-cols-5 gap-8 border-y-2 border-black/10 py-16 items-start">
            {[
              {
                name: "Pritha",
                id: "01",
                image: prithaPic,
                insta:
                  "https://www.instagram.com/_.p_r_i_t_h_a._?igsh=MWUxMHd6d2xpdndmcQ==",
                contact: "+91 76996 92411",
              },
              {
                name: "Ashoke",
                id: "02",
                image: ashokePic,
                insta:
                  "https://www.instagram.com/ashokemaity_?igsh=OTFqaGswdjY1ZnEx",
                contact: "+91 8597347423",
              },
              {
                name: "Rohit",
                id: "03",
                image: rohitPic,
                insta:
                  "https://www.instagram.com/rohit_kumar_samanta?igsh=d251NjhvM2Q5aXow",
                contact: "+91 6289 896197",
              },
              {
                name: "Shrayan",
                id: "04",
                image: shrayanPic,
                insta:
                  "https://www.instagram.com/shrayan._.music?igsh=MXNnc2UxaGJua2QzZw==",
                contact: "+91 70474 80580",
              },
              {
                name: "Shrijita",
                id: "05",
                image: shrijitaPic,
                insta:
                  "https://www.instagram.com/shree_chakraborty06?igsh=MXJ6d3Q4NHd1eG0zYw==",
              },
              {
                name: "Roshni",
                id: "06",
                image: roshniPic,
                insta:
                  "https://www.instagram.com/rosshniii18?igsh=MWo1bG43dDlzdmZ5dg==",
              },
              {
                name: "Shreyoshee",
                id: "07",
                image: shreyosheePic,
                insta:
                  "https://www.instagram.com/estella_seed_78?igsh=bWNjYm04ZWUyd2gz",
              },
              {
                name: "Subhadeep",
                id: "08",
                image: subhadeepPic,
                insta:
                  "https://www.instagram.com/s_u_b_h_a_d_e_e_p.1?igsh=M3R5Nzd0MXo0aXQ2",
              },
              {
                name: "Swastick",
                id: "09",
                image: swastickPic,
                insta:
                  "https://www.instagram.com/itz___swastick?igsh=MWNobXI2ZDVremxqOQ==",
              },
              {
                name: "Tathagata",
                id: "10",
                image: tathagataPic,
                insta:
                  "https://www.instagram.com/tathagat19?igsh=MWl2OTc2OHE4OHp3aA==",
              },
              {
                name: "Sanskar",
                id: "11",
                image: sanskarPic,
                insta:
                  "https://www.instagram.com/sanskar.2501?igsh=MzdlcWxwdThmY21i",
              },
            ].map((member, i) => {
              const isSanskar = member.name === "Sanskar";

              return (
                <div
                  key={member.id}
                  className={`architect-card flex flex-col shadow-sm bg-white ${
                    isSanskar ? "mt-8 md:mt-0" : ""
                  }`}
                >
                  <div className="aspect-[3/4] relative overflow-hidden">
                    <img
                      src={member.image}
                      className="w-full h-full object-cover transition-transform duration-1000 ease-in-out"
                      alt={member.name}
                    />
                  </div>

                  <div className="p-5 border-x border-b border-black/10 relative z-10 bg-white flex-1">
                    <p className="font-medieval text-2xl uppercase tracking-[0.1em] leading-tight mb-4 border-b border-black/10 pb-2">
                      {member.name}
                    </p>
                    <div className="flex flex-col gap-3">
                      <a
                        href={member.insta}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-black/50 hover:text-[#E4405F] transition-all duration-300 group/insta"
                      >
                        <svg
                          className="w-4 h-4 fill-current transition-transform group-hover/insta:rotate-12 group-hover/insta:scale-110"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                        <span className="font-outfit text-[10px] uppercase font-bold tracking-[0.3em]">
                          Instagram
                        </span>
                      </a>
                      {member.contact && (
                        <a
                          href={`tel:${member.contact.replace(/\s+/g, "")}`}
                          className="flex items-center gap-3 text-black/50 hover:text-green-600 transition-all duration-300 group/call"
                        >
                          <svg
                            className="w-4 h-4 fill-current transition-transform group-hover/call:scale-110 group-hover/call:-rotate-12"
                            viewBox="0 0 24 24"
                          >
                            <path d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z" />
                          </svg>
                          <span className="font-outfit text-[10px] uppercase font-bold tracking-[0.3em]">
                            {member.contact}
                          </span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* FINALE: THE DIVINE CROSSROADS */}
        <section
          id="destiny"
          className="relative min-h-screen bg-[#050505] py-40 px-6 md:px-20 overflow-hidden flex flex-col justify-between"
        >
          {/* Background Ambient Glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] bg-[#FFB464]/5 blur-[120px] rounded-full pointer-events-none" />

          <div className="relative z-10 w-full max-w-7xl mx-auto">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
              <div className="space-y-4">
                <div className="font-medieval text-[#FFB464] text-xs uppercase tracking-[1em] opacity-50">
                  Chapter_06
                </div>
                <h2 className="text-white font-medieval text-6xl md:text-[10vw] leading-none tracking-tighter">
                  MORE.
                </h2>
              </div>
              <p className="font-outfit text-white/30 text-xs md:text-sm uppercase tracking-[0.4em] max-w-xs text-right leading-relaxed">
                The journey does not end here. Explore more.
              </p>
            </div>

            {/* Modular Crossroads Grid: 5 Premium Cards */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 md:gap-6">
              {/* 1. Community (Large Feature) */}
              <div className="md:col-span-3 group relative text-left overflow-hidden bg-white/[0.03] border border-white/10 p-10 backdrop-blur-md transition-all duration-700 hover:border-[#FFB464]/50 hover:bg-white/[0.05]">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FFB464]/0 via-transparent to-[#FFB464]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div
                  className="relative z-10 flex flex-col h-full cursor-pointer"
                  onClick={() => navigate("/college-rep-registration")}
                >
                  <span className="font-medieval text-[#FFB464] text-[10px] uppercase tracking-[0.6em] mb-8 block">
                    01 / Community
                  </span>
                  <h3 className="font-medieval text-4xl text-white group-hover:translate-x-4 transition-transform duration-700 ease-out">
                    Become College Rep
                  </h3>
                  <div className="mt-12 h-[1px] w-12 bg-white/20 group-hover:w-full transition-all duration-1000 origin-left" />
                </div>

                {/* Secure Download Trigger for Reference List */}
                {collegeReferenceUrl && (
                  <div className="absolute bottom-10 right-10 z-20">
                    <a
                      href={collegeReferenceUrl}
                      download="Sahotsava_Institution_Registry_Reference.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-1.5 border border-[#FFB464]/20 hover:border-[#FFB464]/50 bg-[#FFB464]/5 hover:bg-[#FFB464]/10 transition-all text-[8px] uppercase tracking-[0.3em] text-[#FFB464]/40 hover:text-[#FFB464] no-underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      Reference List
                    </a>
                  </div>
                )}
              </div>

              {/* 2. Literature */}
              <button
                onClick={() =>
                  officialBrochureUrl
                    ? window.open(officialBrochureUrl, "_blank")
                    : toast.info("Brochure releasing soon!")
                }
                className="md:col-span-3 group relative text-left overflow-hidden bg-white/[0.03] border border-white/10 p-10 backdrop-blur-md transition-all duration-700 hover:border-[#FFB464]/50 hover:bg-white/[0.05]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#FFB464]/0 via-transparent to-[#FFB464]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <span className="relative z-10 font-medieval text-[#FFB464] text-[10px] uppercase tracking-[0.6em] mb-8 block">
                  02 / Literature
                </span>
                <h3 className="relative z-10 font-medieval text-4xl text-white group-hover:translate-x-4 transition-transform duration-700 ease-out">
                  Official Brochure
                </h3>
                <div className="mt-12 h-[1px] w-12 bg-white/20 group-hover:w-full transition-all duration-1000 origin-left" />
              </button>

              {/* 4. Allies */}
              <button
                onClick={() => setIsWarping(true)}
                className="md:col-span-2 group relative text-left overflow-hidden bg-white/[0.03] border border-white/10 p-10 backdrop-blur-md transition-all duration-700 hover:border-[#FFB464]/50 hover:bg-white/[0.05]"
              >
                <span className="relative z-10 font-medieval text-[#FFB464] text-[10px] uppercase tracking-[0.6em] mb-8 block">
                  04 / Allies
                </span>
                <h3 className="relative z-10 font-medieval text-3xl text-white group-hover:translate-x-4 transition-transform duration-700">
                  Our Sponsors
                </h3>
                <div className="mt-12 h-[1px] w-12 bg-white/20 group-hover:w-full transition-all duration-1000 origin-left" />
              </button>

              {/* 5. Presence */}
              <div className="md:col-span-2 group relative overflow-hidden bg-white/[0.03] border border-white/10 p-10 backdrop-blur-md transition-all duration-700 hover:border-[#FFB464]/50 hover:bg-white/[0.05]">
                <span className="relative z-10 font-medieval text-[#FFB464] text-[10px] uppercase tracking-[0.6em] mb-8 block">
                  05 / Presence
                </span>
                <h3 className="relative z-10 font-medieval text-3xl text-white mb-6">
                  Our Socials
                </h3>

                <div className="relative z-10 space-y-4">
                  <a
                    href="https://instagram.com/technosahotsava"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-white/40 hover:text-pink-500 transition-colors"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                    <span className="font-outfit text-xs uppercase tracking-widest font-bold">
                      Instagram
                    </span>
                  </a>
                  <div className="flex flex-col gap-1">
                    <span
                      className="font-outfit text-xs text-white/60 select-all cursor-text py-2 px-3 bg-white/5 border border-white/5 rounded block"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          "technosahotsava@gmail.com",
                        );
                      }}
                    >
                      technosahotsava@gmail.com
                    </span>
                    <span className="text-[8px] text-white/20 uppercase tracking-widest pl-1">
                      Click to select (or copy)
                    </span>
                  </div>
                </div>
                <div className="mt-8 h-[1px] w-12 bg-white/20 group-hover:w-full transition-all duration-1000 origin-left" />
              </div>

              {/* 5. Architect (Developer - New) */}
              <button
                onClick={() => navigate("/developers")}
                className="md:col-span-2 group relative text-left overflow-hidden bg-[#FFB464]/5 border border-[#FFB464]/20 p-10 backdrop-blur-md transition-all duration-700 hover:border-[#FFB464] hover:bg-[#FFB464]/10"
              >
                <span className="relative z-10 font-medieval text-[#FFB464] text-[10px] uppercase tracking-[0.6em] mb-8 block">
                  06 / Architect
                </span>
                <h3 className="relative z-10 font-medieval text-3xl text-white group-hover:translate-x-4 transition-transform duration-700">
                  The Developers
                </h3>
                <div className="mt-12 h-[1px] w-12 bg-[#FFB464]/30 group-hover:w-full transition-all duration-1000 origin-left" />
              </button>
            </div>
          </div>


          {/* MINIMALIST IDENTITY FOOTER (Redesigned for balance) */}
          <div className="relative z-10 w-full max-w-7xl mx-auto pt-12 pb-4 border-t border-white/5 mt-10 translate-y-[-0px]">
            <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-16">
              {/* Left Identity: Institutional (Techno India) */}
              <div className="flex flex-col items-center md:items-start group cursor-default">
                <div className="flex items-center gap-6 mb-4 p-2 bg-white/5 rounded-lg border border-white/10">
                  <img
                    loading="lazy"
                    src={sofTigLogo}
                    className="h-6 md:h-12 w-auto object-contain"
                    alt="Techno India Logo"
                  />
                </div>
              </div>

              {/* Center Branding: The Copyright Statement */}
              <div className="flex flex-col items-center gap-4">
                <p className="font-outfit text-[9px] md:text-[10px] text-white/20 uppercase tracking-[0.4em] leading-relaxed text-center max-w-md">
                  &copy; 2026 techno sahosava. All rights Reserved | created
                  with passion by Team Sanskaran
                </p>
                <div className="flex items-center gap-6 opacity-40">
                  <div className="h-[1px] w-8 bg-white/20" />
                  <div className="w-1 h-1 rounded-full bg-[#FFB464]" />
                  <div className="h-[1px] w-8 bg-white/20" />
                </div>
              </div>

              {/* Right Identity: Creative & Event Cluster */}
              <div className="flex flex-col items-center md:items-end group cursor-default">
                <div className="flex items-center gap-4 md:gap-8 mb-6 bg-white/5 p-4 rounded-xl border border-white/10">
                  <img
                    loading="lazy"
                    src={sahotsavaLogo}
                    className="h-6 md:h-12 w-auto object-contain"
                    alt="Sahotsava logo"
                  />
                  <div className="h-6 w-[1px] bg-white/20" />
                  <img
                    loading="lazy"
                    src={sanskaranLogo}
                    className="h-10 md:h-18 w-auto object-contain"
                    alt="Team Sanskaran"
                  />
                  <div className="h-6 w-[1px] bg-white/20" />
                  <img
                    loading="lazy"
                    src={cameraLogo}
                    className="h-10 md:h-12 w-auto object-contain"
                    alt="Camera"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* HYPERSPACE WRAP - Moved here to prevent PIN reconciliation errors */}
      {isWarping && (
        <div className="fixed inset-0 z-[10000] bg-black flex items-center justify-center">
          <video
            autoPlay
            muted
            onEnded={() => setTimeout(() => navigate("/sponsors"), 0)}
            onError={() => setTimeout(() => navigate("/sponsors"), 0)}
            className="absolute inset-0 w-full h-full object-cover"
            src={loadingVideo}
          />
        </div>
      )}

      <style>{`
        .animate-marquee {
          display: flex;
          animation: marquee 60s linear infinite;
          width: fit-content;
        }

        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        ::-webkit-scrollbar { display: none; }
        html { -ms-overflow-style: none; scrollbar-width: none; }
        
        .transition-strip {
          border-left: 1px solid rgba(255,255,255,0.02);
          will-change: transform;
        }
        .architect-card, .leader-circle, .founder-content { opacity: 1 !important; }

        .preloader-vertical-stack {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: clamp(1.5rem, 6vh, 4rem);
          z-index: 50;
          text-align: center;
        }

        .logo-tiu-top {
          width: 190px;
          height: auto;
          opacity: 0.9;
          filter: drop-shadow(0 0 15px rgba(255,255,255,0.1));
        }

        .logo-sahotsava-mid {
          width: 280px;
          height: auto;
          filter: drop-shadow(0 0 30px rgba(0,0,0,0.5));
        }

        .festival-title-text {
          font-family: 'Cinzel', serif;
          font-weight: 900;
          font-size: clamp(1.2rem, 5vw, 2rem);
          color: #fff;
          letter-spacing: 0.4em;
          text-transform: uppercase;
        }

        .year-anim-span {
          color: #FFB464;
          display: inline-block;
          min-width: 4ch;
          text-shadow: 0 0 20px rgba(255, 180, 100, 0.4);
        }

        .sanskaran-reveal-box {
          display: flex;
          align-items: center;
          gap: 25px;
          opacity: 0;
          transform: translateY(10px);
          transition: all 1.2s cubic-bezier(0.19, 1, 0.22, 1);
        }

        .sanskaran-reveal-box.active {
          opacity: 1;
          transform: translateY(0);
        }

        .logo-sanskaran-massive {
          height: 130px; 
          width: auto;
          filter: drop-shadow(0 0 30px rgba(255,255,255,0.3));
          transition: transform 0.5s ease;
        }

        .logo-sanskaran-massive:hover {
          transform: scale(1.08);
        }

        .system-loading-bar-wrap {
          position: absolute;
          bottom: 10vh;
          left: 50%;
          transform: translateX(-50%);
          width: 250px;
          height: 1px;
          background: rgba(255,255,255,0.1);
          overflow: hidden;
        }

        .system-loading-bar-fill {
          height: 100%;
          background: #fff;
          box-shadow: 0 0 10px #fff;
          transition: width 0.3s linear;
        }
        
        .pb-label {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: 1.2rem;
          color: rgba(255,255,255,0.5);
        }

        .logo-sanskaran-small-reveal {
          height: 40px;
          width: auto;
          filter: drop-shadow(0 0 15px rgba(255,255,255,0.2));
        }

        .fake-loading-wall {
          position: absolute;
          inset: 0;
          z-index: 10;
          pointer-events: none;
          opacity: 0.2;
        }

        .fake-load-item {
          position: absolute;
          font-family: 'Courier New', monospace;
          font-size: 0.7rem;
          color: #fff;
          white-space: nowrap;
          animation: fakeFloat 4s infinite linear both;
          letter-spacing: 0.1em;
        }

        @keyframes fakeFloat {
          0% { transform: translateY(20px); opacity: 0; }
          20% { opacity: 0.3; }
          80% { opacity: 0.3; }
          100% { transform: translateY(-30px); opacity: 0; }
        }

        .enter-reveal-box {
          margin-top: 2rem;
          opacity: 0;
          transform: scale(0.9);
          transition: all 0.8s cubic-bezier(0.19, 1, 0.22, 1);
        }

        .enter-reveal-box.active {
          opacity: 1;
          transform: scale(1);
        }

        .btn-final-enter {
          background: #fff;
          border: none;
          padding: 1.2rem 6rem;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: all 0.4s ease;
          border-radius: 4px;
        }

        .btn-final-enter:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 40px rgba(255,255,255,0.3);
        }

        .enter-text-main {
          font-family: 'Cinzel', serif;
          font-weight: 900;
          color: #000;
          font-size: 1.1rem;
          letter-spacing: 0.4em;
          text-transform: uppercase;
        }

        .cultural-glow-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
        }

        .g-red {
          position: absolute;
          top: -10%; left: -10%; width: 50vw; height: 50vh;
          background: radial-gradient(circle, rgba(220,38,38,0.1), transparent 70%);
          filter: blur(80px);
        }

        .g-blue {
          position: absolute;
          bottom: -10%; right: -10%; width: 50vw; height: 50vh;
          background: radial-gradient(circle, rgba(37,99,235,0.1), transparent 70%);
          filter: blur(80px);
        }

        .timeline-track.nav-black .divine-totem {
          border-color: #000 !important;
        }

        .timeline-track.nav-black .totem-eye {
          background: #000 !important;
        }

        .timeline-track.subs-black .sub-label {
          color: #000;
        }

        .timeline-track.subs-black .sub-dot {
          background: #000;
        }

        .timeline-track {
          padding-bottom: 50px;
        }

        .chapter-marker-group {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 12px;
          z-index: 1002;
        }

        .sub-point {
          display: flex;
          align-items: center;
          gap: 15px;
          opacity: 0.4;
          transition: all 0.4s ease;
        }

        .sub-point:hover {
          opacity: 1;
        }

        .marker-dot {
          width: 8px;
          height: 8px;
          background: #FFB464;
          border-radius: 2px; /* Zine-style square dots */
          transform: rotate(45deg);
        }

        .sub-label {
          font-family: 'Outfit', sans-serif;
          font-size: 10px;
          font-weight: 800;
          color: #fff;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .sahotsava-reveal-box, .title-reveal-box {
          opacity: 0;
          transform: translateY(20px);
          transition: transform 1s ease, opacity 0.3s ease;
        }

        .tiu-reveal.active, .sahotsava-reveal-box.active, .title-reveal-box.active {
          opacity: 1;
          transform: translateY(0);
        }

        .sahotsava-reveal-box.active { transition-delay: 0s; }
        .title-reveal-box.active { transition-delay: 0s; }
      `}</style>
    </div>
  );
}

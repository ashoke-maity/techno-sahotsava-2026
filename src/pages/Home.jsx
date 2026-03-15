import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import API from "../services/api";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";

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
import chitrakaLogo from "../assets/logos/Chitraka white logo.png";
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
        <img loading="lazy"
          key={i}
          src={img}
          className={`absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-1000 ease-in-out ${i === currentImgIndex
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
  const shouldSkipLoading = hasPlayedLoading || location.state?.skipLoading;
  
  // Update the global flag if we are skipping via location state
  if (location.state?.skipLoading) {
    hasPlayedLoading = true;
  }

  const [loading, setLoading] = useState(!shouldSkipLoading);
  const [heroSplit, setHeroSplit] = useState(shouldSkipLoading);
  const [year, setYear] = useState(shouldSkipLoading ? 2026 : 2015);
  const [isPreloaderComplete, setIsPreloaderComplete] = useState(false);
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [resultMode, setResultMode] = useState(false);
  const [isWarping, setIsWarping] = useState(false);

  const navigate = useNavigate();
  const lenisRef = useRef(null);
  const totemRef = useRef(null);
  const timelineProgressRef = useRef(null);
  const galleryRef = useRef(null);
  const [showEnterButton, setShowEnterButton] = useState(false);
  const [isRepFormOpen, setIsRepFormOpen] = useState(false);

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

    const fetchStatus = async () => {
      try {
        const response = await API.get(
          `${serverOrigin}/technoSahotsava2026/admin/registration-status?t=${Date.now()}`,
        );
        setRegistrationOpen(response.data.registration_open);
        setResultMode(response.data.result_mode);
      } catch (err) {
        // Log suppressed
      }
    };
    fetchStatus();

    const socket = io(serverOrigin);
    socket.on("registrationStatusUpdate", (data) =>
      setRegistrationOpen(data.registration_open),
    );
    socket.on("resultModeUpdate", (data) =>
      setResultMode(data.result_mode),
    );
    return () => socket.disconnect();
  }, []);

  // ─── WARP NAVIGATION FALLBACK ────────────────────────────────────────────────
  useEffect(() => {
    if (isWarping) {
      const timer = setTimeout(() => {
        navigate("/sponsors");
      }, 5000); // 5 seconds fallback
      return () => clearTimeout(timer);
    }
  }, [isWarping, navigate]);

  // ─── SIMPLE 2D PRELOADER Logic ───
  useEffect(() => {
    if (!loading) return;
    let start = 2015;
    const duration = 6000; // 6 seconds for the count
    const interval = duration / (2026 - 2015);
    
    const timer = setInterval(() => {
      start += 1;
      if (start >= 2026) {
        start = 2026;
        clearInterval(timer);
        setIsPreloaderComplete(true);
        setShowEnterButton(true);
      }
      setYear(start);
    }, interval);

    return () => clearInterval(timer);
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
          end: () => `+=${window.innerHeight * 5 + (galleryRef.current?.scrollWidth || 0)}`,
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
        .to(".hero-portal-content", { autoAlpha: 0, duration: 0.1, ease: "none" }, 0)
        .to(".main-skull", { autoAlpha: 0, duration: 0.2, ease: "power1.in" }, 0)
        
        // Establish new scenery instantly beneath the sliding faces
        .to(".about-reveal-bg", { autoAlpha: 1, duration: 0.2, ease: "none" }, 0)
        
        // STAGE 2: Cleanup and focus
        .to(".hero-bottom-mask", { autoAlpha: 0, duration: 0.2, ease: "none" }, 0)

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
        .fromTo(".transition-strip", 
          { yPercent: 100 },
          {
            yPercent: 0,
            stagger: {
              each: 0.08,
              from: "start"
            },
            duration: 1.5,
            ease: "power2.inOut"
          }
        )
        // B. Old Dimension Dissolve (Fades as scenery is established)
        .to(".about-reveal-layer", {
          opacity: 0,
          duration: 1.2,
          ease: "power1.in"
        }, 2.0)

        // C. Gallery Content emerges ONCE background is solidly formed
        .to(".gallery-header, .gallery-container", {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 1.2,
          ease: "power3.out"
        }, 2.5) // Significant delay to ensure slices have finished their primary travel
        .set(".about-reveal-layer", { display: "none" })

        // C. The Realization (Switching from Shutter background to real background)
        .to(".gallery-bg-container", { opacity: 1, duration: 0.5 })
        .set(".transition-strips-layer", { display: "none" })

        // D. The Horizontal Explorer
        .to(galleryRef.current, {
          x: () => -(galleryRef.current.scrollWidth - window.innerWidth),
          ease: "none",
          duration: 10
        })
        // G. Final transition to Highlights
        .to(".gallery-header, .gallery-container, .gallery-bg-container", {
          opacity: 0,
          scale: 0.8,
          filter: "blur(100px)",
          duration: 1.5,
          ease: "power2.in",
        })
        .to(".gallery-final-highlight", {
          opacity: 1,
          scale: 1,
          duration: 1.5,
          ease: "power4.out",
        }, "-=1.5")
        .fromTo(
          ".gallery-final-highlight img",
          { scale: 2.2, filter: "brightness(0) contrast(4)" },
          {
            scale: 1,
            filter: "brightness(1) contrast(1)",
            duration: 1.5,
          },
          "<"
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
        },
        y: 60,
        opacity: 0,
        stagger: 0.1,
        duration: 1.2,
        ease: "power3.out",
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
        <div id="preloader-wrapper" className={heroSplit ? "exit" : ""}>
          <div id="year-wrap-preloader" style={{ 
            opacity: isPreloaderComplete ? 0 : 1, 
            visibility: isPreloaderComplete ? 'hidden' : 'visible',
            transform: `translate(-50%, -50%) scale(${isPreloaderComplete ? 1.2 : 1})`,
            transition: 'all 0.8s ease'
          }}>
            <div id="year-num-preloader">{year}</div>
          </div>
          
          <div id="timeline-wrap-preloader" style={{ 
            opacity: isPreloaderComplete ? 0 : 1, 
            visibility: isPreloaderComplete ? 'hidden' : 'visible',
            transition: 'opacity 0.6s ease' 
          }}>
            <div id="tl-track-preloader">
              <div id="tl-fill-preloader" style={{ width: `${((year - 2015) / (2026 - 2015)) * 100}%` }} />
            </div>
          </div>

          <div id="enter-wrap-preloader" className={showEnterButton ? "show" : ""}>
            <button id="enter-btn-preloader" onClick={handleEnter}>
              <div className="epulse"></div><div className="epulse"></div><div className="epulse"></div>
              <div className="ebi">
                <div className="ebc tl"></div><div className="ebc br"></div>
                <div className="esh"></div>
                <span className="etx">Enter</span>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* 1. COORDINATED TIMELINE NAVIGATION TRACK */}
      <div className="timeline-track hidden md:block">
        <div ref={timelineProgressRef} className="timeline-progress" />

        {/* traveling totem */}
        <div ref={totemRef} className="divine-totem top-0">
          <div className="totem-eye" />
        </div>

        {/* navigational chapters */}
        <div className="absolute inset-0 flex flex-col justify-between py-10">
          <div
            className="chapter-marker cursor-pointer"
            onClick={() => scrollToSection("hero")}
          >
            <div className="marker-dot" />
            <span className="marker-label">00 START</span>
          </div>
          <div
            className="chapter-marker cursor-pointer"
            onClick={() => scrollToSection("hero")}
          >
            <div className="marker-dot" />
            <span className="marker-label">01 ABOUT</span>
          </div>
          <div
            className="chapter-marker cursor-pointer"
            onClick={() => scrollToSection("era2")}
          >
            <div className="marker-dot" />
            <span className="marker-label">02 GALLERY</span>
          </div>
          <div
            className="chapter-marker cursor-pointer"
            onClick={() => scrollToSection("leaders")}
          >
            <div className="marker-dot" />
            <span className="marker-label">03 LEADERS</span>
          </div>
          <div
            className="chapter-marker cursor-pointer"
            onClick={() => scrollToSection("founder")}
          >
            <div className="marker-dot" />
            <span className="marker-label">04 FOUNDER</span>
          </div>
          <div
            className="chapter-marker cursor-pointer"
            onClick={() => scrollToSection("builders")}
          >
            <div className="marker-dot" />
            <span className="marker-label">05 TEAM</span>
          </div>
          <div
            className="chapter-marker cursor-pointer"
            onClick={() => scrollToSection("destiny")}
          >
            <div className="marker-dot" />
            <span className="marker-label">06 MORE</span>
          </div>
        </div>
      </div>

      <main
        className={`relative z-10 transition-opacity duration-1000 ${loading ? "opacity-0 invisible" : "opacity-100 visible"}`}
      >
        {/* HERO: SACRED SKULL PORTAL */}
        <section id="hero" className="hero-section hero-portal">
          {/* Background illustration */}
          <img loading="lazy"
            src={skullBg}
            className="hero-bg-illo grayscale-[80%]"
            alt="Void"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black z-[2]" />

          {/* The Bottom Mask (Hides sharp neck lines) */}
          <div className="hero-bottom-mask" />

          {/* Main Center Skull (Skull Pro) */}
          <img loading="lazy"
            src={mainSkullImg}
            className="main-skull"
            alt="The Core"
            style={{
              opacity: 1,
              transform: "translateX(-50%) scale(1.1)",
            }}
          />

          {/* Hugging Faces (Split-Face Reveal - framing the center) */}
          <img loading="lazy"
            src={leftFaceImg}
            className="hero-face face-left"
            style={{
              left: 0,
              transform: "translateX(-1%)",
            }}
            alt="Left Protector"
          />
          <img loading="lazy"
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
            
            {/* SLOT 1: SAHOTSAVA LOGO (Adjust positioning freely here) */}
            <div className="relative translate-y-70 translate-x-[-15vw] mb-6">
              <img loading="lazy" 
                src={sahotsavaLogo}
                className="h-24 md:h-32 lg:h-40 xl:h-48 w-auto object-contain drop-shadow-[0_0_30px_rgba(255,180,100,0.4)] transition-all duration-700"
                alt="Sahotsava Logo"
              />
            </div>

            {/* SLOT 2: TECHNO SAHOTSAVA TITLE (Adjust positioning freely here) */}
            <div className="relative translate-y-25">
              <img loading="lazy"
                src={titleFont}
                className="h-[50vh] md:h-[60vh] lg:h-[70vh] xl:h-[75vh] 2xl:h-[80vh] w-auto object-contain drop-shadow-[0_0_120px_rgba(255,180,100,0.6)] transition-all duration-700"
                alt="Sahotsava"
              />
            </div>

            {/* SLOT 3: REGISTER / VIEW RESULT BUTTON (Adjust positioning freely here) */}
            <div className="relative translate-y-[-60px] mt-8">
              {resultMode ? (
                <button
                  onClick={() => navigate('/hall-of-fame')}
                  className="ml-[0vw] md:ml-[1.2vw] px-8 md:px-10 py-3 border-2 border-[#FFB464] text-black bg-[#FFB464] font-bungee text-base md:text-lg hover:bg-black hover:text-[#FFB464] transition-all shadow-[0_0_50px_rgba(255,180,100,0.5)] zine-border-accent animate-pulse"
                >
                  View Result !
                </button>
              ) : registrationOpen ? (
                <a
                  href={import.meta.env.VITE_REGISTER_URL}
                  className="ml-[0vw] md:ml-[1.2vw] px-8 md:px-10 py-3 border-2 border-[#FFB464] text-white bg-black/40 backdrop-blur-md font-bungee text-base md:text-lg hover:bg-[#FFB464] hover:text-black transition-all shadow-2xl zine-border-accent"
                >
                  Register Now !
                </a>
              ) : (
                <div className="px-10 py-3 border border-white/10 bg-black/60 backdrop-blur-sm text-[#FFB464]/30 font-bungee text-sm lg:text-base tracking-[0.5em] select-none">
                  Opening soon !
                </div>
              )}
            </div>

            <div className="absolute bottom-10 opacity-30">
              <span className="font-medieval font-bold text-[#FFB464] text-[8px] tracking-[0.5em] uppercase">
                Scroll Down
              </span>
            </div>
          </div>

          {/* IN-PLACE REVEAL: THE ABOUT CONTENT */}
          <div className="about-reveal-layer absolute inset-0 z-[100]">
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
                  University, stands as a distinguished celebration of artistic
                  excellence, cultural diversity, and transformative expression.
                  Curated and hosted by Team Sanskaran, the official cultural
                  club of the university, the fest reflects a commitment to
                  nurturing creativity, leadership, and collaborative spirit
                  among students. This year’s theme, “Metamorphosis of Divine,”
                  reflects the spirit of transformation, growth, and elevated
                  expression that defines Technosahotsava 2026. It symbolizes
                  the journey of evolving from potential to excellence, from
                  imagination to realization. The theme embodies the belief that
                  within every individual lies a spark of brilliance that, when
                  nurtured through art, culture, and collaboration, transforms
                  into something extraordinary. Through this concept,
                  Technosahotsava celebrates the power of change, creativity,
                  and the continuous evolution of talent into its most refined
                  and impactful form. Technosahotsava 2026 is envisioned as a
                  platform where talent transcends boundaries, ideas converge,
                  and creativity transforms into meaningful expression. Through
                  this theme, the fest celebrates growth, resilience, and the
                    continuous evolution of excellence, making it not just an
                  event, but an inspiring experience of transformation and
                  unity.
                </p>
              </div>
            </div>
          </div>

          {/* IN-PLACE REVEAL: THE GALLERY CONTENT (CHAPTER 02) */}
          <div className="gallery-reveal-layer absolute inset-0 opacity-0 pointer-events-none flex flex-col justify-center overflow-hidden z-[300]">
            {/* Section Background with Overlay (Starts Hidden) */}
            <div className="gallery-bg-container absolute inset-0 z-0 opacity-0">
              <img loading="lazy"
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
                [g14, g10, g6]
              ].map((imgGroup, i) => (
                <GalleryCard key={i} images={imgGroup} index={i} />
              ))}
            </div>
            {/* FINAL HIGHLIGHT - SEPARATE FROM ROWS */}
            <div className="gallery-final-highlight absolute inset-0 z-[100] flex items-center justify-center opacity-0 pointer-events-none bg-black">
              <div className="w-[85vw] md:w-[70vw] aspect-video relative overflow-hidden ring-2 ring-[#FFB464] shadow-[0_0_150px_rgba(255,180,100,0.6)] rounded-sm">
                <img loading="lazy"
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
                  <img loading="lazy" 
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
                  <img loading="lazy"
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
                  <img loading="lazy"
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
                  <img loading="lazy"
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
                    these individuals who believed that art, culture, and youthful
                    passion could create something extraordinary. With this
                    vision, they founded Team Sanskaran, laying the cultural
                    foundation of the university and bringing together
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
                    spirit ignited by the founder who dared to imagine
                    something timeless.
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
          <div className="architects-grid grid grid-cols-2 md:grid-cols-5 gap-4 border-y-2 border-black/10">
            {[
              {
                name: "Pritha",
                id: "01",
                image: prithaPic,
                insta: "pritha_sh",
              },
              {
                name: "Ashoke",
                id: "02",
                image: ashokePic,
                insta: "ashoke_dev",
              },
              { name: "Rohit", id: "03", image: rohitPic, insta: "rohit_art" },
              {
                name: "Roshni",
                id: "04",
                image: roshniPic,
                insta: "roshni_cre",
              },
              {
                name: "Shrijita",
                id: "05",
                image: shrijitaPic,
                insta: "shri_jita",
              },
              {
                name: "Shrayan",
                id: "06",
                image: shrayanPic,
                insta: "shrayan_p",
              },
              {
                name: "Shreyoshee",
                id: "07",
                image: shreyosheePic,
                insta: "shreyo_shee",
              },
              {
                name: "Subhadeep",
                id: "08",
                image: subhadeepPic,
                insta: "subha_deep",
              },
              {
                name: "Swastick",
                id: "09",
                image: swastickPic,
                insta: "swas_tick",
              },
              {
                name: "Tathagata",
                id: "10",
                image: tathagataPic,
                insta: "tathagata_v",
              },
              {
                name: "Sanskar",
                id: "11",
                image: sanskarPic,
                insta: "sanskar_01",
              },
            ].map((member, i) => (
              <div
                key={member.id}
                className="architect-card aspect-[3/4] relative overflow-hidden bg-gray-100 group"
              >
                <img loading="lazy"
                  src={member.image}
                  className="w-full h-full object-cover"
                  alt={member.name}
                />
                <div className="absolute inset-x-0 bottom-0 p-4 opacity-100">
                  <div className="bg-white p-3 border border-black shadow-[2px_2px_0_#000]">
                    <p className="font-medieval text-xl uppercase tracking-tighter leading-tight whitespace-normal">
                      {member.name}
                    </p>
                    <a
                      href={`https://instagram.com/${member.insta}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 mt-1 text-black/40 hover:text-pink-600 transition-colors"
                    >
                      <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                      <span className="font-outfit text-[8px] uppercase font-bold tracking-widest">
                        Instagram
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
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
                The journey does not end here. Explore the peripheral dimensions of the civilization.
              </p>
            </div>

            {/* Modular Crossroads Grid: 5 Premium Cards */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 md:gap-6">
              
              {/* 1. Community (Large Feature) */}
              <button 
                onClick={() => navigate('/college-rep-registration')}
                className="md:col-span-4 group relative text-left overflow-hidden bg-white/[0.03] border border-white/10 p-10 backdrop-blur-md transition-all duration-700 hover:border-[#FFB464]/50 hover:bg-white/[0.05]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#FFB464]/0 via-transparent to-[#FFB464]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <span className="relative z-10 font-medieval text-[#FFB464] text-[10px] uppercase tracking-[0.6em] mb-8 block">01 / Community</span>
                <h3 className="relative z-10 font-medieval text-4xl md:text-5xl text-white group-hover:translate-x-4 transition-transform duration-700 ease-out">Become College Rep</h3>
                <div className="mt-12 h-[1px] w-12 bg-white/20 group-hover:w-full transition-all duration-1000 origin-left" />
              </button>

              {/* 2. Literature */}
              <button 
                onClick={() => alert("Coming soon !")}
                className="md:col-span-2 group relative text-left overflow-hidden bg-white/[0.03] border border-white/10 p-10 backdrop-blur-md transition-all duration-700 hover:border-[#FFB464]/50 hover:bg-white/[0.05]"
              >
                <span className="relative z-10 font-medieval text-[#FFB464] text-[10px] uppercase tracking-[0.6em] mb-8 block">02 / Literature</span>
                <h3 className="relative z-10 font-medieval text-3xl text-white group-hover:translate-x-4 transition-transform duration-700">Preview Brochure</h3>
                <div className="mt-12 h-[1px] w-12 bg-white/20 group-hover:w-full transition-all duration-1000 origin-left" />
              </button>

              {/* 3. Allies */}
              <button onClick={() => setIsWarping(true)} className="md:col-span-2 group relative text-left overflow-hidden bg-white/[0.03] border border-white/10 p-10 backdrop-blur-md transition-all duration-700 hover:border-[#FFB464]/50 hover:bg-white/[0.05]">
                <span className="relative z-10 font-medieval text-[#FFB464] text-[10px] uppercase tracking-[0.6em] mb-8 block">03 / Allies</span>
                <h3 className="relative z-10 font-medieval text-3xl text-white group-hover:translate-x-4 transition-transform duration-700">Our Sponsors</h3>
                <div className="mt-12 h-[1px] w-12 bg-white/20 group-hover:w-full transition-all duration-1000 origin-left" />
              </button>

              {/* 4. Presence */}
              <div className="md:col-span-2 group relative overflow-hidden bg-white/[0.03] border border-white/10 p-10 backdrop-blur-md transition-all duration-700 hover:border-[#FFB464]/50 hover:bg-white/[0.05]">
                <span className="relative z-10 font-medieval text-[#FFB464] text-[10px] uppercase tracking-[0.6em] mb-8 block">04 / Presence</span>
                <h3 className="relative z-10 font-medieval text-3xl text-white mb-6">Our Socials</h3>
                
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
                    <span className="font-outfit text-xs uppercase tracking-widest font-bold">Instagram</span>
                  </a>
                  <div className="flex flex-col gap-1">
                    <span 
                      className="font-outfit text-xs text-white/60 select-all cursor-text py-2 px-3 bg-white/5 border border-white/5 rounded block"
                      onClick={() => {
                        navigator.clipboard.writeText("technosahotsava@gmail.com");
                      }}
                    >
                      technosahotsava@gmail.com
                    </span>
                    <span className="text-[8px] text-white/20 uppercase tracking-widest pl-1">Click to select (or copy)</span>
                  </div>
                </div>
                <div className="mt-8 h-[1px] w-12 bg-white/20 group-hover:w-full transition-all duration-1000 origin-left" />
              </div>

              {/* 5. Architect (Developer - New) */}
              <button 
                onClick={() => navigate('/developers')}
                className="md:col-span-2 group relative text-left overflow-hidden bg-[#FFB464]/5 border border-[#FFB464]/20 p-10 backdrop-blur-md transition-all duration-700 hover:border-[#FFB464] hover:bg-[#FFB464]/10"
              >
                <span className="relative z-10 font-medieval text-[#FFB464] text-[10px] uppercase tracking-[0.6em] mb-8 block">05 / Architect</span>
                <h3 className="relative z-10 font-medieval text-3xl text-white group-hover:translate-x-4 transition-transform duration-700">The Developers</h3>
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
                  <img loading="lazy" src={sofTigLogo} className="h-6 md:h-12 w-auto object-contain" alt="Techno India Logo" />
                </div>
              </div>

              {/* Center Branding: The Copyright Statement */}
              <div className="flex flex-col items-center gap-4">
                <p className="font-outfit text-[9px] md:text-[10px] text-white/20 uppercase tracking-[0.4em] leading-relaxed text-center max-w-md">
                  &copy; 2026 techno sahosava. All rights Reserved | created with passion by Team Sanskaran
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
                  <img loading="lazy" 
                    src={sahotsavaLogo} 
                    className="h-6 md:h-12 w-auto object-contain" 
                    alt="Sahotsava logo" 
                  />
                  <div className="h-6 w-[1px] bg-white/20" />
                  <img loading="lazy" 
                    src={sanskaranLogo} 
                    className="h-10 md:h-18 w-auto object-contain" 
                    alt="Team Sanskaran" 
                  />
                  <div className="h-6 w-[1px] bg-white/20" />
                  <img loading="lazy" 
                    src={chitrakaLogo} 
                    className="h-10 md:h-12 w-auto object-contain" 
                    alt="Chitraka" 
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
        ::-webkit-scrollbar { display: none; }
        html { -ms-overflow-style: none; scrollbar-width: none; }
        
        .transition-strip {
          border-left: 1px solid rgba(255,255,255,0.02);
          will-change: transform;
        }
      `}</style>
    </div>
  );
}

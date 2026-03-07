import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import API from "../services/api";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";

// Assets
import background from "../assets/backgrounds/MetamorphosisByShubho.webp";
import skullBg from "../assets/backgrounds/3. BGwithIllustrations.webp";
import leftFaceImg from "../assets/backgrounds/Left skull.webp";
import rightFaceImg from "../assets/backgrounds/RS3.webp";
import mainSkullImg from "../assets/backgrounds/Skull pro.webp";

import titleFont from "../assets/backgrounds/Untitled35_20260106001225.png";
import ThemeOT from "../assets/backgrounds/ATTOT.png";
import GalleryOT from "../assets/backgrounds/GalleryOT.png";
import TeamOT from "../assets/backgrounds/MTT.OT.png";
import loadingVideo from "../assets/loading_screen/loading_anim.mp4";
import theOneByShubho from "../assets/backgrounds/TheOneByShubho.webp";
import bg6 from "../assets/backgrounds/6.webp";

// History Visuals
import history1 from "../assets/metamorphosis_history_1_1772869952824.png";
import history2 from "../assets/metamorphosis_history_2_1772869971414.png";
import history3 from "../assets/metamorphosis_history_3_1772869986161.png";

// Team Pics
import prithaPic from "../assets/team_pics/pritha.jpeg";
import ashokePic from "../assets/team_pics/ashoke.jpg";
import rohitPic from "../assets/team_pics/rohit.jpeg";
import roshniPic from "../assets/team_pics/roshni.jpeg";
import shrijitaPic from "../assets/team_pics/shrijita.png";
import shrayanPic from "../assets/team_pics/shrayan.jpeg.png";
import shreyosheePic from "../assets/team_pics/shreyoshee.jpeg";
import subhadeepPic from "../assets/team_pics/shubhadeep.jpeg";
import swastickPic from "../assets/team_pics/swastick.jpeg";
import tathagataPic from "../assets/team_pics/tathagatha.jpeg";

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

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [heroSplit, setHeroSplit] = useState(false);
  const [year, setYear] = useState(1990);
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [isWarping, setIsWarping] = useState(false);

  const navigate = useNavigate();
  const lenisRef = useRef(null);
  const totemRef = useRef(null);
  const timelineProgressRef = useRef(null);
  const galleryRef = useRef(null);

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
      } catch (err) {
        console.error("Status fetch failed", err);
      }
    };
    fetchStatus();

    const socket = io(serverOrigin);
    socket.on("registrationStatusUpdate", (data) =>
      setRegistrationOpen(data.registration_open),
    );
    return () => socket.disconnect();
  }, []);

  // ─── TRANSCENDING YEAR LOADER ─────────────────────────────────────────────
  useEffect(() => {
    let currentYear = 1990;
    const interval = setInterval(() => {
      currentYear += 1;
      if (currentYear >= 2026) {
        currentYear = 2026;
        clearInterval(interval);
        setTimeout(() => {
          setLoading(false);
          // Hero section is already positioned since we removed the entry animations
          setTimeout(() => setHeroSplit(true), 100);
        }, 600);
      }
      setYear(currentYear);
    }, 35);
    return () => clearInterval(interval);
  }, []);

  // ─── MASTER JOURNEY INIT ────────────────────────────────────────────────────
  useEffect(() => {
    if (loading) return;

    const lenis = new Lenis({ duration: 2.5, lerp: 0.03, smoothWheel: true });
    lenisRef.current = lenis;
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    const ctx = gsap.context(() => {
      // 1. Timeline Track + Totem Movement
      gsap.to(timelineProgressRef.current, {
        height: "100%",
        ease: "none",
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom bottom",
          scrub: 0.1,
        },
      });

      gsap.to(totemRef.current, {
        top: "100%",
        rotation: 720,
        ease: "none",
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom bottom",
          scrub: 0.1,
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
          end: "+=200%",
          pin: true,
          scrub: true,
        },
      });

      heroPortalTl
        // STAGE 1: INVISIBLE HANDLERS
        .to(".about-reveal-layer", { opacity: 1, ease: "none" }, 0.1) // Start showing reveal layer EARLY

        // STAGE 2: FACE SPLIT & BACKGROUND CROSS-FADE
        .to(".face-left", { x: "-100%", ease: "none" }, 0)
        .to(".face-right", { x: "100%", ease: "none" }, 0)
        .to(".about-reveal-bg", { opacity: 1, ease: "none" }, 0.1) // Reveal the One background FAST

        // STAGE 3: HERO DISSOLUTION
        .to(
          ".main-skull",
          { opacity: 0, scale: 1.2, filter: "blur(20px)", ease: "power1.in" },
          0.2,
        )
        .to(".hero-bg-illo", { opacity: 0, scale: 1.1, ease: "none" }, 0)
        .to(
          ".hero-portal-content",
          { opacity: 0, y: -100, ease: "power1.in" },
          0.1,
        )
        .to(".hero-bottom-mask", { opacity: 0, ease: "none" }, 0.1)

        // STAGE 4: CONTENT FOCUS
        .fromTo(
          ".about-reveal-content",
          { opacity: 0, y: 100 },
          { opacity: 1, y: 0, ease: "power3.out" },
          0.5,
        );

      // 3. CHAPTER PINING (Fixed Stacking for Overlap)
      const eras = gsap.utils.toArray(".history-era");
      eras.forEach((era, i) => {
        // Enforce stacking hierarchy (High baseline to cover Hero z-30)
        era.style.zIndex = i + 100;
        era.style.position = "relative";
        era.style.backgroundColor = "black";

        ScrollTrigger.create({
          trigger: era,
          start: "top top",
          end: "+=120%",
          pin: true,
          scrub: 1,
          pinSpacing: true,
        });

        gsap.fromTo(
          era.querySelector(".era-content"),
          { opacity: 0, x: -30 },
          {
            opacity: 1,
            x: 0,
            duration: 1.2,
            scrollTrigger: {
              trigger: era,
              start: "top 45%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });

      // Special Horizontal Scroll for Gallery (Chapter 02)
      if (galleryRef.current) {
        // Force refresh after a short delay to ensure images are measured
        setTimeout(() => ScrollTrigger.refresh(), 1000);

        const galleryTl = gsap.timeline({
          scrollTrigger: {
            trigger: "#era2",
            start: "top top",
            end: () => `+=${galleryRef.current.scrollWidth + window.innerHeight * 2}`, 
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          }
        });

        // STEP 1: The Long Walk (Horizontal Scroll)
        galleryTl.to(galleryRef.current, {
          x: () => -(galleryRef.current.scrollWidth - window.innerWidth),
          ease: "none",
          duration: 4
        });

        // STEP 2: The Sudden Void (Total Blackout)
        galleryTl.to(".gallery-header, .gallery-container, .gallery-bg-container", {
          opacity: 0,
          scale: 0.9,
          filter: "blur(20px)",
          duration: 1,
          ease: "power2.in"
        }, "-=0.2"); // Slight overlap with the end of scroll

        // STEP 3: The Revelation (g14 Focus)
        galleryTl.to(".gallery-final-highlight", {
          opacity: 1,
          duration: 1.5,
          ease: "power3.out"
        }, ">")
        .fromTo(".gallery-final-highlight img",
          { scale: 1.6, filter: "brightness(0) contrast(1.5)" },
          { scale: 1, filter: "brightness(1) contrast(1)", duration: 2.5, ease: "slow(0.7, 0.7, false)" },
          "<"
        )
        // Hold the final vision
        .to({}, { duration: 2 });
      }

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

    return () => {
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

  if (loading) {
    return (
      <div className="fixed inset-0 z-[2000] bg-black flex flex-col items-center justify-center font-medieval overflow-hidden">
        <div className="text-white text-[20vw] leading-none opacity-10 absolute select-none tracking-tighter">
          {year}
        </div>
        <div className="relative z-10 text-[#FFB464] text-9xl md:text-[12vw] leading-none drop-shadow-[0_0_60px_rgba(255,180,100,0.4)]">
          {year}
        </div>
        <div className="mt-20 font-bungee text-[10px] text-white/30 tracking-[1em] uppercase animate-pulse">
          Transcending Time
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen bg-black selection:bg-[#FFB464] selection:text-black overflow-x-hidden">
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
            <span className="marker-label">02 CHRYSALIS</span>
          </div>
          <div
            className="chapter-marker cursor-pointer"
            onClick={() => scrollToSection("builders")}
          >
            <div className="marker-dot" />
            <span className="marker-label">03 BUILDERS</span>
          </div>
          <div
            className="chapter-marker cursor-pointer"
            onClick={() => scrollToSection("destiny")}
          >
            <div className="marker-dot" />
            <span className="marker-label">04 DESTINY</span>
          </div>
        </div>
      </div>

      <main className="relative z-10">
        {/* HYPERSPACE WRAP */}
        {isWarping && (
          <div className="fixed inset-0 z-[10000] bg-black flex items-center justify-center">
            <video
              autoPlay
              muted
              onEnded={() => navigate("/sponsors")}
              className="absolute inset-0 w-full h-full object-cover"
              src={loadingVideo}
            />
          </div>
        )}

        {/* HERO: SACRED SKULL PORTAL */}
        <section id="hero" className="hero-section hero-portal">
          {/* Background illustration */}
          <img
            src={skullBg}
            className="hero-bg-illo grayscale-[80%]"
            alt="Void"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black z-[2]" />

          {/* The Bottom Mask (Hides sharp neck lines) */}
          <div className="hero-bottom-mask" />

          {/* Main Center Skull (Skull Pro) */}
          <img
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
            src={leftFaceImg}
            className="hero-face face-left"
            style={{
              left: 0,
              transform: "translateX(-6%)",
            }}
            alt="Left Protector"
          />
          <img
            src={rightFaceImg}
            className="hero-face face-right"
            style={{
              right: 0,
              transform: "translateX(6%)",
            }}
            alt="Right Protector"
          />

          {/* Reverted Hero Content - Initial Design */}
          <div className="relative z-[30] hero-portal-content h-full w-full flex flex-col items-center justify-center">
            <div className="flex flex-col items-center -mt-20">
              <img
                src={titleFont}
                className="h-[50vh] md:h-[85vh] w-auto object-contain drop-shadow-[0_0_120px_rgba(255,180,100,0.6)] animate-float"
                alt="Sahotsava"
              />

              {registrationOpen ? (
                <a
                  href={import.meta.env.VITE_REGISTER_URL}
                  className="px-12 py-4 border-2 border-[#FFB464] text-white bg-black/40 backdrop-blur-md font-bungee text-xl md:text-2xl hover:bg-[#FFB464] hover:text-black transition-all shadow-2xl zine-border-accent"
                >
                  CLAIM THE ERA
                </a>
              ) : (
                <div className="px-10 py-3 border border-white/10 bg-black/60 backdrop-blur-sm text-[#FFB464]/30 font-bungee text-sm tracking-[0.5em] select-none">
                  // ERA_LOCKED
                </div>
              )}
            </div>

            <div className="absolute bottom-10 opacity-30">
              <span className="font-medieval text-[#FFB464] text-[8px] tracking-[1.5em] uppercase">
                Scroll Down
              </span>
            </div>
          </div>

          {/* IN-PLACE REVEAL: THE ABOUT CONTENT */}
          <div className="about-reveal-layer">
            <div className="about-reveal-bg">
              <img src={theOneByShubho} alt="" />
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
        </section>

        {/* ERA II - GALLERY SHOWCASE */}
        <section
          id="era2"
          className="relative w-full h-screen bg-black overflow-hidden flex flex-col justify-center"
        >
          {/* Section Background with Overlay */}
          <div className="gallery-bg-container absolute inset-0 z-0">
              <img src={bg6} className="w-full h-full object-cover opacity-60" alt="" />
              <div className="absolute inset-0 bg-black/60" />
          </div>
          <div className="px-10 md:pl-56 md:pr-20 mb-8 relative z-20 gallery-header">
              <div className="font-medieval text-[#FFB464] text-sm uppercase tracking-[0.8em] mb-4">Chapter_02</div>
              <h2 className="text-5xl md:text-[8vw] font-medieval text-white uppercase tracking-tighter leading-none">Gallery</h2>
          </div>
          
          <div 
            ref={galleryRef}
            className="gallery-container relative z-10 flex items-center gap-12 pl-10 md:pl-56 pr-[50vw] will-change-transform"
          >
              {[g1, g2, g3, g4, g5, g6, g7, g8, g9, g10, g11, g12, g13].map((img, i) => (
                  <div key={i} className="gallery-item flex-shrink-0 w-[80vw] md:w-[45vw] aspect-video group relative overflow-hidden ring-1 ring-white/10 hover:ring-[#FFB464]/50 transition-all duration-500 rounded-sm">
                      <img 
                          src={img} 
                          className="w-full h-full object-cover grayscale-[50%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out" 
                          alt={`Memory ${i}`} 
                      />
                      <div className="gallery-overlay absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
              ))}
              {/* Buffer space at end */}
              <div className="flex-shrink-0 w-[20vw]" />
          </div>

          {/* FINAL HIGHLIGHT - SEPARATE FROM ROWS */}
          <div className="gallery-final-highlight absolute inset-0 z-[100] flex items-center justify-center opacity-0 pointer-events-none bg-black">
              <div className="w-[85vw] md:w-[70vw] aspect-video relative overflow-hidden ring-2 ring-[#FFB464] shadow-[0_0_150px_rgba(255,180,100,0.6)] rounded-sm">
                  <img src={g14} className="w-full h-full object-cover" alt="Final Memory" />
                  <div className="absolute inset-x-0 bottom-0 p-10 bg-gradient-to-t from-black via-transparent to-transparent">
                      <div className="font-medieval text-[#FFB464] text-xs md:text-sm uppercase tracking-[1em]">The Divine Conclusion</div>
                  </div>
              </div>
          </div>
        </section>

        {/* BUILDERS */}
        <section
          id="builders"
          className="relative w-full min-h-screen py-60 px-10 md:pl-56 md:pr-20 bg-white text-black"
        >
          <div className="mb-4 font-medieval text-black/50 text-sm uppercase tracking-[0.8em]">Chapter_03</div>
          <h2 className="text-8xl md:text-[10vw] font-medieval leading-none tracking-tighter text-black mb-32">
            MEET THE TEAM.
          </h2>
          <div className="architects-grid grid grid-cols-2 md:grid-cols-5 gap-4 border-y-2 border-black/10">
            {[
              { name: "Pritha", id: "01", image: prithaPic },
              { name: "Ashoke", id: "02", image: ashokePic },
              { name: "Rohit", id: "03", image: rohitPic },
              { name: "Roshni", id: "04", image: roshniPic },
              { name: "Shrijita", id: "05", image: shrijitaPic },
              { name: "Shrayan", id: "06", image: shrayanPic },
              { name: "Shreyoshee", id: "07", image: shreyosheePic },
              { name: "Subhadeep", id: "08", image: subhadeepPic },
              { name: "Swastick", id: "09", image: swastickPic },
              { name: "Tathagata", id: "10", image: tathagataPic },
            ].map((member, i) => (
              <div
                key={member.id}
                className="architect-card aspect-[3/4] relative overflow-hidden bg-gray-100"
              >
                <img
                  src={member.image}
                  className="w-full h-full object-cover"
                  alt={member.name}
                />
                <div className="absolute inset-x-0 bottom-0 p-4 opacity-100">
                  <div className="bg-white p-3 border border-black shadow-[2px_2px_0_#000]">
                    <p className="font-medieval text-xl uppercase tracking-tighter truncate">
                      {member.name}
                    </p>
                    <p className="font-outfit text-[8px] text-black/50 uppercase tracking-[0.4em] font-bold">
                      Custodians_{member.id}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FINALE */}
        <section
          id="destiny"
          className="h-screen bg-black flex flex-col items-center justify-center p-20 text-center relative overflow-hidden"
        >
          <h2 className="text-white font-medieval text-7xl md:text-[14vw] leading-none tracking-tighter italic opacity-10 blur-sm absolute">
            END
          </h2>
          <div className="relative z-10 space-y-24">
            <div className="mb-4 font-medieval text-[#FFB464] text-sm uppercase tracking-[0.8em]">Chapter_04</div>
            <h2 className="text-white font-medieval text-7xl md:text-[12vw] leading-none tracking-tighter shadow-[0_0_80px_rgba(255,180,100,0.3)]">
              THE END.
            </h2>
            <div className="flex flex-col md:flex-row gap-16 justify-center">
              <button
                onClick={() => setIsWarping(true)}
                className="px-16 py-8 bg-[#FFB464] text-black font-bungee text-2xl hover:scale-110 active:scale-95 transition-all"
              >
                Sponsors
              </button>
            </div>
          </div>
        </section>
      </main>

      <style>{`
        ::-webkit-scrollbar { display: none; }
        html { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import leftSkull from "../assets/backgrounds/Left skull.webp";
import rightSkull from "../assets/backgrounds/RS3.webp";
import mainSkull from "../assets/backgrounds/Skull pro.webp";
import background from "../assets/backgrounds/3. BGwithIllustrations.webp";
import titleFont from "../assets/backgrounds/Untitled35_20260106001225.png";
import AboutOT from "../assets/backgrounds/AboutOT.png";
import featuredBg from "../assets/backgrounds/TheOneByShubho.png";
import GalleryOT from "../assets/backgrounds/GalleryOT.png";
import galleryBg from "../assets/backgrounds/6.png";
import TeamOT from "../assets/backgrounds/MTT.OT.png";
import teamBg from "../assets/backgrounds/Lev1.png";
import loadingVideo from "../assets/loading_screen/loading_anim.mp4";

export default function Home() {
  const navigate = useNavigate();

  const [isWarping, setIsWarping] = useState(false);

  const handleRegisterClick = () => {
    navigate("/register");
  };

  const handleSponsorsClick = () => {
    setIsWarping(true);
  };


  return (
    <div className="relative w-full min-h-screen bg-black overflow-x-hidden font-sans">
      {/* 0. HYPERSPACE JUMP TRANSITION OVERLAY */}
      {isWarping && (
        <div className="fixed inset-0 z-[10000] bg-black flex items-center justify-center overflow-hidden">
          {/* Background Video Animation plays once then navigates */}
          <video
            autoPlay
            muted
            onEnded={() => navigate("/sponsors")}
            className="absolute inset-0 w-full h-full object-cover"
            src={loadingVideo}
          ></video>
        </div>
      )}

      {/* MAIN CONTENT WRAPPER - Hidden during warp to prevent flickering */}
      <div className={isWarping ? "hidden" : "contents"}>
        {/* 1. HERO SECTION (Exactly the same dimensions and limits) */}
        <section className="relative w-full h-screen overflow-hidden flex-shrink-0">
          {/* Full screen background behind everything */}
          <img
            src={background}
            alt="background"
            className="absolute inset-0 w-full h-full object-cover z-0"
          />

          {/* Container for the skulls, placed above the background */}
          <div className="absolute inset-0 z-10 pointer-events-none flex justify-center items-center overflow-hidden">
            <div className="relative w-full min-w-[1024px] md:min-w-0 md:w-full h-full flex-shrink-0">
              <div className="absolute left-0 top-4 w-full h-full flex justify-center items-center z-0">
                <img
                  src={mainSkull}
                  alt="Main Guardian"
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
              </div>

              {/* Left side taking slightly more than half the screen to overlap the center */}
              <div className="absolute left-0 top-4 w-[76%] h-full z-10">
                <img
                  src={leftSkull}
                  alt="Left Guardian"
                  className="absolute inset-0 w-full h-full object-cover object-right"
                />
              </div>

              {/* Right side taking slightly more than half the screen to overlap the center */}
              <div className="absolute right-0 top-4 w-[80.8%] h-full z-10">
                <img
                  src={rightSkull}
                  alt="Right Guardian"
                  className="absolute inset-0 w-full h-full object-cover object-left"
                />
              </div>
            </div>
          </div>

          {/* Optional Gradient Overlay if you ever want to blend it slightly in the middle */}
          <div className="absolute inset-0 z-20 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]"></div>

          {/* Bottom Gradient and Custom Title Font */}
          <div className="absolute bottom-0 left-0 w-full z-30 pointer-events-none bg-gradient-to-t from-[#000000] via-[#000000]/80 to-transparent flex flex-col justify-end items-center pt-32 pb-8">

            {/* STARDUST PRELUDE (Unifying the Hero with the Void) */}
            <div className="absolute inset-0 z-0">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute bg-white rounded-full animate-pulse"
                  style={{
                    width: `${Math.random() * 2 + 0.5}px`,
                    height: `${Math.random() * 2 + 0.5}px`,
                    left: `${Math.random() * 100}%`,
                    bottom: `${Math.random() * 40}%`,
                    opacity: Math.random() * 0.2 + 0.05,
                    animationDuration: `${Math.random() * 4 + 2}s`,
                    animationDelay: `${Math.random() * 4}s`,
                    boxShadow: '0 0 5px rgba(255,255,255,0.3)'
                  }}
                ></div>
              ))}
            </div>

            <img
              src={titleFont}
              alt="Sahotsava Title"
              className="relative z-10 w-auto h-[50vh] drop-shadow-[0_0_20px_rgba(255,255,255,0.4)] object-contain -mb-20"
            />

            {/* Register Button */}
            <button
              onClick={handleRegisterClick}
              className="relative z-10 pointer-events-auto px-10 py-3 bg-gradient-to-r from-red-600 to-orange-500 hover:from-white hover:to-white hover:text-red-600 text-white font-['Outfit'] font-extrabold uppercase tracking-widest text-lg rounded-sm shadow-[0_0_15px_rgba(255,0,0,0.5)] hover:shadow-[0_0_30px_rgba(255,255,255,0.8)] transition-all duration-75 transform hover:-translate-y-1"
            >
              Register
            </button>
          </div>

          {/* Social Links on the Left (Vertical Stack) */}
          <div className="absolute left-6 lg:left-10 bottom-24 flex flex-col items-center gap-8 z-40">
            <div className="w-[1px] h-20 bg-gradient-to-t from-white/40 to-transparent mb-2"></div>
            <a
              href="https://www.instagram.com/technosahotsava"
              target="_blank"
              rel="noreferrer"
              className="group pointer-events-auto"
            >
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white/50 group-hover:text-pink-500 transition-all duration-300 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] group-hover:scale-125 group-hover:drop-shadow-[0_0_15px_rgba(236,72,153,0.6)]"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a
              href="https://www.facebook.com/technosahotsava"
              target="_blank"
              rel="noreferrer"
              className="group pointer-events-auto"
            >
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white/50 group-hover:text-blue-500 transition-all duration-300 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] group-hover:scale-125 group-hover:drop-shadow-[0_0_15px_rgba(59,130,246,0.6)]"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>
            <a
              href="mailto:technosahotsava@gmail.com"
              className="group pointer-events-auto"
            >
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white/50 group-hover:text-yellow-400 transition-all duration-300 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] group-hover:scale-125 group-hover:drop-shadow-[0_0_15px_rgba(250,204,21,0.6)]"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </a>
          </div>
        </section>

        {/* GLOBAL FLOATING SPONSORS TAB */}
        <button
          onClick={handleSponsorsClick}
          className="fixed right-0 top-1/2 -translate-y-1/2 z-[100] bg-white/10 backdrop-blur-md border border-white/20 px-4 py-8 rounded-l-2xl hover:bg-white/20 transition-all group pointer-events-auto flex flex-col items-center gap-4 hover:pr-6 sponsors-pulse"
          style={{ writingMode: 'vertical-rl' }}
        >
          <span className="text-white font-['Outfit'] font-black uppercase tracking-[0.3em] text-sm group-hover:text-yellow-400 transition-colors">SPONSORS</span>
          <div className="w-[2px] h-8 bg-gradient-to-t from-yellow-400 to-transparent group-hover:h-12 transition-all"></div>
        </button>

        {/* MASSIVE CONTINUOUS MONOCHROME VOID JOURNEY */}
        <div className="relative w-full h-[200vh] bg-black overflow-hidden">
          {/* Sticky Viewport Container */}
          <div className="sticky top-0 w-full h-screen pointer-events-none flex items-center justify-center">

            {/* Layer 1: Volumetric Shadow Waves (Monochrome) */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-[-50%] left-[-25%] w-[150%] h-[150%] animate-[spin_100s_linear_infinite] opacity-20">
                <div
                  className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0deg,rgba(255,255,255,0.05)_90deg,transparent_180deg,rgba(255,255,255,0.03)_270deg,transparent_360deg)] blur-[120px]"
                ></div>
              </div>
              <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] animate-[spin_70s_linear_infinite_reverse] opacity-15">
                <div
                  className="absolute inset-0 bg-[conic-gradient(from_180deg,transparent_0deg,rgba(255,255,255,0.04)_120deg,transparent_240deg,rgba(255,255,255,0.06)_300deg,transparent_360deg)] blur-[140px]"
                ></div>
              </div>
            </div>

            {/* Layer 2: Pure White Shimmering Stardust - Increased density for the longer journey */}
            <div className="absolute inset-0 z-10">
              {[...Array(80)].map((_, i) => (
                <div
                  key={i}
                  className="absolute bg-white rounded-full animate-pulse"
                  style={{
                    width: `${Math.random() * 2 + 0.5}px`,
                    height: `${Math.random() * 2 + 0.5}px`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    opacity: Math.random() * 0.3 + 0.1,
                    animationDuration: `${Math.random() * 4 + 2}s`,
                    animationDelay: `${Math.random() * 4}s`,
                    boxShadow: '0 0 8px rgba(255,255,255,0.5)'
                  }}
                ></div>
              ))}
            </div>

            {/* Layer 3: The Void Singularity (Monochrome Glow) */}
            <div className="absolute z-20 w-[60vw] h-[60vw] max-w-2xl flex items-center justify-center">
              <div className="absolute inset-0 bg-white/[0.03] rounded-full blur-[180px] animate-[pulse_8s_ease-in-out_infinite]"></div>
              <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent blur-sm rotate-[10deg]"></div>
              <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent blur-sm -rotate-[10deg]"></div>
            </div>
          </div>
        </div>

        {/* WRAPPER FOR THE about SECTION AND ITS BACKGROUND */}
        <div
          className="relative w-full bg-cover bg-center bg-no-repeat bg-fixed"
          style={{ backgroundImage: `url(${featuredBg})` }}
        >
          {/* STARDUST LINGER (Unifying the Void with the About Us section) */}
          <div className="absolute inset-x-0 top-0 h-[60vh] z-10 pointer-events-none">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute bg-white rounded-full animate-pulse"
                style={{
                  width: `${Math.random() * 2 + 0.5}px`,
                  height: `${Math.random() * 2 + 0.5}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.2 + 0.05,
                  animationDuration: `${Math.random() * 4 + 2}s`,
                  animationDelay: `${Math.random() * 4}s`,
                  boxShadow: '0 0 5px rgba(255,255,255,0.3)'
                }}
              ></div>
            ))}
          </div>

          {/* Transitional blend to pull the cosmic background into view */}
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black/30 z-0 pointer-events-none"></div>

          {/* 2. FEATURED SECTION */}
          <section className="relative w-full min-h-screen flex flex-col items-center pt-10">
            {/* Slight dark overlay to ensure readability while preserving artwork vibrance */}
            <div className="absolute inset-0 bg-black/35 z-0 pointer-events-none"></div>

            {/* Featured Events Heading */}
            <div className="relative z-30 flex items-center justify-center w-full -mb-6">
              <div className="relative w-[85vw] max-w-4xl drop-shadow-[0_0_25px_rgba(255,255,255,0.4)]">
                {/* Invisible layout controller */}
                <img
                  src={AboutOT}
                  alt="Featured Events Layout"
                  className="w-170 h-auto opacity-0"
                />

                {/* Pure White Fill Mask! */}
                <div
                  className="absolute inset-0 w-full h-full bg-white"
                  style={{
                    WebkitMaskImage: `url(${AboutOT})`,
                    WebkitMaskSize: "contain",
                    WebkitMaskPosition: "center",
                    WebkitMaskRepeat: "no-repeat",
                    maskImage: `url(${AboutOT})`,
                    maskSize: "contain",
                    maskPosition: "center",
                    maskRepeat: "no-repeat",
                  }}
                />
              </div>
            </div>

            {/* Our Theme Description section */}
            <div className="relative w-full max-w-6xl mx-auto px-6 z-30 mt-8 pb-32 flex justify-center text-center">
              <p className="text-white/90 text-justify font-sans text-xl md:text-2xl leading-relaxed tracking-wide font-bold drop-shadow-[0_0_15px_rgba(0,0,0,1)]">
                Technosahotsava 2026, the annual cultural fest of Techno India
                University, stands as a distinguished celebration of artistic
                excellence, cultural diversity, and transformative expression.
                Curated and hosted by Team Sanskaran, the official cultural club
                of the university, the fest reflects a commitment to nurturing
                creativity, leadership, and collaborative spirit among students.<br />
                This year’s theme, “Metamorphosis of Divine,” reflects the spirit
                of transformation, growth, and elevated expression that defines
                Technosahotsava 2026. It symbolizes the journey of evolving from
                potential to excellence, from imagination to realization. The
                theme embodies the belief that within every individual lies a
                spark of brilliance that, when nurtured through art, culture, and
                collaboration, transforms into something extraordinary. Through
                this concept, Technosahotsava celebrates the power of change,
                creativity, and the continuous evolution of talent into its most
                refined and impactful form. <br />Technosahotsava 2026 is envisioned as
                a platform where talent transcends boundaries, ideas converge, and
                creativity transforms into meaningful expression. Through this
                theme, the fest celebrates growth, resilience, and the continuous
                evolution of excellence, making it not just an event, but an
                inspiring experience of transformation and unity.
              </p>
            </div>

            {/* Bottom Blend Gradient */}
            <div className="absolute inset-x-0 bottom-0 h-[40vh] bg-gradient-to-t from-black to-transparent z-10 pointer-events-none"></div>
          </section>
        </div>
      </div>

      {/* SECOND VOID BRIDGE: ARCHIVE ENTRANCE */}
      <div className="relative w-full h-[20vh] bg-black overflow-hidden -mt-1">
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {/* Stardust Stems (Static for shorter gap) */}
          <div className="absolute inset-0 z-10">
            {[...Array(40)].map((_, i) => (
              <div
                key={i}
                className="absolute bg-white rounded-full animate-pulse"
                style={{
                  width: `${Math.random() * 2 + 0.5}px`,
                  height: `${Math.random() * 2 + 0.5}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.2 + 0.05,
                  animationDuration: `${Math.random() * 4 + 2}s`,
                  animationDelay: `${Math.random() * 4}s`,
                  boxShadow: '0 0 5px rgba(255,255,255,0.3)'
                }}
              ></div>
            ))}
          </div>
          {/* Subtle Mid-gradient to keep the 'depth' feel */}
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black z-20 opacity-60"></div>
        </div>
      </div>

      {/* 3. GALLERY SECTION */}
      <section
        className="relative w-full min-h-screen flex flex-col items-center pt-24 bg-cover bg-center bg-no-repeat bg-fixed"
        style={{ backgroundImage: `url(${galleryBg})` }}
      >
        {/* STARDUST LINGER (Unifying the Void with the Gallery section) */}
        <div className="absolute inset-x-0 top-0 h-[60vh] z-10 pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full animate-pulse"
              style={{
                width: `${Math.random() * 2 + 0.5}px`,
                height: `${Math.random() * 2 + 0.5}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.2 + 0.05,
                animationDuration: `${Math.random() * 4 + 2}s`,
                animationDelay: `${Math.random() * 4}s`,
                boxShadow: '0 0 5px rgba(255,255,255,0.3)'
              }}
            ></div>
          ))}
        </div>

        {/* Cinematic Dark Overlays (Matching About Us mood) */}
        <div className="absolute inset-x-0 top-0 h-[40vh] bg-gradient-to-b from-black via-black/80 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-0 bg-black/75 z-0 pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] z-1 pointer-events-none"></div>

        {/* Gallery Heading */}
        <div className="relative z-30 flex items-center justify-center w-full mb-12">
          <div className="relative w-[80vw] max-w-4xl drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]">
            {/* Invisible layout controller */}
            <img
              src={GalleryOT}
              alt="Gallery Title Layout"
              className="w-full h-auto opacity-0"
            />

            {/* Pure White Fill Mask! */}
            <div
              className="absolute inset-0 w-full h-full bg-white"
              style={{
                WebkitMaskImage: `url(${GalleryOT})`,
                WebkitMaskSize: "contain",
                WebkitMaskPosition: "center",
                WebkitMaskRepeat: "no-repeat",
                maskImage: `url(${GalleryOT})`,
                maskSize: "contain",
                maskPosition: "center",
                maskRepeat: "no-repeat",
              }}
            />
          </div>
        </div>

        {/* TEMPORAL MEMORY ARCHIVE */}
        <div className="relative w-full max-w-7xl mx-auto px-6 z-30 pb-96">
          <div className="relative h-[220vh] md:h-[180vh] w-full mt-24 perspective-[2000px]">
            {/* Memory Data Array */}
            {[
              { id: "01", style: "polaroid", pos: { top: "2%", left: "5%" }, rot: "-8deg", z: "50px", date: "2026.01.24", title: "The First Spark", loc: "ARCHIVED" },
              { id: "02", style: "polaroid", pos: { top: "8%", left: "40%" }, rot: "5deg", z: "120px", date: "2026.02.01", title: "Celestial Eve", loc: "GRAND_ARENA" },
              { id: "03", style: "polaroid", pos: { top: "5%", left: "72%" }, rot: "-12deg", z: "80px", date: "2026.02.10", title: "Divine Pulse", loc: "SYMPHONY" },
              { id: "04", style: "polaroid", pos: { top: "25%", left: "2%" }, rot: "10deg", z: "60px", date: "2026.02.15", title: "Echoes of Art", loc: "HUB" },
              { id: "05", style: "wide", pos: { top: "35%", right: "5%" }, rot: "-5deg", z: "150px", date: "2026.02.20", title: "Grand Highlight", loc: "HIGHLIGHT_REEL" },
              { id: "06", style: "polaroid", pos: { top: "45%", left: "30%" }, rot: "7deg", z: "90px", date: "2026.02.22", title: "Sahara Heart", loc: "CORE" },
              { id: "07", style: "circle", pos: { top: "60%", left: "5%" }, rot: "-4deg", z: "40px", date: "2026.02.25", title: "Rewind", loc: "STREAMING" },
              { id: "08", style: "polaroid", pos: { top: "65%", right: "10%" }, rot: "15deg", z: "110px", date: "2026.02.26", title: "Metamorphosis", loc: "TRANSFORMATION" },
              { id: "09", style: "polaroid", pos: { top: "75%", left: "20%" }, rot: "-6deg", z: "70px", date: "2026.02.27", title: "Eternal Fragment", loc: "GHOSTS" },
              { id: "10", style: "polaroid", pos: { top: "85%", left: "55%" }, rot: "3deg", z: "130px", date: "2026.02.28", title: "Midnight Mirage", loc: "FINALE" }
            ].map((card, i) => (
              <div
                key={i}
                className="absolute w-[300px] md:w-[350px] group cursor-pointer transition-all duration-700 z-10"
                style={{
                  top: card.pos.top,
                  left: card.pos.left,
                  right: card.pos.right,
                  transform: `rotate(${card.rot}) translateZ(${card.z})`
                }}
              >
                {card.style === 'circle' ? (
                  /* Circular "Rewind" Style */
                  <div className="relative aspect-square w-[250px] bg-white/5 backdrop-blur-lg border border-white/10 p-3 rounded-full flex items-center justify-center group-hover:scale-125 group-hover:bg-white/10 transition-all duration-700">
                    <div className="text-center">
                      <p className="text-white font-['Outfit'] font-bold text-xl uppercase tracking-widest group-hover:animate-pulse">{card.title}</p>
                      <p className="text-white/40 font-mono text-[8px] mt-1">{card.loc}_NULL</p>
                    </div>
                  </div>
                ) : card.style === 'wide' ? (
                  /* Wide "Highlight" Style */
                  <div className="relative aspect-video w-[400px] md:w-[450px] bg-black/40 backdrop-blur-md border border-white/10 p-2 rounded-lg group-hover:rotate-0 group-hover:scale-110 transition-all duration-700 overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 bg-[#080808] opacity-60"></div>
                    <div className="relative z-10 w-full h-full flex flex-col justify-end p-6 bg-gradient-to-t from-black via-transparent to-transparent">
                      <h4 className="text-pink-500 font-bold tracking-[0.5em] text-[10px] mb-2 uppercase">{card.loc}</h4>
                      <h3 className="text-white font-['Outfit'] font-extrabold text-3xl uppercase tracking-tighter group-hover:tracking-widest transition-all duration-700">{card.title}</h3>
                    </div>
                    <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-white/40"></div>
                  </div>
                ) : (
                  /* Classic Polaroid/Archive Style */
                  <div className="relative w-full aspect-[4/5] bg-white/5 backdrop-blur-xl border border-white/20 p-3 rounded-sm shadow-2xl overflow-hidden group-hover:rotate-0 group-hover:scale-105 group-hover:translateZ(150px) group-hover:bg-white/10 transition-all duration-700">
                    <div className="relative w-full h-[85%] bg-[#0a0a0a] overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:opacity-40 transition-opacity">
                        <p className="text-white font-['Outfit'] tracking-[0.5em] text-xs">MEMORY_{card.id}</p>
                      </div>
                      <div className="absolute inset-0 w-full h-1 bg-white/20 blur-md -top-full group-hover:top-[200%] transition-all duration-[2s] z-20"></div>
                    </div>
                    <div className="mt-4 px-2">
                      <h4 className="text-white/40 font-mono text-[10px] uppercase tracking-tighter">Archived // {card.date}</h4>
                      <h3 className="text-white font-['Outfit'] font-bold text-lg uppercase tracking-wider group-hover:text-pink-400 transition-colors">{card.title}</h3>
                    </div>
                    <div className="absolute inset-0 bg-white/5 blur-3xl -z-10 group-hover:opacity-100 transition-opacity duration-700"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        {/* Bottom Blend Gradient to soften the exit */}
        <div className="absolute inset-x-0 bottom-0 h-[30vh] bg-gradient-to-t from-black to-transparent z-20 pointer-events-none"></div>
      </section>

      {/* THIRD VOID BRIDGE: TEAM ENTRANCE */}
      <div className="relative w-full h-[20vh] bg-black overflow-hidden -mt-1">
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="absolute inset-0 z-10">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute bg-white rounded-full animate-pulse"
                style={{
                  width: `${Math.random() * 2 + 0.5}px`,
                  height: `${Math.random() * 2 + 0.5}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.2 + 0.05,
                  animationDuration: `${Math.random() * 4 + 2}s`,
                  animationDelay: `${Math.random() * 4}s`,
                  boxShadow: '0 0 5px rgba(255,255,255,0.3)'
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. TEAM SECTION */}
      <section
        className="relative w-full min-h-screen flex flex-col items-center pt-24 bg-cover bg-center bg-no-repeat bg-fixed"
        style={{ backgroundImage: `url(${teamBg})` }}
      >
        {/* STARDUST LINGER */}
        <div className="absolute inset-x-0 top-0 h-[60vh] z-10 pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full animate-pulse"
              style={{
                width: `${Math.random() * 2 + 0.5}px`,
                height: `${Math.random() * 2 + 0.5}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.2 + 0.05,
                animationDuration: `${Math.random() * 4 + 2}s`,
                animationDelay: `${Math.random() * 4}s`,
                boxShadow: '0 0 5px rgba(255,255,255,0.3)'
              }}
            ></div>
          ))}
        </div>

        {/* Cinematic Dark Overlays */}
        <div className="absolute inset-x-0 top-0 h-[40vh] bg-gradient-to-b from-black via-black/80 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-0 bg-black/75 z-0 pointer-events-none"></div>

        {/* Team Heading */}
        <div className="relative z-30 flex items-center justify-center w-full mb-20">
          <div className="relative w-[70vw] max-w-3xl drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]">
            <img
              src={TeamOT}
              alt="Meet The Team"
              className="w-full h-auto opacity-0"
            />
            <div
              className="absolute inset-0 w-full h-full bg-white"
              style={{
                WebkitMaskImage: `url(${TeamOT})`,
                WebkitMaskSize: "contain",
                WebkitMaskPosition: "center",
                WebkitMaskRepeat: "no-repeat",
                maskImage: `url(${TeamOT})`,
                maskSize: "contain",
                maskPosition: "center",
                maskRepeat: "no-repeat",
              }}
            />
          </div>
        </div>

        {/* Team Cards Placeholder Area */}
        <div className="relative z-30 w-full max-w-[90vw] mx-auto px-4 pb-32">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="group relative aspect-[3/4] bg-white/5 backdrop-blur-xl border border-white/10 rounded-sm overflow-hidden p-1 transition-all duration-700 hover:scale-[1.02] hover:bg-white/10">
                <div className="w-full h-full border border-white/5 relative bg-black/40 flex flex-col justify-end p-8 overflow-hidden">
                  {/* Member Identity Number */}
                  <p className="absolute top-6 left-6 font-mono text-[10px] text-white/20 tracking-widest">TEAM_CORE_00{i + 1}</p>
                  {/* Scanning Effect */}
                  <div className="absolute inset-0 w-full h-1 bg-white/20 blur-md -top-full group-hover:top-[200%] transition-all duration-[2.5s]"></div>

                  <div className="relative z-10">
                    <h4 className="text-pink-500 font-mono text-[10px] uppercase tracking-[0.5em] mb-2">Guardian of Meta</h4>
                    <h3 className="text-white font-['Outfit'] font-black text-3xl uppercase tracking-tighter group-hover:tracking-wider transition-all duration-700">Innovator Name</h3>
                    <div className="w-12 h-1 bg-white/60 mt-4 rounded-full group-hover:w-full transition-all duration-700"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Floating Animation & Scrollbar Hider */}
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-30px); }
          }

          @keyframes gold-pulse {
            0% { box-shadow: 0 0 0 0 rgba(250, 204, 21, 0.4); }
            70% { box-shadow: 0 0 0 15px rgba(250, 204, 21, 0); }
            100% { box-shadow: 0 0 0 0 rgba(250, 204, 21, 0); }
          }

          .sponsors-pulse {
            animation: gold-pulse 2s infinite;
          }

          /* Hide scrollbar for Chrome, Safari and Opera */
          ::-webkit-scrollbar {
            display: none;
          }

          /* Hide scrollbar for IE, Edge and Firefox */
          html {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
          }
        `}</style>
      </section>
    </div>
  );
}

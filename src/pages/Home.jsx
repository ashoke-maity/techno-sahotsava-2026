import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import API from "../services/api";
import background from "../assets/backgrounds/MetamorphosisByShubho.webp";
import titleFont from "../assets/backgrounds/Untitled35_20260106001225.png";
import ThemeOT from "../assets/backgrounds/ATTOT.png";
import featuredBg from "../assets/backgrounds/TheOneByShubho.webp";
import GalleryOT from "../assets/backgrounds/GalleryOT.png";
import galleryBg from "../assets/backgrounds/6.webp";
import TeamOT from "../assets/backgrounds/MTT.OT.png";
import teamBg from "../assets/backgrounds/Lev1.webp";

// Team Member Pics
import prithaPic from "../assets/team_pics/pritha.jpeg";
import ashokePic from "../assets/team_pics/ashoke.jpg";
import rohitPic from "../assets/team_pics/rohit.jpeg";
import roshniPic from "../assets/team_pics/roshni.jpeg";
import shreyosheePic from "../assets/team_pics/Shreyoshee.jpeg";
import shrijitaPic from "../assets/team_pics/shrijita.png";
import shrayanPic from "../assets/team_pics/shrayan.jpeg.png";
import shubhadeepPic from "../assets/team_pics/shubhadeep.jpeg";
import tathagathaPic from "../assets/team_pics/tathagatha.jpeg";
import swastickPic from "../assets/team_pics/swastick.jpeg";

import loadingVideo from "../assets/loading_screen/loading_anim.mp4";

// Gallery Images
import galleryImg1 from "../assets/Gallery/_MG_3475.jpg.jpeg";
import galleryImg2 from "../assets/Gallery/_MG_3354.jpg.jpeg";
import galleryImg3 from "../assets/Gallery/_DSC2253.jpg.jpeg";
import galleryImg4 from "../assets/Gallery/_MG_3323.jpg.jpeg";
import galleryImg5 from "../assets/Gallery/_DSC2047.jpg.jpeg";
import galleryImg6 from "../assets/Gallery/_DSC1469.jpg.jpeg";
import galleryImg7 from "../assets/Gallery/_DSC0464.jpg.jpeg";
import galleryImg8 from "../assets/Gallery/_MG_3269.jpg.jpeg";
import galleryImg9 from "../assets/Gallery/_DSC1411.jpg.jpeg";
import galleryImg10 from "../assets/Gallery/_DSC0446.jpg.jpeg";
import enthusiaImg from "../assets/Gallery/enthusia.jpeg";

export default function Home() {
  const [isWarping, setIsWarping] = useState(false);
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const themeSectionRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const rawUrl = import.meta.env.VITE_SERVER_URL;
    if (!rawUrl) return;

    let serverOrigin = '';
    try {
      serverOrigin = new URL(rawUrl).origin;
    } catch (e) {
      serverOrigin = rawUrl.split('/technoSahotsava2026')[0];
    }

    const fetchStatus = async () => {
      try {
        const response = await API.get(`${serverOrigin}/technoSahotsava2026/admin/registration-status?t=${Date.now()}`);
        setRegistrationOpen(response.data.registration_open);
        setMaintenanceMode(response.data.maintenance_mode);
      } catch (err) {
        console.error('Failed to fetch site status:', err);
      }
    };
    fetchStatus();

    // Setup Socket.io
    const socket = io(serverOrigin);

    socket.on('registrationStatusUpdate', (data) => {
      setRegistrationOpen(data.registration_open);
    });

    socket.on('maintenanceModeUpdate', (data) => {
      setMaintenanceMode(data.maintenance_mode);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleRegisterClick = () => {
    if (maintenanceMode) return;
    const registerUrl = import.meta.env.VITE_REGISTER_URL;
    if (registerUrl) {
      window.location.href = registerUrl;
    }
  };
  const handleSponsorsClick = () => {
    setIsWarping(true);
  };

  const teamMembers = [
    { name: "Pritha", handle: "Pritha", image: prithaPic },
    { name: "Ashoke", handle: "Ashoke", image: ashokePic },
    { name: "Rohit", handle: "Rohit", image: rohitPic },
    { name: "Shrayan", handle: "Shrayan", image: shrayanPic },
    { name: "Roshni", handle: "Roshni", image: roshniPic },
    { name: "Shreyoshee", handle: "Shreyoshee", image: shreyosheePic },
    { name: "Shrijita", handle: "Shrijita", image: shrijitaPic },
    { name: "Subhadeep", handle: "Subhadeep", image: shubhadeepPic },
    { name: "Tathagata", handle: "Tathagata", image: tathagathaPic },
    { name: "Swastick", handle: "Swastik", image: swastickPic },
  ];

  // Detect mobile devices and block the site with a notice
  const isMobileInitial = typeof navigator !== 'undefined' && (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(max-width:768px)').matches));
  const [isMobileDevice, setIsMobileDevice] = useState(isMobileInitial);

  // Keep detection responsive to resize/orientation changes
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(max-width:768px)');
    const handler = (e) => setIsMobileDevice(e.matches || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    try { mq.addEventListener('change', handler); } catch (e) { mq.addListener(handler); }
    return () => { try { mq.removeEventListener('change', handler); } catch (e) { mq.removeListener(handler); } };
  }, []);

  // Continuous Bidirectional Auto-scroll (Cinematic Voyage)
  useEffect(() => {
    let isAnimating = false;

    const handleScroll = (e) => {
      if (isAnimating) {
        e.preventDefault();
        return;
      }

      const scrollPos = window.scrollY;
      const themeTop = themeSectionRef.current?.getBoundingClientRect().top + scrollPos;

      // Hero to Theme (Downwards) - Skip the massive black void
      if (scrollPos < 150 && e.deltaY > 0) {
        e.preventDefault();
        startCinematicScroll(scrollPos, themeTop);
      }
      // Theme to Hero (Upwards) - Skip the void back to top
      else if (scrollPos >= themeTop - 150 && scrollPos <= themeTop + 150 && e.deltaY < 0) {
        e.preventDefault();
        startCinematicScroll(scrollPos, 0);
      }
    };

    function startCinematicScroll(start, target) {
      isAnimating = true;
      const distance = target - start;
      const duration = 4000; // 4 seconds for that grand glide
      let startTime = null;

      function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);

        // Ultra-smooth ease-in-out-cubic
        const ease = (t) => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

        const run = ease(progress) * distance + start;
        window.scrollTo(0, run);

        if (progress < 1) {
          requestAnimationFrame(animation);
        } else {
          // Add a small delay after completion before allowing new triggers
          setTimeout(() => {
            isAnimating = false;
          }, 800);
        }
      }
      requestAnimationFrame(animation);
    }

    window.addEventListener('wheel', handleScroll, { passive: false });
    return () => window.removeEventListener('wheel', handleScroll);
  }, []);


  if (isMobileDevice) {
    return (
      <div className="fixed inset-0 z-[99999] bg-black flex items-center justify-center px-6">
        <div className="max-w-xl text-center">
          <h1 className="text-white text-2xl md:text-4xl font-['Outfit'] font-extrabold mb-4">This site only works on Desktop/Laptop</h1>
          <p className="text-white/70 mb-6">For the best experience please open this site on a desktop or laptop device.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen bg-black overflow-x-hidden">
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

            {/* Register Button - Controlled by Admin */}
            {maintenanceMode ? (
              <button
                disabled
                className="relative z-50 pointer-events-none px-10 py-3 bg-red-600/50 text-white/70 border border-red-500/30 font-['Outfit'] font-extrabold uppercase tracking-widest text-lg rounded-sm shadow-inner cursor-not-allowed"
              >
                Server Maintenance
              </button>
            ) : registrationOpen ? (
              <a
                href={import.meta.env.VITE_REGISTER_URL || "#"}
                className="relative z-50 pointer-events-auto px-10 py-3 bg-white text-black font-['Outfit'] font-extrabold uppercase tracking-widest text-lg rounded-sm shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:bg-zinc-200 hover:scale-105 transition-all duration-300 flex items-center justify-center"
              >
                Register Now !
              </a>
            ) : (
              <button
                disabled
                className="relative z-10 pointer-events-none px-10 py-3 bg-gray-600/50 text-white/50 font-['Outfit'] font-extrabold uppercase tracking-widest text-lg rounded-sm shadow-inner cursor-not-allowed"
              >
                Registration opening soon!
              </button>
            )}
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
          <section ref={themeSectionRef} className="relative w-full min-h-screen flex flex-col items-center pt-10">
            {/* Slight dark overlay to ensure readability while preserving artwork vibrance */}
            <div className="absolute inset-0 bg-black/35 z-0 pointer-events-none"></div>

            {/* Featured Events Heading */}
            <div className="relative z-30 flex items-center justify-center w-full -mb-6">
              <div className="relative w-[85vw] max-w-4xl drop-shadow-[0_0_25px_rgba(255,255,255,0.4)]">
                {/* Invisible layout controller */}
                <img
                  src={ThemeOT}
                  alt="Our Theme Title"
                  className="w-full h-auto"
                />
              </div>
            </div>

            {/* Our Theme Description section */}
            <div className="relative w-full max-w-6xl mx-auto px-6 z-30 mt-8 pb-32 flex justify-center text-center">
              <p className="text-white/90 text-justify text-xl md:text-2xl leading-relaxed tracking-wide font-bold drop-shadow-[0_0_15px_rgba(0,0,0,1)] playfair-display">
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
              className="w-170 h-auto opacity-0"
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
            {/* Memory Data Array - Restored Scattered Orientation */}
            {[
              { pos: { top: "2%", left: "5%" }, rot: "-8deg", z: "50px", img: galleryImg1 },
              { pos: { top: "8%", left: "40%" }, rot: "5deg", z: "120px", img: galleryImg2 },
              { pos: { top: "5%", left: "72%" }, rot: "-12deg", z: "80px", img: galleryImg3 },
              { pos: { top: "25%", left: "2%" }, rot: "10deg", z: "60px", img: galleryImg4 },
              { pos: { top: "35%", right: "5%" }, rot: "-5deg", z: "150px", img: galleryImg5 },
              { pos: { top: "45%", left: "30%" }, rot: "7deg", z: "90px", img: galleryImg6 },
              { pos: { top: "60%", left: "5%" }, rot: "-4deg", z: "40px", img: galleryImg7 },
              { pos: { top: "65%", right: "10%" }, rot: "15deg", z: "110px", img: galleryImg8 },
              { pos: { top: "75%", left: "20%" }, rot: "-6deg", z: "70px", img: galleryImg9 },
              { pos: { top: "85%", left: "55%" }, rot: "3deg", z: "130px", img: galleryImg10 },
              { pos: { top: "92%", left: "5%" }, rot: "2deg", z: "160px", img: enthusiaImg, isLandscape: true }
            ].map((card, i) => (
              <div
                key={i}
                className={`absolute z-10 ${card.isLandscape ? "w-[450px] md:w-[600px]" : "w-[300px] md:w-[350px]"}`}
                style={{
                  top: card.pos.top,
                  left: card.pos.left,
                  right: card.pos.right,
                  transform: `rotate(${card.rot}) translateZ(${card.z})`
                }}
              >
                <div className={`relative w-full ${card.isLandscape ? "aspect-video" : "aspect-[4/5]"} bg-white/5 border border-white/20 p-2 rounded-sm shadow-2xl overflow-hidden`}>
                  <div className="relative w-full h-full bg-[#0a0a0a] overflow-hidden">
                    <img src={card.img} alt="Gallery item" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10"></div>
                  </div>
                </div>
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
          {
            [...Array(30)].map((_, i) => (
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
            ))
          }
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
              className="w-170 h-auto opacity-0"
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
            {teamMembers.map((member, i) => (
              <div key={i} className="group relative aspect-[3/4] bg-white/5 backdrop-blur-xl border border-white/10 rounded-sm overflow-hidden p-1">
                <div className="w-full h-full border border-white/5 relative bg-black/40 flex flex-col justify-end p-8 overflow-hidden">
                  {member.image ? (
                    <>
                      <img
                        src={member.image}
                        alt={member.name}
                        className="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-1"></div>
                    </>
                  ) : (
                    <div className="absolute inset-0 bg-zinc-900/50 flex items-center justify-center">
                      {/* Optional: Add a placeholder icon or text here */}
                    </div>
                  )}

                  <div className="relative z-10">
                    <h3 className="text-white berkshire-swash-regular text-3xl tracking-tighter transition-all duration-700">{member.name}</h3>
                    <div className="w-12 h-1 bg-white/60 mt-4 mb-4 rounded-full transition-all duration-700"></div>

                    {/* Instagram Handle Space */}
                    <div className="flex items-center gap-2 text-white/40 group-hover:text-pink-500 transition-colors duration-300">
                      <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                      </svg>
                      <span className="text-[10px] tracking-widest lowercase">@{member.handle}</span>
                    </div>
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
      </section >
    </div >
  );
}

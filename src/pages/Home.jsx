import React from 'react';
import { useNavigate } from 'react-router-dom';
import leftSkull from '../assets/backgrounds/Left skull.webp';
import rightSkull from '../assets/backgrounds/RS3.webp';
import mainSkull from '../assets/backgrounds/Skull pro.webp';
import background from '../assets/backgrounds/3. BGwithIllustrations.webp';
import titleFont from '../assets/backgrounds/Untitled35_20260106001225.png';
import featuredOT from '../assets/backgrounds/FeaturedOT.png';
import featuredBg from '../assets/backgrounds/TheOneByShubho.png';

export default function Home() {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    // Navigate instantly! The massive video overlay correctly plays inside the newly dedicated route instead!
    navigate('/register');
  };

  return (
    <div className="relative w-full min-h-screen bg-black overflow-x-hidden font-sans">

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
        <div className="absolute bottom-0 left-0 w-full z-30 pointer-events-none bg-gradient-to-t from-[#000000] via-[#000000]/70 to-transparent flex flex-col justify-end items-center pt-8 pb-8">
          <img
            src={titleFont}
            alt="Sahotsava Title"
            className="w-auto h-[50vh] drop-shadow-[0_0_20px_rgba(255,255,255,0.4)] object-contain -mb-20"
          />

          {/* Register Button */}
          <button
            onClick={handleRegisterClick}
            className="pointer-events-auto px-10 py-3 bg-gradient-to-r from-red-600 to-orange-500 hover:from-white hover:to-white hover:text-red-600 text-white font-['Outfit'] font-extrabold uppercase tracking-widest text-lg rounded-sm shadow-[0_0_15px_rgba(255,0,0,0.5)] hover:shadow-[0_0_30px_rgba(255,255,255,0.8)] transition-all duration-75 transform hover:-translate-y-1"
          >
            Register
          </button>
        </div>

        {/* Social Links on the Top Right */}
        <div className="absolute right-6 lg:right-10 top-6 lg:top-10 flex flex-col gap-6 lg:gap-8 z-40">
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="group pointer-events-auto">
            <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-white/70 group-hover:text-pink-500 transition-all duration-300 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(236,72,153,0.8)]"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
          </a>
          <a href="https://facebook.com" target="_blank" rel="noreferrer" className="group pointer-events-auto">
            <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-white/70 group-hover:text-blue-500 transition-all duration-300 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
          </a>
          <a href="mailto:contact@sahotsava.com" className="group pointer-events-auto">
            <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-white/70 group-hover:text-red-500 transition-all duration-300 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
          </a>
        </div>
      </section>

      {/* MASSIVE PURE DARK SPACER - 150vh of pure black before the reveal begins */}
      <div className="w-full h-[150vh] bg-black"></div>

      {/* WRAPPER TO SHARE THE COSMIC BACKGROUND ACROSS THE GAP AND THE SECTION */}
      <div
        className="relative w-full bg-cover bg-center bg-no-repeat bg-fixed"
        style={{ backgroundImage: `url(${featuredBg})` }}
      >
        {/* MASSIVE TRANSITION REVEAL SPACER */}
        <div className="relative w-full h-[150vh] flex items-center justify-center overflow-hidden">
          {/* Fade from Hero pure black into the majestic space background seamlessly merging with the section below! */}
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black/30 z-0 pointer-events-none"></div>

          {/* Drifting Cosmic Stardust Effect */}
          <style>{`
            @keyframes driftUpFrames {
              0% { background-position: 0 100vh; }
              100% { background-position: 0 0; }
            }
          `}</style>
          <div className="absolute inset-0 z-10 opacity-40 pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.8) 1.5px, transparent 2px)', backgroundSize: '120px 120px', animation: 'driftUpFrames 40s linear infinite' }}></div>
          <div className="absolute inset-0 z-10 opacity-30 pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(0,255,204,0.6) 2px, transparent 2.5px)', backgroundSize: '180px 180px', animation: 'driftUpFrames 25s linear infinite' }}></div>

          {/* Floating glowing energy clouds matching the liquid rainbow neon colors */}
          <div className="absolute top-[20%] left-[10%] w-[50vw] h-[50vw] bg-[#aa00ff]/20 rounded-full blur-[120px] animate-[pulse_8s_ease-in-out_infinite] z-20 pointer-events-none"></div>
          <div className="absolute top-[50%] right-[10%] w-[40vw] h-[40vw] bg-[#ff0055]/15 rounded-full blur-[100px] animate-[pulse_10s_ease-in-out_infinite_reverse] z-20 pointer-events-none"></div>
          <div className="absolute bottom-[10%] left-[30%] w-[30vw] h-[30vw] bg-[#00ffcc]/15 rounded-full blur-[100px] animate-[pulse_9s_ease-in-out_infinite] z-20 pointer-events-none"></div>
        </div>

        {/* 2. FEATURED SECTION */}
        <section className="relative w-full min-h-screen flex flex-col items-center pt-10">
          {/* Slight dark overlay to ensure readability while preserving artwork vibrance */}
          <div className="absolute inset-0 bg-black/30 z-0 pointer-events-none"></div>

          {/* Featured Events Heading */}
          <div className="relative z-30 flex items-center justify-center w-full -mb-6">
            <div className="relative w-[85vw] max-w-4xl drop-shadow-[0_0_25px_rgba(255,255,255,0.4)]">
              {/* Invisible layout controller */}
              <img
                src={featuredOT}
                alt="Featured Events Layout"
                className="w-full h-auto opacity-0"
              />

              {/* Pure White Fill Mask! */}
              <div
                className="absolute inset-0 w-full h-full bg-white"
                style={{
                  WebkitMaskImage: `url(${featuredOT})`,
                  WebkitMaskSize: 'contain',
                  WebkitMaskPosition: 'center',
                  WebkitMaskRepeat: 'no-repeat',
                  maskImage: `url(${featuredOT})`,
                  maskSize: 'contain',
                  maskPosition: 'center',
                  maskRepeat: 'no-repeat'
                }}
              />
            </div>
          </div>

          {/* Our Theme Description section */}
          <div className="relative w-full max-w-6xl mx-auto px-6 z-30 mt-8 pb-32 flex justify-center text-center">
            <p className="text-white/90 font-sans text-xl md:text-3xl leading-relaxed tracking-wide font-light drop-shadow-[0_0_15px_rgba(0,0,0,1)]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
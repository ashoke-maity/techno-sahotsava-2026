import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CMPSOTHeading from '../assets/backgrounds/CMPSOT.png';
import sponsorDeck from '../assets/sponsors/Techno Sahotsava Sponsorship 2026 Deck.pdf';
import loadingVideo from "../assets/loading_screen/loading_anim.mp4";

const sponsorsData = [
    {
        title: "Food Partner",
        icon: "🍔",
        color: "text-[#f97316]",
        bgColor: "#f97316",
        count: 10,
    },
    {
        title: "Goodies Partner",
        icon: "🎁",
        color: "text-[#ec4899]",
        bgColor: "#ec4899",
        count: 10,
    },
    {
        title: "Media Partner",
        icon: "📺",
        color: "text-[#3b82f6]",
        bgColor: "#3b82f6",
        count: 9,
    },
    {
        title: "Event Partner",
        icon: "🎯",
        color: "text-[#10b981]",
        bgColor: "#10b981",
        count: 10,
    }
];

export default function Sponsors() {
    const navigate = useNavigate();
    const [isWarping, setIsWarping] = useState(false);

    const handleBackClick = () => {
        setIsWarping(true);
    };

    return (
        <div className="relative w-full min-h-screen bg-[#050505] overflow-x-hidden font-sans pb-32 text-white">

            {/* 0. HYPERSPACE JUMP TRANSITION OVERLAY */}
            {isWarping && (
                <div className="fixed inset-0 z-[10000] bg-black flex items-center justify-center overflow-hidden">
                    {/* Background Video Animation plays until end */}
                    <video
                        autoPlay
                        muted
                        onEnded={() => navigate("/")}
                        className="absolute inset-0 w-full h-full object-cover"
                        src={loadingVideo}
                    ></video>
                </div>
            )}

            {/* MAIN CONTENT WRAPPER - Hidden during warp to prevent flickering */}
            <div className={isWarping ? "hidden" : "contents"}>
                {/* ATMOSPHERIC STARDUST (Directly unifying with the main voyage) */}
                <div className="fixed inset-0 z-0 pointer-events-none opacity-30">
                    {[...Array(60)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute bg-white rounded-full animate-pulse"
                            style={{
                                width: `${Math.random() * 2 + 0.5}px`,
                                height: `${Math.random() * 2 + 0.5}px`,
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                opacity: Math.random() * 0.4 + 0.1,
                                animationDuration: `${Math.random() * 5 + 3}s`,
                                animationDelay: `${Math.random() * 5}s`,
                                boxShadow: '0 0 10px rgba(255,255,255,0.4)'
                            }}
                        ></div>
                    ))}
                </div>

                {/* PREMIUM BACK BUTTON: 'THE PORTAL' */}
                <button
                    onClick={handleBackClick}
                    className="fixed left-6 top-8 z-[9999] group flex items-center gap-4 py-2 pl-3 pr-6 rounded-full bg-black/40 backdrop-blur-2xl border border-white/20 hover:border-white/40 transition-all duration-700 hover:shadow-[0_0_40px_rgba(255,255,255,0.15)] active:scale-95"
                >
                    {/* The Rotating Ring */}
                    <div className="relative w-10 h-10 flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full border border-white/10 group-hover:border-white/40 group-hover:rotate-180 transition-all duration-[1.5s]"></div>
                        <div className="absolute inset-0 rounded-full border-t-2 border-white/60 opacity-0 group-hover:opacity-100 animate-spin"></div>
                        <svg
                            viewBox="0 0 24 24"
                            width="20"
                            height="20"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="relative z-10 text-white/80 group-hover:text-white transition-colors group-hover:-translate-x-1"
                        >
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                    </div>
                    <div className="flex flex-col items-start leading-none">
                        <span className="text-[10px] text-white/30 font-mono tracking-[0.3em] uppercase mb-1">Return to</span>
                        <span className="text-sm text-white/90 font-['Outfit'] font-black tracking-[0.1em] uppercase group-hover:tracking-[0.2em] transition-all">The Voyage</span>
                    </div>
                </button>

                {/* 1. HEADER */}
                <section className="relative w-full pt-24 pb-16 flex flex-col items-center px-4 overflow-hidden">
                    {/* Background Shadow Radiance */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-white/[0.05] to-transparent pointer-events-none z-0"></div>

                    <div className="relative z-30 flex items-center justify-center w-full mb-8">
                        <div className="relative w-[85vw] max-w-[450px] drop-shadow-[0_0_40px_rgba(255,255,255,0.3)] animate-[float_6s_ease-in-out_infinite]">
                            <img src={CMPSOTHeading} alt="Previous Sponsors" className="w-full h-auto opacity-0" />
                            <div
                                className="absolute inset-0 w-full h-full bg-white"
                                style={{
                                    WebkitMaskImage: `url(${CMPSOTHeading})`,
                                    WebkitMaskSize: 'contain',
                                    WebkitMaskPosition: 'center',
                                    WebkitMaskRepeat: 'no-repeat',
                                    maskImage: `url(${CMPSOTHeading})`,
                                    maskSize: 'contain',
                                    maskPosition: 'center',
                                    maskRepeat: 'no-repeat'
                                }}
                            />
                        </div>
                    </div>

                    <p className="relative z-10 text-white/60 font-['Outfit'] text-base md:text-lg text-center max-w-2xl px-6 mb-12 leading-relaxed tracking-wide italic">
                        "United in Vision, Excellence in Execution. Celebrating the pillars of Sahotsava's journey."
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div
                            className="relative z-10 group overflow-hidden bg-white px-10 py-4 rounded-sm transition-all duration-500 hover:scale-105 cursor-pointer"
                            onClick={() => window.open(sponsorDeck, '_blank')}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-pink-500 opacity-0 group-hover:opacity-10 opacity-transition duration-500"></div>
                            <span className="relative z-10 text-black font-['Outfit'] font-black uppercase tracking-[0.2em] text-sm">Become a Sponsor</span>
                        </div>
                    </div>
                </section>

                {/* 2. SPONSOR SECTIONS */}
                <section className="relative w-full max-w-6xl mx-auto px-6 z-30 flex flex-col gap-24">
                    {sponsorsData.map((section, idx) => (
                        <div key={idx} className="w-full flex flex-col group">

                            {/* Section Header with dynamic accent */}
                            <div className="flex items-center gap-6 mb-8 w-full">
                                <div
                                    className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-xl bg-black/40 backdrop-blur-md group-hover:border-white/50 group-hover:scale-110 transition-all duration-500"
                                    style={{ boxShadow: `0 0 20px ${section.bgColor}20` }}
                                >
                                    {section.icon}
                                </div>
                                <div className="flex flex-col">
                                    <h2 className="text-white font-['Outfit'] font-black uppercase tracking-[0.1em] text-2xl md:text-3xl group-hover:text-white/90">
                                        {section.title}
                                    </h2>
                                    <div
                                        className="h-1 rounded-full mt-1 group-hover:w-full transition-all duration-1000"
                                        style={{ width: '40px', backgroundColor: section.bgColor, boxShadow: `0 0 15px ${section.bgColor}80` }}
                                    ></div>
                                </div>
                                <div className="flex-1 h-[1px] bg-gradient-to-r from-white/10 to-transparent ml-4"></div>
                            </div>

                            {/* Grid with glassmorphic cards */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-1">
                                {Array.from({ length: section.count }).map((_, i) => (
                                    <div key={i} className="aspect-video relative group/card cursor-pointer">
                                        <div className="absolute inset-0 bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-lg group-hover/card:bg-white/[0.08] group-hover/card:border-white/30 transition-all duration-500"></div>
                                        <div className="absolute inset-0 flex flex-col justify-center items-center p-6 space-y-2">
                                            <div className="w-12 h-1 bg-white/5 rounded-full mb-1 group-hover/card:bg-white/20 transition-all"></div>
                                            <span className="text-white/20 font-mono tracking-[0.4em] uppercase font-bold text-[9px] group-hover/card:text-white/60 transition-all">
                                                LOGO_ARCHIVE
                                            </span>
                                        </div>
                                        <div className="absolute bottom-3 right-3 w-1.5 h-1.5 rounded-full bg-white/10 group-hover/card:bg-white/40 transition-all"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </section>

                <style>{`
                    @keyframes float {
                        0%, 100% { transform: translateY(0px); filter: drop-shadow(0 0 40px rgba(255,255,255,0.3)); }
                        50% { transform: translateY(-15px); filter: drop-shadow(0 0 60px rgba(255,255,255,0.5)); }
                    }
                `}</style>
            </div>
        </div>
    );
}

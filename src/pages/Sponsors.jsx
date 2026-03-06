import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CMPSOTHeading from '../assets/backgrounds/CMPSOT.png';
import sponsorDeck from '../assets/sponsors/Techno Sahotsava Sponsorship 2026 Deck.pdf';
import loadingVideo from "../assets/loading_screen/loading_anim.mp4";

// Dynamically import all logos from the sponsor_logo directory
const logoModules = import.meta.glob('../assets/sponsor_logo/*.{png,jpg,jpeg,webp}', { eager: true });
const sponsorsData = Object.values(logoModules).map((module) => module.default || module);

export default function Sponsors() {
    const navigate = useNavigate();
    const [isWarping, setIsWarping] = useState(false);

    const handleBackClick = () => {
        setIsWarping(true);
    };

    return (
        <div className="relative w-full min-h-screen bg-[#050505] overflow-x-hidden pb-32 text-white">
            {/* 0. HYPERSPACE JUMP TRANSITION OVERLAY */}
            {isWarping && (
                <div className="fixed inset-0 z-[10000] bg-black flex items-center justify-center overflow-hidden">
                    {/* Background Video Animation plays once then navigates */}
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
                {/* AMBIENT RADIAL GLOW FOR DEPTH */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(60,60,60,0.4)_0%,rgba(5,5,5,1)_70%)] pointer-events-none z-0"></div>

            {/* ATMOSPHERIC STARDUST (Static Background) */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
                {[...Array(60)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute bg-white rounded-full"
                        style={{
                            width: `${Math.random() * 2 + 0.5}px`,
                            height: `${Math.random() * 2 + 0.5}px`,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            opacity: Math.random() * 0.4 + 0.1,
                            boxShadow: '0 0 10px rgba(255,255,255,0.4)'
                        }}
                    ></div>
                ))}
            </div>

            {/* PREMIUM STATIC BACK BUTTON */}
            <button
                onClick={handleBackClick}
                className="fixed left-6 top-8 z-[100] group flex items-center gap-4 py-2 pl-3 pr-6 rounded-full bg-black/40 backdrop-blur-2xl border border-white/20 transition-all duration-300 hover:bg-white/10 hover:border-white/40 cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.05)]"
            >
                <div className="relative w-10 h-10 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border border-white/20 group-hover:border-white/40 transition-colors"></div>
                    <svg
                        viewBox="0 0 24 24"
                        width="20"
                        height="20"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="relative z-10 text-white/80 group-hover:text-white transition-colors"
                    >
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                </div>
                <div className="flex flex-col items-start leading-none">
                    <span className="text-[10px] text-white/40 font-mono tracking-[0.2em] uppercase mb-1">Return</span>
                    <span className="text-sm text-white/90 font-['Outfit'] font-bold tracking-[0.1em] uppercase group-hover:tracking-[0.15em] transition-all">Home</span>
                </div>
            </button>

            {/* HEADER */}
            <section className="relative w-full pt-32 pb-16 flex flex-col items-center px-4 overflow-hidden z-20">
                <div className="relative z-30 flex items-center justify-center w-full mb-10">
                    <div className="relative w-[85vw] max-w-[500px] drop-shadow-[0_0_40px_rgba(255,255,255,0.2)]">
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

                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <button
                        className="group relative z-10 px-10 py-4 rounded-xl backdrop-blur-md bg-white/[0.05] border border-white/20 hover:bg-white/[0.1] hover:border-white/50 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.05)] cursor-pointer overflow-hidden"
                        onClick={() => window.open(sponsorDeck, '_blank')}
                    >
                        {/* Shimmer effect base */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        <span className="relative z-10 text-white font-['Outfit'] font-bold uppercase tracking-[0.2em] text-sm group-hover:text-yellow-400 transition-colors">
                            Become a Sponsor
                        </span>
                    </button>
                </div>
            </section>

            {/* PREMIUM DIVIDER */}
            <div className="relative z-20 w-full max-w-4xl mx-auto flex items-center justify-center mb-16 px-6">
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                <div className="w-2 h-2 rounded-full bg-white/40 mx-4 shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
                <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-white/20 to-transparent"></div>
            </div>

            {/* REFINED SPONSOR GRID */}
            <section className="relative w-full max-w-7xl mx-auto px-6 z-30 mb-20">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 lg:gap-8">
                    {sponsorsData.map((logoSrc, index) => (
                        <div key={index} className="group aspect-square relative bg-white/[0.02] backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden flex items-center justify-center p-6 shadow-[inset_0_0_20px_rgba(255,255,255,0.02)] hover:bg-white/[0.05] hover:border-white/20 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:-translate-y-1 transition-all duration-300">
                            {/* Inner ambient glow for card depth */}
                            <div className="absolute inset-0 bg-gradient-to-t from-white/[0.02] to-transparent pointer-events-none"></div>
                            
                            <img 
                                src={logoSrc} 
                                alt={`Sponsor ${index + 1}`} 
                                className="w-full h-full object-contain filter drop-shadow-lg opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300" 
                                loading="lazy" 
                            />
                        </div>
                    ))}
                </div>
            </section>
            </div>
        </div>
    );
}

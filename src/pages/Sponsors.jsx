import React from 'react';
import CMPSOTHeading from '../assets/backgrounds/CMPSOT.png';
import sponsorDeck from '../assets/sponsors/Techno Sahotsava Sponsorship 2026 Deck.pdf';

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
    return (
        <div className="relative w-full min-h-screen bg-[#050505] overflow-x-hidden font-sans pb-24 text-white">

            {/* 1. HEADER */}
            <section className="relative w-full pt-16 flex flex-col items-center px-4">
                {/* Heading Image */}
                <div className="relative z-30 flex items-center justify-center w-full mb-6">
                    <div className="relative w-[80vw] max-w-[400px] drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                        <img
                            src={CMPSOTHeading}
                            alt="Previous Sponsors & Partners"
                            className="w-full h-auto opacity-0"
                        />

                        {/* Pure White Fill Mask for PSGOT Image */}
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

                {/* Subtitle */}
                <p className="text-[#a0a0a0] font-sans text-sm md:text-base text-center max-w-2xl px-6 mb-10 leading-relaxed">
                    We are proud to have been supported by these incredible organizations that helped make Sahotsava possible.
                </p>

                <a
                    href={sponsorDeck}
                    download="Sahotsava_Sponsorship_Deck_2026.pdf"
                    className="relative z-10 bg-white text-black font-['Outfit'] font-extrabold uppercase tracking-[0.2em] px-8 py-3 rounded-sm hover:bg-gray-200 transition-colors text-sm transform hover:-translate-y-1 duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] block w-max mb-10"
                >
                    Become a Sponsor
                </a>
            </section>

            {/* 2. SPONSOR SECTIONS */}
            <section className="relative w-full max-w-5xl mx-auto px-6 z-30 flex flex-col gap-20">
                {sponsorsData.map((section, idx) => (
                    <div key={idx} className="w-full flex flex-col">

                        {/* Section Header */}
                        <div className="flex items-center gap-4 mb-6 w-full">
                            <div
                                className="w-8 h-8 rounded-md flex items-center justify-center text-sm text-black"
                                style={{
                                    backgroundColor: section.bgColor,
                                    boxShadow: `0 0 15px ${section.bgColor}40`
                                }}
                            >
                                {section.icon}
                            </div>
                            <h2 className={`${section.color} font-['Outfit'] font-extrabold uppercase tracking-wide text-xl md:text-2xl`}>
                                {section.title}
                            </h2>
                            <div className="flex-1 h-[1px] bg-gradient-to-r from-gray-800 to-transparent ml-2"></div>
                            <span className="text-gray-600 text-xs font-bold tracking-[0.2em] uppercase hidden md:inline-block">
                                {section.count} PARTNERS
                            </span>
                        </div>

                        {/* Grid layout with perfect 1px gaps */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-[1px] bg-white/10 p-[1px] rounded-xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
                            {Array.from({ length: section.count }).map((_, i) => (
                                <div key={i} className="aspect-video bg-[#0a0a0a] flex justify-center items-center group hover:bg-[#151515] transition-colors p-6 cursor-pointer">
                                    <span className="text-white/10 font-sans tracking-widest uppercase font-bold text-xs group-hover:text-white/30 transition-colors duration-300">
                                        Logo Space
                                    </span>
                                </div>
                            ))}

                            {/* Fill remaining empty cells to make it aesthetically pleasing if not divisible by 4 (only on desktop) */}
                            {Array.from({ length: (4 - (section.count % 4)) % 4 }).map((_, i) => (
                                <div key={`empty-${i}`} className="aspect-video bg-[#0a0a0a] hidden md:block"></div>
                            ))}

                            {/* Also fill for mobile (2 columns) */}
                            {Array.from({ length: (2 - (section.count % 2)) % 2 }).map((_, i) => (
                                <div key={`empty-mob-${i}`} className="aspect-video bg-[#0a0a0a] md:hidden"></div>
                            ))}
                        </div>

                    </div>
                ))}
            </section>

        </div>
    );
}

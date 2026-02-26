import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import loadingAnim from '../assets/loading_screen/loading_anim.mp4';

export default function UnderConstruction() {
    const navigate = useNavigate();
    const [showContent, setShowContent] = useState(false);
    const [isReturning, setIsReturning] = useState(false);

    const handleReturn = () => {
        setIsReturning(true);
    };

    return (
        <div className="w-full min-h-screen bg-black flex justify-center items-center overflow-hidden">

            {/* INITIAL LOADING SCREEN OVERLAY - Plays immediately */}
            {!showContent && !isReturning && (
                <div className="fixed inset-0 z-[9999] bg-black flex justify-center items-center">
                    <video
                        src={loadingAnim}
                        autoPlay
                        onEnded={() => setShowContent(true)}
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            {/* RETURNING LOADING SCREEN OVERLAY - Plays when leaving */}
            {isReturning && (
                <div className="fixed inset-0 z-[9999] bg-black flex justify-center items-center">
                    <video
                        src={loadingAnim}
                        autoPlay
                        onEnded={() => navigate('/')}
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            {/* OPENING SOON CONTENT - Revealed after animation finishes */}
            {showContent && !isReturning && (
                <div className="flex flex-col items-center justify-center animate-[revealSlowly_1s_ease-out_forwards]">
                    <h1 className="text-white text-5xl md:text-8xl font-['Outfit'] font-black tracking-[0.2em] uppercase text-center drop-shadow-[0_0_30px_rgba(255,255,255,0.8)]">
                        Opening<br />Soon<span className="text-red-600 animate-pulse">!</span>
                    </h1>
                    <button
                        onClick={handleReturn}
                        className="mt-16 px-8 py-3 bg-white/10 border border-white/20 hover:bg-white hover:text-black hover:border-white text-white font-['Outfit'] font-bold uppercase tracking-widest rounded-sm transition-all duration-300"
                    >
                        Return to Voyage
                    </button>

                    <style>{`
            @keyframes revealSlowly {
              0% { opacity: 0; transform: translateY(20px); }
              100% { opacity: 1; transform: translateY(0); }
            }
          `}</style>
                </div>
            )}

        </div>
    );
}

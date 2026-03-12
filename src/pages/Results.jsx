import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Search, X, Loader2, Download, Target, Sparkles, Award, ArrowLeft, Filter, ChevronDown } from 'lucide-react';
import API from '../services/api';
import { io } from 'socket.io-client';
import sahotsavaLogo from '../assets/logos/sahotsava logo posterize.png';
import sofTigLogo from '../assets/logos/sof_tig_tiu_white.png';
import sanskaranLogo from '../assets/logos/sanskaran logo png WHITE.png';
import chitrakaLogo from '../assets/logos/Chitraka white logo.png';
import loadingVideo from "../assets/loading_screen/loading_anim.mp4";

const PreviewCanvas = ({ candidateName, position, eventName }) => {
    const canvasRef = React.useRef(null);


    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = import.meta.env.VITE_CERTIFICATE_URL;
        
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            ctx.textAlign = 'center';
            ctx.font = 'bold 80px Arial';
            ctx.fillStyle = '#111111';
            ctx.fillText(candidateName, canvas.width / 2, canvas.height / 2 - 60);
            ctx.font = 'bold 45px Arial';
            ctx.fillStyle = '#ffb464';
            ctx.fillText(position, canvas.width / 2, canvas.height / 2 + 80);
            ctx.font = '35px Arial';
            ctx.fillStyle = '#555555';
            ctx.fillText(eventName, canvas.width / 2, canvas.height / 2 + 180);
        };
    }, [candidateName, position, eventName]);

    return (
        <canvas 
            ref={canvasRef} 
            className="w-full h-full object-contain"
            style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))' }}
        />
    );
};

const Results = () => {
    const [results, setResults] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPosition, setSelectedPosition] = useState('ALL');
    const [selectedEvent, setSelectedEvent] = useState('ALL');
    const [isLoading, setIsLoading] = useState(true);
    const [isVideoPlaying, setIsVideoPlaying] = useState(true);
    const [isExiting, setIsExiting] = useState(false);
    const navigate = useNavigate();

    const handleVideoEnd = () => {
        if (isExiting) {
            navigate('/');
        } else {
            setIsVideoPlaying(false);
        }
    };

    const fetchResults = useCallback(async () => {
        try {
            const res = await API.get('/technoSahotsava2026/public/results');
            setResults(res.data);
        } catch (err) {
            console.error('Failed to fetch results:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchResults();
    }, [fetchResults]);

    useEffect(() => {
        const socket = io(import.meta.env.VITE_SERVER_URL || '');

        socket.on('resultsUpdate', () => {
            fetchResults();
        });

        return () => {
            socket.disconnect();
        };
    }, [fetchResults]);

    const filteredResults = results.filter(res => {
        const matchesSearch = res.candidate_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            res.event_name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPosition = selectedPosition === 'ALL' || res.position === selectedPosition;
        const matchesEvent = selectedEvent === 'ALL' || res.event_name === selectedEvent;
        return matchesSearch && matchesPosition && matchesEvent;
    });

    const eventsList = ['ALL', ...new Set(results.map(r => r.event_name))];
    const positionsList = ['ALL', '1st', '2nd', '3rd'];

    if (isVideoPlaying || isExiting) {
        return (
            <div className="fixed inset-0 z-[10000] bg-black flex items-center justify-center">
                <video
                    autoPlay
                    muted
                    onEnded={handleVideoEnd}
                    onError={handleVideoEnd}
                    className="absolute inset-0 w-full h-full object-cover"
                    src={loadingVideo}
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050506] text-white font-outfit selection:bg-[#FFB464] selection:text-black relative overflow-x-hidden">
            {/* BACKGROUND WATERMARK */}
            <div className="fixed inset-0 z-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none">
                <img 
                    src={sahotsavaLogo} 
                    alt="" 
                    className="w-[80%] max-w-[800px] aspect-square object-contain"
                />
            </div>

            {/* Navigation Header */}
            <header className="fixed top-0 left-0 w-full z-50 bg-[#0a0a0b]/80 backdrop-blur-xl border-b border-white/5 px-6 md:px-12 py-4">
                <div className="max-w-[1440px] mx-auto flex items-center justify-between">
                    <button 
                        onClick={() => setIsExiting(true)}
                        className="flex items-center gap-2 text-white/40 hover:text-[#FFB464] transition-all group"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-bold uppercase tracking-widest">Back to home page</span>
                    </button>

                    <div className="flex flex-col items-end">
                        <div className="flex items-center gap-2">
                            <Trophy className="text-[#FFB464]" size={18} />
                            <h1 className="text-xl md:text-2xl font-medieval uppercase tracking-tighter">Hall of Fame</h1>
                        </div>
                    </div>
                </div>
            </header>

            {/* Search & Filter Section */}
            <section className="pt-40 pb-12 px-6 relative z-10">
                <div className="max-w-6xl mx-auto flex flex-col items-center gap-8">
                    <div className="flex flex-col md:flex-row items-center gap-4 w-full bg-[#0a0a0b]/40 p-4 rounded-3xl border border-white/5 backdrop-blur-md">
                        {/* Search Input */}
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={20} />
                            <input 
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by name or event..."
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-16 pr-8 text-lg text-white font-outfit placeholder:text-white/20 focus:outline-none focus:border-[#FFB464]/30 transition-all"
                            />
                        </div>

                        {/* Event Filter */}
                        <div className="relative w-full md:w-64">
                            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FFB464]/40" size={16} />
                            <select
                                value={selectedEvent}
                                onChange={(e) => setSelectedEvent(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-10 text-[10px] font-bold tracking-[0.2em] text-[#FFB464] appearance-none focus:outline-none focus:border-[#FFB464]/30 transition-all cursor-pointer uppercase"
                            >
                                {eventsList.map((evt, idx) => (
                                    <option key={idx} value={evt} className="bg-[#0a0a0b] text-white">{evt}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" size={14} />
                        </div>

                        {/* Position Filter */}
                        <div className="relative w-full md:w-48">
                            <Award className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FFB464]/40" size={16} />
                            <select
                                value={selectedPosition}
                                onChange={(e) => setSelectedPosition(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-10 text-[10px] font-bold tracking-[0.2em] text-[#FFB464] appearance-none focus:outline-none focus:border-[#FFB464]/30 transition-all cursor-pointer uppercase"
                            >
                                {positionsList.map((pos, idx) => (
                                    <option key={idx} value={pos} className="bg-[#0a0a0b] text-white">{pos}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" size={14} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Results Grid */}
            <main className="max-w-[1440px] mx-auto px-6 md:px-12 pb-32 relative z-10">
                {isLoading ? (
                    <div className="py-40 flex flex-col items-center justify-center gap-6">
                        <div className="relative">
                            <Loader2 className="animate-spin text-[#FFB464]" size={64} />
                            <Award className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#FFB464]/20" size={32} />
                        </div>
                        <p className="font-medieval text-[#FFB464]/40 tracking-[0.5em] uppercase text-sm animate-pulse">Summoning Champions...</p>
                    </div>
                ) : filteredResults.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredResults.map((result) => (
                            <div 
                                key={result.id}
                                className="group relative bg-[#0a0a0b]/60 backdrop-blur-sm border border-white/5 rounded-[2rem] overflow-hidden hover:border-[#FFB464]/30 transition-all duration-700 flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:shadow-[#FFB464]/5"
                            >
                                {/* Header */}
                                <div className="p-8 pb-4 relative z-10">
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-[10px] font-black text-[#FFB464] tracking-[0.3em] uppercase opacity-70">
                                                <Target size={12} /> {result.event_name}
                                            </div>
                                            <h3 className="text-2xl font-medieval text-white uppercase tracking-tight group-hover:text-[#FFB464] transition-colors leading-tight">
                                                {result.candidate_name}
                                            </h3>
                                        </div>
                                        <div className={`shrink-0 px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-widest border shadow-2xl ${
                                            result.position === '1st' ? 'bg-[#FFB464]/10 text-[#FFB464] border-[#FFB464]/40' :
                                            result.position === '2nd' ? 'bg-zinc-400/10 text-zinc-300 border-zinc-400/30' :
                                            result.position === '3rd' ? 'bg-orange-800/10 text-orange-400 border-orange-800/40' :
                                            'bg-white/5 text-white/40 border-white/10'
                                        }`}>
                                            {result.position}
                                        </div>
                                    </div>
                                </div>

                                {/* Preview Canvas */}
                                <div className="px-8 pb-2 relative z-10 flex-1">
                                    <div className="relative aspect-[1.414/1] w-full rounded-2xl border border-white/5 overflow-hidden bg-black/40 group-hover:border-[#FFB464]/10 transition-all shadow-inner">
                                        <PreviewCanvas 
                                            candidateName={result.candidate_name}
                                            position={result.position}
                                            eventName={result.event_name}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-40 group-hover:opacity-100 transition-opacity duration-700" />
                                    </div>
                                </div>

                                {/* Action Area */}
                                <div className="p-8 pt-4 relative z-10">
                                    <div className="space-y-6 text-center">
                                        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                                        
                                        <button 
                                            onClick={async (e) => {
                                                const btn = e.currentTarget;
                                                const originalContent = btn.innerHTML;
                                                btn.innerHTML = `<span class="animate-spin mr-2">⌛</span> PREPARING...`;
                                                btn.disabled = true;

                                                try {
                                                    const canvas = document.createElement('canvas');
                                                    const ctx = canvas.getContext('2d');
                                                    const img = new Image();
                                                    img.crossOrigin = "anonymous";
                                                    img.src = import.meta.env.VITE_CERTIFICATE_URL;
                                                    
                                                    img.onload = () => {
                                                        canvas.width = img.width;
                                                        canvas.height = img.height;
                                                        ctx.drawImage(img, 0, 0);
                                                        ctx.textAlign = 'center';
                                                        ctx.font = 'bold 80px Arial';
                                                        ctx.fillStyle = '#111111';
                                                        ctx.fillText(result.candidate_name, canvas.width / 2, canvas.height / 2 - 60);
                                                        ctx.font = 'bold 45px Arial';
                                                        ctx.fillStyle = '#ffb464';
                                                        ctx.fillText(result.position, canvas.width / 2, canvas.height / 2 + 80);
                                                        ctx.font = '35px Arial';
                                                        ctx.fillStyle = '#555555';
                                                        ctx.fillText(result.event_name, canvas.width / 2, canvas.height / 2 + 180);
                                                        const link = document.createElement('a');
                                                        link.download = `TS26_Certificate_${result.candidate_name.replace(/\s+/g, '_')}.png`;
                                                        link.href = canvas.toDataURL('image/png');
                                                        link.click();
                                                        btn.innerHTML = originalContent;
                                                        btn.disabled = false;
                                                    };
                                                } catch (err) {
                                                    btn.innerHTML = originalContent;
                                                    btn.disabled = false;
                                                }
                                            }}
                                            className="w-full relative group/btn flex items-center justify-center gap-3 py-4 rounded-xl bg-[#FFB464] text-black text-xs font-black uppercase tracking-[0.2em] hover:bg-white hover:scale-[1.02] active:scale-95 transition-all duration-300 shadow-[0_15px_30px_-10px_rgba(255,180,100,0.5)] overflow-hidden"
                                        >
                                            <div className="absolute inset-0 bg-white/40 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
                                            <Download size={18} className="relative z-10" />
                                            <span className="relative z-10">Claim Certificate</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-40 text-center space-y-6 opacity-30">
                        <Trophy size={120} className="text-[#FFB464] animate-pulse" />
                        <div className="space-y-2">
                            <h3 className="text-3xl font-medieval uppercase tracking-widest">Archive Empty</h3>
                            <p className="text-sm tracking-[0.2em] font-medium uppercase italic">No records found for the selected criteria.</p>
                        </div>
                    </div>
                )}
            </main>

            {/* MINIMALIST IDENTITY FOOTER (Matching Home Page) */}
            <footer className="relative z-10 w-full bg-[#0a0a0b]/80 backdrop-blur-xl border-t border-white/5 py-12 px-6 mt-20">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-16">
                        
                        {/* Left Identity: Institutional (Techno India) */}
                        <div className="flex flex-col items-center md:items-start group cursor-default">
                            <div className="flex items-center gap-6 mb-4 p-2 bg-white/5 rounded-lg border border-white/10">
                                <img src={sofTigLogo} className="h-6 md:h-12 w-auto object-contain" alt="Techno India Logo" />
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
                                <img 
                                    src={sahotsavaLogo} 
                                    className="h-6 md:h-12 w-auto object-contain" 
                                    alt="Sahotsava logo" 
                                />
                                <div className="h-6 w-[1px] bg-white/20" />
                                <img 
                                    src={sanskaranLogo} 
                                    className="h-10 md:h-18 w-auto object-contain" 
                                    alt="Team Sanskaran" 
                                />
                                <div className="h-6 w-[1px] bg-white/20" />
                                <img 
                                    src={chitrakaLogo} 
                                    className="h-10 md:h-12 w-auto object-contain" 
                                    alt="Chitraka" 
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Results;

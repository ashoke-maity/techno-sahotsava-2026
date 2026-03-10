import React from 'react';
import { useNavigate } from 'react-router-dom';

// Core Assets
import chitrakaLogo from "../assets/logos/Chitraka white logo.png";
import sahotsavaLogo from "../assets/logos/sahotsava logo posterize.png";
import sofTigLogo from "../assets/logos/sof_tig_tiu_white.png";
import sanskaranLogo from "../assets/logos/sanskaran logo png WHITE.png";

// Developer Assets
import anirbaanPic from "../assets/developers/anirbaan.jpeg";
import ashokePic from "../assets/team_pics/ashoke.jpg";
import shounakPic from "../assets/developers/shounak.jpeg";
import adhirajPic from "../assets/developers/adhiraaj.jpeg";
import subhadeepPic from "../assets/developers/subhadeep.jpeg";
import supritPic from "../assets/developers/suprit.jpeg";
import ankitaPic from "../assets/developers/ankita.jpeg";

const Developers = () => {
  const navigate = useNavigate();

  const teams = [
    {
      role: "Digital Artists",
      members: [
        { name: "Subhadeep", image: subhadeepPic, insta: "subha_deep" },
        { name: "Suprit", image: supritPic, insta: "sup_rit" },
        { name: "Ankita", image: ankitaPic, insta: "ankita_dg" },
      ]
    },
    {
      role: "UI & Development",
      members: [
        { name: "Anirbaan", image: anirbaanPic, insta: "anir_baan" },
        { name: "Ashoke", image: ashokePic, insta: "ashoke_dev" },
      ]
    },
    {
      role: "Video Animations",
      members: [
        { name: "Shounak", image: shounakPic, insta: "shou_nak" },
        { name: "Adhiraj", image: adhirajPic, insta: "adhira_aj" },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-20 font-outfit">
      {/* Back Button */}
      <button 
        onClick={() => navigate('/')}
        className="fixed top-8 left-6 md:left-20 z-[100] flex items-center gap-2 text-[#FFB464] hover:gap-4 transition-all duration-300 group bg-black/40 backdrop-blur-md px-4 py-2 border border-white/10 rounded-full"
      >
        <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="uppercase tracking-widest text-[10px] font-bold">Back to Civilization</span>
      </button>

      <div className="max-w-7xl mx-auto pt-20">
        {/* Chitraka Highlight Section */}
        <div className="relative group mb-32 border border-[#FFB464]/20 bg-[#FFB464]/5 p-8 md:p-16 backdrop-blur-xl flex flex-col md:flex-row items-center gap-12 overflow-hidden shadow-[0_0_100px_rgba(255,180,100,0.05)]">
          <div className="relative z-10 w-32 md:w-48 shrink-0">
            <img src={chitrakaLogo} alt="Chitraka Domain" className="w-full h-auto drop-shadow-[0_0_30px_rgba(255,180,100,0.3)] group-hover:scale-110 transition-transform duration-700" />
          </div>

          <div className="relative z-10 flex-1 text-center md:text-left">
            <div className="font-medieval text-[#FFB464] text-xs uppercase tracking-[0.5em] mb-4">The Foundation</div>
            <h2 className="font-medieval text-5xl md:text-7xl leading-tight tracking-tighter mb-6 uppercase">
              Chitraka Domain.
            </h2>
            <p className="text-white/70 max-w-2xl text-base md:text-lg leading-relaxed font-outfit">
              The <span className="text-[#FFB464]">Chitraka Domain</span> is the definitive creative engine of Team Sanskaran. As a titan of visual storytelling—encompassing photography, digital editing, videography, and fine arts—it provided the essential aesthetic blueprint for this civilization. <span className="text-white font-bold italic">The realization of this digital world would have been impossible without the visionary contributions of this domain.</span>
            </p>
          </div>
        </div>

        {/* Architects Grid */}
        <div className="mb-24">
          <h2 className="font-medieval text-4xl md:text-6xl tracking-tighter mb-16 border-b border-white/10 pb-8 uppercase">
            The Digital Architects
          </h2>
          
          <div className="space-y-24">
            {teams.map((team, tIdx) => (
              <div key={tIdx} className="space-y-12">
                <div className="flex items-center gap-4">
                  <span className="h-[1px] w-12 bg-[#FFB464]/40" />
                  <h3 className="font-medieval text-[#FFB464] text-xl uppercase tracking-widest">{team.role}</h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-10">
                  {team.members.map((member, mIdx) => (
                    <div key={mIdx} className="group relative">
                      <div className="aspect-[3/4] overflow-hidden bg-white/5 border border-white/10 group-hover:border-[#FFB464]/50 transition-colors duration-500 rounded-sm">
                        <img 
                          src={member.image} 
                          alt={member.name} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      
                      <div className="mt-6 border-l-2 border-white/10 group-hover:border-[#FFB464] transition-colors duration-500 pl-4">
                        <h4 className="font-medieval text-2xl uppercase tracking-tighter mb-1 text-white/90">{member.name}</h4>
                        <a 
                          href={`https://instagram.com/${member.insta}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-white/20 hover:text-[#FFB464] transition-colors duration-300"
                        >
                          <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                          </svg>
                          <span className="text-[9px] uppercase font-bold tracking-[0.2em]">Instagram</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MINIMALIST IDENTITY FOOTER (Same as Home) */}
      <div className="relative z-10 w-full max-w-7xl mx-auto pt-12 pb-4 border-t border-white/5 mt-20">
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
    </div>
  );
};

export default Developers;

import React, { useState, useEffect, useCallback } from 'react';
import API from '../services/api';
import { io } from 'socket.io-client';

const CollegeRepForm = ({ isOpen, onClose }) => {
  const [colleges, setColleges] = useState([]);
  const [isCollegesOpen, setIsCollegesOpen] = useState(true);
  const [isLoadingColleges, setIsLoadingColleges] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    phone: '+91',
    whatsapp: '+91',
    college: ''
  });

  const fetchColleges = useCallback(async () => {
    setIsLoadingColleges(true);
    try {
      const rawUrl = import.meta.env.VITE_SERVER_URL;
      if (!rawUrl) return;
      let serverOrigin = "";
      try {
        serverOrigin = new URL(rawUrl).origin;
      } catch (e) {
        serverOrigin = rawUrl.split("/technoSahotsava2026")[0];
      }

      // Fetch the colleges from the database endpoint
      const response = await API.get(`${serverOrigin}/technoSahotsava2026/public/colleges`);
      
      let fetchedColleges = [];
      const isOpen = response.data?.isOpen !== false;
      setIsCollegesOpen(isOpen);

      if (isOpen) {
        if (response.data && Array.isArray(response.data.colleges)) {
          fetchedColleges = response.data.colleges;
        } else if (Array.isArray(response.data)) {
          fetchedColleges = response.data;
        }
        
      }
      setColleges(fetchedColleges);
    } catch (err) {
      console.error("Failed to fetch colleges map from database:", err);
    } finally {
      setIsLoadingColleges(false);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    fetchColleges();
  }, [isOpen, fetchColleges]);

  useEffect(() => {
    const rawUrl = import.meta.env.VITE_SERVER_URL;
    let socket;
    if (rawUrl) {
      let serverOrigin = "";
      try {
        serverOrigin = new URL(rawUrl).origin;
      } catch (e) {
        serverOrigin = rawUrl.split("/technoSahotsava2026")[0];
      }
      socket = io(serverOrigin);
    socket.on('collegesStatusUpdate', (data) => {
        console.log("Real-time college status update:", data);
        fetchColleges();
    });

    socket.on('collegesDirectoryUpdate', () => {
        console.log("Real-time directory update detected");
        fetchColleges();
    });
}
return () => {
    if (socket) socket.disconnect();
};
}, [fetchColleges]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const rawUrl = import.meta.env.VITE_SERVER_URL;
      if (!rawUrl) return;
      let serverOrigin = "";
      try {
        serverOrigin = new URL(rawUrl).origin;
      } catch (e) {
        serverOrigin = rawUrl.split("/technoSahotsava2026")[0];
      }

      const response = await API.post(`${serverOrigin}/technoSahotsava2026/public/register-rep`, formData);
      
      if (response.data.success) {
        alert("Registration Successful!\nYour generated password is: " + response.data.password + "\nPlease save this for later access.");
        setFormData({
            firstName: '',
            middleName: '',
            lastName: '',
            email: '',
            phone: '+91',
            whatsapp: '+91',
            college: ''
        });
        onClose();
      } else {
        alert(response.data.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Form Submission Error:", err);
      alert(err.response?.data?.message || "Internal server error. Registration could not be processed.");
    }
  };

  const handleEmailChange = (e) => {
    setFormData({ ...formData, email: e.target.value.toLowerCase() });
  };

  const handlePhoneChange = (name, value) => {
    // Ensure +91 remains if it's there, but handle normal entry too
    if (!value.startsWith('+91')) {
      if (value.startsWith('91')) value = '+' + value;
      else if (!value.startsWith('+')) value = '+91' + value;
    }
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
      <div 
        className="relative w-full max-w-2xl bg-[#0a0a0a] border border-[#FFB464]/30 p-8 md:p-12 overflow-y-auto max-h-[90vh] shadow-[0_0_100px_rgba(255,180,100,0.1)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-white/40 hover:text-[#FFB464] transition-colors"
        >
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="mb-10 text-center">
          <h2 className="font-medieval text-4xl md:text-5xl text-[#FFB464] mb-2 uppercase tracking-tighter">
            Join the Vanguard.
          </h2>
          <p className="font-outfit text-white/40 text-xs uppercase tracking-[0.3em]">
            Become a College Representative for Sahotsava 2026
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Fields: First, Middle, Last */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-[10px] uppercase tracking-[0.2em] text-[#FFB464]/60 font-bold">First Name *</label>
              <input 
                required
                type="text" 
                className="w-full bg-white/5 border border-white/10 p-3 text-white focus:border-[#FFB464] outline-none transition-colors font-outfit"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] uppercase tracking-[0.2em] text-[#FFB464]/60 font-bold">Middle Name</label>
              <input 
                type="text" 
                className="w-full bg-white/5 border border-white/10 p-3 text-white focus:border-[#FFB464] outline-none transition-colors font-outfit"
                value={formData.middleName}
                onChange={(e) => setFormData({...formData, middleName: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] uppercase tracking-[0.2em] text-[#FFB464]/60 font-bold">Last Name *</label>
              <input 
                required
                type="text" 
                className="w-full bg-white/5 border border-white/10 p-3 text-white focus:border-[#FFB464] outline-none transition-colors font-outfit"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] uppercase tracking-[0.2em] text-[#FFB464]/60 font-bold">Email Address *</label>
            <input 
              required
              type="email" 
              placeholder="example@yourmail.com"
              className="w-full bg-white/5 border border-white/10 p-3 text-white focus:border-[#FFB464] outline-none transition-colors font-outfit"
              value={formData.email}
              onChange={handleEmailChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-[10px] uppercase tracking-[0.2em] text-[#FFB464]/60 font-bold">Phone Number *</label>
              <input 
                required
                type="tel" 
                className="w-full bg-white/5 border border-white/10 p-3 text-white focus:border-[#FFB464] outline-none transition-colors font-outfit"
                value={formData.phone}
                onChange={(e) => handlePhoneChange('phone', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] uppercase tracking-[0.2em] text-[#FFB464]/60 font-bold">WhatsApp Number *</label>
              <input 
                required
                type="tel" 
                className="w-full bg-white/5 border border-white/10 p-3 text-white focus:border-[#FFB464] outline-none transition-colors font-outfit"
                value={formData.whatsapp}
                onChange={(e) => handlePhoneChange('whatsapp', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] uppercase tracking-[0.2em] text-[#FFB464]/60 font-bold">College Name *</label>
            <select 
              required
              className={`w-full bg-white/5 border p-3 text-white focus:border-[#FFB464] outline-none transition-colors font-outfit ${!isCollegesOpen ? 'border-red-500/50 cursor-not-allowed opacity-50' : 'border-white/10'}`}
              value={formData.college}
              onChange={(e) => setFormData({...formData, college: e.target.value})}
              disabled={isLoadingColleges || !isCollegesOpen}
            >
              <option value="" className="bg-[#0a0a0a]">
                {isLoadingColleges ? "Fetching colleges..." : !isCollegesOpen ? "-- Directory Closed by Admin --" : "-- Select College --"}
              </option>
              {isCollegesOpen && colleges.map((c, i) => {
                const collegeName = typeof c === 'string' ? c : c.name || c.college_name;
                return (
                  <option key={i} value={collegeName} className="bg-[#0a0a0a]">
                    {collegeName}
                  </option>
                );
              })}
            </select>
            {!isCollegesOpen && (
              <p className="text-[9px] text-red-500/70 font-mono tracking-widest uppercase mt-1 animate-pulse">
                Institution list is currently private. Please try again later.
              </p>
            )}
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-[#FFB464] text-black font-bungee text-lg hover:bg-white transition-all duration-500 uppercase tracking-widest mt-8"
          >
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
};

export default CollegeRepForm;

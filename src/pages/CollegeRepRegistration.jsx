import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { io } from 'socket.io-client';
import { auth } from '../services/firebase';
import { 
    createUserWithEmailAndPassword,
    sendEmailVerification,
    signOut,
    signInWithEmailAndPassword
} from 'firebase/auth';

// Logo Assets
import sahotsavaLogo from '../assets/logos/sahotsava logo posterize.png';
import sofTigLogo from '../assets/logos/sof_tig_tiu_white.png';
import sanskaranLogo from '../assets/logos/sanskaran logo png WHITE.png';
import chitrakaLogo from '../assets/logos/Chitraka white logo.png';

const CollegeRepRegistration = () => {
    const navigate = useNavigate();
    const [colleges, setColleges] = useState([]);
    const [isCollegesOpen, setIsCollegesOpen] = useState(true);
    const [isLoadingColleges, setIsLoadingColleges] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasSecondRep, setHasSecondRep] = useState(false);
    
    // Verification States
    const [verificationStep, setVerificationStep] = useState(null); // 'email' | null
    const [isVerifying, setIsVerifying] = useState(false);
    
    const [verificationStatus, setVerificationStatus] = useState({
        rep1Email: false,
        rep2Email: false
    });

    const initialRepState = {
        firstName: '',
        middleName: '',
        lastName: '',
        email: '',
        phone: '',
        whatsapp: ''
    };

    const [college, setCollege] = useState('');
    const [rep1, setRep1] = useState({ ...initialRepState });
    const [rep2, setRep2] = useState({ ...initialRepState });

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

            const response = await API.get(`${serverOrigin}/technoSahotsava2026/public/colleges`);
            const isOpen = response.data?.isOpen !== false;
            setIsCollegesOpen(isOpen);

            let fetchedColleges = [];
            if (isOpen) {
                if (response.data && Array.isArray(response.data.colleges)) {
                    fetchedColleges = response.data.colleges;
                } else if (Array.isArray(response.data)) {
                    fetchedColleges = response.data;
                }
            }
            setColleges(fetchedColleges);
        } catch (err) {
            // Log suppressed
        } finally {
            setIsLoadingColleges(false);
        }
    }, []);

    useEffect(() => {
        fetchColleges();
        
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
            socket.on('collegesStatusUpdate', () => fetchColleges());
            socket.on('collegesDirectoryUpdate', () => fetchColleges());
        }
        return () => {
            if (socket) socket.disconnect();
        };
    }, [fetchColleges]);

    // Real-time Automatic Status Detection with Silent Session Restoration
    useEffect(() => {
        if (!rep1.email || !rep1.email.includes('@') || !rep1.email.includes('.') || verificationStatus.rep1Email) return;
        
        const timer = setTimeout(async () => {
            const email = rep1.email.toLowerCase();
            const repKey = 'rep1Email';
            const VERIFY_PASS = `Sahotsava26_V1_${email.split('@')[0]}`;
            const verifiedCache = JSON.parse(localStorage.getItem('sahotsava_verified_emails') || '{}');

            // 1. If already in active session, just reload and confirm
            if (auth.currentUser && auth.currentUser.email?.toLowerCase() === email) {
                await auth.currentUser.reload();
                if (auth.currentUser.emailVerified) {
                    setVerificationStatus(prev => ({ ...prev, [repKey]: true }));
                    verifiedCache[email] = true;
                    localStorage.setItem('sahotsava_verified_emails', JSON.stringify(verifiedCache));
                    return;
                }
            }

            // 2. If in cache but no session, try a silent sign-in to restore token for submission
            if (verifiedCache[email]) {
                try {
                    const res = await signInWithEmailAndPassword(auth, email, VERIFY_PASS);
                    if (res.user.emailVerified) {
                        setVerificationStatus(prev => ({ ...prev, [repKey]: true }));
                    }
                } catch (e) {
                    // Silent fail for background check to avoid console clutter
                }
            }
        }, 800);

        return () => clearTimeout(timer);
    }, [rep1.email, verificationStatus.rep1Email, auth]);

    useEffect(() => {
        if (!rep2.email || !rep2.email.includes('@') || !rep2.email.includes('.') || verificationStatus.rep2Email) return;
        
        const timer = setTimeout(async () => {
            const email = rep2.email.toLowerCase();
            const repKey = 'rep2Email';
            const VERIFY_PASS = `Sahotsava26_V1_${email.split('@')[0]}`;
            const verifiedCache = JSON.parse(localStorage.getItem('sahotsava_verified_emails') || '{}');

            if (auth.currentUser && auth.currentUser.email?.toLowerCase() === email) {
                await auth.currentUser.reload();
                if (auth.currentUser.emailVerified) {
                    setVerificationStatus(prev => ({ ...prev, [repKey]: true }));
                    verifiedCache[email] = true;
                    localStorage.setItem('sahotsava_verified_emails', JSON.stringify(verifiedCache));
                    return;
                }
            }

            if (verifiedCache[email]) {
                try {
                    const res = await signInWithEmailAndPassword(auth, email, VERIFY_PASS);
                    if (res.user.emailVerified) {
                        setVerificationStatus(prev => ({ ...prev, [repKey]: true }));
                    }
                } catch (err) {
        // Silent error handle for production stability
      }
            }
        }, 800);

        return () => clearTimeout(timer);
    }, [rep2.email, verificationStatus.rep2Email, auth]);

    // Firebase Email Verification (Using dummy account creation to send verification email)
    // Unified logic to check if a user is verified or needs a link sent
    const checkVerifiedStatus = async (num, email, isManualTrigger = true) => {
        if (!email.includes('@') || !email.includes('.')) return;

        const VERIFY_PASS = `Sahotsava26_V1_${email.split('@')[0]}`;
        const repKey = `rep${num}Email`;

        if (isManualTrigger) setIsVerifying(true);
        else return; // Stop background auto-signin to prevent 400 errors

        try {
            let activeUser = auth.currentUser;
            
            // If already signed in to this email, skip re-sign-in
            if (activeUser && activeUser.email?.toLowerCase() !== email.toLowerCase()) {
                await signOut(auth);
                activeUser = null;
            }

            try {
                if (!activeUser) {
                    try {
                        const signRes = await signInWithEmailAndPassword(auth, email, VERIFY_PASS);
                        activeUser = signRes.user;
                    } catch (signErr) {
                        if (signErr.code === 'auth/user-not-found' || signErr.code === 'auth/invalid-credential') {
                            const userCred = await createUserWithEmailAndPassword(auth, email, VERIFY_PASS);
                            activeUser = userCred.user;
                        } else throw signErr;
                    }
                }
                
                await activeUser.reload();
                if (activeUser.emailVerified) {
                    // Update Cache and State
                    const verifiedCache = JSON.parse(localStorage.getItem('sahotsava_verified_emails') || '{}');
                    verifiedCache[email] = true;
                    localStorage.setItem('sahotsava_verified_emails', JSON.stringify(verifiedCache));
                    
                    setVerificationStatus(prev => ({ ...prev, [repKey]: true }));
                    if (isManualTrigger) alert("Email is already verified! You can proceed.");
                    return true;
                } else {
                    await sendEmailVerification(activeUser);
                    if (isManualTrigger) alert(`A verification link has been sent to ${email}. Please check your inbox.`);
                }
            } catch (err) {
                if (isManualTrigger) alert("This email is already in use. If you have verified it, please try using a different browser or clear cache. Otherwise, please check your inbox for the link.");
                return false;
            }

            if (activeUser) {
                setVerificationStep({ type: 'email', rep: num, user: activeUser });
                
                const checkInterval = setInterval(async () => {
                    await activeUser.reload();
                    if (activeUser.emailVerified) {
                        clearInterval(checkInterval);
                        
                        // Update Cache and State
                        const verifiedCache = JSON.parse(localStorage.getItem('sahotsava_verified_emails') || '{}');
                        verifiedCache[email] = true;
                        localStorage.setItem('sahotsava_verified_emails', JSON.stringify(verifiedCache));
                        
                        setVerificationStatus(prev => ({ ...prev, [repKey]: true }));
                        setVerificationStep(null);
                        if (isManualTrigger) alert("Email verified successfully! You may now complete the registration.");
                    }
                }, 3000);

                setTimeout(() => {
                    clearInterval(checkInterval);
                    setVerificationStep(current => {
                        if (current?.type === 'email' && current.rep === num) return null;
                        return current;
                    });
                }, 300000);
            }
        } catch (err) {
            if (isManualTrigger) alert(err.message || "Failed to process verification.");
        } finally {
            if (isManualTrigger) setIsVerifying(false);
        }
    };

    const handleVerifyEmail = (num, email) => checkVerifiedStatus(num, email, true);

    const handlePhoneChange = (repNum, name, value) => {
        const digits = value.replace(/\D/g, '').substring(0, 10);
        if (repNum === 1) setRep1({ ...rep1, [name]: digits });
        else setRep2({ ...rep2, [name]: digits });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check Verifications
        if (!verificationStatus.rep1Email) {
            alert("Representative 1 must verify their email before submission.");
            return;
        }
        if (hasSecondRep && !verificationStatus.rep2Email) {
            alert("Representative 2 must verify their email before submission.");
            return;
        }

        setIsSubmitting(true);
        try {
            const rawUrl = import.meta.env.VITE_SERVER_URL;
            if (!rawUrl) return;
            let serverOrigin = "";
            try {
                serverOrigin = new URL(rawUrl).origin;
            } catch (e) {
                serverOrigin = rawUrl.split("/technoSahotsava2026")[0];
            }

            // Get Firebase ID Token for server-side verification
            const currentUser = auth.currentUser;
            if (!currentUser) {
                alert("Session expired. Please re-verify your credentials.");
                setIsSubmitting(false);
                return;
            }
            const firebaseToken = await currentUser.getIdToken();

            const formatRep = (rep) => ({
                ...rep,
                phone: `+91${rep.phone}`,
                whatsapp: `+91${rep.whatsapp}`
            });

            const verifiedCache = JSON.parse(localStorage.getItem('sahotsava_verified_emails') || '{}');
            const reps = [];
            
            // Only include reps whose email was NOT in the cache (i.e. they are newly verified)
            // or if they are the primary rep being submitted.
            // But based on user request: "that particular rep details will be ignore"
            if (!verifiedCache[rep1.email?.toLowerCase()]) {
                reps.push(formatRep(rep1));
            }
            
            if (hasSecondRep && !verifiedCache[rep2.email?.toLowerCase()]) {
                reps.push(formatRep(rep2));
            }

            // Fallback: If both are cached, we MUST send at least the current session's rep 
            // otherwise the backend won't know which college to link to.
            if (reps.length === 0) {
                if (auth.currentUser?.email?.toLowerCase() === rep1.email?.toLowerCase()) {
                    reps.push(formatRep(rep1));
                } else if (hasSecondRep && auth.currentUser?.email?.toLowerCase() === rep2.email?.toLowerCase()) {
                    reps.push(formatRep(rep2));
                }
            }

            const response = await API.post(`${serverOrigin}/technoSahotsava2026/public/register-rep`, {
                college,
                reps,
                firebaseToken // Send token for backend verification
            });

            if (response.data.success) {
                alert(`Registration Successful!\n\nThe COLLEGE-LEVEL password for ${college} is: ${response.data.password}\n\nBoth representatives should use this same password to access the portal.`);
                navigate('/');
            } else {
                alert(response.data.message || "Registration failed. Please try again.");
            }
        } catch (err) {
            alert(err.response?.data?.message || "Internal server error. Registration could not be processed.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white font-outfit selection:bg-[#FFB464] selection:text-black">
            {/* Verification Overlay */}
            {verificationStep && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md px-6">
                    <div className="w-full max-w-md bg-[#0a0a0b] border border-[#FFB464]/20 p-8 rounded-2xl space-y-8 animate-fadeIn">
                        <div className="text-center space-y-2">
                            <h3 className="font-medieval text-2xl text-[#FFB464] uppercase tracking-widest">
                                Email Verification
                            </h3>
                            <p className="text-white/40 text-[10px] uppercase tracking-[0.2em]">
                                Awaiting link verification in your inbox...
                            </p>
                        </div>

                        <div className="flex flex-col items-center gap-6 py-4">
                            <div className="w-12 h-12 border-2 border-[#FFB464]/20 border-t-[#FFB464] rounded-full animate-spin" />
                            <p className="text-white/60 text-xs text-center leading-relaxed">
                                We've sent a link to your email. This window will automatically close once you click it.
                            </p>
                        </div>

                        <button 
                            onClick={() => setVerificationStep(null)}
                            className="w-full text-[10px] text-white/20 uppercase tracking-[0.3em] hover:text-white transition-colors"
                        >
                            Cancel Verification
                        </button>
                    </div>
                </div>
            )}

            {/* Background Decor */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#FFB464]/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#FFB464]/5 blur-[120px] rounded-full" />
            </div>

            <main className="relative z-10 max-w-5xl mx-auto px-6 py-20">
                {/* Header */}
                <div className="mb-16 border-b border-white/10 pb-12">
                    <div className="space-y-6">
                        <button 
                            onClick={() => navigate('/', { state: { skipLoading: true } })}
                            className="text-[#FFB464] text-xs uppercase tracking-[0.4em] mb-4 flex items-center gap-2 hover:opacity-70 transition-opacity"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to home
                        </button>
                        <div>
                            <h1 className="font-medieval text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-none tracking-tighter uppercase whitespace-nowrap">REPRESENTATIVE REGISTRATION</h1>
                            <p className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-bold mt-4">
                                Join the Vanguard. Each college can register up to 2 representatives.
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-16">
                    {/* College Selection */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-4">
                            <span className="font-medieval text-[#FFB464] text-xl opacity-50">01</span>
                            <h2 className="font-medieval text-2xl uppercase tracking-widest text-[#FFB464]">Institutional Origin</h2>
                        </div>
                        <div className="max-w-xl">
                            <label className="block text-[10px] uppercase tracking-[0.2em] text-[#FFB464]/60 font-bold mb-3">Select Your Institution *</label>
                            <select 
                                required
                                className={`w-full bg-white/5 border p-4 text-white focus:border-[#FFB464] outline-none transition-colors font-outfit text-lg ${!isCollegesOpen ? 'border-red-500/50 cursor-not-allowed opacity-50' : 'border-white/10'}`}
                                value={college}
                                onChange={(e) => setCollege(e.target.value)}
                                disabled={isLoadingColleges || !isCollegesOpen}
                            >
                                <option value="" className="bg-[#0a0a0a]">
                                    {isLoadingColleges ? "Fetching colleges..." : !isCollegesOpen ? "Directory Private" : "-- Select College --"}
                                </option>
                                {isCollegesOpen && colleges.map((c, i) => {
                                    const collegeName = typeof c === 'string' ? c : c.name || c.college_name;
                                    return (
                                        <option key={i} value={collegeName} className="bg-[#0a0a0b]">
                                            {collegeName}
                                        </option>
                                    );
                                })}
                            </select>
                            {!isCollegesOpen && (
                                <p className="text-[10px] text-red-500/70 font-mono tracking-widest uppercase mt-3">
                                    Institution list is currently private. Please try again later.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* First Representative */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-4">
                            <span className="font-medieval text-[#FFB464] text-xl opacity-50">02</span>
                            <h2 className="font-medieval text-2xl uppercase tracking-widest text-[#FFB464]">The First Representative</h2>
                        </div>
                        
                        {!verificationStatus.rep1Email && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fadeIn">
                                <div className="space-y-2">
                                    <label className="block text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">First Name *</label>
                                    <input 
                                        required={!verificationStatus.rep1Email}
                                        type="text" 
                                        className="w-full bg-white/5 border border-white/10 p-4 text-white focus:border-[#FFB464] outline-none transition-all font-outfit"
                                        value={rep1.firstName}
                                        onChange={(e) => setRep1({...rep1, firstName: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">Middle Name</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-white/5 border border-white/10 p-4 text-white focus:border-[#FFB464] outline-none transition-all font-outfit"
                                        value={rep1.middleName}
                                        onChange={(e) => setRep1({...rep1, middleName: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">Last Name *</label>
                                    <input 
                                        required={!verificationStatus.rep1Email}
                                        type="text" 
                                        className="w-full bg-white/5 border border-white/10 p-4 text-white focus:border-[#FFB464] outline-none transition-all font-outfit"
                                        value={rep1.lastName}
                                        onChange={(e) => setRep1({...rep1, lastName: e.target.value})}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="block text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">Email Address *</label>
                                    {verificationStatus.rep1Email ? (
                                        <span className="text-[9px] text-green-500 font-bold uppercase tracking-widest flex items-center gap-1">
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                            Verified
                                        </span>
                                    ) : (
                                        <button 
                                            type="button"
                                            onClick={() => handleVerifyEmail(1, rep1.email)}
                                            className="text-[9px] text-[#FFB464] hover:text-white transition-colors uppercase tracking-widest font-bold border-b border-[#FFB464]/30"
                                        >
                                            Verify Email
                                        </button>
                                    )}
                                </div>
                                <input 
                                    required
                                    type="email" 
                                    readOnly={verificationStatus.rep1Email}
                                    className={`w-full bg-white/5 border border-white/10 p-4 text-white focus:border-[#FFB464] outline-none transition-all font-outfit ${verificationStatus.rep1Email ? 'opacity-60 cursor-not-allowed' : ''}`}
                                    value={rep1.email}
                                    onChange={(e) => {
                                        setRep1({...rep1, email: e.target.value.toLowerCase()});
                                        if (verificationStatus.rep1Email) {
                                            setVerificationStatus(prev => ({ ...prev, rep1Email: false }));
                                        }
                                    }}
                                />
                            </div>
                            {!verificationStatus.rep1Email && (
                                <div className="grid grid-cols-2 gap-4 animate-fadeIn">
                                    <div className="space-y-2">
                                        <label className="block text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">Phone *</label>
                                        <div className="relative flex items-center">
                                            <span className="absolute left-4 text-white/60 font-outfit select-none pointer-events-none">+91</span>
                                            <input 
                                                required={!verificationStatus.rep1Email}
                                                type="tel" 
                                                className="w-full bg-white/5 border border-white/10 p-4 pl-14 text-white focus:border-[#FFB464] outline-none transition-all font-outfit"
                                                value={rep1.phone}
                                                onChange={(e) => handlePhoneChange(1, 'phone', e.target.value)}
                                                placeholder="XXXXXXXXXX"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">WhatsApp *</label>
                                        <div className="relative flex items-center">
                                            <span className="absolute left-4 text-white/60 font-outfit select-none pointer-events-none">+91</span>
                                            <input 
                                                required={!verificationStatus.rep1Email}
                                                type="tel" 
                                                className="w-full bg-white/5 border border-white/10 p-4 pl-14 text-white focus:border-[#FFB464] outline-none transition-all font-outfit"
                                                value={rep1.whatsapp}
                                                onChange={(e) => handlePhoneChange(1, 'whatsapp', e.target.value)}
                                                placeholder="XXXXXXXXXX"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Second Representative Toggle / Section */}
                    <div className="space-y-12">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div className="flex items-center gap-4">
                                <span className="font-medieval text-[#FFB464] text-xl opacity-50">03</span>
                                <h2 className="font-medieval text-2xl uppercase tracking-widest text-[#FFB464]">The Second Representative</h2>
                            </div>
                            <button 
                                type="button"
                                onClick={() => setHasSecondRep(!hasSecondRep)}
                                className={`px-6 py-3 border-2 font-bungee text-xs tracking-widest transition-all duration-300 ${hasSecondRep ? 'border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white' : 'border-[#FFB464] text-[#FFB464] hover:bg-[#FFB464] hover:text-black'}`}
                            >
                                {hasSecondRep ? "- REMOVE SECOND REP" : "+ ADD SECOND REP"}
                            </button>
                        </div>

                        {hasSecondRep && (
                            <div className="space-y-8 animate-fadeIn">
                                {!verificationStatus.rep2Email && (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fadeIn">
                                        <div className="space-y-2">
                                            <label className="block text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">First Name *</label>
                                            <input 
                                                required={hasSecondRep && !verificationStatus.rep2Email}
                                                type="text" 
                                                className="w-full bg-white/5 border border-white/10 p-4 text-white focus:border-[#FFB464] outline-none transition-all font-outfit"
                                                value={rep2.firstName}
                                                onChange={(e) => setRep2({...rep2, firstName: e.target.value})}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">Middle Name</label>
                                            <input 
                                                type="text" 
                                                className="w-full bg-white/5 border border-white/10 p-4 text-white focus:border-[#FFB464] outline-none transition-all font-outfit"
                                                value={rep2.middleName}
                                                onChange={(e) => setRep2({...rep2, middleName: e.target.value})}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">Last Name *</label>
                                            <input 
                                                required={hasSecondRep && !verificationStatus.rep2Email}
                                                type="text" 
                                                className="w-full bg-white/5 border border-white/10 p-4 text-white focus:border-[#FFB464] outline-none transition-all font-outfit"
                                                value={rep2.lastName}
                                                onChange={(e) => setRep2({...rep2, lastName: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <label className="block text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">Email Address *</label>
                                            {verificationStatus.rep2Email ? (
                                                <span className="text-[9px] text-green-500 font-bold uppercase tracking-widest flex items-center gap-1">
                                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                                    Verified
                                                </span>
                                            ) : (
                                                <button 
                                                    type="button"
                                                    onClick={() => handleVerifyEmail(2, rep2.email)}
                                                    className="text-[9px] text-[#FFB464] hover:text-white transition-colors uppercase tracking-widest font-bold border-b border-[#FFB464]/30"
                                                >
                                                    Verify Email
                                                </button>
                                            )}
                                        </div>
                                        <input 
                                            required={hasSecondRep}
                                            type="email" 
                                            readOnly={verificationStatus.rep2Email}
                                            className={`w-full bg-white/5 border border-white/10 p-4 text-white focus:border-[#FFB464] outline-none transition-all font-outfit ${verificationStatus.rep2Email ? 'opacity-60 cursor-not-allowed' : ''}`}
                                            value={rep2.email}
                                            onChange={(e) => {
                                                setRep2({...rep2, email: e.target.value.toLowerCase()});
                                                if (verificationStatus.rep2Email) {
                                                    setVerificationStatus(prev => ({ ...prev, rep2Email: false }));
                                                }
                                            }}
                                        />
                                    </div>
                                    {!verificationStatus.rep2Email && (
                                        <div className="grid grid-cols-2 gap-4 animate-fadeIn">
                                            <div className="space-y-2">
                                                <label className="block text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">Phone *</label>
                                                <div className="relative flex items-center">
                                                    <span className="absolute left-4 text-white/60 font-outfit select-none pointer-events-none">+91</span>
                                                    <input 
                                                        required={hasSecondRep && !verificationStatus.rep2Email}
                                                        type="tel" 
                                                        className="w-full bg-white/5 border border-white/10 p-4 pl-14 text-white focus:border-[#FFB464] outline-none transition-all font-outfit"
                                                        value={rep2.phone}
                                                        onChange={(e) => handlePhoneChange(2, 'phone', e.target.value)}
                                                        placeholder="XXXXXXXXXX"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">WhatsApp *</label>
                                                <div className="relative flex items-center">
                                                    <span className="absolute left-4 text-white/60 font-outfit select-none pointer-events-none">+91</span>
                                                    <input 
                                                        required={hasSecondRep && !verificationStatus.rep2Email}
                                                        type="tel" 
                                                        className="w-full bg-white/5 border border-white/10 p-4 pl-14 text-white focus:border-[#FFB464] outline-none transition-all font-outfit"
                                                        value={rep2.whatsapp}
                                                        onChange={(e) => handlePhoneChange(2, 'whatsapp', e.target.value)}
                                                        placeholder="XXXXXXXXXX"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Submit Section */}
                    <div className="pt-12 border-t border-white/10">
                        <div className="flex flex-col items-center gap-6">
                            <button 
                                type="submit"
                                disabled={isSubmitting || !isCollegesOpen}
                                className={`w-full max-w-xl py-6 bg-[#FFB464] text-black font-bungee text-2xl hover:bg-white transition-all duration-500 uppercase tracking-widest shadow-[0_0_50px_rgba(255,180,100,0.3)] ${isSubmitting || !isCollegesOpen ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {isSubmitting ? "Processing..." : "Submit Registration"}
                            </button>
                            <p className="text-[9px] text-white/20 uppercase tracking-[0.2em] font-bold">
                                By submitting, you confirm and verify the integrity of the institutional data provided.
                            </p>
                        </div>
                    </div>
                </form>
            </main>

            <footer className="relative z-10 w-full max-w-7xl mx-auto pt-12 pb-12 border-t border-white/5 mt-20">
                <div className="flex flex-col md:flex-row justify-between items-center gap-16 px-6">
                    {/* Left Identity: Institutional (Techno India) */}
                    <div className="flex flex-col items-center md:items-start group cursor-default">
                        <div className="flex items-center gap-6 p-2 bg-white/5 rounded-lg border border-white/10">
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
                        <div className="flex items-center gap-4 md:gap-8 bg-white/5 p-4 rounded-xl border border-white/10">
                            <img src={sahotsavaLogo} className="h-6 md:h-12 w-auto object-contain" alt="Sahotsava logo" />
                            <div className="h-6 w-[1px] bg-white/20" />
                            <img src={sanskaranLogo} className="h-10 md:h-18 w-auto object-contain" alt="Team Sanskaran" />
                            <div className="h-6 w-[1px] bg-white/20" />
                            <img src={chitrakaLogo} className="h-10 md:h-12 w-auto object-contain" alt="Chitraka" />
                        </div>
                    </div>
                </div>
            </footer>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default CollegeRepRegistration;

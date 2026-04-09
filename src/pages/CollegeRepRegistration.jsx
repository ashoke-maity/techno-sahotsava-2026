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
import { toast } from 'react-toastify';


// Logo Assets
import sahotsavaLogo from '../assets/logos/sahotsava logo posterize.png';
import sofTigLogo from '../assets/logos/sof_tig_tiu_white.png';
import sanskaranLogo from '../assets/logos/sanskaran logo png WHITE.png';
import cameraLogo from '../assets/logos/Chitraka white logo.png';

const CollegeRepRegistration = () => {
    const navigate = useNavigate();
    const [colleges, setColleges] = useState([]);
    const [collegeList, setCollegeList] = useState([]);
    const [showMasterList, setShowMasterList] = useState(false);
    const [isCollegesOpen, setIsCollegesOpen] = useState(true);
    const [isLoadingColleges, setIsLoadingColleges] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasSecondRep, setHasSecondRep] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [registrationResult, setRegistrationResult] = useState(null);
    const [collegeReferenceUrl, setCollegeReferenceUrl] = useState('');

    // Verification States
    const [verificationStep, setVerificationStep] = useState(null); // 'email' | null
    const [isVerifying, setIsVerifying] = useState(false);

    const [verificationStatus, setVerificationStatus] = useState({
        rep1Email: false,
        rep2Email: false,
        rep1DetailsFetched: false,
        rep2DetailsFetched: false
    });

    const [detailsLoading, setDetailsLoading] = useState({ rep1: false, rep2: false });
    const [isEditing, setIsEditing] = useState({
        rep1: false,
        rep2: false
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
    const [searchTerm, setSearchTerm] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
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

            const response = await API.get(`${serverOrigin}/technoSahotsava2026/admin/registration-status`);
            const settings = response.data;
            setIsCollegesOpen(settings.colleges_open);
            setCollegeReferenceUrl(settings.college_reference_url || '');
            const cListRaw = settings.college_list || [];
            const cListMapped = cListRaw.map(item => {
                if (typeof item === 'string') return { original: item.toUpperCase(), display: '' };
                return item;
            });
            setCollegeList(cListMapped);

            const colRes = await API.get(`${serverOrigin}/technoSahotsava2026/public/colleges`);
            let fetchedColleges = [];
            if (colRes.data && Array.isArray(colRes.data.colleges)) {
                fetchedColleges = colRes.data.colleges;
            } else if (Array.isArray(colRes.data)) {
                fetchedColleges = colRes.data;
            }
            setColleges(fetchedColleges);
        } catch (err) {
            // Log suppressed
        } finally {
            setIsLoadingColleges(false);
        }
    }, []);

    const filteredColleges = (colleges || []).filter(c => {
        const collegeName = typeof c === 'string' ? c : c.name || c.college_name;
        return collegeName.toLowerCase().includes(searchTerm.toLowerCase());
    });

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
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
            socket.on('collegeListUpdate', (data) => {
                const updatedList = (data.college_list || []).map(item => {
                    if (typeof item === 'string') return { original: item.toUpperCase(), display: '' };
                    return item;
                });
                setCollegeList(updatedList);
            });
            socket.on('collegeReferenceUpdate', (data) => {
                setCollegeReferenceUrl(data.reference_url);
            });
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
                    const idToken = await auth.currentUser.getIdToken();
                    setVerificationStatus(prev => ({ ...prev, [repKey]: true, rep1IdToken: idToken }));
                    verifiedCache[email] = true;
                    localStorage.setItem('sahotsava_verified_emails', JSON.stringify(verifiedCache));
                    fetchExistingDetails(1, email, idToken);
                    return;
                }
            }

            // 2. If in cache but no session, try a silent sign-in to restore token for submission
            if (verifiedCache[email]) {
                try {
                    const res = await signInWithEmailAndPassword(auth, email, VERIFY_PASS);
                    if (res.user.emailVerified) {
                        const idToken = await res.user.getIdToken();
                        setVerificationStatus(prev => ({ ...prev, [repKey]: true, rep1IdToken: idToken }));
                        fetchExistingDetails(1, email, idToken);
                    }
                } catch (e) {
                    // Silent fail
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
                    const idToken = await auth.currentUser.getIdToken();
                    setVerificationStatus(prev => ({ ...prev, [repKey]: true, rep2IdToken: idToken }));
                    verifiedCache[email] = true;
                    localStorage.setItem('sahotsava_verified_emails', JSON.stringify(verifiedCache));
                    fetchExistingDetails(2, email, idToken);
                    return;
                }
            }

            if (rep1.email && email === rep1.email.toLowerCase()) return;

            if (verifiedCache[email]) {
                try {
                    const res = await signInWithEmailAndPassword(auth, email, VERIFY_PASS);
                    if (res.user.emailVerified) {
                        const idToken = await res.user.getIdToken();
                        setVerificationStatus(prev => ({ ...prev, [repKey]: true, rep2IdToken: idToken }));
                        fetchExistingDetails(2, email, idToken);
                    }
                } catch (err) {
                    // Silent fail
                }
            }
        }, 800);

        return () => clearTimeout(timer);
    }, [rep2.email, verificationStatus.rep2Email, auth]);

    const fetchExistingDetails = async (num, email, token) => {
        setDetailsLoading(prev => ({ ...prev, [`rep${num}`]: true }));
        try {
            const firebaseToken = token || (await auth.currentUser?.getIdToken());
            if (!firebaseToken) {
                setDetailsLoading(prev => ({ ...prev, [`rep${num}`]: false }));
                return;
            }

            const rawUrl = import.meta.env.VITE_SERVER_URL;
            let serverOrigin = "";
            try {
                serverOrigin = new URL(rawUrl).origin;
            } catch (e) {
                serverOrigin = rawUrl.split("/technoSahotsava2026")[0];
            }

            const res = await API.get(`${serverOrigin}/technoSahotsava2026/public/rep-details`, {
                params: { email, firebaseToken }
            });

            if (res.data.success) {
                const { college: fetchedCollege, ...repData } = res.data.data;

                // Cross-College Validation (Fraud Attempt Detection)
                if (fetchedCollege && college && fetchedCollege.toLowerCase() !== college.toLowerCase()) {
                    toast.error(`🛑 ACCESS DENIED`, {
                        position: "top-center",
                        autoClose: 2000
                    });

                    // Throw user back to starting state by reloading
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                    return;
                }

                if (num === 1) {
                    setRep1(prev => ({ ...prev, ...repData }));
                    setVerificationStatus(prev => ({ ...prev, rep1DetailsFetched: true }));
                    setIsEditing(prev => ({ ...prev, rep1: false }));
                } else {
                    setRep2(prev => ({ ...prev, ...repData }));
                    setVerificationStatus(prev => ({ ...prev, rep2DetailsFetched: true }));
                    setIsEditing(prev => ({ ...prev, rep2: false }));
                }
                toast.success(`Records found for ${email}. Form restored.`);
            }
        } catch (err) {
            // First time user or record not found
            if (num === 1) setVerificationStatus(prev => ({ ...prev, rep1DetailsFetched: false }));
            else setVerificationStatus(prev => ({ ...prev, rep2DetailsFetched: false }));
        } finally {
            setDetailsLoading(prev => ({ ...prev, [`rep${num}`]: false }));
        }
    };

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

                if (activeUser.emailVerified) {
                    // Update Cache and State
                    const idToken = await activeUser.getIdToken();
                    const verifiedCache = JSON.parse(localStorage.getItem('sahotsava_verified_emails') || '{}');
                    verifiedCache[email] = true;
                    localStorage.setItem('sahotsava_verified_emails', JSON.stringify(verifiedCache));

                    setVerificationStatus(prev => ({
                        ...prev,
                        [repKey]: true,
                        [`rep${num}IdToken`]: idToken
                    }));
                    if (isManualTrigger) toast.success("Email is already verified! You can proceed.");
                    fetchExistingDetails(num, email, idToken);
                    return true;
                } else {
                    await sendEmailVerification(activeUser);
                    if (isManualTrigger) toast.info(`A verification link has been sent to ${email}. Please check your inbox.`);
                }
            } catch (err) {
                if (isManualTrigger) toast.error("Verification error. If you have already verified, please try again in a moment or clear cache.");
                return false;
            }

            if (activeUser) {
                setVerificationStep({ type: 'email', rep: num, user: activeUser });

                const checkInterval = setInterval(async () => {
                    await activeUser.reload();
                    if (activeUser.emailVerified) {
                        clearInterval(checkInterval);

                        const idToken = await activeUser.getIdToken();
                        // Update Cache and State
                        const verifiedCache = JSON.parse(localStorage.getItem('sahotsava_verified_emails') || '{}');
                        verifiedCache[email] = true;
                        localStorage.setItem('sahotsava_verified_emails', JSON.stringify(verifiedCache));

                        setVerificationStatus(prev => ({ ...prev, [repKey]: true, [`rep${num}IdToken`]: idToken }));
                        setVerificationStep(null);
                        fetchExistingDetails(num, email, idToken);
                        if (isManualTrigger) toast.success("Email verified successfully! You may now complete the registration.");
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
            if (isManualTrigger) toast.error(err.message || "Failed to process verification.");
        } finally {
            if (isManualTrigger) setIsVerifying(false);
        }
    };

    const handleVerifyEmail = (num, email) => {
        // Validation: Unique details within the same form
        if (hasSecondRep) {
            const otherNum = num === 1 ? 2 : 1;
            const otherRep = num === 1 ? rep2 : rep1;

            if (email && otherRep.email && email.toLowerCase() === otherRep.email.toLowerCase()) {
                if (num === 2) {
                    toast.error("this is a 1st rep mail use second rep mail");
                } else {
                    toast.error("Representative emails must be unique.");
                }
                return;
            }
        }
        checkVerifiedStatus(num, email, true);
    };

    const handlePhoneChange = (repNum, name, value) => {
        const digits = value.replace(/\D/g, '').substring(0, 10);

        // Immediate Duplicate Check
        if (hasSecondRep && digits.length === 10) {
            const otherRep = repNum === 1 ? rep2 : rep1;
            const otherValue = name === 'phone' ? otherRep.phone : otherRep.whatsapp;

            if (digits === otherValue) {
                toast.error(`This ${name} number belongs to the ${repNum === 1 ? '2nd' : '1st'} Representative. Each representative must have unique contact details.`);
                if (repNum === 1) setRep1({ ...rep1, [name]: '' });
                else setRep2({ ...rep2, [name]: '' });
                return;
            }
        }

        if (repNum === 1) setRep1({ ...rep1, [name]: digits });
        else setRep2({ ...rep2, [name]: digits });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check Verifications
        if (!verificationStatus.rep1Email) {
            toast.warn("Representative 1 must verify their email before submission.");
            return;
        }
        if (hasSecondRep && !verificationStatus.rep2Email) {
            toast.warn("Representative 2 must verify their email before submission.");
            return;
        }

        // Cross-Validation between reps
        if (hasSecondRep) {
            if (rep1.email?.toLowerCase() === rep2.email?.toLowerCase()) {
                toast.error("Both representatives cannot have the same email address.");
                return;
            }
            if (rep1.phone === rep2.phone) {
                toast.error("Both representatives cannot share the same phone number.");
                return;
            }
            if (rep1.whatsapp === rep2.whatsapp) {
                toast.error("Both representatives cannot share the same WhatsApp number.");
                return;
            }
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
            // Use the stored token if available, otherwise get current user's token
            const firebaseToken1 = verificationStatus.rep1IdToken;
            const firebaseToken2 = verificationStatus.rep2IdToken;

            // Prioritize the token of the currently logged-in user if available,
            // otherwise use the token from the first verified rep.
            let primaryFirebaseToken = null;
            if (auth.currentUser?.email?.toLowerCase() === rep1.email?.toLowerCase() && firebaseToken1) {
                primaryFirebaseToken = firebaseToken1;
            } else if (hasSecondRep && auth.currentUser?.email?.toLowerCase() === rep2.email?.toLowerCase() && firebaseToken2) {
                primaryFirebaseToken = firebaseToken2;
            } else if (firebaseToken1) { // Fallback to rep1's token if no current user match
                primaryFirebaseToken = firebaseToken1;
            } else if (firebaseToken2) { // Fallback to rep2's token if rep1's not available
                primaryFirebaseToken = firebaseToken2;
            } else {
                // If no stored token, try to get current user's token (should be available if emails are verified)
                primaryFirebaseToken = await auth.currentUser?.getIdToken();
            }

            if (!primaryFirebaseToken) {
                toast.error("Authentication token missing. Please re-verify your credentials.");
                setIsSubmitting(false);
                return;
            }

            const formatRep = (rep) => ({
                ...rep,
                phone: `+91${rep.phone}`,
                whatsapp: `+91${rep.whatsapp}`
            });

            const reps = [];

            // Only include reps that are NOT already in the database (fetched details)
            if (!verificationStatus.rep1DetailsFetched) {
                reps.push(formatRep(rep1));
            }

            if (hasSecondRep && !verificationStatus.rep2DetailsFetched) {
                reps.push(formatRep(rep2));
            }

            // Fallback: If both were already registered (for password retrieval), send at least one 
            // to satisfy backend requirements and establish context.
            if (reps.length === 0) {
                reps.push(formatRep(rep1));
            }

            const response = await API.post(`${serverOrigin}/technoSahotsava2026/public/register-rep`, {
                college,
                reps,
                firebaseToken: primaryFirebaseToken // Send token for backend verification
            });

            if (response.data.success) {
                setRegistrationResult({
                    college: college,
                    institution_id: response.data.institution_id || college,
                    password: response.data.password,
                    repsCount: reps.length
                });
                setShowSuccessModal(true);
            } else {
                toast.error(response.data.message || "Registration failed. Please try again.");
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Internal server error. Registration could not be processed.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white font-outfit selection:bg-[#FFB464] selection:text-black">
            {/* Success Modal */}
            {showSuccessModal && registrationResult && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-black/95 backdrop-blur-xl animate-fadeIn" />

                    <div className="relative w-full max-w-xl bg-[#0a0a0b] border border-[#FFB464]/30 rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(255,180,100,0.15)] animate-slideUp">
                        {/* Decorative Header */}
                        <div className="relative h-24 flex items-center justify-center bg-[#FFB464]/5 border-b border-[#FFB464]/20">
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
                            <h3 className="relative font-medieval text-3xl text-[#FFB464] uppercase tracking-[0.3em] font-bold">Registration Complete</h3>
                        </div>

                        <div className="p-10 space-y-8">
                            <div className="text-center space-y-2">
                                <p className="text-white/40 text-[10px] uppercase tracking-[0.4em] font-bold">Institutional Security Protocol</p>
                                <p className="text-white/60 text-xs leading-relaxed max-w-sm mx-auto font-light">
                                    Your institution has been successfully verified. Please secure the following credentials for portal access.
                                </p>
                            </div>

                            {/* Credentials Card */}
                            <div className="bg-white/5 border border-white/5 rounded-2xl p-8 space-y-6 relative group overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#FFB464" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[9px] text-[#FFB464] uppercase tracking-[0.2em] font-bold opacity-60">Institution ID</label>
                                    <p className="text-lg font-outfit uppercase tracking-tight text-white">{registrationResult.institution_id}</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="h-[1px] w-full bg-white/10" />
                                    <div className="space-y-2">
                                        <label className="text-[9px] text-[#FFB464] uppercase tracking-[0.2em] font-bold opacity-60">Security Key (Password)</label>
                                        <div className="flex items-center gap-4">
                                            <div className="flex-1 bg-black/40 border border-[#FFB464]/20 rounded-xl p-4 font-mono text-xl md:text-2xl text-[#FFB464] tracking-[0.2em] font-bold text-center shadow-inner">
                                                {registrationResult.password}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4">
                                <button
                                    onClick={() => window.location.href = import.meta.env.VITE_REGISTER_URL || "/"}
                                    className="w-full py-4 bg-[#FFB464] text-black hover:bg-white transition-all font-bungee text-sm uppercase tracking-widest shadow-[0_0_30px_rgba(255,180,100,0.2)]"
                                >
                                    ENTER LOGIN PORTAL
                                </button>
                                <button
                                    onClick={() => navigate('/')}
                                    className="w-full py-4 border-2 border-white/10 text-white/40 hover:text-white hover:border-white/40 transition-all font-bungee text-sm uppercase tracking-widest"
                                >
                                    BACK TO HOME
                                </button>
                                <p className="text-center text-[9px] text-white/20 uppercase tracking-[0.2em] font-bold">
                                    Note: Both representatives share this single security key.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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
                        <div className="flex items-center gap-4 flex-wrap">
                            <span className="font-medieval text-[#FFB464] text-xl opacity-50">01</span>
                            <h2 className="font-medieval text-2xl uppercase tracking-widest text-[#FFB464]">Institutional Origin</h2>
                            {collegeReferenceUrl && (
                                <div className="relative ml-auto">
                                    <a
                                        href={collegeReferenceUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-3 py-1.5 border border-[#FFB464]/20 hover:border-[#FFB464]/50 bg-[#FFB464]/5 hover:bg-[#FFB464]/10 transition-all text-[9px] uppercase tracking-[0.3em] text-[#FFB464]/70 hover:text-[#FFB464] no-underline"
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                        Reference PDF
                                    </a>
                                </div>
                            )}
                        </div>
                        <div className="max-w-xl relative" ref={dropdownRef}>
                            <label className="block text-[10px] uppercase tracking-[0.2em] text-[#FFB464]/60 font-bold mb-3">Select Your Institution *</label>

                            <div
                                onClick={() => isCollegesOpen && setIsDropdownOpen(!isDropdownOpen)}
                                className={`w-full bg-white/5 border p-4 text-white transition-all font-outfit text-lg flex justify-between items-center cursor-pointer ${isDropdownOpen ? 'border-[#FFB464] ring-1 ring-[#FFB464]/30' : 'border-white/10'} ${!isCollegesOpen ? 'border-red-500/50 cursor-not-allowed opacity-50' : 'hover:border-[#FFB464]/50 hover:bg-white/10'}`}
                            >
                                <span className={college ? 'text-white' : 'text-white/40'}>
                                    {isLoadingColleges ? "Fetching colleges..." : !isCollegesOpen ? "Directory Private" : (college || "-- Select College --")}
                                </span>
                                <svg className={`w-4 h-4 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>

                            {/* Hidden Input for Form Validation */}
                            <input type="hidden" required value={college} />

                            {/* Dropdown Menu */}
                            {isDropdownOpen && isCollegesOpen && (
                                <div className="absolute top-full mt-2 w-full bg-[#0a0a0b] border border-[#FFB464]/30 rounded-2xl shadow-2xl z-50 overflow-hidden animate-slideDown">
                                    <div className="p-4 border-b border-white/10">
                                        <div className="relative">
                                            <input
                                                autoFocus
                                                type="text"
                                                placeholder="SEARCH COLLEGE NAME..."
                                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 pl-10 text-white text-sm focus:border-[#FFB464] outline-none transition-all uppercase placeholder:text-zinc-600"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
                                            />
                                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        </div>
                                    </div>

                                    <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                                        {filteredColleges.length > 0 ? (
                                            filteredColleges.map((c, i) => {
                                                const collegeName = typeof c === 'string' ? c : c.name || c.college_name;

                                                return (
                                                    <div
                                                        key={i}
                                                        onClick={() => {
                                                            if (collegeName !== college) {
                                                                 setCollege(collegeName);
                                                                 setIsDropdownOpen(false);
                                                                 setSearchTerm('');

                                                                 // Full Reset to prevent curiosity bypasses
                                                                 setRep1({ ...initialRepState });
                                                                 setRep2({ ...initialRepState });
                                                                 setVerificationStatus({
                                                                     rep1Email: false,
                                                                     rep2Email: false,
                                                                     rep1DetailsFetched: false,
                                                                     rep2DetailsFetched: false
                                                                 });
                                                                 setIsEditing({ rep1: false, rep2: false });
                                                                 toast.success(`You have selected "${collegeName}".`);
                                                            } else {
                                                                setIsDropdownOpen(false);
                                                            }
                                                        }}
                                                        className={`p-4 text-sm font-outfit cursor-pointer transition-colors flex justify-between items-center group ${college === collegeName ? 'bg-[#FFB464]/20 text-[#FFB464]' : 'text-white/70 hover:bg-[#FFB464]/10 hover:text-[#FFB464]'}`}
                                                    >
                                                        <span>{collegeName}</span>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="p-8 text-center space-y-2">
                                                <p className="text-white/40 text-xs uppercase tracking-widest">No matching records found</p>
                                                <p className="text-[10px] text-white/20">The institution might already be registered.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                            {!isCollegesOpen && (
                                <p className="text-[10px] text-red-500/70 font-mono tracking-widest uppercase mt-3">
                                    Institution list is currently private. Please try again later.
                                </p>
                            )}


                        </div>
                    </div>

                    {/* First Representative */}
                    <div className="space-y-8">
                        <div className="flex justify-between items-center bg-[#FFB464]/5 border-x border-t border-[#FFB464]/20 p-6 rounded-t-3xl border-b-[0.5px] border-b-[#FFB464]/10">
                            <div className="flex items-center gap-4">
                                <span className="font-medieval text-[#FFB464] text-xl opacity-50">02</span>
                                <h2 className="font-medieval text-2xl uppercase tracking-widest text-[#FFB464]">The First Representative</h2>
                            </div>
                            {verificationStatus.rep1DetailsFetched && (
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(prev => ({ ...prev, rep1: !prev.rep1 }))}
                                    className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${isEditing.rep1
                                            ? 'bg-[#FFB464] text-black shadow-[0_0_15px_rgba(255,180,100,0.3)]'
                                            : 'bg-white/5 text-white/40 hover:text-white hover:bg-white/10'
                                        }`}
                                >
                                    {isEditing.rep1 ? 'Lock & Save' : 'Edit Details'}
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fadeIn">
                            <div className="space-y-2">
                                <label className="block text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">First Name *</label>
                                <input
                                    required
                                    type="text"
                                    disabled={!college || !isCollegesOpen}
                                    readOnly={verificationStatus.rep1DetailsFetched && !isEditing.rep1}
                                    className={`w-full bg-white/5 border border-white/10 p-4 text-white focus:border-[#FFB464] outline-none transition-all font-outfit uppercase ${(!college || !isCollegesOpen || (verificationStatus.rep1DetailsFetched && !isEditing.rep1)) ? 'opacity-30 cursor-not-allowed' : ''}`}
                                    value={rep1.firstName}
                                    onChange={(e) => setRep1({ ...rep1, firstName: e.target.value.toUpperCase() })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">Middle Name</label>
                                <input
                                    type="text"
                                    disabled={!college || !isCollegesOpen}
                                    readOnly={verificationStatus.rep1DetailsFetched && !isEditing.rep1}
                                    className={`w-full bg-white/5 border border-white/10 p-4 text-white focus:border-[#FFB464] outline-none transition-all font-outfit uppercase ${(!college || !isCollegesOpen || (verificationStatus.rep1DetailsFetched && !isEditing.rep1)) ? 'opacity-30 cursor-not-allowed' : ''}`}
                                    value={rep1.middleName}
                                    onChange={(e) => setRep1({ ...rep1, middleName: e.target.value.toUpperCase() })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">Last Name *</label>
                                <input
                                    required
                                    type="text"
                                    disabled={!college || !isCollegesOpen}
                                    readOnly={verificationStatus.rep1DetailsFetched && !isEditing.rep1}
                                    className={`w-full bg-white/5 border border-white/10 p-4 text-white focus:border-[#FFB464] outline-none transition-all font-outfit uppercase ${(!college || !isCollegesOpen || (verificationStatus.rep1DetailsFetched && !isEditing.rep1)) ? 'opacity-30 cursor-not-allowed' : ''}`}
                                    value={rep1.lastName}
                                    onChange={(e) => setRep1({ ...rep1, lastName: e.target.value.toUpperCase() })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="grid grid-cols-2 gap-4 animate-fadeIn">
                                <div className="space-y-2">
                                    <label className="block text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">Phone *</label>
                                    <div className="relative flex items-center">
                                        <span className="absolute left-4 text-white/60 font-outfit select-none pointer-events-none">+91</span>
                                        <input
                                            required
                                            type="tel"
                                            disabled={!college || !rep1.firstName || !rep1.lastName}
                                            readOnly={verificationStatus.rep1DetailsFetched && !isEditing.rep1}
                                            className={`w-full bg-white/5 border border-white/10 p-4 pl-14 text-white focus:border-[#FFB464] outline-none transition-all font-outfit ${(!college || !rep1.firstName || !rep1.lastName || (verificationStatus.rep1DetailsFetched && !isEditing.rep1)) ? 'opacity-30 cursor-not-allowed' : ''}`}
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
                                            required
                                            type="tel"
                                            disabled={!college || !rep1.firstName || !rep1.lastName}
                                            readOnly={verificationStatus.rep1DetailsFetched && !isEditing.rep1}
                                            className={`w-full bg-white/5 border border-white/10 p-4 pl-14 text-white focus:border-[#FFB464] outline-none transition-all font-outfit ${(!college || !rep1.firstName || !rep1.lastName || (verificationStatus.rep1DetailsFetched && !isEditing.rep1)) ? 'opacity-30 cursor-not-allowed' : ''}`}
                                            value={rep1.whatsapp}
                                            onChange={(e) => handlePhoneChange(1, 'whatsapp', e.target.value)}
                                            placeholder="XXXXXXXXXX"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="block text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">Email Address *</label>
                                    {verificationStatus.rep1Email ? (
                                        <span className="text-[9px] text-green-500 font-bold uppercase tracking-widest flex items-center gap-1">
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                            Verified
                                        </span>
                                    ) : (college && rep1.phone?.length === 10 && rep1.whatsapp?.length === 10) && (
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
                                    disabled={!college || rep1.phone?.length !== 10 || rep1.whatsapp?.length !== 10}
                                    readOnly={verificationStatus.rep1Email}
                                    className={`w-full bg-white/5 border border-white/10 p-4 text-white focus:border-[#FFB464] outline-none transition-all font-outfit ${(!college || rep1.phone?.length !== 10 || rep1.whatsapp?.length !== 10 || verificationStatus.rep1Email) ? 'opacity-30 cursor-not-allowed' : ''}`}
                                    value={rep1.email}
                                    onChange={(e) => {
                                        const newEmail = e.target.value.toLowerCase();
                                        setRep1({ ...rep1, email: newEmail });
                                        if (verificationStatus.rep1Email) {
                                            setVerificationStatus(prev => ({ ...prev, rep1Email: false, rep1DetailsFetched: false }));
                                            // Optional: Clear fields when switching email to avoid confusion
                                            setRep1(prev => ({
                                                ...prev,
                                                email: newEmail,
                                                firstName: '', middleName: '', lastName: '', phone: '', whatsapp: ''
                                            }));
                                        }
                                    }}
                                />
                                <p className="text-[10px] text-white/40 mt-2 leading-relaxed">
                                    Note: Verification email might be delivered to your <strong className="text-[#FFB464] uppercase tracking-wider">Spam Section</strong>. Please check there if not found in your inbox.
                                </p>
                            </div>
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
                                disabled={!isCollegesOpen || !verificationStatus.rep1Email}
                                className={`px-6 py-3 border-2 font-bungee text-xs tracking-widest transition-all duration-300 ${(!isCollegesOpen || (!verificationStatus.rep1Email && !hasSecondRep)) ? 'opacity-30 cursor-not-allowed grayscale' : hasSecondRep ? 'border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white' : 'border-[#FFB464] text-[#FFB464] hover:bg-[#FFB464] hover:text-black'}`}
                            >
                                {hasSecondRep ? "- REMOVE SECOND REP" : "+ ADD SECOND REP"}
                            </button>
                        </div>

                        {hasSecondRep && (
                            <div className="space-y-8 animate-fadeIn">
                                <div className="flex justify-between items-center bg-[#FFB464]/5 border-x border-t border-[#FFB464]/20 p-6 rounded-t-3xl border-b-[0.5px] border-b-[#FFB464]/10">
                                    <h2 className="font-medieval text-2xl uppercase tracking-widest text-[#FFB464]">The Second Representative</h2>
                                    {verificationStatus.rep2DetailsFetched && (
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(prev => ({ ...prev, rep2: !prev.rep2 }))}
                                            className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${isEditing.rep2
                                                    ? 'bg-[#FFB464] text-black shadow-[0_0_15px_rgba(255,180,100,0.3)]'
                                                    : 'bg-white/5 text-white/40 hover:text-white hover:bg-white/10'
                                                }`}
                                        >
                                            {isEditing.rep2 ? 'Lock & Save' : 'Edit Details'}
                                        </button>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fadeIn">
                                    <div className="space-y-2">
                                        <label className="block text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">First Name *</label>
                                        <input
                                            required={hasSecondRep}
                                            type="text"
                                            disabled={!college || !isCollegesOpen}
                                            readOnly={verificationStatus.rep2DetailsFetched && !isEditing.rep2}
                                            className={`w-full bg-white/5 border border-white/10 p-4 text-white focus:border-[#FFB464] outline-none transition-all font-outfit uppercase ${(!college || !isCollegesOpen || (verificationStatus.rep2DetailsFetched && !isEditing.rep2)) ? 'opacity-30 cursor-not-allowed' : ''}`}
                                            value={rep2.firstName}
                                            onChange={(e) => setRep2({ ...rep2, firstName: e.target.value.toUpperCase() })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">Middle Name</label>
                                        <input
                                            type="text"
                                            disabled={!college || !isCollegesOpen}
                                            readOnly={verificationStatus.rep2DetailsFetched && !isEditing.rep2}
                                            className={`w-full bg-white/5 border border-white/10 p-4 text-white focus:border-[#FFB464] outline-none transition-all font-outfit uppercase ${(!college || !isCollegesOpen || (verificationStatus.rep2DetailsFetched && !isEditing.rep2)) ? 'opacity-30 cursor-not-allowed' : ''}`}
                                            value={rep2.middleName}
                                            onChange={(e) => setRep2({ ...rep2, middleName: e.target.value.toUpperCase() })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">Last Name *</label>
                                        <input
                                            required={hasSecondRep}
                                            type="text"
                                            disabled={!college || !isCollegesOpen}
                                            readOnly={verificationStatus.rep2DetailsFetched && !isEditing.rep2}
                                            className={`w-full bg-white/5 border border-white/10 p-4 text-white focus:border-[#FFB464] outline-none transition-all font-outfit uppercase ${(!college || !isCollegesOpen || (verificationStatus.rep2DetailsFetched && !isEditing.rep2)) ? 'opacity-30 cursor-not-allowed' : ''}`}
                                            value={rep2.lastName}
                                            onChange={(e) => setRep2({ ...rep2, lastName: e.target.value.toUpperCase() })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="grid grid-cols-2 gap-4 animate-fadeIn">
                                        <div className="space-y-2">
                                            <label className="block text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">Phone *</label>
                                            <div className="relative flex items-center">
                                                <span className="absolute left-4 text-white/60 font-outfit select-none pointer-events-none">+91</span>
                                                <input
                                                    required={hasSecondRep}
                                                    type="tel"
                                                    disabled={!college || !rep2.firstName || !rep2.lastName}
                                                    readOnly={verificationStatus.rep2DetailsFetched && !isEditing.rep2}
                                                    className={`w-full bg-white/5 border border-white/10 p-4 pl-14 text-white focus:border-[#FFB464] outline-none transition-all font-outfit ${(!college || !rep2.firstName || !rep2.lastName || (verificationStatus.rep2DetailsFetched && !isEditing.rep2)) ? 'opacity-30 cursor-not-allowed' : ''}`}
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
                                                    required={hasSecondRep}
                                                    type="tel"
                                                    disabled={!college || !rep2.firstName || !rep2.lastName}
                                                    readOnly={verificationStatus.rep2DetailsFetched && !isEditing.rep2}
                                                    className={`w-full bg-white/5 border border-white/10 p-4 pl-14 text-white focus:border-[#FFB464] outline-none transition-all font-outfit ${(!college || !rep2.firstName || !rep2.lastName || (verificationStatus.rep2DetailsFetched && !isEditing.rep2)) ? 'opacity-30 cursor-not-allowed' : ''}`}
                                                    value={rep2.whatsapp}
                                                    onChange={(e) => handlePhoneChange(2, 'whatsapp', e.target.value)}
                                                    placeholder="XXXXXXXXXX"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <label className="block text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">Email Address *</label>
                                            {verificationStatus.rep2Email ? (
                                                <span className="text-[9px] text-green-500 font-bold uppercase tracking-widest flex items-center gap-1">
                                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                                    Verified
                                                </span>
                                            ) : (college && rep2.phone?.length === 10 && rep2.whatsapp?.length === 10) && (
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
                                            disabled={!college || rep2.phone?.length !== 10 || rep2.whatsapp?.length !== 10}
                                            readOnly={verificationStatus.rep2Email}
                                            className={`w-full bg-white/5 border border-white/10 p-4 text-white focus:border-[#FFB464] outline-none transition-all font-outfit ${(!college || rep2.phone?.length !== 10 || rep2.whatsapp?.length !== 10 || verificationStatus.rep2Email) ? 'opacity-30 cursor-not-allowed' : ''}`}
                                            value={rep2.email}
                                            onChange={(e) => {
                                                const newEmail = e.target.value.toLowerCase();

                                                // Prevent duplicate of 1st rep
                                                if (newEmail && rep1.email && newEmail === rep1.email.toLowerCase()) {
                                                    toast.error("This is 1st Representative's email. Please use a different email for 2nd Representative.");
                                                    setRep2({ ...rep2, email: '' });
                                                    return;
                                                }

                                                setRep2({ ...rep2, email: newEmail });
                                                if (verificationStatus.rep2Email) {
                                                    setVerificationStatus(prev => ({ ...prev, rep2Email: false, rep2DetailsFetched: false }));
                                                    setRep2(prev => ({
                                                        ...prev,
                                                        email: newEmail,
                                                        firstName: '', middleName: '', lastName: '', phone: '', whatsapp: ''
                                                    }));
                                                }
                                            }}
                                        />
                                        <p className="text-[10px] text-white/40 mt-2 leading-relaxed">
                                            Note: Verification email might be delivered to your <strong className="text-[#FFB464] uppercase tracking-wider">Spam Section</strong>. Please check there if not found in your inbox.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Submit Section */}
                    <div className="pt-12 border-t border-white/10">
                        <div className="flex flex-col items-center gap-6">
                            {(() => {
                                const isSubmitEnabled = college &&
                                    rep1.firstName && rep1.lastName && rep1.phone?.length === 10 && rep1.whatsapp?.length === 10 && verificationStatus.rep1Email &&
                                    (!hasSecondRep || (rep2.firstName && rep2.lastName && rep2.phone?.length === 10 && rep2.whatsapp?.length === 10 && verificationStatus.rep2Email));

                                return (
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || !isCollegesOpen || !isSubmitEnabled}
                                        className={`w-full max-w-xl py-6 bg-[#FFB464] text-black font-bungee text-2xl hover:bg-white transition-all duration-500 uppercase tracking-widest shadow-[0_0_50px_rgba(255,180,100,0.3)] ${isSubmitting || !isCollegesOpen || !isSubmitEnabled ? 'opacity-30 cursor-not-allowed' : ''}`}
                                    >
                                        {isSubmitting ? "Processing..." : "Submit Registration"}
                                    </button>
                                );
                            })()}
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
                            <img src={cameraLogo} className="h-10 md:h-12 w-auto object-contain" alt="Camera" />
                        </div>
                    </div>
                </div>
            </footer>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(40px) scale(0.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.8s ease-out forwards;
                }
                .animate-slideUp {
                    animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>
        </div>
    );
};

export default CollegeRepRegistration;

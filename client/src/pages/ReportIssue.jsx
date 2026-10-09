import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { 
    Send, 
    MapPin, 
    Camera, 
    Type, 
    CheckCircle2, 
    Navigation, 
    Loader2, 
    FileEdit, 
    ArrowLeft,
    ShieldCheck, 
    Trophy,
    Clock,
    AlertCircle,
    Info,
    HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../api';

const ReportIssue = () => {
    const [formData, setFormData] = useState({ 
        title: '', 
        text: '', 
        location: '', 
        imageUrl: '', 
        lat: null, 
        lng: null 
    });
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [locating, setLocating] = useState(false);
    const [result, setResult] = useState(null);
    const { user, refreshUser } = useAuth();
    const navigate = useNavigate();

    const hasAutoLocatedRef = useRef(false);

    const CLOUDINARY_UPLOAD_PRESET = "dbmsproject";
    const CLOUDINARY_CLOUD_NAME = "dyp7pxrli";

    useEffect(() => {
        // Auto-detect GPS location once on initial mount
        if (!hasAutoLocatedRef.current) {
            hasAutoLocatedRef.current = true;
            getLocation();
        }
    }, []);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const uploadToast = toast.loading('Uploading evidence photo...');
        
        const data = new FormData();
        data.append('file', file);
        data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

        try {
            const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
                method: 'POST',
                body: data
            });
            const fileData = await res.json();
            if (fileData.secure_url) {
                setFormData(prev => ({ ...prev, imageUrl: fileData.secure_url }));
                toast.success('Image Verified & Uploaded', { id: uploadToast });
            } else {
                throw new Error('Upload error');
            }
        } catch {
            toast.error('Cloudinary Upload Failed', { id: uploadToast });
        } finally {
            setUploading(false);
        }
    };

    const getLocation = () => {
        if (!navigator.geolocation) {
            return toast.error('Geolocation is not supported by your browser', { id: 'gps-lock-toast' });
        }
        setLocating(true);
        const GPS_TOAST_ID = 'gps-lock-toast';
        toast.loading('Acquiring high-accuracy GPS coordinates...', { id: GPS_TOAST_ID });

        const options = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        };

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`, {
                        headers: { 'User-Agent': 'JanSetu-SmartCity-App' }
                    });
                    const data = await response.json();
                    
                    const fullAddress = data.display_name || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;

                    setFormData(prev => ({ 
                        ...prev, 
                        location: fullAddress, 
                        lat: latitude, 
                        lng: longitude 
                    }));
                    toast.success('GPS Address Locked! 📍', { id: GPS_TOAST_ID });
                } catch {
                    const fallback = `Coordinates: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
                    setFormData(prev => ({ 
                        ...prev, 
                        location: fallback, 
                        lat: latitude, 
                        lng: longitude 
                    }));
                    toast.success('GPS Coordinates Locked! 📍', { id: GPS_TOAST_ID });
                } finally {
                    setLocating(false);
                }
            },
            () => {
                setLocating(false);
                toast.error('Location permission needed. Please allow GPS access.', { id: GPS_TOAST_ID });
            },
            options
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title) return toast.error('Title is required');
        
        setLoading(true);
        const processingToast = toast.loading('Synchronizing with JanSetu AI Matrix...');
        try {
            const payload = { ...formData, text: formData.title };
            
            const { data } = await axios.post(
                `${API_BASE_URL}/api/complaints`, 
                payload,
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
            
            setResult(data.data);
            if (refreshUser) await refreshUser();
            toast.success('Issue Logged. +10 Reward Points!', { id: processingToast });
        } catch {
            toast.error('Submission failed.', { id: processingToast });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen lg:h-screen w-full bg-[#f1f5f9] flex items-center justify-center p-3 sm:p-5 lg:p-6 pb-28 lg:pb-6 overflow-y-auto lg:overflow-hidden font-sans">
            <div className="w-full max-w-6xl min-h-full lg:h-full lg:max-h-[840px] flex flex-col justify-between my-auto">
                
                {/* Top Return Breadcrumb */}
                <div className="flex items-center justify-between pb-2 px-1">
                    <button
                        onClick={() => navigate('/citizen')}
                        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-sky-600 bg-white/90 hover:bg-white px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-2xs transition-all active:scale-95 cursor-pointer"
                    >
                        <ArrowLeft size={14} /> Back to Citizen Portal
                    </button>
                </div>

                <AnimatePresence mode="wait">
                    {!result ? (
                        /* Attached Dual-Pane Layout */
                        <div 
                            key="form"
                            className="w-full flex-1 bg-white rounded-3xl shadow-xl border border-slate-200/80 flex flex-col lg:flex-row items-stretch overflow-hidden"
                        >
                            {/* LEFT CARD: Skyblue & Grey Color Combo with Issue Reporting Guidelines */}
                            <div className="w-full lg:w-[48%] bg-gradient-to-br from-[#0284c7] via-[#334155] to-[#0f172a] p-6 sm:p-8 text-white flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-700/60">
                                
                                <div className="relative z-10 space-y-4">
                                    {/* Headline */}
                                    <div>
                                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-[1.12]">
                                            Report Civic Issues. <br />
                                            <span className="text-sky-300">Fast & Direct Routing.</span>
                                        </h1>
                                        <p className="mt-2 text-xs sm:text-[13px] text-slate-300 leading-relaxed font-medium">
                                            Follow these smart submission steps. Every report is automatically classified, assigned to the concerned ward, and tracked under municipal SLA rules.
                                        </p>
                                    </div>

                                    {/* Guidance & Process Cards */}
                                    <div className="space-y-2.5 pt-1">
                                        {/* Step 1: Photo Evidence */}
                                        <div className="flex items-start gap-3 p-2.5 rounded-2xl bg-slate-800/60 backdrop-blur-md border border-slate-700/60 shadow-2xs">
                                            <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-300 flex items-center justify-center shrink-0 mt-0.5 border border-sky-400/20">
                                                <Camera size={16} />
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                                                    1. Clear Evidence Photo
                                                    <span className="text-[10px] font-normal text-sky-300">(Recommended)</span>
                                                </h4>
                                                <p className="text-[10px] text-slate-300 mt-0.5 leading-snug">
                                                    Capture a clear photo showing the hazard, road pothole, or street light for automated visual validation.
                                                </p>
                                            </div>
                                        </div>

                                        {/* Step 2: GPS Location */}
                                        <div className="flex items-start gap-3 p-2.5 rounded-2xl bg-slate-800/60 backdrop-blur-md border border-slate-700/60 shadow-2xs">
                                            <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-300 flex items-center justify-center shrink-0 mt-0.5 border border-sky-400/20">
                                                <MapPin size={16} />
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                                                    2. Auto-Locked GPS Ward Mapping
                                                </h4>
                                                <p className="text-[10px] text-slate-300 mt-0.5 leading-snug">
                                                    Verified satellite GPS coordinates instantly route the ticket to the exact line officer and ward team.
                                                </p>
                                            </div>
                                        </div>

                                        {/* Step 3: SLA & AI Verification */}
                                        <div className="flex items-start gap-3 p-2.5 rounded-2xl bg-slate-800/60 backdrop-blur-md border border-slate-700/60 shadow-2xs">
                                            <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-300 flex items-center justify-center shrink-0 mt-0.5 border border-sky-400/20">
                                                <Clock size={16} />
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                                                    3. 24-Day Resolution SLA
                                                </h4>
                                                <p className="text-[10px] text-slate-300 mt-0.5 leading-snug">
                                                    All reports have a guaranteed municipal resolution countdown with automatic administrative escalation.
                                                </p>
                                            </div>
                                        </div>

                                        {/* Step 4: Loyalty Points */}
                                        <div className="flex items-start gap-3 p-2.5 rounded-2xl bg-slate-800/60 backdrop-blur-md border border-slate-700/60 shadow-2xs">
                                            <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-300 flex items-center justify-center shrink-0 mt-0.5 border border-sky-400/20">
                                                <Trophy size={16} />
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                                                    4. +10 Civic Reward Points
                                                </h4>
                                                <p className="text-[10px] text-slate-300 mt-0.5 leading-snug">
                                                    Receive verified community loyalty points redeemable for public badges and civic recognition.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Tag */}
                                <div className="relative z-10 pt-3 border-t border-slate-700/70 flex items-center justify-between text-[11px] text-slate-400 font-bold">
                                    <span className="text-sky-200">"Your Report Today, A Better City Tomorrow"</span>
                                    <span className="flex items-center gap-1 text-emerald-400">
                                        <CheckCircle2 size={13} /> Active SLA
                                    </span>
                                </div>

                                {/* Radiant Sky-Blue Background Glow */}
                                <div className="absolute -top-12 -left-12 w-48 h-48 bg-sky-400/20 rounded-full blur-3xl pointer-events-none"></div>
                                <div className="absolute -bottom-10 -right-10 w-56 h-56 bg-sky-500/15 rounded-full blur-3xl pointer-events-none"></div>
                            </div>

                            {/* RIGHT CARD: Submit a Grievance Report Form (Attached Beside) */}
                            <form 
                                onSubmit={handleSubmit}
                                className="w-full lg:w-[52%] bg-white p-6 sm:p-8 flex flex-col justify-between overflow-y-auto"
                            >
                                <div className="space-y-4">
                                    {/* Form Header */}
                                    <div className="flex items-start gap-3 pb-3 border-b border-slate-100">
                                        <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                                            <FileEdit size={20} />
                                        </div>
                                        <div>
                                            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                                                Submit a Grievance Report
                                            </h2>
                                            <p className="text-xs text-slate-400 font-medium mt-0.5">
                                                Fill out the details below with clarity. Attach an image and location for faster action.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Field 1: Grievance Title */}
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 block">
                                            GRIEVANCE TITLE
                                        </label>
                                        <div className="relative">
                                            <Type size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input 
                                                required 
                                                type="text"
                                                className="w-full pl-10 pr-4 py-3 bg-slate-50/80 border border-slate-200/90 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-sky-600 focus:bg-white transition-all placeholder:text-slate-400" 
                                                placeholder="Summarize the problem briefly (e.g. Broken streetlight on 2nd Cross)"
                                                value={formData.title} 
                                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    {/* Field 2: Ward or City Location with GPS */}
                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between">
                                            <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                                                <MapPin size={13} className="text-sky-600" />
                                                WARD OR CITY LOCATION
                                            </label>
                                            <button 
                                                type="button"
                                                onClick={getLocation}
                                                disabled={locating}
                                                className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-700 hover:text-sky-800 bg-sky-50 hover:bg-sky-100 px-2.5 py-1 rounded-lg border border-sky-200 transition-all active:scale-95 cursor-pointer shrink-0"
                                            >
                                                {locating ? <Loader2 size={12} className="animate-spin" /> : <Navigation size={12} />}
                                                {locating ? 'Acquiring GPS...' : 'Auto-detect GPS'}
                                            </button>
                                        </div>

                                        <div className="p-3 bg-slate-50/80 border border-slate-200/90 rounded-xl">
                                            {locating ? (
                                                <div className="flex items-center gap-2 py-1 text-slate-500">
                                                    <Loader2 size={15} className="animate-spin text-sky-600 shrink-0" />
                                                    <span className="text-xs font-bold text-slate-700">Connecting to GPS satellites...</span>
                                                </div>
                                            ) : formData.location ? (
                                                <div>
                                                    <div className="flex items-start gap-2 mb-1">
                                                        <CheckCircle2 size={15} className="text-emerald-500 shrink-0 mt-0.5" />
                                                        <p className="text-xs font-bold text-slate-800 leading-snug truncate">
                                                            {formData.location}
                                                        </p>
                                                    </div>
                                                    {formData.lat && formData.lng && (
                                                        <div className="flex items-center gap-2 pt-1 border-t border-slate-200/60 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                                                            <span className="text-sky-600">LAT: {formData.lat.toFixed(4)}°</span>
                                                            <span className="text-sky-600">LNG: {formData.lng.toFixed(4)}°</span>
                                                            <span className="text-emerald-600 font-bold ml-auto">● GPS Auto-Locked</span>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-between py-1">
                                                    <span className="text-xs text-slate-400">Location will appear here...</span>
                                                    <button 
                                                        type="button" 
                                                        onClick={getLocation} 
                                                        className="text-xs font-bold text-sky-600 underline"
                                                    >
                                                        Fetch GPS
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Field 3: Evidence Photos */}
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 block">
                                            EVIDENCE PHOTOS
                                        </label>
                                        
                                        <div className="group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 hover:border-sky-500 bg-slate-50/50 hover:bg-sky-50/20 p-4 transition-all">
                                            {formData.imageUrl ? (
                                                <div className="relative w-full aspect-video max-h-36 rounded-xl overflow-hidden shadow-xs">
                                                    <img src={formData.imageUrl} alt="Uploaded evidence" className="w-full h-full object-cover" />
                                                    <button 
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, imageUrl: '' })}
                                                        className="absolute top-2 right-2 px-2.5 py-1 bg-red-600 text-white rounded-lg text-xs font-bold shadow-md hover:bg-red-700 active:scale-95 transition-all"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            ) : (
                                                <>
                                                    <Camera size={28} className="text-slate-300 group-hover:text-sky-600 mb-1.5 transition-colors" />
                                                    <p className="text-slate-600 font-bold text-xs mb-0.5">Tap to capture or upload photo</p>
                                                    <p className="text-slate-400 text-[10px]">PNG, JPG or JPEG up to 10MB</p>
                                                    <input 
                                                        type="file" 
                                                        accept="image/*"
                                                        onChange={handleImageUpload}
                                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                                    />
                                                    {uploading && (
                                                        <div className="absolute inset-0 bg-white/90 flex items-center justify-center rounded-2xl backdrop-blur-xs">
                                                            <Loader2 size={24} className="animate-spin text-sky-600" />
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Action Button */}
                                <div className="pt-3">
                                    <button 
                                        type="submit"
                                        disabled={loading || uploading} 
                                        className="w-full py-3.5 bg-gradient-to-r from-sky-600 via-sky-500 to-blue-700 hover:from-sky-700 hover:to-blue-800 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-sky-500/25 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 size={16} className="animate-spin" />
                                                <span>Analyzing Submission...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Send size={15} />
                                                <span>SUBMIT GRIEVANCE REPORT</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        /* Success View */
                        <div 
                            key="result" 
                            className="w-full flex-1 bg-white rounded-3xl shadow-xl border border-slate-200/80 p-8 sm:p-12 text-center flex flex-col items-center justify-center max-w-2xl mx-auto"
                        >
                            <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-emerald-100">
                                <CheckCircle2 size={32} />
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-1">
                                Report Successfully Logged!
                            </h2>
                            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-wider mb-6">
                                Dispatched via JanSetu Official Routing
                            </p>
                            
                            <div className="grid grid-cols-2 gap-3 w-full text-left mb-6">
                                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-0.5">Assigned Department</p>
                                    <p className="text-sm font-black text-sky-600 truncate">{result.department}</p>
                                </div>
                                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-0.5">Priority Rating</p>
                                    <p className="text-sm font-black text-amber-600">{result.priority}</p>
                                </div>
                            </div>

                            <button 
                                onClick={() => navigate('/citizen')} 
                                className="w-full py-3.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-black text-xs uppercase tracking-wider shadow-md shadow-sky-500/20 active:scale-95 transition-all cursor-pointer"
                            >
                                Back to My Citizen Portal
                            </button>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ReportIssue;

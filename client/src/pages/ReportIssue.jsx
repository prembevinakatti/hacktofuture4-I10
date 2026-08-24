import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Send, MapPin, Camera, Type, CheckCircle2, Trophy, Navigation, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ReportIssue = () => {
    const [formData, setFormData] = useState({ title: '', text: '', location: '', imageUrl: '', lat: null, lng: null });
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [result, setResult] = useState(null);
    const { user, refreshUser } = useAuth();
    const navigate = useNavigate();

    const CLOUDINARY_UPLOAD_PRESET = "dbmsproject"; // Replace with user's preset if known
    const CLOUDINARY_CLOUD_NAME = "dyp7pxrli"; // Replace with user's cloud name

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const uploadToast = toast.loading('Uploading evidence to Cloudinary...');
        
        const data = new FormData();
        data.append('file', file);
        data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

        try {
            const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
                method: 'POST',
                body: data
            });
            const fileData = await res.json();
            setFormData({ ...formData, imageUrl: fileData.secure_url });
            toast.success('Image Verified & Uploaded', { id: uploadToast });
        } catch (err) {
            toast.error('Cloudinary Upload Failed', { id: uploadToast });
        } finally {
            setUploading(false);
        }
    };

    const [locating, setLocating] = useState(false);

    useEffect(() => {
        // Auto-detect GPS location on mount
        getLocation();
    }, []);

    const getLocation = () => {
        if (!navigator.geolocation) {
            return toast.error('Geolocation is not supported by your browser');
        }
        setLocating(true);
        const gpsToast = toast.loading('Acquiring precise GPS location & address...');

        const options = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        };

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                console.log('GPS Coordinates Captured:', { latitude, longitude });

                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`, {
                        headers: { 'User-Agent': 'JanSetu-SmartCity-App' }
                    });
                    const data = await response.json();
                    console.log('Geocoding Full Address Data:', data);
                    
                    const fullAddress = data.display_name || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;

                    setFormData(prev => ({ 
                        ...prev, 
                        location: fullAddress, 
                        lat: latitude, 
                        lng: longitude 
                    }));
                    toast.success('Precise Full Address Locked! 📍', { id: gpsToast });
                } catch (err) {
                    const fallback = `Coordinates: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
                    setFormData(prev => ({ 
                        ...prev, 
                        location: fallback, 
                        lat: latitude, 
                        lng: longitude 
                    }));
                    toast.success('GPS Coordinates Locked! 📍', { id: gpsToast });
                } finally {
                    setLocating(false);
                }
            },
            (err) => {
                setLocating(false);
                toast.error('Location permission required. Please allow GPS access.', { id: gpsToast });
            },
            options
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title) return toast.error('Title is required');
        
        setLoading(true);
        const processingToast = toast.loading('Synchronizing with JanSetu Matrix...');
        try {
            // Since description is removed, we send title as 'text' for AI analysis
            const payload = { ...formData, text: formData.title };
            console.log('Sending Payload to Server:', payload);
            
            const { data } = await axios.post(
                'http://localhost:5000/api/complaints', 
                payload,
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
            
            console.log('Server Response (Post-Analysis):', data);
            setResult(data.data);
            await refreshUser();
            toast.success('Issue Logged. +10 Reward Points!', { id: processingToast });
        } catch (err) {
            toast.error('Submission failed.', { id: processingToast });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-20 bg-slate-50">
            <div className="container mx-auto px-6">
                <AnimatePresence mode="wait">
                    {!result ? (
                        <motion.div key="form" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-4xl mx-auto flex flex-col md:flex-row gap-12">
                            <div className="flex-1 md:pt-12">
                                <h1 className="text-6xl font-black text-slate-900 tracking-tighter leading-tight mb-8">
                                    Report <br/> <span className="text-brand-blue">Awareness.</span>
                                </h1>
                                <p className="text-slate-500 font-medium text-lg mb-12">
                                    Upload a photo and provide a title. Our AI will handle the classification and routing automatically.
                                </p>
                                
                                <div className="card-premium p-8 border-none shadow-blue-500/5 bg-blue-50/50">
                                    <div className="flex items-center gap-4 mb-4">
                                        <Trophy className="text-brand-orange" />
                                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-sm">Citizen Reward</h4>
                                    </div>
                                    <p className="text-slate-600 text-sm font-medium">Earn JanSetu points for photo evidence contributing to city safety.</p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="flex-[1.5] card-premium p-10 space-y-8 bg-white">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Issue Title</label>
                                    <div className="relative">
                                        <Type className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                        <input 
                                            required 
                                            className="input-field pl-14" 
                                            placeholder="Example: Broken Street Lamp"
                                            value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-1.5">
                                            <MapPin size={14} className="text-brand-blue" /> Verified GPS Incident Location
                                        </label>
                                        <button 
                                            type="button"
                                            onClick={getLocation}
                                            disabled={locating}
                                            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-blue hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl border border-blue-100 transition-all active:scale-95"
                                        >
                                            {locating ? <Loader2 size={13} className="animate-spin" /> : <Navigation size={13} />}
                                            {locating ? 'Acquiring GPS...' : 'Re-detect Current GPS'}
                                        </button>
                                    </div>

                                    <div className="p-4 bg-slate-50 border-2 border-slate-200/80 rounded-2xl">
                                        {locating ? (
                                            <div className="flex items-center gap-3 text-slate-500 py-2">
                                                <Loader2 className="animate-spin text-brand-blue flex-shrink-0" size={20} />
                                                <div>
                                                    <p className="text-xs font-bold text-slate-700">Connecting to GPS Satellites & Geocoding Service...</p>
                                                    <p className="text-[11px] text-slate-400">Fetching high-accuracy full street address</p>
                                                </div>
                                            </div>
                                        ) : formData.location ? (
                                            <div>
                                                <div className="flex items-start gap-2.5 mb-2">
                                                    <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                                                    <p className="text-xs font-bold text-slate-800 leading-relaxed">
                                                        {formData.location}
                                                    </p>
                                                </div>
                                                {formData.lat && formData.lng && (
                                                    <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                                                        <span className="px-2 py-0.5 bg-white rounded-md border border-slate-200 text-brand-blue">
                                                            LAT: {formData.lat.toFixed(6)}°
                                                        </span>
                                                        <span className="px-2 py-0.5 bg-white rounded-md border border-slate-200 text-brand-blue">
                                                            LNG: {formData.lng.toFixed(6)}°
                                                        </span>
                                                        <span className="text-emerald-600 font-bold ml-auto flex items-center gap-1">
                                                            ● GPS Auto-Locked
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-between py-1">
                                                <p className="text-xs font-medium text-slate-400">Location not yet acquired</p>
                                                <button 
                                                    type="button" 
                                                    onClick={getLocation} 
                                                    className="text-xs font-black text-brand-blue uppercase tracking-wider underline"
                                                >
                                                    Click to Fetch Location
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Evidence Photo</label>
                                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl p-8 hover:border-brand-blue transition-colors relative group">
                                        {formData.imageUrl ? (
                                            <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg">
                                                <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                                <button 
                                                    type="button"
                                                    onClick={() => setFormData({...formData, imageUrl: ''})}
                                                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-xl shadow-lg hover:bg-red-600"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <Camera size={48} className="text-slate-200 mb-4 group-hover:text-brand-blue transition-colors" />
                                                <p className="text-slate-400 font-bold text-sm mb-4">Click to upload photo evidence</p>
                                                <input 
                                                    type="file" 
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                />
                                                {uploading && (
                                                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-3xl backdrop-blur-sm">
                                                        <Loader2 className="animate-spin text-brand-blue" size={32} />
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>

                                <button disabled={loading || uploading} className="btn-blue w-full py-6 text-xl">
                                    {loading ? 'Analyzing...' : 'Submit Awareness Report'}
                                </button>
                            </form>
                        </motion.div>
                    ) : (
                        <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto card-premium p-16 text-center">
                            <div className="w-24 h-24 bg-green-50 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-lg shadow-emerald-200/50">
                                <CheckCircle2 size={48} />
                            </div>
                            <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-4">Report Logged.</h2>
                            <p className="text-slate-500 font-bold mb-12 uppercase text-xs tracking-[0.5em]">Status: Dispatched via AI Routing</p>
                            <div className="grid grid-cols-2 gap-4 text-left mb-12">
                                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Assigned To</p>
                                    <p className="text-lg font-black text-brand-blue">{result.department}</p>
                                </div>
                                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">AI Priority</p>
                                    <p className="text-lg font-black text-brand-orange">{result.priority}</p>
                                </div>
                            </div>
                            <button onClick={() => navigate('/dashboard')} className="btn-blue w-full py-5 text-lg">
                                Back to Control Hub
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ReportIssue;

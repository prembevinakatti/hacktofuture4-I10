import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../api';
import { 
    ShieldCheck, 
    Lock, 
    Mail, 
    ArrowRight, 
    Activity, 
    Building2, 
    KeyRound, 
    ShieldAlert,
    CheckCircle2,
    BarChart3,
    Layers,
    Sliders,
    User
} from 'lucide-react';
import { motion } from 'framer-motion';

const AdminLogin = () => {
    const [formData, setFormData] = useState({ email: 'admin@jansetu.city', password: 'adminPassword123' });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleQuickPreset = () => {
        setFormData({
            email: 'admin@jansetu.city',
            password: 'adminPassword123'
        });
        toast.success('Admin credentials loaded!');
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        const loginToast = toast.loading('Authenticating Administrative Access...');

        // Primary and fallback endpoints
        const endpoints = [
            `${API_BASE_URL}/api/auth/admin-login`,
            `${API_BASE_URL}/api/auth/login`,
            `http://localhost:5000/api/auth/admin-login`,
            `http://localhost:5000/api/auth/login`
        ];

        let success = false;
        let lastError = 'Invalid administrative credentials';

        for (const url of endpoints) {
            try {
                const { data } = await axios.post(url, {
                    email: formData.email.trim(),
                    password: formData.password
                });
                if (data && (data.role === 'admin' || data.role === 'authority')) {
                    login(data);
                    toast.success(`Welcome, Commissioner ${data.name.split(' ')[0]}`, { id: loginToast });
                    navigate('/admin');
                    success = true;
                    break;
                }
            } catch (err) {
                lastError = err.response?.data?.message || err.message || lastError;
            }
        }

        if (!success) {
            toast.error(lastError, { id: loginToast });
        }
        setLoading(false);
    };

    return (
        <div 
            className="min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-5rem)] w-full flex items-center justify-center p-3 sm:p-6 pb-24 sm:pb-8 bg-cover bg-center bg-no-repeat text-slate-900 relative overflow-y-auto"
            style={{ 
                backgroundImage: "url('/admin_aesthetic_bg.png')"
            }}
        >
            {/* Atmospheric overlay */}
            <div className="absolute inset-0 bg-slate-950/30 backdrop-blur-[2px] pointer-events-none"></div>

            {/* Attached Dual-Card Container (Same Size Side-by-Side) */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.98 }} 
                animate={{ opacity: 1, scale: 1 }} 
                className="relative z-10 w-full max-w-4xl bg-white/95 backdrop-blur-xl border border-white/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row items-stretch my-auto"
            >
                {/* LEFT INFO CARD: Admin Gray / Dark Slate Theme */}
                <div className="w-full md:w-1/2 bg-gradient-to-br from-slate-800 via-slate-900 to-zinc-950 p-6 sm:p-8 text-white flex flex-col justify-between relative overflow-hidden">
                    <div className="relative z-10 space-y-4">
                        {/* Title & Description */}
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                                City Executive <br />
                                <span className="text-slate-300">Command Center.</span>
                            </h2>
                            <p className="mt-2 text-xs sm:text-[13px] text-slate-400 leading-relaxed font-medium">
                                High-level civic intelligence, department performance benchmarks, anomaly detection, and city-wide administrative control.
                            </p>
                        </div>

                        {/* Feature Highlights */}
                        <div className="space-y-2.5 pt-2">
                            <div className="flex items-start gap-2.5 p-2.5 rounded-2xl bg-white/5 backdrop-blur-xs border border-white/10">
                                <div className="p-1.5 rounded-xl bg-slate-700/80 text-blue-400 shrink-0 mt-0.5">
                                    <BarChart3 size={14} />
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-white">City-Wide Analytics</h4>
                                    <p className="text-[10px] text-slate-400">Grievance heatmaps and SLA compliance metrics across municipal wards.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-2.5 p-2.5 rounded-2xl bg-white/5 backdrop-blur-xs border border-white/10">
                                <div className="p-1.5 rounded-xl bg-slate-700/80 text-emerald-400 shrink-0 mt-0.5">
                                    <Layers size={14} />
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-white">Inter-Departmental Scores</h4>
                                    <p className="text-[10px] text-slate-400">Automated performance ratings and accountability metrics across divisions.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-2.5 p-2.5 rounded-2xl bg-white/5 backdrop-blur-xs border border-white/10">
                                <div className="p-1.5 rounded-xl bg-slate-700/80 text-amber-400 shrink-0 mt-0.5">
                                    <ShieldAlert size={14} />
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-white">Audit & Anomaly Control</h4>
                                    <p className="text-[10px] text-slate-400">Master audit overrides, suspicious report audits, and security protocols.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Tag */}
                    <div className="relative z-10 pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 font-bold">
                        <span>Restricted Executive Access</span>
                        <span className="flex items-center gap-1 text-emerald-400">
                            <CheckCircle2 size={13} /> Tier-1 Clearance
                        </span>
                    </div>

                    {/* Background Glow */}
                    <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-slate-700/20 rounded-full blur-2xl pointer-events-none"></div>
                </div>

                {/* RIGHT CARD: Admin Login Form (Attached Beside) */}
                <div className="w-full md:w-1/2 p-6 sm:p-8 bg-white flex flex-col justify-between">
                    <div>
                        {/* Header Badge */}
                        <div className="text-center mb-4 sm:mb-5">
                            <div className="w-10 h-10 bg-slate-100 text-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-xs border border-slate-200">
                                <ShieldCheck size={20} />
                            </div>
                            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                                Admin <span className="text-slate-800">Login</span>
                            </h2>
                            <p className="text-slate-500 text-xs font-medium">
                                City Administration & Commissioner Oversight
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-3.5">
                            <div>
                                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 mb-1">
                                    Commissioner Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input 
                                        required 
                                        type="email" 
                                        className="w-full pl-10 pr-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-slate-800 focus:bg-white transition-all placeholder:text-slate-400" 
                                        placeholder="admin@jansetu.city"
                                        value={formData.email} 
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 mb-1">
                                    Master Key Password
                                </label>
                                <div className="relative">
                                    <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input 
                                        required 
                                        type="password" 
                                        className="w-full pl-10 pr-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-slate-800 focus:bg-white transition-all placeholder:text-slate-400" 
                                        placeholder="••••••••"
                                        value={formData.password} 
                                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    />
                                </div>
                            </div>

                            {/* 1-Click Preset Chip */}
                            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 flex items-center justify-between">
                                <div className="text-[11px] text-slate-600">
                                    <span className="font-bold text-slate-800">Admin Account:</span> admin@jansetu.city
                                </div>
                                <button
                                    type="button"
                                    onClick={handleQuickPreset}
                                    className="px-2.5 py-1 bg-slate-900 hover:bg-black text-white text-[10px] font-black uppercase tracking-wider rounded-lg transition-all active:scale-95 cursor-pointer"
                                >
                                    Auto-Fill
                                </button>
                            </div>

                            <button 
                                disabled={loading} 
                                className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-slate-900/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                            >
                                {loading ? 'Validating Token...' : 'Enter Executive Console'} <ArrowRight size={15} />
                            </button>
                        </form>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col gap-2 text-center text-xs">
                        <div className="flex justify-center items-center gap-3 text-[11px] text-slate-400 font-bold">
                            <Link to="/department/login" className="hover:text-amber-600 transition-colors inline-flex items-center gap-1">
                                <Building2 size={12} /> Department Access
                            </Link>
                            <span>•</span>
                            <Link to="/login" className="hover:text-blue-600 transition-colors inline-flex items-center gap-1">
                                <User size={12} /> Citizen Portal
                            </Link>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminLogin;

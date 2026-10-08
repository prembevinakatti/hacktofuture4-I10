import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../api';
import { 
    Building2, 
    Lock, 
    Mail, 
    ArrowRight, 
    ShieldCheck, 
    Sparkles, 
    Zap, 
    Droplet, 
    Trash2, 
    Construction, 
    CheckCircle2,
    Clock,
    UserPlus
} from 'lucide-react';
import { motion } from 'framer-motion';

const DEPARTMENT_PRESETS = [
    { name: 'Sanitation', email: 'sanitation@jansetu.city', role: 'authority', icon: Trash2, color: 'bg-amber-500 text-white', label: 'Sanitation Division' },
    { name: 'Water Supply', email: 'water@jansetu.city', role: 'authority', icon: Droplet, color: 'bg-blue-600 text-white', label: 'Water Works Board' },
    { name: 'Public Works', email: 'roads@jansetu.city', role: 'authority', icon: Construction, color: 'bg-emerald-600 text-white', label: 'Roads & Infrastructure' },
    { name: 'Electric Board', email: 'electric@jansetu.city', role: 'authority', icon: Zap, color: 'bg-purple-600 text-white', label: 'Power & Grid Authority' },
];

const DepartmentLogin = () => {
    const [formData, setFormData] = useState({ email: 'sanitation@jansetu.city', password: 'adminPassword123' });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        const loginToast = toast.loading('Connecting to Department Operational Matrix...');

        try {
            const { data } = await axios.post(`${API_BASE_URL}/api/auth/admin-login`, formData);
            
            if (data.role !== 'authority' && data.role !== 'admin') {
                throw new Error('This gateway is exclusively for Department Officers & Authorities.');
            }

            login(data);
            toast.success(`Welcome, Officer ${data.name.split(' ')[0]} (${data.department || 'Officer'})`, { id: loginToast });
            navigate('/department');
        } catch (err) {
            try {
                const { data } = await axios.post(`${API_BASE_URL}/api/auth/login`, formData);
                if (data.role !== 'authority' && data.role !== 'admin') {
                    throw new Error('Access Denied: Only Department Authorities and Admins are permitted.');
                }
                login(data);
                toast.success(`Welcome, Officer ${data.name.split(' ')[0]} (${data.department || 'Authority'})`, { id: loginToast });
                navigate('/department');
            } catch (innerErr) {
                const errorMsg = innerErr.response?.data?.message || err.response?.data?.message || err.message || 'Authentication failed';
                toast.error(errorMsg, { id: loginToast });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleQuickPreset = (preset) => {
        setFormData({
            email: preset.email,
            password: 'adminPassword123'
        });
        toast.success(`Selected ${preset.label}`);
    };

    return (
        <div 
            className="min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-5rem)] w-full flex items-center justify-center p-3 sm:p-6 bg-cover bg-center bg-no-repeat relative overflow-hidden"
            style={{ 
                backgroundImage: "url('/department_auth_bg.png')"
            }}
        >
            {/* Atmospheric overlay */}
            <div className="absolute inset-0 bg-slate-900/25 backdrop-blur-[2px] pointer-events-none"></div>

            {/* Attached Dual-Card Container (Same Size Side-by-Side) */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 w-full max-w-4xl bg-white/95 backdrop-blur-xl border border-white/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row items-stretch my-auto"
            >
                {/* LEFT INFO CARD: Department Orange Theme */}
                <div className="w-full md:w-1/2 bg-gradient-to-br from-amber-500 via-orange-600 to-amber-700 p-6 sm:p-8 text-white flex flex-col justify-between relative overflow-hidden">
                    <div className="relative z-10 space-y-4">
                        {/* Role Badge */}
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-xs rounded-full text-[10px] font-black uppercase tracking-wider border border-white/25">
                            <Building2 size={12} className="text-amber-100" /> MUNICIPAL LINE OFFICERS
                        </div>

                        {/* Title & Description */}
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                                Official Department <br />
                                <span className="text-amber-200">Workstation.</span>
                            </h2>
                            <p className="mt-2 text-xs sm:text-[13px] text-amber-100/90 leading-relaxed font-medium">
                                Authorized workplace for municipal line officers, divisional supervisors, and field engineers to manage and resolve civic grievances.
                            </p>
                        </div>

                        {/* Feature Highlights */}
                        <div className="space-y-2.5 pt-2">
                            <div className="flex items-start gap-2.5 p-2.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
                                <div className="p-1.5 rounded-xl bg-white/20 text-white shrink-0 mt-0.5">
                                    <Zap size={14} />
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-white">Live Operations Dispatch</h4>
                                    <p className="text-[10px] text-amber-100">Access incoming grievances routed by AI directly to your department.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-2.5 p-2.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
                                <div className="p-1.5 rounded-xl bg-white/20 text-white shrink-0 mt-0.5">
                                    <Clock size={14} />
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-white">24-Day SLA Enforcement</h4>
                                    <p className="text-[10px] text-amber-100">Live countdown clock with automated departmental escalation warnings.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-2.5 p-2.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
                                <div className="p-1.5 rounded-xl bg-white/20 text-white shrink-0 mt-0.5">
                                    <ShieldCheck size={14} />
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-white">Dual AI Resolution Audit</h4>
                                    <p className="text-[10px] text-amber-100">Automated before/after photographic proof verification and fraud prevention.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Tag */}
                    <div className="relative z-10 pt-4 mt-4 border-t border-white/20 flex items-center justify-between text-[11px] text-amber-100 font-bold">
                        <span>Municipal Governance Unit</span>
                        <span className="flex items-center gap-1 text-emerald-200">
                            <CheckCircle2 size={13} /> Official Gateway
                        </span>
                    </div>

                    {/* Background Glow */}
                    <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-amber-400/20 rounded-full blur-2xl pointer-events-none"></div>
                </div>

                {/* RIGHT CARD: Department Login Form (Attached Beside) */}
                <div className="w-full md:w-1/2 p-6 sm:p-8 bg-white flex flex-col justify-between">
                    <div>
                        {/* Header Badge */}
                        <div className="text-center mb-3">
                            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-xs">
                                <Building2 size={20} />
                            </div>
                            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                                Department <span className="text-amber-600">Login</span>
                            </h2>
                            <p className="text-slate-500 text-xs font-medium">
                                Municipal line officers & engineers portal
                            </p>
                        </div>

                        {/* 1-Click Quick Department Selectors */}
                        <div className="mb-3.5">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                                <Sparkles size={11} className="text-amber-600" /> Demo Quick Preset:
                            </p>
                            <div className="grid grid-cols-4 gap-1.5">
                                {DEPARTMENT_PRESETS.map((preset) => {
                                    const IconComponent = preset.icon;
                                    const isSelected = formData.email === preset.email;
                                    return (
                                        <button
                                            key={preset.name}
                                            type="button"
                                            onClick={() => handleQuickPreset(preset)}
                                            className={`p-1.5 rounded-xl border text-center transition-all cursor-pointer ${
                                                isSelected 
                                                    ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-300' 
                                                    : 'bg-slate-50/80 border-slate-200 hover:bg-white shadow-xs'
                                            }`}
                                        >
                                            <div className={`w-5 h-5 mx-auto rounded-lg ${preset.color} flex items-center justify-center mb-0.5 shadow-xs`}>
                                                <IconComponent size={11} />
                                            </div>
                                            <p className="text-[10px] font-black text-slate-800 truncate">{preset.name}</p>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div>
                                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 mb-1">
                                    Department Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input 
                                        required 
                                        type="email" 
                                        className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-amber-500 focus:bg-white transition-all placeholder:text-slate-400" 
                                        placeholder="officer@jansetu.city"
                                        value={formData.email} 
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 mb-1">
                                    Security Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input 
                                        required 
                                        type="password" 
                                        className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-amber-500 focus:bg-white transition-all placeholder:text-slate-400" 
                                        placeholder="••••••••"
                                        value={formData.password} 
                                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    />
                                </div>
                            </div>

                            <button 
                                disabled={loading} 
                                type="submit"
                                className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-orange-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer mt-1"
                            >
                                {loading ? 'Validating...' : 'Access Operations Feed'} <ArrowRight size={15} />
                            </button>
                        </form>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-1.5 text-center text-xs">
                        <Link 
                            to="/department/register" 
                            className="inline-flex items-center justify-center gap-1.5 text-amber-600 font-bold hover:text-amber-700"
                        >
                            <UserPlus size={14} /> Register New Department Official Account
                        </Link>
                        <div className="flex justify-center items-center gap-3 text-[11px] text-slate-400 font-bold pt-1">
                            <Link to="/login" className="hover:text-blue-600 transition-colors">
                                👤 Citizen Portal
                            </Link>
                            <span>•</span>
                            <Link to="/admin/login" className="hover:text-slate-900 transition-colors">
                                🏛️ Executive Admin
                            </Link>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default DepartmentLogin;

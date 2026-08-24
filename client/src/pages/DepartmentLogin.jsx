import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { 
    Building2, 
    Lock, 
    Mail, 
    ArrowRight, 
    ShieldCheck, 
    Sparkles, 
    CheckCircle2, 
    Layers, 
    Zap, 
    Droplet, 
    Trash2, 
    Construction, 
    ShieldAlert,
    UserPlus
} from 'lucide-react';
import { motion } from 'framer-motion';

const DEPARTMENT_PRESETS = [
    { name: 'Sanitation', email: 'sanitation@jansetu.city', role: 'authority', icon: Trash2, color: 'from-amber-500 to-orange-600', label: 'Sanitation Division' },
    { name: 'Water Supply', email: 'water@jansetu.city', role: 'authority', icon: Droplet, color: 'from-blue-500 to-cyan-600', label: 'Water Works Board' },
    { name: 'Public Works', email: 'roads@jansetu.city', role: 'authority', icon: Construction, color: 'from-emerald-500 to-teal-600', label: 'Roads & Infrastructure' },
    { name: 'Electric Board', email: 'electric@jansetu.city', role: 'authority', icon: Zap, color: 'from-purple-500 to-indigo-600', label: 'Power & Grid Authority' },
];

const DepartmentLogin = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        const loginToast = toast.loading('Connecting to Department Operational Matrix...');

        try {
            // Using admin-login or regular login endpoint
            const { data } = await axios.post('http://localhost:5000/api/auth/admin-login', formData);
            
            if (data.role !== 'authority' && data.role !== 'admin') {
                throw new Error('This gateway is exclusively for Department Officers & Authorities.');
            }

            login(data);
            toast.success(`Welcome, Officer ${data.name.split(' ')[0]} (${data.department || 'Officer'})`, { id: loginToast });
            navigate('/department');
        } catch (err) {
            // Fallback check on standard login endpoint if user was registered via authority register
            try {
                const { data } = await axios.post('http://localhost:5000/api/auth/login', formData);
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
        toast.success(`Loaded credentials for ${preset.label}`);
    };

    return (
        <div className="min-h-screen pt-28 pb-20 bg-slate-950 text-white flex items-center justify-center relative overflow-hidden">
            {/* Ambient Lighting Gradients */}
            <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-brand-blue/15 rounded-full blur-[150px] pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[150px] pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-10 max-w-xl">
                {/* Header Badge */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-900 border border-slate-800 rounded-full text-[11px] font-black text-amber-400 uppercase tracking-widest mb-4 shadow-inner">
                        <Building2 size={14} className="text-amber-400" /> Municipal Department Officers & Field Operations
                    </div>
                    <h1 className="text-3xl lg:text-5xl font-black tracking-tight text-white mb-3">
                        Department <span className="bg-gradient-to-r from-blue-400 via-amber-300 to-orange-400 bg-clip-text text-transparent">Command Portal</span>
                    </h1>
                    <p className="text-slate-400 text-xs sm:text-sm font-medium max-w-md mx-auto">
                        Official workplace for municipal line departments, grievance resolution officers, and field engineers.
                    </p>
                </div>

                {/* 1-Click Quick Department Selectors */}
                <div className="mb-6">
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Sparkles size={14} className="text-amber-400" /> Quick-Fill Demo Department Officers:
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {DEPARTMENT_PRESETS.map((preset) => {
                            const IconComponent = preset.icon;
                            const isSelected = formData.email === preset.email;
                            return (
                                <button
                                    key={preset.name}
                                    type="button"
                                    onClick={() => handleQuickPreset(preset)}
                                    className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                                        isSelected 
                                            ? 'bg-slate-800 border-amber-400/80 shadow-lg shadow-amber-400/10' 
                                            : 'bg-slate-900/80 border-slate-800/90 hover:border-slate-700 hover:bg-slate-800/50'
                                    }`}
                                >
                                    <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${preset.color} flex items-center justify-center text-white mb-2 shadow`}>
                                        <IconComponent size={16} />
                                    </div>
                                    <p className="text-xs font-bold text-white truncate">{preset.name}</p>
                                    <p className="text-[9px] text-slate-400 truncate">{preset.email.split('@')[0]}</p>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Main Login Card */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-8 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl"
                >
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
                                Official Department Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input 
                                    type="email"
                                    required
                                    placeholder="officer@jansetu.city"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl text-sm font-medium text-white placeholder-slate-600 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
                                Officer Security Key / Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input 
                                    type="password"
                                    required
                                    placeholder="••••••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl text-sm font-medium text-white placeholder-slate-600 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                                />
                            </div>
                        </div>

                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-orange-500/20 flex items-center justify-center gap-2 active:scale-95 transition-all mt-6"
                        >
                            {loading ? 'Authenticating Department Access...' : 'Enter Department Dashboard'} <ArrowRight size={16} />
                        </button>
                    </form>

                    {/* Navigation Switchers */}
                    <div className="mt-8 pt-6 border-t border-slate-800/80 space-y-3 text-center">
                        <p className="text-xs text-slate-400 font-medium">
                            New Department Officer or Field Engineer?{' '}
                            <Link to="/department/register" className="text-amber-400 font-bold hover:underline inline-flex items-center gap-1">
                                Register Officer Account <UserPlus size={13} />
                            </Link>
                        </p>
                        <div className="flex justify-center gap-4 text-[11px] text-slate-500 pt-2">
                            <Link to="/admin/login" className="hover:text-slate-300 font-bold transition-colors">
                                🏛️ Super Admin Portal
                            </Link>
                            <span>•</span>
                            <Link to="/login" className="hover:text-brand-blue font-bold transition-colors">
                                👤 Citizen Login
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default DepartmentLogin;

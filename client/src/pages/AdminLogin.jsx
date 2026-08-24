import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { 
    ShieldCheck, 
    Lock, 
    Mail, 
    ArrowRight, 
    Activity, 
    Building2, 
    KeyRound, 
    AlertTriangle 
} from 'lucide-react';
import { motion } from 'framer-motion';

const AdminLogin = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const loginToast = toast.loading('Authenticating Administrative Access...');

        try {
            const { data } = await axios.post('http://localhost:5000/api/auth/admin-login', formData);
            login(data);
            toast.success(`Welcome, Officer ${data.name.split(' ')[0]}`, { id: loginToast });
            navigate('/admin');
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Invalid administrative credentials';
            toast.error(errorMsg, { id: loginToast });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-28 pb-20 bg-slate-950 text-white flex items-center justify-center relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-blue/10 rounded-full blur-[140px] pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-brand-orange/10 rounded-full blur-[140px] pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-10 max-w-md">
                {/* Security Tag */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-900 border border-slate-800 rounded-full text-[11px] font-black text-brand-orange uppercase tracking-widest mb-4 shadow-inner">
                        <Activity size={14} className="animate-pulse" /> Restricted Official Access
                    </div>
                    <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-white mb-2">
                        Admin <span className="text-brand-orange">Command Matrix</span>
                    </h1>
                    <p className="text-slate-400 text-xs font-medium">
                        City Administration, Commissioner & Departmental Oversight Gateway
                    </p>
                </div>

                {/* Login Card */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-8 bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl"
                >
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
                                Official Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input 
                                    type="email"
                                    required
                                    placeholder="officer@jansetu.city"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl text-sm font-medium text-white placeholder-slate-600 outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
                                Security Passkey
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input 
                                    type="password"
                                    required
                                    placeholder="••••••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl text-sm font-medium text-white placeholder-slate-600 outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all"
                                />
                            </div>
                        </div>

                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-brand-orange hover:bg-orange-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-brand-orange/20 flex items-center justify-center gap-2 active:scale-95 transition-all mt-6"
                        >
                            {loading ? 'Verifying Credentials...' : 'Authenticate Matrix Access'} <ArrowRight size={16} />
                        </button>
                    </form>

                    {/* Notice */}
                    <div className="mt-8 pt-6 border-t border-slate-800/80 space-y-3 text-center">
                        <p className="text-xs text-slate-400 font-medium">
                            Municipal Line Department Officer?{' '}
                            <Link to="/department/login" className="text-amber-400 font-bold hover:underline">
                                Department Portal Login
                            </Link>
                        </p>
                        <div className="flex justify-center gap-4 text-[11px] text-slate-500 pt-1">
                            <Link to="/department/register" className="hover:text-amber-300 font-bold transition-colors">
                                🏢 Register Department
                            </Link>
                            <span>•</span>
                            <Link to="/login" className="hover:text-brand-blue font-bold transition-colors">
                                👤 Citizen Portal
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AdminLogin;

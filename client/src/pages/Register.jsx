import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { 
    UserPlus, 
    User, 
    Mail, 
    Key, 
    ArrowRight, 
    Sparkles, 
    Award, 
    CheckCircle2, 
    Shield, 
    MapPin 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../api';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'citizen' });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.post(`${API_BASE_URL}/api/auth/register`, formData);
            login(data);
            toast.success(`Welcome to JanSetu, ${data.name}!`);
            navigate('/home');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div 
            className="min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-5rem)] w-full flex items-center justify-center p-3 sm:p-6 bg-cover bg-center bg-no-repeat relative overflow-hidden"
            style={{ 
                backgroundImage: "url('/citizen_auth_bg.jpg')"
            }}
        >
            {/* Subtle atmospheric overlay */}
            <div className="absolute inset-0 bg-slate-900/25 backdrop-blur-[2px] pointer-events-none"></div>

            {/* Attached Dual-Card Container (Same Size Side-by-Side) */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.98 }} 
                animate={{ opacity: 1, scale: 1 }} 
                className="relative z-10 w-full max-w-4xl bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/80 overflow-hidden flex flex-col md:flex-row items-stretch my-auto"
            >
                {/* LEFT INFO CARD: Citizen Blue Theme */}
                <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-6 sm:p-8 text-white flex flex-col justify-between relative overflow-hidden">
                    <div className="relative z-10 space-y-4">
                        {/* Role Badge */}
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 backdrop-blur-xs rounded-full text-[10px] font-black uppercase tracking-wider border border-white/20">
                            <Sparkles size={12} className="text-blue-200" /> CITIZEN ONBOARDING
                        </div>

                        {/* Title & Description */}
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                                Join The Civic <br />
                                <span className="text-blue-200">Movement.</span>
                            </h2>
                            <p className="mt-2 text-xs sm:text-[13px] text-blue-100/90 leading-relaxed font-medium">
                                Create your JanSetu citizen account to log grievances, track municipal resolution in real-time, and unlock civic rewards.
                            </p>
                        </div>

                        {/* Feature Highlights */}
                        <div className="space-y-2.5 pt-2">
                            <div className="flex items-start gap-2.5 p-2.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
                                <div className="p-1.5 rounded-xl bg-white/20 text-white shrink-0 mt-0.5">
                                    <MapPin size={14} />
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-white">Ward-Level Civic Tracking</h4>
                                    <p className="text-[10px] text-blue-100">Directly link reports to local ward officers and municipal teams.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-2.5 p-2.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
                                <div className="p-1.5 rounded-xl bg-white/20 text-white shrink-0 mt-0.5">
                                    <Shield size={14} />
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-white">Guaranteed Transparency</h4>
                                    <p className="text-[10px] text-blue-100">Automated 24-day resolution deadlines with municipal accountability.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-2.5 p-2.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
                                <div className="p-1.5 rounded-xl bg-white/20 text-white shrink-0 mt-0.5">
                                    <Award size={14} />
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-white">10 Bonus Points on Signup</h4>
                                    <p className="text-[10px] text-blue-100">Kickstart your civic profile and claim public recognition badges.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Tag */}
                    <div className="relative z-10 pt-4 mt-4 border-t border-white/15 flex items-center justify-between text-[11px] text-blue-200 font-bold">
                        <span>Clean Cities, Brighter Tomorrows</span>
                        <span className="flex items-center gap-1 text-emerald-300">
                            <CheckCircle2 size={13} /> 100% Free
                        </span>
                    </div>

                    {/* Background Glow */}
                    <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-blue-400/20 rounded-full blur-2xl pointer-events-none"></div>
                </div>

                {/* RIGHT CARD: Register Form (Attached Beside) */}
                <div className="w-full md:w-1/2 p-6 sm:p-8 bg-white flex flex-col justify-between">
                    <div>
                        <div className="text-center mb-5">
                            <div className="w-10 h-10 bg-blue-50 text-brand-blue rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-xs">
                                <UserPlus size={20} />
                            </div>
                            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-0.5">Create Account</h2>
                            <p className="text-slate-500 font-medium text-xs">Join the JanSetu civic network</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-3.5">
                            <div>
                                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 mb-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input 
                                        required 
                                        className="w-full pl-10 pr-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-brand-blue focus:bg-white transition-all placeholder:text-slate-400" 
                                        placeholder="Sneha Sharma" 
                                        value={formData.name} 
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 mb-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input 
                                        required 
                                        type="email" 
                                        className="w-full pl-10 pr-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-brand-blue focus:bg-white transition-all placeholder:text-slate-400" 
                                        placeholder="sneha@example.com" 
                                        value={formData.email} 
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 mb-1">Password</label>
                                <div className="relative">
                                    <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input 
                                        required 
                                        type="password" 
                                        className="w-full pl-10 pr-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-brand-blue focus:bg-white transition-all placeholder:text-slate-400" 
                                        placeholder="••••••••" 
                                        value={formData.password} 
                                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    />
                                </div>
                            </div>

                            <button 
                                disabled={loading} 
                                className="w-full py-3.5 bg-brand-blue hover:bg-blue-600 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer"
                            >
                                {loading ? 'Registering...' : 'Register Account'} <ArrowRight size={15} />
                            </button>
                        </form>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100 text-center text-slate-500 font-medium text-xs">
                        Already registered? <Link to="/login" className="text-brand-blue font-bold hover:underline">Log in</Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;

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
    User, 
    ArrowRight, 
    ShieldCheck, 
    Sparkles, 
    IdCard, 
    CheckCircle2,
    Users,
    Briefcase
} from 'lucide-react';
import { motion } from 'framer-motion';

const DEPARTMENTS = [
    { name: 'Sanitation', description: 'Waste, Garbage & Cleansing Operations' },
    { name: 'Water Supply', description: 'Pipelines, Drainage & Water Board' },
    { name: 'Public Works', description: 'Roads, Potholes & Civil Infrastructure' },
    { name: 'Electric Board', description: 'Streetlights, Power Grids & Lines' },
    { name: 'Police', description: 'Traffic, Law & Municipal Safety' },
    { name: 'General', description: 'Civic Administration & General Grievances' },
];

const DepartmentRegister = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        designation: '',
        department: 'Sanitation',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            return toast.error('Security Passwords do not match!');
        }

        if (formData.password.length < 6) {
            return toast.error('Password must be at least 6 characters long.');
        }

        setLoading(true);
        const regToast = toast.loading('Enrolling Official Authority Account...');

        try {
            const payload = {
                name: formData.designation ? `${formData.name} (${formData.designation})` : formData.name,
                email: formData.email,
                password: formData.password,
                role: 'authority',
                department: formData.department
            };

            const { data } = await axios.post(`${API_BASE_URL}/api/auth/register`, payload);
            login(data);
            toast.success(`Official Account Registered: Welcome Officer ${data.name.split(' ')[0]}!`, { id: regToast });
            navigate('/department');
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Registration failed. Please verify credentials.';
            toast.error(errorMsg, { id: regToast });
        } finally {
            setLoading(false);
        }
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
                            <Sparkles size={12} className="text-amber-100" /> OFFICIAL ENROLLMENT
                        </div>

                        {/* Title & Description */}
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                                Register Official <br />
                                <span className="text-amber-200">Credentials.</span>
                            </h2>
                            <p className="mt-2 text-xs sm:text-[13px] text-amber-100/90 leading-relaxed font-medium">
                                Create your departmental access account to coordinate field workers, update task statuses, and verify civic resolutions.
                            </p>
                        </div>

                        {/* Feature Highlights */}
                        <div className="space-y-2.5 pt-2">
                            <div className="flex items-start gap-2.5 p-2.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
                                <div className="p-1.5 rounded-xl bg-white/20 text-white shrink-0 mt-0.5">
                                    <Briefcase size={14} />
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-white">Department Division Assignment</h4>
                                    <p className="text-[10px] text-amber-100">Directly syncs with municipal departments across water, roads, power & sanitation.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-2.5 p-2.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
                                <div className="p-1.5 rounded-xl bg-white/20 text-white shrink-0 mt-0.5">
                                    <ShieldCheck size={14} />
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-white">Official Verification Standards</h4>
                                    <p className="text-[10px] text-amber-100">Every resolution undergoes AI photographic verification before closing.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-2.5 p-2.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
                                <div className="p-1.5 rounded-xl bg-white/20 text-white shrink-0 mt-0.5">
                                    <Users size={14} />
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-white">Field Operations Coordination</h4>
                                    <p className="text-[10px] text-amber-100">Collaborate across civic engineers and municipal supervisors.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Tag */}
                    <div className="relative z-10 pt-4 mt-4 border-t border-white/20 flex items-center justify-between text-[11px] text-amber-100 font-bold">
                        <span>Authorized Municipal Personnel</span>
                        <span className="flex items-center gap-1 text-emerald-200">
                            <CheckCircle2 size={13} /> Official Roster
                        </span>
                    </div>

                    {/* Background Glow */}
                    <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-amber-400/20 rounded-full blur-2xl pointer-events-none"></div>
                </div>

                {/* RIGHT CARD: Department Register Form (Attached Beside) */}
                <div className="w-full md:w-1/2 p-6 sm:p-8 bg-white flex flex-col justify-between">
                    <div>
                        <div className="text-center mb-4">
                            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-xs">
                                <Building2 size={20} />
                            </div>
                            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                                Department <span className="text-amber-600">Registration</span>
                            </h2>
                            <p className="text-slate-500 text-xs font-medium">
                                Register verified municipal line officer account
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                <div>
                                    <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 mb-1">
                                        Officer Name
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                        <input 
                                            required 
                                            type="text" 
                                            className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-amber-500 focus:bg-white transition-all placeholder:text-slate-400" 
                                            placeholder="Rajesh Kumar"
                                            value={formData.name} 
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 mb-1">
                                        Official Email
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                        <input 
                                            required 
                                            type="email" 
                                            className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-amber-500 focus:bg-white transition-all placeholder:text-slate-400" 
                                            placeholder="rajesh@jansetu.city"
                                            value={formData.email} 
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                <div>
                                    <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 mb-1">
                                        Designation
                                    </label>
                                    <div className="relative">
                                        <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                        <input 
                                            type="text" 
                                            className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-amber-500 focus:bg-white transition-all placeholder:text-slate-400" 
                                            placeholder="Ward Inspector"
                                            value={formData.designation} 
                                            onChange={(e) => setFormData({...formData, designation: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 mb-1">
                                        Department
                                    </label>
                                    <select 
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-700 focus:outline-none focus:border-amber-500 focus:bg-white transition-all cursor-pointer"
                                        value={formData.department}
                                        onChange={(e) => setFormData({...formData, department: e.target.value})}
                                    >
                                        {DEPARTMENTS.map((dept) => (
                                            <option key={dept.name} value={dept.name}>{dept.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                <div>
                                    <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 mb-1">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                        <input 
                                            required 
                                            type="password" 
                                            className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-amber-500 focus:bg-white transition-all placeholder:text-slate-400" 
                                            placeholder="••••••••"
                                            value={formData.password} 
                                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 mb-1">
                                        Confirm
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                        <input 
                                            required 
                                            type="password" 
                                            className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-amber-500 focus:bg-white transition-all placeholder:text-slate-400" 
                                            placeholder="••••••••"
                                            value={formData.confirmPassword} 
                                            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                                        />
                                    </div>
                                </div>
                            </div>

                            <button 
                                disabled={loading} 
                                type="submit"
                                className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-orange-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer mt-1"
                            >
                                {loading ? 'Registering...' : 'Register Official Account'} <ArrowRight size={15} />
                            </button>
                        </form>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 text-center text-xs text-slate-500">
                        Already have an official account? <Link to="/department/login" className="text-amber-600 font-bold hover:underline">Log in</Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default DepartmentRegister;

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { 
    Building2, 
    Lock, 
    Mail, 
    User, 
    ArrowRight, 
    BadgeCheck, 
    ShieldCheck, 
    Sparkles, 
    IdCard, 
    ChevronDown 
} from 'lucide-react';
import { motion } from 'framer-motion';

const DEPARTMENTS = [
    { name: 'Sanitation', description: 'Waste, Garbage & Cleansing Operations', icon: '🧹' },
    { name: 'Water Supply', description: 'Pipelines, Drainage & Water Board', icon: '💧' },
    { name: 'Public Works', description: 'Roads, Potholes & Civil Infrastructure', icon: '🏗️' },
    { name: 'Electric Board', description: 'Streetlights, Power Grids & Lines', icon: '⚡' },
    { name: 'Police', description: 'Traffic, Law & Municipal Safety', icon: '🚓' },
    { name: 'General', description: 'Civic Administration & General Grievances', icon: '🏛️' },
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

            const { data } = await axios.post('http://localhost:5000/api/auth/register', payload);
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
        <div className="min-h-screen pt-28 pb-20 bg-slate-50 text-slate-900 flex items-center justify-center relative overflow-hidden">
            {/* Ambient Lighting Gradients */}
            <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[160px] pointer-events-none"></div>
            <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[160px] pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-10 max-w-2xl">
                {/* Header Badge */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-50 border border-amber-200 rounded-full text-[11px] font-black text-amber-700 uppercase tracking-widest mb-4 shadow-sm">
                        <BadgeCheck size={14} className="text-amber-600" /> Official Personnel Enrollment
                    </div>
                    <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-slate-900 mb-2">
                        Register <span className="text-amber-600">Department Officer</span>
                    </h1>
                    <p className="text-slate-500 text-xs sm:text-sm font-medium max-w-lg mx-auto">
                        Create authenticated municipal officer credentials to monitor, investigate, and resolve citizen grievances with AI verification.
                    </p>
                </div>

                {/* Form Card */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-8 sm:p-10 bg-white border border-slate-200/90 rounded-3xl shadow-xl shadow-slate-200/50"
                >
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid sm:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
                                    Officer Full Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input 
                                        type="text"
                                        required
                                        placeholder="e.g. Rajesh Sharma"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 placeholder-slate-400 outline-none focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-100 transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
                                    Official Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input 
                                        type="email"
                                        required
                                        placeholder="officer@jansetu.city"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 placeholder-slate-400 outline-none focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-100 transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
                                    Department Assignment
                                </label>
                                <div className="relative">
                                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <select
                                        value={formData.department}
                                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                        className="w-full pl-12 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 appearance-none outline-none focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-100 transition-all"
                                    >
                                        {DEPARTMENTS.map((dept) => (
                                            <option key={dept.name} value={dept.name}>
                                                {dept.icon} {dept.name}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
                                    Designation / Post (Optional)
                                </label>
                                <div className="relative">
                                    <IdCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input 
                                        type="text"
                                        placeholder="e.g. Senior Sanitary Inspector"
                                        value={formData.designation}
                                        onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 placeholder-slate-400 outline-none focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-100 transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
                                    Security Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input 
                                        type="password"
                                        required
                                        placeholder="••••••••••••"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 placeholder-slate-400 outline-none focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-100 transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
                                    Confirm Security Password
                                </label>
                                <div className="relative">
                                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input 
                                        type="password"
                                        required
                                        placeholder="••••••••••••"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 placeholder-slate-400 outline-none focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-100 transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Selected Department Overview Banner */}
                        <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">
                                    {DEPARTMENTS.find(d => d.name === formData.department)?.icon}
                                </span>
                                <div>
                                    <p className="text-xs font-bold text-slate-900">Department: {formData.department}</p>
                                    <p className="text-[11px] text-slate-500">
                                        {DEPARTMENTS.find(d => d.name === formData.department)?.description}
                                    </p>
                                </div>
                            </div>
                            <span className="px-2.5 py-1 bg-white border border-amber-300 text-amber-700 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm">
                                Authority Role
                            </span>
                        </div>

                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-orange-500/20 flex items-center justify-center gap-2 active:scale-95 transition-all mt-6"
                        >
                            {loading ? 'Creating Official Account...' : 'Complete Official Registration'} <ArrowRight size={16} />
                        </button>
                    </form>

                    {/* Navigation Switchers */}
                    <div className="mt-8 pt-6 border-t border-slate-100 space-y-3 text-center">
                        <p className="text-xs text-slate-500 font-medium">
                            Already enrolled as an officer?{' '}
                            <Link to="/department/login" className="text-amber-600 font-bold hover:underline">
                                Official Department Login
                            </Link>
                        </p>
                        <div className="flex justify-center gap-4 text-[11px] text-slate-400 pt-1 font-bold">
                            <Link to="/admin/login" className="hover:text-slate-700 transition-colors">
                                🏛️ Super Admin Portal
                            </Link>
                            <span>•</span>
                            <Link to="/login" className="hover:text-brand-blue transition-colors">
                                👤 Citizen Login
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default DepartmentRegister;

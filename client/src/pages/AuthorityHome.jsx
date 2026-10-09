import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
    ShieldCheck, 
    ChevronRight, 
    Building2, 
    Zap, 
    TrendingUp,
    FileText,
    AlertTriangle,
    BarChart3,
    CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';

const AuthorityHome = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#f5f8fc] text-slate-900 pt-6 sm:pt-8 pb-16 px-4 sm:px-6 lg:px-8 font-sans antialiased">
            <div className="max-w-7xl mx-auto space-y-6">
                
                {/* 1. Hero Banner - Exact Match to Reference Image 1 */}
                <div className="relative rounded-3xl bg-white border border-slate-200/80 shadow-xs p-6 sm:p-8 lg:p-10 overflow-hidden">
                    <div className="relative z-10 max-w-2xl">
                        {/* Title: Simple, clear, understandable terminology replacing "Command Terminal" */}
                        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.08] mb-3">
                            Department <br />
                            <span className="text-[#ea580c]">Operations Hub.</span>
                        </h1>

                        {/* Subtitle with dynamic officer & department name */}
                        <p className="text-xs sm:text-sm lg:text-base text-slate-500 font-medium leading-relaxed max-w-xl">
                            Welcome, Officer <span className="text-blue-600 font-bold">{user?.name ? user.name.split(' ')[0] : 'Officer'}</span>. 
                            You are currently presiding over the <strong className="text-slate-800">{user?.department || 'Sanitation'}</strong> division.
                        </p>
                    </div>

                    {/* Right-side Municipal Corporation Authority Building (Image 2) */}
                    <div className="hidden md:block absolute right-0 top-0 bottom-0 w-[48%] lg:w-[52%] pointer-events-none select-none overflow-hidden">
                        <img 
                            src="/dept_municipal_corp.jpg" 
                            alt="Municipal Corporation Building" 
                            className="w-full h-full object-cover object-center"
                        />
                        {/* Soft blend fade on the left edge for seamless transition into white content */}
                        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white via-white/70 to-transparent"></div>
                    </div>
                </div>

                {/* 2. Three Operations Cards - Soft elegant gradients & correct curves matching Reference Image 1 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    
                    {/* Card 1: Operations Hub (Soft Blue) */}
                    <motion.div 
                        whileHover={{ y: -3 }}
                        onClick={() => navigate('/department')}
                        className="bg-gradient-to-br from-blue-50/90 via-blue-50/40 to-blue-100/50 border border-blue-200/70 rounded-3xl p-6 sm:p-7 relative overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                    >
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-11 h-11 rounded-2xl bg-blue-100/80 text-blue-600 flex items-center justify-center shadow-2xs">
                                    <FileText size={22} />
                                </div>
                                <div className="w-9 h-9 rounded-full bg-blue-100/70 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-2xs">
                                    <ChevronRight size={18} />
                                </div>
                            </div>

                            <h3 className="text-lg sm:text-xl font-black text-slate-900 mb-1.5">
                                Operations Hub
                            </h3>
                            <p className="text-xs sm:text-[13px] text-slate-500 font-medium leading-relaxed">
                                Access real-time reports, assign tasks, and update resolution protocols.
                            </p>
                        </div>

                        {/* Subtle background watermark */}
                        <div className="absolute -bottom-4 -right-4 text-blue-500/10 pointer-events-none select-none">
                            <FileText size={100} />
                        </div>
                    </motion.div>

                    {/* Card 2: Priority Queue (Soft Warm Amber/Peach) */}
                    <motion.div 
                        whileHover={{ y: -3 }}
                        onClick={() => navigate('/department')}
                        className="bg-gradient-to-br from-amber-50/90 via-orange-50/40 to-amber-100/50 border border-amber-200/70 rounded-3xl p-6 sm:p-7 relative overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                    >
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-11 h-11 rounded-2xl bg-amber-100/80 text-amber-600 flex items-center justify-center shadow-2xs">
                                    <AlertTriangle size={22} />
                                </div>
                                <div className="w-9 h-9 rounded-full bg-amber-100/70 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors shadow-2xs">
                                    <ChevronRight size={18} />
                                </div>
                            </div>

                            <h3 className="text-lg sm:text-xl font-black text-slate-900 mb-1.5">
                                Priority Queue
                            </h3>
                            <p className="text-xs sm:text-[13px] text-slate-500 font-medium leading-relaxed">
                                Instant access to high-severity incidents requiring immediate deployment.
                            </p>
                        </div>

                        {/* Subtle background watermark */}
                        <div className="absolute -bottom-4 -right-4 text-amber-500/10 pointer-events-none select-none">
                            <AlertTriangle size={100} />
                        </div>
                    </motion.div>

                    {/* Card 3: City Trends (Soft Fresh Mint/Emerald) */}
                    <motion.div 
                        whileHover={{ y: -3 }}
                        onClick={() => navigate(user.role === 'admin' ? '/admin' : '/department')}
                        className="bg-gradient-to-br from-emerald-50/90 via-teal-50/40 to-emerald-100/50 border border-emerald-200/70 rounded-3xl p-6 sm:p-7 relative overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                    >
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-11 h-11 rounded-2xl bg-emerald-100/80 text-emerald-600 flex items-center justify-center shadow-2xs">
                                    <BarChart3 size={22} />
                                </div>
                                <div className="w-9 h-9 rounded-full bg-emerald-100/70 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors shadow-2xs">
                                    <ChevronRight size={18} />
                                </div>
                            </div>

                            <h3 className="text-lg sm:text-xl font-black text-slate-900 mb-1.5">
                                City Trends
                            </h3>
                            <p className="text-xs sm:text-[13px] text-slate-500 font-medium leading-relaxed">
                                Review departmental performance analytics and civic satisfaction trends.
                            </p>
                        </div>

                        {/* Subtle background watermark */}
                        <div className="absolute -bottom-4 -right-4 text-emerald-500/10 pointer-events-none select-none">
                            <TrendingUp size={100} />
                        </div>
                    </motion.div>

                </div>

                {/* 3. Bottom Status & Quick Actions Row - Exact Match to Reference Image 1 */}
                <div className="flex flex-col lg:flex-row items-stretch gap-4">
                    
                    {/* Left Card: Department Status */}
                    <div className="flex-1 bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                <Building2 size={20} />
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-slate-900">Department Status</h4>
                                <p className="text-xs text-slate-400 font-medium italic mt-0.5">
                                    "Efficiency in governance is the bridge between citizen voice and city action."
                                </p>
                            </div>
                        </div>

                        {/* Status Pills from Reference Image 1 */}
                        <div className="flex items-center gap-2 self-stretch sm:self-auto shrink-0">
                            <div className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1">
                                <span>Division: <strong>{user?.department || 'Sanitation'}</strong></span>
                                <span className="text-slate-400 text-[10px]">⌄</span>
                            </div>
                            <div className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                                <span>Status: <strong>Active</strong></span>
                                <span className="text-emerald-500 text-[10px]">⌄</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Card: Quick Actions */}
                    <div 
                        onClick={() => navigate('/department')}
                        className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer group shrink-0"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                <Zap size={20} />
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-slate-900">Quick Actions</h4>
                                <p className="text-xs text-slate-400 font-medium">Perform common tasks instantly.</p>
                            </div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <ChevronRight size={16} />
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default AuthorityHome;

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
    Home,
    FileEdit,
    FileText,
    Activity,
    Trophy,
    HelpCircle,
    Plus,
    CheckCircle2,
    Clock,
    FolderKanban,
    MapPin,
    Search,
    ArrowRight,
    LogOut,
    Menu,
    X,
    LayoutGrid,
    List
} from 'lucide-react';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../api';

const CitizenPage = () => {
    const [complaints, setComplaints] = useState([]);
    const [filter, setFilter] = useState('all'); // 'all', 'pending', 'resolved'
    const [viewMode, setViewMode] = useState('grid');
    const [loading, setLoading] = useState(true);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const loadData = async () => {
            try {
                const compRes = await axios.get(`${API_BASE_URL}/api/complaints/my`, {
                    headers: { Authorization: `Bearer ${user?.token}` }
                });
                setComplaints(compRes.data.data || []);
            } catch {
                toast.error('Failed to load your complaints');
            } finally {
                setLoading(false);
            }
        };
        if (user?.token) {
            loadData();
        } else {
            setLoading(false);
        }
    }, [user?.token]);

    const resolvedCount = complaints.filter(c => c.status === 'Resolved').length;
    const inProgressCount = complaints.filter(c => c.status !== 'Resolved').length;

    const filteredComplaints = complaints.filter(c => {
        if (filter === 'resolved') return c.status === 'Resolved';
        if (filter === 'pending') return c.status !== 'Resolved';
        return true;
    });

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const scrollToComplaints = () => {
        const el = document.getElementById('my-complaints-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div 
            className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed flex text-slate-800 antialiased font-sans relative"
            style={{ 
                backgroundImage: "url('/citizen_home_bg.png')" 
            }}
        >
            {/* Soft atmospheric overlay ensuring high readability on top of scenic background */}
            <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px] pointer-events-none"></div>

            {/* Mobile Header Bar */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 flex items-center justify-between z-50">
                <div className="flex items-center gap-2.5">
                    <button 
                        onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                        className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
                        aria-label="Toggle Navigation"
                    >
                        {isMobileSidebarOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                    <div className="flex items-center gap-2">
                        <img src="/JanSetuLogo.jpeg" alt="Logo" className="w-8 h-8 rounded-lg object-contain shadow-xs" />
                        <span className="font-black text-lg tracking-tight text-slate-900">
                            Jan<span className="text-brand-orange">Setu</span>
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Link to="/rewards" className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 rounded-xl text-xs font-black border border-amber-200/80 shadow-2xs">
                        <Trophy size={14} className="text-amber-500" /> {user?.rewardPoints || 0} pts
                    </Link>
                </div>
            </div>

            {/* Mobile Sidebar Overlay */}
            {isMobileSidebarOpen && (
                <div 
                    className="lg:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40"
                    onClick={() => setIsMobileSidebarOpen(false)}
                />
            )}

            {/* Left Sidebar Panel - Glassmorphic on top of citizen_home_bg */}
            <aside className={`
                fixed lg:sticky top-0 bottom-0 left-0 z-50
                w-64 min-h-screen bg-white/90 backdrop-blur-xl border-r border-slate-200/70
                flex flex-col justify-between py-6 px-4
                transition-transform duration-300 ease-in-out shadow-sm
                ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div>
                    {/* Brand header in sidebar (desktop) */}
                    <div className="hidden lg:flex items-center gap-3 px-3 mb-6">
                        <img 
                            src="/JanSetuLogo.jpeg" 
                            alt="JanSetu" 
                            className="w-9 h-9 rounded-xl object-contain shadow-xs"
                        />
                        <div>
                            <span className="font-black text-lg tracking-tight text-slate-900 block leading-tight">
                                Jan<span className="text-brand-orange">Setu</span>
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                Citizen Portal
                            </span>
                        </div>
                    </div>

                    {/* Navigation Menu List */}
                    <nav className="space-y-1.5">
                        {/* 1. Home (Active) */}
                        <div className="relative">
                            <button
                                onClick={() => {
                                    navigate('/home');
                                    setIsMobileSidebarOpen(false);
                                }}
                                className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-bold bg-blue-50/90 text-blue-600 transition-all text-left shadow-xs"
                            >
                                <span className="w-1.5 h-5 bg-blue-600 rounded-full"></span>
                                <Home size={18} className="text-blue-600" />
                                <span>Home</span>
                            </button>
                        </div>

                        {/* 2. Submit Complaint */}
                        <button
                            onClick={() => {
                                navigate('/report');
                                setIsMobileSidebarOpen(false);
                            }}
                            className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50/80 transition-all text-left group"
                        >
                            <span className="w-1.5 h-5 opacity-0"></span>
                            <FileEdit size={18} className="text-slate-400 group-hover:text-slate-700 transition-colors" />
                            <span>Submit Complaint</span>
                        </button>

                        {/* 3. My Reports */}
                        <button
                            onClick={() => {
                                setFilter('all');
                                scrollToComplaints();
                                setIsMobileSidebarOpen(false);
                            }}
                            className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50/80 transition-all text-left group"
                        >
                            <span className="w-1.5 h-5 opacity-0"></span>
                            <FileText size={18} className="text-slate-400 group-hover:text-slate-700 transition-colors" />
                            <span>My Reports</span>
                        </button>

                        {/* 4. Track Status */}
                        <button
                            onClick={() => {
                                setFilter('pending');
                                scrollToComplaints();
                                setIsMobileSidebarOpen(false);
                            }}
                            className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50/80 transition-all text-left group"
                        >
                            <span className="w-1.5 h-5 opacity-0"></span>
                            <Activity size={18} className="text-slate-400 group-hover:text-slate-700 transition-colors" />
                            <span>Track Status</span>
                        </button>

                        {/* 5. Rewards */}
                        <button
                            onClick={() => {
                                navigate('/rewards');
                                setIsMobileSidebarOpen(false);
                            }}
                            className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50/80 transition-all text-left group"
                        >
                            <span className="w-1.5 h-5 opacity-0"></span>
                            <Trophy size={18} className="text-slate-400 group-hover:text-amber-500 transition-colors" />
                            <span>Rewards</span>
                        </button>

                        {/* 6. Help & Support */}
                        <button
                            onClick={() => {
                                toast.success("Connecting with JanSetu AI Citizen Assistance...");
                                setIsMobileSidebarOpen(false);
                            }}
                            className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50/80 transition-all text-left group"
                        >
                            <span className="w-1.5 h-5 opacity-0"></span>
                            <HelpCircle size={18} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                            <span>Help & Support</span>
                        </button>
                    </nav>
                </div>

                {/* Bottom of Sidebar: Landmark Artwork & Citizen Profile */}
                <div className="pt-4 border-t border-slate-200/60 flex flex-col items-center">
                    {/* Landmark Sketch Watermark */}
                    <div className="w-full px-2 mb-3 select-none pointer-events-none">
                        <img 
                            src="/jansetu-govt-building.png" 
                            alt="Civic Landmark" 
                            className="w-full h-20 object-contain opacity-35 mx-auto"
                            onError={(e) => { e.target.style.display = 'none'; }}
                        />
                    </div>

                    {/* Citizen Card Footer */}
                    <div className="w-full bg-slate-50/90 rounded-2xl p-3 border border-slate-200/60 flex items-center justify-between">
                        <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-black text-xs shrink-0">
                                {user?.name?.charAt(0).toUpperCase() || 'S'}
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-black text-slate-800 truncate">
                                    {user?.name || 'Sneha'}
                                </p>
                                <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                                    Registered Citizen
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            title="Sign out"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0"
                        >
                            <LogOut size={16} />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 min-w-0 p-3 sm:p-6 lg:p-8 pt-16 sm:pt-6 pb-28 md:pb-8 space-y-6 overflow-y-auto relative z-10">
                
                {/* 1. Header / Hero Banner - Correctly Aligned with Full Visibility for Person in Image */}
                <div className="relative rounded-3xl bg-white/95 backdrop-blur-xl border border-blue-100/90 shadow-sm p-5 sm:p-6 lg:p-7 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6">
                    {/* Left Content Column */}
                    <div className="w-full md:w-[42%] lg:w-[38%] shrink-0 z-10 space-y-2">
                        {/* Welcome Heading */}
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                            Welcome, <span className="text-[#1d4ed8]">{user?.name || 'Sneha'}</span>
                        </h1>

                        {/* Subtitle - Cleanly aligned */}
                        <p className="text-xs sm:text-[13px] font-medium text-slate-500 leading-relaxed max-w-sm">
                            Track your reported municipal issues and follow AI-driven resolution workflows in real-time.
                        </p>
                    </div>

                    {/* Right Image Column - Full Visibility for the person and civic elements */}
                    <div className="w-full md:w-[58%] lg:w-[62%] h-44 sm:h-52 lg:h-56 relative overflow-hidden rounded-2xl shrink-0 bg-sky-50/40 border border-sky-100/60">
                        <img 
                            src="/citizen_hero_civic.jpg" 
                            alt="Citizen Civic Intelligence" 
                            className="w-full h-full object-cover object-[15%_center] rounded-2xl select-none"
                        />
                    </div>
                </div>

                {/* 2. Stat & Action Cards Row - Compact, Sleek, and Perfectly Aligned */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5 items-stretch">
                    
                    {/* Card 1: TOTAL COMPLAINTS */}
                    <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 border border-slate-100 shadow-xs relative overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow h-full min-h-[120px]">
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                    <FolderKanban size={16} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                                    TOTAL COMPLAINTS
                                </span>
                            </div>
                            <div className="text-2xl sm:text-[28px] font-black text-slate-900 tracking-tight my-1">
                                {complaints.length}
                            </div>
                        </div>
                        <div className="text-[10px] sm:text-[11px] text-slate-400 font-medium pt-1.5 border-t border-slate-100/80">
                            Registered across all wards
                        </div>
                    </div>

                    {/* Card 2: ACTIVE / PENDING */}
                    <div className="bg-gradient-to-br from-white/95 via-white/90 to-amber-50/30 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 border border-amber-100/80 shadow-xs relative overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow h-full min-h-[120px]">
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
                                    <Clock size={16} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-wider text-amber-500">
                                    ACTIVE / PENDING
                                </span>
                            </div>
                            <div className="text-2xl sm:text-[28px] font-black text-amber-600 tracking-tight my-1">
                                {inProgressCount}
                            </div>
                        </div>
                        <div className="text-[10px] sm:text-[11px] text-amber-600/80 font-medium pt-1.5 border-t border-amber-100/60">
                            Currently in progress
                        </div>
                    </div>

                    {/* Card 3: RESOLVED & VERIFIED */}
                    <div className="bg-gradient-to-br from-white/95 via-white/90 to-emerald-50/30 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 border border-emerald-100/80 shadow-xs relative overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow h-full min-h-[120px]">
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                    <CheckCircle2 size={16} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600">
                                    RESOLVED & VERIFIED
                                </span>
                            </div>
                            <div className="text-2xl sm:text-[28px] font-black text-emerald-600 tracking-tight my-1">
                                {resolvedCount}
                            </div>
                        </div>
                        <div className="text-[10px] sm:text-[11px] text-emerald-600/80 font-medium pt-1.5 border-t border-emerald-100/60">
                            Successfully fixed & verified
                        </div>
                    </div>

                    {/* Card 4: Action Card: RAISE COMPLAINT (Compact, sleek) */}
                    <div 
                        onClick={() => navigate('/report')}
                        className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl p-3.5 sm:p-4 shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 hover:scale-[1.01] active:scale-[0.98] transition-all cursor-pointer flex flex-col justify-between h-full min-h-[120px] group"
                    >
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-xs text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                                    <Plus size={16} className="stroke-[2.5]" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-wider text-blue-100">
                                    ACTION
                                </span>
                            </div>
                            <div className="text-sm sm:text-base font-black uppercase tracking-wider text-white my-1">
                                RAISE COMPLAINT
                            </div>
                        </div>
                        <div className="text-[10px] sm:text-[11px] text-blue-100 font-medium pt-1.5 border-t border-white/15 flex items-center justify-between">
                            <span>Direct priority submission</span>
                            <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>

                </div>

                {/* 3. My Complaint Activity Section */}
                <div id="my-complaints-section" className="space-y-4 pt-2">
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-white/70 shadow-2xs">
                        <div className="flex items-center gap-2.5">
                            <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
                            <div>
                                <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                                    <Trophy size={18} className="text-amber-500" /> My Complaint Activity
                                </h2>
                                <p className="text-xs text-slate-500 font-medium">
                                    Real-time status updates and 24-day SLA tracking across municipal departments.
                                </p>
                            </div>
                        </div>

                        {/* Right-side Controls: Filters & Grid Toggle */}
                        <div className="flex items-center gap-2 self-start sm:self-auto">
                            <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200/80 shadow-2xs">
                                <button 
                                    onClick={() => setFilter('all')}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === 'all' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'}`}
                                >
                                    All
                                </button>
                                <button 
                                    onClick={() => setFilter('pending')}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === 'pending' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'}`}
                                >
                                    Active ({inProgressCount})
                                </button>
                                <button 
                                    onClick={() => setFilter('resolved')}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === 'resolved' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'}`}
                                >
                                    Resolved ({resolvedCount})
                                </button>
                            </div>

                            <button 
                                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                                title="Toggle View"
                                className="p-2 rounded-xl bg-white border border-slate-200/80 text-slate-500 hover:text-slate-800 transition-colors shadow-2xs"
                            >
                                {viewMode === 'grid' ? <LayoutGrid size={16} /> : <List size={16} />}
                            </button>
                        </div>
                    </div>

                    {/* Feed Content */}
                    {loading ? (
                        <div className="py-20 text-center bg-white/90 backdrop-blur-md rounded-3xl border border-white/80 shadow-xs">
                            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Syncing civic records...</p>
                        </div>
                    ) : filteredComplaints.length > 0 ? (
                        <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                            {filteredComplaints.map((c) => (
                                <div 
                                    key={c._id}
                                    className="p-5 sm:p-6 bg-white/95 backdrop-blur-md border border-white/80 rounded-3xl shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="flex justify-between items-start mb-3 gap-2">
                                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-black uppercase tracking-wider ${
                                                c.status === 'Resolved' 
                                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                                    : 'bg-blue-50 text-blue-700 border border-blue-200'
                                            }`}>
                                                {c.status}
                                            </span>
                                            <span className="text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100 truncate">
                                                {c.department || 'Assigned'}
                                            </span>
                                        </div>

                                        <h3 className="text-base font-bold text-slate-900 mb-3 line-clamp-2">
                                            {c.title}
                                        </h3>

                                        {/* Before/After Evidence */}
                                        <div className="mb-3">
                                            {c.status === 'Resolved' || c.resolutionImageUrl ? (
                                                <BeforeAfterSlider 
                                                    beforeImage={c.imageUrl}
                                                    afterImage={c.resolutionImageUrl}
                                                    verificationStatus={c.verificationStatus}
                                                    verificationScore={c.verificationScore}
                                                    verificationVerdict={c.verificationVerdict}
                                                    fraudAuditFlag={c.fraudAuditFlag}
                                                />
                                            ) : c.imageUrl ? (
                                                <div className="h-40 rounded-2xl overflow-hidden bg-slate-100 mb-2">
                                                    <img src={c.imageUrl} alt="Complaint proof" className="w-full h-full object-cover" />
                                                </div>
                                            ) : null}

                                            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium mt-2 truncate">
                                                <MapPin size={13} className="shrink-0 text-blue-600" />
                                                <span className="truncate">{c.location || 'Local territory'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-[11px] text-slate-400 font-medium mt-2">
                                        <span>Category: <strong className="text-slate-700">{c.category || 'General'}</strong></span>
                                        <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* Empty State Card */
                        <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-white/80 shadow-xs p-12 sm:p-16 text-center max-w-full">
                            <div className="mx-auto mb-4 w-20 h-20 rounded-2xl bg-blue-50/80 border border-blue-100/70 flex items-center justify-center relative shadow-2xs">
                                <FileText size={36} className="text-blue-500/80" />
                                <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center">
                                    <Search size={15} className="text-blue-600" />
                                </div>
                            </div>
                            
                            <h3 className="text-base sm:text-lg font-bold text-slate-800">
                                No complaints in this view
                            </h3>
                            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-6">
                                You have not reported any complaints yet.
                            </p>
                            
                            <button 
                                onClick={() => navigate('/report')}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md shadow-blue-500/20 active:scale-95 transition-all cursor-pointer"
                            >
                                <Plus size={15} /> Raise a Report
                            </button>
                        </div>
                    )}
                </div>

            </main>
        </div>
    );
};

export default CitizenPage;

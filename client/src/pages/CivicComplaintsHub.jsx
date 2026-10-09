import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../api';
import { 
    Search, 
    Filter, 
    Building2, 
    CheckCircle2, 
    Clock, 
    AlertTriangle, 
    MapPin, 
    Eye, 
    X, 
    ChevronRight, 
    BarChart3, 
    ShieldCheck, 
    Flame, 
    RotateCcw,
    Layers,
    ArrowUpRight,
    Calendar,
    FileText,
    TrendingUp,
    ExternalLink,
    HelpCircle,
    Trash2,
    Droplets,
    Wrench,
    Zap,
    Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const getDepartmentIcon = (dept, size = 18, customClass = "") => {
    switch (dept) {
        case 'Sanitation':
            return <Trash2 size={size} className={customClass || "text-amber-600"} />;
        case 'Water Supply':
            return <Droplets size={size} className={customClass || "text-blue-500"} />;
        case 'Public Works':
            return <Wrench size={size} className={customClass || "text-emerald-600"} />;
        case 'Electric Board':
            return <Zap size={size} className={customClass || "text-purple-600"} />;
        case 'Police':
            return <Shield size={size} className={customClass || "text-indigo-600"} />;
        case 'General':
        default:
            return <Building2 size={size} className={customClass || "text-slate-700"} />;
    }
};

const CivicComplaintsHub = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [complaints, setComplaints] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filter and Search States
    const [selectedDept, setSelectedDept] = useState('All');
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [selectedPriority, setSelectedPriority] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('newest'); // newest, oldest, priority

    // Modal state for viewing complete complaint details
    const [activeModalComplaint, setActiveModalComplaint] = useState(null);
    const [activeImagePreview, setActiveImagePreview] = useState(null);

    const fetchPublicData = async () => {
        setLoading(true);
        setError(null);
        try {
            const params = {};
            if (selectedDept !== 'All') params.department = selectedDept;
            if (selectedStatus !== 'All') params.status = selectedStatus;
            if (selectedPriority !== 'All') params.priority = selectedPriority;
            if (searchQuery.trim()) params.search = searchQuery.trim();

            const res = await axios.get(`${API_BASE_URL}/api/complaints/public`, { params });
            if (res.data && res.data.success) {
                setComplaints(res.data.data.complaints || []);
                setStats(res.data.data.stats || null);
            }
        } catch (err) {
            console.error('Error fetching public complaints:', err);
            setError('Could not load public complaints feed. Please check connection.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPublicData();
    }, [selectedDept, selectedStatus, selectedPriority]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchPublicData();
    };

    const handleResetFilters = () => {
        setSelectedDept('All');
        setSelectedStatus('All');
        setSelectedPriority('All');
        setSearchQuery('');
    };

    // Client-side sorting
    const sortedComplaints = [...complaints].sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
        if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
        if (sortBy === 'priority') {
            const pMap = { 'High': 3, 'Medium': 2, 'Low': 1 };
            return (pMap[b.priority] || 0) - (pMap[a.priority] || 0);
        }
        return 0;
    });

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Resolved':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 size={12} className="text-emerald-600" /> Resolved
                    </span>
                );
            case 'In Progress':
            case 'Assigned':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                        <Clock size={12} className="text-blue-600" /> In Progress
                    </span>
                );
            case 'Pending':
            default:
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock size={12} className="text-amber-600" /> Pending
                    </span>
                );
        }
    };

    const getPriorityBadge = (priority) => {
        switch (priority) {
            case 'High':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
                        <Flame size={11} className="text-rose-600" /> High
                    </span>
                );
            case 'Medium':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
                        Medium
                    </span>
                );
            case 'Low':
            default:
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                        Low
                    </span>
                );
        }
    };

    const departmentsList = ['All', 'Sanitation', 'Water Supply', 'Public Works', 'Electric Board', 'Police', 'General'];

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900 pb-20">
            
            {/* Top Transparency Banner with Side-by-Side Card Layout */}
            <header className="bg-white border-b border-slate-200/90 shadow-xs relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
                        
                        {/* Left Side: Content & Action */}
                        <div className="lg:col-span-7 flex flex-col justify-center">
                            

                            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-tight">
                                Civic Complaints & <br className="hidden sm:inline" />
                                <span className="text-brand-blue">Public Transparency Hub.</span>
                            </h1>

                            <p className="mt-2.5 text-xs sm:text-sm text-slate-600 max-w-2xl font-medium leading-relaxed">
                                Open public record of citizen grievances, departmental response metrics, and live resolution proof across all municipal wards. Completely public & accessible without login.
                            </p>

                            {/* Quick Action Buttons */}
                            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 mt-5">
                                {user ? (
                                    <>
                                        {user.role === 'citizen' && (
                                            <button 
                                                onClick={() => navigate('/report')}
                                                className="px-5 py-2.5 bg-brand-orange hover:bg-orange-600 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-orange-500/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                                            >
                                                + File New Grievance
                                            </button>
                                        )}
                                        {user.role === 'authority' && (
                                            <button 
                                                onClick={() => navigate('/department')}
                                                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md active:scale-95 transition-all cursor-pointer"
                                            >
                                                Go to Work Orders
                                            </button>
                                        )}
                                        {user.role === 'admin' && (
                                            <button 
                                                onClick={() => navigate('/admin')}
                                                className="px-5 py-2.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs sm:text-sm font-bold shadow-md active:scale-95 transition-all cursor-pointer"
                                            >
                                                Admin Command Center
                                            </button>
                                        )}
                                    </>
                                ) : (
                                    <div className="flex flex-wrap items-center gap-2.5">
                                        <button 
                                            onClick={() => navigate('/report')}
                                            className="px-4 sm:px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm active:scale-95 transition-all cursor-pointer"
                                        >
                                            Raise Grievance
                                        </button>
                                        <button 
                                            onClick={() => navigate('/login')}
                                            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm active:scale-95 transition-all cursor-pointer"
                                        >
                                            Citizen Sign In
                                        </button>
                                        <button 
                                            onClick={() => navigate('/department/login')}
                                            className="px-3.5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm active:scale-95 transition-all cursor-pointer"
                                        >
                                            Dept Login
                                        </button>
                                        <button 
                                            onClick={() => navigate('/admin/login')}
                                            className="px-4 py-2.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm active:scale-95 transition-all cursor-pointer"
                                        >
                                            Admin Command Center
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Side: Image in Card Format */}
                        <div className="lg:col-span-5">
                            <div className="rounded-2xl sm:rounded-3xl border border-slate-300 bg-slate-50/70 p-2 sm:p-2.5 shadow-md overflow-hidden group">
                                <div className="rounded-xl sm:rounded-2xl overflow-hidden bg-white border border-slate-200">
                                    <img 
                                        src="/citizen_reporting_hero.jpg" 
                                        alt="Citizen Grievance to Municipal Resolution Pipeline" 
                                        className="w-full h-48 sm:h-56 object-cover object-center group-hover:scale-[1.02] transition-transform duration-300 block"
                                    />
                                </div>
                                <div className="pt-2 px-1 flex items-center justify-between text-slate-600">
                                    <span className="text-[11px] sm:text-xs font-bold">Citizen-to-Municipal Action Pipeline</span>
                                    <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                        Live Feed
                                    </span>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* KPI Statistics Row */}
                    {stats && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mt-6 pt-6 border-t border-slate-200/80">
                            {/* Total Complaints */}
                            <div className="bg-slate-50 border border-slate-300 rounded-2xl p-3.5 sm:p-4 text-center shadow-xs">
                                <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Total Complaints</p>
                                <p className="text-xl sm:text-3xl font-black text-slate-900 mt-1">{stats.total || 0}</p>
                                <span className="text-[10px] font-semibold text-slate-400">All Municipal Wards</span>
                            </div>

                            {/* Resolved */}
                            <div className="bg-emerald-50/70 border border-emerald-300 rounded-2xl p-3.5 sm:p-4 text-center shadow-xs">
                                <p className="text-[10px] sm:text-xs font-bold text-emerald-800 uppercase tracking-wider">Resolved</p>
                                <p className="text-xl sm:text-3xl font-black text-emerald-700 mt-1">{stats.resolved || 0}</p>
                                <span className="text-[10px] font-semibold text-emerald-600">{stats.resolutionRate || 0}% Cleared</span>
                            </div>

                            {/* In Progress */}
                            <div className="bg-blue-50/70 border border-blue-300 rounded-2xl p-3.5 sm:p-4 text-center shadow-xs">
                                <p className="text-[10px] sm:text-xs font-bold text-blue-800 uppercase tracking-wider">In Progress</p>
                                <p className="text-xl sm:text-3xl font-black text-blue-700 mt-1">{stats.inProgress || 0}</p>
                                <span className="text-[10px] font-semibold text-blue-600">Active Field Action</span>
                            </div>

                            {/* Pending */}
                            <div className="bg-amber-50/70 border border-amber-300 rounded-2xl p-3.5 sm:p-4 text-center shadow-xs">
                                <p className="text-[10px] sm:text-xs font-bold text-amber-800 uppercase tracking-wider">Pending</p>
                                <p className="text-xl sm:text-3xl font-black text-amber-700 mt-1">{stats.pending || 0}</p>
                                <span className="text-[10px] font-semibold text-amber-600">Awaiting Dispatch</span>
                            </div>

                            {/* High Priority */}
                            <div className="bg-rose-50/70 border border-rose-300 rounded-2xl p-3.5 sm:p-4 text-center shadow-xs">
                                <p className="text-[10px] sm:text-xs font-bold text-rose-800 uppercase tracking-wider">High Priority</p>
                                <p className="text-xl sm:text-3xl font-black text-rose-700 mt-1">{stats.highPriority || 0}</p>
                                <span className="text-[10px] font-semibold text-rose-600">Urgent Attention</span>
                            </div>

                            {/* Overall Resolution Rate */}
                            <div className="bg-indigo-50/70 border border-indigo-300 rounded-2xl p-3.5 sm:p-4 text-center shadow-xs">
                                <p className="text-[10px] sm:text-xs font-bold text-indigo-800 uppercase tracking-wider">City Score</p>
                                <p className="text-xl sm:text-3xl font-black text-indigo-700 mt-1">{stats.resolutionRate || 0}%</p>
                                <div className="w-full bg-indigo-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                                    <div 
                                        className="bg-indigo-600 h-full rounded-full transition-all duration-500" 
                                        style={{ width: `${Math.min(100, stats.resolutionRate || 0)}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {/* Department-Wise Complaints Breakdown Cards */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
                <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                        <div>
                            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                                <Building2 size={18} className="text-brand-orange" /> Department-Wise Complaint Breakdown
                            </h2>
                            <p className="text-xs text-slate-500 font-medium">Click any department card to instantly filter the grievance register below</p>
                        </div>
                        {selectedDept !== 'All' && (
                            <button
                                onClick={() => setSelectedDept('All')}
                                className="text-xs font-bold text-brand-blue hover:underline self-start sm:self-auto"
                            >
                                Show All Departments
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                        {stats?.deptStats?.map((dept) => {
                            const isSelected = selectedDept === dept.department;
                            return (
                                <button
                                    key={dept.department}
                                    type="button"
                                    onClick={() => setSelectedDept(isSelected ? 'All' : dept.department)}
                                    className={`p-4 rounded-2xl text-left border transition-all cursor-pointer relative overflow-hidden ${
                                        isSelected 
                                            ? 'bg-slate-900 text-white border-slate-900 shadow-lg ring-2 ring-brand-blue' 
                                            : 'bg-white hover:bg-slate-50 border-slate-300 hover:border-brand-blue text-slate-800 shadow-xs'
                                    }`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100'}`}>
                                            {getDepartmentIcon(dept.department, 20, isSelected ? 'text-white' : '')}
                                        </div>
                                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                                            isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                                        }`}>
                                            {dept.resolutionRate}%
                                        </span>
                                    </div>
                                    <h3 className={`text-xs sm:text-sm font-black truncate ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                                        {dept.department}
                                    </h3>
                                    <div className="mt-2 flex items-baseline justify-between text-[11px]">
                                        <span className={isSelected ? 'text-slate-300' : 'text-slate-500'}>Total:</span>
                                        <span className="font-black text-sm">{dept.total}</span>
                                    </div>
                                    <div className="mt-1 flex items-center justify-between text-[10px]">
                                        <span className={`inline-flex items-center gap-1 ${isSelected ? 'text-emerald-300' : 'text-emerald-700 font-bold'}`}>
                                            <CheckCircle2 size={10} /> {dept.resolved}
                                        </span>
                                        <span className={`inline-flex items-center gap-1 ${isSelected ? 'text-amber-300' : 'text-amber-700 font-bold'}`}>
                                            <Clock size={10} /> {dept.pending}
                                        </span>
                                    </div>
                                    <div className="w-full bg-slate-200/60 h-1.5 rounded-full mt-2 overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full transition-all ${isSelected ? 'bg-brand-orange' : 'bg-brand-blue'}`}
                                            style={{ width: `${Math.min(100, dept.resolutionRate)}%` }}
                                        />
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Filter & Live Search Toolbar */}
                <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs p-4 sm:p-6 space-y-4">
                    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                        
                        {/* Search Input */}
                        <form onSubmit={handleSearchSubmit} className="relative flex-1">
                            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by title, description, location, or keyword..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-24 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-all"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-brand-blue text-white rounded-lg text-xs font-bold hover:bg-blue-600 transition-colors"
                            >
                                Search
                            </button>
                        </form>

                        {/* Reset & Quick Summary */}
                        <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
                            <span className="text-xs font-bold text-slate-500">
                                Showing <strong className="text-slate-900">{sortedComplaints.length}</strong> complaints
                            </span>

                            {(selectedDept !== 'All' || selectedStatus !== 'All' || selectedPriority !== 'All' || searchQuery) && (
                                <button
                                    onClick={handleResetFilters}
                                    className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-xl border border-rose-200 transition-all cursor-pointer"
                                >
                                    <RotateCcw size={12} /> Clear Filters
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Filter Pills Row */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                        {/* Department selector */}
                        <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full">
                            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider shrink-0 mr-1">Dept:</span>
                            {departmentsList.map(d => (
                                <button
                                    key={d}
                                    onClick={() => setSelectedDept(d)}
                                    className={`px-3 py-1 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                                        selectedDept === d
                                            ? 'bg-brand-blue text-white shadow-xs'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                                >
                                    {d}
                                </button>
                            ))}
                        </div>

                        <div className="h-4 w-px bg-slate-200 hidden sm:block mx-1"></div>

                        {/* Status selector */}
                        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider shrink-0 mr-1">Status:</span>
                            {['All', 'Resolved', 'In Progress', 'Pending'].map(s => (
                                <button
                                    key={s}
                                    onClick={() => setSelectedStatus(s)}
                                    className={`px-3 py-1 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                                        selectedStatus === s
                                            ? 'bg-slate-900 text-white shadow-xs'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>

                        <div className="h-4 w-px bg-slate-200 hidden sm:block mx-1"></div>

                        {/* Priority selector */}
                        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider shrink-0 mr-1">Priority:</span>
                            {['All', 'High', 'Medium', 'Low'].map(p => (
                                <button
                                    key={p}
                                    onClick={() => setSelectedPriority(p)}
                                    className={`px-3 py-1 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                                        selectedPriority === p
                                            ? 'bg-amber-600 text-white shadow-xs'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>

                        {/* Sort by dropdown */}
                        <div className="ml-auto flex items-center gap-1.5 text-xs font-bold text-slate-500">
                            <span>Sort:</span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800 text-xs font-bold focus:outline-none"
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="priority">Highest Priority</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Complaint Dossiers Cards List */}
                {loading ? (
                    <div className="py-20 text-center">
                        <div className="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-sm font-bold text-slate-500">Loading civic transparency records...</p>
                    </div>
                ) : error ? (
                    <div className="p-8 text-center bg-red-50 rounded-3xl border border-red-200">
                        <AlertTriangle className="mx-auto text-red-500 mb-2" size={32} />
                        <p className="text-sm font-bold text-red-700">{error}</p>
                        <button 
                            onClick={fetchPublicData}
                            className="mt-4 px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-xl"
                        >
                            Retry
                        </button>
                    </div>
                ) : sortedComplaints.length === 0 ? (
                    <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8">
                        <FileText className="mx-auto text-slate-300 mb-3" size={48} />
                        <h3 className="text-lg font-bold text-slate-800">No grievances match the selected filters</h3>
                        <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                            Try resetting filters or searching for different keywords to view complaints.
                        </p>
                        <button
                            onClick={handleResetFilters}
                            className="mt-4 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
                        >
                            Reset All Filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {sortedComplaints.map((c, index) => {
                            const isResolved = c.status === 'Resolved';
                            const createdDate = c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            }) : 'Recent';

                            return (
                                <motion.div
                                    key={c._id || index}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.25, delay: index * 0.03 }}
                                    className="bg-white rounded-2xl sm:rounded-3xl border border-slate-300 hover:border-slate-400 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
                                >
                                    <div>
                                        {/* Complaint Photo Banner (if available) */}
                                        <div className="relative h-44 sm:h-48 w-full bg-slate-100 overflow-hidden border-b border-slate-200">
                                            {c.imageUrl ? (
                                                <img 
                                                    src={c.imageUrl} 
                                                    alt=""
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = 'none';
                                                    }}
                                                    onClick={() => setActiveImagePreview(c.imageUrl)}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-zoom-in absolute inset-0 z-0"
                                                />
                                            ) : null}
                                            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400 p-4 text-center">
                                                <Building2 size={32} className="opacity-40 mb-1" />
                                                <span className="text-[11px] font-bold">No photo attached</span>
                                            </div>

                                            {/* Status overlay */}
                                            <div className="absolute top-3 left-3">
                                                {getStatusBadge(c.status)}
                                            </div>

                                            {/* Priority overlay */}
                                            <div className="absolute top-3 right-3">
                                                {getPriorityBadge(c.priority)}
                                            </div>

                                            {/* Department chip bottom left */}
                                            <div className="absolute bottom-3 left-3 bg-slate-900/85 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow">
                                                {getDepartmentIcon(c.department, 13, "text-white")}
                                                <span>{c.department || 'General'}</span>
                                            </div>

                                            {/* Resolved Indicator Pill */}
                                            {isResolved && (
                                                <div className="absolute bottom-3 right-3 bg-emerald-600/90 backdrop-blur-md text-white text-[10px] font-black px-2.5 py-1 rounded-lg flex items-center gap-1 shadow">
                                                    <ShieldCheck size={12} /> Resolved
                                                </div>
                                            )}
                                        </div>

                                        {/* Card Body */}
                                        <div className="p-4 sm:p-5 space-y-3">
                                            {/* Title & Category */}
                                            <div>
                                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                                    <span>#{c._id ? c._id.slice(-6).toUpperCase() : 'CIVIC'}</span>
                                                    <span>•</span>
                                                    <span className="text-brand-blue font-black">{c.category || 'Municipal Grievance'}</span>
                                                </div>
                                                <h3 className="text-sm sm:text-base font-black text-slate-900 leading-snug group-hover:text-brand-blue transition-colors line-clamp-2">
                                                    {c.title}
                                                </h3>
                                            </div>

                                            {/* Description snippet */}
                                            <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-3">
                                                {c.text || 'Grievance recorded on citizen municipal register.'}
                                            </p>

                                            {/* Location Pin */}
                                            <div className="flex items-start gap-1.5 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                                <MapPin size={14} className="text-brand-orange shrink-0 mt-0.5" />
                                                <span className="font-semibold truncate">{c.location || 'Location details logged'}</span>
                                            </div>

                                            {/* Resolution Note if resolved */}
                                            {isResolved && c.resolutionNote && (
                                                <div className="bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100 text-[11px] text-emerald-900">
                                                    <p className="font-bold flex items-center gap-1 text-emerald-800">
                                                        <CheckCircle2 size={12} /> Action Taken:
                                                    </p>
                                                    <p className="line-clamp-2 font-medium mt-0.5">{c.resolutionNote}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Card Footer */}
                                    <div className="p-4 sm:p-5 pt-0 border-t border-slate-100/80 mt-2 flex items-center justify-between text-xs text-slate-400">
                                        <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
                                            <Calendar size={12} />
                                            <span>{createdDate}</span>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => setActiveModalComplaint(c)}
                                            className="inline-flex items-center gap-1 font-bold text-xs text-brand-blue hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
                                        >
                                            <Eye size={13} /> View Full Details
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </main>

            {/* FULL DETAIL MODAL: Shows Every Single Detail About Selected Complaint */}
            <AnimatePresence>
                {activeModalComplaint && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto overflow-x-hidden my-auto relative p-5 sm:p-8"
                        >
                            {/* Close button */}
                            <button
                                onClick={() => setActiveModalComplaint(null)}
                                className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                            >
                                <X size={18} />
                            </button>

                            {/* Header */}
                            <div className="pr-10">
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                    {getStatusBadge(activeModalComplaint.status)}
                                    {getPriorityBadge(activeModalComplaint.priority)}
                                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md">
                                        #{activeModalComplaint._id ? activeModalComplaint._id.toUpperCase() : 'CIVIC-REF'}
                                    </span>
                                </div>
                                <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                                    {activeModalComplaint.title}
                                </h2>
                                <p className="text-xs font-bold text-brand-blue uppercase tracking-wider mt-1">
                                    {activeModalComplaint.department} • {activeModalComplaint.category || 'Grievance'}
                                </p>
                            </div>

                            {/* Timeline progression */}
                            <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">Redressal Lifecycle</h4>
                                <div className="flex items-center justify-between text-center relative">
                                    <div className="flex-1">
                                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto text-xs font-black">1</div>
                                        <span className="text-[10px] font-bold text-slate-700 mt-1 block">Registered</span>
                                    </div>
                                    <div className={`h-0.5 flex-1 ${activeModalComplaint.status !== 'Pending' ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
                                    <div className="flex-1">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto text-xs font-black ${
                                            activeModalComplaint.status === 'In Progress' || activeModalComplaint.status === 'Resolved' || activeModalComplaint.status === 'Assigned'
                                                ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-400'
                                        }`}>2</div>
                                        <span className="text-[10px] font-bold text-slate-700 mt-1 block">Assigned / Work</span>
                                    </div>
                                    <div className={`h-0.5 flex-1 ${activeModalComplaint.status === 'Resolved' ? 'bg-emerald-600' : 'bg-slate-200'}`}></div>
                                    <div className="flex-1">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto text-xs font-black ${
                                            activeModalComplaint.status === 'Resolved'
                                                ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-400'
                                        }`}>3</div>
                                        <span className="text-[10px] font-bold text-slate-700 mt-1 block">Resolved</span>
                                    </div>
                                </div>
                            </div>

                            {/* Full statement */}
                            <div className="mt-6 space-y-2">
                                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Grievance Narrative</h4>
                                <p className="text-xs sm:text-sm text-slate-700 bg-slate-50/80 p-4 rounded-2xl border border-slate-100 leading-relaxed font-medium">
                                    {activeModalComplaint.text || activeModalComplaint.title}
                                </p>
                            </div>

                            {/* Location & GPS */}
                            <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-3">
                                <MapPin size={18} className="text-brand-orange shrink-0 mt-0.5" />
                                <div>
                                    <h5 className="text-xs font-bold text-slate-900">Incident Location & Coordinates</h5>
                                    <p className="text-xs text-slate-600 mt-0.5">{activeModalComplaint.location || 'Ward Coordinates Registered'}</p>
                                    {activeModalComplaint.lat && activeModalComplaint.lng && (
                                        <p className="text-[10px] text-slate-400 font-mono mt-1">
                                            GPS: {activeModalComplaint.lat.toFixed(5)}, {activeModalComplaint.lng.toFixed(5)}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Photos: Before & After Resolution */}
                            <div className="mt-6 space-y-3">
                                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Photographic Proof Records</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {/* Before Image */}
                                    <div className="space-y-1.5">
                                        <span className="text-[11px] font-bold text-slate-500">Citizen Evidence Photo:</span>
                                        {activeModalComplaint.imageUrl ? (
                                            <div 
                                                className="relative h-44 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 cursor-zoom-in"
                                                onClick={() => setActiveImagePreview(activeModalComplaint.imageUrl)}
                                            >
                                                <img 
                                                    src={activeModalComplaint.imageUrl} 
                                                    alt="Evidence" 
                                                    className="w-full h-full object-cover hover:scale-105 transition-transform" 
                                                />
                                            </div>
                                        ) : (
                                            <div className="h-44 rounded-2xl border border-dashed border-slate-200 flex items-center justify-center text-xs text-slate-400">
                                                No evidence image attached
                                            </div>
                                        )}
                                    </div>

                                    {/* After Image */}
                                    <div className="space-y-1.5">
                                        <span className="text-[11px] font-bold text-emerald-700">Official Resolution Photo:</span>
                                        {activeModalComplaint.resolutionImageUrl ? (
                                            <div 
                                                className="relative h-44 rounded-2xl overflow-hidden border border-emerald-200 bg-emerald-50 cursor-zoom-in"
                                                onClick={() => setActiveImagePreview(activeModalComplaint.resolutionImageUrl)}
                                            >
                                                <img 
                                                    src={activeModalComplaint.resolutionImageUrl} 
                                                    alt="Resolution Proof" 
                                                    className="w-full h-full object-cover hover:scale-105 transition-transform" 
                                                />
                                            </div>
                                        ) : (
                                            <div className="h-44 rounded-2xl border border-dashed border-slate-200 flex items-center justify-center text-xs text-slate-400">
                                                {activeModalComplaint.status === 'Resolved' ? 'Completed without photo' : 'Pending field resolution'}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Resolution Details Banner if resolved */}
                            {activeModalComplaint.status === 'Resolved' && (
                                <div className="mt-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                                    <div className="flex items-center gap-2 text-emerald-800 font-black text-xs uppercase tracking-wider">
                                        <CheckCircle2 size={16} /> Resolution Verification Certified
                                    </div>
                                    <p className="text-xs text-emerald-950 font-medium leading-relaxed">
                                        {activeModalComplaint.resolutionNote || 'The department has completed the on-site rectification work in accordance with municipal standards.'}
                                    </p>
                                    {activeModalComplaint.resolvedAt && (
                                        <p className="text-[10px] text-emerald-700 font-semibold">
                                            Completed on: {new Date(activeModalComplaint.resolvedAt).toLocaleString('en-IN')}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Close Action */}
                            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
                                <button
                                    onClick={() => setActiveModalComplaint(null)}
                                    className="px-5 py-2.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                                >
                                    Close Details
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* High-Resolution Image Preview Lightbox */}
            <AnimatePresence>
                {activeImagePreview && (
                    <div 
                        className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
                        onClick={() => setActiveImagePreview(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="relative max-w-4xl max-h-[90vh]"
                        >
                            <img 
                                src={activeImagePreview} 
                                alt="High Resolution Preview" 
                                className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl" 
                            />
                            <p className="text-center text-xs text-white/70 mt-2 font-medium">Click anywhere to close preview</p>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default CivicComplaintsHub;

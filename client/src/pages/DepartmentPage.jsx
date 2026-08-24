import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import HotspotMap from '../components/HotspotMap';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import ResolveModal from '../components/ResolveModal';
import toast from 'react-hot-toast';
import { 
    Clock, 
    Building2, 
    TrendingUp, 
    AlertCircle, 
    CheckCircle2, 
    Flame, 
    ShieldAlert, 
    Sparkles, 
    ChevronUp, 
    ChevronDown, 
    MapPin, 
    Award,
    Filter,
    Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DepartmentPage = () => {
    const [allComplaints, setAllComplaints] = useState([]);
    const [deptScores, setDeptScores] = useState([]);
    const [selectedDept, setSelectedDept] = useState('All');
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'trend'
    const [expandedEscalation, setExpandedEscalation] = useState(false);
    const [userLoc, setUserLoc] = useState(null);
    const [resolveModalComplaint, setResolveModalComplaint] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const isAdmin = user?.role === 'admin' || user?.department === 'City Administration';

    const fetchData = async () => {
        try {
            const [deptCompRes, scoresRes] = await Promise.all([
                axios.get('http://localhost:5000/api/complaints/department', {
                    headers: { Authorization: `Bearer ${user.token}` }
                }),
                axios.get('http://localhost:5000/api/complaints/scores', {
                    headers: { Authorization: `Bearer ${user.token}` }
                })
            ]);
            setAllComplaints(deptCompRes.data.data || []);
            setDeptScores(scoresRes.data.data || []);
        } catch (err) {
            toast.error('Failed to sync department feed');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => setUserLoc([pos.coords.latitude, pos.coords.longitude]),
                () => console.log('Location access denied')
            );
        }
    }, [user.token]);

    const handleUpdateStatus = async (id, status) => {
        try {
            await axios.patch(`http://localhost:5000/api/complaints/${id}/status`, { status }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            toast.success(`Ticket updated to ${status}`);
            fetchData();
        } catch (err) {
            toast.error('Failed to update status');
        }
    };

    // Filter complaints based on user role and selection
    const currentDeptFilter = !isAdmin && user.department ? user.department : selectedDept;
    
    const displayComplaints = currentDeptFilter === 'All'
        ? allComplaints
        : allComplaints.filter(c => c.department === currentDeptFilter);

    // Dynamic Real-time Calculations for the Active View
    const totalReported = displayComplaints.length;
    const inProgressCount = displayComplaints.filter(c => c.status === 'In Progress').length;
    const assignedCount = displayComplaints.filter(c => c.status === 'Assigned' || c.status === 'Pending').length;
    const resolvedCount = displayComplaints.filter(c => c.status === 'Resolved').length;

    // Active Department Score Data
    const activeScore = deptScores.find(s => 
        currentDeptFilter !== 'All' 
            ? s.department.toLowerCase().includes(currentDeptFilter.toLowerCase())
            : (user.department ? s.department.toLowerCase().includes(user.department.toLowerCase()) : false)
    ) || {
        department: currentDeptFilter === 'All' ? 'Combined Municipal' : currentDeptFilter,
        performanceScore: totalReported > 0 ? Math.round((resolvedCount / totalReported) * 100) : 100,
        grade: totalReported > 0 && (resolvedCount / totalReported) >= 0.8 ? 'A' : 'B',
        resolutionRate: totalReported > 0 ? Math.round((resolvedCount / totalReported) * 100) : 100,
        slaComplianceRate: 100,
        aiQualityScore: 90,
        badge: 'Live Data'
    };

    const overdueComplaints = displayComplaints.filter(
        c => c.deadline && new Date(c.deadline) < new Date() && c.status !== 'Resolved'
    );

    // K-Means Grouping
    const clusters = displayComplaints.reduce((acc, c) => {
        if (!c.clusterId && c.clusterId !== 0) return acc;
        if (!acc[c.clusterId]) acc[c.clusterId] = [];
        acc[c.clusterId].push(c);
        return acc;
    }, {});

    const departmentList = ['All', 'Sanitation', 'Water Supply', 'Electric Board', 'Public Works', 'Police', 'General'];

    return (
        <div className="min-h-screen pt-32 pb-24 bg-slate-50">
            <div className="container mx-auto px-6">
                {/* Department Header */}
                <header className="mb-10">
                    <div className="flex items-center gap-2 text-brand-orange font-black uppercase text-xs tracking-widest mb-3">
                        <Building2 size={16} /> Official Workforce Terminal
                    </div>
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
                        <div>
                            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
                                {currentDeptFilter === 'All' ? 'Municipal Operations' : currentDeptFilter} <span className="text-brand-orange">Workforce</span>
                            </h1>
                            <p className="text-slate-500 font-medium mt-1">
                                Real-time operational work orders, live status counters, and AI anti-fraud resolution.
                            </p>
                        </div>

                        {/* View Switcher */}
                        <div className="flex gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
                            <button 
                                onClick={() => setViewMode('list')}
                                className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                                    viewMode === 'list' ? 'bg-brand-blue text-white shadow' : 'text-slate-500 hover:text-slate-900'
                                }`}
                            >
                                Work Order Feed
                            </button>
                            <button 
                                onClick={() => setViewMode('trend')}
                                className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                                    viewMode === 'trend' ? 'bg-brand-orange text-white shadow' : 'text-slate-500 hover:text-slate-900'
                                }`}
                            >
                                Hotspot Trends
                            </button>
                        </div>
                    </div>

                    {/* Admin Department Filter Tabs */}
                    {isAdmin && (
                        <div className="flex flex-wrap items-center gap-2 mt-8 pt-6 border-t border-slate-200">
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest mr-2 flex items-center gap-1.5">
                                <Filter size={14} /> Filter Department:
                            </span>
                            {departmentList.map(dept => (
                                <button
                                    key={dept}
                                    onClick={() => setSelectedDept(dept)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                        selectedDept === dept 
                                            ? 'bg-slate-900 text-white shadow-md' 
                                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                                    }`}
                                >
                                    {dept}
                                </button>
                            ))}
                        </div>
                    )}
                </header>

                {/* 📊 REAL STATUS METRICS ROW */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <div className="card-premium p-6 bg-white border border-slate-100 rounded-3xl shadow-sm">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Reported</p>
                        <p className="text-3xl font-black text-slate-900">{totalReported}</p>
                    </div>
                    <div className="card-premium p-6 bg-white border border-amber-100 rounded-3xl shadow-sm">
                        <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">In Progress ⚡</p>
                        <p className="text-3xl font-black text-amber-600">{inProgressCount}</p>
                    </div>
                    <div className="card-premium p-6 bg-white border border-blue-100 rounded-3xl shadow-sm">
                        <p className="text-[10px] font-black text-brand-blue uppercase tracking-widest mb-1">Assigned / Pending ⏳</p>
                        <p className="text-3xl font-black text-brand-blue">{assignedCount}</p>
                    </div>
                    <div className="card-premium p-6 bg-white border border-emerald-100 rounded-3xl shadow-sm">
                        <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Solved & Verified ✅</p>
                        <p className="text-3xl font-black text-emerald-600">{resolvedCount}</p>
                    </div>
                </div>

                {/* Hotspot Map */}
                <div className="mb-12">
                    <HotspotMap complaints={displayComplaints} userLocation={userLoc} />
                </div>

                {/* 🚨 Overdue SLA Emergency Drawer */}
                <div className="mt-8">
                    <AnimatePresence>
                        {overdueComplaints.length > 0 && (
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
                                <div className="card-premium bg-white border border-red-200 rounded-3xl overflow-hidden shadow-xl shadow-red-500/10">
                                    <button 
                                        onClick={() => setExpandedEscalation(!expandedEscalation)} 
                                        className="w-full flex items-center justify-between p-6 bg-red-50/70 hover:bg-red-50 transition-colors"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center text-white">
                                                <AlertCircle size={24} className="animate-pulse" />
                                            </div>
                                            <div className="text-left">
                                                <h3 className="text-lg font-black text-slate-900">SLA Breach Alert</h3>
                                                <p className="text-xs font-bold text-red-600 uppercase tracking-wider">
                                                    {overdueComplaints.length} tickets overdue past turnaround SLA
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-red-700 bg-white px-3 py-1 rounded-full border border-red-200">
                                                Overdue Priority
                                            </span>
                                            {expandedEscalation ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                        </div>
                                    </button>

                                    <AnimatePresence>
                                        {expandedEscalation && (
                                            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="p-8 border-t border-red-100 bg-red-50/20">
                                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                    {overdueComplaints.map(c => (
                                                        <DeptComplaintCard 
                                                            key={`overdue-${c._id}`} 
                                                            c={c} 
                                                            onUpdateStatus={handleUpdateStatus} 
                                                            onOpenResolve={setResolveModalComplaint} 
                                                        />
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Feed View vs Trend View */}
                    {viewMode === 'list' ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {displayComplaints.length > 0 ? (
                                displayComplaints.map(c => (
                                    <DeptComplaintCard 
                                        key={c._id} 
                                        c={c} 
                                        onUpdateStatus={handleUpdateStatus} 
                                        onOpenResolve={setResolveModalComplaint} 
                                    />
                                ))
                            ) : (
                                <div className="col-span-full py-24 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                                    <CheckCircle2 size={48} className="text-slate-300 mx-auto mb-3" />
                                    <h3 className="text-lg font-bold text-slate-700">All Protocols Cleared</h3>
                                    <p className="text-xs text-slate-400 mt-1">No active work orders in this division queue.</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {Object.keys(clusters).length > 0 ? (
                                Object.keys(clusters).map(cid => (
                                    <div key={cid} className="card-premium p-6 bg-white border border-slate-100 rounded-3xl shadow-sm">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="w-12 h-12 bg-orange-100 text-brand-orange rounded-2xl flex items-center justify-center font-bold">
                                                <Flame size={24} />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-black text-slate-900">Hotspot Cluster #{cid}</h3>
                                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{clusters[cid].length} nearby complaints identified</p>
                                            </div>
                                        </div>
                                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {clusters[cid].map(c => (
                                                <DeptComplaintCard 
                                                    key={c._id} 
                                                    c={c} 
                                                    onUpdateStatus={handleUpdateStatus} 
                                                    onOpenResolve={setResolveModalComplaint} 
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">No recurring cluster hotspots detected</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* AI Resolution Modal */}
            <ResolveModal 
                complaint={resolveModalComplaint}
                isOpen={!!resolveModalComplaint}
                onClose={() => setResolveModalComplaint(null)}
                onSuccess={fetchData}
                token={user.token}
            />
        </div>
    );
};

const DeptComplaintCard = ({ c, onUpdateStatus, onOpenResolve }) => {
    const [statusVal, setStatusVal] = useState(c.status);

    const handleApplyStatus = () => {
        if (statusVal === 'Resolved') {
            onOpenResolve(c);
        } else {
            onUpdateStatus(c._id, statusVal);
        }
    };

    return (
        <div className="card-premium p-6 bg-white border border-slate-100 rounded-3xl shadow-md flex flex-col justify-between hover:shadow-xl transition-all">
            <div>
                <div className="flex justify-between items-start mb-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        c.status === 'Resolved' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : 'bg-blue-50 text-brand-blue border border-blue-200'
                    }`}>
                        {c.status}
                    </span>

                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                        c.priority === 'High' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-slate-50 text-slate-500'
                    }`}>
                        {c.priority} Priority
                    </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-3 leading-snug">{c.title}</h3>

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
                    <div className="h-44 rounded-2xl overflow-hidden bg-slate-100 mb-3">
                        <img src={c.imageUrl} alt="Issue evidence" className="w-full h-full object-cover" />
                    </div>
                ) : null}

                {c.fraudAuditFlag && c.status !== 'Resolved' && (
                    <div className="p-3 mb-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 font-medium">
                        ⚠️ <strong>AI Inspection Warning:</strong> Previous closure attempt was rejected due to incomplete resolution.
                    </div>
                )}

                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium truncate mb-4">
                    <MapPin size={14} className="flex-shrink-0" />
                    <span>{c.location || 'Local territory'}</span>
                </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
                {c.deadline && (
                    <div className="flex justify-between items-center text-xs mb-4">
                        <span className="text-slate-400 font-bold uppercase text-[10px]">Deadline</span>
                        <span className={`font-bold ${new Date(c.deadline) < new Date() && c.status !== 'Resolved' ? 'text-red-500' : 'text-slate-700'}`}>
                            {new Date(c.deadline).toLocaleDateString()} {new Date(c.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                )}

                {c.status !== 'Resolved' && (
                    <div className="space-y-2">
                        <div className="flex gap-2">
                            <select 
                                value={statusVal} 
                                onChange={(e) => setStatusVal(e.target.value)}
                                className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none"
                            >
                                <option value="Assigned">Assigned</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Resolved">Resolved (AI Scan)</option>
                            </select>
                            <button 
                                onClick={handleApplyStatus}
                                className="p-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors"
                                title="Update Status"
                            >
                                <CheckCircle2 size={16} />
                            </button>
                        </div>

                        <button 
                            onClick={() => onOpenResolve(c)}
                            className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 transition-all"
                        >
                            <Sparkles size={14} /> Resolve with AI Proof
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DepartmentPage;

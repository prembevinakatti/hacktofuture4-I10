import React from 'react';
import { 
    Award, 
    TrendingUp, 
    ShieldCheck, 
    Clock, 
    AlertTriangle, 
    CheckCircle2, 
    Flame,
    FileText,
    Activity
} from 'lucide-react';

export const DepartmentScoreboard = ({ scores = [], highlightedDept = null, title = "Cross-Department Performance Scoreboard" }) => {
    if (!scores || scores.length === 0) return null;

    return (
        <div className="card-premium p-8 bg-white border border-slate-100 shadow-xl rounded-3xl mb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <div className="flex items-center gap-2 text-brand-orange text-xs font-black uppercase tracking-widest mb-1">
                        <Award size={16} /> Live Municipal Accountability Radar
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h2>
                </div>
                <div className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 font-medium">
                    Formula: <strong>45% Resolution</strong> + <strong>35% On-Time SLA</strong> + <strong>20% AI Quality</strong>
                </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {scores.map((s, idx) => {
                    const isHighlighted = highlightedDept && s.department.toLowerCase().includes(highlightedDept.toLowerCase());
                    const isGradeA = s.grade.startsWith('A');
                    const isGradeB = s.grade === 'B';

                    return (
                        <div 
                            key={s.department}
                            className={`p-6 rounded-3xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                                isHighlighted 
                                    ? 'bg-blue-50/60 border-brand-blue ring-2 ring-brand-blue/30 shadow-xl' 
                                    : 'bg-slate-50/70 border-slate-100 hover:bg-white hover:shadow-lg'
                            }`}
                        >
                            {/* Department Header & Grade */}
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            Rank #{idx + 1}
                                        </span>
                                        <h3 className="text-lg font-black text-slate-900 leading-tight">{s.department}</h3>
                                    </div>
                                    <div className={`px-3 py-1 rounded-xl text-xs font-black shadow-sm ${
                                        isGradeA 
                                            ? 'bg-emerald-500 text-white' 
                                            : isGradeB 
                                                ? 'bg-blue-500 text-white' 
                                                : 'bg-amber-500 text-white'
                                    }`}>
                                        Grade {s.grade}
                                    </div>
                                </div>

                                {/* Score Bar */}
                                <div className="my-3">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <span className="text-xs font-bold text-slate-500">Accountability Score</span>
                                        <span className="text-2xl font-black text-slate-900">
                                            {s.performanceScore}<span className="text-xs text-slate-400 font-bold">/100</span>
                                        </span>
                                    </div>
                                    <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full transition-all duration-1000 ${
                                                isGradeA 
                                                    ? 'bg-emerald-500' 
                                                    : isGradeB 
                                                        ? 'bg-brand-blue' 
                                                        : 'bg-amber-500'
                                            }`}
                                            style={{ width: `${s.performanceScore}%` }}
                                        />
                                    </div>
                                </div>

                                {/* 📊 REAL COUNTS: Total Reported, In Progress, Assigned, Resolved */}
                                <div className="grid grid-cols-4 gap-1.5 pt-3 pb-2 my-2 text-center bg-white/80 rounded-2xl border border-slate-200/60 p-2 shadow-xs">
                                    <div>
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider">Reported</p>
                                        <p className="text-sm font-black text-slate-900">{s.total}</p>
                                    </div>
                                    <div>
                                        <p className="text-[8px] font-black text-amber-500 uppercase tracking-wider">In Progress</p>
                                        <p className="text-sm font-black text-amber-600">{s.inProgress}</p>
                                    </div>
                                    <div>
                                        <p className="text-[8px] font-black text-blue-500 uppercase tracking-wider">Assigned</p>
                                        <p className="text-sm font-black text-blue-600">{s.assigned}</p>
                                    </div>
                                    <div>
                                        <p className="text-[8px] font-black text-emerald-500 uppercase tracking-wider">Solved</p>
                                        <p className="text-sm font-black text-emerald-600">{s.resolved}</p>
                                    </div>
                                </div>

                                {/* 📈 RATES BREAKDOWN */}
                                <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                                    <div className="p-2 bg-white rounded-xl border border-slate-100">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Resolution</p>
                                        <p className="text-xs font-black text-slate-800">{s.resolutionRate}%</p>
                                    </div>
                                    <div className="p-2 bg-white rounded-xl border border-slate-100">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">SLA On-Time</p>
                                        <p className="text-xs font-black text-slate-800">{s.slaComplianceRate}%</p>
                                    </div>
                                    <div className="p-2 bg-white rounded-xl border border-slate-100">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">AI Quality</p>
                                        <p className="text-xs font-black text-slate-800">{s.aiQualityScore}%</p>
                                    </div>
                                </div>
                            </div>

                            {/* Badge */}
                            <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-bold">
                                <span className="text-slate-400">{s.auditFlagsCount > 0 ? `⚠️ ${s.auditFlagsCount} Audit Flag` : '✓ 0 Audit Flags'}</span>
                                <span className="text-brand-blue bg-blue-50 px-2 py-0.5 rounded-md text-[10px]">
                                    {s.badge}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DepartmentScoreboard;

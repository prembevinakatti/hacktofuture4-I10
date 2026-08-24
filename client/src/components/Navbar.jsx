import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Trophy, LogIn, UserPlus } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="nav-blur relative z-[100]">
            <div className="container mx-auto px-6 h-20 flex justify-between items-center">
                <Link to="/" className="flex items-center gap-3 group">
                    <img 
                        src="/JanSetuLogo.jpeg" 
                        alt="JanSetu Logo" 
                        className="w-12 h-12 object-contain rounded-xl shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform"
                    />
                    <span className="font-black text-2xl tracking-tighter text-slate-900">
                        Jan<span className="text-brand-orange">Setu</span>
                    </span>
                </Link>

                <div className="flex items-center gap-6">
                    {user ? (
                        <>
                            {user.role === 'citizen' ? (
                                <>
                                    <Link to="/citizen" className="nav-link font-bold">My Portal</Link>
                                    <Link to="/report" className="nav-link font-bold">Raise Report</Link>
                                    <Link to="/rewards" className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-brand-orange rounded-xl font-bold border border-orange-100 hover:bg-orange-100 transition-colors">
                                        <Trophy size={18} /> {user.rewardPoints} Pts
                                    </Link>
                                </>
                            ) : user.role === 'admin' ? (
                                <>
                                    <Link to="/admin" className="nav-link font-bold">Admin Portal</Link>
                                    <Link to="/department" className="nav-link font-bold">Department Feed</Link>
                                </>
                            ) : (
                                <>
                                    <Link to="/department" className="nav-link font-bold">Department Feed</Link>
                                    <Link to="/home" className="nav-link font-bold">Overview</Link>
                                </>
                            )}
                            <div className="h-6 w-px bg-slate-200 mx-2"></div>
                            <button 
                                onClick={handleLogout}
                                className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                            >
                                <LogOut size={20} />
                            </button>
                        </>
                    ) : (
                        <div className="flex items-center gap-2 sm:gap-3">
                            <Link to="/login" className="flex items-center gap-1.5 px-3 py-2 text-xs text-slate-700 font-bold hover:text-brand-blue transition-colors">
                                <LogIn size={15} /> Citizen Login
                            </Link>
                            <Link to="/department/login" className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-500/10 text-amber-600 border border-amber-500/30 rounded-xl text-xs font-bold hover:bg-amber-500/20 shadow-sm transition-all">
                                🏢 Department Portal
                            </Link>
                            <Link to="/admin/login" className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 shadow transition-all">
                                🏛️ Super Admin
                            </Link>
                            <Link to="/register" className="flex items-center gap-1.5 px-4 py-2 bg-brand-blue text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all">
                                <UserPlus size={15} /> Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

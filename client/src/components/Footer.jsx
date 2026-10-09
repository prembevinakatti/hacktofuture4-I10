import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Mail, Phone, MapPin, Globe2, Zap, Layout } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white text-slate-700 border-t border-slate-200/90 pt-12 sm:pt-16 pb-20 sm:pb-10">
            <div className="container mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 mb-10 sm:mb-14">
                    <div className="col-span-1 sm:col-span-2">
                        <Link to="/" className="flex items-center gap-2.5 mb-4 sm:mb-5">
                            <img src="/JanSetuLogo.jpeg" alt="JanSetu" className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl shadow-xs" />
                            <span className="text-xl sm:text-2xl font-black tracking-tighter text-slate-900">Jan<span className="text-brand-orange">Setu</span></span>
                        </Link>
                        <p className="text-slate-500 max-w-sm mb-5 text-xs sm:text-sm font-medium leading-relaxed">
                            Empowering citizens through transparent governance and AI-driven civic reporting. Built for the smart cities of tomorrow.
                        </p>
                        <div className="flex gap-2.5">
                            {[Globe2, Zap, Layout].map((Icon, i) => (
                                <a key={i} href="#" className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-600 hover:bg-brand-blue hover:text-white hover:border-brand-blue transition-colors">
                                    <Icon size={16} />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm sm:text-base font-black text-slate-900 mb-3 sm:mb-5">Quick Links</h4>
                        <ul className="space-y-2 sm:space-y-2.5 text-xs sm:text-sm text-slate-600 font-medium">
                            <li><Link to="/login" className="hover:text-brand-blue transition-colors">Citizen Login</Link></li>
                            <li><Link to="/register" className="hover:text-brand-blue transition-colors">Sign Up</Link></li>
                            <li><Link to="/report" className="hover:text-brand-blue transition-colors">Raise Grievance</Link></li>
                            <li><Link to="/complaints" className="hover:text-brand-blue transition-colors">All Complaints Hub</Link></li>
                            <li><Link to="/department/login" className="hover:text-brand-blue transition-colors">Department Portal</Link></li>
                            <li><Link to="/admin/login" className="hover:text-brand-blue transition-colors">Super Admin</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm sm:text-base font-black text-slate-900 mb-3 sm:mb-5">Contact Us</h4>
                        <ul className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm text-slate-600 font-medium">
                            <li className="flex items-center gap-2"><Mail size={15} className="text-brand-blue flex-shrink-0" /> support@jansetu.city</li>
                            <li className="flex items-center gap-2"><Phone size={15} className="text-brand-orange flex-shrink-0" /> +91 (800) 123-4567</li>
                            <li className="flex items-center gap-2"><MapPin size={15} className="text-brand-blue flex-shrink-0" /> City Hall, Digital Plaza, Mangalore</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-200 pt-6 sm:pt-8 text-center text-slate-400 font-bold text-[11px] sm:text-xs uppercase tracking-wider">
                    <p>&copy; {new Date().getFullYear()} JanSetu Smart City Platform. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

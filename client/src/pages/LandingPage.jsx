import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { 
    Zap, 
    ShieldCheck, 
    Users, 
    ArrowRight, 
    CheckCircle2, 
    BarChart3, 
    Globe2,
    Building2,
    MapPin,
    ShieldAlert,
    Trash2,
    Droplets,
    Wrench,
    Shield,
    Layers,
    Award,
    Activity,
    PhoneCall,
    Send,
    Eye
} from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-white text-slate-900 selection:bg-brand-blue/20 overflow-x-hidden pb-16 sm:pb-0">

      {/* Top Civic Authority Ribbon */}
      <div className="bg-slate-900 text-slate-200 text-[10px] sm:text-xs py-2 px-4 sm:px-6 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-center items-center gap-1.5 sm:gap-2 text-center sm:text-left">
            <div className="flex items-center gap-2 font-medium">
                <span className="flex h-2 w-2 relative flex-shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="font-semibold text-white truncate">Smart Cities Mission</span>  • National AI Civic Redressal Matrix
            </div>
            
        </div>
      </div>

      {/* Hero Section - Compact container so full image is visible comfortably */}
      <section className="relative pt-2 pb-6 sm:pt-4 sm:pb-8 overflow-hidden bg-gradient-to-b from-slate-50/80 via-white to-slate-50/40">
        <div className="max-w-4xl xl:max-w-[820px] mx-auto px-3 sm:px-4 relative z-10">
          
          {/* Enhanced Crystal-Clear Banner Container (Reduced size for optimal viewport fit) */}
          <motion.div 
            className="relative w-full max-w-[780px] mx-auto rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border-2 sm:border-4 border-white bg-slate-900 group"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {/* The Enhanced Cleared Image */}
            <img
              src="/hero_bharat.png?v=3"
              alt="JanSetu: Your Voice Builds A Better Bharat - AI-Powered Smart City Platform"
              className="w-full h-auto object-cover block select-none"
              style={{
                imageRendering: "-webkit-optimize-contrast",
                transform: "translateZ(0)",
                backfaceVisibility: "hidden"
              }}
            />

            {/* Desktop & Tablet Interactive Hotspots over the Banner Buttons */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Hotspot 1: 'Report a Civic Issue ->' */}
              <button
                onClick={() => navigate('/report')}
                aria-label="Report a Civic Issue"
                title="Report a Civic Issue"
                className="pointer-events-auto absolute cursor-pointer rounded-xl transition-all duration-200 hover:ring-4 hover:ring-amber-500/40 hover:scale-[1.02] active:scale-95 bg-transparent"
                style={{
                  left: "7.7%",
                  top: "50.8%",
                  width: "16.8%",
                  height: "6.8%"
                }}
              />

              {/* Hotspot 2: 'Track Your Complaint' */}
              <button
                onClick={() => navigate('/citizen')}
                aria-label="Track Your Complaint"
                title="Track Your Complaint"
                className="pointer-events-auto absolute cursor-pointer rounded-xl transition-all duration-200 hover:ring-4 hover:ring-blue-500/40 hover:scale-[1.02] active:scale-95 bg-transparent"
                style={{
                  left: "25.2%",
                  top: "50.8%",
                  width: "17.0%",
                  height: "6.8%"
                }}
              />

              {/* Hotspot 3: 'Report Issue' camera card on right */}
              <button
                onClick={() => navigate('/report')}
                aria-label="Report Civic Issue with Photo"
                title="Report Issue with Photo"
                className="pointer-events-auto absolute cursor-pointer rounded-2xl transition-all duration-200 hover:ring-4 hover:ring-emerald-500/40 hover:scale-[1.03] active:scale-95 bg-transparent"
                style={{
                  left: "63.8%",
                  top: "41.5%",
                  width: "11.2%",
                  height: "17.5%"
                }}
              />
            </div>
          </motion.div>

          {/* Quick Action Navigation Bar - 5 Unique Colors in One Line */}
          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-md">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-2.5 items-center w-full">
              {/* Button 1: Raise a Grievance (Vibrant Orange) */}
              <button
                onClick={() => navigate('/report')}
                className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm shadow-sm active:scale-95 transition-all whitespace-nowrap cursor-pointer"
              >
                <Send size={15} /> <span>Raise a Grievance</span>
              </button>

              {/* Button 2: Track Complaint (Royal Blue) */}
              <button
                onClick={() => navigate('/citizen')}
                className="flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm shadow-sm active:scale-95 transition-all whitespace-nowrap cursor-pointer"
              >
                <ShieldCheck size={15} /> <span>Track Complaint</span>
              </button>

              {/* Button 3: All Complaints Hub (Teal / Emerald) */}
              <button
                onClick={() => navigate('/complaints')}
                className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm shadow-sm active:scale-95 transition-all whitespace-nowrap cursor-pointer"
              >
                <Eye size={15} /> <span>All Complaints Hub</span>
              </button>

              {/* Button 4: Department Login (Purple / Violet) */}
              <button
                onClick={() => navigate('/department/login')}
                className="flex items-center justify-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm shadow-sm active:scale-95 transition-all whitespace-nowrap cursor-pointer"
              >
                <Building2 size={15} /> <span>Department Login</span>
              </button>

              {/* Button 5: Admin Portal (Deep Slate / Black) */}
              <button
                onClick={() => navigate('/admin/login')}
                className="col-span-2 sm:col-span-1 flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-black text-white px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm shadow-sm active:scale-95 transition-all whitespace-nowrap cursor-pointer"
              >
                <Users size={15} /> <span>Admin Portal</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Department Grid Banner */}
      <section className="py-6 sm:py-8 bg-white border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <p className="text-center text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-4 sm:mb-6">
                Connected Municipal Line Departments
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 sm:gap-4">
                {[
                    { name: 'Sanitation', icon: Trash2, color: 'border-amber-200 bg-amber-50/60 text-amber-700' },
                    { name: 'Water Supply', icon: Droplets, color: 'border-blue-200 bg-blue-50/60 text-blue-700' },
                    { name: 'Public Works', icon: Wrench, color: 'border-emerald-200 bg-emerald-50/60 text-emerald-700' },
                    { name: 'Electric Board', icon: Zap, color: 'border-purple-200 bg-purple-50/60 text-purple-700' },
                    { name: 'City Police', icon: Shield, color: 'border-slate-300 bg-slate-50 text-slate-800' },
                    { name: 'Administration', icon: Building2, color: 'border-orange-200 bg-orange-50/60 text-orange-700' },
                ].map((d) => {
                    const IconComp = d.icon;
                    return (
                        <div key={d.name} className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border ${d.color} flex flex-col items-center justify-center text-center shadow-xs transition-all hover:shadow-sm`}>
                            <IconComp size={24} className="mb-2" />
                            <span className="text-[11px] sm:text-xs font-black">{d.name}</span>
                        </div>
                    );
                })}
            </div>
        </div>
      </section>

      {/* Core Platform Capabilities - Dark Blue/Slate matching theme */}
      <section className="py-14 sm:py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-brand-blue/15 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-3">
                Engineered for High-Accountability Redressal
            </h2>
            <p className="text-xs sm:text-base text-slate-300 font-medium max-w-2xl mx-auto">
                Real-time grievance lifecycle orchestration powered by state-of-the-art AI analysis and transparent departmental scoreboards.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {/* Feature 1 */}
            <motion.div
              className="p-6 sm:p-8 bg-slate-800/80 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-slate-700/80 shadow-xl hover:border-slate-500 hover:bg-slate-800 transition-all group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform shadow-inner">
                <Zap size={24} />
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white mb-2 sm:mb-3">AI Triaging & SLA Allocation</h3>
              <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                Neural Groq engine processes grievance titles, assigns exact municipal divisions, computes severity matrices, and initiates automated countdown deadlines.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              className="p-6 sm:p-8 bg-slate-800/80 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-slate-700/80 shadow-xl hover:border-slate-500 hover:bg-slate-800 transition-all group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform shadow-inner">
                <BarChart3 size={24} />
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white mb-2 sm:mb-3">
                Geospatial Hotspot Map
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                Unsupervised K-Means clustering aggregates localized complaint spikes across wards, equipping commissioners with predictive crisis radar.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              className="p-6 sm:p-8 bg-slate-800/80 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-slate-700/80 shadow-xl hover:border-slate-500 hover:bg-slate-800 transition-all group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform shadow-inner">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white mb-2 sm:mb-3">AI Anti-Fraud Audit</h3>
              <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                Officers must upload photographic proof of work. Computer vision inspects before-and-after evidence to reject incomplete fixes and flag fraudulent closures.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4-Step Governance Flow */}
      <section className="py-14 sm:py-20 bg-white border-t border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2">
                How JanSetu Operates
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-xl mx-auto">
                A transparent 4-stage pipeline connecting citizen awareness to municipal field resolution.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
                { step: "01", title: "Citizen Submission", desc: "Report via Web Portal or Mobile PWA with auto-detected full GPS address & photo.", icon: Send, color: "text-blue-600 bg-blue-50 border-blue-200" },
                { step: "02", title: "Smart Triage & Routing", desc: "Automated routing classifies category, determines SLA deadline, and dispatches ticket.", icon: Layers, color: "text-amber-600 bg-amber-50 border-amber-200" },
                { step: "03", title: "Field Action", desc: "Department engineers execute on-ground repair and upload resolution proof photo.", icon: Building2, color: "text-indigo-600 bg-indigo-50 border-indigo-200" },
                { step: "04", title: "Resolution Audit", desc: "Digital verification inspects work quality, awards citizen reward points, and archives report.", icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
            ].map((s, index) => {
              const IconComp = s.icon;
              return (
                <div key={index} className="p-5 sm:p-6 bg-slate-50/70 rounded-2xl sm:rounded-3xl border border-slate-200 hover:bg-white hover:shadow-md transition-all relative">
                    <div className="flex justify-between items-start mb-3 sm:mb-4">
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl ${s.color} border flex items-center justify-center font-bold shadow-xs`}>
                            <IconComp size={20} />
                        </div>
                        <span className="text-xl sm:text-2xl font-black text-slate-300">
                            {s.step}
                        </span>
                    </div>
                    <h4 className="text-sm sm:text-base font-black text-slate-900 mb-1.5">{s.title}</h4>
                    <p className="text-[11px] sm:text-xs text-slate-500 font-medium leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-14 sm:py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-brand-blue/10 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4 sm:mb-6">
            Empower Your City with Real-Time Civic Accountability
          </h2>

          <p className="text-xs sm:text-base text-slate-300 font-medium max-w-2xl mx-auto mb-8 sm:mb-10">
            Join thousands of citizens and municipal officers collaborating to build cleaner, safer, and smarter urban infrastructure.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button
                onClick={() => navigate('/report')}
                className="px-6 sm:px-8 py-3.5 sm:py-4 bg-brand-orange hover:bg-orange-600 text-white rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider shadow-xl shadow-orange-500/20 active:scale-95 transition-all w-full sm:w-auto"
            >
                Raise a Grievance Now
            </button>
            <button
                onClick={() => navigate('/department/register')}
                className="px-6 sm:px-8 py-3.5 sm:py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider border border-slate-700 shadow-md active:scale-95 transition-all w-full sm:w-auto"
            >
                Register as Department Officer
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;

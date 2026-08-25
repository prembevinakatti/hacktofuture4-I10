import React, { useState } from 'react';
import { PhoneCall, Sparkles, Mic } from 'lucide-react';
import { motion } from 'framer-motion';
import VoiceCallModal from './VoiceCallModal';

export default function VoiceCallButton({ className = "", isMobile = false }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`relative inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/40 border border-emerald-400/40 transition-all duration-200 cursor-pointer active:scale-95 ${className}`}
        title="Start AI Voice Helpline Call"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-80"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-200"></span>
        </span>
        <PhoneCall className="w-3.5 h-3.5 text-white" />
        <span className="whitespace-nowrap">AI Voice Call</span>
      </button>

      <VoiceCallModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX, Sparkles, CheckCircle2, AlertTriangle, ShieldCheck, MapPin, Building2, Clock, Radio, PhoneForwarded, Send, RefreshCw } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function VoiceCallModal({ isOpen, onClose }) {
  const [callMode, setCallMode] = useState('BROWSER'); // 'BROWSER' | 'PHONE'
  const [callStatus, setCallStatus] = useState('IDLE'); // 'IDLE' | 'CONNECTING' | 'LISTENING' | 'THINKING' | 'SPEAKING' | 'COMPLETED'
  const [phoneNumberInput, setPhoneNumberInput] = useState('+918660465213');
  const [isCallingPhone, setIsCallingPhone] = useState(false);
  const [transcript, setTranscript] = useState([]);
  const [currentSpeech, setCurrentSpeech] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerMuted, setIsSpeakerMuted] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [registeredComplaint, setRegisteredComplaint] = useState(null);
  const [manualText, setManualText] = useState('');
  const [callDuration, setCallDuration] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0); // 0 to 100 for visualizer

  // Synchronization refs for callbacks and event handlers
  const callStatusRef = useRef(callStatus);
  const isMutedRef = useRef(isMuted);
  const isSpeakerMutedRef = useRef(isSpeakerMuted);
  const sessionIdRef = useRef(sessionId);
  const currentSpeechRef = useRef('');
  const silenceTimerRef = useRef(null);
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);
  const scrollRef = useRef(null);
  const micStreamRef = useRef(null);
  const audioContextRef = useRef(null);
  const animFrameRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Keep refs in sync with state
  useEffect(() => { callStatusRef.current = callStatus; }, [callStatus]);
  useEffect(() => { isMutedRef.current = isMuted; }, [isMuted]);
  useEffect(() => { isSpeakerMutedRef.current = isSpeakerMuted; }, [isSpeakerMuted]);
  useEffect(() => { sessionIdRef.current = sessionId; }, [sessionId]);

  // Audio level visualizer analyzer
  const startAudioAnalyzer = (stream) => {
    try {
      if (!window.AudioContext && !window.webkitAudioContext) return;
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }

      const ctx = audioContextRef.current;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.5;
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateVolume = () => {
        if (!isOpen) return;
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const avg = sum / bufferLength;
        const normalized = Math.min(100, Math.round((avg / 128) * 100));
        setAudioLevel(normalized);
        animFrameRef.current = requestAnimationFrame(updateVolume);
      };
      updateVolume();
    } catch (err) {
      console.warn('Audio analyzer init error:', err);
    }
  };

  const stopAudioAnalyzer = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(track => track.stop());
      micStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try { audioContextRef.current.close(); } catch (e) {}
      audioContextRef.current = null;
    }
    setAudioLevel(0);
  };

  // Initialize session ID when opened
  useEffect(() => {
    if (isOpen) {
      const newSession = `web_call_${Date.now()}`;
      setSessionId(newSession);
      sessionIdRef.current = newSession;
      setTranscript([]);
      setCurrentSpeech('');
      currentSpeechRef.current = '';
      setRegisteredComplaint(null);
      setCallDuration(0);
      if (callMode === 'BROWSER') {
        startCall(newSession);
      }
    } else {
      endCall();
    }
    return () => {
      endCall();
    };
  }, [isOpen]);

  // Scroll transcript to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcript, currentSpeech]);

  // Duration Timer
  useEffect(() => {
    if (callStatus !== 'IDLE' && callStatus !== 'COMPLETED') {
      timerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [callStatus]);

  // Format Duration seconds
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Text-To-Speech Output
  const speakVoice = useCallback((text, callback) => {
    // Stop any speech recognition while speaking to avoid feedback loop
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }

    if (isSpeakerMutedRef.current || typeof window === 'undefined' || !window.speechSynthesis) {
      if (callback) callback();
      return;
    }

    try {
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume();
    } catch (e) {}

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => (v.lang && (v.lang.includes('IN') || v.lang.includes('hi')))) ||
      voices.find(v => v.name && (v.name.includes('India') || v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Aditi') || v.name.includes('Rishi'))) ||
      voices.find(v => v.lang && v.lang.startsWith('en')) ||
      voices[0];

    if (preferredVoice) utterance.voice = preferredVoice;

    setCallStatus('SPEAKING');

    let callbackFired = false;
    const safeCallback = () => {
      if (!callbackFired) {
        callbackFired = true;
        if (callback) callback();
      }
    };

    utterance.onend = () => {
      setTimeout(safeCallback, 250);
    };

    utterance.onerror = (e) => {
      if (e.error !== 'interrupted' && e.error !== 'canceled') {
        console.warn('TTS Utterance Event:', e.error);
      }
      safeCallback();
    };

    // Safety timeout in case browser TTS drops onend
    const wordCount = (text || '').split(' ').length;
    const maxSpeechDurationMs = Math.max(4000, (wordCount / 2.0) * 1000 + 2500);
    const safetyTimer = setTimeout(() => {
      safeCallback();
    }, maxSpeechDurationMs);

    utterance.addEventListener('end', () => clearTimeout(safetyTimer));

    window.speechSynthesis.speak(utterance);
  }, []);

  // Send message to AI Backend
  const handleUserSpokenMessage = useCallback(async (userText) => {
    if (!userText || !userText.trim()) return;

    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }

    const cleanText = userText.trim();
    currentSpeechRef.current = '';
    setCurrentSpeech('');
    setTranscript(prev => [...prev, { role: 'user', text: cleanText, time: new Date().toLocaleTimeString() }]);
    setCallStatus('THINKING');

    try {
      const response = await axios.post('http://localhost:5000/api/voice/web-agent', {
        message: cleanText,
        sessionId: sessionIdRef.current,
        callerPhone: phoneNumberInput || '+918660465213'
      });

      const { spokenReply, isFinished, complaint } = response.data;

      setTranscript(prev => [...prev, { role: 'agent', text: spokenReply, time: new Date().toLocaleTimeString() }]);

      if (isFinished && complaint) {
        setRegisteredComplaint(complaint);
        speakVoice(spokenReply, () => {
          setCallStatus('COMPLETED');
          toast.success(`Complaint #${complaint._id.toString().slice(-6)} Registered Successfully!`);
        });
      } else {
        speakVoice(spokenReply, () => {
          listenForUser();
        });
      }
    } catch (err) {
      console.error('Call processing failed:', err);
      const errReply = "I am processing your grievance report. Please describe the location and issue clearly.";
      setTranscript(prev => [...prev, { role: 'agent', text: errReply, time: new Date().toLocaleTimeString() }]);
      speakVoice(errReply, () => {
        listenForUser();
      });
    }
  }, [phoneNumberInput, speakVoice]);

  // Start Speech Recognition
  const initSpeechRecognition = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('Web Speech Recognition not supported in this browser.');
      return null;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-IN';

      recognition.onstart = () => {
        setCallStatus('LISTENING');
      };

      recognition.onresult = (event) => {
        let interim = '';
        let final = '';
        for (let i = 0; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript + ' ';
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        const fullTranscript = (final + interim).trim();
        setCurrentSpeech(fullTranscript);
        currentSpeechRef.current = fullTranscript;

        // Auto-submit after 2.0s of silence if meaningful text captured
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        if (fullTranscript.length >= 3) {
          silenceTimerRef.current = setTimeout(() => {
            if (currentSpeechRef.current && currentSpeechRef.current.trim().length >= 3) {
              handleUserSpokenMessage(currentSpeechRef.current.trim());
            }
          }, 2000);
        }
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition status:', event.error);
        if (event.error === 'not-allowed') {
          toast.error('Microphone access blocked. Please allow microphone permissions in your browser URL bar.');
        } else if (event.error === 'network') {
          startDirectAudioCapture();
        }
      };

      recognition.onend = () => {
        // If user finished speaking and has pending text, submit
        if (currentSpeechRef.current && currentSpeechRef.current.trim().length >= 3) {
          handleUserSpokenMessage(currentSpeechRef.current.trim());
          return;
        }

        // If we are still in listening state and not muted, seamlessly restart
        if (callStatusRef.current === 'LISTENING' && !isMutedRef.current) {
          setTimeout(() => {
            if (callStatusRef.current === 'LISTENING' && !isMutedRef.current && recognitionRef.current) {
              try {
                recognitionRef.current.start();
              } catch (e) {
                // Ignore if already active
              }
            }
          }, 300);
        }
      };

      return recognition;
    } catch (err) {
      console.warn('Speech recognition init failed:', err);
      return null;
    }
  }, [handleUserSpokenMessage]);

  // Direct Audio MediaRecorder Fallback (Brave / Safari / Universal)
  const startDirectAudioCapture = async () => {
    if (isMutedRef.current) return;
    try {
      let stream = micStreamRef.current;
      if (!stream || !stream.active) {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        micStreamRef.current = stream;
        startAudioAnalyzer(stream);
      }

      audioChunksRef.current = [];
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : (MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4');

      const recorder = new MediaRecorder(stream, { mimeType });

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = async () => {
        if (audioChunksRef.current.length > 0) {
          const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
          await sendAudioToBackend(audioBlob, mimeType);
        }
      };

      mediaRecorderRef.current = recorder;
      recorder.start(500);
      setCallStatus('LISTENING');
    } catch (err) {
      console.warn('Direct audio capture failed:', err);
    }
  };

  const stopDirectAudioCapture = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {}
    }
  };

  const sendAudioToBackend = async (blob, mimeType) => {
    setCallStatus('THINKING');
    try {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64Audio = reader.result;
        try {
          const response = await axios.post('http://localhost:5000/api/voice/web-agent-audio', {
            audioBase64: base64Audio,
            mimeType,
            sessionId: sessionIdRef.current,
            callerPhone: phoneNumberInput || '+918660465213'
          });

          const { transcribedText, spokenReply, isFinished, complaint } = response.data;
          
          if (transcribedText && transcribedText.trim()) {
            setTranscript(prev => [...prev, { role: 'user', text: transcribedText, time: new Date().toLocaleTimeString() }]);
          }

          setTranscript(prev => [...prev, { role: 'agent', text: spokenReply, time: new Date().toLocaleTimeString() }]);

          if (isFinished && complaint) {
            setRegisteredComplaint(complaint);
            speakVoice(spokenReply, () => {
              setCallStatus('COMPLETED');
              toast.success(`Complaint #${complaint._id.toString().slice(-6)} Registered!`);
            });
          } else {
            speakVoice(spokenReply, () => {
              listenForUser();
            });
          }
        } catch (apiErr) {
          console.error('Audio processing failed:', apiErr);
          const errReply = "I could not process the voice stream. Please describe your civic issue and landmark.";
          setTranscript(prev => [...prev, { role: 'agent', text: errReply, time: new Date().toLocaleTimeString() }]);
          speakVoice(errReply, () => {
            listenForUser();
          });
        }
      };
    } catch (err) {
      console.error('Failed to encode audio:', err);
      setCallStatus('LISTENING');
    }
  };

  // Listen for user speech
  const listenForUser = useCallback(() => {
    if (isMutedRef.current) return;
    try {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      currentSpeechRef.current = '';
      setCurrentSpeech('');
      
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }

      const rec = initSpeechRecognition();
      recognitionRef.current = rec;

      if (rec) {
        try {
          rec.start();
        } catch (e) {
          startDirectAudioCapture();
        }
      } else {
        startDirectAudioCapture();
      }
    } catch (e) {
      startDirectAudioCapture();
    }
  }, [initSpeechRecognition]);

  // Start Call Flow
  const startCall = async (activeSession) => {
    setCallStatus('CONNECTING');
    
    // Explicitly request microphone stream and start visualizer
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        micStreamRef.current = stream;
        startAudioAnalyzer(stream);
      }
    } catch (micErr) {
      console.warn('Microphone permission request:', micErr);
    }
    
    const greetingText = "Namaste! Welcome to JanSetu Smart City Grievance Helpline. Please describe the civic issue you want to report, along with your location or landmark.";
    
    setTimeout(() => {
      setTranscript([{ role: 'agent', text: greetingText, time: new Date().toLocaleTimeString() }]);
      speakVoice(greetingText, () => {
        listenForUser();
      });
    }, 500);
  };

  // Trigger Outbound AI Call to user phone
  const handleRequestPhoneCall = async (e) => {
    e.preventDefault();
    if (!phoneNumberInput || phoneNumberInput.trim().length < 10) {
      return toast.error('Please enter a valid phone number (e.g. +918660465213)');
    }

    setIsCallingPhone(true);
    const callToast = toast.loading(`Triggering JanSetu AI Voice Call to ${phoneNumberInput}...`);

    try {
      const res = await axios.post('http://localhost:5000/api/voice/call-user', {
        phoneNumber: phoneNumberInput.trim()
      });

      if (res.data.success) {
        toast.success(`📞 JanSetu is calling your phone now! Please pick up the call.`, { id: callToast, duration: 8000 });
      } else {
        toast.error(res.data.message || 'Call failed', { id: callToast });
      }
    } catch (err) {
      console.error('Outbound call failed:', err);
      toast.error(err.response?.data?.message || 'Failed to place call. Check server logs.', { id: callToast, duration: 6000 });
    } finally {
      setIsCallingPhone(false);
    }
  };

  // Handle Manual Fallback Input
  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualText.trim()) return;
    const text = manualText;
    setManualText('');
    handleUserSpokenMessage(text);
  };

  // End Call
  const endCall = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }
    stopDirectAudioCapture();
    stopAudioAnalyzer();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try { window.speechSynthesis.cancel(); } catch (e) {}
    }
    setCallStatus('IDLE');
  };

  if (!isOpen) return null;

  const modalContent = (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col h-[88vh] max-h-[640px]"
        >
          {/* Header */}
          <div className="px-5 py-3.5 bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-slate-900 border-b border-slate-800 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex-shrink-0">
                <Radio className="w-5 h-5 animate-pulse" />
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  JanSetu AI Voice Helpline
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-medium border border-blue-500/30">
                    Live Agent
                  </span>
                </h3>
                <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                  <Clock className="w-3 h-3 text-blue-400" />
                  Call Duration: <span className="font-mono text-emerald-400 font-semibold">{formatTime(callDuration)}</span>
                </p>
              </div>
            </div>

            {/* Speaker Mute & Close */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSpeakerMuted(!isSpeakerMuted)}
                className={`p-2 rounded-xl border transition ${
                  isSpeakerMuted
                    ? 'bg-red-500/20 border-red-500/40 text-red-400'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}
                title={isSpeakerMuted ? "Unmute AI Voice" : "Mute AI Voice"}
              >
                {isSpeakerMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => { endCall(); onClose(); }}
                className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700 transition"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex bg-slate-950 px-4 py-2 border-b border-slate-800 gap-2 flex-shrink-0">
            <button
              onClick={() => {
                if (callMode !== 'BROWSER') {
                  setCallMode('BROWSER');
                  const newSession = `web_call_${Date.now()}`;
                  setSessionId(newSession);
                  sessionIdRef.current = newSession;
                  setTranscript([]);
                  startCall(newSession);
                }
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition ${
                callMode === 'BROWSER'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-900/60'
              }`}
            >
              <Mic className="w-3.5 h-3.5" /> Talk via Browser (Instant Free)
            </button>
            <button
              onClick={() => {
                endCall();
                setCallMode('PHONE');
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition ${
                callMode === 'PHONE'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-900/60'
              }`}
            >
              <PhoneForwarded className="w-3.5 h-3.5" /> Call My Mobile Phone
            </button>
          </div>

          {callMode === 'PHONE' ? (
            <div className="p-6 space-y-4 bg-slate-900 text-center flex-1 overflow-y-auto flex flex-col justify-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
                <Phone className="w-7 h-7 animate-bounce" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white mb-1">Direct Phone CallRedressal</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Enter your mobile phone number below. Our AI helpline officer will immediately place a call to your phone for free!
                </p>
              </div>

              <form onSubmit={handleRequestPhoneCall} className="max-w-sm mx-auto space-y-3 w-full">
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={phoneNumberInput}
                    onChange={(e) => setPhoneNumberInput(e.target.value)}
                    placeholder="+918660465213"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-center font-mono text-sm font-bold text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isCallingPhone}
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  {isCallingPhone ? 'Calling Your Phone...' : '📞 Call My Phone Now'}
                </button>
              </form>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-left text-[11px] text-slate-400 space-y-1 max-w-sm mx-auto">
                <p className="font-semibold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 100% Free Service
                </p>
                <p>Receiving an incoming call requires <strong>zero recharge/balance</strong> on your mobile phone.</p>
              </div>
            </div>
          ) : (
            <>
              {/* Voice Waveform & Status Visualizer */}
              <div className="py-3 px-4 bg-slate-950/60 border-b border-slate-800 flex flex-col items-center justify-center flex-shrink-0">
                {/* Status Pill */}
                <div className="mb-2">
                  {callStatus === 'CONNECTING' && (
                    <span className="px-3 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[11px] font-semibold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                      Connecting to AI Helpline...
                    </span>
                  )}
                  {callStatus === 'LISTENING' && (
                    <span className="px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold flex items-center gap-1.5 animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      Listening to your voice... Speak now
                    </span>
                  )}
                  {callStatus === 'THINKING' && (
                    <span className="px-3 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[11px] font-semibold flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 animate-spin text-purple-400" />
                      Analyzing Civic Report...
                    </span>
                  )}
                  {callStatus === 'SPEAKING' && (
                    <span className="px-3 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[11px] font-semibold flex items-center gap-1.5">
                      <Volume2 className="w-3 h-3 text-cyan-400 animate-bounce" />
                      AI Officer Speaking...
                    </span>
                  )}
                  {callStatus === 'COMPLETED' && (
                    <span className="px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      Complaint Registered Successfully
                    </span>
                  )}
                </div>

                {/* Animated Waveform Visualizer reactive to audio level */}
                <div className="flex items-center justify-center gap-1.5 h-10">
                  {[...Array(16)].map((_, i) => {
                    const isListening = callStatus === 'LISTENING';
                    const isSpeaking = callStatus === 'SPEAKING';
                    const dynamicHeight = isListening
                      ? Math.max(6, Math.min(36, 6 + (audioLevel * (0.4 + (i % 5) * 0.15))))
                      : (isSpeaking ? (8 + (i % 6) * 4) : 6);

                    return (
                      <motion.div
                        key={i}
                        animate={{
                          height: dynamicHeight,
                          backgroundColor: isListening ? (audioLevel > 15 ? '#10b981' : '#059669') : (isSpeaking ? '#06b6d4' : '#475569')
                        }}
                        transition={{ duration: 0.1 }}
                        className="w-1.5 rounded-full transition-all duration-100"
                      />
                    );
                  })}
                </div>

                {/* Live speech preview & submit action */}
                {currentSpeech ? (
                  <div className="mt-2.5 flex items-center gap-2 max-w-md w-full justify-center">
                    <p className="text-xs text-emerald-300 font-medium italic truncate max-w-[260px] bg-emerald-950/70 px-3 py-1 rounded-lg border border-emerald-700/60">
                      "{currentSpeech}"
                    </p>
                    <button
                      onClick={() => handleUserSpokenMessage(currentSpeech)}
                      className="px-3.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-md flex items-center gap-1 transition flex-shrink-0 animate-pulse"
                    >
                      <Send className="w-3 h-3" /> Submit Voice
                    </button>
                  </div>
                ) : (
                  callStatus === 'SPEAKING' ? (
                    <button
                      onClick={() => {
                        if (typeof window !== 'undefined' && window.speechSynthesis) {
                          window.speechSynthesis.cancel();
                        }
                        listenForUser();
                      }}
                      className="mt-2 px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition"
                    >
                      <Mic className="w-3 h-3 text-cyan-400" /> Interrupt & Speak Now
                    </button>
                  ) : callStatus === 'LISTENING' ? (
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => listenForUser()}
                        className="px-3.5 py-1 rounded-full bg-emerald-950/50 hover:bg-emerald-900/70 border border-emerald-700/50 text-emerald-300 text-xs font-medium flex items-center gap-1.5 transition shadow-sm"
                      >
                        <RefreshCw className="w-3 h-3 text-emerald-400" /> Re-trigger Mic
                      </button>
                    </div>
                  ) : null
                )}
              </div>

              {/* Transcript Area */}
              <div
                ref={scrollRef}
                className="flex-1 min-h-0 p-4 overflow-y-auto space-y-3 bg-slate-900/50"
              >
                {transcript.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <span className="text-[10px] text-slate-500 mb-0.5 px-1">{msg.role === 'user' ? 'You' : 'JanSetu AI'} • {msg.time}</span>
                    <div
                      className={`max-w-[85%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-blue-600 text-white rounded-tr-sm shadow-md'
                          : 'bg-slate-800 text-slate-200 border border-slate-700/80 rounded-tl-sm shadow-sm'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </motion.div>
                ))}

                {/* Registered Complaint Summary Card */}
                {registeredComplaint && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-emerald-950/40 border border-emerald-600/40 rounded-2xl text-slate-200 space-y-2 mt-2 shadow-lg"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4" /> Official Grievance Ticket
                      </span>
                      <span className="font-mono text-xs bg-emerald-500/20 px-2 py-0.5 rounded-md text-emerald-300 font-bold border border-emerald-500/30">
                        #{registeredComplaint._id.toString().slice(-6)}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-white">{registeredComplaint.title}</p>
                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 pt-1">
                      <div className="flex items-center gap-1.5 bg-slate-900/60 p-2 rounded-lg truncate">
                        <Building2 className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                        <span className="truncate">Dept: <strong className="text-blue-300">{registeredComplaint.department}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-slate-900/60 p-2 rounded-lg truncate">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                        <span className="truncate">Priority: <strong className="text-amber-300">{registeredComplaint.priority}</strong></span>
                      </div>
                      <div className="col-span-2 flex items-center gap-1.5 bg-slate-900/60 p-2 rounded-lg truncate">
                        <MapPin className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                        <span className="truncate">{registeredComplaint.location}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Footer Controls */}
              <div className="p-3.5 bg-slate-950 border-t border-slate-800 space-y-2.5 flex-shrink-0">
                {/* Fallback Text Input */}
                <form onSubmit={handleManualSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={manualText}
                    onChange={(e) => setManualText(e.target.value)}
                    placeholder="Or type your complaint/landmark here..."
                    disabled={callStatus === 'COMPLETED'}
                    className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
                  />
                  <button
                    type="submit"
                    disabled={!manualText.trim() || callStatus === 'COMPLETED'}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold transition"
                  >
                    Send
                  </button>
                </form>

                {/* Bottom Action Bar */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => {
                      const nextMuted = !isMuted;
                      setIsMuted(nextMuted);
                      isMutedRef.current = nextMuted;
                      if (nextMuted) {
                        if (recognitionRef.current) {
                          try { recognitionRef.current.stop(); } catch (e) {}
                        }
                      } else {
                        listenForUser();
                      }
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-semibold transition ${
                      isMuted
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {isMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-emerald-400" />}
                    {isMuted ? 'Mic Muted' : 'Mic Live'}
                  </button>

                  {callStatus === 'COMPLETED' ? (
                    <button
                      onClick={() => {
                        const newSession = `web_call_${Date.now()}`;
                        setSessionId(newSession);
                        sessionIdRef.current = newSession;
                        setTranscript([]);
                        setRegisteredComplaint(null);
                        setCallDuration(0);
                        startCall(newSession);
                      }}
                      className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-lg transition"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      Report Another Issue
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        endCall();
                        onClose();
                      }}
                      className="flex items-center gap-1.5 px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-red-600/30 transition"
                    >
                      <PhoneOff className="w-3.5 h-3.5" />
                      End Call
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
}

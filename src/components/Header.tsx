import React, { useEffect, useRef, useState } from 'react';
import { Sprout, MapPin, Mic, Globe2, Sparkles } from 'lucide-react';
import { Language, CropData } from '../types';
import { translations, CROPS } from '../data/cropData';

interface HeaderProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  selectedCrop: CropData;
  onSelectCrop: (crop: CropData) => void;
  landSize: number;
  onLandSizeChange: (size: number) => void;
}

// Extend Window interface for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export const Header: React.FC<HeaderProps> = ({
  currentLanguage,
  onLanguageChange,
  onSelectCrop,
  onLandSizeChange
}) => {
  const t = translations[currentLanguage];
  const [isListening, setIsListening] = useState(false);
  const [voiceToast, setVoiceToast] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  // Parse words into numbers (multilingual: English, Hindi, Marathi)
  const parseSpokenNumber = (text: string): number | null => {
    // Check direct digits or decimals
    const digitMatch = text.match(/\b([1-9]|10)(\.\d+)?\b/);
    if (digitMatch) {
      return parseFloat(digitMatch[0]);
    }

    const numberMap: Record<string, number> = {
      'one': 1, 'एक': 1,
      'one and half': 1.5, 'डेढ़': 1.5, 'दीड': 1.5,
      'two': 2, 'दो': 2, 'दोन': 2,
      'two and half': 2.5, 'ढाई': 2.5, 'अडीच': 2.5,
      'three': 3, 'तीन': 3,
      'four': 4, 'चार': 4,
      'five': 5, 'पांच': 5, 'पाच': 5,
      'six': 6, 'छह': 6, 'सहा': 6,
      'seven': 7, 'सात': 7,
      'eight': 8, 'आठ': 8,
      'nine': 9, 'नौ': 9, 'नऊ': 9,
      'ten': 10, 'दस': 10, 'दहा': 10
    };

    const lower = text.toLowerCase();
    for (const [word, val] of Object.entries(numberMap)) {
      if (lower.includes(word)) {
        return val;
      }
    }
    return null;
  };

  // Process transcript keywords
  const processVoiceTranscript = (rawTranscript: string) => {
    const text = rawTranscript.toLowerCase();
    let cropMatched: CropData | null = null;
    let sizeMatched: number | null = parseSpokenNumber(text);

    // Keyword detection
    if (text.includes('soybean') || text.includes('सोयाबीन')) {
      cropMatched = CROPS.find(c => c.id === 'soybean') || null;
    } else if (text.includes('wheat') || text.includes('गेहूं') || text.includes('गेहू') || text.includes('गहू')) {
      cropMatched = CROPS.find(c => c.id === 'wheat') || null;
    } else if (text.includes('gram') || text.includes('chickpea') || text.includes('chana') || text.includes('चना') || text.includes('हरभरा')) {
      cropMatched = CROPS.find(c => c.id === 'gram') || null;
    } else if (text.includes('mustard') || text.includes('sarson') || text.includes('सरसों') || text.includes('मोहरी')) {
      cropMatched = CROPS.find(c => c.id === 'mustard') || null;
    } else if (text.includes('cotton') || text.includes('kapas') || text.includes('कपास') || text.includes('कापूस')) {
      cropMatched = CROPS.find(c => c.id === 'cotton') || null;
    }

    if (cropMatched) {
      onSelectCrop(cropMatched);
    }
    if (sizeMatched !== null) {
      const clamped = Math.max(1, Math.min(10, sizeMatched));
      onLandSizeChange(clamped);
    }

    // Feedback Toast
    let feedback = `🎙️ Heard: "${rawTranscript}"`;
    if (cropMatched && sizeMatched) {
      feedback = `✅ ${cropMatched.name[currentLanguage]} • ${sizeMatched} ${t.acres}`;
    } else if (cropMatched) {
      feedback = `✅ ${cropMatched.name[currentLanguage]}`;
    } else if (sizeMatched) {
      feedback = `✅ ${sizeMatched} ${t.acres}`;
    }

    setVoiceToast(feedback);
    setTimeout(() => setVoiceToast(null), 4000);
  };

  // Toggle Web Speech API Recognition
  const toggleVoiceRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceToast("⚠️ Speech Recognition not supported in this browser.");
      setTimeout(() => setVoiceToast(null), 3500);
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      // Dynamic locale matching language
      const langMap: Record<Language, string> = {
        EN: 'en-IN',
        HI: 'hi-IN',
        MR: 'mr-IN'
      };
      recognition.lang = langMap[currentLanguage];
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceToast(`🎙️ ${t.voiceListening}`);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        processVoiceTranscript(transcript);
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        setVoiceToast(event.error === 'no-speech' ? '⚠️ No speech detected' : `⚠️ Speech: ${event.error}`);
        setTimeout(() => setVoiceToast(null), 3000);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setIsListening(false);
    }
  };

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  return (
    <header className="w-full bg-[#182214]/90 backdrop-blur-md border-b border-[#3d5634] sticky top-0 z-30 px-4 sm:px-6 lg:px-8 py-3.5 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
        
        {/* Brand & Subtitle */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5 group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-lime-600/20 border border-[#4e6f43] flex items-center justify-center text-emerald-400 group-hover:border-amber-400 transition-all duration-300 shadow-inner">
              <Sprout className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white font-sans">
                  Agri<span className="text-amber-400">Smart</span>
                </span>
                <span className="px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded bg-emerald-950/80 text-emerald-400 border border-emerald-700/40">
                  PRO
                </span>
              </div>
              <p className="text-xs text-[#9cb497] font-medium tracking-wide flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleVoiceRecognition}
              className={`p-2 rounded-lg border transition-all ${
                isListening
                  ? 'bg-amber-500 text-black border-amber-400 shadow-glow-gold animate-pulse'
                  : 'bg-[#22331c] text-[#9cb497] border-[#3d5634]'
              }`}
              title={t.voiceAdvisor}
            >
              {isListening ? <Mic className="w-4 h-4 animate-ping" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Right Action Badges */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 flex-wrap justify-center sm:justify-end w-full md:w-auto relative">
          
          {/* Location Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#22331c]/90 border border-[#3d5634] text-[#f0fdf4] text-xs font-medium shadow-sm">
            <MapPin className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
            <span>{t.location}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          </div>

          {/* Language Toggle Pill */}
          <div className="flex items-center bg-[#1a2815] p-1 rounded-full border border-[#3d5634] shadow-inner">
            <Globe2 className="w-3.5 h-3.5 text-[#9cb497] ml-2 mr-1 hidden sm:inline-block" />
            {(['EN', 'HI', 'MR'] as Language[]).map((lang) => {
              const isActive = currentLanguage === lang;
              const labels: Record<Language, string> = {
                EN: 'EN',
                HI: 'हिन्दी',
                MR: 'मराठी'
              };
              return (
                <button
                  key={lang}
                  onClick={() => onLanguageChange(lang)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-glow-gold scale-105'
                      : 'text-[#9cb497] hover:text-white hover:bg-[#263820]'
                  }`}
                >
                  {labels[lang]}
                </button>
              );
            })}
          </div>

          {/* Native Web Speech API Mic Button */}
          <button
            onClick={toggleVoiceRecognition}
            className={`hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-medium transition-all duration-300 relative group overflow-hidden ${
              isListening
                ? 'bg-amber-500 text-black border-amber-400 shadow-glow-gold'
                : 'bg-[#22331c] text-[#f0fdf4] border-[#3d5634] hover:border-amber-400/80 hover:bg-[#2a4023]'
            }`}
          >
            {/* Pulsing ring on active listening */}
            <span className={`absolute -inset-1 rounded-full bg-amber-400/30 transition-opacity ${isListening ? 'opacity-100 animate-ping' : 'opacity-0 group-hover:opacity-30'}`}></span>
            
            <div className={`p-1 rounded-full ${isListening ? 'bg-black/20' : 'bg-[#152012]'}`}>
              {isListening ? (
                <Mic className="w-3.5 h-3.5 text-black animate-pulse" />
              ) : (
                <Mic className="w-3.5 h-3.5 text-amber-400" />
              )}
            </div>
            <span>{isListening ? t.voiceListening : t.voiceAdvisor}</span>
          </button>

          {/* Voice Feedback Floating Toast */}
          {voiceToast && (
            <div className="absolute top-full right-0 mt-2 z-50 px-3.5 py-2 rounded-xl bg-[#1a2815] border border-amber-400/60 shadow-xl text-xs font-medium text-amber-300 flex items-center gap-2 animate-in fade-in slide-in-from-top-2 whitespace-nowrap">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span>{voiceToast}</span>
            </div>
          )}

        </div>

      </div>
    </header>
  );
};

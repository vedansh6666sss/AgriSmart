import React from 'react';
import { X, MapPin, Phone, CheckCircle2, TrendingUp, TrendingDown, Mic, Sparkles, Volume2, ShieldCheck } from 'lucide-react';
import { Language, CropData } from '../types';
import { translations, MOCK_SUPPLIERS, MOCK_MANDI_ITEMS, CROPS } from '../data/cropData';

interface ModalsProps {
  activeModal: 'suppliers' | 'mandi' | 'voice' | null;
  onClose: () => void;
  language: Language;
  onSelectCrop: (crop: CropData) => void;
  onSelectLandSize: (acres: number) => void;
}

export const Modals: React.FC<ModalsProps> = ({
  activeModal,
  onClose,
  language,
  onSelectCrop,
  onSelectLandSize
}) => {
  const t = translations[language];
  const [voiceQuery, setVoiceQuery] = React.useState('');
  const [isProcessingVoice, setIsProcessingVoice] = React.useState(false);
  const [voiceResponse, setVoiceResponse] = React.useState<string | null>(null);

  if (!activeModal) return null;

  const handleVoiceCommand = (cropId: string, acres: number, commandText: string) => {
    setVoiceQuery(commandText);
    setIsProcessingVoice(true);
    setVoiceResponse(null);

    setTimeout(() => {
      const targetCrop = CROPS.find(c => c.id === cropId);
      if (targetCrop) {
        onSelectCrop(targetCrop);
        onSelectLandSize(acres);
        setVoiceResponse(
          language === 'HI'
            ? `स्वीकृत! ${targetCrop.name.HI} के ${acres} एकड़ के लिए पोषक तत्वों और खाद का हिसाब अपडेट कर दिया गया है।`
            : language === 'MR'
            ? `मान्य! ${targetCrop.name.MR} च्या ${acres} एकरांसाठी खत शिफारस तयार केली आहे.`
            : `Updated! Calibrated prescription for ${acres} Acres of ${targetCrop.name.EN}.`
        );
      }
      setIsProcessingVoice(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#1b2917] border border-[#3d5634] rounded-2xl p-5 sm:p-6 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#3d5634] pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            {activeModal === 'suppliers' && <MapPin className="w-5 h-5 text-emerald-400" />}
            {activeModal === 'mandi' && <TrendingUp className="w-5 h-5 text-amber-400" />}
            {activeModal === 'voice' && <Mic className="w-5 h-5 text-lime-400 animate-pulse" />}
            <h3 className="text-base sm:text-lg font-bold text-white">
              {activeModal === 'suppliers' && t.suppliersModalTitle}
              {activeModal === 'mandi' && t.mandiModalTitle}
              {activeModal === 'voice' && t.voiceAdvisor}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#152012] text-[#9cb497] hover:text-white hover:bg-[#263820] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="overflow-y-auto flex-1 pr-1 space-y-4">
          
          {/* 1. Suppliers Modal */}
          {activeModal === 'suppliers' && (
            <div className="space-y-3">
              <p className="text-xs text-[#9cb497]">
                Official DBT Fertilizer outlets & authorized Krishi Seva Kendras within Indore district with live stock updates.
              </p>
              <div className="space-y-2.5">
                {MOCK_SUPPLIERS.map((sup) => (
                  <div
                    key={sup.id}
                    className="p-3.5 rounded-xl bg-[#22331c] border border-[#3d5634] hover:border-[#4e6f43] transition-all space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-sm font-bold text-white">{sup.name}</h4>
                          {sup.verified && (
                            <span className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-700/40">
                              <ShieldCheck className="w-3 h-3" />
                              VERIFIED
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#9cb497] mt-0.5">{sup.type}</p>
                      </div>
                      <span className="text-xs font-mono font-bold text-amber-300 bg-[#182214] px-2 py-0.5 rounded border border-[#3d5634]">
                        {sup.distance}
                      </span>
                    </div>

                    {/* In Stock Tags */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[11px] text-[#6f886a] font-medium">In Stock:</span>
                      {sup.inStock.map((stock, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-medium px-2 py-0.5 rounded bg-[#182214] text-emerald-300 border border-[#32492a]"
                        >
                          {stock}
                        </span>
                      ))}
                    </div>

                    {/* Phone link */}
                    <div className="pt-2 border-t border-[#3d5634]/60 flex items-center justify-between text-xs">
                      <a
                        href={`tel:${sup.phone}`}
                        className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-mono font-medium"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>{sup.phone}</span>
                      </a>
                      <span className="text-[11px] text-[#9cb497]">
                        Rating: <strong className="text-amber-400">★ {sup.rating}</strong>/5.0
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. Mandi Prices Modal */}
          {activeModal === 'mandi' && (
            <div className="space-y-3">
              <p className="text-xs text-[#9cb497]">
                Live e-NAM and APMC Mandi modal prices updated today across major Malwa agricultural trading hubs.
              </p>
              <div className="space-y-2.5">
                {MOCK_MANDI_ITEMS.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-[#22331c] border border-[#3d5634] hover:border-[#4e6f43] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">
                          {item.commodity[language]}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#182214] text-[#9cb497] border border-[#3d5634]">
                          {item.variety}
                        </span>
                      </div>
                      <p className="text-xs text-[#9cb497] flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-amber-400" />
                        <span>{item.market}</span>
                        <span>• Arrival: {item.arrivalTons} MT</span>
                      </p>
                    </div>

                    <div className="text-right flex sm:flex-col items-baseline sm:items-end justify-between">
                      <div className="font-mono text-base sm:text-lg font-black text-amber-300">
                        ₹{item.pricePerQuintal.toLocaleString('en-IN')} <span className="text-xs font-normal text-white/70">/ Qtl</span>
                      </div>
                      <div className={`text-xs font-mono font-semibold flex items-center gap-1 ${
                        item.priceChange >= 0 ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        {item.priceChange >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                        <span>{item.priceChange >= 0 ? `+₹${item.priceChange}` : `-₹${Math.abs(item.priceChange)}`} today</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Voice Support Modal */}
          {activeModal === 'voice' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#152012] border border-[#3d5634] text-center space-y-3">
                <div className="w-14 h-14 mx-auto rounded-full bg-lime-500/20 border border-lime-400/50 flex items-center justify-center text-lime-400 shadow-glow-green relative">
                  <Mic className="w-7 h-7 animate-pulse" />
                  <span className="absolute inset-0 rounded-full bg-lime-400/20 animate-ping"></span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{t.voiceListening}</h4>
                  <p className="text-xs text-[#9cb497] mt-1">
                    Try speaking or click any sample command below:
                  </p>
                </div>
              </div>

              {/* Quick Spoken Command Presets */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Test Voice Keywords:</span>
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    onClick={() => handleVoiceCommand('wheat', 3.0, '3 एकड़ गेहूं')}
                    className="p-3 rounded-xl bg-[#22331c] border border-[#3d5634] hover:border-amber-400 text-left text-xs font-medium text-white hover:bg-[#293d22] transition-all flex items-center justify-between group"
                  >
                    <span>🌾 "3 एकड़ गेहूं"</span>
                    <Volume2 className="w-4 h-4 text-[#9cb497] group-hover:text-amber-400" />
                  </button>

                  <button
                    onClick={() => handleVoiceCommand('soybean', 2.0, 'दोन एकर सोयाबीन')}
                    className="p-3 rounded-xl bg-[#22331c] border border-[#3d5634] hover:border-amber-400 text-left text-xs font-medium text-white hover:bg-[#293d22] transition-all flex items-center justify-between group"
                  >
                    <span>🌱 "दोन एकर सोयाबीन"</span>
                    <Volume2 className="w-4 h-4 text-[#9cb497] group-hover:text-amber-400" />
                  </button>

                  <button
                    onClick={() => handleVoiceCommand('cotton', 5.0, '5 acres cotton')}
                    className="p-3 rounded-xl bg-[#22331c] border border-[#3d5634] hover:border-amber-400 text-left text-xs font-medium text-white hover:bg-[#293d22] transition-all flex items-center justify-between group"
                  >
                    <span>☁️ "5 acres cotton"</span>
                    <Volume2 className="w-4 h-4 text-[#9cb497] group-hover:text-amber-400" />
                  </button>

                  <button
                    onClick={() => handleVoiceCommand('gram', 4.0, '4 एकड़ चना')}
                    className="p-3 rounded-xl bg-[#22331c] border border-[#3d5634] hover:border-amber-400 text-left text-xs font-medium text-white hover:bg-[#293d22] transition-all flex items-center justify-between group"
                  >
                    <span>🫘 "4 एकड़ चना"</span>
                    <Volume2 className="w-4 h-4 text-[#9cb497] group-hover:text-amber-400" />
                  </button>
                </div>
              </div>

              {/* Status Message */}
              {isProcessingVoice && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></div>
                  <span>Processing voice input: "{voiceQuery}"...</span>
                </div>
              )}

              {voiceResponse && (
                <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-400/50 text-emerald-200 text-xs font-medium flex items-start gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-white mb-0.5">Voice Command Applied:</div>
                    <div>{voiceResponse}</div>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="mt-4 pt-3 border-t border-[#3d5634] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#22331c] hover:bg-[#2b4023] border border-[#3d5634] text-xs font-bold text-white transition-colors"
          >
            {t.close}
          </button>
        </div>

      </div>
    </div>
  );
};

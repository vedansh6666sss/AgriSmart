import React from 'react';
import { MapPin, TrendingUp, Mic, ExternalLink, ShieldCheck } from 'lucide-react';
import { Language, CropData } from '../types';
import { translations } from '../data/cropData';

interface ActionChipsProps {
  onOpenSuppliers: () => void;
  onOpenMandi: () => void;
  onOpenVoice: () => void;
  selectedCrop: CropData;
  language: Language;
}

export const ActionChips: React.FC<ActionChipsProps> = ({
  onOpenSuppliers,
  onOpenMandi,
  onOpenVoice,
  selectedCrop,
  language
}) => {
  const t = translations[language];

  return (
    <div className="w-full bg-[#22331c]/80 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 border border-[#3d5634] shadow-lg">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
        
        {/* Nearby Suppliers Chip */}
        <button
          onClick={onOpenSuppliers}
          className="flex items-center justify-between p-3 rounded-xl bg-[#1a2815] border border-[#3d5634] hover:border-emerald-400 hover:bg-[#20321b] text-left transition-all duration-200 group shadow-sm"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-950/80 border border-emerald-700/40 text-emerald-400 group-hover:scale-110 transition-transform">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                {t.nearbySuppliers}
              </div>
              <div className="text-[10px] text-[#9cb497] flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>4 IFFCO Depots in Indore</span>
              </div>
            </div>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-[#6f886a] group-hover:text-emerald-400 transition-colors" />
        </button>

        {/* Mandi Prices Chip */}
        <button
          onClick={onOpenMandi}
          className="flex items-center justify-between p-3 rounded-xl bg-[#1a2815] border border-[#3d5634] hover:border-amber-400 hover:bg-[#20321b] text-left transition-all duration-200 group shadow-sm"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-950/80 border border-amber-700/40 text-amber-400 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors flex items-center gap-1.5">
                <span>{t.mandiPrices}</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono border border-amber-500/40">
                  LIVE
                </span>
              </div>
              <div className="text-[10px] text-amber-300/90 font-mono font-medium">
                {selectedCrop.name[language]}: ₹{selectedCrop.mandiPrice.modal}/Qtl ▲
              </div>
            </div>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-[#6f886a] group-hover:text-amber-400 transition-colors" />
        </button>

        {/* Voice Support Chip */}
        <button
          onClick={onOpenVoice}
          className="flex items-center justify-between p-3 rounded-xl bg-[#1a2815] border border-[#3d5634] hover:border-lime-400 hover:bg-[#20321b] text-left transition-all duration-200 group shadow-sm"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-lime-950/80 border border-lime-700/40 text-lime-400 group-hover:scale-110 transition-transform">
              <Mic className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white group-hover:text-lime-300 transition-colors">
                {t.voiceSupport}
              </div>
              <div className="text-[10px] text-[#9cb497]">
                Hindi / Marathi / English
              </div>
            </div>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-[#6f886a] group-hover:text-lime-400 transition-colors" />
        </button>

      </div>
    </div>
  );
};

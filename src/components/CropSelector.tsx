import React from 'react';
import { Sprout, Wheat, Sparkles, Sun, Cloud, ChevronRight, ChevronLeft } from 'lucide-react';
import { CropData, Language } from '../types';
import { CROPS, translations } from '../data/cropData';

interface CropSelectorProps {
  selectedCrop: CropData;
  onSelectCrop: (crop: CropData) => void;
  language: Language;
}

export const CropSelector: React.FC<CropSelectorProps> = ({
  selectedCrop,
  onSelectCrop,
  language
}) => {
  const t = translations[language];
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const getIcon = (iconName: string, isSelected: boolean) => {
    const iconClass = `w-7 h-7 transition-all duration-300 ${
      isSelected ? 'text-amber-400 scale-110 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]' : 'text-emerald-400/80 group-hover:text-emerald-300'
    }`;
    switch (iconName) {
      case 'Sprout': return <Sprout className={iconClass} />;
      case 'Wheat': return <Wheat className={iconClass} />;
      case 'Sparkles': return <Sparkles className={iconClass} />;
      case 'Sun': return <Sun className={iconClass} />;
      case 'Cloud': return <Cloud className={iconClass} />;
      default: return <Sprout className={iconClass} />;
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-[#22331c]/80 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-[#3d5634] shadow-lg relative">
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <h2 className="text-sm sm:text-base font-bold text-white tracking-wide flex items-center gap-2">
            <span>{t.cropSelect}</span>
            <span className="text-xs font-normal text-[#9cb497]">
              ({CROPS.length} Crops Available)
            </span>
          </h2>
        </div>

        {/* Carousel Scroll Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => scroll('left')}
            className="p-1.5 rounded-lg bg-[#182214] border border-[#3d5634] text-[#9cb497] hover:text-white hover:border-[#4e6f43] transition-colors"
            title="Previous Crops"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-1.5 rounded-lg bg-[#182214] border border-[#3d5634] text-[#9cb497] hover:text-white hover:border-[#4e6f43] transition-colors"
            title="Next Crops"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel */}
      <div
        ref={scrollContainerRef}
        className="flex items-stretch gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-[#3d5634] scrollbar-track-transparent scroll-smooth snap-x snap-mandatory"
        style={{ scrollbarWidth: 'thin' }}
      >
        {CROPS.map((crop) => {
          const isSelected = selectedCrop.id === crop.id;
          const cropNameEn = crop.name.EN;
          const cropNameRegional = crop.name[language];
          const hasDifferentRegional = language !== 'EN' && cropNameEn !== cropNameRegional;

          return (
            <button
              key={crop.id}
              onClick={() => onSelectCrop(crop)}
              className={`flex-shrink-0 w-44 sm:w-48 text-left rounded-xl p-3.5 transition-all duration-300 relative group snap-start border ${
                isSelected
                  ? 'bg-gradient-to-b from-[#2e4726] to-[#20341b] border-amber-400 shadow-glow-gold -translate-y-1'
                  : 'bg-[#1a2815]/90 border-[#3d5634] hover:border-[#4e6f43] hover:bg-[#22331c] hover:-translate-y-0.5'
              }`}
            >
              {/* Active Indicator Pin */}
              {isSelected && (
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-amber-400 text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                  <span>ACTIVE</span>
                </div>
              )}

              {/* Icon & Season Tag */}
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-xl border transition-colors ${
                  isSelected ? 'bg-black/30 border-amber-400/40' : 'bg-[#152012] border-[#3d5634]'
                }`}>
                  {getIcon(crop.iconName, isSelected)}
                </div>
                <span className="text-xl">{crop.emoji}</span>
              </div>

              {/* Names */}
              <div className="space-y-0.5 mb-2">
                <div className="text-sm sm:text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                  {cropNameEn}
                </div>
                <div className="text-xs text-amber-400/90 font-medium">
                  {hasDifferentRegional ? `(${cropNameRegional})` : crop.name.HI}
                </div>
              </div>

              {/* Season & Quick NPK Meta */}
              <div className="pt-2 border-t border-[#3d5634]/60 flex items-center justify-between text-[11px] text-[#9cb497]">
                <span className="font-medium text-emerald-300/80 truncate max-w-[90px]">
                  {crop.season[language]}
                </span>
                <span className="font-mono text-xs font-semibold text-amber-300/90">
                  {crop.npkPerAcre.n}:{crop.npkPerAcre.p}:{crop.npkPerAcre.k}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

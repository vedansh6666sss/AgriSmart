import React from 'react';
import { Layers, Maximize2, Compass, Sliders } from 'lucide-react';
import { Language, CropData } from '../types';
import { translations } from '../data/cropData';

interface FieldGridSliderProps {
  landSize: number;
  onLandSizeChange: (acres: number) => void;
  selectedCrop: CropData;
  language: Language;
}

export const FieldGridSlider: React.FC<FieldGridSliderProps> = ({
  landSize,
  onLandSizeChange,
  selectedCrop,
  language
}) => {
  const t = translations[language];

  // 10x4 Grid (40 cells representing 10 acres; 4 cells = 1 acre)
  const TOTAL_CELLS = 40;
  const activeThreshold = Math.round(landSize * 4);

  const presets = [1, 2, 3.5, 5, 7.5, 10];

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onLandSizeChange(parseFloat(e.target.value));
  };

  const handleCellClick = (cellIndex: number) => {
    // 4 cells = 1 acre -> new acreage = (index + 1) / 4
    const newAcreage = Math.max(1, Math.min(10, (cellIndex + 1) / 4));
    onLandSizeChange(parseFloat(newAcreage.toFixed(2)));
  };

  return (
    <div className="w-full bg-[#22331c]/80 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-[#3d5634] shadow-lg">
      
      {/* Slider Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm sm:text-base font-bold text-white">
              {t.landSize}
            </h3>
          </div>
          <p className="text-xs text-[#9cb497] mt-0.5">
            {t.gridLegend}
          </p>
        </div>

        {/* Readout Pill */}
        <div className="flex items-baseline gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-lime-500/20 border border-amber-400/60 shadow-inner">
          <span className="font-mono text-xl sm:text-2xl font-black text-amber-300">
            {landSize.toFixed(1)}
          </span>
          <span className="text-xs font-semibold text-white/90">
            {t.acres}
          </span>
          {language !== 'EN' && (
            <span className="text-xs text-[#9cb497] font-normal">
              ({language === 'HI' ? 'एकड़' : 'एकर'})
            </span>
          )}
        </div>
      </div>

      {/* Range Slider */}
      <div className="space-y-3 mb-5">
        <div className="relative flex items-center">
          <input
            type="range"
            min="1.0"
            max="10.0"
            step="0.25"
            value={landSize}
            onChange={handleSliderChange}
            className="w-full h-3 bg-[#152012] rounded-lg appearance-none cursor-pointer accent-amber-400 focus:outline-none border border-[#3d5634] shadow-inner"
            style={{
              background: `linear-gradient(to right, #eab308 0%, #84cc16 ${(landSize / 10) * 100}%, #152012 ${(landSize / 10) * 100}%, #152012 100%)`
            }}
          />
        </div>

        {/* Scale labels & Quick Preset Chips */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-[11px] text-[#9cb497] font-mono">
            <span>1.0 Ac</span>
            <span>•</span>
            <span>5.0 Ac</span>
            <span>•</span>
            <span>10.0 Ac</span>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-[#9cb497] hidden sm:inline mr-1">{t.quickAdd}:</span>
            {presets.map((val) => (
              <button
                key={val}
                onClick={() => onLandSizeChange(val)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                  landSize === val
                    ? 'bg-amber-400 text-black font-bold shadow-sm'
                    : 'bg-[#182214] text-[#9cb497] border border-[#3d5634] hover:text-white hover:border-[#4e6f43]'
                }`}
              >
                {val}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2D Field Grid Section (10 columns x 4 rows = 40 cells) */}
      <div className="bg-[#182214] rounded-xl p-3.5 border border-[#3d5634] shadow-inner relative overflow-hidden">
        
        {/* Field Grid Header */}
        <div className="flex items-center justify-between text-xs mb-2.5 px-0.5">
          <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t.gridScaleMap}</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-[#9cb497]">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-yellow-500 inline-block shadow-sm"></span>
              Active ({activeThreshold} / {TOTAL_CELLS} Cells)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-green-900/40 border border-green-800 inline-block"></span>
              Dormant
            </span>
          </div>
        </div>

        {/* 10x4 CSS Grid */}
        <div className="grid grid-cols-10 gap-1.5 sm:gap-2">
          {Array.from({ length: TOTAL_CELLS }).map((_, index) => {
            const isActive = index < (landSize * 4);
            const plotAcres = ((index + 1) / 4).toFixed(2);

            return (
              <button
                key={index}
                onClick={() => handleCellClick(index)}
                title={`Cell #${index + 1} • Cumulative: ${plotAcres} Acres`}
                className={`h-8 sm:h-9 rounded-md transition-all duration-300 relative flex items-center justify-center text-[10px] font-mono font-semibold border ${
                  isActive
                    ? 'bg-yellow-500/80 border-yellow-400 scale-105 text-black shadow-sm'
                    : 'bg-green-900/30 border-green-800 text-green-700/60 hover:border-green-600 hover:bg-green-900/50'
                }`}
              >
                {isActive ? (
                  <span className="relative z-10 text-[11px] drop-shadow-sm select-none">
                    {selectedCrop.emoji}
                  </span>
                ) : (
                  <span className="text-[9px] opacity-40">
                    {index + 1}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Dynamic Field Statistics Bar */}
        <div className="mt-3 pt-2.5 border-t border-[#3d5634]/60 flex items-center justify-between text-[11px] text-[#9cb497] flex-wrap gap-2">
          <div className="flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>Optimal Soil Zone: <strong className="text-white">{selectedCrop.soilSuitability[language]}</strong></span>
          </div>
          <div className="flex items-center gap-1">
            <Maximize2 className="w-3 h-3 text-emerald-400" />
            <span>Area: <strong className="text-amber-300 font-mono">{(landSize * 4046.86).toLocaleString(undefined, { maximumFractionDigits: 0 })} m²</strong> (~{(landSize * 43560).toLocaleString(undefined, { maximumFractionDigits: 0 })} sq.ft)</span>
          </div>
        </div>

      </div>

    </div>
  );
};

import React from 'react';
import { Activity, ShieldCheck, Zap, Leaf } from 'lucide-react';
import { CropData, Language } from '../types';
import { translations } from '../data/cropData';

interface NutrientGaugesProps {
  crop: CropData;
  landSize: number;
  language: Language;
}

export const NutrientGauges: React.FC<NutrientGaugesProps> = ({
  crop,
  landSize,
  language
}) => {
  const t = translations[language];

  // Calculate required kg based on active crop and landSize
  const requiredN = parseFloat((crop.npkPerAcre.n * landSize).toFixed(1));
  const requiredP = parseFloat((crop.npkPerAcre.p * landSize).toFixed(1));
  const requiredK = parseFloat((crop.npkPerAcre.k * landSize).toFixed(1));

  // Max reference scale across 10 acres for proportional visual gauge filling
  const MAX_N_SCALE = 500; // 50kg * 10 acres = 500kg
  const MAX_P_SCALE = 460; // 46kg * 10 acres = 460kg
  const MAX_K_SCALE = 300; // 30kg * 10 acres = 300kg

  const percentN = Math.min(100, Math.max(10, Math.round((requiredN / MAX_N_SCALE) * 100)));
  const percentP = Math.min(100, Math.max(10, Math.round((requiredP / MAX_P_SCALE) * 100)));
  const percentK = Math.min(100, Math.max(10, Math.round((requiredK / MAX_K_SCALE) * 100)));

  // Circular gauge SVG parameters (radius 38 -> circumference ~238.76)
  const radius = 38;
  const circumference = 2 * Math.PI * radius;

  // Exact color coding:
  // Nitrogen (N): Amber / Gold stroke
  // Phosphorus (P): Light Green stroke
  // Potassium (K): Dark Moss-Green stroke
  const nutrients = [
    {
      symbol: 'N',
      title: t.nitrogen,
      subtitle: language === 'EN' ? 'Vegetative & Leaf Growth' : language === 'HI' ? 'वानस्पतिक व पत्तियों की वृद्धि' : 'शाकीय व पानांची जोमदार वाढ',
      valueKg: requiredN,
      ratePerAcre: crop.npkPerAcre.n,
      percentage: percentN,
      strokeColor: '#eab308',
      gradientId: 'gradN_gold',
      gradientColors: { start: '#d97706', end: '#facc15' },
      badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      icon: <Zap className="w-3.5 h-3.5 text-amber-400" />
    },
    {
      symbol: 'P',
      title: t.phosphorus,
      subtitle: language === 'EN' ? 'Root Structure & Blooming' : language === 'HI' ? 'जड़ों का विकास व फूल निर्माण' : 'मुळांचा विकास व फुलोरा',
      valueKg: requiredP,
      ratePerAcre: crop.npkPerAcre.p,
      percentage: percentP,
      strokeColor: '#4ade80',
      gradientId: 'gradP_lightgreen',
      gradientColors: { start: '#22c55e', end: '#86efac' },
      badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      icon: <Leaf className="w-3.5 h-3.5 text-emerald-400" />
    },
    {
      symbol: 'K',
      title: t.potassium,
      subtitle: language === 'EN' ? 'Grain Filling & Immunity' : language === 'HI' ? 'दाने का भराव व रोग प्रतिरोधक क्षमता' : 'दाणे भरणे व रोगप्रतिकारशक्ती',
      valueKg: requiredK,
      ratePerAcre: crop.npkPerAcre.k,
      percentage: percentK,
      strokeColor: '#15803d',
      gradientId: 'gradK_darkmoss',
      gradientColors: { start: '#14532d', end: '#16a34a' },
      badgeBg: 'bg-green-900/40 text-green-300 border-green-700/50',
      icon: <ShieldCheck className="w-3.5 h-3.5 text-green-400" />
    }
  ];

  return (
    <div className="w-full bg-[#22331c]/80 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-[#3d5634] shadow-lg">
      
      {/* Title & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm sm:text-base font-bold text-white">
              {t.nutrientSectionTitle}
            </h3>
          </div>
          <p className="text-xs text-[#9cb497] mt-0.5">
            {t.nutrientSectionSubtitle}
          </p>
        </div>

        <div className="text-xs font-mono text-[#9cb497] bg-[#182214] px-2.5 py-1 rounded-lg border border-[#3d5634] self-start sm:self-auto">
          {crop.name[language]} • {landSize.toFixed(1)} {t.acres}
        </div>
      </div>

      {/* 3 Circular Animated Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
        {nutrients.map((item) => {
          const strokeDashoffset = circumference - (item.percentage / 100) * circumference;

          return (
            <div
              key={item.symbol}
              className="bg-[#1a2815]/90 rounded-xl p-4 border border-[#3d5634] hover:border-[#4e6f43] transition-all duration-300 relative group flex flex-col items-center text-center shadow-inner"
            >
              {/* Dial Header Symbol Badge */}
              <div className="w-full flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  {item.icon}
                  <span className="text-xs font-bold text-white">{item.title}</span>
                </div>
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${item.badgeBg}`}>
                  {item.ratePerAcre} kg/Ac
                </span>
              </div>

              {/* Circular Animated SVG Gauge */}
              <div className="relative w-28 h-28 my-1 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <defs>
                    <linearGradient id={item.gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={item.gradientColors.start} />
                      <stop offset="100%" stopColor={item.gradientColors.end} />
                    </linearGradient>
                  </defs>

                  {/* Track Background */}
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    stroke="#152012"
                    strokeWidth="8"
                    fill="transparent"
                  />

                  {/* Track Outer Border Dash Pattern */}
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    stroke="#2d4026"
                    strokeWidth="8"
                    strokeDasharray="4 4"
                    fill="transparent"
                    className="opacity-40"
                  />

                  {/* Smooth Animated Progress Stroke Ring */}
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    stroke={`url(#${item.gradientId})`}
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-500 ease-out"
                  />
                </svg>

                {/* Inner Text Readout: Dynamically displays exact calculated kg requirement in center */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[11px] font-bold text-white/70 uppercase">
                    {item.symbol}
                  </span>
                  <div className="font-mono text-lg sm:text-xl font-black text-white tracking-tight leading-none">
                    {item.valueKg}
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-400">
                    kg
                  </span>
                </div>
              </div>

              {/* Biological Role Subtitle */}
              <div className="mt-2 text-[11px] text-[#9cb497] font-medium leading-tight">
                {item.subtitle}
              </div>

              {/* Dosage Breakdown Scale */}
              <div className="w-full mt-3 pt-2 border-t border-[#3d5634]/60 flex items-center justify-between text-[11px] font-mono text-[#9cb497]">
                <span>Scale Fill:</span>
                <span className="text-white font-semibold">{item.percentage}%</span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

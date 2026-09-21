import React, { useEffect, useState, useMemo } from 'react';
import { 
  X, 
  RefreshCw, 
  Activity, 
  MapPin, 
  Radio, 
  ArrowUpDown,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { Language, CropData, LiveMandiPayload, MandiChartPoint } from '../types';
import { translations, fetchLiveMandiData } from '../data/cropData';

interface MandiDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  selectedCrop: CropData;
}

export const MandiDrawer: React.FC<MandiDrawerProps> = ({
  isOpen,
  onClose,
  language,
  selectedCrop
}) => {
  const t = translations[language];
  const [liveData, setLiveData] = useState<LiveMandiPayload | null>(null);
  const [isScraping, setIsScraping] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<'net' | 'gross' | 'distance'>('net');
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [hoveredPoint, setHoveredPoint] = useState<MandiChartPoint | null>(null);

  // Active Donut Segment State (0 = Farmer In-Hand, 1 = Logistics, 2 = Mandi Cess, 3 = Moisture Reserve)
  const [activeDonutIndex, setActiveDonutIndex] = useState<number>(0);
  // Active Arrival Pie Slice State
  const [activePieIndex, setActivePieIndex] = useState<number | null>(null);

  const grossBasePrice = liveData?.tableData[0]?.gross || 4820;
  const netInHandPrice = liveData?.tableData[0]?.net || 4808;

  const donutSegments = useMemo(() => [
    {
      id: 0,
      label: t.farmerInHand,
      percentage: 88,
      color: '#10b981', // Emerald Green
      amount: Math.round(grossBasePrice * 0.88),
      isDeduction: false,
      desc: "Direct net credit received by the farmer via APMC auction / RTGS."
    },
    {
      id: 1,
      label: t.logisticsFreight,
      percentage: 7,
      color: '#f59e0b', // Amber Gold
      amount: Math.round(grossBasePrice * 0.07),
      isDeduction: true,
      desc: "Farmgate tractor haulage and transit freight to APMC weighbridge."
    },
    {
      id: 2,
      label: t.mandiCess,
      percentage: 3,
      color: '#0ea5e9', // Sky Blue
      amount: Math.round(grossBasePrice * 0.03),
      isDeduction: true,
      desc: "APMC statutory market cess (1.5%) plus weighing & hamali charges."
    },
    {
      id: 3,
      label: t.moistureReserve,
      percentage: 2,
      color: '#f43f5e', // Rose Red
      amount: Math.round(grossBasePrice * 0.02),
      isDeduction: true,
      desc: "Moisture shrinkage reserve (dockage buffer applied if moisture >12%)."
    }
  ], [t, grossBasePrice]);

  const pieSlices = useMemo(() => [
    {
      id: 0,
      label: t.gradeFAQ,
      percentage: 65,
      color: '#10b981', // Emerald
      volume: "942 Qtl (65%)",
      status: "Eligible for Full Rate",
      desc: "Moisture <10%, Clean seed, Standard test weight"
    },
    {
      id: 1,
      label: t.gradeSuperBold,
      percentage: 20,
      color: '#f59e0b', // Amber Gold
      volume: "290 Qtl (20%)",
      status: "Eligible for Premium",
      desc: "Large bold grain size, Premium seed grade (+₹80/qtl premium)"
    },
    {
      id: 2,
      label: t.highMoisture,
      percentage: 15,
      color: '#f43f5e', // Rose Red
      volume: "218 Qtl (15%)",
      status: "Subject to Dockage",
      desc: "Moisture >12% (Subject to 5-8% dockage discount)"
    }
  ], [t]);

  // Helper to compute SVG pie paths
  const getPieSlicePath = (startPct: number, slicePct: number, radius = 70, cx = 95, cy = 95) => {
    const startAngle = (startPct / 100) * 2 * Math.PI - Math.PI / 2;
    const endAngle = ((startPct + slicePct) / 100) * 2 * Math.PI - Math.PI / 2;
    
    const x1 = cx + radius * Math.cos(startAngle);
    const y1 = cy + radius * Math.sin(startAngle);
    const x2 = cx + radius * Math.cos(endAngle);
    const y2 = cy + radius * Math.sin(endAngle);
    
    const largeArcFlag = slicePct > 50 ? 1 : 0;
    
    return `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  // Trigger simulated live scraper when drawer opens
  const loadData = () => {
    setIsScraping(true);
    fetchLiveMandiData().then((payload) => {
      setLiveData(payload);
      setIsScraping(false);
      if (payload.chartData.length > 0) {
        setHoveredPoint(payload.chartData[payload.chartData.length - 1]);
      }
    });
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  // Handle escape key to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Sorted Table Rows
  const sortedTableData = useMemo(() => {
    if (!liveData?.tableData) return [];
    return [...liveData.tableData].sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];
      if (sortAsc) {
        return valA > valB ? 1 : -1;
      }
      return valA < valB ? 1 : -1;
    });
  }, [liveData, sortBy, sortAsc]);

  // Handle sorting toggle
  const toggleSort = (col: 'net' | 'gross' | 'distance') => {
    if (sortBy === col) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(col);
      setSortAsc(false); // default descending (highest profit / price first)
    }
  };

  // SVG Chart Geometry Calculations
  const chartPoints = liveData?.chartData || [];
  const svgWidth = 640;
  const svgHeight = 220;
  const paddingX = 50;
  const paddingY = 35;

  const minPrice = 4400;
  const maxPrice = 4900;

  const getCoordinates = (index: number, price: number) => {
    const count = chartPoints.length;
    const x = count <= 1 
      ? svgWidth / 2 
      : paddingX + (index / (count - 1)) * (svgWidth - paddingX * 2);
    const clampedPrice = Math.max(minPrice, Math.min(maxPrice, price));
    const y = svgHeight - paddingY - ((clampedPrice - minPrice) / (maxPrice - minPrice)) * (svgHeight - paddingY * 2);
    return { x, y };
  };

  // Generate smooth cubic Bezier spline
  const { linePath, areaPath, coords } = useMemo(() => {
    if (chartPoints.length === 0) return { linePath: '', areaPath: '', coords: [] };

    const calculatedCoords = chartPoints.map((pt, idx) => ({
      ...getCoordinates(idx, pt.price),
      point: pt
    }));

    if (calculatedCoords.length === 1) {
      const c = calculatedCoords[0];
      return {
        linePath: `M ${c.x} ${c.y}`,
        areaPath: `M ${c.x} ${c.y} L ${c.x} ${svgHeight - paddingY} Z`,
        coords: calculatedCoords
      };
    }

    let d = `M ${calculatedCoords[0].x} ${calculatedCoords[0].y}`;
    for (let i = 0; i < calculatedCoords.length - 1; i++) {
      const p0 = calculatedCoords[i];
      const p1 = calculatedCoords[i + 1];
      const mx = (p0.x + p1.x) / 2;
      d += ` C ${mx} ${p0.y}, ${mx} ${p1.y}, ${p1.x} ${p1.y}`;
    }

    const first = calculatedCoords[0];
    const last = calculatedCoords[calculatedCoords.length - 1];
    const bottomY = svgHeight - paddingY;
    const a = `${d} L ${last.x} ${bottomY} L ${first.x} ${bottomY} Z`;

    return { linePath: d, areaPath: a, coords: calculatedCoords };
  }, [chartPoints]);

  return (
    <>
      {/* Dark semi-transparent backdrop overlay */}
      <div 
        className={`fixed inset-0 bg-black/75 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* The Bottom Sliding Drawer (85vh) */}
      <div 
        className={`fixed inset-x-0 bottom-0 z-50 bg-[#131c0f] border-t-2 border-amber-500 rounded-t-3xl shadow-2xl transition-transform duration-500 ease-out h-[85vh] flex flex-col overflow-hidden ${
          isOpen ? 'translate-y-0 pointer-events-auto' : 'translate-y-full pointer-events-none'
        }`}
        role="dialog"
        aria-modal="true"
      >
        {/* Subtle Ambient Radar Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-amber-500/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />

        {/* Pull Handle & Top Bar */}
        <div className="w-full bg-[#182414] border-b border-[#304429] px-4 sm:px-6 pt-2.5 pb-3 flex-shrink-0 relative z-20">
          
          {/* Mobile tactile pull handle bar */}
          <div 
            onClick={onClose}
            className="w-16 h-1.5 rounded-full bg-[#3d5634] hover:bg-amber-400/80 transition-colors mx-auto mb-2.5 cursor-pointer flex items-center justify-center"
            title={t.dragToClose}
          />

          <div className="flex items-center justify-between gap-4">
            
            {/* Title & Live Status Indicator */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500/20 to-emerald-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.25)]">
                <Activity className="w-5 h-5 text-amber-400 animate-pulse" />
              </div>
              
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-2">
                    <span>{t.mandiTerminalTitle}</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950/90 text-emerald-400 border border-emerald-500/50 shadow-[0_0_8px_rgba(16,185,129,0.3)]">
                      <Radio className="w-2.5 h-2.5 animate-ping text-emerald-400" />
                      LIVE API
                    </span>
                  </h2>
                </div>
                <p className="text-xs text-[#9cb497] flex items-center gap-2">
                  <span>{t.mandiTerminalSubtitle}</span>
                  <span className="text-amber-400/90 font-medium">({selectedCrop.name[language]})</span>
                </p>
              </div>
            </div>

            {/* Top Right Controls: Refresh Feed & Prominent X Close Button */}
            <div className="flex items-center gap-2.5">
              
              {/* Re-scrape Button */}
              <button
                onClick={loadData}
                disabled={isScraping}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#22331c] hover:bg-[#2b4123] border border-[#3d5634] hover:border-amber-400/60 text-xs font-medium text-[#d9ebd4] transition-all disabled:opacity-50 group"
                title={t.refreshTerminal}
              >
                <RefreshCw className={`w-3.5 h-3.5 text-amber-400 group-hover:rotate-180 transition-transform ${isScraping ? 'animate-spin' : ''}`} />
                <span>{t.refreshTerminal}</span>
              </button>

              {/* Prominent Close Button */}
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-[#22331c] hover:bg-rose-950/80 text-[#9cb497] hover:text-rose-300 border border-[#3d5634] hover:border-rose-500/60 transition-all duration-200 shadow-md group"
                aria-label="Close Mandi Terminal"
              >
                <X className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
            </div>

          </div>
        </div>

        {/* 2. Live Market Ticker (Marquee) - Black Background with Monospace Neon Green / Red */}
        <div className="w-full bg-[#000000] border-b border-[#253620] py-2 px-3 overflow-hidden select-none flex-shrink-0 relative z-10 shadow-inner">
          <div className="flex items-center">
            
            {/* Ticker Tag */}
            <div className="hidden md:flex items-center gap-1.5 bg-[#152012] text-amber-400 border border-amber-500/40 text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded mr-3 flex-shrink-0 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              MALWA APMC TICKER
            </div>

            {/* Continuous Scrolling Marquee */}
            <div className="flex-1 overflow-hidden">
              <div className="animate-ticker text-xs font-mono tracking-wider flex items-center space-x-6">
                
                {/* First loop of ticker data */}
                {(liveData?.ticker || [
                  { mandi: "Indore", price: 4820, trend: "+12" },
                  { mandi: "Dewas", price: 4790, trend: "-5" },
                  { mandi: "Sanwer", price: 4800, trend: "0" },
                  { mandi: "Ujjain", price: 4810, trend: "+8" },
                  { mandi: "Mhow", price: 4780, trend: "+15" },
                  { mandi: "Dhar", price: 4750, trend: "-10" }
                ]).map((item, i) => {
                  const isPositive = item.trend.startsWith('+');
                  const isZero = item.trend === '0' || item.trend === '— 0';
                  return (
                    <div key={`tick-1-${i}`} className="flex items-center gap-1.5 whitespace-nowrap">
                      <span className="text-gray-300 font-bold uppercase">{item.mandi}:</span>
                      <span className="text-white font-semibold">₹{item.price.toLocaleString('en-IN')}</span>
                      <span className={`inline-flex items-center text-[11px] font-bold ${
                        isPositive 
                          ? 'text-[#22c55e]' 
                          : isZero 
                            ? 'text-amber-400' 
                            : 'text-[#ef4444]'
                      }`}>
                        {isPositive ? '▲' : isZero ? '—' : '▼'} {item.trend}
                      </span>
                      <span className="text-[#3b5233] ml-3">•</span>
                    </div>
                  );
                })}

                {/* Duplicate loop for seamless infinite marquee loop */}
                {(liveData?.ticker || [
                  { mandi: "Indore", price: 4820, trend: "+12" },
                  { mandi: "Dewas", price: 4790, trend: "-5" },
                  { mandi: "Sanwer", price: 4800, trend: "0" },
                  { mandi: "Ujjain", price: 4810, trend: "+8" },
                  { mandi: "Mhow", price: 4780, trend: "+15" },
                  { mandi: "Dhar", price: 4750, trend: "-10" }
                ]).map((item, i) => {
                  const isPositive = item.trend.startsWith('+');
                  const isZero = item.trend === '0' || item.trend === '— 0';
                  return (
                    <div key={`tick-2-${i}`} className="flex items-center gap-1.5 whitespace-nowrap">
                      <span className="text-gray-300 font-bold uppercase">{item.mandi}:</span>
                      <span className="text-white font-semibold">₹{item.price.toLocaleString('en-IN')}</span>
                      <span className={`inline-flex items-center text-[11px] font-bold ${
                        isPositive 
                          ? 'text-[#22c55e]' 
                          : isZero 
                            ? 'text-amber-400' 
                            : 'text-[#ef4444]'
                      }`}>
                        {isPositive ? '▲' : isZero ? '—' : '▼'} {item.trend}
                      </span>
                      <span className="text-[#3b5233] ml-3">•</span>
                    </div>
                  );
                })}

              </div>
            </div>

          </div>
        </div>

        {/* Scrollable Terminal Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* High-Tech Loading Skeleton Screen (Shown during simulated 1s scraper execution) */}
          {isScraping ? (
            <div className="w-full h-full min-h-[380px] flex flex-col items-center justify-center p-6 text-center space-y-5 rounded-2xl bg-[#162214]/80 border border-[#304429]">
              
              {/* Radar Scanner Animation */}
              <div className="relative w-20 h-20 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-amber-400/40 animate-spin" />
                <div className="absolute inset-2 rounded-full border border-emerald-500/30 animate-ping" />
                <div className="w-12 h-12 rounded-full bg-emerald-950/80 border border-emerald-500/60 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                  <Radio className="w-6 h-6 text-emerald-400 animate-pulse" />
                </div>
              </div>

              {/* Terminal Connection Text */}
              <div className="space-y-1.5">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-wide animate-pulse">
                  {t.mandiConnecting}
                </h3>
                <p className="text-xs text-[#9cb497] font-mono">
                  {t.mandiConnectingSub}
                </p>
              </div>

              {/* Simulated Terminal Telemetry Logs */}
              <div className="w-full max-w-md bg-[#0a1107] p-3 rounded-xl border border-[#2b3e25] font-mono text-[11px] text-left space-y-1 text-[#86a381]">
                <div className="flex items-center gap-2 text-emerald-400">
                  <span>✓</span>
                  <span>TLS 1.3 handshake: api.agmarknet.gov.in:443</span>
                </div>
                <div className="flex items-center gap-2 text-amber-300">
                  <span className="animate-spin text-amber-400">⏳</span>
                  <span>Fetching Mandi spot arrivals for Indore & Malwa Division...</span>
                </div>
                <div className="text-[#597554]">
                  <span>&gt; Parsing transport haulage matrix: INR 1.50/km/qtl</span>
                </div>
              </div>

              {/* Skeleton Bars */}
              <div className="w-full max-w-md space-y-2">
                <div className="h-2 bg-[#22331c] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 w-3/4 animate-pulse" />
                </div>
              </div>

            </div>
          ) : (
            <>
              {/* SECTION 1: 30-Day Volatility & Trend (Glowing Amber Spline Area Chart) */}
              <div className="w-full bg-[#182414] rounded-2xl p-4 sm:p-5 border border-[#304429] shadow-xl relative overflow-hidden">
                
                {/* Header & Chart Legend */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]" />
                      <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">
                        {t.chartTitle}
                      </h3>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-600/40 font-mono">
                        30D Spline
                      </span>
                    </div>
                    <p className="text-xs text-[#9cb497] mt-0.5">
                      {t.chartSubtitle}
                    </p>
                  </div>

                  {/* Benchmark & Hover Stats Badges */}
                  <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                    <div className="px-2.5 py-1 rounded-lg bg-[#22331c] border border-[#3d5634] text-xs">
                      <span className="text-[#9cb497]">30D Low: </span>
                      <strong className="text-white font-mono">₹4,500</strong>
                    </div>
                    <div className="px-2.5 py-1 rounded-lg bg-[#22331c] border border-[#3d5634] text-xs">
                      <span className="text-[#9cb497]">30D High: </span>
                      <strong className="text-emerald-400 font-mono">₹4,820</strong>
                    </div>
                    <div className="px-2.5 py-1 rounded-lg bg-amber-950/60 border border-amber-500/50 text-xs shadow-sm">
                      <span className="text-amber-300">Trend: </span>
                      <strong className="text-amber-400 font-mono">+7.1% ▲</strong>
                    </div>
                  </div>
                </div>

                {/* SVG Chart Container */}
                <div className="relative w-full overflow-x-auto">
                  <div className="min-w-[580px]">
                    <svg 
                      viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
                      className="w-full h-auto overflow-visible select-none"
                    >
                      <defs>
                        {/* Vertical linear gradient fading from amber to transparent */}
                        <linearGradient id="amberAreaGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.45" />
                          <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.12" />
                          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                        </linearGradient>

                        {/* Neon Glow Filter */}
                        <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="3.5" result="blur" />
                          <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                      </defs>

                      {/* Radar-style Background Grid Lines */}
                      <rect 
                        x={paddingX} 
                        y={paddingY} 
                        width={svgWidth - paddingX * 2} 
                        height={svgHeight - paddingY * 2} 
                        fill="#10170d" 
                        stroke="#263a20" 
                        strokeWidth="1" 
                        rx="8"
                      />

                      {/* Horizontal Grid lines with prices */}
                      {[4400, 4550, 4700, 4850].map((priceLevel) => {
                        const y = svgHeight - paddingY - ((priceLevel - minPrice) / (maxPrice - minPrice)) * (svgHeight - paddingY * 2);
                        return (
                          <g key={`grid-h-${priceLevel}`}>
                            <line 
                              x1={paddingX} 
                              y1={y} 
                              x2={svgWidth - paddingX} 
                              y2={y} 
                              stroke="#22331c" 
                              strokeWidth="1" 
                              strokeDasharray="4 4" 
                            />
                            <text 
                              x={paddingX - 8} 
                              y={y + 3} 
                              textAnchor="end" 
                              fill="#6f886a" 
                              fontSize="10" 
                              fontFamily="monospace"
                            >
                              ₹{priceLevel}
                            </text>
                          </g>
                        );
                      })}

                      {/* Area Fill Under Spline */}
                      {areaPath && (
                        <path 
                          d={areaPath} 
                          fill="url(#amberAreaGradient)" 
                        />
                      )}

                      {/* Glowing Neon Amber Spline Curve */}
                      {linePath && (
                        <path 
                          d={linePath} 
                          fill="none" 
                          stroke="#f59e0b" 
                          strokeWidth="3.5" 
                          strokeLinecap="round" 
                          filter="url(#neonGlow)" 
                        />
                      )}

                      {/* Data Point Nodes and Vertical Guides */}
                      {coords.map((item, idx) => {
                        const isHovered = hoveredPoint?.date === item.point.date;
                        return (
                          <g 
                            key={`point-${idx}`}
                            className="cursor-pointer group"
                            onMouseEnter={() => setHoveredPoint(item.point)}
                            onClick={() => setHoveredPoint(item.point)}
                          >
                            {/* Vertical Dotted Guide */}
                            <line 
                              x1={item.x} 
                              y1={paddingY} 
                              x2={item.x} 
                              y2={svgHeight - paddingY} 
                              stroke={isHovered ? "#f59e0b" : "#22331c"} 
                              strokeWidth={isHovered ? "1.5" : "1"} 
                              strokeDasharray="3 3" 
                            />

                            {/* Outer Pulse Ring on Active/Hover */}
                            {isHovered && (
                              <circle 
                                cx={item.x} 
                                cy={item.y} 
                                r="10" 
                                fill="none" 
                                stroke="#f59e0b" 
                                strokeWidth="2" 
                                opacity="0.6" 
                                className="animate-ping"
                              />
                            )}

                            {/* Node Dot */}
                            <circle 
                              cx={item.x} 
                              cy={item.y} 
                              r={isHovered ? "6" : "4.5"} 
                              fill={isHovered ? "#ffffff" : "#f59e0b"} 
                              stroke="#182414" 
                              strokeWidth="2.5" 
                              filter="url(#neonGlow)" 
                            />

                            {/* X-Axis Date Label */}
                            <text 
                              x={item.x} 
                              y={svgHeight - paddingY + 16} 
                              textAnchor="middle" 
                              fill={isHovered ? "#f59e0b" : "#9cb497"} 
                              fontSize="11" 
                              fontWeight={isHovered ? "bold" : "normal"}
                              fontFamily="monospace"
                            >
                              {item.point.date}
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                </div>

                {/* Floating Interactive Tooltip Bar */}
                {hoveredPoint && (
                  <div className="mt-3 p-3 rounded-xl bg-[#0f170c] border border-amber-500/50 flex flex-wrap items-center justify-between gap-3 text-xs shadow-lg">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      <span className="text-[#9cb497]">{t.chartDate}:</span>
                      <strong className="text-white font-mono text-sm">{hoveredPoint.date}</strong>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[#9cb497]">{t.chartPrice}:</span>
                      <strong className="text-amber-400 font-mono text-sm font-bold">
                        ₹{hoveredPoint.price.toLocaleString('en-IN')} / Qtl
                      </strong>
                    </div>

                    {hoveredPoint.ratio && (
                      <div className="flex items-center gap-2">
                        <span className="text-[#9cb497]">{t.chartRatio}:</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 font-mono font-bold border border-emerald-600/40">
                          {hoveredPoint.ratio}x
                        </span>
                      </div>
                    )}
                  </div>
                )}

              </div>

              {/* SECTION: Visual Analytics (Net Realization Donut & Mandi Arrival Pie) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                
                {/* 1. Net Realization Breakdown (Donut Chart) */}
                <div className="bg-[#182414] rounded-2xl p-4 sm:p-5 border border-[#304429] shadow-xl flex flex-col justify-between relative overflow-hidden">
                  
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
                        <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">
                          {t.donutChartTitle}
                        </h3>
                      </div>
                      <p className="text-xs text-[#9cb497] mt-0.5">
                        {t.donutChartSubtitle}
                      </p>
                    </div>

                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-600/40">
                      ₹{grossBasePrice} Gross
                    </span>
                  </div>

                  {/* Donut Chart Ring + Interactive Segments */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 my-2">
                    
                    {/* SVG Circular Donut Chart */}
                    <div className="relative w-44 h-44 flex-shrink-0 flex items-center justify-center">
                      <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
                        {/* Background track */}
                        <circle
                          cx="100"
                          cy="100"
                          r="70"
                          fill="transparent"
                          stroke="#152012"
                          strokeWidth="20"
                        />
                        {/* Slices */}
                        {donutSegments.map((seg, idx) => {
                          const circumference = 2 * Math.PI * 70;
                          const cumulativePct = donutSegments.slice(0, idx).reduce((acc, s) => acc + s.percentage, 0);
                          const strokeDasharray = `${(seg.percentage / 100) * circumference} ${circumference}`;
                          const strokeDashoffset = `${-(cumulativePct / 100) * circumference}`;
                          const isSelected = activeDonutIndex === idx;

                          return (
                            <circle
                              key={`donut-seg-${idx}`}
                              cx="100"
                              cy="100"
                              r="70"
                              fill="transparent"
                              stroke={seg.color}
                              strokeWidth={isSelected ? 24 : 18}
                              strokeDasharray={strokeDasharray}
                              strokeDashoffset={strokeDashoffset}
                              className="cursor-pointer transition-all duration-300"
                              opacity={isSelected ? 1 : 0.82}
                              onClick={() => setActiveDonutIndex(idx)}
                              onMouseEnter={() => setActiveDonutIndex(idx)}
                              style={{
                                filter: isSelected ? `drop-shadow(0 0 8px ${seg.color})` : 'none'
                              }}
                            />
                          );
                        })}
                      </svg>

                      {/* Center Text in Donut Ring */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                        <span className="text-xl sm:text-2xl font-black font-mono text-white tracking-tight drop-shadow">
                          ₹{netInHandPrice.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider font-mono">
                          / {t.netPerQtl}
                        </span>
                        <span className="text-[9px] text-[#9cb497] font-medium">
                          Indore APMC
                        </span>
                      </div>
                    </div>

                    {/* Donut Legend Items */}
                    <div className="flex-1 w-full space-y-1.5 text-xs">
                      {donutSegments.map((seg, idx) => {
                        const isSelected = activeDonutIndex === idx;
                        return (
                          <div
                            key={`donut-legend-${idx}`}
                            onClick={() => setActiveDonutIndex(idx)}
                            className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                              isSelected 
                                ? 'bg-[#20321c] border-amber-500/60 shadow-sm' 
                                : 'bg-[#121c0e]/60 border-[#2b3e25] hover:bg-[#1b2a17]'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span 
                                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                style={{ backgroundColor: seg.color, boxShadow: isSelected ? `0 0 8px ${seg.color}` : 'none' }}
                              />
                              <span className={`font-medium ${isSelected ? 'text-white font-bold' : 'text-[#d9ebd4]'}`}>
                                {seg.label}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 font-mono">
                              <span className="text-[#9cb497] font-semibold">{seg.percentage}%</span>
                              <span className={`font-bold ${seg.isDeduction ? 'text-rose-300' : 'text-emerald-400'}`}>
                                {seg.isDeduction ? `-${seg.amount}` : `₹${seg.amount}`}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                  </div>

                  {/* Interactive Stat Pill Below Donut Ring (Highlights exact deduction) */}
                  <div className="mt-3 p-2.5 rounded-xl bg-[#0f170c] border border-[#304429] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span 
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0" 
                        style={{ backgroundColor: donutSegments[activeDonutIndex].color }}
                      />
                      <span className="text-[#cbd5e1] font-medium">
                        <strong className="text-white">{donutSegments[activeDonutIndex].label}</strong> ({donutSegments[activeDonutIndex].percentage}%):
                      </span>
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                      <span className={`font-bold text-sm ${donutSegments[activeDonutIndex].isDeduction ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {donutSegments[activeDonutIndex].isDeduction ? `-₹${donutSegments[activeDonutIndex].amount} / Qtl` : `₹${donutSegments[activeDonutIndex].amount} / Qtl Net`}
                      </span>
                    </div>
                  </div>

                </div>

                {/* 2. Mandi Arrival Quality (Mini Pie Chart) */}
                <div className="bg-[#182414] rounded-2xl p-4 sm:p-5 border border-[#304429] shadow-xl flex flex-col justify-between relative overflow-hidden">
                  
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]" />
                        <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">
                          {t.pieChartTitle}
                        </h3>
                      </div>
                      <p className="text-xs text-[#9cb497] mt-0.5">
                        {t.pieChartSubtitle}
                      </p>
                    </div>

                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-600/40">
                      1,450 Qtl Today
                    </span>
                  </div>

                  {/* Pie Chart & Interactive Slices */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 my-2">
                    
                    {/* SVG Pie Chart */}
                    <div className="relative w-44 h-44 flex-shrink-0 flex items-center justify-center">
                      <svg viewBox="0 0 190 190" className="w-full h-full overflow-visible">
                        {pieSlices.map((slice, idx) => {
                          const cumulativePct = pieSlices.slice(0, idx).reduce((acc, s) => acc + s.percentage, 0);
                          const path = getPieSlicePath(cumulativePct, slice.percentage, 75, 95, 95);
                          const isSelected = activePieIndex === idx;

                          return (
                            <path
                              key={`pie-slice-${idx}`}
                              d={path}
                              fill={slice.color}
                              stroke="#182414"
                              strokeWidth="2.5"
                              opacity={activePieIndex !== null ? (isSelected ? 1 : 0.65) : 0.95}
                              className="cursor-pointer transition-all duration-200 hover:opacity-100"
                              onClick={() => setActivePieIndex(activePieIndex === idx ? null : idx)}
                              onMouseEnter={() => setActivePieIndex(idx)}
                              style={{
                                filter: isSelected ? `drop-shadow(0 0 8px ${slice.color})` : 'none',
                                transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                                transformOrigin: '95px 95px',
                                transition: 'all 0.2s ease'
                              }}
                            />
                          );
                        })}
                      </svg>
                    </div>

                    {/* Pie Legend Items */}
                    <div className="flex-1 w-full space-y-1.5 text-xs">
                      {pieSlices.map((slice, idx) => {
                        const isSelected = activePieIndex === idx;
                        return (
                          <div
                            key={`pie-legend-${idx}`}
                            onClick={() => setActivePieIndex(activePieIndex === idx ? null : idx)}
                            className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                              isSelected 
                                ? 'bg-[#20321c] border-emerald-500/60 shadow-sm' 
                                : 'bg-[#121c0e]/60 border-[#2b3e25] hover:bg-[#1b2a17]'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span 
                                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                style={{ backgroundColor: slice.color, boxShadow: isSelected ? `0 0 8px ${slice.color}` : 'none' }}
                              />
                              <div>
                                <span className={`block font-medium ${isSelected ? 'text-white font-bold' : 'text-[#d9ebd4]'}`}>
                                  {slice.label}
                                </span>
                                <span className="text-[10px] text-[#6f886a]">
                                  {slice.status}
                                </span>
                              </div>
                            </div>
                            <div className="text-right font-mono font-bold text-white">
                              <span>{slice.volume}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                  </div>

                  {/* Quality Rules Tooltip / Notice Pill */}
                  <div className="mt-3 p-2.5 rounded-xl bg-[#0f170c] border border-amber-500/40 text-xs text-[#cbd5e1] space-y-1">
                    <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{t.arrivalQualityNotice}</span>
                    </div>
                    <p className="text-[11px] text-[#8ea888] pl-5">
                      {t.arrivalQualityNoticeSub}
                    </p>
                  </div>

                </div>

              </div>

              {/* SECTION 2: Colorful Tabular Matrix (The Profit Calculator) */}
              <div className="w-full bg-[#182414] rounded-2xl p-4 sm:p-5 border border-[#304429] shadow-xl space-y-3">
                
                {/* Table Title & Summary */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-emerald-400" />
                      <span>{t.tableTitle}</span>
                    </h3>
                    <p className="text-xs text-[#9cb497]">
                      {t.tableSubtitle}
                    </p>
                  </div>

                  <div className="text-xs text-[#6f886a] font-mono">
                    Showing 5 regional APMC hubs
                  </div>
                </div>

                {/* Table Container with Dark Moss-Green Rows & Sharp Borders */}
                <div className="overflow-x-auto rounded-xl border border-[#364e2e]">
                  <table className="w-full text-left text-xs border-collapse">
                    
                    {/* Table Header with Sort Triggers */}
                    <thead>
                      <tr className="bg-[#121c0e] border-b border-[#364e2e] text-[#9cb497] uppercase tracking-wider font-semibold">
                        
                        {/* Mandi Name */}
                        <th className="py-3 px-3 sm:px-4">
                          {t.colMandiName}
                        </th>

                        {/* Distance (Sortable) */}
                        <th 
                          onClick={() => toggleSort('distance')}
                          className="py-3 px-3 sm:px-4 cursor-pointer hover:text-amber-400 transition-colors select-none"
                        >
                          <div className="flex items-center gap-1">
                            <span>{t.colDistance}</span>
                            <ArrowUpDown className={`w-3 h-3 ${sortBy === 'distance' ? 'text-amber-400' : 'text-[#577252]'}`} />
                          </div>
                        </th>

                        {/* Gross Price (Sortable) */}
                        <th 
                          onClick={() => toggleSort('gross')}
                          className="py-3 px-3 sm:px-4 cursor-pointer hover:text-amber-400 transition-colors select-none"
                        >
                          <div className="flex items-center gap-1">
                            <span>{t.colGross}</span>
                            <ArrowUpDown className={`w-3 h-3 ${sortBy === 'gross' ? 'text-amber-400' : 'text-[#577252]'}`} />
                          </div>
                        </th>

                        {/* Transport Cost */}
                        <th className="py-3 px-3 sm:px-4 text-[#86a381]">
                          {t.colTransport}
                        </th>

                        {/* Net In-Hand (Highlighted Header) */}
                        <th 
                          onClick={() => toggleSort('net')}
                          className="py-3 px-3 sm:px-4 bg-[#23351d] text-emerald-300 font-bold cursor-pointer hover:text-white transition-colors select-none border-x border-[#3d5a34]"
                        >
                          <div className="flex items-center gap-1">
                            <span>{t.colNet}</span>
                            <ArrowUpDown className={`w-3 h-3 ${sortBy === 'net' ? 'text-emerald-400' : 'text-[#577252]'}`} />
                          </div>
                        </th>

                        {/* Status Badge */}
                        <th className="py-3 px-3 sm:px-4 text-center">
                          {t.colStatus}
                        </th>

                      </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody className="divide-y divide-[#2a3c24]">
                      {sortedTableData.map((item, idx) => {
                        const isOptimal = item.status === 'OPTIMAL';
                        return (
                          <tr 
                            key={item.id}
                            className={`transition-colors duration-150 ${
                              idx % 2 === 0 ? 'bg-[#1b2716]' : 'bg-[#162112]'
                            } hover:bg-[#22341c]`}
                          >
                            
                            {/* Mandi Name + Location Marker */}
                            <td className="py-3 px-3 sm:px-4">
                              <div className="flex items-center gap-2">
                                <MapPin className={`w-3.5 h-3.5 flex-shrink-0 ${isOptimal ? 'text-emerald-400' : 'text-amber-400'}`} />
                                <div>
                                  <span className="font-bold text-white block">
                                    {item.name}
                                  </span>
                                  {item.arrival && (
                                    <span className="text-[10px] text-[#6f886a] font-mono">
                                      Arrival: {item.arrival}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* Distance */}
                            <td className="py-3 px-3 sm:px-4 font-mono text-[#cbd5e1]">
                              {item.distance} km
                            </td>

                            {/* Gross Price */}
                            <td className="py-3 px-3 sm:px-4 font-mono font-medium text-white">
                              ₹{item.gross.toLocaleString('en-IN')}
                            </td>

                            {/* Transport Cost */}
                            <td className="py-3 px-3 sm:px-4 font-mono text-rose-300">
                              -₹{item.transportCost}
                            </td>

                            {/* Net In-Hand (Highlighted with Lighter Background & Bright Green Bold Text) */}
                            <td className="py-3 px-3 sm:px-4 bg-[#263a20]/75 border-x border-[#3d5a34]">
                              <div className="flex items-center justify-between">
                                <span className="text-emerald-400 font-mono font-black text-sm sm:text-base tracking-wide drop-shadow-[0_0_8px_rgba(16,185,129,0.35)]">
                                  ₹{item.net.toLocaleString('en-IN')}
                                </span>
                                {isOptimal && (
                                  <span className="text-[10px] text-emerald-400 font-mono uppercase bg-emerald-950 px-1 rounded">
                                    Best Net
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Color-Coded Status Badge */}
                            <td className="py-3 px-3 sm:px-4 text-center">
                              {isOptimal ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold font-mono tracking-wider bg-emerald-950/90 text-emerald-300 border border-emerald-500/70 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                                  {t.statusOptimal}
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold font-mono tracking-wider bg-amber-950/90 text-amber-300 border border-amber-500/70">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                  {t.statusWarning}
                                </span>
                              )}
                            </td>

                          </tr>
                        );
                      })}
                    </tbody>

                  </table>
                </div>

                {/* Footer Note */}
                <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#6f886a] pt-1 px-1">
                  <span>* Transport costs estimated at ₹1.50 per km/quintal from your farm coordinates.</span>
                  {liveData?.scrapedAt && (
                    <span className="font-mono">Last Scraped: {liveData.scrapedAt}</span>
                  )}
                </div>

              </div>
            </>
          )}

        </div>

      </div>
    </>
  );
};

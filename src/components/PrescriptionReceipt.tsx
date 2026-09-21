import React, { useState, useEffect } from 'react';
import { Printer, CheckCircle2, AlertTriangle, ShieldCheck, Download } from 'lucide-react';
import { CropData, Language } from '../types';
import { translations, FERTILIZER_PRICES } from '../data/cropData';

interface PrescriptionReceiptProps {
  crop: CropData;
  landSize: number;
  language: Language;
}

export const PrescriptionReceipt: React.FC<PrescriptionReceiptProps> = ({
  crop,
  landSize,
  language
}) => {
  const t = translations[language];
  const [copiedToast, setCopiedToast] = useState(false);

  // Dynamic receipt serial ID generated from timestamp whenever calculation (crop/landSize) changes
  const [serialId, setSerialId] = useState(() => `#AG-${Date.now().toString().slice(-6)}`);

  useEffect(() => {
    setSerialId(`#AG-${Date.now().toString().slice(-6)}`);
  }, [crop.id, landSize]);

  // Dynamic bag calculations
  const ureaBags = parseFloat((crop.bagMultipliers.urea * landSize).toFixed(2));
  const dapBags = parseFloat((crop.bagMultipliers.dap * landSize).toFixed(2));
  const mopBags = parseFloat((crop.bagMultipliers.mop * landSize).toFixed(2));

  // Total weight in kg (50kg standard bag)
  const ureaKg = Math.round(ureaBags * 50);
  const dapKg = Math.round(dapBags * 50);
  const mopKg = Math.round(mopBags * 50);

  // Estimated subsidized total cost (INR)
  const estCostUrea = Math.round(ureaBags * FERTILIZER_PRICES.urea);
  const estCostDap = Math.round(dapBags * FERTILIZER_PRICES.dap);
  const estCostMop = Math.round(mopBags * FERTILIZER_PRICES.mop);
  const totalCost = estCostUrea + estCostDap + estCostMop;

  // Formatted date
  const currentDate = new Date().toLocaleDateString(
    language === 'HI' ? 'hi-IN' : language === 'MR' ? 'mr-IN' : 'en-IN',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }
  );

  // Native browser print handler
  const handlePrint = () => {
    window.print();
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 3000);
  };

  // Alternating thin & thick barcode bar widths for CSS borders
  const barcodePattern = [
    2, 1, 3, 1, 4, 1, 2, 3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 4, 1, 2, 3, 1, 4, 2, 1, 3, 2, 1, 4, 1, 2
  ];

  return (
    <div className="w-full relative group">
      
      {/* Sawtooth / Perforated Top Edge */}
      <div className="receipt-zigzag-top"></div>

      {/* Main Perforated Receipt Body */}
      <div className="bg-[#fcfaf4] text-[#1f2937] p-5 sm:p-6 shadow-receipt rounded-none relative font-sans border-x border-[#e5dfd3]">
        
        {/* Perforation decorative cut dots on sides */}
        <div className="absolute top-0 left-0 bottom-0 w-2 flex flex-col justify-between py-6 pointer-events-none opacity-20">
          {Array.from({ length: 18 }).map((_, i) => (
            <span key={i} className="w-1.5 h-1.5 rounded-full bg-black"></span>
          ))}
        </div>
        <div className="absolute top-0 right-0 bottom-0 w-2 flex flex-col justify-between py-6 pointer-events-none opacity-20">
          {Array.from({ length: 18 }).map((_, i) => (
            <span key={i} className="w-1.5 h-1.5 rounded-full bg-black"></span>
          ))}
        </div>

        {/* Top Header & Mock Scannable QR Code */}
        <div className="flex items-start justify-between border-b-2 border-dashed border-[#d1c7b7] pb-4 mb-4">
          <div className="space-y-1 pr-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block"></span>
              <span className="text-[10px] font-mono tracking-widest text-[#6b7280] uppercase font-bold">
                AgriSmart Digital Lab
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black tracking-tight text-[#111827] uppercase font-mono">
              {t.prescription}
            </h2>
            <p className="text-[11px] text-[#4b5563] font-medium leading-tight">
              {t.govtSub}
            </p>
          </div>

          {/* Authentic Mock QR Code Graphic */}
          <div className="flex-shrink-0 bg-white p-1.5 rounded-lg border border-[#e5dfd3] shadow-sm flex flex-col items-center">
            <svg className="w-14 h-14" viewBox="0 0 100 100" fill="#111827">
              {/* Top-Left Finder Pattern */}
              <rect x="5" y="5" width="28" height="28" fill="#111827" rx="3" />
              <rect x="9" y="9" width="20" height="20" fill="#ffffff" rx="1" />
              <rect x="13" y="13" width="12" height="12" fill="#111827" />

              {/* Top-Right Finder Pattern */}
              <rect x="67" y="5" width="28" height="28" fill="#111827" rx="3" />
              <rect x="71" y="9" width="20" height="20" fill="#ffffff" rx="1" />
              <rect x="75" y="13" width="12" height="12" fill="#111827" />

              {/* Bottom-Left Finder Pattern */}
              <rect x="5" y="67" width="28" height="28" fill="#111827" rx="3" />
              <rect x="9" y="71" width="20" height="20" fill="#ffffff" rx="1" />
              <rect x="13" y="75" width="12" height="12" fill="#111827" />

              {/* Timing & Data Pattern Matrix */}
              <rect x="38" y="8" width="6" height="6" />
              <rect x="48" y="8" width="6" height="6" />
              <rect x="38" y="18" width="6" height="6" />
              <rect x="52" y="18" width="6" height="6" />
              <rect x="44" y="28" width="6" height="6" />
              
              <rect x="8" y="38" width="6" height="6" />
              <rect x="18" y="44" width="6" height="6" />
              <rect x="28" y="38" width="6" height="6" />

              {/* Center AgriSmart Brand Pixel */}
              <rect x="38" y="38" width="10" height="10" fill="#15803d" />
              <rect x="52" y="38" width="6" height="6" />
              <rect x="62" y="44" width="8" height="8" />
              <rect x="74" y="38" width="6" height="6" />
              <rect x="86" y="44" width="6" height="6" />

              <rect x="38" y="52" width="6" height="6" />
              <rect x="48" y="62" width="8" height="6" />
              <rect x="62" y="56" width="6" height="6" />
              <rect x="78" y="56" width="6" height="6" />

              <rect x="38" y="72" width="6" height="6" />
              <rect x="48" y="76" width="6" height="6" />
              <rect x="62" y="72" width="8" height="8" />
              <rect x="74" y="78" width="8" height="6" />
              <rect x="86" y="72" width="6" height="6" />
            </svg>
            <span className="text-[8px] font-mono font-bold text-[#6b7280] mt-0.5 tracking-tighter">
              SCAN-TO-ORDER
            </span>
          </div>
        </div>

        {/* Metadata Bar */}
        <div className="grid grid-cols-2 gap-2 bg-[#f4ede1] p-2.5 rounded-lg border border-[#e5dfd3] mb-4 text-xs font-mono">
          <div>
            <span className="text-[#6b7280] block text-[10px] uppercase">{t.issuedDate}</span>
            <span className="font-bold text-[#111827]">{currentDate}</span>
          </div>
          <div className="text-right">
            <span className="text-[#6b7280] block text-[10px] uppercase">{t.serialId}</span>
            <span className="font-bold text-emerald-800">{serialId}</span>
          </div>
          <div>
            <span className="text-[#6b7280] block text-[10px] uppercase">{t.cropSelect}</span>
            <span className="font-bold text-[#111827]">
              {crop.name.EN} ({crop.name[language]})
            </span>
          </div>
          <div className="text-right">
            <span className="text-[#6b7280] block text-[10px] uppercase">{t.fieldCoverage}</span>
            <span className="font-bold text-amber-700">
              {landSize.toFixed(1)} {t.acres}
            </span>
          </div>
        </div>

        {/* Fertilizer Breakdown Section */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between border-b border-[#e5dfd3] pb-1">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#111827] font-mono">
              {t.commercialBags}
            </h4>
            <span className="text-[10px] font-mono text-[#6b7280]">
              {t.weightEquivalent}
            </span>
          </div>

          {/* Fertilizer Line Items */}
          <div className="space-y-2 text-xs">
            
            {/* DAP Item */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-[#faf7ef] border border-[#ebe5d8]">
              <div className="space-y-0.5">
                <div className="font-bold text-[#111827] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>
                  <span>{t.dap} (18-46-0)</span>
                </div>
                <div className="text-[11px] text-[#6b7280] font-mono">
                  Basal Starter Dose • ~{dapKg} kg total
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-sm font-black text-[#111827]">
                  {dapBags} {dapBags === 1 ? t.bag : t.bags}
                </div>
                <div className="text-[10px] font-mono text-[#6b7280]">
                  ₹{estCostDap.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* Urea Item */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-[#faf7ef] border border-[#ebe5d8]">
              <div className="space-y-0.5">
                <div className="font-bold text-[#111827] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block"></span>
                  <span>{t.urea} (46% N)</span>
                </div>
                <div className="text-[11px] text-[#6b7280] font-mono">
                  Split Top-Dressing • ~{ureaKg} kg total
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-sm font-black text-[#111827]">
                  {ureaBags} {ureaBags === 1 ? t.bag : t.bags}
                </div>
                <div className="text-[10px] font-mono text-[#6b7280]">
                  ₹{estCostUrea.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* MOP Potash Item */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-[#faf7ef] border border-[#ebe5d8]">
              <div className="space-y-0.5">
                <div className="font-bold text-[#111827] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sky-600 inline-block"></span>
                  <span>{t.mop}</span>
                </div>
                <div className="text-[11px] text-[#6b7280] font-mono">
                  Muriate of Potash • ~{mopKg} kg total
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-sm font-black text-[#111827]">
                  {mopBags} {mopBags === 1 ? t.bag : t.bags}
                </div>
                <div className="text-[10px] font-mono text-[#6b7280]">
                  ₹{estCostMop.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

          </div>

          {/* Subtotal Calculation Strip */}
          <div className="pt-2 border-t-2 border-dashed border-[#d1c7b7] flex items-center justify-between font-mono">
            <span className="text-xs font-bold uppercase text-[#4b5563]">
              {t.totalEstCost}:
            </span>
            <span className="text-base font-black text-[#111827]">
              ₹{totalCost.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Timely Advice Box: Dynamic Actionable Advice */}
        <div className="bg-amber-50 rounded-xl p-3.5 border-2 border-amber-300 shadow-sm mb-4 relative overflow-hidden">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h5 className="text-xs font-black text-amber-900 tracking-wide uppercase font-mono">
                {t.timelyAdvice}
              </h5>
              <p className="text-xs font-medium text-amber-950 leading-relaxed">
                {crop.advice[language]}
              </p>
            </div>
          </div>
        </div>

        {/* Mock Barcode Graphic & Verification Stamp */}
        <div className="pt-2 border-t-2 border-dashed border-[#d1c7b7] text-center space-y-2">
          
          {/* Authentic Barcode with Alternating Thin & Thick CSS Borders */}
          <div className="flex justify-center items-center py-1">
            <div className="flex items-stretch h-11 px-3 py-1 bg-white rounded border border-[#e5dfd3] gap-[3px]">
              {barcodePattern.map((width, idx) => (
                <div
                  key={idx}
                  className="bg-[#111827]"
                  style={{ width: `${width}px` }}
                />
              ))}
            </div>
          </div>

          <div className="text-[10px] font-mono font-bold tracking-widest text-[#4b5563]">
            * {serialId.replace('#', '')} *
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[10px] text-emerald-800 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>{t.scanNotice}</span>
          </div>
        </div>

        {/* Action Button: Print / Save */}
        <div className="mt-4 pt-3 border-t border-[#e5dfd3] no-print">
          <button
            onClick={handlePrint}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-800 to-emerald-950 hover:from-emerald-700 hover:to-emerald-900 text-white font-bold text-xs sm:text-sm tracking-wide shadow-md hover:shadow-lg transition-all transform active:scale-98 group cursor-pointer"
          >
            <Printer className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            <span>{t.printSave}</span>
            <Download className="w-3.5 h-3.5 opacity-70 ml-1" />
          </button>

          {copiedToast && (
            <div className="mt-2 text-center text-xs font-bold text-emerald-800 flex items-center justify-center gap-1 animate-bounce">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>Opening print dialog for PDF export...</span>
            </div>
          )}
        </div>

      </div>

      {/* Sawtooth / Perforated Bottom Edge */}
      <div className="receipt-zigzag-bottom"></div>

    </div>
  );
};

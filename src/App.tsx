import { useState } from 'react';
import { Header } from './components/Header';
import { CropSelector } from './components/CropSelector';
import { FieldGridSlider } from './components/FieldGridSlider';
import { GovtSchemes } from './components/GovtSchemes';
import { NutrientGauges } from './components/NutrientGauges';
import { ActionChips } from './components/ActionChips';
import { PrescriptionReceipt } from './components/PrescriptionReceipt';
import { Modals } from './components/Modals';
import { MandiDrawer } from './components/MandiDrawer';
import { CROPS, translations } from './data/cropData';
import { CropData, Language } from './types';
import { Sprout, Sparkles, CloudSun, ShieldCheck } from 'lucide-react';

export function App() {
  const [selectedCrop, setSelectedCrop] = useState<CropData>(CROPS[0]); // Soybean by default
  const [landSize, setLandSize] = useState<number>(2.0); // 2.0 Acres by default
  const [language, setLanguage] = useState<Language>('EN');
  const [activeModal, setActiveModal] = useState<'suppliers' | 'mandi' | 'voice' | null>(null);
  const [isMandiDrawerOpen, setIsMandiDrawerOpen] = useState<boolean>(false);

  const t = translations[language];

  return (
    <div className="min-h-screen bg-[#152012] text-[#f0fdf4] flex flex-col antialiased selection:bg-amber-500 selection:text-black relative">
      
      {/* Background Decorative Mesh Gradients */}
      <div className="fixed inset-0 pointer-events-none opacity-30 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-700/20 blur-[120px]"></div>
        <div className="absolute top-[30%] right-[-10%] w-[600px] h-[600px] rounded-full bg-amber-600/10 blur-[140px]"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] rounded-full bg-lime-600/15 blur-[120px]"></div>
      </div>

      {/* Top Sticky Header with Web Speech API & Multilingual Engine */}
      <Header
        currentLanguage={language}
        onLanguageChange={setLanguage}
        selectedCrop={selectedCrop}
        onSelectCrop={setSelectedCrop}
        landSize={landSize}
        onLandSizeChange={setLandSize}
      />

      {/* Top Banner / Weather & Status Ticker */}
      <div className="w-full bg-[#182414] border-b border-[#304429] px-4 py-2 no-print">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between text-xs text-[#9cb497] gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-emerald-300 font-medium">
              <CloudSun className="w-4 h-4 text-amber-400" />
              <span>Indore Weather: <strong>29°C Partly Cloudy</strong></span>
            </span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:inline text-[#6f886a]">
              Soil Moisture Index: <strong className="text-lime-400">68% (Optimal)</strong>
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px]">
            <span className="flex items-center gap-1 bg-emerald-950/80 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-800/50">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              DBT Fertilizer Subsidy 2026 Active
            </span>
            <span className="text-[#6f886a] hidden sm:inline font-mono">
              v2.6 Live
            </span>
          </div>
        </div>
      </div>

      {/* Main Dashboard Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 relative z-10">
        
        {/* Two-Column Desktop / Stacks on Tablet & Mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: Controls & Visualizations (approx 65% width / 8 of 12 cols on desktop) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6 no-print">
            
            {/* 1. Crop Selector Carousel */}
            <CropSelector
              selectedCrop={selectedCrop}
              onSelectCrop={setSelectedCrop}
              language={language}
            />

            {/* 2. Tactile Land Size Slider & Dynamic 2D Field Grid */}
            <FieldGridSlider
              landSize={landSize}
              onLandSizeChange={setLandSize}
              selectedCrop={selectedCrop}
              language={language}
            />

            {/* 3. Government Grants & Schemes Engine (New Panel below 2D Field Grid) */}
            <GovtSchemes
              landSize={landSize}
              selectedCrop={selectedCrop}
              language={language}
            />

            {/* 4. Nutrient Requirement Gauges (N-P-K) */}
            <NutrientGauges
              crop={selectedCrop}
              landSize={landSize}
              language={language}
            />

            {/* 5. Contextual Action Chips (Bottom) */}
            <ActionChips
              onOpenSuppliers={() => setActiveModal('suppliers')}
              onOpenMandi={() => setIsMandiDrawerOpen(true)}
              onOpenVoice={() => setActiveModal('voice')}
              selectedCrop={selectedCrop}
              language={language}
            />

          </div>

          {/* RIGHT COLUMN: Digital Prescription Receipt (approx 35% width / 4-5 of 12 cols on desktop) */}
          <div className="lg:col-span-5 xl:col-span-4 sticky top-24 print-receipt-only">
            
            {/* Header Badge */}
            <div className="flex items-center justify-between mb-2 px-1 text-xs no-print">
              <span className="font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                {t.prescription}
              </span>
              <span className="text-[11px] font-mono text-[#9cb497]">
                Real-Time Auto-Generated
              </span>
            </div>

            {/* Digital Perforated Paper Receipt */}
            <PrescriptionReceipt
              crop={selectedCrop}
              landSize={landSize}
              language={language}
            />

          </div>

        </div>

      </main>

      {/* Live Mandi Intelligence Bottom Sliding Drawer (85vh) */}
      <MandiDrawer
        isOpen={isMandiDrawerOpen}
        onClose={() => setIsMandiDrawerOpen(false)}
        language={language}
        selectedCrop={selectedCrop}
      />

      {/* Global Modals */}
      <Modals
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
        language={language}
        onSelectCrop={setSelectedCrop}
        onSelectLandSize={setLandSize}
      />

      {/* Footer */}
      <footer className="w-full bg-[#111a0e] border-t border-[#2d4026] py-5 px-4 sm:px-6 text-center text-xs text-[#6f886a] no-print mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sprout className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-[#f0fdf4]">AgriSmart {t.tagline}</span>
            <span>• Department of Agriculture & Farmers Welfare Guidelines</span>
          </div>
          <p className="font-mono text-[11px] text-[#9cb497]">
            Empowering Farmers with Soil-Calibrated N-P-K Intelligence & DBT Grants
          </p>
        </div>
      </footer>

    </div>
  );
}

export default App;

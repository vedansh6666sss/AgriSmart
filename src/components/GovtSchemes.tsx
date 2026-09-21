import React, { useState, useEffect } from 'react';
import { Landmark, ExternalLink, CheckCircle2, ShieldCheck, Sparkles, FileText, ArrowRight, X, Loader2 } from 'lucide-react';
import { CropData, Language, Scheme } from '../types';
import { translations, fetchGovernmentSchemes } from '../data/cropData';

interface GovtSchemesProps {
  landSize: number;
  selectedCrop: CropData;
  language: Language;
}

export const GovtSchemes: React.FC<GovtSchemesProps> = ({
  landSize,
  selectedCrop,
  language
}) => {
  const t = translations[language];
  const [activePortalModal, setActivePortalModal] = useState<Scheme | null>(null);
  const [applySuccessToast, setApplySuccessToast] = useState<string | null>(null);

  // Asynchronous schemes state & loading indicator
  const [isLoadingSchemes, setIsLoadingSchemes] = useState<boolean>(true);
  const [fetchedSchemes, setFetchedSchemes] = useState<Scheme[]>([]);

  // Asynchronous data fetching simulating data.gov.in API with 800ms latency
  useEffect(() => {
    let isCancelled = false;
    setIsLoadingSchemes(true);

    fetchGovernmentSchemes(selectedCrop.id, landSize)
      .then((schemes) => {
        if (!isCancelled) {
          setFetchedSchemes(schemes);
          setIsLoadingSchemes(false);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch government schemes:', err);
        if (!isCancelled) {
          setIsLoadingSchemes(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [selectedCrop.id, landSize]);

  const getSchemeName = (scheme: Scheme): string => {
    if (language === 'HI') return scheme.nameHI;
    if (language === 'MR') return scheme.nameMR;
    return scheme.nameEN;
  };

  const getSchemeBenefit = (scheme: Scheme): string => {
    if (language === 'HI' && scheme.benefitHI) return scheme.benefitHI;
    if (language === 'MR' && scheme.benefitMR) return scheme.benefitMR;
    return scheme.benefitEN;
  };

  const handleApplyClick = (scheme: Scheme) => {
    setActivePortalModal(scheme);
  };

  const handleConfirmApplication = (scheme: Scheme) => {
    setActivePortalModal(null);
    setApplySuccessToast(
      language === 'HI'
        ? `✅ "${scheme.nameHI}" हेतु सत्यापन अनुरोध Krishi Portal पर भेज दिया गया है!`
        : language === 'MR'
        ? `✅ "${scheme.nameMR}" साठी डीबीटी पडताळणी Krishi Portal कडे पाठवली आहे!`
        : `✅ Verification request for "${scheme.nameEN}" transmitted to DBT Agri Portal!`
    );
    setTimeout(() => setApplySuccessToast(null), 4000);
  };

  return (
    <div className="w-full bg-[#22331c]/80 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-[#3d5634] shadow-lg relative">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/20 border border-amber-400/40 text-amber-400">
              <Landmark className="w-4 h-4" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <span>{t.eligibleGovtSchemes}</span>
              {isLoadingSchemes ? (
                <span className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-bold rounded-full bg-amber-950/80 text-amber-300 border border-amber-700/50 animate-pulse">
                  <Loader2 className="w-3 h-3 animate-spin text-amber-400" />
                  SYNCING...
                </span>
              ) : (
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-full bg-emerald-950 text-emerald-400 border border-emerald-700/50 transition-all">
                  {fetchedSchemes.length} ACTIVE
                </span>
              )}
            </h3>
          </div>
          <p className="text-xs text-[#9cb497] mt-0.5">
            {isLoadingSchemes ? t.loadingSchemes : t.schemesSubtitle}
          </p>
        </div>

        {/* Live Filter Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#182214] border border-[#3d5634] text-xs text-[#9cb497] font-mono self-start sm:self-auto">
          <span>{selectedCrop.name[language]}</span>
          <span>•</span>
          <span className="text-amber-300 font-bold">{landSize.toFixed(1)} {t.acres}</span>
        </div>
      </div>

      {/* Schemes Content Area */}
      {isLoadingSchemes ? (
        /* UI Loading Skeleton (2 or 3 blank cards with pulsing animation) */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Array.from({ length: 2 }).map((_, idx) => (
            <div
              key={idx}
              className="animate-pulse bg-green-800/20 border border-green-800/40 rounded-xl p-4 h-28 w-full flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-green-700/30"></div>
                    <div className="w-36 h-4 rounded bg-green-700/40"></div>
                  </div>
                  <div className="w-20 h-4 rounded bg-green-700/30"></div>
                </div>
                <div className="w-5/6 h-3 rounded bg-green-700/20 mt-2"></div>
                <div className="w-3/4 h-3 rounded bg-green-700/20"></div>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-green-800/30">
                <div className="w-24 h-3 rounded bg-green-700/30"></div>
                <div className="w-20 h-6 rounded bg-green-700/40"></div>
              </div>
            </div>
          ))}
        </div>
      ) : fetchedSchemes.length > 0 ? (
        /* Rendered Fetched Scheme Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {fetchedSchemes.map((scheme) => {
            const schemeName = getSchemeName(scheme);
            const schemeBenefit = getSchemeBenefit(scheme);
            const isUniversal = scheme.crop === 'all';

            return (
              <div
                key={scheme.id}
                className="bg-[#1a2815]/90 rounded-xl p-3.5 border border-[#3d5634] hover:border-amber-400/80 transition-all duration-200 flex flex-col justify-between group shadow-inner"
              >
                <div>
                  {/* Top Bar: Icon + Title + Max Acre Tag */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5 p-1.5 rounded-lg bg-[#152012] border border-[#3d5634] text-amber-400 group-hover:scale-105 transition-transform flex-shrink-0">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors leading-snug">
                          {schemeName}
                        </h4>
                        <span className="text-[10px] font-mono text-[#6f886a]">
                          {scheme.schemeCode}
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#152012] text-amber-300 border border-amber-500/30 whitespace-nowrap">
                      {isUniversal ? t.forAllCrops : `${t.maxAcresLimit}: ${scheme.maxAcres} Ac`}
                    </span>
                  </div>

                  {/* Benefit Description */}
                  <p className="text-xs text-[#9cb497] leading-relaxed my-2 pl-7">
                    {schemeBenefit}
                  </p>
                </div>

                {/* Card Action Footer */}
                <div className="pt-2.5 mt-2 border-t border-[#3d5634]/60 flex items-center justify-between pl-7">
                  <span className="text-[10px] text-emerald-400/90 font-medium flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>Direct DBT Support</span>
                  </span>

                  <button
                    onClick={() => handleApplyClick(scheme)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#22331c] hover:bg-amber-500 hover:text-black border border-amber-400/60 text-amber-300 text-xs font-bold transition-all duration-200 shadow-sm group/btn"
                  >
                    <span>{t.applyGovIn}</span>
                    <ExternalLink className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-6 rounded-xl bg-[#182214] border border-[#3d5634] text-center text-xs text-[#9cb497]">
          {t.noSchemesFound}
        </div>
      )}

      {/* Floating Success Notification */}
      {applySuccessToast && (
        <div className="mt-3 p-3 rounded-xl bg-emerald-500/20 border border-emerald-400/50 text-emerald-200 text-xs font-medium flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{applySuccessToast}</span>
        </div>
      )}

      {/* Interactive Official .gov.in Application Simulation Modal */}
      {activePortalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-[#182414] border-2 border-amber-400/80 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#3d5634] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-400">
                  <Landmark className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                    Official Govt Portal Gateway
                  </span>
                  <h4 className="text-base font-bold text-white">
                    {getSchemeName(activePortalModal)}
                  </h4>
                </div>
              </div>
              <button
                onClick={() => setActivePortalModal(null)}
                className="p-1.5 rounded-lg bg-[#152012] text-[#9cb497] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Applicant Pre-Filled Verification Form */}
            <div className="bg-[#152012] rounded-xl p-4 border border-[#3d5634] space-y-2.5 text-xs font-mono">
              <div className="flex justify-between border-b border-[#3d5634]/60 pb-1.5">
                <span className="text-[#9cb497]">Farmer ID (Aadhaar Linked):</span>
                <span className="font-bold text-white">#IND-MP-88392-K</span>
              </div>
              <div className="flex justify-between border-b border-[#3d5634]/60 pb-1.5">
                <span className="text-[#9cb497]">Verified Acreage:</span>
                <span className="font-bold text-amber-300">{landSize.toFixed(1)} {t.acres} (Eligible &lt;= {activePortalModal.maxAcres} Ac)</span>
              </div>
              <div className="flex justify-between border-b border-[#3d5634]/60 pb-1.5">
                <span className="text-[#9cb497]">Target Crop:</span>
                <span className="font-bold text-emerald-300">{selectedCrop.name[language]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9cb497]">Direct Entitlement:</span>
                <span className="font-bold text-white">{getSchemeBenefit(activePortalModal)}</span>
              </div>
            </div>

            {/* Portal Action Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setActivePortalModal(null)}
                className="px-4 py-2 rounded-xl bg-[#22331c] hover:bg-[#2c4224] text-xs font-semibold text-white border border-[#3d5634]"
              >
                {t.close}
              </button>
              <button
                onClick={() => handleConfirmApplication(activePortalModal)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs shadow-glow-gold"
              >
                <FileText className="w-4 h-4" />
                <span>Transmit e-KYC & Apply</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

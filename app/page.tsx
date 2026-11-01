"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageContext";
import SchemeCard from "@/components/SchemeCard";
import DistrictCard from "@/components/DistrictCard";
import { STATIC_SCHEMES } from "@/lib/data/schemes";
import { MAHARASHTRA_DISTRICTS } from "@/lib/data/districts";
import {
  Sprout,
  Search,
  ArrowRight,
  ShieldCheck,
  Globe,
  Sparkles,
  CheckCircle,
  Milk,
  Utensils,
  Palette,
  Factory,
  ShoppingBag,
  Bot,
  ChevronRight,
} from "lucide-react";

export default function HomePage() {
  const { t, language } = useLanguage();
  // Instant load with static data fallback
  const [popularSchemes, setPopularSchemes] = useState<any[]>(STATIC_SCHEMES.slice(0, 6));
  const [districts, setDistricts] = useState<any[]>(MAHARASHTRA_DISTRICTS.slice(0, 8));
  const [selectedQuickCategory, setSelectedQuickCategory] = useState("dairy");

  const businessCategories = [
    { id: "agriculture", labelEn: "Agriculture", labelHi: "कृषि व्यवसाय", labelMr: "कृषी व्यवसाय", icon: Sprout },
    { id: "dairy", labelEn: "Dairy & Livestock", labelHi: "डेयरी एवं पशुपालन", labelMr: "दुग्धव्यवसाय", icon: Milk },
    { id: "food-processing", labelEn: "Food Processing", labelHi: "खाद्य प्रसंस्करण", labelMr: "अन्न प्रक्रिया", icon: Utensils },
    { id: "handicrafts", labelEn: "Handicrafts & Arts", labelHi: "हस्तशिल्प व कारीगर", labelMr: "हस्तकला", icon: Palette },
    { id: "manufacturing", labelEn: "Small Manufacturing", labelHi: "लघु उद्योग", labelMr: "लघुउद्योग", icon: Factory },
    { id: "retail-services", labelEn: "Retail & Services", labelHi: "दुकानें व सेवाएं", labelMr: "दुकाने व सेवा", icon: ShoppingBag },
  ];

  useEffect(() => {
    // Fetch popular schemes from API
    fetch("/api/schemes?limit=6")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.schemes && data.schemes.length > 0) {
          setPopularSchemes(data.schemes);
        }
      })
      .catch(() => {});

    // Fetch districts
    fetch("/api/districts")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.districts && data.districts.length > 0) {
          setDistricts(data.districts.slice(0, 8));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-16 pb-16">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-800 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Left Column Text */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-700/60 border border-emerald-500/40 text-emerald-200 text-xs font-bold shadow-xs">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>
                {language === 'hi' 
                  ? "महाराष्ट्र शासन एवं केंद्र की प्रमाणित योजनाएं" 
                  : language === 'mr' 
                  ? "महाराष्ट्र शासनाच्या अधिकृत योजनांची सुलभ माहिती" 
                  : "Verified Government Schemes of Maharashtra"}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black leading-tight tracking-tight">
              {t.heroHeading}
            </h1>

            <p className="text-base sm:text-lg text-emerald-100/90 max-w-2xl leading-relaxed">
              {t.heroSubheading}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Link
                href="/find-schemes"
                className="w-full sm:w-auto px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-base rounded-xl shadow-lg hover:shadow-amber-500/20 transition-all flex items-center justify-center gap-2 group"
              >
                <Search className="w-5 h-5 stroke-[2.5]" />
                <span>{t.findMyScheme}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/schemes"
                className="w-full sm:w-auto px-7 py-4 bg-emerald-800/80 hover:bg-emerald-800 text-white font-bold text-base rounded-xl border border-emerald-600/60 transition-all flex items-center justify-center gap-2"
              >
                <span>{t.exploreAllSchemes}</span>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-emerald-800/80 grid grid-cols-3 gap-4 text-left">
              <div>
                <span className="block text-2xl font-black text-amber-400">100%</span>
                <span className="text-xs text-emerald-200 font-medium">
                  {language === 'hi' ? "सत्यापित डेटा" : language === 'mr' ? "पडताळलेली माहिती" : "Verified Data"}
                </span>
              </div>
              <div>
                <span className="block text-2xl font-black text-amber-400">36</span>
                <span className="text-xs text-emerald-200 font-medium">
                  {language === 'hi' ? "महाराष्ट्र के ३६ जिले" : language === 'mr' ? "महाराष्ट्राचे ३६ जिल्हे" : "Maharashtra Districts"}
                </span>
              </div>
              <div>
                <span className="block text-2xl font-black text-amber-400">
                  {language === 'en' ? "3 Languages" : "३ भाषा"}
                </span>
                <span className="text-xs text-emerald-200 font-medium">मराठी | हिंदी | English</span>
              </div>
            </div>

          </div>

          {/* Right Column: Quick Scheme Finder Widget */}
          <div className="lg:col-span-5">
            <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-emerald-100 space-y-6">
              
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Sprout className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900">
                    {language === 'hi' ? "त्वरित योजना शोधक" : language === 'mr' ? "त्वरित योजना शोधक" : "Quick Scheme Finder"}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {t.quickFinderTitle}
                  </p>
                </div>
              </div>

              {/* Category Grid Pills */}
              <div className="grid grid-cols-2 gap-2.5">
                {businessCategories.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = selectedQuickCategory === cat.id;
                  const label = language === 'hi' ? cat.labelHi : language === 'mr' ? cat.labelMr : cat.labelEn;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedQuickCategory(cat.id)}
                      className={`flex items-center gap-2.5 p-3 rounded-xl border text-left text-xs font-bold transition-all ${
                        isSelected
                          ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50"
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isSelected ? "text-white" : "text-emerald-600"}`} />
                      <span className="truncate">{label}</span>
                    </button>
                  );
                })}
              </div>

              <Link
                href={`/find-schemes?category=${selectedQuickCategory}`}
                className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold rounded-xl shadow-md flex items-center justify-center gap-2 transition-colors text-sm"
              >
                <span>{t.findSuitableSchemes}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

            </div>
          </div>

        </div>
      </section>

      {/* WHY GRAMIN UDYAM SATHI (VALUE PROPOSITION) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            {t.featuresTitle}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium">
            {language === 'hi'
              ? "ग्रामीण महाराष्ट्र के नए उद्यमियों के लिए पारदर्शी, सटीक और सरल मार्गदर्शन प्रणाली।"
              : language === 'mr'
              ? "ग्रामीण महाराष्ट्रातील नवउद्योजकांसाठी पारदर्शक, अचूक व सोपी मार्गदर्शन प्रणाली."
              : "Transparent, accurate, and simple guidance for Maharashtra's rural entrepreneurs."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3 hover:border-emerald-300 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t.verifiedInfo}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{t.verifiedInfoDesc}</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3 hover:border-emerald-300 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t.localLanguages}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{t.localLanguagesDesc}</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3 hover:border-emerald-300 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t.smartRec}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{t.smartRecDesc}</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3 hover:border-emerald-300 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t.simpleGuidance}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{t.simpleGuidanceDesc}</p>
          </div>
        </div>
      </section>

      {/* POPULAR SCHEMES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {t.popularSchemes}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
              {language === 'hi'
                ? "महाराष्ट्र के नए उद्यमियों में सर्वाधिक लोकप्रिय सरकारी योजनाएं"
                : language === 'mr'
                ? "महाराष्ट्रातील नवउद्योजकांमध्ये सर्वाधिक लोकप्रिय असलेल्या सरकारी योजना"
                : "Top recommended verified government schemes for entrepreneurs"}
            </p>
          </div>

          <Link
            href="/schemes"
            className="hidden sm:flex items-center gap-1 text-sm font-extrabold text-emerald-700 dark:text-emerald-400 hover:text-emerald-900"
          >
            <span>{t.exploreAllSchemes}</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularSchemes.map((scheme) => (
            <SchemeCard key={scheme.id} scheme={scheme} />
          ))}
        </div>
      </section>

      {/* HOW IT WORKS (4-STEP PROCESS) */}
      <section className="bg-emerald-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black">{t.howItWorks}</h2>
            <p className="text-xs sm:text-sm text-emerald-200">
              {language === 'hi'
                ? "केवल ४ आसान चरणों में अपने व्यवसाय के लिए सही योजना खोजें और आवेदन करें"
                : language === 'mr'
                ? "फक्त ४ सोप्या टप्प्यांत तुमच्या व्यवसायासाठी योग्य योजना शोधा आणि अर्ज करा"
                : "Find the right scheme and apply in just 4 simple steps"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-emerald-950/60 p-6 rounded-2xl border border-emerald-700/50 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-lg">
                1
              </div>
              <h3 className="font-extrabold text-base text-amber-300">{t.step1Title}</h3>
              <p className="text-xs text-emerald-100/80 leading-relaxed">{t.step1Desc}</p>
            </div>

            <div className="bg-emerald-950/60 p-6 rounded-2xl border border-emerald-700/50 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-lg">
                2
              </div>
              <h3 className="font-extrabold text-base text-amber-300">{t.step2Title}</h3>
              <p className="text-xs text-emerald-100/80 leading-relaxed">{t.step2Desc}</p>
            </div>

            <div className="bg-emerald-950/60 p-6 rounded-2xl border border-emerald-700/50 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-lg">
                3
              </div>
              <h3 className="font-extrabold text-base text-amber-300">{t.step3Title}</h3>
              <p className="text-xs text-emerald-100/80 leading-relaxed">{t.step3Desc}</p>
            </div>

            <div className="bg-emerald-950/60 p-6 rounded-2xl border border-emerald-700/50 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-lg">
                4
              </div>
              <h3 className="font-extrabold text-base text-amber-300">{t.step4Title}</h3>
              <p className="text-xs text-emerald-100/80 leading-relaxed">{t.step4Desc}</p>
            </div>

          </div>

        </div>
      </section>

      {/* MAHARASHTRA DISTRICT EXPLORER PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {t.districtExplorerTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
              {t.districtExplorerSub}
            </p>
          </div>

          <Link
            href="/districts"
            className="flex items-center gap-1 text-sm font-extrabold text-emerald-700 dark:text-emerald-400 hover:text-emerald-900"
          >
            <span>
              {language === 'hi' ? "सभी ३६ जिले देखें" : language === 'mr' ? "सर्व ३६ जिल्हे पहा" : "View All 36 Districts"}
            </span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {districts.map((district) => (
            <DistrictCard key={district.slug || district.id} district={district} />
          ))}
        </div>
      </section>

      {/* GRAMIN UDYAM AI ASSISTANT CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-900 to-green-950 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl border border-emerald-700">
          
          <div className="space-y-4 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-800/80 text-emerald-200 rounded-full text-xs font-bold border border-emerald-600">
              <Bot className="w-4 h-4 text-amber-400" />
              <span>AI Sahayak for Entrepreneurs</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black">
              {t.aiAssistantTitle}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              {t.aiAssistantSub}
            </p>
          </div>

          <Link
            href="/ai-assistant"
            className="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg hover:shadow-amber-500/20 transition-all flex items-center gap-2 shrink-0"
          >
            <Bot className="w-5 h-5 stroke-[2.5]" />
            <span>{t.askAI}</span>
          </Link>

        </div>
      </section>

    </div>
  );
}

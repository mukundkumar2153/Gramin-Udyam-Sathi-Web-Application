"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/components/LanguageContext";
import SchemeCard from "@/components/SchemeCard";
import { STATIC_SCHEMES } from "@/lib/data/schemes";
import { MAHARASHTRA_DISTRICTS } from "@/lib/data/districts";
import { Search, Filter, RefreshCw, Grid, SlidersHorizontal, X } from "lucide-react";

export default function AllSchemesPage() {
  const { t, language } = useLanguage();
  const [schemes, setSchemes] = useState<any[]>(STATIC_SCHEMES);
  const [districts, setDistricts] = useState<any[]>(MAHARASHTRA_DISTRICTS);
  const [loading, setLoading] = useState(false);

  const categories = [
    { id: "agriculture", slug: "agriculture", nameEn: "Agriculture & Agribusiness", nameHi: "कृषि एवं कृषि व्यवसाय", nameMr: "शेती आणि कृषी व्यवसाय" },
    { id: "dairy", slug: "dairy", nameEn: "Dairy & Livestock", nameHi: "डेयरी एवं पशुपालन", nameMr: "दुग्धव्यवसाय आणि पशुपालन" },
    { id: "food-processing", slug: "food-processing", nameEn: "Food Processing", nameHi: "खाद्य प्रसंस्करण", nameMr: "अन्न प्रक्रिया उद्योग" },
    { id: "handicrafts", slug: "handicrafts", nameEn: "Handicrafts & Artisans", nameHi: "हस्तशिल्प एवं कारीगर", nameMr: "हस्तकला आणि कारागीर" },
    { id: "manufacturing", slug: "manufacturing", nameEn: "Small Manufacturing", nameHi: "लघु उद्योग निर्माण", nameMr: "लघु उद्योग उत्पादने" },
    { id: "retail-services", slug: "retail-services", nameEn: "Retail & Village Services", nameHi: "खुदरा एवं ग्रामीण सेवाएं", nameMr: "किरकोळ विक्री आणि ग्रामीण सेवा" },
  ];

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    fetch("/api/districts")
      .then((res) => res.json())
      .then((data) => data.success && setDistricts(data.districts))
      .catch(() => {});
  }, []);

  const fetchSchemes = () => {
    setLoading(true);
    let url = `/api/schemes?search=${encodeURIComponent(searchQuery)}`;
    if (selectedCategory) url += `&category=${selectedCategory}`;
    if (selectedDistrict) url += `&district=${selectedDistrict}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.schemes) {
          setSchemes(data.schemes);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSchemes();
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, selectedDistrict]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* HEADER */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
          {t.navAllSchemes}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
          {language === 'hi' 
            ? "सत्यापित सरकारी योजनाओं की पूरी सूची। फ़िल्टर का उपयोग करके अपने व्यवसाय के लिए सही योजना चुनें।"
            : language === 'mr'
            ? "पडताळलेल्या सर्व शासकीय योजनांची यादी. शोधक किंवा फिल्टर वापरून तुमच्या व्यवसायासाठी योग्य योजना शोधा."
            : "Complete directory of verified government schemes. Filter by category, district, or keyword."}
        </p>
      </div>

      {/* SEARCH BAR & MOBILE FILTER TRIGGER */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-white shadow-xs focus:ring-2 focus:ring-emerald-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-3.5 text-xs text-slate-400 hover:text-slate-600 font-bold"
            >
              Clear
            </button>
          )}
        </div>

        {/* Mobile Filter Button */}
        <button
          onClick={() => setMobileFilterOpen(true)}
          className="sm:hidden flex items-center justify-center gap-2 px-4 py-3 bg-emerald-50 dark:bg-slate-800 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-slate-700 rounded-xl font-bold text-sm"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>{language === 'hi' ? 'फ़िल्टर' : language === 'mr' ? 'फिल्टर' : 'Filters'}</span>
        </button>
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* DESKTOP FILTER SIDEBAR */}
        <aside className="hidden lg:block lg:col-span-3 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5 sticky top-24">
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Filter className="w-4 h-4 text-emerald-600" />
                <span>{language === 'hi' ? 'फ़िल्टर' : language === 'mr' ? 'फिल्टर' : 'Filters'}</span>
              </h3>
              {(selectedCategory || selectedDistrict) && (
                <button
                  onClick={() => {
                    setSelectedCategory("");
                    setSelectedDistrict("");
                  }}
                  className="text-xs text-emerald-700 dark:text-emerald-400 hover:underline font-bold"
                >
                  Reset All
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                {t.categoryFilter}
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-white"
              >
                <option value="">{language === 'hi' ? 'सभी श्रेणियां' : language === 'mr' ? 'सर्व श्रेणी' : 'All Categories'}</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {language === 'hi' ? c.nameHi : language === 'mr' ? c.nameMr : c.nameEn}
                  </option>
                ))}
              </select>
            </div>

            {/* District Filter */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                {t.districtFilter}
              </label>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-white"
              >
                <option value="">{t.allRegions}</option>
                {districts.map((d) => (
                  <option key={d.slug} value={d.slug}>
                    {language === 'hi' ? d.nameHi : language === 'mr' ? d.nameMr : d.nameEn} ({d.region})
                  </option>
                ))}
              </select>
            </div>

          </div>
        </aside>

        {/* SCHEME CARDS DISPLAY */}
        <main className="lg:col-span-9 space-y-6">
          
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>
              {language === 'hi'
                ? `कुल ${schemes.length} योजनाएं मिलीं`
                : language === 'mr'
                ? `एकूण ${schemes.length} योजना सापडल्या`
                : `Total ${schemes.length} schemes found`}
            </span>
            {loading && <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-64 bg-slate-200/60 dark:bg-slate-800 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : schemes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {schemes.map((scheme) => (
                <SchemeCard key={scheme.id} scheme={scheme} />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 space-y-3">
              <Grid className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                {language === 'hi' ? "कोई योजना नहीं मिली" : language === 'mr' ? "कोणतीही योजना सापडली नाही" : "No schemes found"}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'hi' ? "कृपया अलग खोज शब्द या फ़िल्टर आज़माएं।" : language === 'mr' ? "कृपया वेगळे शोध शब्द किंवा फिल्टर वापरून पहा." : "Please try different keywords or filters."}
              </p>
            </div>
          )}

        </main>

      </div>

      {/* MOBILE FILTER MODAL DRAWER */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl max-w-md w-full p-6 space-y-5 border border-slate-200 dark:border-slate-800 shadow-2xl relative animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-emerald-600" />
                <span>{language === 'hi' ? 'फ़िल्टर' : language === 'mr' ? 'फिल्टर' : 'Filters'}</span>
              </h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  {t.categoryFilter}
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white"
                >
                  <option value="">{language === 'hi' ? 'सभी श्रेणियां' : language === 'mr' ? 'सर्व श्रेणी' : 'All Categories'}</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {language === 'hi' ? c.nameHi : language === 'mr' ? c.nameMr : c.nameEn}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  {t.districtFilter}
                </label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white"
                >
                  <option value="">{t.allRegions}</option>
                  {districts.map((d) => (
                    <option key={d.slug} value={d.slug}>
                      {language === 'hi' ? d.nameHi : language === 'mr' ? d.nameMr : d.nameEn} ({d.region})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex gap-3">
              <button
                onClick={() => {
                  setSelectedCategory("");
                  setSelectedDistrict("");
                }}
                className="w-1/2 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-1/2 py-3 bg-emerald-600 text-white font-extrabold rounded-xl text-xs"
              >
                {language === 'hi' ? 'लागू करें' : language === 'mr' ? 'लागू करा' : 'Apply'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

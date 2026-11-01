"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/components/LanguageContext";
import DistrictCard from "@/components/DistrictCard";
import { MAHARASHTRA_DISTRICTS } from "@/lib/data/districts";
import { Search } from "lucide-react";

export default function DistrictsExplorerPage() {
  const { t, language } = useLanguage();
  // Initialize with hardcoded 36 districts for 0ms loading
  const [districts, setDistricts] = useState<any[]>(MAHARASHTRA_DISTRICTS);
  const [search, setSearch] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");

  useEffect(() => {
    fetch("/api/districts")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.districts && data.districts.length > 0) {
          setDistricts(data.districts);
        }
      })
      .catch(() => {});
  }, []);

  const regions = [
    { id: "Paschim Maharashtra", labelEn: "Western Maharashtra", labelHi: "पश्चिम महाराष्ट्र", labelMr: "पश्चिम महाराष्ट्र" },
    { id: "Marathwada", labelEn: "Marathwada", labelHi: "मराठवाड़ा", labelMr: "मराठवाडा" },
    { id: "Vidarbha", labelEn: "Vidarbha", labelHi: "विदर्भ", labelMr: "विदर्भ" },
    { id: "Khandesh", labelEn: "Khandesh (North Maharashtra)", labelHi: "खानदेश (उत्तर महाराष्ट्र)", labelMr: "खानदेश (उत्तर महाराष्ट्र)" },
    { id: "Konkan", labelEn: "Konkan Region", labelHi: "कोंकण संभाग", labelMr: "कोकण विभाग" },
  ];

  const filteredDistricts = districts.filter((d) => {
    const q = search.toLowerCase();
    const matchSearch =
      (d.nameEn && d.nameEn.toLowerCase().includes(q)) ||
      (d.nameMr && d.nameMr.includes(search)) ||
      (d.nameHi && d.nameHi.includes(search));

    const matchRegion = selectedRegion ? d.region === selectedRegion : true;
    return matchSearch && matchRegion;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* HEADER */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
          {t.districtExplorerTitle}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
          {t.districtExplorerSub}
        </p>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder={t.searchDistrictPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-white shadow-xs focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <select
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          className="p-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white"
        >
          <option value="">{t.allRegions}</option>
          {regions.map((r) => (
            <option key={r.id} value={r.id}>
              {language === 'hi' ? r.labelHi : language === 'mr' ? r.labelMr : r.labelEn}
            </option>
          ))}
        </select>
      </div>

      {/* DISTRICTS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredDistricts.map((district) => (
          <DistrictCard key={district.slug || district.id} district={district} />
        ))}
      </div>

    </div>
  );
}

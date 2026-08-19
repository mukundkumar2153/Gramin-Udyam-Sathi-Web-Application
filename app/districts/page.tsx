"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/components/LanguageContext";
import DistrictCard from "@/components/DistrictCard";
import { MapPin, Search, Building2 } from "lucide-react";

export default function DistrictsExplorerPage() {
  const { t, language } = useLanguage();
  const [districts, setDistricts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");

  useEffect(() => {
    fetch("/api/districts")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.districts) {
          setDistricts(data.districts);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const regions = [
    "Paschim Maharashtra",
    "Marathwada",
    "Vidarbha",
    "Khandesh",
    "Konkan",
  ];

  const filteredDistricts = districts.filter((d) => {
    const matchSearch =
      d.nameEn.toLowerCase().includes(search.toLowerCase()) ||
      d.nameMr.includes(search) ||
      d.nameHi.includes(search);

    const matchRegion = selectedRegion ? d.region === selectedRegion : true;
    return matchSearch && matchRegion;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* HEADER */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900">
          {t.districtExplorerTitle}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 font-medium">
          महाराष्ट्रातील सर्व ३६ जिल्ह्यांतील स्थानिक उद्योग केंद्र (District Industries Centre - DIC), संपर्क व योजना
        </p>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="जिल्ह्याचे नाव शोधा (e.g. Pune, Nashik, Kolhapur...)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 shadow-xs focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <select
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          className="p-3 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-900"
        >
          <option value="">सर्व विभाग (All Regions)</option>
          {regions.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      {/* DISTRICTS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredDistricts.map((district) => (
          <DistrictCard key={district.id} district={district} />
        ))}
      </div>

    </div>
  );
}

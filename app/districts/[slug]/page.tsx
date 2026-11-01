"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useLanguage } from "@/components/LanguageContext";
import SchemeCard from "@/components/SchemeCard";
import { MAHARASHTRA_DISTRICTS } from "@/lib/data/districts";
import { STATIC_SCHEMES } from "@/lib/data/schemes";
import { MapPin, Phone, Building, ArrowLeft } from "lucide-react";

export default function DistrictDetailPage() {
  const params = useParams();
  const { language, t } = useLanguage();
  
  const slug = (params?.slug as string) || "";
  const initialDistrict = MAHARASHTRA_DISTRICTS.find((d) => d.slug === slug) || null;

  const [district, setDistrict] = useState<any | null>(initialDistrict);
  const [schemes, setSchemes] = useState<any[]>(STATIC_SCHEMES);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (slug) {
      const found = MAHARASHTRA_DISTRICTS.find((d) => d.slug === slug);
      if (found) setDistrict(found);

      // Try fetching from API as well
      fetch(`/api/schemes?district=${slug}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.schemes && data.schemes.length > 0) {
            setSchemes(data.schemes);
          }
        })
        .catch(() => {});
    }
  }, [slug]);

  if (!district) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-3">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">
          {language === 'hi' ? "जिला नहीं मिला" : language === 'mr' ? "जिल्हा सापडला नाही" : "District Not Found"}
        </h2>
        <Link href="/districts" className="text-emerald-700 dark:text-emerald-400 font-bold underline text-sm block">
          {t.backToDistricts}
        </Link>
      </div>
    );
  }

  const name = language === 'hi' ? district.nameHi : language === 'mr' ? district.nameMr : district.nameEn;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <Link href="/districts" className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-700 dark:text-emerald-400 hover:text-emerald-900">
        <ArrowLeft className="w-4 h-4" />
        <span>{t.backToDistricts}</span>
      </Link>

      {/* DISTRICT HEADER HERO CARD */}
      <div className="bg-gradient-to-r from-emerald-900 to-green-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-emerald-700 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="px-3 py-1 bg-emerald-800 text-emerald-200 text-xs font-bold rounded-full border border-emerald-600">
              {district.region}
            </span>
            <h1 className="text-3xl sm:text-5xl font-black mt-2">
              {language === 'en' ? `District ${district.nameEn}` : `${district.nameEn} - ${name}`}
            </h1>
          </div>

          <MapPin className="w-12 h-12 text-amber-400 opacity-80" />
        </div>

        {/* DIC Office Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-emerald-950/70 p-5 rounded-2xl border border-emerald-800 text-xs sm:text-sm">
          <div className="flex items-start gap-3">
            <Building className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold text-amber-300 block mb-1">
                {t.dicOffice}:
              </span>
              <p className="text-emerald-100">{district.dicAddress || "Collectorate Annexe Campus"}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold text-amber-300 block mb-1">
                {t.helpline}:
              </span>
              <a href={`tel:${district.dicContact}`} className="text-emerald-100 font-mono font-bold hover:underline">
                {district.dicContact || "020-25537248"}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* DISTRICT SCHEMES LIST */}
      <div className="space-y-6">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">
          {t.schemesForDistrict} ({name})
        </h2>

        {loading ? (
          <div className="text-center py-12 text-slate-500 font-bold">{t.loadingSchemes}</div>
        ) : schemes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schemes.map((scheme) => (
              <SchemeCard key={scheme.id} scheme={scheme} />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 p-8 text-center rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500">
            {language === 'hi' 
              ? "इस जिले के लिए राज्य और राष्ट्रीय स्तर की सभी योजनाएं लागू हैं।" 
              : language === 'mr' 
              ? "या जिल्ह्यासाठी राज्य व राष्ट्रीय स्तरावरील सर्व योजना लागू आहेत." 
              : "All state and national level schemes are applicable for this district."}
          </div>
        )}
      </div>

    </div>
  );
}

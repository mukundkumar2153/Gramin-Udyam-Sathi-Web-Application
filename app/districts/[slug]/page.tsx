"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useLanguage } from "@/components/LanguageContext";
import SchemeCard from "@/components/SchemeCard";
import { MapPin, Phone, Building, ArrowLeft, ExternalLink, ShieldCheck } from "lucide-react";

export default function DistrictDetailPage() {
  const params = useParams();
  const { language } = useLanguage();
  const [district, setDistrict] = useState<any | null>(null);
  const [schemes, setSchemes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params?.slug) {
      fetch(`/api/districts`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.districts) {
            const found = data.districts.find((d: any) => d.slug === params.slug);
            setDistrict(found);
          }
        });

      fetch(`/api/schemes?district=${params.slug}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setSchemes(data.schemes);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [params?.slug]);

  if (!district && !loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-800">जिल्हा सापडला नाही</h2>
        <Link href="/districts" className="text-emerald-700 font-bold underline text-sm mt-2 block">
          ← सर्व जिल्ह्यांची यादी पहा
        </Link>
      </div>
    );
  }

  const name = district ? (language === 'hi' ? district.nameHi : language === 'mr' ? district.nameMr : district.nameEn) : "";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <Link href="/districts" className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-700 hover:text-emerald-900">
        <ArrowLeft className="w-4 h-4" />
        <span>मागे (Back to Districts)</span>
      </Link>

      {/* DISTRICT HEADER HERO CARD */}
      {district && (
        <div className="bg-gradient-to-r from-emerald-900 to-green-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-emerald-700 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="px-3 py-1 bg-emerald-800 text-emerald-200 text-xs font-bold rounded-full border border-emerald-600">
                {district.region} विभाग
              </span>
              <h1 className="text-3xl sm:text-5xl font-black mt-2">
                जिल्हा {name} ({district.nameEn})
              </h1>
            </div>

            <MapPin className="w-12 h-12 text-amber-400 opacity-80" />
          </div>

          {/* DIC Office Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-emerald-950/70 p-5 rounded-2xl border border-emerald-800 text-xs sm:text-sm">
            <div className="flex items-start gap-3">
              <Building className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-extrabold text-amber-300 block mb-1">जिल्हा उद्योग केंद्र (DIC Office):</span>
                <p className="text-emerald-100">{district.dicAddress || "Collectorate Annexe Campus"}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-extrabold text-amber-300 block mb-1">हेल्पलाइन / संपर्क क्रमांक:</span>
                <a href={`tel:${district.dicContact}`} className="text-emerald-100 font-mono font-bold hover:underline">
                  {district.dicContact || "020-25537248"}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DISTRICT SCHEMES LIST */}
      <div className="space-y-6">
        <h2 className="text-2xl font-black text-slate-900">
          जिल्हा {name} साठी लागू असलेल्या योजना
        </h2>

        {loading ? (
          <div className="text-center py-12 text-slate-500 font-bold">योजना लोड होत आहेत...</div>
        ) : schemes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schemes.map((scheme) => (
              <SchemeCard key={scheme.id} scheme={scheme} />
            ))}
          </div>
        ) : (
          <div className="bg-white p-8 text-center rounded-2xl border border-slate-200 text-slate-500">
            या जिल्ह्यासाठी विशिष्ट योजना जोडल्या जात आहेत. सर्व राज्यस्तरीय योजना देखील लागू आहेत.
          </div>
        )}
      </div>

    </div>
  );
}

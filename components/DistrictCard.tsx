"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "./LanguageContext";
import { MapPin, Phone, Building, ArrowRight } from "lucide-react";

interface DistrictCardProps {
  district: {
    id: string;
    slug: string;
    nameEn: string;
    nameHi: string;
    nameMr: string;
    region: string;
    dicAddress?: string | null;
    dicContact?: string | null;
    _count?: {
      schemes?: number;
    };
  };
}

export default function DistrictCard({ district }: DistrictCardProps) {
  const { language } = useLanguage();

  const name = language === 'hi' ? district.nameHi : language === 'mr' ? district.nameMr : district.nameEn;

  return (
    <Link
      href={`/districts/${district.slug}`}
      className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between group"
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 text-[11px] font-bold rounded-lg border border-emerald-100">
            {district.region}
          </span>
          <MapPin className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
        </div>

        <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
          {name}
        </h3>

        {district.dicAddress && (
          <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed flex items-start gap-1.5">
            <Building className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <span>{district.dicAddress}</span>
          </p>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        {district.dicContact ? (
          <span className="text-slate-500 flex items-center gap-1 font-mono text-[11px]">
            <Phone className="w-3 h-3 text-emerald-600" />
            <span>{district.dicContact}</span>
          </span>
        ) : (
          <span className="text-slate-400">DIC Office</span>
        )}

        <span className="text-emerald-700 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
          <span>पहा</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </Link>
  );
}

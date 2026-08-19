"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "./LanguageContext";
import { CheckCircle2, ChevronRight, MapPin, Building2, Award, Sparkles, FileText } from "lucide-react";

interface SchemeCardProps {
  scheme: {
    id: string;
    nameEn: string;
    nameHi: string;
    nameMr: string;
    descriptionEn: string;
    descriptionHi: string;
    descriptionMr: string;
    targetUsersEn: string;
    targetUsersHi: string;
    targetUsersMr: string;
    officialUrl: string;
    sourceName: string;
    applicableScope: string;
    category?: {
      nameEn: string;
      nameHi: string;
      nameMr: string;
    };
    benefitsJson?: any;
  };
  matchScore?: number;
  onWhyRecommended?: () => void;
}

export default function SchemeCard({ scheme, matchScore, onWhyRecommended }: SchemeCardProps) {
  const { language, t } = useLanguage();

  const name = language === 'hi' ? scheme.nameHi : language === 'mr' ? scheme.nameMr : scheme.nameEn;
  const description = language === 'hi' ? scheme.descriptionHi : language === 'mr' ? scheme.descriptionMr : scheme.descriptionEn;
  const targetUsers = language === 'hi' ? scheme.targetUsersHi : language === 'mr' ? scheme.targetUsersMr : scheme.targetUsersEn;
  const categoryName = scheme.category ? (language === 'hi' ? scheme.category.nameHi : language === 'mr' ? scheme.category.nameMr : scheme.category.nameEn) : "General";

  const mainBenefit = Array.isArray(scheme.benefitsJson) && scheme.benefitsJson.length > 0
    ? (scheme.benefitsJson[0][language] || scheme.benefitsJson[0].mr || scheme.benefitsJson[0].en)
    : null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between overflow-hidden group">
      
      <div className="p-5 sm:p-6 space-y-4">
        
        {/* Top Badges & Score */}
        <div className="flex items-start justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold">
            <Building2 className="w-3.5 h-3.5" />
            <span>{categoryName}</span>
          </span>

          {typeof matchScore === 'number' && (
            <div className="flex items-center gap-1.5">
              <span className={`px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1 shadow-xs ${
                matchScore >= 80
                  ? "bg-emerald-600 text-white"
                  : matchScore >= 60
                  ? "bg-amber-500 text-white"
                  : "bg-slate-700 text-white"
              }`}>
                <Sparkles className="w-3.5 h-3.5" />
                <span>{matchScore}% Match</span>
              </span>

              {onWhyRecommended && (
                <button
                  onClick={onWhyRecommended}
                  className="text-xs text-emerald-700 underline font-semibold hover:text-emerald-900"
                >
                  {t.whyRecommended}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Scheme Title */}
        <div>
          <Link href={`/schemes/${scheme.id}`} className="group-hover:text-emerald-700 transition-colors">
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug">
              {name}
            </h3>
          </Link>
          <div className="text-xs font-medium text-slate-500 mt-1 flex items-center gap-2">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>{scheme.applicableScope}</span>
            </span>
            <span>•</span>
            <span className="truncate">{scheme.sourceName}</span>
          </div>
        </div>

        {/* Short Description */}
        <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
          {description}
        </p>

        {/* Key Highlight / Main Benefit Badge */}
        {mainBenefit && (
          <div className="bg-amber-50/80 border border-amber-200/70 p-3 rounded-xl flex items-start gap-2.5">
            <Award className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs font-bold text-amber-900 leading-tight">
              <span className="font-extrabold text-amber-700 block mb-0.5">प्रमुख फायदा (Key Benefit):</span>
              {mainBenefit}
            </div>
          </div>
        )}

        {/* Target Audience */}
        <div className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="truncate"><strong className="text-slate-700">पात्र लाभार्थी:</strong> {targetUsers}</span>
        </div>

      </div>

      {/* Card Action Footer */}
      <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs text-slate-500 flex items-center gap-1 font-semibold">
          <FileText className="w-3.5 h-3.5 text-slate-400" />
          <span>पडताळलेली माहिती</span>
        </span>

        <Link
          href={`/schemes/${scheme.id}`}
          className="inline-flex items-center gap-1 text-xs font-extrabold text-emerald-700 hover:text-emerald-900 group-hover:translate-x-0.5 transition-all"
        >
          <span>{t.viewDetails}</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}

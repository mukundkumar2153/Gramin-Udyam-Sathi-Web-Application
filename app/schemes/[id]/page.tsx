"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useLanguage } from "@/components/LanguageContext";
import { STATIC_SCHEMES } from "@/lib/data/schemes";
import {
  Building2,
  MapPin,
  ExternalLink,
  Award,
  CheckCircle2,
  FileCheck,
  Calendar,
  Bookmark,
  ArrowLeft,
  Layers,
} from "lucide-react";

export default function SchemeDetailPage() {
  const params = useParams();
  const { language, t } = useLanguage();

  const id = (params?.id as string) || "";
  const initialScheme = STATIC_SCHEMES.find((s) => s.id === id || s.nameEn.toLowerCase().includes(id.toLowerCase())) || STATIC_SCHEMES[0];

  const [scheme, setScheme] = useState<any | null>(initialScheme);
  const [loading, setLoading] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [docState, setDocState] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (id) {
      const match = STATIC_SCHEMES.find((s) => s.id === id || s.nameEn.toLowerCase().includes(id.toLowerCase()));
      if (match) {
        setScheme(match);
      }

      fetch(`/api/schemes/${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.scheme) {
            setScheme(data.scheme);
            if (Array.isArray(data.scheme.documentsJson)) {
              const initDocs: Record<string, boolean> = {};
              data.scheme.documentsJson.forEach((doc: any) => {
                initDocs[doc.name] = false;
              });
              setDocState(initDocs);
            }
          }
        })
        .catch(() => {});
    }
  }, [id]);

  if (!scheme) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
          {language === 'hi' ? 'योजना नहीं मिली' : language === 'mr' ? 'योजना सापडली नाही' : 'Scheme Not Found'}
        </h2>
        <Link href="/schemes" className="text-emerald-700 dark:text-emerald-400 font-bold underline text-sm">
          ← {t.exploreAllSchemes}
        </Link>
      </div>
    );
  }

  // STRICT SINGLE-LANGUAGE RESOLUTION
  const name = language === 'hi' ? (scheme.nameHi || scheme.nameEn) : language === 'mr' ? (scheme.nameMr || scheme.nameEn) : scheme.nameEn;
  const description = language === 'hi' ? (scheme.descriptionHi || scheme.descriptionEn) : language === 'mr' ? (scheme.descriptionMr || scheme.descriptionEn) : scheme.descriptionEn;
  const targetUsers = language === 'hi' ? (scheme.targetUsersHi || scheme.targetUsersEn) : language === 'mr' ? (scheme.targetUsersMr || scheme.targetUsersEn) : scheme.targetUsersEn;

  const categoryName = scheme.category ? (language === 'hi' ? scheme.category.nameHi : language === 'mr' ? scheme.category.nameMr : scheme.category.nameEn) : "General";

  const toggleDoc = (docName: string) => {
    setDocState((prev) => ({ ...prev, [docName]: !prev[docName] }));
  };

  const handleBookmarkToggle = async () => {
    setBookmarked(!bookmarked);
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const u = JSON.parse(storedUser);
        await fetch("/api/bookmarks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: u.id, schemeId: scheme.id }),
        });
      } catch (e) {}
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* BREADCRUMB */}
      <Link href="/schemes" className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-700 dark:text-emerald-400 hover:text-emerald-900">
        <ArrowLeft className="w-4 h-4" />
        <span>{language === 'hi' ? 'सभी योजनाओं की सूची पर लौटें' : language === 'mr' ? 'सर्व योजनांकडे परत जा' : 'Back to All Schemes'}</span>
      </Link>

      {/* HEADER CARD */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
        
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-full text-xs font-bold flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" />
              <span>{categoryName}</span>
            </span>
            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-xs font-semibold flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>{scheme.applicableScope}</span>
            </span>
          </div>

          <button
            onClick={handleBookmarkToggle}
            className={`p-2.5 rounded-xl border transition-all ${
              bookmarked
                ? "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-700"
                : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100"
            }`}
            title="Bookmark Scheme"
          >
            <Bookmark className={`w-4 h-4 ${bookmarked ? "fill-amber-600 text-amber-600 dark:fill-amber-400 dark:text-amber-400" : ""}`} />
          </button>
        </div>

        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white leading-tight">
            {name}
          </h1>
          <div className="flex items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400 mt-2">
            <span>{language === 'hi' ? 'स्रोत:' : language === 'mr' ? 'स्त्रोत:' : 'Source:'} <strong>{scheme.sourceName}</strong></span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t.lastVerified}: {new Date(scheme.lastVerifiedAt || Date.now()).toLocaleDateString()}</span>
            </span>
          </div>
        </div>

        <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
          {description}
        </p>

        {/* PRIMARY CTA */}
        <div className="pt-2">
          <a
            href={scheme.officialUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base rounded-2xl shadow-lg transition-all"
          >
            <span>{t.officialWebsite}</span>
            <ExternalLink className="w-5 h-5" />
          </a>
        </div>

      </div>

      {/* DETAILED CONTENT SECTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div className="lg:col-span-8 space-y-8">
          
          {/* ELIGIBILITY SECTION */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>{language === 'hi' ? 'कौन लाभ उठा सकता है? (पात्रता)' : language === 'mr' ? 'कोणाला फायदा होऊ शकतो? (पात्रता)' : 'Who Can Benefit? (Eligibility)'}</span>
            </h3>

            <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/50 border border-emerald-200/60 dark:border-emerald-800 rounded-2xl text-xs sm:text-sm font-bold text-emerald-950 dark:text-emerald-200">
              {language === 'hi' ? 'पात्र लाभार्थी:' : language === 'mr' ? 'पात्र लाभार्थी:' : 'Target Beneficiaries:'} {targetUsers}
            </div>

            {scheme.eligibilityJson && (
              <div className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                <div className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-xs">
                  {language === 'hi' ? 'मुख्य शर्तें:' : language === 'mr' ? 'प्रमुख अटी:' : 'Key Criteria:'}
                </div>
                <ul className="list-disc pl-5 space-y-1.5 leading-relaxed">
                  {Object.entries(scheme.eligibilityJson).map(([key, val]: [string, any]) => (
                    <li key={key}>
                      <strong className="capitalize text-slate-900 dark:text-white">{key}:</strong> {String(val)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* MAIN BENEFITS SECTION */}
          {Array.isArray(scheme.benefitsJson) && scheme.benefitsJson.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Award className="w-5 h-5 text-amber-600" />
                <span>{language === 'hi' ? 'योजना के मुख्य लाभ और सब्सिडी' : language === 'mr' ? 'योजनेचे मुख्य फायदे व अनुदान' : 'Main Scheme Benefits & Subsidies'}</span>
              </h3>

              <div className="space-y-3">
                {scheme.benefitsJson.map((b: any, idx: number) => {
                  const benefitText = b[language] || (language === 'hi' ? b.hi : language === 'mr' ? b.mr : b.en) || b.en;
                  return (
                    <div key={idx} className="p-4 bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800 rounded-2xl flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-xs sm:text-sm font-bold text-amber-950 dark:text-amber-200 leading-relaxed">
                        {benefitText}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* APPLICATION PROCESS SECTION */}
          {Array.isArray(scheme.applicationProcessJson) && scheme.applicationProcessJson.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Layers className="w-5 h-5 text-emerald-600" />
                <span>{language === 'hi' ? 'चरण-दर-चरण आवेदन प्रक्रिया' : language === 'mr' ? 'टप्प्याटप्प्याने अर्ज प्रक्रिया' : 'Step-by-Step Application Process'}</span>
              </h3>

              <div className="space-y-4">
                {scheme.applicationProcessJson.map((step: any, idx: number) => {
                  const stepText = language === 'hi' ? (step.textHi || step.textEn) : language === 'mr' ? (step.textMr || step.textEn) : (step.textEn || step.textMr);
                  return (
                    <div key={idx} className="flex items-start gap-3.5 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                      <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-extrabold text-sm flex items-center justify-center shrink-0">
                        {step.step || idx + 1}
                      </span>
                      <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed pt-1">
                        {stepText}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* SIDEBAR: INTERACTIVE DOCUMENT CHECKLIST */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 sticky top-24">
            
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <FileCheck className="w-5 h-5 text-emerald-600" />
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                {t.docChecklist}
              </h3>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              {language === 'hi' ? 'आवश्यक दस्तावेजों को चेक करें:' : language === 'mr' ? 'आवश्यक कागदपत्रे तपासा व खूण करा:' : 'Check off required documents:'}
            </p>

            {Array.isArray(scheme.documentsJson) && scheme.documentsJson.length > 0 ? (
              <div className="space-y-2.5">
                {scheme.documentsJson.map((doc: any, idx: number) => {
                  const isChecked = docState[doc.name];
                  return (
                    <button
                      key={idx}
                      onClick={() => toggleDoc(doc.name)}
                      className={`w-full p-3 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between gap-2 ${
                        isChecked
                          ? "bg-emerald-50 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700"
                          : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                      }`}
                    >
                      <span className="truncate">{doc.name}</span>
                      <span className={`w-5 h-5 rounded-md flex items-center justify-center text-xs ${isChecked ? "bg-emerald-600 text-white" : "border border-slate-300 dark:border-slate-600"}`}>
                        {isChecked ? "✓" : ""}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-400">Aadhaar Card, PAN Card, Bank Passbook</p>
            )}

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <a
                href={scheme.officialUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2"
              >
                <span>{t.officialWebsite}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

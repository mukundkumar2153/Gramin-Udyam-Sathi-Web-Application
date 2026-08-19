"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useLanguage } from "@/components/LanguageContext";
import {
  Building2,
  MapPin,
  ExternalLink,
  Award,
  CheckCircle2,
  FileCheck,
  Calendar,
  Share2,
  Bookmark,
  ArrowLeft,
  ShieldCheck,
  Layers,
  ChevronRight,
} from "lucide-react";

export default function SchemeDetailPage() {
  const params = useParams();
  const { language, t } = useLanguage();
  const [scheme, setScheme] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);
  const [docState, setDocState] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (params?.id) {
      fetch(`/api/schemes/${params.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.scheme) {
            setScheme(data.scheme);
            // Initialize document checklist state
            if (Array.isArray(data.scheme.documentsJson)) {
              const initDocs: Record<string, boolean> = {};
              data.scheme.documentsJson.forEach((doc: any) => {
                initDocs[doc.name] = false;
              });
              setDocState(initDocs);
            }
          }
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [params?.id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-bold text-slate-600">योजनेची माहिती लोड होत आहे...</p>
      </div>
    );
  }

  if (!scheme) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">योजना सापडली नाही</h2>
        <Link href="/schemes" className="text-emerald-700 font-bold underline text-sm">
          ← सर्व योजनांची यादी पहा
        </Link>
      </div>
    );
  }

  const name = language === 'hi' ? scheme.nameHi : language === 'mr' ? scheme.nameMr : scheme.nameEn;
  const description = language === 'hi' ? scheme.descriptionHi : language === 'mr' ? scheme.descriptionMr : scheme.descriptionEn;
  const targetUsers = language === 'hi' ? scheme.targetUsersHi : language === 'mr' ? scheme.targetUsersMr : scheme.targetUsersEn;

  const toggleDoc = (docName: string) => {
    setDocState((prev) => ({ ...prev, [docName]: !prev[docName] }));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* BREADCRUMB */}
      <Link href="/schemes" className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-700 hover:text-emerald-900">
        <ArrowLeft className="w-4 h-4" />
        <span>सर्व योजनांकडे परत जा (Back to All Schemes)</span>
      </Link>

      {/* HEADER CARD */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
        
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" />
              <span>{scheme.category ? (language === 'hi' ? scheme.category.nameHi : language === 'mr' ? scheme.category.nameMr : scheme.category.nameEn) : 'General'}</span>
            </span>
            <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>{scheme.applicableScope}</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setBookmarked(!bookmarked)}
              className={`p-2.5 rounded-xl border transition-all ${
                bookmarked
                  ? "bg-amber-50 text-amber-700 border-amber-300"
                  : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
              }`}
              title="Bookmark Scheme"
            >
              <Bookmark className={`w-4 h-4 ${bookmarked ? "fill-amber-600 text-amber-600" : ""}`} />
            </button>
          </div>
        </div>

        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight">
            {name}
          </h1>
          <div className="flex items-center gap-4 text-xs font-medium text-slate-500 mt-2">
            <span>स्त्रोत: <strong>{scheme.sourceName}</strong></span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              <span>पडताळणी: {new Date(scheme.lastVerifiedAt).toLocaleDateString()}</span>
            </span>
          </div>
        </div>

        <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
          {description}
        </p>

        {/* PRIMARY CTA: OFFICIAL GOVT PORTAL */}
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
          
          {/* WHO CAN BENEFIT / ELIGIBILITY */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>कोणाला फायदा होऊ शकतो? (Eligibility & Target Users)</span>
            </h3>

            <div className="p-4 bg-emerald-50/70 border border-emerald-200/60 rounded-2xl text-xs sm:text-sm font-bold text-emerald-950">
              पात्र लाभार्थी: {targetUsers}
            </div>

            {scheme.eligibilityJson && (
              <div className="space-y-2 text-xs sm:text-sm text-slate-700">
                <div className="font-extrabold text-slate-900 uppercase tracking-wider text-xs">प्रमुख अटी:</div>
                <ul className="list-disc pl-5 space-y-1.5 leading-relaxed">
                  {Object.entries(scheme.eligibilityJson).map(([key, val]: [string, any]) => (
                    <li key={key}>
                      <strong className="capitalize text-slate-900">{key}:</strong> {String(val)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* MAIN BENEFITS */}
          {Array.isArray(scheme.benefitsJson) && scheme.benefitsJson.length > 0 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <Award className="w-5 h-5 text-amber-600" />
                <span>योजनेचे मुख्य फायदे व अनुदान (Main Benefits)</span>
              </h3>

              <div className="space-y-3">
                {scheme.benefitsJson.map((b: any, idx: number) => (
                  <div key={idx} className="p-4 bg-amber-50/60 border border-amber-200/60 rounded-2xl flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-amber-950 leading-relaxed">
                      {b[language] || b.mr || b.en}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP-BY-STEP APPLICATION PROCESS */}
          {Array.isArray(scheme.applicationProcessJson) && scheme.applicationProcessJson.length > 0 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <Layers className="w-5 h-5 text-emerald-600" />
                <span>अर्ज प्रक्रिया — टप्प्याटप्प्याने (Application Steps)</span>
              </h3>

              <div className="space-y-4">
                {scheme.applicationProcessJson.map((step: any, idx: number) => (
                  <div key={idx} className="flex items-start gap-3.5 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-extrabold text-sm flex items-center justify-center shrink-0">
                      {step.step || idx + 1}
                    </span>
                    <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed pt-1">
                      {step.textMr || step.textEn || step.textHi}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* SIDEBAR: INTERACTIVE DOCUMENT CHECKLIST */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 sticky top-24">
            
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <FileCheck className="w-5 h-5 text-emerald-600" />
              <h3 className="font-extrabold text-base text-slate-900">
                {t.docChecklist}
              </h3>
            </div>

            <p className="text-xs text-slate-500">
              अर्ासाठी लागणारी आवश्यक कागदपत्रे तपासा व खूण करा (Toggle Checklist):
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
                          ? "bg-emerald-50 text-emerald-900 border-emerald-300"
                          : "bg-slate-50 text-slate-700 border-slate-200"
                      }`}
                    >
                      <span className="truncate">{doc.name}</span>
                      <span className={`w-5 h-5 rounded-md flex items-center justify-center text-xs ${isChecked ? "bg-emerald-600 text-white" : "border border-slate-300"}`}>
                        {isChecked ? "✓" : ""}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-400">सामान्य ओळखपत्रे (Aadhaar, PAN, Bank Passbook)</p>
            )}

            <div className="pt-3 border-t border-slate-100">
              <a
                href={scheme.officialUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2"
              >
                <span>अधिकृत पोर्टलवर जा</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

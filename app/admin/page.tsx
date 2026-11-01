"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/LanguageContext";
import {
  ShieldCheck,
  Users,
  Search,
  Eye,
  Plus,
  ListFilter,
  BarChart3,
  FileText,
  LogOut,
} from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const [analytics, setAnalytics] = useState<any | null>(null);

  useEffect(() => {
    const adminUser = localStorage.getItem("adminUser");
    if (!adminUser) {
      router.push("/admin/login");
      return;
    }

    fetch("/api/admin/analytics")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.analytics) {
          setAnalytics(data.analytics);
        }
      })
      .catch((err) => console.error(err));
  }, [router]);

  const handleAdminLogout = () => {
    localStorage.removeItem("adminUser");
    localStorage.removeItem("adminToken");
    router.push("/");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* ADMIN HEADER */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 font-black text-2xl flex items-center justify-center shadow-md">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black">Gramin Udyam Admin CMS</h1>
            <p className="text-xs text-slate-400 font-semibold">
              {language === 'hi'
                ? "योजना एवं विश्लेषिकी प्रबंधन पोर्टल"
                : language === 'mr'
                ? "प्रशासकीय नियंत्रण कक्ष व योजना व्यवस्थापन"
                : "Schemes & Analytics Live Management Portal"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/schemes"
            className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs flex items-center gap-2 shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>
              {language === 'hi'
                ? "नई योजना जोड़ें / प्रबंधित करें"
                : language === 'mr'
                ? "नवीन योजना जोडा / व्यवस्थापन"
                : "Add New Scheme / Manage"}
            </span>
          </Link>

          <button
            onClick={handleAdminLogout}
            className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-4 h-4 text-red-400" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* METRICS CARDS */}
      {analytics ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold uppercase">
              <span>{language === 'hi' ? "कुल योजनाएं" : language === 'mr' ? "एकूण योजना" : "Total Schemes"}</span>
              <FileText className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-3xl font-black text-slate-900 dark:text-white block">{analytics.totalSchemes}</span>
            <span className="text-xs text-emerald-700 dark:text-emerald-400 font-bold">
              {analytics.activeSchemes} {language === 'hi' ? "सक्रिय योजनाएं" : language === 'mr' ? "सक्रिय योजना" : "Active Schemes"}
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold uppercase">
              <span>{language === 'hi' ? "कुल पंजीकृत उद्यमी" : language === 'mr' ? "एकूण उद्योजक" : "Total Users"}</span>
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-3xl font-black text-slate-900 dark:text-white block">{analytics.totalUsers}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {language === 'hi' ? "पंजीकृत ग्रामीण उद्यमी" : language === 'mr' ? "नोंदणीकृत ग्रामीण उद्योजक" : "Registered Entrepreneurs"}
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold uppercase">
              <span>{language === 'hi' ? "कुल खोजें" : language === 'mr' ? "एकूण शोध" : "Total Searches"}</span>
              <Search className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-3xl font-black text-slate-900 dark:text-white block">{analytics.totalSearches}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {language === 'hi' ? "सिफारिश प्रश्न" : language === 'mr' ? "शिफारस क्वेरीज" : "Recommendation Queries"}
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold uppercase">
              <span>{language === 'hi' ? "सर्वाधिक देखी गई योजना" : language === 'mr' ? "सर्वाधिक पाहिलेली योजना" : "Most Viewed Scheme"}</span>
              <Eye className="w-5 h-5 text-amber-600" />
            </div>
            <span className="text-sm font-black text-slate-900 dark:text-white block truncate">
              {language === 'hi' ? (analytics.mostViewedScheme.nameHi || analytics.mostViewedScheme.nameEn) : language === 'mr' ? (analytics.mostViewedScheme.nameMr || analytics.mostViewedScheme.nameEn) : analytics.mostViewedScheme.nameEn}
            </span>
            <span className="text-xs text-amber-700 dark:text-amber-400 font-bold">
              {analytics.mostViewedScheme.viewCount} {language === 'hi' ? "व्यूज" : language === 'mr' ? "व्ह्यूज" : "Views"}
            </span>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 p-8 text-center rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 font-bold animate-pulse">
          Loading Analytics...
        </div>
      )}

      {/* CATEGORIES DISTRIBUTION & RECENT SEARCHES */}
      {analytics && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* CATEGORY STATS */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <BarChart3 className="w-5 h-5 text-emerald-600" />
              <span>
                {language === 'hi' ? "क्षेत्र अनुसार योजना वितरण" : language === 'mr' ? "क्षेत्रांनुसार योजना वितरण" : "Category Distribution"}
              </span>
            </h3>

            <div className="space-y-3">
              {analytics.categoryStats.map((cat: any) => (
                <div key={cat.id} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-800 dark:text-slate-200">
                    {language === 'hi' ? cat.nameHi : language === 'mr' ? cat.nameMr : cat.nameEn}
                  </span>
                  <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded-lg">
                    {cat._count?.schemes || 1} {language === 'hi' ? "योजनाएं" : language === 'mr' ? "योजना" : "Schemes"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* RECENT USER SEARCHES */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <ListFilter className="w-5 h-5 text-purple-600" />
              <span>
                {language === 'hi' ? "हाल के उपयोगकर्ता खोज लॉग" : language === 'mr' ? "अलीकडील शोध लॉग" : "Recent User Search Logs"}
              </span>
            </h3>

            <div className="space-y-2 max-h-80 overflow-y-auto">
              {analytics.recentSearches.map((s: any) => (
                <div key={s.id} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 text-xs flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {language === 'hi' ? "जिला: " : language === 'mr' ? "जिल्हा: " : "District: "}
                      {s.district || "All"}
                    </span>
                    <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                      {language === 'hi' ? "क्षेत्र: " : language === 'mr' ? "क्षेत्र: " : "Sector: "}
                      {s.businessType || "General"}
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(s.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}

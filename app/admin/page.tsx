"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Building2,
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
              Neon PostgreSQL Database • Live Management Portal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/schemes"
            className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>नवीन योजना जोडा (Manage Schemes)</span>
          </Link>

          <button
            onClick={handleAdminLogout}
            className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4 text-red-400" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* METRICS CARDS */}
      {analytics ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
              <span>Total Schemes</span>
              <FileText className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-3xl font-black text-slate-900 block">{analytics.totalSchemes}</span>
            <span className="text-xs text-emerald-700 font-bold">{analytics.activeSchemes} Active Schemes</span>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
              <span>Total Users</span>
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-3xl font-black text-slate-900 block">{analytics.totalUsers}</span>
            <span className="text-xs text-slate-500 font-medium">Registered Entrepreneurs</span>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
              <span>Total Searches</span>
              <Search className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-3xl font-black text-slate-900 block">{analytics.totalSearches}</span>
            <span className="text-xs text-slate-500 font-medium">Recommendation Queries</span>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
              <span>Most Viewed Scheme</span>
              <Eye className="w-5 h-5 text-amber-600" />
            </div>
            <span className="text-sm font-black text-slate-900 block truncate">
              {analytics.mostViewedScheme.nameMr || analytics.mostViewedScheme.nameEn}
            </span>
            <span className="text-xs text-amber-700 font-bold">{analytics.mostViewedScheme.viewCount} Views</span>
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 text-center rounded-2xl border border-slate-200 text-slate-500 font-bold">
          Analytics loading...
        </div>
      )}

      {/* CATEGORIES DISTRIBUTION & RECENT SEARCHES */}
      {analytics && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* CATEGORY STATS */}
          <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <BarChart3 className="w-5 h-5 text-emerald-600" />
              <span>Category Distribution (क्षेत्रांनुसार योजना)</span>
            </h3>

            <div className="space-y-3">
              {analytics.categoryStats.map((cat: any) => (
                <div key={cat.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs font-bold">
                  <span>{cat.nameMr} ({cat.nameEn})</span>
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg">
                    {cat._count.schemes} Schemes
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* RECENT USER SEARCHES */}
          <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <ListFilter className="w-5 h-5 text-purple-600" />
              <span>Recent User Searches (अलीकडील शोध लॉग)</span>
            </h3>

            <div className="space-y-2 max-h-80 overflow-y-auto">
              {analytics.recentSearches.map((s: any) => (
                <div key={s.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-800">जिल्हा: {s.district || "All"}</span>
                    <div className="text-slate-500 text-[11px]">क्षेत्र: {s.businessType || "General"}</div>
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

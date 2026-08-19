"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SchemeCard from "@/components/SchemeCard";
import { User, Bookmark, Search, LogOut, CheckCircle, Sprout } from "lucide-react";

export default function UserDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any | null>(null);
  const [savedSchemes, setSavedSchemes] = useState<any[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    fetch(`/api/bookmarks?userId=${parsedUser.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.savedSchemes) {
          setSavedSchemes(data.savedSchemes.map((s: any) => s.scheme));
        }
      });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/");
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* USER PROFILE HEADER */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white font-black text-2xl flex items-center justify-center shadow-md">
            {user.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">{user.name}</h1>
            <p className="text-xs text-slate-500 font-semibold">{user.email}</p>
            <span className="inline-block px-2.5 py-0.5 mt-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-full">
              उद्योजक खाते (Rural Entrepreneur)
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span>लॉगआउट (Logout)</span>
        </button>
      </div>

      {/* SAVED SCHEMES SECTION */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          <Bookmark className="w-5 h-5 text-emerald-600" />
          <h2 className="text-xl font-bold text-slate-900">
            माझ्या जतन केलेल्या योजना (Saved Schemes)
          </h2>
        </div>

        {savedSchemes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedSchemes.map((scheme) => (
              <SchemeCard key={scheme.id} scheme={scheme} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 space-y-3">
            <Sprout className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-700">अद्याप कोणत्याही योजना जतन केलेल्या नाहीत</h3>
            <p className="text-xs text-slate-500">
              योजना शोधक वापरून तुमच्या व्यवसायासाठी योग्य योजना बुकमार्क करा.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}

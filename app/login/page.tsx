"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/LanguageContext";
import { User, Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        router.push("/dashboard");
      } else {
        setError(data.error || "Authentication failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto font-bold">
            <User className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">
            {isRegister ? "उद्योजक नोंदणी (Register)" : "उद्योजक लॉगिन (Login)"}
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            तुमच्या जतन केलेल्या योजना व शोध पाहण्यासाठी लॉगिन करा
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-bold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">पूर्ण नाव (Full Name)</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  placeholder="उदा. रामराव पाटील"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">ईमेल आयडी (Email)</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">पासवर्ड (Password)</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-md flex items-center justify-center gap-2 text-sm transition-all"
          >
            <span>{isRegister ? "खाते तयार करा" : "लॉगिन करा"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-3 border-t border-slate-100 text-center text-xs">
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-emerald-700 font-bold hover:underline"
          >
            {isRegister
              ? "आधीपासून खाते आहे? लॉगिन करा"
              : "नवीन आहात? येथे नोंदणी करा (Create Account)"}
          </button>
        </div>

      </div>
    </div>
  );
}

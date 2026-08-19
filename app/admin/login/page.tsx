"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, Mail, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "admin@graminudyam.in", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success && data.user?.role === "ADMIN") {
        localStorage.setItem("adminUser", JSON.stringify(data.user));
        localStorage.setItem("adminToken", data.token);
        router.push("/admin");
      } else {
        setError(data.error || "Access denied. Admin credentials required.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-slate-900 text-white rounded-3xl p-8 border border-slate-800 shadow-2xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-amber-500 text-slate-950 rounded-2xl flex items-center justify-center mx-auto font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-white">
            Gramin Udyam Admin Portal
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            प्रशासकीय नियंत्रण कक्ष (Protected Admin Portal)
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-950 border border-red-800 text-red-300 rounded-xl text-xs font-bold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Admin Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-xs font-semibold text-white focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Admin Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                placeholder="Admin@12345"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-xs font-semibold text-white focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl shadow-lg flex items-center justify-center gap-2 text-sm transition-all"
          >
            <span>Admin Login</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 text-[11px] text-slate-400 space-y-1">
          <div className="font-bold text-amber-400">Demo Admin Credentials:</div>
          <div>Email: <code className="text-white">admin@graminudyam.in</code></div>
          <div>Password: <code className="text-white">Admin@12345</code></div>
        </div>

      </div>
    </div>
  );
}

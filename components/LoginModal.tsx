"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "./LanguageContext";
import { X, User, Lock, Mail, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function LoginModal() {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    // Check if user is logged in
    const checkLoginStatus = () => {
      if (typeof window !== "undefined") {
        return !!localStorage.getItem("user");
      }
      return false;
    };

    // If not logged in, show popup shortly after entering (1.5 seconds)
    const initialTimer = setTimeout(() => {
      if (!checkLoginStatus()) {
        setIsOpen(true);
      }
    }, 1500);

    // Repeated timer: every 3 minutes (180,000 ms), show popup if not logged in
    const intervalTimer = setInterval(() => {
      if (!checkLoginStatus()) {
        setIsOpen(true);
      }
    }, 3 * 60 * 1000);

    const handleLoginChange = () => {
      if (checkLoginStatus()) {
        setIsOpen(false);
      }
    };
    window.addEventListener("user-login-change", handleLoginChange);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
      window.removeEventListener("user-login-change", handleLoginChange);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, language }),
      });

      const data = await res.json();
      if (data.success && data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        if (data.token) localStorage.setItem("token", data.token);
        setSuccessMsg(language === 'hi' ? "सफलतापूर्वक लॉगिन हो गया!" : language === 'mr' ? "यशस्वीरित्या लॉगिन झाले!" : "Logged in successfully!");
        
        // Notify other components
        window.dispatchEvent(new Event("user-login-change"));

        setTimeout(() => {
          setIsOpen(false);
          setSuccessMsg("");
        }, 800);
      } else {
        setError(data.error || (language === 'hi' ? "लॉगिन विफल रहा" : language === 'mr' ? "लॉगिन अयशस्वी झाले" : "Authentication failed"));
      }
    } catch (err) {
      setError(language === 'hi' ? "नेटवर्क त्रुटि, पुनः प्रयास करें" : language === 'mr' ? "नेटवर्क त्रुटी, पुन्हा प्रयत्न करा" : "Network error, please try again");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-emerald-500/30 overflow-hidden transform animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button (Cross Button) */}
        <button
          onClick={handleClose}
          aria-label="Close"
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon & Title */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-13 h-13 bg-gradient-to-br from-emerald-600 to-green-700 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <User className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            {isRegister ? t.registerTitle : t.loginTitle}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium px-4">
            {t.loginSubtitle}
          </p>
        </div>

        {/* Error / Success Feedback */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl text-xs font-bold text-center">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {isRegister && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                {t.fullName}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  placeholder={t.fullNamePlaceholder}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              {t.email}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                placeholder={t.emailPlaceholder}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              {t.password}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white font-extrabold rounded-xl shadow-md flex items-center justify-center gap-2 text-sm transition-all mt-4"
          >
            <span>{isRegister ? t.registerButton : t.loginButton}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Switch Login / Register */}
        <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs">
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
            }}
            className="text-emerald-700 dark:text-emerald-400 font-bold hover:underline"
          >
            {isRegister ? t.haveAccount : t.newUser}
          </button>
        </div>
      </div>
    </div>
  );
}

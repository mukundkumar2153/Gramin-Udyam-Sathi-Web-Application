"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "./LanguageContext";
import { Language } from "@/lib/i18n";
import { Sprout, Globe, Menu, X, User, ShieldCheck, Search, Bot, MapPin, Grid } from "lucide-react";

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: t.navHome, icon: Sprout },
    { href: "/find-schemes", label: t.navFindSchemes, icon: Search, highlight: true },
    { href: "/schemes", label: t.navAllSchemes, icon: Grid },
    { href: "/districts", label: t.navDistricts, icon: MapPin },
    { href: "/ai-assistant", label: t.navAIAssistant, icon: Bot },
  ];

  const languages: { code: Language; label: string }[] = [
    { code: "mr", label: "मराठी" },
    { code: "hi", label: "हिंदी" },
    { code: "en", label: "English" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-3">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-600 to-green-700 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-extrabold text-xl text-emerald-950 block leading-tight tracking-tight">
                ग्रामीण उद्यम साथी
              </span>
              <span className="text-[11px] font-medium text-emerald-600 tracking-wide block">
                Gramin Udyam Sathi • Maharashtra
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                    link.highlight
                      ? "bg-emerald-600 text-white shadow-sm hover:bg-emerald-700"
                      : isActive
                      ? "bg-emerald-50 text-emerald-800"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Controls & Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Language Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <Globe className="w-4 h-4 text-emerald-700 ml-2 mr-1" />
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                    language === lang.code
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            {/* User Dashboard / Login */}
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-bold text-slate-700 hover:text-emerald-700 rounded-lg hover:bg-emerald-50 transition-colors"
            >
              <User className="w-4 h-4 text-emerald-600" />
              <span>{t.navLogin}</span>
            </Link>

            <Link
              href="/admin/login"
              className="flex items-center gap-1 px-3 py-2 text-xs font-bold text-slate-500 hover:text-emerald-800 bg-slate-100 hover:bg-emerald-100/50 rounded-lg transition-colors"
              title="Admin Portal"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>Admin</span>
            </Link>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex lg:hidden items-center gap-2">
            {/* Quick Language Toggle on Mobile */}
            <button
              onClick={() => {
                const nextLang: Record<Language, Language> = { mr: "hi", hi: "en", en: "mr" };
                setLanguage(nextLang[language]);
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{language === 'mr' ? 'मराठी' : language === 'hi' ? 'हिंदी' : 'EN'}</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-xl"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="grid grid-cols-1 gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm ${
                    pathname === link.href
                      ? "bg-emerald-600 text-white"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <div className="flex items-center justify-between px-2">
              <span className="text-xs font-semibold text-slate-500">भाषा निवडा (Language):</span>
              <div className="flex gap-1">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`px-3 py-1 text-xs font-bold rounded-lg ${
                      language === lang.code
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-800 text-sm font-bold rounded-xl"
              >
                <User className="w-4 h-4 text-emerald-600" />
                <span>{t.navLogin}</span>
              </Link>
              <Link
                href="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-amber-50 text-amber-900 border border-amber-200 text-sm font-bold rounded-xl"
              >
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Admin Login</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

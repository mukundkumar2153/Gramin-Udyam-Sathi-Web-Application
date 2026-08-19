"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "./LanguageContext";
import { useTheme, Theme } from "./ThemeContext";
import { Language } from "@/lib/i18n";
import { Sprout, Globe, Menu, X, User, ShieldCheck, Search, Bot, MapPin, Grid, Palette, Sun, Moon, Droplets } from "lucide-react";

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
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

  const themes: { id: Theme; nameMr: string; nameEn: string; colorBg: string; icon: any }[] = [
    { id: "gramin", nameMr: "ग्रामीण (Emerald)", nameEn: "Gramin Emerald", colorBg: "bg-emerald-600", icon: Sprout },
    { id: "saffron", nameMr: "सुराज्य (Saffron)", nameEn: "Surajya Saffron", colorBg: "bg-amber-500", icon: Sun },
    { id: "shetkari", nameMr: "शेतकरी (Forest Green)", nameEn: "Shetkari Green", colorBg: "bg-green-700", icon: Sprout },
    { id: "neer", nameMr: "नीर (Navy Blue)", nameEn: "Neer Blue", colorBg: "bg-sky-600", icon: Droplets },
    { id: "dark", nameMr: "रात्रक (Dark Mode)", nameEn: "Ratrak Dark", colorBg: "bg-slate-900", icon: Moon },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-3">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-600 to-green-700 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-extrabold text-xl text-slate-900 block leading-tight tracking-tight">
                {t.brandName}
              </span>
              <span className="text-[11px] font-bold text-emerald-600 tracking-wide block">
                Maharashtra • Gramin Portal
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
                      ? "bg-emerald-600 text-white shadow-xs hover:bg-emerald-700"
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
            
            {/* THEME SWITCHER DROPDOWN */}
            <div className="relative">
              <button
                onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all border border-slate-200"
                title="Change Theme (थीम बदला)"
              >
                <Palette className="w-4 h-4 text-emerald-600" />
                <span>थीम (Theme)</span>
              </button>

              {themeDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    Select Theme
                  </div>
                  {themes.map((th) => {
                    const ThIcon = th.icon;
                    return (
                      <button
                        key={th.id}
                        onClick={() => {
                          setTheme(th.id);
                          setThemeDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                          theme === th.id
                            ? "bg-emerald-50 text-emerald-900 font-extrabold"
                            : "text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-3.5 h-3.5 rounded-full ${th.colorBg}`} />
                          <span>{language === 'en' ? th.nameEn : th.nameMr}</span>
                        </div>
                        {theme === th.id && <span className="text-emerald-600 font-bold">✓</span>}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

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
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-bold text-slate-700 hover:text-emerald-700 rounded-lg hover:bg-emerald-50 transition-colors"
            >
              <User className="w-4 h-4 text-emerald-600" />
              <span>{t.navLogin}</span>
            </Link>

            <Link
              href="/admin/login"
              className="flex items-center gap-1 px-2.5 py-2 text-xs font-bold text-slate-500 hover:text-emerald-800 bg-slate-100 hover:bg-emerald-100/50 rounded-lg transition-colors"
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
        <div className="lg:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-4">
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

          {/* Theme Selector Grid for Mobile */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <span className="text-xs font-bold text-slate-500 block">थीम निवडा (Select Theme):</span>
            <div className="grid grid-cols-3 gap-1.5">
              {themes.map((th) => (
                <button
                  key={th.id}
                  onClick={() => setTheme(th.id)}
                  className={`p-2 rounded-xl border text-[11px] font-bold text-center ${
                    theme === th.id
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "bg-slate-50 text-slate-700 border-slate-200"
                  }`}
                >
                  {th.nameMr.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Language Switcher for Mobile */}
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

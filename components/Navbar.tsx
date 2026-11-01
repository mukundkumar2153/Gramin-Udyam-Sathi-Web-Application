"use client";

import React, { useState, useEffect } from "react";
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
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const updateUser = () => {
      try {
        const u = localStorage.getItem("user");
        setCurrentUser(u ? JSON.parse(u) : null);
      } catch (e) {
        setCurrentUser(null);
      }
    };
    updateUser();

    window.addEventListener("user-login-change", updateUser);
    return () => window.removeEventListener("user-login-change", updateUser);
  }, []);

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

  const themes: { id: Theme; nameMr: string; nameHi: string; nameEn: string; colorBg: string; icon: any }[] = [
    { id: "gramin", nameMr: "ग्रामीण (Emerald)", nameHi: "ग्रामीण (एमराल्ड)", nameEn: "Gramin Emerald", colorBg: "bg-emerald-600", icon: Sprout },
    { id: "saffron", nameMr: "सुराज्य (Saffron)", nameHi: "सुराज्य (केसरिया)", nameEn: "Surajya Saffron", colorBg: "bg-amber-500", icon: Sun },
    { id: "shetkari", nameMr: "शेतकरी (Forest)", nameHi: "शेतकरी (हरा)", nameEn: "Shetkari Green", colorBg: "bg-green-700", icon: Sprout },
    { id: "neer", nameMr: "नीर (Navy Blue)", nameHi: "नीर (नीला)", nameEn: "Neer Blue", colorBg: "bg-sky-600", icon: Droplets },
    { id: "dark", nameMr: "रात्रक (Dark Mode)", nameHi: "डार्क मोड", nameEn: "Dark Mode", colorBg: "bg-slate-900", icon: Moon },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-3">
          
          {/* Logo */}
          <Link href="/" prefetch={true} className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-600 to-green-700 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-extrabold text-xl text-slate-900 dark:text-white block leading-tight tracking-tight">
                {t.brandName}
              </span>
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 tracking-wide block">
                {language === 'hi' ? "महाराष्ट्र • ग्रामीण पोर्टल" : language === 'mr' ? "महाराष्ट्र • ग्रामीण पोर्टल" : "Maharashtra • Gramin Portal"}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links (Instant Prefetch enabled) */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch={true}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                    link.highlight
                      ? "bg-emerald-600 text-white shadow-xs hover:bg-emerald-700"
                      : isActive
                      ? "bg-emerald-50 text-emerald-800 dark:bg-slate-800 dark:text-emerald-400 font-extrabold"
                      : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
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
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-xl text-xs font-bold transition-all border border-slate-200 dark:border-slate-700"
                title={t.selectTheme}
              >
                <Palette className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{t.selectTheme}</span>
              </button>

              {themeDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-2 z-50 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    {t.selectTheme}
                  </div>
                  {themes.map((th) => (
                    <button
                      key={th.id}
                      onClick={() => {
                        setTheme(th.id);
                        setThemeDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                        theme === th.id
                          ? "bg-emerald-50 dark:bg-slate-700 text-emerald-900 dark:text-emerald-300 font-extrabold border border-emerald-200 dark:border-emerald-600"
                          : "text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-3.5 h-3.5 rounded-full ${th.colorBg}`} />
                        <span>{language === 'hi' ? th.nameHi : language === 'mr' ? th.nameMr : th.nameEn}</span>
                      </div>
                      {theme === th.id && <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Language Switcher */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <Globe className="w-4 h-4 text-emerald-700 dark:text-emerald-400 ml-2 mr-1" />
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                    language === lang.code
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            {/* User Dashboard / Login Button */}
            {currentUser ? (
              <Link
                href="/dashboard"
                prefetch={true}
                className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-emerald-900 dark:text-emerald-200 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 rounded-xl hover:bg-emerald-100 transition-colors"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">
                  {currentUser.profileImage ? (
                    <img src={currentUser.profileImage} alt="" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    (currentUser.name || "U").charAt(0).toUpperCase()
                  )}
                </div>
                <span className="max-w-[90px] truncate">{currentUser.name || t.navDashboard}</span>
              </Link>
            ) : (
              <Link
                href="/login"
                prefetch={true}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400 rounded-lg hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors"
              >
                <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{t.navLogin}</span>
              </Link>
            )}

            <Link
              href="/admin/login"
              prefetch={true}
              className="flex items-center gap-1 px-2.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100/50 rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
              title="Admin Portal"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Admin</span>
            </Link>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => {
                const nextLang: Record<Language, Language> = { mr: "hi", hi: "en", en: "mr" };
                setLanguage(nextLang[language]);
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold bg-emerald-50 text-emerald-800 dark:bg-slate-800 dark:text-emerald-400 rounded-lg border border-emerald-200 dark:border-slate-700"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{language === 'mr' ? 'मराठी' : language === 'hi' ? 'हिंदी' : 'EN'}</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-4">
          <div className="grid grid-cols-1 gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch={true}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm ${
                    pathname === link.href
                      ? "bg-emerald-600 text-white"
                      : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            {/* Profile / Login link in mobile menu */}
            <Link
              href={currentUser ? "/dashboard" : "/login"}
              prefetch={true}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-slate-800"
            >
              <User className="w-5 h-5" />
              <span>{currentUser ? t.navDashboard : t.navLogin}</span>
            </Link>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">
              {t.selectTheme}:
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {themes.map((th) => (
                <button
                  key={th.id}
                  onClick={() => setTheme(th.id)}
                  className={`p-2 rounded-xl border text-[11px] font-bold text-center ${
                    theme === th.id
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700"
                  }`}
                >
                  {language === 'en' ? th.nameEn.split(" ")[0] : language === 'hi' ? th.nameHi.split(" ")[0] : th.nameMr.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

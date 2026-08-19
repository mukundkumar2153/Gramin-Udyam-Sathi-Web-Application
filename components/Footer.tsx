"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "./LanguageContext";
import { Sprout, ShieldAlert, ExternalLink, Heart } from "lucide-react";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Government Disclaimer Banner */}
        <div className="mb-10 bg-amber-950/40 border border-amber-800/60 rounded-2xl p-5 text-amber-200 flex gap-4 items-start">
          <ShieldAlert className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm leading-relaxed">
            <span className="font-extrabold block text-amber-300 mb-1">
              अस्वीकरण (Important Disclaimer):
            </span>
            {t.disclaimer}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Brand Column */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-lg text-white">
                ग्रामीण उद्यम साथी
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t.tagline}
            </p>
            <div className="text-xs text-emerald-400 font-semibold">
              Maharashtra Rural Entrepreneurship Portal
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/find-schemes" className="hover:text-emerald-400 transition-colors">
                  {t.navFindSchemes}
                </Link>
              </li>
              <li>
                <Link href="/schemes" className="hover:text-emerald-400 transition-colors">
                  {t.navAllSchemes}
                </Link>
              </li>
              <li>
                <Link href="/districts" className="hover:text-emerald-400 transition-colors">
                  {t.navDistricts}
                </Link>
              </li>
              <li>
                <Link href="/ai-assistant" className="hover:text-emerald-400 transition-colors">
                  {t.navAIAssistant}
                </Link>
              </li>
            </ul>
          </div>

          {/* Government Portals */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Official Portals
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://maharashtra.gov.in/"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 hover:text-emerald-400 transition-colors"
                >
                  <span>Government of Maharashtra</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://industry.maharashtra.gov.in/"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 hover:text-emerald-400 transition-colors"
                >
                  <span>Directorate of Industries</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://cmegp.mahait.org/"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 hover:text-emerald-400 transition-colors"
                >
                  <span>CMEGP Maharashtra Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.mudra.org.in/"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 hover:text-emerald-400 transition-colors"
                >
                  <span>Mudra Loan Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Contact / Project Info */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Project Support
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              College Engineering Demonstration Project designed for Maharashtra's rural business ecosystem.
            </p>
            <div className="text-xs text-slate-400">
              <span className="font-bold text-slate-200">Email:</span> support@graminudyam.in
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            © {new Date().getFullYear()} Gramin Udyam Sathi. All rights reserved.
          </div>
          <div className="flex items-center gap-1">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" />
            <span>for Maharashtra Entrepreneurs</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

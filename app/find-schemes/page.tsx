"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/components/LanguageContext";
import SchemeCard from "@/components/SchemeCard";
import {
  MapPin,
  Building2,
  UserCheck,
  CheckSquare,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Info,
  X,
  RefreshCw,
} from "lucide-react";

export default function FindSchemesPage() {
  const { t, language } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [districts, setDistricts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [selectedSchemeForModal, setSelectedSchemeForModal] = useState<any | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    district: "pune",
    businessType: "Dairy",
    businessStage: "New",
    investmentRange: "1-5 Lakhs",
    entrepreneurType: "Women",
    requirements: ["Loan", "Subsidy"],
  });

  useEffect(() => {
    fetch("/api/districts")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.districts) {
          setDistricts(data.districts);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const handleRequirementToggle = (req: string) => {
    setFormData((prev) => {
      const exists = prev.requirements.includes(req);
      if (exists) {
        return { ...prev, requirements: prev.requirements.filter((r) => r !== req) };
      } else {
        return { ...prev, requirements: [...prev.requirements, req] };
      }
    });
  };

  const handleFindSchemes = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success && data.recommendations) {
        setRecommendations(data.recommendations);
        setCurrentStep(5); // Jump to Results
      }
    } catch (err) {
      console.error("Error fetching recommendations:", err);
    } finally {
      setLoading(false);
    }
  };

  // MULTILINGUAL LABELS
  const stepTitles = {
    step1: language === 'hi' ? '१. स्थान' : language === 'mr' ? '१. जिल्हा' : '1. Location',
    step2: language === 'hi' ? '२. व्यवसाय' : language === 'mr' ? '२. व्यवसाय' : '2. Business',
    step3: language === 'hi' ? '३. श्रेणी' : language === 'mr' ? '३. प्रवर्ग' : '3. Category',
    step4: language === 'hi' ? '४. आवश्यकताएं' : language === 'mr' ? '४. गरजा' : '4. Needs',
    next: language === 'hi' ? 'अगला चरण' : language === 'mr' ? 'पुढील टप्पा' : 'Next Step',
    back: language === 'hi' ? 'पीछे' : language === 'mr' ? 'मागे' : 'Back',
    findBtn: language === 'hi' ? 'उपयुक्त योजनाएं खोजें' : language === 'mr' ? 'योग्य योजना शोधा' : 'Find Suitable Schemes',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* HEADER */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-extrabold">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>{language === 'hi' ? '१००-अंक पारदर्शी सिफारिश प्रणाली' : language === 'mr' ? '१००-गुण पारदर्शक शिफारस प्रणाली' : '100-Point Recommendation Scoring'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
          {language === 'hi' ? 'स्मार्ट योजना सिफारिश फॉर्म' : language === 'mr' ? 'स्मार्ट योजना शिफारस अर्ज' : 'Smart Scheme Finder Wizard'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 font-medium">
          {language === 'hi' ? 'अपने व्यवसाय, जिले और जरूरतों की जानकारी चुनें। हमारा इंजन १०० अंकों में से सबसे उपयुक्त योजनाएं दिखाएगा।' : language === 'mr' ? 'तुमच्या व्यवसायाची, जिल्ह्याची व गरजांची अचूक माहिती निवडा. आमचे इंजिन १०० गुणांपैकी सर्वोत्तम जुळणाऱ्या योजना सुचवेल.' : 'Select your district, business type, and requirements to calculate exact match scores.'}
        </p>
      </div>

      {/* STEP PROGRESS BAR */}
      {currentStep <= 4 && (
        <div className="max-w-3xl mx-auto bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold">
            <div className={`py-2 rounded-xl transition-all ${currentStep === 1 ? "bg-emerald-600 text-white" : currentStep > 1 ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-500"}`}>
              {stepTitles.step1}
            </div>
            <div className={`py-2 rounded-xl transition-all ${currentStep === 2 ? "bg-emerald-600 text-white" : currentStep > 2 ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-500"}`}>
              {stepTitles.step2}
            </div>
            <div className={`py-2 rounded-xl transition-all ${currentStep === 3 ? "bg-emerald-600 text-white" : currentStep > 3 ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-500"}`}>
              {stepTitles.step3}
            </div>
            <div className={`py-2 rounded-xl transition-all ${currentStep === 4 ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-500"}`}>
              {stepTitles.step4}
            </div>
          </div>
        </div>
      )}

      {/* WIZARD CONTAINER */}
      <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-lg">
        
        {/* STEP 1: LOCATION */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <MapPin className="w-6 h-6 text-emerald-600" />
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {language === 'hi' ? 'चरण १: जिला चुनें (Location)' : language === 'mr' ? 'टप्पा १: जिल्हा निवडा (Location)' : 'Step 1: Select District'}
                </h2>
                <p className="text-xs text-slate-500">
                  {language === 'hi' ? 'महाराष्ट्र में अपना जिला चुनें' : language === 'mr' ? 'महाराष्ट्रातील तुमचा जिल्हा निवडा' : 'Select your district in Maharashtra'}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                  {language === 'hi' ? 'राज्य' : language === 'mr' ? 'राज्य' : 'State'}
                </label>
                <input
                  type="text"
                  disabled
                  value="Maharashtra (महाराष्ट्र)"
                  className="w-full p-3 bg-slate-100 border border-slate-200 rounded-xl text-sm font-bold text-slate-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                  {language === 'hi' ? 'जिला' : language === 'mr' ? 'जिल्हा' : 'District'}
                </label>
                <select
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                >
                  {districts.map((d) => (
                    <option key={d.id} value={d.slug}>
                      {language === 'hi' ? d.nameHi : language === 'mr' ? d.nameMr : d.nameEn} ({d.nameEn})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-7 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl flex items-center gap-2 text-sm"
              >
                <span>{stepTitles.next}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: BUSINESS DETAILS */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <Building2 className="w-6 h-6 text-emerald-600" />
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {language === 'hi' ? 'चरण २: व्यवसाय का प्रकार (Business Profile)' : language === 'mr' ? 'टप्पा २: व्यवसाय प्रकार व टप्पा (Business Profile)' : 'Step 2: Business Profile'}
                </h2>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                  {language === 'hi' ? 'व्यवसाय क्षेत्र' : language === 'mr' ? 'व्यवसाय क्षेत्र' : 'Business Sector'}
                </label>
                <select
                  value={formData.businessType}
                  onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                  className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-900"
                >
                  <option value="Agriculture">{language === 'hi' ? 'कृषि एवं कृषि व्यवसाय' : language === 'mr' ? 'शेती व कृषी जोडव्यवसाय' : 'Agriculture & Agribusiness'}</option>
                  <option value="Dairy">{language === 'hi' ? 'डेयरी एवं पशुपालन' : language === 'mr' ? 'दुग्धव्यवसाय व गोठा' : 'Dairy & Animal Husbandry'}</option>
                  <option value="Food Processing">{language === 'hi' ? 'खाद्य प्रसंस्करण उद्योग' : language === 'mr' ? 'अन्न प्रक्रिया व पॅकेजिंग' : 'Food Processing Enterprises'}</option>
                  <option value="Handicrafts">{language === 'hi' ? 'हस्तशिल्प एवं कारीगर' : language === 'mr' ? 'हस्तकला व कारागीर' : 'Handicrafts & Artisans'}</option>
                  <option value="Manufacturing">{language === 'hi' ? 'लघु उद्योग निर्माण' : language === 'mr' ? 'लघु उद्योग निर्माण' : 'Small Scale Manufacturing'}</option>
                  <option value="Retail & Services">{language === 'hi' ? 'खुदरा एवं सेवाएं' : language === 'mr' ? 'किरकोळ विक्री व सेवा' : 'Retail & Village Services'}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                  {language === 'hi' ? 'व्यवसाय का चरण' : language === 'mr' ? 'व्यवसायाचा टप्पा' : 'Business Stage'}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: "Idea", label: language === 'hi' ? 'संकल्पना (Idea)' : language === 'mr' ? 'संकल्पना (Idea)' : 'Idea Stage' },
                    { id: "New", label: language === 'hi' ? 'नया व्यवसाय (New)' : language === 'mr' ? 'नवीन उद्योग (New)' : 'New Enterprise' },
                    { id: "Existing", label: language === 'hi' ? 'मौजूदा व्यवसाय (Existing)' : language === 'mr' ? 'विद्यमान व्यवसाय (Existing)' : 'Existing Business' },
                    { id: "Expansion", label: language === 'hi' ? 'विस्तार (Expansion)' : language === 'mr' ? 'विस्तार (Expansion)' : 'Expansion' },
                  ].map((stg) => (
                    <button
                      key={stg.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, businessStage: stg.id })}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                        formData.businessStage === stg.id
                          ? "bg-emerald-600 text-white border-emerald-600"
                          : "bg-slate-50 text-slate-700 border-slate-200"
                      }`}
                    >
                      {stg.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl flex items-center gap-2 text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{stepTitles.back}</span>
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="px-7 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl flex items-center gap-2 text-sm"
              >
                <span>{stepTitles.next}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: ENTREPRENEUR PROFILE */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <UserCheck className="w-6 h-6 text-emerald-600" />
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {language === 'hi' ? 'चरण ३: उद्यमी प्रोफ़ाइल (Entrepreneur Profile)' : language === 'mr' ? 'टप्पा ३: उद्योजक प्रवर्ग (Entrepreneur Profile)' : 'Step 3: Entrepreneur Category'}
                </h2>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: "Women", label: language === 'hi' ? 'महिला उद्यमी (Women)' : language === 'mr' ? 'महिला उद्योजक (Women)' : 'Women Entrepreneur' },
                  { id: "Youth", label: language === 'hi' ? 'युवा उद्यमी (Youth)' : language === 'mr' ? 'तरुण उद्योजक (Youth)' : 'Youth Entrepreneur' },
                  { id: "SHG/FPO", label: language === 'hi' ? 'बचत समूह / FPO' : language === 'mr' ? 'महिला बचत गट / FPO' : 'SHG / FPO Member' },
                  { id: "General", label: language === 'hi' ? 'सामान्य वर्ग (General)' : language === 'mr' ? 'सर्वसाधारण (General)' : 'General Category' },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, entrepreneurType: p.id })}
                    className={`p-3.5 rounded-xl border text-xs font-bold transition-all text-left ${
                      formData.entrepreneurType === p.id
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "bg-slate-50 text-slate-700 border-slate-200"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl flex items-center gap-2 text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{stepTitles.back}</span>
              </button>
              <button
                onClick={() => setCurrentStep(4)}
                className="px-7 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl flex items-center gap-2 text-sm"
              >
                <span>{stepTitles.next}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: REQUIREMENTS */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <CheckSquare className="w-6 h-6 text-emerald-600" />
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {language === 'hi' ? 'चरण ४: क्या आवश्यकता है?' : language === 'mr' ? 'टप्पा ४: काय गरज आहे?' : 'Step 4: Select Requirements'}
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { id: "Loan", label: language === 'hi' ? 'ऋण (Business Loan)' : language === 'mr' ? 'बँक कर्ज (Business Loan)' : 'Bank Loan' },
                { id: "Subsidy", label: language === 'hi' ? 'सब्सिडी (Subsidy Grant)' : language === 'mr' ? 'शासकीय अनुदान (Subsidy)' : 'Subsidy Grant' },
                { id: "Training", label: language === 'hi' ? 'कौशल प्रशिक्षण (Skill Training)' : language === 'mr' ? 'कौशल्य प्रशिक्षण (Training)' : 'Skill Training' },
                { id: "Equipment", label: language === 'hi' ? 'उपकरण सहायता (Machinery)' : language === 'mr' ? 'यंत्रसामग्री मदत (Equipment)' : 'Machinery & Tools' },
              ].map((req) => {
                const isChecked = formData.requirements.includes(req.id);
                return (
                  <button
                    key={req.id}
                    type="button"
                    onClick={() => handleRequirementToggle(req.id)}
                    className={`p-4 rounded-xl border text-xs font-extrabold text-left transition-all flex items-center justify-between ${
                      isChecked
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "bg-slate-50 text-slate-700 border-slate-200"
                    }`}
                  >
                    <span>{req.label}</span>
                    <input type="checkbox" checked={isChecked} onChange={() => {}} className="rounded text-emerald-600" />
                  </button>
                );
              })}
            </div>

            <div className="pt-4 flex justify-between">
              <button
                onClick={() => setCurrentStep(3)}
                className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl flex items-center gap-2 text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{stepTitles.back}</span>
              </button>

              <button
                onClick={handleFindSchemes}
                disabled={loading}
                className="px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl shadow-lg flex items-center gap-2 text-sm"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>{stepTitles.findBtn}</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: RESULTS */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  {language === 'hi' ? 'आपके लिए अनुशंसित योजनाएं' : language === 'mr' ? 'तुमच्यासाठी सुचवलेल्या योजना' : 'Recommended Schemes for You'}
                </h2>
              </div>
              <button
                onClick={() => setCurrentStep(1)}
                className="px-3.5 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'बदलें' : language === 'mr' ? 'बदला' : 'Change Inputs'}</span>
              </button>
            </div>

            <div className="space-y-6">
              {recommendations.map((rec) => (
                <SchemeCard
                  key={rec.scheme.id}
                  scheme={rec.scheme}
                  matchScore={rec.matchScore}
                  onWhyRecommended={() => setSelectedSchemeForModal(rec)}
                />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* WHY WAS THIS RECOMMENDED MODAL */}
      {selectedSchemeForModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 border border-slate-200 shadow-2xl relative">
            <button onClick={() => setSelectedSchemeForModal(null)} className="absolute top-4 right-4 p-2 text-slate-400">
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-emerald-700 font-extrabold text-sm border-b border-slate-100 pb-3">
              <Info className="w-5 h-5" />
              <span>{t.whyRecommended}</span>
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-slate-900">
                {language === 'hi' ? selectedSchemeForModal.scheme.nameHi : language === 'mr' ? selectedSchemeForModal.scheme.nameMr : selectedSchemeForModal.scheme.nameEn}
              </h3>
              <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-600 text-white font-extrabold text-xs rounded-full">
                <span>{t.matchScore}: {selectedSchemeForModal.matchScore} / १००</span>
              </div>
            </div>
            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {selectedSchemeForModal.criteria.map((c: any, idx: number) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-800">
                      {language === 'hi' ? c.labelHi : language === 'mr' ? c.labelMr : c.labelEn}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {language === 'hi' ? c.explanationHi : language === 'mr' ? c.explanationMr : c.explanationEn}
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-800 font-mono font-bold text-xs">
                    +{c.score} / {c.maxScore}
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

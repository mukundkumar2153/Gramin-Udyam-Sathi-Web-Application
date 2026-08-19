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
  Building,
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* HEADER */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-extrabold">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>१००-गुण पारदर्शक जुळणी प्रणाली (100-Point Recommendation)</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
          स्मार्ट योजना शिफारस अर्ज
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 font-medium">
          तुमच्या व्यवसायाची, जिल्ह्याची व गरजांची अचूक माहिती निवडा. आमचे इंजिन १०० गुणांपैकी सर्वोत्तम जुळणाऱ्या योजना सुचवेल.
        </p>
      </div>

      {/* STEP PROGRESS BAR */}
      {currentStep <= 4 && (
        <div className="max-w-3xl mx-auto bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold">
            <div className={`py-2 rounded-xl transition-all ${currentStep === 1 ? "bg-emerald-600 text-white" : currentStep > 1 ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-500"}`}>
              १. जिल्हा
            </div>
            <div className={`py-2 rounded-xl transition-all ${currentStep === 2 ? "bg-emerald-600 text-white" : currentStep > 2 ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-500"}`}>
              २. व्यवसाय
            </div>
            <div className={`py-2 rounded-xl transition-all ${currentStep === 3 ? "bg-emerald-600 text-white" : currentStep > 3 ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-500"}`}>
              ३. प्रवर्गाची माहिती
            </div>
            <div className={`py-2 rounded-xl transition-all ${currentStep === 4 ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-500"}`}>
              ४. गरजा
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
                <h2 className="text-xl font-bold text-slate-900">टप्पा १: स्थान व जिल्हा निवडा (Location)</h2>
                <p className="text-xs text-slate-500">महाराष्ट्रातील तुमचा जिल्हा निवडा</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">राज्य (State)</label>
                <input
                  type="text"
                  disabled
                  value="Maharashtra (महाराष्ट्र)"
                  className="w-full p-3 bg-slate-100 border border-slate-200 rounded-xl text-sm font-bold text-slate-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">जिल्हा (District)</label>
                <select
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                >
                  {districts.map((d) => (
                    <option key={d.id} value={d.slug}>
                      {d.nameMr} ({d.nameEn}) — {d.region}
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
                <span>पुढील टप्पा</span>
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
                <h2 className="text-xl font-bold text-slate-900">टप्पा २: व्यवसाय प्रकार व टप्पा (Business Profile)</h2>
                <p className="text-xs text-slate-500">तुम्ही कोणत्या क्षेत्रातील व्यवसाय करू इच्छिता?</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">व्यवसाय क्षेत्र (Sector)</label>
                <select
                  value={formData.businessType}
                  onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                  className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-900"
                >
                  <option value="Agriculture">शेती व कृषी जोडव्यवसाय (Agriculture)</option>
                  <option value="Dairy">दुग्धव्यवसाय व गोठा (Dairy & Husbandry)</option>
                  <option value="Food Processing">अन्न प्रक्रिया व पॅकेजिंग (Food Processing)</option>
                  <option value="Handicrafts">हस्तकला व कारागीर (Handicrafts)</option>
                  <option value="Manufacturing">लघु उद्योग निर्माण (Small Manufacturing)</option>
                  <option value="Retail & Services">किरकोळ विक्री व सेवा (Retail & Services)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">व्यवसायाचा टप्पा (Stage)</label>
                <div className="grid grid-cols-2 gap-3">
                  {["Idea / संकल्पना", "New / नवीन उद्योग", "Existing / विद्यमान व्यवसाय", "Expansion / विस्तार"].map((stg) => {
                    const stgVal = stg.split(" / ")[0];
                    return (
                      <button
                        key={stgVal}
                        type="button"
                        onClick={() => setFormData({ ...formData, businessStage: stgVal })}
                        className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                          formData.businessStage === stgVal
                            ? "bg-emerald-600 text-white border-emerald-600"
                            : "bg-slate-50 text-slate-700 border-slate-200"
                        }`}
                      >
                        {stg}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">अंदाजे भांडवल / गुंतवणूक (Investment)</label>
                <select
                  value={formData.investmentRange}
                  onChange={(e) => setFormData({ ...formData, investmentRange: e.target.value })}
                  className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-900"
                >
                  <option value="Under 1 Lakh">₹१ लाखापेक्षा कमी (Under 1 Lakh)</option>
                  <option value="1-5 Lakhs">₹१ लाख ते ₹५ लाख (1 - 5 Lakhs)</option>
                  <option value="5-25 Lakhs">₹५ लाख ते ₹२५ लाख (5 - 25 Lakhs)</option>
                  <option value="Above 25 Lakhs">₹२५ लाखांपेक्षा जास्त (Above 25 Lakhs)</option>
                </select>
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl flex items-center gap-2 text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>मागे</span>
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="px-7 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl flex items-center gap-2 text-sm"
              >
                <span>पुढील टप्पा</span>
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
                <h2 className="text-xl font-bold text-slate-900">टप्पा ३: उद्योजक प्रवर्ग (Entrepreneur Profile)</h2>
                <p className="text-xs text-slate-500">विशेष सवलत किंवा अनुदानासाठी तुमचे प्रवर्ग निवडा</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">उद्योजक प्रकार (Category)</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: "Women", label: "महिला उद्योजक (Women Entrepreneur)" },
                    { id: "Youth", label: "तरुण उद्योजक (Youth Entrepreneur)" },
                    { id: "SHG/FPO", label: "महिला बचत गट / FPO (SHG/FPO Member)" },
                    { id: "General", label: "सर्वसाधारण (General Category)" },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, entrepreneurType: p.id })}
                      className={`p-3.5 rounded-xl border text-xs font-bold transition-all text-left ${
                        formData.entrepreneurType === p.id
                          ? "bg-emerald-600 text-white border-emerald-600"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:border-emerald-300"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl flex items-center gap-2 text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>मागे</span>
              </button>
              <button
                onClick={() => setCurrentStep(4)}
                className="px-7 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl flex items-center gap-2 text-sm"
              >
                <span>पुढील टप्पा</span>
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
                <h2 className="text-xl font-bold text-slate-900">टप्पा ४: व्यवसायासाठी नेमकी काय गरज आहे?</h2>
                <p className="text-xs text-slate-500">एक किंवा अनेक पर्याय निवडा (Select all that apply)</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { id: "Loan", label: "बँक कर्ज (Business Loan)" },
                { id: "Subsidy", label: "शासकीय अनुदान (Subsidy Grant)" },
                { id: "Training", label: "कौशल्य प्रशिक्षण (Skill Training)" },
                { id: "Equipment", label: "यंत्रसामग्री मदत (Machinery & Tools)" },
                { id: "Market Access", label: "बाजारपेठ जोडणी (Market Access)" },
              ].map((req) => {
                const isChecked = formData.requirements.includes(req.id);
                return (
                  <button
                    key={req.id}
                    type="button"
                    onClick={() => handleRequirementToggle(req.id)}
                    className={`p-4 rounded-xl border text-xs font-extrabold text-left transition-all flex items-center justify-between ${
                      isChecked
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:border-emerald-300"
                    }`}
                  >
                    <span>{req.label}</span>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
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
                <span>मागे</span>
              </button>

              <button
                onClick={handleFindSchemes}
                disabled={loading}
                className="px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl shadow-lg flex items-center gap-2 text-sm"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>शोधात आहे...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>योग्य योजना शोधा (Calculate Match)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: RESULTS */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900">तुमच्यासाठी सुचवलेल्या योजना</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  एकूण {recommendations.length} योजनांपैकी जुळणी टक्क्यांनुसार क्रमवारी लावली आहे
                </p>
              </div>
              <button
                onClick={() => setCurrentStep(1)}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>बदला</span>
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
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 border border-slate-200 shadow-2xl relative animate-in fade-in zoom-in duration-150">
            
            <button
              onClick={() => setSelectedSchemeForModal(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-emerald-700 font-extrabold text-sm border-b border-slate-100 pb-3">
              <Info className="w-5 h-5 text-emerald-600" />
              <span>{t.whyRecommended}</span>
            </div>

            <div>
              <h3 className="font-extrabold text-lg text-slate-900">
                {language === 'hi' ? selectedSchemeForModal.scheme.nameHi : language === 'mr' ? selectedSchemeForModal.scheme.nameMr : selectedSchemeForModal.scheme.nameEn}
              </h3>
              <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-600 text-white font-extrabold text-xs rounded-full">
                <span>एकूण जुळणी गुण: {selectedSchemeForModal.matchScore} / १००</span>
              </div>
            </div>

            {/* Criteria Score Breakdown */}
            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {selectedSchemeForModal.criteria.map((c: any, idx: number) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start justify-between gap-3 text-xs">
                  <div>
                    <div className="font-bold text-slate-800">
                      {language === 'hi' ? c.labelHi : language === 'mr' ? c.labelMr : c.labelEn}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {language === 'hi' ? c.explanationHi : language === 'mr' ? c.explanationMr : c.explanationEn}
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-md font-mono font-bold text-xs shrink-0 ${c.matched ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"}`}>
                    +{c.score} / {c.maxScore}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 text-right">
              <button
                onClick={() => setSelectedSchemeForModal(null)}
                className="px-5 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs"
              >
                समजले (Close)
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

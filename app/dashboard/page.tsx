"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import SchemeCard from "@/components/SchemeCard";
import { useLanguage } from "@/components/LanguageContext";
import { MAHARASHTRA_DISTRICTS } from "@/lib/data/districts";
import {
  User,
  Bookmark,
  LogOut,
  Sprout,
  Edit3,
  Save,
  Camera,
  Phone,
  MapPin,
  Building2,
  Briefcase,
  CheckCircle2,
  Mail,
  Home,
  X
} from "lucide-react";

export default function UserDashboardPage() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState<any | null>(null);
  const [savedSchemes, setSavedSchemes] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Profile form state
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    village: "",
    taluka: "",
    district: "Pune",
    businessType: "Dairy & Animal Husbandry",
    businessStage: "New",
    profileImage: "",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }
    try {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setProfileData({
        name: parsedUser.name || "",
        email: parsedUser.email || "",
        phone: parsedUser.phone || "",
        address: parsedUser.address || "",
        village: parsedUser.village || "",
        taluka: parsedUser.taluka || "",
        district: parsedUser.district || "Pune",
        businessType: parsedUser.businessType || "Dairy & Animal Husbandry",
        businessStage: parsedUser.businessStage || "New",
        profileImage: parsedUser.profileImage || "",
      });

      fetch(`/api/bookmarks?userId=${parsedUser.id || "user-default"}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.savedSchemes) {
            setSavedSchemes(data.savedSchemes.map((s: any) => s.scheme));
          }
        })
        .catch(() => {});
    } catch (e) {
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("user-login-change"));
    router.push("/");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setProfileData((prev) => ({ ...prev, profileImage: base64 }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const updatedUser = {
      ...user,
      ...profileData,
    };

    // Update in localStorage
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    window.dispatchEvent(new Event("user-login-change"));

    // Sync with backend API
    try {
      await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.id, ...profileData }),
      });
    } catch (err) {
      // offline fallback
    }

    setLoading(false);
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const businessCategories = [
    { id: "agriculture", labelEn: "Agriculture & Agribusiness", labelHi: "कृषि एवं कृषि व्यवसाय", labelMr: "शेती आणि कृषी व्यवसाय" },
    { id: "dairy", labelEn: "Dairy & Animal Husbandry", labelHi: "डेयरी एवं पशुपालन", labelMr: "दुग्धव्यवसाय आणि पशुपालन" },
    { id: "food-processing", labelEn: "Food Processing Enterprises", labelHi: "खाद्य प्रसंस्करण उद्योग", labelMr: "अन्न प्रक्रिया उद्योग" },
    { id: "handicrafts", labelEn: "Handicrafts & Artisans", labelHi: "हस्तशिल्प एवं कारीगर", labelMr: "हस्तकला आणि कारागीर" },
    { id: "manufacturing", labelEn: "Small Scale Manufacturing", labelHi: "लघु उद्योग निर्माण", labelMr: "लघु उद्योग उत्पादने" },
    { id: "retail-services", labelEn: "Retail & Village Services", labelHi: "खुदरा एवं ग्रामीण सेवाएं", labelMr: "किरकोळ विक्री आणि ग्रामीण सेवा" },
  ];

  const businessStages = [
    { id: "Idea", labelEn: "New Idea / Planning Stage", labelHi: "नया विचार / योजना स्तर", labelMr: "नवीन कल्पना / नियोजन टप्पा" },
    { id: "New", labelEn: "Recently Started (Under 1 Year)", labelHi: "हाल ही में शुरू (1 वर्ष से कम)", labelMr: "नुकताच सुरू केलेला (१ वर्षापेक्षा कमी)" },
    { id: "Existing", labelEn: "Operational Business (1-3 Years)", labelHi: "कार्यरत व्यवसाय (1-3 वर्ष)", labelMr: "सध्या कार्यरत व्यवसाय (१-३ वर्षे)" },
    { id: "Expansion", labelEn: "Business Expansion / Modernization", labelHi: "व्यवसाय विस्तार / आधुनिकीकरण", labelMr: "व्यवसाय विस्तार / आधुनिकीकरण" },
  ];

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* SUCCESS TOAST */}
      {saveSuccess && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 rounded-2xl flex items-center gap-3 shadow-md animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="font-extrabold text-sm">{t.profileSaved}</span>
        </div>
      )}

      {/* USER PROFILE HEADER CARD */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          
          {/* Avatar with Photo Upload */}
          <div className="relative group">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-600 to-green-700 text-white font-black text-3xl flex items-center justify-center shadow-lg overflow-hidden border-2 border-emerald-500">
              {profileData.profileImage ? (
                <img
                  src={profileData.profileImage}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{(user.name || "U").charAt(0).toUpperCase()}</span>
              )}
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 p-2 bg-emerald-600 text-white rounded-full shadow-md hover:bg-emerald-700 transition-colors"
              title={t.changePhoto}
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {user.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1.5 justify-center sm:justify-start mt-0.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{user.email}</span>
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
              <span className="inline-block px-3 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold rounded-full">
                {t.profileBadge}
              </span>
              {user.district && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-full">
                  <MapPin className="w-3 h-3 text-emerald-600" />
                  <span>{user.district}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-4 py-2.5 font-bold rounded-xl text-xs flex items-center gap-2 transition-all ${
              isEditing
                ? "bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white"
                : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
            }`}
          >
            {isEditing ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
            <span>{isEditing ? (language === 'hi' ? "रद्द करें" : language === 'mr' ? "रद्द करा" : "Cancel") : t.editProfile}</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-700 dark:text-slate-300 hover:text-red-700 font-bold rounded-xl text-xs flex items-center gap-2 border border-slate-200 dark:border-slate-700 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>{t.logout}</span>
          </button>
        </div>
      </div>

      {/* EDIT PROFILE SECTION (COLLAPSIBLE / FORM) */}
      {isEditing && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border-2 border-emerald-500 shadow-xl space-y-6 animate-in slide-in-from-top-4 duration-200">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-emerald-600" />
              <span>{t.editProfile}</span>
            </h2>
            <span className="text-xs text-slate-500">
              {language === 'hi' ? "* वैकल्पिक विवरण" : language === 'mr' ? "* पर्यायी तपशील" : "* Optional details"}
            </span>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                  {t.fullName} *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                  {t.phone} ({language === 'hi' ? 'वैकल्पिक' : language === 'mr' ? 'पर्यायी' : 'Optional'})
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    placeholder={t.phonePlaceholder}
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* District */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                  {t.districtLabel} ({language === 'hi' ? 'महाराष्ट्र के ३६ जिले' : language === 'mr' ? 'महाराष्ट्राचे ३६ जिल्हे' : '36 Districts'})
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <select
                    value={profileData.district}
                    onChange={(e) => setProfileData({ ...profileData, district: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  >
                    {MAHARASHTRA_DISTRICTS.map((d) => (
                      <option key={d.slug} value={d.nameEn}>
                        {language === 'hi' ? d.nameHi : language === 'mr' ? d.nameMr : d.nameEn} ({d.region})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Taluka */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                  {t.taluka}
                </label>
                <input
                  type="text"
                  placeholder={t.talukaPlaceholder}
                  value={profileData.taluka}
                  onChange={(e) => setProfileData({ ...profileData, taluka: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Village */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                  {t.village}
                </label>
                <input
                  type="text"
                  placeholder={t.villagePlaceholder}
                  value={profileData.village}
                  onChange={(e) => setProfileData({ ...profileData, village: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Business Sector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                  {t.businessSector}
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <select
                    value={profileData.businessType}
                    onChange={(e) => setProfileData({ ...profileData, businessType: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  >
                    {businessCategories.map((c) => (
                      <option key={c.id} value={c.labelEn}>
                        {language === 'hi' ? c.labelHi : language === 'mr' ? c.labelMr : c.labelEn}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Business Stage */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                  {t.businessStageLabel}
                </label>
                <select
                  value={profileData.businessStage}
                  onChange={(e) => setProfileData({ ...profileData, businessStage: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                >
                  {businessStages.map((s) => (
                    <option key={s.id} value={s.id}>
                      {language === 'hi' ? s.labelHi : language === 'mr' ? s.labelMr : s.labelEn}
                    </option>
                  ))}
                </select>
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                  {t.address}
                </label>
                <div className="relative">
                  <Home className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <textarea
                    rows={2}
                    placeholder={t.addressPlaceholder}
                    value={profileData.address}
                    onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs"
              >
                {language === 'hi' ? "रद्द करें" : language === 'mr' ? "रद्द करा" : "Cancel"}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-md text-xs flex items-center gap-2 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>{t.saveProfile}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SAVED SCHEMES SECTION */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <Bookmark className="w-5 h-5 text-emerald-600" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {t.savedSchemesTitle}
          </h2>
        </div>

        {savedSchemes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedSchemes.map((scheme) => (
              <SchemeCard key={scheme.id} scheme={scheme} />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 text-center border border-slate-200 dark:border-slate-800 space-y-3">
            <Sprout className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
              {t.noSavedSchemes}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t.noSavedSchemesSub}
            </p>
          </div>
        )}
      </div>

    </div>
  );
}

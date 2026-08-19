"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  ArrowLeft,
  X,
  CheckCircle,
  RefreshCw,
  Building,
} from "lucide-react";

export default function AdminSchemeManagerPage() {
  const router = useRouter();
  const [schemes, setSchemes] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingScheme, setEditingScheme] = useState<any | null>(null);

  // Form State for Scheme CRUD
  const [formData, setFormData] = useState({
    nameEn: "",
    nameHi: "",
    nameMr: "",
    descriptionEn: "",
    descriptionHi: "",
    descriptionMr: "",
    categoryId: "",
    targetUsersEn: "",
    targetUsersMr: "",
    officialUrl: "",
    sourceName: "Govt of Maharashtra",
    applicableScope: "Maharashtra State",
  });

  const fetchSchemes = () => {
    setLoading(true);
    fetch("/api/schemes?limit=100")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSchemes(data.schemes);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const adminUser = localStorage.getItem("adminUser");
    if (!adminUser) {
      router.push("/admin/login");
      return;
    }

    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => data.success && setCategories(data.categories));

    fetchSchemes();
  }, [router]);

  const handleOpenAddModal = () => {
    setEditingScheme(null);
    setFormData({
      nameEn: "",
      nameHi: "",
      nameMr: "",
      descriptionEn: "",
      descriptionHi: "",
      descriptionMr: "",
      categoryId: categories[0]?.id || "",
      targetUsersEn: "Rural Entrepreneurs",
      targetUsersMr: "ग्रामीण उद्योजक व तरुण",
      officialUrl: "https://maharashtra.gov.in/",
      sourceName: "Directorate of Industries, Govt of Maharashtra",
      applicableScope: "Maharashtra State",
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (scheme: any) => {
    setEditingScheme(scheme);
    setFormData({
      nameEn: scheme.nameEn,
      nameHi: scheme.nameHi,
      nameMr: scheme.nameMr,
      descriptionEn: scheme.descriptionEn,
      descriptionHi: scheme.descriptionHi,
      descriptionMr: scheme.descriptionMr,
      categoryId: scheme.categoryId,
      targetUsersEn: scheme.targetUsersEn,
      targetUsersMr: scheme.targetUsersMr,
      officialUrl: scheme.officialUrl,
      sourceName: scheme.sourceName,
      applicableScope: scheme.applicableScope,
    });
    setModalOpen(true);
  };

  const handleSaveScheme = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEdit = !!editingScheme;
    const url = isEdit ? `/api/schemes/${editingScheme.id}` : "/api/schemes";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setModalOpen(false);
        fetchSchemes();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteScheme = async (id: string) => {
    if (!confirm("Are you sure you want to delete this scheme?")) return;
    try {
      const res = await fetch(`/api/schemes/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        fetchSchemes();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-700 hover:text-slate-900">
        <ArrowLeft className="w-4 h-4" />
        <span>Admin Dashboard कड परत जा</span>
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            सरकारी योजना व्यवस्थापन (Scheme CRUD Manager)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            नवीन योजना जोडा, मराठी/हिंदी भाषांतर अपडेट करा, किंवा अधिकृत URL संपादित करा
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-md flex items-center gap-2 text-xs"
        >
          <Plus className="w-4 h-4" />
          <span>नवीन योजना जोडा (Add New Scheme)</span>
        </button>
      </div>

      {/* SCHEMES TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 uppercase text-[11px] font-black border-b border-slate-200">
              <tr>
                <th className="p-4">Scheme Name (मराठी / English)</th>
                <th className="p-4">Category</th>
                <th className="p-4">Official Portal URL</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 font-bold">
                    योजना डेटा लोड होत आहे...
                  </td>
                </tr>
              ) : schemes.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className="p-4">
                    <div className="font-bold text-slate-900">{s.nameMr}</div>
                    <div className="text-slate-500 text-[11px]">{s.nameEn}</div>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-lg font-bold">
                      {s.category?.nameMr || s.category?.nameEn}
                    </span>
                  </td>
                  <td className="p-4">
                    <a
                      href={s.officialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-700 hover:underline flex items-center gap-1 font-mono"
                    >
                      <span className="truncate max-w-[180px]">{s.officialUrl}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 bg-green-100 text-green-800 font-extrabold rounded-full text-[10px]">
                      {s.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEditModal(s)}
                        className="p-2 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded-lg"
                        title="Edit Scheme"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteScheme(s.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        title="Delete Scheme"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 border border-slate-200 shadow-2xl relative my-8">
            
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-xl font-black text-slate-900 border-b border-slate-100 pb-3">
              {editingScheme ? "योजना संपादित करा (Edit Scheme)" : "नवीन योजना जोडा (Add Scheme)"}
            </h2>

            <form onSubmit={handleSaveScheme} className="space-y-4 text-xs font-bold">
              <div>
                <label className="block text-slate-700 uppercase mb-1">योजनेचे नाव (मराठी)</label>
                <input
                  type="text"
                  required
                  value={formData.nameMr}
                  onChange={(e) => setFormData({ ...formData, nameMr: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-700 uppercase mb-1">Scheme Name (English)</label>
                <input
                  type="text"
                  required
                  value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-700 uppercase mb-1">Category (श्रेणी)</label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nameMr} ({c.nameEn})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 uppercase mb-1">माहिती व वर्णन (Description - Marathi)</label>
                <textarea
                  rows={3}
                  required
                  value={formData.descriptionMr}
                  onChange={(e) => setFormData({ ...formData, descriptionMr: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-700 uppercase mb-1">Description (English)</label>
                <textarea
                  rows={3}
                  required
                  value={formData.descriptionEn}
                  onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-700 uppercase mb-1">अधिकृत शासकीय अर्ज वेबसाईट (Official URL)</label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={formData.officialUrl}
                  onChange={(e) => setFormData({ ...formData, officialUrl: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-mono text-emerald-800"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs"
                >
                  रद्द करा (Cancel)
                </button>
                <button
                  type="submit"
                  className="px-7 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs"
                >
                  {editingScheme ? "अपडेट करा (Update)" : "साठवा (Save Scheme)"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}

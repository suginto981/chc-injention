import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { Download, Upload, FileJson, FileSpreadsheet, PlusCircle, Save, Search, Edit2, Trash2, Database } from "lucide-react";

interface ProductionRecord {
  id: number;
  run_date: string;
  raw_material_kg: number;
  machine_hours: number;
  temperature_c: number;
  pressure_bar: number;
  cycle_time_sec: number;
  defect_qty: number;
  downtime_minutes: number;
  status: string;
}

export default function ProductionPage() {
  const [records, setRecords] = useState<ProductionRecord[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    machine_code: "MC01",
    run_date: new Date().toISOString().slice(0, 10),
    shift_name: "Shift 1",
    product_code: "",
    planned_qty: "",
    actual_qty: "",
    cycle_time_sec: "",
    operator_name: "",
    temperature_c: "185",
    pressure_bar: "120",
    machine_hours: "8",
    raw_material_kg: "1000",
  });

  useEffect(() => {
    fetchRecords();
  }, []);

  async function fetchRecords() {
    try {
      const res = await fetch("/api/production/list");
      if (res.ok) {
        const data = await res.json();
        setRecords(data);
      }
    } catch (err) {
      console.error("Gagal mengambil data:", err);
    }
  }

  async function handleManualSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("Menyimpan data...");
    try {
      const res = await fetch("/api/import/production-json", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [{
            ...formData,
            planned_qty: formData.planned_qty ? parseInt(formData.planned_qty) : null,
            actual_qty: formData.actual_qty ? parseInt(formData.actual_qty) : null,
            cycle_time_sec: formData.cycle_time_sec ? parseFloat(formData.cycle_time_sec) : null,
            temperature_c: formData.temperature_c ? parseFloat(formData.temperature_c) : null,
            pressure_bar: formData.pressure_bar ? parseFloat(formData.pressure_bar) : null,
            machine_hours: formData.machine_hours ? parseFloat(formData.machine_hours) : null,
            raw_material_kg: formData.raw_material_kg ? parseFloat(formData.raw_material_kg) : null,
          }]
        }),
      });
      if (!res.ok) throw new Error("Gagal menyimpan data");
      setStatus("Data produksi berhasil disimpan");
      setShowForm(false);
      fetchRecords();
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Gagal menyimpan data");
    }
  }

  const filteredRecords = records.filter(r => 
    r.run_date.includes(search) || r.id.toString().includes(search)
  );

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-slate-900 p-6 rounded-xl text-white shadow-lg">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600/20 p-3 rounded-lg">
            <Database className="h-6 w-6 text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Tabel Data Produksi</h2>
            <p className="text-sm text-slate-400">{records.length} data tersimpan</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href="/api/template/production?format=xlsx" className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition-colors border border-slate-700">
            <Download className="h-4 w-4" /> Template
          </a>
          <label className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm cursor-pointer transition-colors border border-slate-700">
            <Upload className="h-4 w-4" /> Import Excel
            <input type="file" className="hidden" accept=".xlsx,.xls,.csv" onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              setStatus("Mengunggah...");
              const buf = await f.arrayBuffer();
              const b64 = Buffer.from(new Uint8Array(buf)).toString("base64");
              const res = await fetch("/api/import/production-xlsx", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fileBase64: b64 }),
              });
              if (res.ok) {
                setStatus("Import berhasil");
                fetchRecords();
              } else {
                setStatus("Import gagal");
              }
            }} />
          </label>
          <a href="/api/export/production?format=xlsx" className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition-colors border border-slate-700">
            <Download className="h-4 w-4" /> Export Excel
          </a>
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-semibold transition-colors shadow-lg shadow-blue-600/20">
            <PlusCircle className="h-4 w-4" /> {showForm ? "Batal" : "Tambah Data"}
          </button>
        </div>
      </div>

      {/* Manual Form */}
      {showForm && (
        <div className="rounded-xl border bg-card p-6 shadow-xl animate-in fade-in slide-in-from-top-4">
          <h3 className="mb-6 text-lg font-bold flex items-center gap-2">
            <Edit2 className="h-5 w-5 text-blue-500" /> Form Parameter Produksi
          </h3>
          <form onSubmit={handleManualSubmit} className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Tanggal</label>
              <input type="date" value={formData.run_date} onChange={(e) => setFormData({ ...formData, run_date: e.target.value })} className="w-full rounded-lg border bg-slate-50 px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" required />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Bahan Baku (kg)</label>
              <input type="number" value={formData.raw_material_kg} onChange={(e) => setFormData({ ...formData, raw_material_kg: e.target.value })} className="w-full rounded-lg border bg-slate-50 px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="1250" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Jam Mesin</label>
              <input type="number" step="0.1" value={formData.machine_hours} onChange={(e) => setFormData({ ...formData, machine_hours: e.target.value })} className="w-full rounded-lg border bg-slate-50 px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="8.5" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Suhu (°C)</label>
              <input type="number" value={formData.temperature_c} onChange={(e) => setFormData({ ...formData, temperature_c: e.target.value })} className="w-full rounded-lg border bg-slate-50 px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="185" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Tekanan (bar)</label>
              <input type="number" value={formData.pressure_bar} onChange={(e) => setFormData({ ...formData, pressure_bar: e.target.value })} className="w-full rounded-lg border bg-slate-50 px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="120" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Cycle Time (dtk)</label>
              <input type="number" step="0.1" value={formData.cycle_time_sec} onChange={(e) => setFormData({ ...formData, cycle_time_sec: e.target.value })} className="w-full rounded-lg border bg-slate-50 px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="45" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Product Code</label>
              <input type="text" value={formData.product_code} onChange={(e) => setFormData({ ...formData, product_code: e.target.value })} className="w-full rounded-lg border bg-slate-50 px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="PRD-A" />
            </div>
            <div className="flex items-end">
              <button type="submit" className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20">
                <Save className="h-4 w-4" /> Simpan Data
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search & Table */}
      <div className="rounded-xl border bg-slate-900/50 shadow-lg overflow-hidden backdrop-blur-sm">
        <div className="p-4 border-b border-slate-800 flex items-center gap-3">
          <Search className="h-5 w-5 text-slate-500" />
          <input type="text" placeholder="Cari data..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-transparent border-none outline-none text-sm w-full text-slate-300" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs font-bold uppercase tracking-widest text-slate-500 bg-slate-900/80">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">TANGGAL</th>
                <th className="px-6 py-4">BAHAN BAKU</th>
                <th className="px-6 py-4">JAM MESIN</th>
                <th className="px-6 py-4">SUHU</th>
                <th className="px-6 py-4">TEKANAN</th>
                <th className="px-6 py-4">CYCLE TIME</th>
                <th className="px-6 py-4 text-center">DEFECT</th>
                <th className="px-6 py-4 text-center">DOWNTIME</th>
                <th className="px-6 py-4 text-center">KERUGIAN</th>
                <th className="px-6 py-4 text-center">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredRecords.map((r) => (
                <tr key={r.id} className="hover:bg-slate-800/50 transition-colors group">
                  <td className="px-6 py-4 font-bold text-slate-500">{r.id}</td>
                  <td className="px-6 py-4">{new Date(r.run_date).toLocaleDateString('id-ID')}</td>
                  <td className="px-6 py-4">
                    <span className="font-semibold">{r.raw_material_kg?.toLocaleString()}</span>
                    <span className="text-[10px] ml-1 text-slate-500">kg</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold">{r.machine_hours}</span>
                    <span className="text-[10px] ml-1 text-slate-500">jam</span>
                  </td>
                  <td className="px-6 py-4">{r.temperature_c}°C</td>
                  <td className="px-6 py-4">{r.pressure_bar} bar</td>
                  <td className="px-6 py-4">{r.cycle_time_sec} dtk</td>
                  <td className="px-6 py-4 text-center font-bold text-slate-100">{r.defect_qty}</td>
                  <td className="px-6 py-4 text-center">{r.downtime_minutes / 60} jam</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                      r.status === 'Aman' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 hover:bg-slate-700 rounded-md transition-colors"><Edit2 className="h-4 w-4" /></button>
                      <button className="p-1.5 hover:bg-rose-500/20 hover:text-rose-400 rounded-md transition-colors"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredRecords.length === 0 && (
                <tr>
                  <td colSpan={11} className="px-6 py-12 text-center text-slate-500 italic">Data tidak ditemukan</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {status && (
        <div className={`fixed bottom-6 right-6 px-6 py-3 rounded-xl shadow-2xl animate-in fade-in slide-in-from-bottom-4 ${
          status.includes("berhasil") ? "bg-emerald-600 text-white" : "bg-slate-800 text-white border border-slate-700"
        }`}>
          {status}
        </div>
      )}
    </div>
  );
}

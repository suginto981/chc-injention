import React, { useState, useEffect } from "react";
import { BrainCircuit, Sparkles, TrendingUp, AlertTriangle, CheckCircle, Loader2, Gauge, Thermometer, Zap, History, BarChart3 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface AIPrediction {
  predicted_loss_qty: number;
  predicted_downtime_minutes: number;
  risk_status: "Aman" | "Rugi";
  analysis: string;
  recommendation: string;
}

interface HistoricalAnalysis {
  id: number;
  date: string;
  machine_code: string;
  actual_qty: number;
  actual_loss: number;
  predicted_loss: number;
  predicted_downtime: number;
  actual_downtime: number;
  deviation_loss: number;
  accuracy_loss: number;
}

export default function PredictionsPage() {
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<HistoricalAnalysis[]>([]);
  const [prediction, setPrediction] = useState<AIPrediction | null>(null);
  const [formData, setFormData] = useState({
    temperature_c: "185",
    pressure_bar: "120",
    machine_hours: "8",
    raw_material_kg: "1250",
    cycle_time_sec: "45",
  });

  useEffect(() => {
    fetchHistory();
  }, []);

  async function fetchHistory() {
    try {
      const res = await fetch("/api/predictions/analysis");
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (err) {
      console.error("Gagal mengambil histori:", err);
    }
  }

  async function handleAIPredict(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/ai/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          temperature_c: parseFloat(formData.temperature_c),
          pressure_bar: parseFloat(formData.pressure_bar),
          machine_hours: parseFloat(formData.machine_hours),
          raw_material_kg: parseFloat(formData.raw_material_kg),
          cycle_time_sec: parseFloat(formData.cycle_time_sec),
        }),
      });
      if (!res.ok) throw new Error("Gagal mendapatkan prediksi AI");
      const data = await res.json();
      setPrediction(data);
    } catch (err) {
      alert("Error: " + (err instanceof Error ? err.message : "AI gagal merespon"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-slate-900 p-8 rounded-2xl text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-600/30 p-2 rounded-lg backdrop-blur-md">
              <BrainCircuit className="h-6 w-6 text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold">Analisa Prediksi Kerugian Real Time</h2>
          </div>
          <p className="max-w-xl text-slate-400 text-sm">
            Gunakan model AI <b>seed-2-0-pro-free</b> untuk menganalisis parameter mesin dan memprediksi potensi kerugian produksi secara real-time.
          </p>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-blue-600/10 to-transparent pointer-events-none" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Prediction Form */}
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-bold flex items-center gap-2 mb-6">
            <Gauge className="h-5 w-5 text-blue-500" /> Cek Prediksi Aktual
          </h3>
          <form onSubmit={handleAIPredict} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1">
                  <Thermometer className="h-3 w-3" /> Suhu (°C)
                </label>
                <input type="number" value={formData.temperature_c} onChange={(e) => setFormData({ ...formData, temperature_c: e.target.value })} className="w-full rounded-lg border bg-slate-50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1">
                  <Zap className="h-3 w-3" /> Tekanan (bar)
                </label>
                <input type="number" value={formData.pressure_bar} onChange={(e) => setFormData({ ...formData, pressure_bar: e.target.value })} className="w-full rounded-lg border bg-slate-50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-500">Jam Operasi</label>
                <input type="number" step="0.1" value={formData.machine_hours} onChange={(e) => setFormData({ ...formData, machine_hours: e.target.value })} className="w-full rounded-lg border bg-slate-50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-500">Cycle Time (dtk)</label>
                <input type="number" step="0.1" value={formData.cycle_time_sec} onChange={(e) => setFormData({ ...formData, cycle_time_sec: e.target.value })} className="w-full rounded-lg border bg-slate-50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-500">Bahan Baku (kg)</label>
              <input type="number" value={formData.raw_material_kg} onChange={(e) => setFormData({ ...formData, raw_material_kg: e.target.value })} className="w-full rounded-lg border bg-slate-50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Menganalisis dengan Sumopod AI...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" /> Prediksi Sekarang
                </>
              )}
            </button>
          </form>
        </div>

        {/* AI Result */}
        <div className="rounded-2xl border bg-slate-50/50 p-6 shadow-sm flex flex-col min-h-[400px]">
          <h3 className="text-lg font-bold flex items-center gap-2 mb-6 text-slate-700">
            <Sparkles className="h-5 w-5 text-amber-500" /> Hasil Analisis AI
          </h3>
          {prediction ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border shadow-sm">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Prediksi Defect</p>
                  <p className="text-2xl font-black text-slate-800">{prediction.predicted_loss_qty} <span className="text-sm font-normal text-slate-500">unit</span></p>
                </div>
                <div className="bg-white p-4 rounded-xl border shadow-sm">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Prediksi Downtime</p>
                  <p className="text-2xl font-black text-slate-800">{prediction.predicted_downtime_minutes} <span className="text-sm font-normal text-slate-500">menit</span></p>
                </div>
              </div>

              <div className={`p-4 rounded-xl border flex items-center gap-4 ${
                prediction.risk_status === 'Aman' ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'
              }`}>
                {prediction.risk_status === 'Aman' ? (
                  <CheckCircle className="h-10 w-10 text-emerald-500" />
                ) : (
                  <AlertTriangle className="h-10 w-10 text-rose-500" />
                )}
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Status Risiko</p>
                  <p className={`text-xl font-bold ${
                    prediction.risk_status === 'Aman' ? 'text-emerald-700' : 'text-rose-700'
                  }`}>{prediction.risk_status}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl border">
                  <p className="text-xs font-bold mb-1 text-slate-700">Analisis:</p>
                  <p className="text-sm text-slate-600 leading-relaxed">{prediction.analysis}</p>
                </div>
                <div className="bg-blue-600/5 p-4 rounded-xl border border-blue-600/20">
                  <p className="text-xs font-bold mb-1 text-blue-700 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" /> Rekomendasi:
                  </p>
                  <p className="text-sm text-blue-800 leading-relaxed italic">"{prediction.recommendation}"</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-xl border-slate-200">
              <BrainCircuit className="h-12 w-12 text-slate-300 mb-4" />
              <p className="text-slate-500 font-medium">Isi parameter mesin di sebelah kiri dan klik tombol untuk mendapatkan prediksi cerdas Sumopod AI.</p>
            </div>
          )}
        </div>
      </div>

      {/* Accuracy History */}
      <div className="rounded-2xl border bg-card p-6 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <History className="h-5 w-5 text-indigo-500" /> Histori Akurasi Prediksi vs Aktual
          </h3>
          <div className="flex items-center gap-4 text-xs font-bold">
            <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-blue-500" /> Aktual</div>
            <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-slate-300" /> Prediksi</div>
          </div>
        </div>
        
        <div className="h-[300px] w-full mb-8">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={[...history].reverse()}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{fontSize: 10}} tickLine={false} axisLine={false} />
              <YAxis tick={{fontSize: 10}} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Legend />
              <Line type="monotone" dataKey="actual_loss" name="Kerugian Aktual" stroke="#3b82f6" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
              <Line type="monotone" dataKey="predicted_loss" name="Kerugian Prediksi" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" dot={{r: 4}} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-100">
          <table className="w-full text-sm text-left">
            <thead className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50">
              <tr>
                <th className="px-6 py-4">Tanggal</th>
                <th className="px-6 py-4">Mesin</th>
                <th className="px-6 py-4 text-center">Prediksi Loss</th>
                <th className="px-6 py-4 text-center">Aktual Loss</th>
                <th className="px-6 py-4 text-center">Deviasi</th>
                <th className="px-6 py-4 text-center">Akurasi AI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {history.map((h) => (
                <tr key={h.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-slate-600 font-medium">{h.date}</td>
                  <td className="px-6 py-4 text-slate-500 font-bold">{h.machine_code}</td>
                  <td className="px-6 py-4 text-center text-slate-400">{h.predicted_loss}</td>
                  <td className="px-6 py-4 text-center font-bold text-slate-700">{h.actual_loss}</td>
                  <td className={`px-6 py-4 text-center font-bold ${h.deviation_loss === 0 ? 'text-emerald-500' : 'text-amber-600'}`}>
                    {h.deviation_loss > 0 ? `+${h.deviation_loss}` : h.deviation_loss}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[10px] font-black text-blue-600">{Math.round(h.accuracy_loss)}%</span>
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: `${h.accuracy_loss}%` }} />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

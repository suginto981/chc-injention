import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Database, BrainCircuit, BarChart3, Settings, ShieldCheck } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-72 shrink-0 border-r border-slate-800 bg-slate-950 text-slate-300 shadow-2xl">
      <div className="px-6 py-8">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-xl bg-blue-600/20 grid place-items-center text-blue-400 text-2xl shadow-inner border border-blue-500/20">📊</div>
          <div>
            <div className="text-xl font-black tracking-tight text-white leading-tight">CHC Injection</div>
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-500/80">1600 Ton Monitor</div>
          </div>
        </div>
      </div>

      <div className="px-4 mb-4">
        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-4 mb-2">Menu Utama</div>
        <nav>
          <ul className="space-y-1.5">
            <li>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                      : "hover:bg-slate-900 hover:text-white"
                  }`
                }
              >
                <LayoutDashboard className="h-5 w-5" />
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/production"
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                      : "hover:bg-slate-900 hover:text-white"
                  }`
                }
              >
                <Database className="h-5 w-5" />
                <span>Data Produksi</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/predictions"
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                      : "hover:bg-slate-900 hover:text-white"
                  }`
                }
              >
                <BrainCircuit className="h-5 w-5" />
                <span>Prediksi</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/analysis"
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                      : "hover:bg-slate-900 hover:text-white"
                  }`
                }
              >
                <BarChart3 className="h-5 w-5" />
                <span>Analisis</span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>

      <div className="mt-auto p-6">
        <div className="rounded-2xl bg-slate-900/50 border border-slate-800 p-4 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="relative">
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
              <div className="absolute top-0 left-0 h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
            </div>
            <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider">Sistem Aktif</span>
          </div>
          <div className="text-[10px] text-slate-400 font-medium leading-relaxed">Monitoring parameter mesin 1600 Ton secara real-time.</div>
        </div>
      </div>
    </aside>
  );
}


import React from "react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-64 shrink-0 border-r bg-card text-card-foreground">
      <div className="px-4 py-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 grid place-items-center text-primary">📊</div>
          <div>
            <div className="text-sm font-semibold">CHC Injection</div>
            <div className="text-xs text-muted-foreground">1600 Ton Monitor</div>
          </div>
        </div>
      </div>
      <nav className="px-2">
        <ul className="space-y-1">
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-md px-3 py-2 text-sm ${
                  isActive ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                }`
              }
            >
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/production"
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-md px-3 py-2 text-sm ${
                  isActive ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                }`
              }
            >
              <span>Data Produksi</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/predictions"
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-md px-3 py-2 text-sm ${
                  isActive ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                }`
              }
            >
              <span>Prediksi</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/analysis"
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-md px-3 py-2 text-sm ${
                  isActive ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                }`
              }
            >
              <span>Analisis</span>
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className="mt-auto p-4">
        <div className="rounded-md border p-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span className="font-medium">Sistem Aktif</span>
          </div>
          <div className="mt-1 text-muted-foreground">Real-time monitoring</div>
        </div>
      </div>
    </aside>
  );
}

import { NavLink } from "react-router-dom";
import { LayoutDashboard, Database, Brain, BarChart3, Settings, Factory } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/data", icon: Database, label: "Data Produksi" },
  { to: "/prediksi", icon: Brain, label: "Prediksi" },
  { to: "/analisis", icon: BarChart3, label: "Analisis" },
];

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-sidebar-primary">
            <Factory className="h-6 w-6 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-sidebar-foreground">CHC Injection</h1>
            <p className="text-xs text-sidebar-foreground/60">1600 Ton</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )
              }
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-sidebar-border">
          <p className="text-xs text-sidebar-foreground/50">
            © 2024 Production Loss Predictor
          </p>
        </div>
      </div>
    </aside>
  );
}

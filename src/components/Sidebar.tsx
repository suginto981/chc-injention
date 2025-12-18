import { NavLink } from "react-router-dom";
import { LayoutDashboard, Database, Brain, BarChart3, Factory, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/data", icon: Database, label: "Data Produksi" },
  { to: "/prediksi", icon: Brain, label: "Prediksi" },
  { to: "/analisis", icon: BarChart3, label: "Analisis" },
];

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border hidden md:block">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-sidebar-border">
          <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-purple-500 shadow-lg shadow-primary/25">
            <Factory className="h-6 w-6 text-primary-foreground" />
            <div className="absolute -top-1 -right-1">
              <Sparkles className="h-4 w-4 text-warning animate-pulse" />
            </div>
          </div>
          <div>
            <h1 className="font-bold text-sidebar-foreground text-lg">CHC Injection</h1>
            <p className="text-xs text-sidebar-foreground/60 font-medium">1600 Ton Monitor</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-2">
          <p className="px-4 text-xs font-semibold text-sidebar-foreground/40 uppercase tracking-wider mb-4">
            Menu Utama
          </p>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-primary/20 to-primary/5 text-primary shadow-lg shadow-primary/10"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div className={cn(
                    "w-9 h-9 rounded-lg flex items-center justify-center transition-all",
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/30" 
                      : "bg-sidebar-accent text-sidebar-foreground/70 group-hover:bg-sidebar-accent group-hover:text-sidebar-foreground"
                  )}>
                    <item.icon className="h-4 w-4" />
                  </div>
                  <span>{item.label}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-5 bg-primary rounded-full" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl bg-sidebar-accent/50">
            <div className="pulse-live w-8 h-8 rounded-lg bg-success/20 flex items-center justify-center">
              <div className="w-2 h-2 bg-success rounded-full" />
            </div>
            <div>
              <p className="text-xs font-medium text-sidebar-foreground">Sistem Aktif</p>
              <p className="text-[10px] text-sidebar-foreground/50">Real-time monitoring</p>
            </div>
          </div>
          <p className="text-[10px] text-sidebar-foreground/40 mt-4 text-center">
            © 2024 Production Loss Predictor
          </p>
        </div>
      </div>
    </aside>
  );
}

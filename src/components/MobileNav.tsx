import { NavLink } from "react-router-dom";
import { LayoutDashboard, Database, Brain, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/data", icon: Database, label: "Data" },
  { to: "/prediksi", icon: Brain, label: "Prediksi" },
  { to: "/analisis", icon: BarChart3, label: "Analisis" },
];

export function MobileNav() {
  return (
    <nav className="mobile-nav md:hidden">
      <div className="flex items-center justify-around px-2 py-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "mobile-nav-item relative flex-1",
                isActive && "active"
              )
            }
          >
            {({ isActive }) => (
              <>
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200",
                  isActive ? "bg-primary/10" : "bg-transparent"
                )}>
                  <item.icon className={cn(
                    "h-5 w-5 transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )} />
                </div>
                <span className={cn(
                  "text-[10px] font-medium mt-0.5",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}>
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

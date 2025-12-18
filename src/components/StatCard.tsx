import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: { value: number; isPositive: boolean };
  variant?: "default" | "success" | "warning" | "danger";
}

const variantClasses = {
  default: "stat-card border border-border/50",
  success: "stat-card stat-card-success border border-success/20",
  danger: "stat-card stat-card-danger border border-destructive/20",
  warning: "stat-card stat-card-warning border border-warning/20",
};

const iconClasses = {
  default: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  danger: "bg-destructive/10 text-destructive",
};

const valueClasses = {
  default: "text-foreground",
  success: "text-success",
  danger: "text-destructive",
  warning: "text-warning",
};

export function StatCard({ title, value, subtitle, icon, trend, variant = "default" }: StatCardProps) {
  return (
    <div className={cn(variantClasses[variant])}>
      <div className="flex items-start justify-between mb-3">
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", iconClasses[variant])}>
          {icon}
        </div>
      </div>
      <div>
        <p className={cn("text-2xl md:text-3xl font-bold tracking-tight", valueClasses[variant])}>
          {value}
        </p>
        <p className="text-xs font-medium text-muted-foreground mt-0.5 uppercase tracking-wider">
          {title}
        </p>
        {subtitle && (
          <p className="text-[10px] text-muted-foreground/70 mt-1">
            {subtitle}
          </p>
        )}
        {trend && (
          <div className={cn("flex items-center gap-1 text-xs mt-2", trend.isPositive ? "text-success" : "text-destructive")}>
            <span>{trend.isPositive ? "↑" : "↓"}</span>
            <span>{Math.abs(trend.value)}%</span>
            <span className="text-muted-foreground">vs bulan lalu</span>
          </div>
        )}
      </div>
    </div>
  );
}

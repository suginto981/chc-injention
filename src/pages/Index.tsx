import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";
import { StatCard } from "@/components/StatCard";
import { ProductionChart } from "@/components/ProductionChart";
import { sampleProductionData } from "@/data/sampleData";
import { ProductionData } from "@/types/production";
import { Package, Clock, Thermometer, AlertTriangle, TrendingUp, Activity, Bell, Menu } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [data] = useState<ProductionData[]>(sampleProductionData);

  const stats = {
    totalProduksi: data.length,
    totalKerugian: data.filter((d) => d.kerugian === 1).length,
    avgDefect: Math.round(data.reduce((sum, d) => sum + d.defect, 0) / data.length),
    avgDowntime: (data.reduce((sum, d) => sum + d.downtime, 0) / data.length).toFixed(1),
    successRate: ((data.filter((d) => d.kerugian === 0).length / data.length) * 100).toFixed(1),
    avgBahanBaku: Math.round(data.reduce((sum, d) => sum + d.bahan_baku, 0) / data.length),
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border md:hidden safe-area-top">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center shadow-lg shadow-primary/25">
              <Package className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-foreground">CHC Monitor</h1>
              <p className="text-[10px] text-muted-foreground">1600 Ton</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="icon-btn relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
            </Button>
          </div>
        </div>
      </header>

      <main className="md:ml-64 px-4 md:px-8 pt-20 md:pt-8 pb-24 md:pb-8">
        {/* Header - Desktop */}
        <div className="mb-8 hidden md:block">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold gradient-text">Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Monitor produksi CHC Injection 1600 Ton secara real-time
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="icon-btn relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Title */}
        <div className="mb-6 md:hidden">
          <h2 className="text-xl font-bold gradient-text">Dashboard</h2>
          <p className="text-sm text-muted-foreground">Monitor produksi real-time</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-6 md:mb-8">
          <div className="animate-fade-in-up opacity-0 stagger-1">
            <StatCard
              title="Total Produksi"
              value={stats.totalProduksi}
              subtitle="batch produksi"
              icon={<Package className="h-5 w-5" />}
            />
          </div>
          <div className="animate-fade-in-up opacity-0 stagger-2">
            <StatCard
              title="Total Kerugian"
              value={stats.totalKerugian}
              subtitle="batch rugi"
              icon={<AlertTriangle className="h-5 w-5" />}
              variant="danger"
            />
          </div>
          <div className="animate-fade-in-up opacity-0 stagger-3">
            <StatCard
              title="Tingkat Sukses"
              value={`${stats.successRate}%`}
              subtitle="produksi aman"
              icon={<TrendingUp className="h-5 w-5" />}
              variant="success"
            />
          </div>
          <div className="animate-fade-in-up opacity-0 stagger-4">
            <StatCard
              title="Avg Defect"
              value={stats.avgDefect}
              subtitle="unit per batch"
              icon={<Activity className="h-5 w-5" />}
              variant="warning"
            />
          </div>
          <div className="animate-fade-in-up opacity-0 stagger-5">
            <StatCard
              title="Avg Downtime"
              value={`${stats.avgDowntime}h`}
              subtitle="per batch"
              icon={<Clock className="h-5 w-5" />}
            />
          </div>
          <div className="animate-fade-in-up opacity-0 stagger-6">
            <StatCard
              title="Avg Bahan Baku"
              value={stats.avgBahanBaku}
              subtitle="kg per batch"
              icon={<Thermometer className="h-5 w-5" />}
            />
          </div>
        </div>

        {/* Charts */}
        <div className="grid gap-4 md:gap-6 lg:grid-cols-3 mb-6 md:mb-8">
          <div className="lg:col-span-2 animate-fade-in-up opacity-0" style={{ animationDelay: '0.4s' }}>
            <ProductionChart data={data} />
          </div>
          <Card className="glass-card border-border/50 animate-fade-in-up opacity-0" style={{ animationDelay: '0.5s' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <span className="pulse-live">Produksi Terbaru</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.slice(-5).reverse().map((item, index) => (
                  <div 
                    key={item.id} 
                    className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                    style={{ animationDelay: `${0.6 + index * 0.1}s` }}
                  >
                    <div>
                      <p className="font-medium text-sm">
                        {new Date(item.tanggal).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.bahan_baku} kg • {item.defect} defect
                      </p>
                    </div>
                    <span className={item.kerugian === 1 ? "badge-danger" : "badge-success"}>
                      {item.kerugian === 1 ? "Rugi" : "Aman"}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <MobileNav />
    </div>
  );
};

export default Index;

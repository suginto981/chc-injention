import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { StatCard } from "@/components/StatCard";
import { ProductionChart } from "@/components/ProductionChart";
import { sampleProductionData } from "@/data/sampleData";
import { ProductionData } from "@/types/production";
import { Package, Clock, Thermometer, AlertTriangle, TrendingUp, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Monitor produksi CHC Injection 1600 Ton secara real-time
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-8">
          <StatCard
            title="Total Produksi"
            value={stats.totalProduksi}
            subtitle="batch produksi"
            icon={<Package className="h-5 w-5" />}
          />
          <StatCard
            title="Total Kerugian"
            value={stats.totalKerugian}
            subtitle="batch rugi"
            icon={<AlertTriangle className="h-5 w-5" />}
            variant="danger"
          />
          <StatCard
            title="Tingkat Sukses"
            value={`${stats.successRate}%`}
            subtitle="produksi aman"
            icon={<TrendingUp className="h-5 w-5" />}
            variant="success"
          />
          <StatCard
            title="Avg Defect"
            value={stats.avgDefect}
            subtitle="unit per batch"
            icon={<Activity className="h-5 w-5" />}
            variant="warning"
          />
          <StatCard
            title="Avg Downtime"
            value={`${stats.avgDowntime}h`}
            subtitle="per batch"
            icon={<Clock className="h-5 w-5" />}
          />
          <StatCard
            title="Avg Bahan Baku"
            value={stats.avgBahanBaku}
            subtitle="kg per batch"
            icon={<Thermometer className="h-5 w-5" />}
          />
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-3 mb-8">
          <div className="lg:col-span-2">
            <ProductionChart data={data} />
          </div>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Produksi Terbaru</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.slice(-5).reverse().map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
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
    </div>
  );
};

export default Index;

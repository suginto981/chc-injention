import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { Package, AlertTriangle, Clock, Gauge, Loader2 } from "lucide-react";

interface DashboardData {
  totalProduksi: number;
  totalKerugian: number;
  sukses: number;
  avgDefect: number;
  avgDowntime: number;
  avgMaterial: number;
  latest: { date: string; qty: number; defects: number }[];
  seriesDefects: { date: string; defects: number }[];
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch("/api/dashboard/summary");
        if (!res.ok) throw new Error("Gagal mengambil data dashboard");
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Memuat data dashboard...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center text-destructive">
        <AlertTriangle className="mx-auto mb-2 h-8 w-8" />
        <p className="font-semibold">Error</p>
        <p className="text-sm">{error || "Data tidak tersedia"}</p>
      </div>
    );
  }

  const stats = [
    {
      label: "Total Produksi",
      value: data.totalProduksi,
      sub: "Batch bulan ini",
      icon: Package,
      color: "text-blue-500",
      path: "/production",
    },
    {
      label: "Rata-rata Defect",
      value: data.avgDefect,
      sub: "Unit per batch",
      icon: AlertTriangle,
      color: "text-amber-500",
      path: "/analysis",
    },
    {
      label: "Rata-rata Downtime",
      value: `${data.avgDowntime}h`,
      sub: "Per sesi",
      icon: Clock,
      color: "text-rose-500",
      path: "/analysis",
    },
    {
      label: "Persentase Sukses",
      value: `${Math.round(data.sukses)}%`,
      sub: "Quality rate",
      icon: Gauge,
      color: "text-emerald-500",
      path: "/predictions",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            onClick={() => navigate(s.path)}
            className="group cursor-pointer rounded-xl border bg-card p-6 shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
          >
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium transition-colors group-hover:text-primary">
                {s.label}
              </p>
              <s.icon className={`h-4 w-4 ${s.color} transition-transform group-hover:scale-110`} />
            </div>
            <div>
              <div className="text-2xl font-bold">{s.value}</div>
              <p className="text-xs text-muted-foreground">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 rounded-xl border bg-card p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Tren Produksi</h3>
            <p className="text-sm text-muted-foreground">Kuantitas produksi {data.latest.length} batch terakhir</p>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[...data.latest].reverse()}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="date"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="qty"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "hsl(var(--primary))" }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-span-3 rounded-xl border bg-card p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Defect per Hari</h3>
            <p className="text-sm text-muted-foreground">Analisis tren kualitas harian</p>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.seriesDefects}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="date"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="defects" fill="hsl(var(--warning))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

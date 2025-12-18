import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";
import { sampleProductionData, samplePredictions } from "@/data/sampleData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3 } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ScatterChart, Scatter, ZAxis, Legend, LineChart, Line
} from "recharts";

export default function AnalisisPage() {
  const data = sampleProductionData;
  const predictions = samplePredictions;

  // Correlation data
  const correlationData = data.map((item) => ({
    defect: item.defect,
    downtime: item.downtime,
    kerugian: item.kerugian,
    suhu: item.suhu,
    tekanan: item.tekanan,
  }));

  // Model performance
  const rfPredictions = predictions.filter((p) => p.model === "RandomForest");
  const lrPredictions = predictions.filter((p) => p.model === "LogisticRegression");

  const modelPerformance = [
    {
      name: "Random Forest",
      accuracy: 85,
      precision: 82,
      recall: 88,
      f1: 85,
    },
    {
      name: "Logistic Regression",
      accuracy: 78,
      precision: 75,
      recall: 80,
      f1: 77,
    },
  ];

  // Parameter analysis
  const parameterAnalysis = [
    { name: "Defect", correlation: 0.82, importance: 0.35 },
    { name: "Downtime", correlation: 0.75, importance: 0.28 },
    { name: "Suhu", correlation: 0.58, importance: 0.15 },
    { name: "Tekanan", correlation: 0.45, importance: 0.12 },
    { name: "Cycle Time", correlation: 0.38, importance: 0.10 },
  ];

  // Trend data by month
  const trendData = data.reduce((acc, item) => {
    const month = new Date(item.tanggal).toLocaleDateString("id-ID", { month: "short" });
    if (!acc[month]) {
      acc[month] = { month, rugi: 0, aman: 0, total: 0 };
    }
    if (item.kerugian === 1) {
      acc[month].rugi += 1;
    } else {
      acc[month].aman += 1;
    }
    acc[month].total += 1;
    return acc;
  }, {} as Record<string, { month: string; rugi: number; aman: number; total: number }>);

  const trendChartData = Object.values(trendData);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border md:hidden safe-area-top">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="font-bold text-foreground">Analisis</h1>
              <p className="text-[10px] text-muted-foreground">Insight Data</p>
            </div>
          </div>
        </div>
      </header>

      <main className="md:ml-64 px-4 md:px-8 pt-20 md:pt-8 pb-24 md:pb-8">
        <div className="mb-6 md:mb-8 hidden md:block">
          <h1 className="text-3xl font-bold gradient-text">Analisis Data</h1>
          <p className="text-muted-foreground mt-1">
            Analisis mendalam dan performa model prediksi
          </p>
        </div>

        <Tabs defaultValue="correlation" className="space-y-4 md:space-y-6">
          <TabsList className="w-full md:w-auto grid grid-cols-3 md:flex">
            <TabsTrigger value="correlation" className="text-xs md:text-sm">Korelasi</TabsTrigger>
            <TabsTrigger value="model" className="text-xs md:text-sm">Performa</TabsTrigger>
            <TabsTrigger value="trend" className="text-xs md:text-sm">Trend</TabsTrigger>
          </TabsList>

          <TabsContent value="correlation" className="space-y-4 md:space-y-6">
            <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
              <Card className="glass-card border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base md:text-lg">Defect vs Downtime</CardTitle>
                </CardHeader>
                <CardContent className="h-[280px] md:h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis
                        dataKey="defect"
                        name="Defect"
                        tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                      />
                      <YAxis
                        dataKey="downtime"
                        name="Downtime"
                        tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                      />
                      <Scatter
                        data={correlationData.filter((d) => d.kerugian === 0)}
                        fill="hsl(var(--success))"
                        name="Aman"
                      />
                      <Scatter
                        data={correlationData.filter((d) => d.kerugian === 1)}
                        fill="hsl(var(--destructive))"
                        name="Rugi"
                      />
                      <Legend wrapperStyle={{ fontSize: "12px" }} />
                    </ScatterChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="glass-card border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base md:text-lg">Importance Fitur</CardTitle>
                </CardHeader>
                <CardContent className="h-[280px] md:h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={parameterAnalysis} layout="vertical" margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis type="number" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                      <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} width={60} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                      />
                      <Bar dataKey="importance" name="Importance" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="model" className="space-y-4 md:space-y-6">
            <Card className="glass-card border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base md:text-lg">Perbandingan Performa Model</CardTitle>
              </CardHeader>
              <CardContent className="h-[320px] md:h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={modelPerformance} margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                    <Bar dataKey="accuracy" name="Accuracy" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="precision" name="Precision" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="recall" name="Recall" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="f1" name="F1" fill="hsl(var(--chart-4))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trend" className="space-y-4 md:space-y-6">
            <Card className="glass-card border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base md:text-lg">Trend Kerugian Bulanan</CardTitle>
              </CardHeader>
              <CardContent className="h-[320px] md:h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendChartData} margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                    <Line type="monotone" dataKey="aman" name="Aman" stroke="hsl(var(--success))" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="rugi" name="Rugi" stroke="hsl(var(--destructive))" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <MobileNav />
    </div>
  );
}

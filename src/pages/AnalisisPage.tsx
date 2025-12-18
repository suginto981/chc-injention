import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { sampleProductionData, samplePredictions } from "@/data/sampleData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
      <main className="ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Analisis Data</h1>
          <p className="text-muted-foreground mt-1">
            Analisis mendalam dan performa model prediksi
          </p>
        </div>

        <Tabs defaultValue="correlation" className="space-y-6">
          <TabsList>
            <TabsTrigger value="correlation">Korelasi Parameter</TabsTrigger>
            <TabsTrigger value="model">Performa Model</TabsTrigger>
            <TabsTrigger value="trend">Trend Bulanan</TabsTrigger>
          </TabsList>

          <TabsContent value="correlation" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Defect vs Downtime</CardTitle>
                </CardHeader>
                <CardContent className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis
                        dataKey="defect"
                        name="Defect"
                        tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                        label={{ value: "Defect", position: "bottom", offset: -5 }}
                      />
                      <YAxis
                        dataKey="downtime"
                        name="Downtime"
                        tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                        label={{ value: "Downtime (jam)", angle: -90, position: "left" }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
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
                      <Legend />
                    </ScatterChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Importance Fitur</CardTitle>
                </CardHeader>
                <CardContent className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={parameterAnalysis} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis type="number" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                      <YAxis dataKey="name" type="category" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} width={80} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="importance" name="Importance" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="model" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Perbandingan Performa Model</CardTitle>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={modelPerformance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="accuracy" name="Accuracy" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="precision" name="Precision" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="recall" name="Recall" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="f1" name="F1 Score" fill="hsl(var(--chart-4))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trend" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Trend Kerugian Bulanan</CardTitle>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="aman" name="Aman" stroke="hsl(var(--success))" strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="rugi" name="Rugi" stroke="hsl(var(--destructive))" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

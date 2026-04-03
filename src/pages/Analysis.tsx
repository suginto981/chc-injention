import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { FileSearch, Layers, Zap } from "lucide-react";

export default function AnalysisPage() {
  const data = [
    { name: "Kualitas Material", value: 45, color: "hsl(var(--primary))" },
    { name: "Setting Mesin", value: 25, color: "hsl(var(--warning))" },
    { name: "Human Error", value: 15, color: "hsl(var(--success))" },
    { name: "Maintenance", value: 15, color: "hsl(var(--destructive))" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Distribusi Penyebab Kerugian</h3>
              <p className="text-sm text-muted-foreground">Analisis akar masalah 30 hari terakhir</p>
            </div>
            <FileSearch className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    borderColor: "hsl(var(--border))",
                    borderRadius: "8px"
                  }} 
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-primary/10 p-3 text-primary">
                <Layers className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-semibold">Optimalisasi Material</h4>
                <p className="text-sm text-muted-foreground">Rekomendasi penggunaan grade baru.</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-amber-500/10 p-3 text-amber-500">
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-semibold">Efisiensi Energi</h4>
                <p className="text-sm text-muted-foreground">Mesin 1600 Ton stabil pada 85% load.</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="p-4 rounded-lg bg-muted/50 text-sm italic">
              "Berdasarkan data 5 batch terakhir, peningkatan suhu nozzle 5°C mengurangi defect gelembung sebesar 12%."
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

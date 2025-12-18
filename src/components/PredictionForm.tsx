import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Brain, AlertTriangle, CheckCircle, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface PredictionFormProps {
  onPredict: (data: PredictionInput) => Promise<PredictionOutput>;
}

interface PredictionInput {
  bahan_baku: number;
  jam_mesin: number;
  suhu: number;
  tekanan: number;
  cycle_time: number;
  defect: number;
  downtime: number;
  model: "RandomForest" | "LogisticRegression";
}

interface PredictionOutput {
  prediksi: "Terjadi" | "Tidak";
  probabilitas: number;
  factors: { name: string; impact: "high" | "medium" | "low" }[];
}

export function PredictionForm({ onPredict }: PredictionFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionOutput | null>(null);
  const [formData, setFormData] = useState<PredictionInput>({
    bahan_baku: 1200,
    jam_mesin: 8,
    suhu: 185,
    tekanan: 120,
    cycle_time: 45,
    defect: 15,
    downtime: 0.5,
    model: "RandomForest",
  });

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const prediction = await onPredict(formData);
      setResult(prediction);
    } finally {
      setIsLoading(false);
    }
  };

  const impactColors = {
    high: "text-destructive",
    medium: "text-warning",
    low: "text-muted-foreground",
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Prediksi Kerugian
          </CardTitle>
          <CardDescription>
            Masukkan parameter produksi untuk memprediksi kemungkinan kerugian
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Bahan Baku (kg)</Label>
              <Input
                type="number"
                value={formData.bahan_baku}
                onChange={(e) => setFormData({ ...formData, bahan_baku: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Jam Mesin (jam)</Label>
              <Input
                type="number"
                step="0.1"
                value={formData.jam_mesin}
                onChange={(e) => setFormData({ ...formData, jam_mesin: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Suhu (°C)</Label>
              <Input
                type="number"
                value={formData.suhu}
                onChange={(e) => setFormData({ ...formData, suhu: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Tekanan (bar)</Label>
              <Input
                type="number"
                value={formData.tekanan}
                onChange={(e) => setFormData({ ...formData, tekanan: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Cycle Time (detik)</Label>
              <Input
                type="number"
                value={formData.cycle_time}
                onChange={(e) => setFormData({ ...formData, cycle_time: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Defect (unit)</Label>
              <Input
                type="number"
                value={formData.defect}
                onChange={(e) => setFormData({ ...formData, defect: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Downtime (jam)</Label>
              <Input
                type="number"
                step="0.1"
                value={formData.downtime}
                onChange={(e) => setFormData({ ...formData, downtime: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Model</Label>
              <Select
                value={formData.model}
                onValueChange={(v) => setFormData({ ...formData, model: v as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="RandomForest">Random Forest</SelectItem>
                  <SelectItem value="LogisticRegression">Logistic Regression</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleSubmit} className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                <Brain className="h-4 w-4 mr-2" />
                Jalankan Prediksi
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Hasil Prediksi</CardTitle>
        </CardHeader>
        <CardContent>
          {result ? (
            <div className="space-y-6">
              <div className={`flex items-center gap-4 p-4 rounded-lg ${
                result.prediksi === "Terjadi" ? "bg-destructive/10" : "bg-success/10"
              }`}>
                {result.prediksi === "Terjadi" ? (
                  <AlertTriangle className="h-10 w-10 text-destructive" />
                ) : (
                  <CheckCircle className="h-10 w-10 text-success" />
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Prediksi Kerugian</p>
                  <p className={`text-2xl font-bold ${
                    result.prediksi === "Terjadi" ? "text-destructive" : "text-success"
                  }`}>
                    {result.prediksi === "Terjadi" ? "Berpotensi Rugi" : "Aman"}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Probabilitas Kerugian</span>
                  <span className="font-mono font-semibold">{(result.probabilitas * 100).toFixed(1)}%</span>
                </div>
                <Progress 
                  value={result.probabilitas * 100} 
                  className={result.probabilitas > 0.5 ? "[&>div]:bg-destructive" : "[&>div]:bg-success"}
                />
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium">Faktor Risiko:</p>
                {result.factors.map((factor, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span>{factor.name}</span>
                    <span className={`font-medium ${impactColors[factor.impact]}`}>
                      {factor.impact === "high" ? "Tinggi" : factor.impact === "medium" ? "Sedang" : "Rendah"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
              <Brain className="h-12 w-12 mb-4 opacity-50" />
              <p>Masukkan parameter dan klik tombol prediksi untuk melihat hasil</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

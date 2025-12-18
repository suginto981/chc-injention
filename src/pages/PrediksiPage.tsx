import { Sidebar } from "@/components/Sidebar";
import { PredictionForm } from "@/components/PredictionForm";

export default function PrediksiPage() {
  const handlePredict = async (data: any) => {
    // Simulate prediction with simple logic
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Simple risk calculation based on parameters
    let riskScore = 0;
    const factors: { name: string; impact: "high" | "medium" | "low" }[] = [];

    // High defect count increases risk
    if (data.defect > 30) {
      riskScore += 0.3;
      factors.push({ name: "Defect tinggi", impact: "high" });
    } else if (data.defect > 15) {
      riskScore += 0.15;
      factors.push({ name: "Defect menengah", impact: "medium" });
    }

    // High downtime increases risk
    if (data.downtime > 1.5) {
      riskScore += 0.25;
      factors.push({ name: "Downtime tinggi", impact: "high" });
    } else if (data.downtime > 0.8) {
      riskScore += 0.1;
      factors.push({ name: "Downtime menengah", impact: "medium" });
    }

    // Temperature out of range
    if (data.suhu > 195 || data.suhu < 180) {
      riskScore += 0.2;
      factors.push({ name: "Suhu di luar rentang optimal", impact: "high" });
    }

    // Pressure issues
    if (data.tekanan > 130 || data.tekanan < 110) {
      riskScore += 0.15;
      factors.push({ name: "Tekanan tidak optimal", impact: "medium" });
    }

    // Cycle time too long
    if (data.cycle_time > 50) {
      riskScore += 0.1;
      factors.push({ name: "Cycle time panjang", impact: "low" });
    }

    // Low material usage
    if (data.bahan_baku < 1100) {
      riskScore += 0.1;
      factors.push({ name: "Bahan baku terbatas", impact: "low" });
    }

    if (factors.length === 0) {
      factors.push({ name: "Parameter dalam kondisi normal", impact: "low" });
    }

    const probabilitas = Math.min(riskScore + Math.random() * 0.1, 0.99);
    const prediksi: "Terjadi" | "Tidak" = probabilitas > 0.5 ? "Terjadi" : "Tidak";

    return {
      prediksi,
      probabilitas,
      factors,
    };
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Prediksi Kerugian</h1>
          <p className="text-muted-foreground mt-1">
            Gunakan model machine learning untuk memprediksi potensi kerugian produksi
          </p>
        </div>

        <PredictionForm onPredict={handlePredict} />
      </main>
    </div>
  );
}

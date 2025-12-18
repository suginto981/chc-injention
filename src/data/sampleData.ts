import { ProductionData, PredictionResult } from "@/types/production";

export const sampleProductionData: ProductionData[] = [
  { id: 1, tanggal: "2024-01-05", bahan_baku: 1250, jam_mesin: 8.5, suhu: 185, tekanan: 120, cycle_time: 45, defect: 12, downtime: 0.5, kerugian: 0 },
  { id: 2, tanggal: "2024-01-10", bahan_baku: 1180, jam_mesin: 7.2, suhu: 192, tekanan: 125, cycle_time: 48, defect: 25, downtime: 1.2, kerugian: 1 },
  { id: 3, tanggal: "2024-01-15", bahan_baku: 1320, jam_mesin: 9.0, suhu: 188, tekanan: 118, cycle_time: 42, defect: 8, downtime: 0.3, kerugian: 0 },
  { id: 4, tanggal: "2024-01-20", bahan_baku: 1100, jam_mesin: 6.8, suhu: 195, tekanan: 130, cycle_time: 52, defect: 35, downtime: 2.1, kerugian: 1 },
  { id: 5, tanggal: "2024-01-25", bahan_baku: 1400, jam_mesin: 8.0, suhu: 183, tekanan: 115, cycle_time: 40, defect: 5, downtime: 0.2, kerugian: 0 },
  { id: 6, tanggal: "2024-02-01", bahan_baku: 1280, jam_mesin: 7.5, suhu: 190, tekanan: 122, cycle_time: 46, defect: 18, downtime: 0.8, kerugian: 0 },
  { id: 7, tanggal: "2024-02-05", bahan_baku: 1050, jam_mesin: 6.2, suhu: 198, tekanan: 135, cycle_time: 55, defect: 42, downtime: 2.5, kerugian: 1 },
  { id: 8, tanggal: "2024-02-10", bahan_baku: 1350, jam_mesin: 8.8, suhu: 186, tekanan: 119, cycle_time: 43, defect: 10, downtime: 0.4, kerugian: 0 },
  { id: 9, tanggal: "2024-02-15", bahan_baku: 1220, jam_mesin: 7.8, suhu: 191, tekanan: 124, cycle_time: 47, defect: 22, downtime: 1.0, kerugian: 1 },
  { id: 10, tanggal: "2024-02-20", bahan_baku: 1450, jam_mesin: 9.2, suhu: 182, tekanan: 112, cycle_time: 38, defect: 3, downtime: 0.1, kerugian: 0 },
  { id: 11, tanggal: "2024-02-25", bahan_baku: 1150, jam_mesin: 6.5, suhu: 196, tekanan: 128, cycle_time: 50, defect: 30, downtime: 1.8, kerugian: 1 },
  { id: 12, tanggal: "2024-03-01", bahan_baku: 1380, jam_mesin: 8.3, suhu: 184, tekanan: 116, cycle_time: 41, defect: 7, downtime: 0.3, kerugian: 0 },
];

export const samplePredictions: PredictionResult[] = [
  { id: 1, id_produksi: 2, model: "RandomForest", prediksi: "Terjadi", probabilitas: 0.85, kode_prediksi: "TP", waktu_prediksi: "2024-01-10T10:30:00" },
  { id: 2, id_produksi: 4, model: "LogisticRegression", prediksi: "Terjadi", probabilitas: 0.78, kode_prediksi: "TP", waktu_prediksi: "2024-01-20T14:15:00" },
  { id: 3, id_produksi: 5, model: "RandomForest", prediksi: "Tidak", probabilitas: 0.92, kode_prediksi: "TN", waktu_prediksi: "2024-01-25T09:45:00" },
  { id: 4, id_produksi: 7, model: "RandomForest", prediksi: "Terjadi", probabilitas: 0.91, kode_prediksi: "TP", waktu_prediksi: "2024-02-05T11:20:00" },
  { id: 5, id_produksi: 9, model: "LogisticRegression", prediksi: "Terjadi", probabilitas: 0.72, kode_prediksi: "TP", waktu_prediksi: "2024-02-15T16:00:00" },
];

export interface ProductionData {
  id: number;
  tanggal: string;
  bahan_baku: number;
  jam_mesin: number;
  suhu: number;
  tekanan: number;
  cycle_time: number;
  defect: number;
  downtime: number;
  kerugian: 0 | 1;
}

export interface PredictionResult {
  id: number;
  id_produksi: number;
  model: 'RandomForest' | 'LogisticRegression';
  prediksi: 'Terjadi' | 'Tidak';
  probabilitas: number;
  kode_prediksi: 'TP' | 'TN' | 'FP' | 'FN';
  waktu_prediksi: string;
}

export interface User {
  id: number;
  username: string;
  role: 'admin' | 'operator';
}

export interface DashboardStats {
  totalProduksi: number;
  totalKerugian: number;
  avgDefect: number;
  avgDowntime: number;
  successRate: number;
}

export type ProductionItem = {
  date: string;
  qty: number;
  defects: number;
  downtimeHours: number;
  materialKg: number;
};

export const sampleProduction: ProductionItem[] = [
  { date: "2024-03-01", qty: 1380, defects: 7, downtimeHours: 0.5, materialKg: 1260 },
  { date: "2024-02-25", qty: 1150, defects: 30, downtimeHours: 1.4, materialKg: 1210 },
  { date: "2024-02-20", qty: 1450, defects: 3, downtimeHours: 0.2, materialKg: 1280 },
  { date: "2024-02-15", qty: 1320, defects: 9, downtimeHours: 0.8, materialKg: 1240 },
  { date: "2024-02-10", qty: 1400, defects: 5, downtimeHours: 0.6, materialKg: 1275 },
];

export function computeMetrics(items: ProductionItem[]) {
  const totalProduksi = items.length;
  const totalKerugian = items.filter(x => x.defects > 20).length;
  const sukses = totalProduksi === 0 ? 0 : ((totalProduksi - totalKerugian) / totalProduksi) * 100;
  const avgDefect = items.length ? Math.round(items.reduce((a, b) => a + b.defects, 0) / items.length) : 0;
  const avgDowntime = items.length ? Number((items.reduce((a, b) => a + b.downtimeHours, 0) / items.length).toFixed(1)) : 0;
  const avgMaterial = items.length ? Math.round(items.reduce((a, b) => a + b.materialKg, 0) / items.length) : 0;
  return { totalProduksi, totalKerugian, sukses, avgDefect, avgDowntime, avgMaterial };
}

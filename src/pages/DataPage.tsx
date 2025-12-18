import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { ProductionTable } from "@/components/ProductionTable";
import { ExcelHandler } from "@/components/ExcelHandler";
import { sampleProductionData } from "@/data/sampleData";
import { ProductionData } from "@/types/production";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Database } from "lucide-react";

export default function DataPage() {
  const [data, setData] = useState<ProductionData[]>(sampleProductionData);

  const handleAdd = (newItem: Omit<ProductionData, "id">) => {
    const newId = Math.max(...data.map((d) => d.id), 0) + 1;
    setData([...data, { ...newItem, id: newId }]);
  };

  const handleEdit = (updatedItem: ProductionData) => {
    setData(data.map((item) => (item.id === updatedItem.id ? updatedItem : item)));
  };

  const handleDelete = (id: number) => {
    setData(data.filter((item) => item.id !== id));
  };

  const handleImport = (importedData: Omit<ProductionData, "id">[]) => {
    const startId = Math.max(...data.map((d) => d.id), 0) + 1;
    const newData = importedData.map((item, index) => ({
      ...item,
      id: startId + index,
    }));
    setData([...data, ...newData]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Data Produksi</h1>
          <p className="text-muted-foreground mt-1">
            Kelola data histori produksi CHC Injection 1600 Ton
          </p>
        </div>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Database className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Tabel Data Produksi</CardTitle>
                <CardDescription>{data.length} data tersimpan</CardDescription>
              </div>
            </div>
            <ExcelHandler data={data} onImport={handleImport} />
          </CardHeader>
          <CardContent>
            <ProductionTable
              data={data}
              onAdd={handleAdd}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

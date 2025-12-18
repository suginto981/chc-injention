import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";
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
      
      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border md:hidden safe-area-top">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Database className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="font-bold text-foreground">Data Produksi</h1>
              <p className="text-[10px] text-muted-foreground">{data.length} data</p>
            </div>
          </div>
        </div>
      </header>

      <main className="md:ml-64 px-4 md:px-8 pt-20 md:pt-8 pb-24 md:pb-8">
        <div className="mb-6 md:mb-8 hidden md:block">
          <h1 className="text-3xl font-bold gradient-text">Data Produksi</h1>
          <p className="text-muted-foreground mt-1">
            Kelola data histori produksi CHC Injection 1600 Ton
          </p>
        </div>

        <Card className="glass-card border-border/50">
          <CardHeader className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10 hidden md:flex">
                <Database className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Tabel Data Produksi</CardTitle>
                <CardDescription>{data.length} data tersimpan</CardDescription>
              </div>
            </div>
            <ExcelHandler data={data} onImport={handleImport} />
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <ProductionTable
              data={data}
              onAdd={handleAdd}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </CardContent>
        </Card>
      </main>

      <MobileNav />
    </div>
  );
}

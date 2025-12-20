import { useRef } from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { ProductionData } from "@/types/production";
import { Upload, Download, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";

interface ExcelHandlerProps {
  data: ProductionData[];
  onImport: (data: Omit<ProductionData, "id">[]) => void;
}

export function ExcelHandler({ data, onImport }: ExcelHandlerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      data.map((item) => ({
        ID: item.id,
        Tanggal: item.tanggal,
        "Bahan Baku (kg)": item.bahan_baku,
        "Jam Mesin (jam)": item.jam_mesin,
        "Suhu (°C)": item.suhu,
        "Tekanan (bar)": item.tekanan,
        "Cycle Time (dtk)": item.cycle_time,
        Defect: item.defect,
        "Downtime (jam)": item.downtime,
        "Kerugian (0/1)": item.kerugian,
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Produksi");

    // Set column widths
    worksheet["!cols"] = [
      { wch: 5 }, { wch: 12 }, { wch: 15 }, { wch: 15 },
      { wch: 10 }, { wch: 12 }, { wch: 15 }, { wch: 8 },
      { wch: 15 }, { wch: 12 },
    ];

    XLSX.writeFile(workbook, `data_produksi_${new Date().toISOString().split("T")[0]}.xlsx`);
    toast.success("Data berhasil diekspor ke Excel");
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const importedData: Omit<ProductionData, "id">[] = jsonData.map((row: any) => {
          // Handle Excel date serial number or date string
          let tanggal = row.Tanggal || row.tanggal || new Date().toISOString().split("T")[0];
          if (typeof tanggal === "number") {
            // Excel serial date conversion
            const excelDate = new Date((tanggal - 25569) * 86400 * 1000);
            tanggal = excelDate.toISOString().split("T")[0];
          } else if (tanggal instanceof Date) {
            tanggal = tanggal.toISOString().split("T")[0];
          } else {
            tanggal = String(tanggal);
          }
          
          return {
            tanggal,
            bahan_baku: Number(row["Bahan Baku (kg)"] || row.bahan_baku) || 0,
            jam_mesin: Number(row["Jam Mesin (jam)"] || row.jam_mesin) || 0,
            suhu: Number(row["Suhu (°C)"] || row.suhu) || 0,
            tekanan: Number(row["Tekanan (bar)"] || row.tekanan) || 0,
            cycle_time: Number(row["Cycle Time (dtk)"] || row.cycle_time) || 0,
            defect: Number(row.Defect || row.defect) || 0,
            downtime: Number(row["Downtime (jam)"] || row.downtime) || 0,
            kerugian: (Number(row["Kerugian (0/1)"] || row.kerugian) || 0) as 0 | 1,
          };
        });

        onImport(importedData);
        toast.success(`${importedData.length} data berhasil diimpor`);
      } catch (error) {
        toast.error("Gagal membaca file Excel");
      }
    };
    reader.readAsArrayBuffer(file);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDownloadTemplate = () => {
    const templateData = [
      {
        Tanggal: "2024-01-01",
        "Bahan Baku (kg)": 1000,
        "Jam Mesin (jam)": 8,
        "Suhu (°C)": 185,
        "Tekanan (bar)": 120,
        "Cycle Time (dtk)": 45,
        Defect: 10,
        "Downtime (jam)": 0.5,
        "Kerugian (0/1)": 0,
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template");

    worksheet["!cols"] = [
      { wch: 12 }, { wch: 15 }, { wch: 15 }, { wch: 10 },
      { wch: 12 }, { wch: 15 }, { wch: 8 }, { wch: 15 }, { wch: 12 },
    ];

    XLSX.writeFile(workbook, "template_data_produksi.xlsx");
    toast.success("Template berhasil diunduh");
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="file"
        ref={fileInputRef}
        accept=".xlsx,.xls"
        onChange={handleImport}
        className="hidden"
      />
      <Button variant="outline" size="sm" onClick={handleDownloadTemplate}>
        <FileSpreadsheet className="h-4 w-4 mr-2" />
        Template
      </Button>
      <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
        <Upload className="h-4 w-4 mr-2" />
        Import Excel
      </Button>
      <Button variant="outline" size="sm" onClick={handleExport}>
        <Download className="h-4 w-4 mr-2" />
        Export Excel
      </Button>
    </div>
  );
}

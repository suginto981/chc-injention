import { useState } from "react";
import { ProductionData } from "@/types/production";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Trash2, Plus, Search } from "lucide-react";
import { toast } from "sonner";

interface ProductionTableProps {
  data: ProductionData[];
  onAdd: (item: Omit<ProductionData, "id">) => void;
  onEdit: (item: ProductionData) => void;
  onDelete: (id: number) => void;
}

const emptyForm: Omit<ProductionData, "id"> = {
  tanggal: new Date().toISOString().split("T")[0],
  bahan_baku: 0,
  jam_mesin: 0,
  suhu: 0,
  tekanan: 0,
  cycle_time: 0,
  defect: 0,
  downtime: 0,
  kerugian: 0,
};

export function ProductionTable({ data, onAdd, onEdit, onDelete }: ProductionTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<ProductionData | null>(null);
  const [formData, setFormData] = useState<Omit<ProductionData, "id">>(emptyForm);

  const filteredData = data.filter((item) => {
    const tanggalStr = String(item.tanggal || "");
    return tanggalStr.includes(searchTerm) ||
      item.bahan_baku.toString().includes(searchTerm);
  });

  const handleSubmit = () => {
    if (editItem) {
      onEdit({ ...formData, id: editItem.id });
      setEditItem(null);
      toast.success("Data berhasil diperbarui");
    } else {
      onAdd(formData);
      toast.success("Data berhasil ditambahkan");
    }
    setFormData(emptyForm);
    setIsAddOpen(false);
  };

  const handleEdit = (item: ProductionData) => {
    setEditItem(item);
    setFormData(item);
    setIsAddOpen(true);
  };

  const handleDelete = (id: number) => {
    onDelete(id);
    toast.success("Data berhasil dihapus");
  };

  const FormFields = () => (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Tanggal</Label>
        <Input
          type="date"
          value={formData.tanggal}
          onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
        />
      </div>
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
      <div className="space-y-2 col-span-2">
        <Label>Kerugian</Label>
        <Select
          value={String(formData.kerugian)}
          onValueChange={(v) => setFormData({ ...formData, kerugian: Number(v) as 0 | 1 })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Tidak Terjadi</SelectItem>
            <SelectItem value="1">Terjadi</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari data..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setFormData(emptyForm); setEditItem(null); }}>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Data
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editItem ? "Edit Data Produksi" : "Tambah Data Produksi"}</DialogTitle>
            </DialogHeader>
            <FormFields />
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>Batal</Button>
              <Button onClick={handleSubmit}>Simpan</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tanggal</th>
                <th>Bahan Baku</th>
                <th>Jam Mesin</th>
                <th>Suhu</th>
                <th>Tekanan</th>
                <th>Cycle Time</th>
                <th>Defect</th>
                <th>Downtime</th>
                <th>Kerugian</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id}>
                  <td className="font-mono text-sm">{item.id}</td>
                  <td>{new Date(item.tanggal).toLocaleDateString("id-ID")}</td>
                  <td>{item.bahan_baku.toLocaleString()} kg</td>
                  <td>{item.jam_mesin} jam</td>
                  <td>{item.suhu}°C</td>
                  <td>{item.tekanan} bar</td>
                  <td>{item.cycle_time} dtk</td>
                  <td>{item.defect}</td>
                  <td>{item.downtime} jam</td>
                  <td>
                    <span className={item.kerugian === 1 ? "badge-danger" : "badge-success"}>
                      {item.kerugian === 1 ? "Rugi" : "Aman"}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

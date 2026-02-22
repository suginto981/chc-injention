import React from "react";

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b">
        <div className="mx-auto max-w-6xl px-6 py-4">
          <h1 className="text-xl font-semibold">CHC Injection 1600 Ton - Monitor</h1>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">
        <section className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6">
            <h2 className="text-lg font-medium">Selamat datang</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              UI masih minimal. Kita bisa aktifkan autentikasi atau menambah dashboard.
            </p>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-md border bg-background p-4">
                <div className="text-sm font-medium">Status Produksi</div>
                <div className="mt-2 text-2xl font-semibold">-</div>
              </div>
              <div className="rounded-md border bg-background p-4">
                <div className="text-sm font-medium">Kerugian Terprediksi</div>
                <div className="mt-2 text-2xl font-semibold">-</div>
              </div>
              <div className="rounded-md border bg-background p-4">
                <div className="text-sm font-medium">Utilisasi Mesin</div>
                <div className="mt-2 text-2xl font-semibold">-</div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

import React from "react";
import Sidebar from "../components/Sidebar.tsx";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="border-b">
          <div className="mx-auto max-w-7xl px-6 py-4">
            <h1 className="text-lg font-semibold">Dashboard</h1>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-6 py-6 w-full">{children}</main>
      </div>
    </div>
  );
}

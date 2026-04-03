import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import ProductionPage from "./pages/Production.tsx";
import PredictionsPage from "./pages/Predictions.tsx";
import AnalysisPage from "./pages/Analysis.tsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <MainLayout>
              <Dashboard />
            </MainLayout>
          }
        />
        <Route
          path="production"
          element={
            <MainLayout>
              <ProductionPage />
            </MainLayout>
          }
        />
        <Route
          path="predictions"
          element={
            <MainLayout>
              <PredictionsPage />
            </MainLayout>
          }
        />
        <Route
          path="analysis"
          element={
            <MainLayout>
              <AnalysisPage />
            </MainLayout>
          }
        />
        <Route path="dashboard" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

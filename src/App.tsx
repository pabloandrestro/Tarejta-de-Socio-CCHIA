import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DirectoryProvider } from './context/DirectoryContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

import { DirectoryPage } from './pages/DirectoryPage';
import { CardDetailPage } from './pages/CardDetailPage';
import { CategoryPage } from './pages/CategoryPage';
import { LoginPage } from './pages/LoginPage';
import { CardFormPage } from './pages/CardFormPage';
import { AdminPage } from './pages/AdminPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { ConfidentialityPage } from './pages/ConfidentialityPage';
import { FirebaseSetupPage } from './pages/FirebaseSetupPage';

export default function App() {
  return (
    <BrowserRouter>
      <DirectoryProvider>
        <div className="min-h-screen flex flex-col bg-[#F7F9FB] text-[#15385F]">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Navigate to="/directorio" replace />} />
              <Route path="/directorio" element={<DirectoryPage />} />
              <Route path="/directorio/:slug" element={<CardDetailPage />} />
              <Route path="/directorio/categoria/:slug" element={<CategoryPage />} />
              <Route path="/ingresar" element={<LoginPage />} />
              <Route path="/mi-tarjeta" element={<CardFormPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/privacidad" element={<PrivacyPage />} />
              <Route path="/confidencialidad" element={<ConfidentialityPage />} />
              <Route path="/configuracion-firebase" element={<FirebaseSetupPage />} />
              <Route path="*" element={<Navigate to="/directorio" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </DirectoryProvider>
    </BrowserRouter>
  );
}

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppDataProvider } from './context/AppDataContext';
import Store from './pages/Store';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import ProductsManager from './pages/admin/ProductsManager';
import CategoriesManager from './pages/admin/CategoriesManager';

function App() {
  return (
    <AppDataProvider>
      <BrowserRouter>
        <Routes>
          {/* Rota da Loja */}
          <Route path="/" element={<Store />} />

          {/* Rotas do Admin */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<ProductsManager />} />
            <Route path="categories" element={<CategoriesManager />} />
            {/* Placeholders for future pages */}
            <Route path="users" element={<div className="p-8"><h2 className="text-xl font-bold">Gestão de Usuários (Em Breve)</h2></div>} />
            <Route path="settings" element={<div className="p-8"><h2 className="text-xl font-bold">Configurações (Em Breve)</h2></div>} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppDataProvider>
  );
}

export default App;

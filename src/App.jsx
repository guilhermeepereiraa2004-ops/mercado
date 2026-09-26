import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppDataProvider } from './context/AppDataContext';
import AdminLayout from './layouts/AdminLayout';
import SuperAdminLayout from './layouts/SuperAdminLayout';
import Store from './pages/Store';
import CategoriesManager from './pages/admin/CategoriesManager';
import Dashboard from './pages/admin/Dashboard';
import FinanceManager from './pages/admin/FinanceManager';
import OrdersManager from './pages/admin/OrdersManager';
import ProductsManager from './pages/admin/ProductsManager';
import StoreSettings from './pages/admin/StoreSettings';
import BillingManager from './pages/superadmin/BillingManager';
import MarketsManager from './pages/superadmin/MarketsManager';
import PlatformSettings from './pages/superadmin/PlatformSettings';
import SuperDashboard from './pages/superadmin/SuperDashboard';
import AdminAccess from './components/AdminAccess';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Store />} />
      <Route path="/admin" element={<AdminAccess><AdminLayout /></AdminAccess>}>
        <Route index element={<Dashboard />} />
        <Route path="orders" element={<OrdersManager />} />
        <Route path="products" element={<ProductsManager />} />
        <Route path="categories" element={<CategoriesManager />} />
        <Route path="finance" element={<FinanceManager />} />
        <Route path="settings" element={<StoreSettings />} />
      </Route>
      <Route path="/superadmin" element={<SuperAdminLayout />}>
        <Route index element={<SuperDashboard />} />
        <Route path="markets" element={<MarketsManager />} />
        <Route path="billing" element={<BillingManager />} />
        <Route path="settings" element={<PlatformSettings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return <AppDataProvider><BrowserRouter><AppRoutes /></BrowserRouter></AppDataProvider>;
}

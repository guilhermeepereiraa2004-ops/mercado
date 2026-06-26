import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Package, Settings, Users, ArrowLeft, LogOut, Search, Bell, Tag
} from 'lucide-react';

export default function AdminLayout() {
  const location = useLocation();

  const navItems = [
    { path: '/admin', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/admin/products', icon: <Package size={20} />, label: 'Mercadorias' },
    { path: '/admin/categories', icon: <Tag size={20} />, label: 'Categorias' },
    { path: '/admin/users', icon: <Users size={20} />, label: 'Usuários' },
    { path: '/admin/settings', icon: <Settings size={20} />, label: 'Configurações' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 font-inter text-[#1A1A2E]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <span className="font-syne font-extrabold text-2xl text-[#1DB954] tracking-tight">Admin</span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-sm
                  ${isActive 
                    ? 'bg-[#1DB954]/10 text-[#1DB954]' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-[#1A1A2E]'}`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <Link 
            to="/" 
            className="flex items-center space-x-3 px-3 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium w-full"
          >
            <ArrowLeft size={20} />
            <span>Voltar à Loja</span>
          </Link>
          <button className="flex items-center space-x-3 px-3 py-2.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium w-full mt-1">
            <LogOut size={20} />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Buscar..."
              className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1DB954]/50 focus:border-[#1DB954] transition-all"
            />
          </div>
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-400 hover:text-[#1A1A2E] transition-colors rounded-full hover:bg-gray-100">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF6B35] rounded-full"></span>
            </button>
            <div className="flex items-center space-x-3 border-l border-gray-200 pl-4">
              <img src="https://i.pravatar.cc/150?u=admin" alt="Admin" className="w-8 h-8 rounded-full border border-gray-200" />
              <div className="text-sm">
                <p className="font-bold text-[#1A1A2E] leading-none">Admin User</p>
                <p className="text-gray-500 text-xs mt-0.5">Gestor</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

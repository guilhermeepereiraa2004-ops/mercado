import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { BarChart3, Bell, ChevronDown, LayoutDashboard, LogOut, Menu, Package, ReceiptText, Settings, Shapes, Store, X } from 'lucide-react';
import { StoreBrand } from '../components/Brand';
import { useAppData } from '../context/AppDataContext';

const navItems = [
  { path: '/admin', label: 'Visão geral', icon: LayoutDashboard, exact: true },
  { path: '/admin/orders', label: 'Pedidos', icon: ReceiptText, badge: true },
  { path: '/admin/products', label: 'Produtos', icon: Package },
  { path: '/admin/categories', label: 'Categorias', icon: Shapes },
  { path: '/admin/finance', label: 'Financeiro', icon: BarChart3 },
  { path: '/admin/settings', label: 'Loja & site', icon: Settings },
];

export default function AdminLayout() {
  const { activeTenant, tenantOrders } = useAppData();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const newOrders = tenantOrders.filter((order) => order.status === 'new').length;

  const active = (item) => item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path);

  const Sidebar = () => (
    <div className="flex h-full flex-col bg-[#17251f] text-white">
      <div className="flex h-[88px] items-center justify-between border-b border-white/10 px-6">
        <StoreBrand name={activeTenant?.settings?.logoText || activeTenant?.name} accent={activeTenant?.settings?.accent} logoUrl={activeTenant?.settings?.logoUrl} light />
        <button className="md:hidden" onClick={() => setOpen(false)} aria-label="Fechar menu"><X size={20} /></button>
      </div>
      <nav className="flex-1 overflow-y-auto px-4 py-6">
        <p className="mb-3 px-3 text-[9px] font-extrabold uppercase tracking-[0.22em] text-white/35">Operação</p>
        <div className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = active(item);
            return (
              <Link key={item.path} to={item.path} onClick={() => setOpen(false)} className={`flex items-center gap-3 rounded-[14px] px-3.5 py-3 text-sm font-bold transition ${isActive ? 'bg-white text-[#17251f] shadow-sm' : 'text-white/60 hover:bg-white/7 hover:text-white'}`}>
                <Icon size={18} strokeWidth={isActive ? 2.4 : 2} />
                <span>{item.label}</span>
                {item.badge && newOrders > 0 && <span className="ml-auto grid min-w-6 place-items-center rounded-full bg-[#ff5a36] px-1.5 py-0.5 text-[10px] font-black text-white">{newOrders}</span>}
              </Link>
            );
          })}
        </div>
      </nav>
      <div className="border-t border-white/10 p-4">
        <Link to="/" target="_blank" rel="noreferrer" className="mb-1 flex items-center gap-3 rounded-[14px] px-3.5 py-3 text-sm font-bold text-white/60 transition hover:bg-white/7 hover:text-white"><Store size={18} />Abrir minha loja</Link>
        <button onClick={() => { sessionStorage.removeItem(`cesta_admin_authenticated_${activeTenant?.id}`); window.location.assign('/admin'); }} className="flex w-full items-center gap-3 rounded-[14px] px-3.5 py-3 text-sm font-bold text-white/45 transition hover:bg-white/7 hover:text-white"><LogOut size={18} />Sair</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f5f4ef]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[270px] md:block"><Sidebar /></aside>
      {open && <div className="fixed inset-0 z-50 md:hidden"><button className="absolute inset-0 bg-[#101c16]/50 backdrop-blur-sm" onClick={() => setOpen(false)} aria-label="Fechar menu" /><aside className="relative h-full w-[285px] max-w-[88vw] shadow-2xl"><Sidebar /></aside></div>}

      <div className="min-w-0 md:pl-[270px]">
        <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-[#dfe3df] bg-[#f5f4ef]/90 px-4 backdrop-blur-xl sm:px-7">
          <div className="flex items-center gap-3">
            <button onClick={() => setOpen(true)} className="grid h-10 w-10 place-items-center rounded-xl border border-[#d9dfdb] bg-white md:hidden" aria-label="Abrir menu"><Menu size={19} /></button>
            <div className="hidden sm:block">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#8a9690]">Painel do mercado</p>
              <p className="text-sm font-extrabold text-[#26372f]">{activeTenant?.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/admin/orders" className="relative grid h-10 w-10 place-items-center rounded-xl border border-[#d9dfdb] bg-white text-[#526159] transition hover:text-[#17251f]" aria-label="Pedidos novos"><Bell size={18} />{newOrders > 0 && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#ff5a36] ring-2 ring-white" />}</Link>
            <div className="ml-1 flex items-center gap-2 rounded-2xl bg-white py-1.5 pl-1.5 pr-3 ring-1 ring-[#dfe3df]">
              <div className="grid h-8 w-8 place-items-center rounded-xl bg-[#e7efdf] text-xs font-black text-[#45633c]">MR</div>
              <div className="hidden leading-tight sm:block"><p className="text-xs font-extrabold">Mara Rubia</p><p className="text-[10px] text-[#849089]">Administradora</p></div>
              <ChevronDown size={14} className="hidden text-[#839088] sm:block" />
            </div>
          </div>
        </header>
        <main className="min-h-[calc(100vh-72px)] min-w-0 p-4 sm:p-7 lg:p-9"><div className="mx-auto min-w-0 max-w-[1440px]"><Outlet /></div></main>
      </div>
    </div>
  );
}

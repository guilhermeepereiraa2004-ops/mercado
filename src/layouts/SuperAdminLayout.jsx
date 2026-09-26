import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Bell, Building2, ChevronDown, CreditCard, LayoutDashboard, LogOut, Menu, Settings2, X } from 'lucide-react';
import { Brand } from '../components/Brand';
import { useAppData } from '../context/AppDataContext';
import { getTenantCommission, summarizeOrders } from '../lib/finance';

const items = [
  { path: '/superadmin', label: 'Visão geral', icon: LayoutDashboard, exact: true },
  { path: '/superadmin/markets', label: 'Mercados', icon: Building2 },
  { path: '/superadmin/billing', label: 'Financeiro', icon: CreditCard },
  { path: '/superadmin/settings', label: 'Configurações', icon: Settings2 },
];

export default function SuperAdminLayout() {
  const { tenants, orders, platformSettings } = useAppData();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const pending = tenants.filter((tenant) => {
    const summary = summarizeOrders(orders.filter((order) => order.tenantId === tenant.id), getTenantCommission(tenant, platformSettings));
    return summary.platformFee - Number(tenant.repassedAmount || 0) > 0.009;
  }).length;
  const isActive = (item) => item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path);

  const Sidebar = () => (
    <div className="flex h-full flex-col bg-[#10231c] text-white">
      <div className="flex h-[94px] items-center justify-between border-b border-white/10 px-6"><Brand inverse suffix="central de operações" /><button className="md:hidden" onClick={() => setOpen(false)}><X size={20} /></button></div>
      <div className="mx-4 mt-5 rounded-2xl border border-white/10 bg-white/[0.05] p-4">
        <p className="text-[9px] font-extrabold uppercase tracking-[0.18em] text-[#a6d17b]">Conta master</p>
        <p className="mt-1 text-sm font-bold">Operação Brasil</p>
        <p className="mt-0.5 text-[11px] text-white/40">Todos os ambientes</p>
      </div>
      <nav className="flex-1 overflow-y-auto px-4 py-6">
        <p className="mb-3 px-3 text-[9px] font-extrabold uppercase tracking-[0.22em] text-white/30">Gestão da plataforma</p>
        <div className="space-y-1.5">
          {items.map((item) => { const Icon = item.icon; const current = isActive(item); return (
            <Link key={item.path} to={item.path} onClick={() => setOpen(false)} className={`flex items-center gap-3 rounded-[14px] px-3.5 py-3 text-sm font-bold transition ${current ? 'bg-[#ff5a36] text-white shadow-[0_8px_20px_rgba(255,90,54,.2)]' : 'text-white/55 hover:bg-white/7 hover:text-white'}`}>
              <Icon size={18} /><span>{item.label}</span>{item.path.includes('billing') && pending > 0 && <span className={`ml-auto rounded-full px-2 py-0.5 text-[10px] ${current ? 'bg-white/20' : 'bg-[#ff5a36] text-white'}`}>{pending}</span>}
            </Link>
          ); })}
        </div>
      </nav>
      <div className="border-t border-white/10 p-4"><Link to="/" className="flex items-center gap-3 rounded-[14px] px-3.5 py-3 text-sm font-bold text-white/45 transition hover:bg-white/7 hover:text-white"><LogOut size={18} />Voltar à vitrine</Link></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f4f3ee]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[280px] md:block"><Sidebar /></aside>
      {open && <div className="fixed inset-0 z-50 md:hidden"><button className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} /><aside className="relative h-full w-[290px] max-w-[88vw]"><Sidebar /></aside></div>}
      <div className="min-w-0 md:pl-[280px]">
        <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-[#dfe3df] bg-[#f4f3ee]/90 px-4 backdrop-blur-xl sm:px-8">
          <button onClick={() => setOpen(true)} className="grid h-10 w-10 place-items-center rounded-xl border border-[#d9dfdb] bg-white md:hidden"><Menu size={19} /></button>
          <div className="hidden md:block"><p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#87938d]">CestaOS</p><p className="text-sm font-extrabold">Administração da plataforma</p></div>
          <div className="ml-auto flex items-center gap-2">
            <Link to="/superadmin/billing" className="relative grid h-10 w-10 place-items-center rounded-xl border border-[#d9dfdb] bg-white text-[#56645d]"><Bell size={18} />{pending > 0 && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#ff5a36] ring-2 ring-white" />}</Link>
            <div className="ml-1 flex items-center gap-2 rounded-2xl border border-[#d9dfdb] bg-white py-1.5 pl-1.5 pr-3"><div className="grid h-8 w-8 place-items-center rounded-xl bg-[#17251f] text-[11px] font-black text-white">GP</div><div className="hidden sm:block"><p className="text-xs font-extrabold">Guilherme Pereira</p><p className="text-[10px] text-[#849089]">Admin master</p></div><ChevronDown size={14} className="hidden text-[#849089] sm:block" /></div>
          </div>
        </header>
        <main className="min-h-[calc(100vh-72px)] min-w-0 p-4 sm:p-7 lg:p-9"><div className="mx-auto min-w-0 max-w-[1440px]"><Outlet /></div></main>
      </div>
    </div>
  );
}

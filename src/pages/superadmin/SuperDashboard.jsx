import { ArrowUpRight, Building2, CircleDollarSign, CreditCard, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MetricCard, PageHeader, StatusBadge } from '../../components/AdminUI';
import { useAppData } from '../../context/AppDataContext';
import { currency, shortDate } from '../../lib/format';
import { getTenantCommission, summarizeOrders } from '../../lib/finance';

export default function SuperDashboard() {
  const { tenants, orders, platformSettings } = useAppData();
  const activeMarkets = tenants.filter((tenant) => tenant.status === 'Active').length;
  const marketData = tenants.map((tenant) => {
    const summary = summarizeOrders(orders.filter((order) => order.tenantId === tenant.id), getTenantCommission(tenant, platformSettings));
    const received = Math.min(Number(tenant.repassedAmount || 0), summary.platformFee);
    return { tenant, summary, received, due: Math.max(0, summary.platformFee - received) };
  });
  const gmv = marketData.reduce((sum, item) => sum + item.summary.totalCollected, 0);
  const commission = marketData.reduce((sum, item) => sum + item.summary.platformFee, 0);
  const received = marketData.reduce((sum, item) => sum + item.received, 0);
  const completedCount = marketData.reduce((sum, item) => sum + item.summary.completedCount, 0);
  const pending = marketData.filter((item) => item.due > 0);
  const maxOrders = Math.max(...tenants.map((tenant) => orders.filter((order) => order.tenantId === tenant.id && order.status === 'delivered').length), 1);

  return (
    <div className="animate-enter">
      <PageHeader eyebrow="Visão executiva" title="Sua operação em um só lugar" description="Acompanhe vendas, receita da plataforma e a saúde financeira de cada mercado em tempo real.">
        <Link to="/superadmin/markets" className="btn-accent"><Building2 size={17} />Novo mercado</Link>
      </PageHeader>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Faturamento entregue" value={currency(gmv)} detail={`${completedCount} entregas concluídas`} icon={TrendingUp} />
        <MetricCard label="Receita sobre vendas" value={currency(commission)} detail="Soma dos acordos individuais" icon={CircleDollarSign} tone="coral" />
        <MetricCard label="Repasses recebidos" value={currency(received)} detail="Comissões já confirmadas" icon={CreditCard} tone="green" />
        <MetricCard label="Mercados ativos" value={`${activeMarkets}/${tenants.length}`} detail={`${pending.length} com repasse pendente`} icon={Building2} tone="blue" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_.85fr]">
        <section className="panel p-5 sm:p-7">
          <div className="mb-7 flex items-start justify-between">
            <div><h2 className="font-display text-lg font-extrabold tracking-[-0.03em]">Performance por mercado</h2><p className="mt-1 text-xs text-[#7a8780]">Pedidos processados no período</p></div>
            <span className="rounded-full bg-[#edf1ee] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#5b6b62]">Setembro</span>
          </div>
          <div className="space-y-6">
            {tenants.map((tenant) => {
              const marketOrders = orders.filter((order) => order.tenantId === tenant.id);
              const delivered = marketOrders.filter((order) => order.status === 'delivered');
              const marketGmv = summarizeOrders(marketOrders, getTenantCommission(tenant, platformSettings)).totalCollected;
              const width = Math.max(6, (delivered.length / maxOrders) * 100);
              return (
                <div key={tenant.id}>
                  <div className="mb-2.5 flex items-center justify-between gap-3"><div><p className="text-sm font-extrabold">{tenant.name}</p><p className="text-[11px] text-[#849089]">{delivered.length} entregas concluídas</p></div><p className="text-sm font-extrabold">{currency(marketGmv)}</p></div>
                  <div className="h-2 overflow-hidden rounded-full bg-[#edf0ed]"><div className="h-full rounded-full bg-[#ff5a36] transition-all" style={{ width: `${width}%` }} /></div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="overflow-hidden rounded-[24px] bg-[#17251f] text-white shadow-sm">
          <div className="border-b border-white/10 p-6"><div className="flex items-center justify-between"><div><p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#a6d17b]">Atenção necessária</p><h2 className="mt-2 font-display text-xl font-extrabold">Cobranças pendentes</h2></div><span className="grid h-10 w-10 place-items-center rounded-2xl bg-white/10 text-[#ff8b70]"><CreditCard size={19} /></span></div></div>
          <div className="divide-y divide-white/10">
            {pending.length ? pending.map((item) => <div key={item.tenant.id} className="flex items-center justify-between gap-3 px-6 py-4"><div><p className="text-sm font-bold">{item.tenant.name}</p><p className="mt-1 text-[11px] text-white/45">{item.summary.completedCount} entregas concluídas</p></div><p className="text-sm font-extrabold text-[#ffb09d]">{currency(item.due)}</p></div>) : <p className="p-6 text-sm text-white/50">Nenhum repasse pendente.</p>}
          </div>
          <Link to="/superadmin/billing" className="m-4 flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-extrabold text-[#17251f] transition hover:bg-[#fffaf3]">Abrir financeiro <ArrowUpRight size={16} /></Link>
        </section>
      </div>

      <section className="panel mt-6 overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#e8ebe9] px-5 py-5 sm:px-7"><div><h2 className="font-display text-lg font-extrabold">Mercados recentes</h2><p className="mt-1 text-xs text-[#7f8c85]">Ambientes criados na plataforma</p></div><Link to="/superadmin/markets" className="text-xs font-extrabold text-[#ff5a36]">Ver todos</Link></div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left"><thead><tr className="bg-[#fafaf8] text-[10px] uppercase tracking-[0.12em] text-[#85918b]"><th className="px-7 py-3.5">Mercado</th><th className="px-5 py-3.5">Endereço digital</th><th className="px-5 py-3.5">Acordo</th><th className="px-5 py-3.5">Status</th><th className="px-7 py-3.5 text-right">Criado em</th></tr></thead><tbody className="divide-y divide-[#edf0ed]">
            {tenants.map((tenant) => { const agreement = getTenantCommission(tenant, platformSettings); return <tr key={tenant.id} className="text-sm"><td className="px-7 py-4"><p className="font-extrabold">{tenant.name}</p><p className="mt-0.5 text-[11px] text-[#89948f]">{tenant.login}</p></td><td className="px-5 py-4 font-medium text-[#5d6c64]">{tenant.subdomain}.cesta.app</td><td className="px-5 py-4"><span className="rounded-lg bg-[#eef1ee] px-2.5 py-1 text-xs font-bold">{agreement.commissionRate}% · {agreement.commissionMode === 'product' ? 'produto' : 'compra'}</span></td><td className="px-5 py-4"><StatusBadge status={tenant.status} /></td><td className="px-7 py-4 text-right text-xs text-[#77847d]">{shortDate(tenant.createdAt)}</td></tr>; })}
          </tbody></table>
        </div>
      </section>
    </div>
  );
}

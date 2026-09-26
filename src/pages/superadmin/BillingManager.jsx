import { Check, CheckCircle2, CircleDollarSign, Clock3, Copy, CreditCard, Landmark } from 'lucide-react';
import { useState } from 'react';
import { MetricCard, PageHeader } from '../../components/AdminUI';
import { useAppData } from '../../context/AppDataContext';
import { currency, shortDate } from '../../lib/format';
import { getTenantCommission, summarizeOrders } from '../../lib/finance';

export default function BillingManager() {
  const { tenants, orders, platformSettings, updateTenant } = useAppData();
  const [copied, setCopied] = useState(false);

  const settlements = tenants.map((tenant) => {
    const summary = summarizeOrders(
      orders.filter((order) => order.tenantId === tenant.id),
      getTenantCommission(tenant, platformSettings),
    );
    const paid = Math.min(Number(tenant.repassedAmount || 0), summary.platformFee);
    return { tenant, summary, paid, due: Math.max(0, summary.platformFee - paid) };
  });
  const gmv = settlements.reduce((sum, item) => sum + item.summary.totalCollected, 0);
  const generated = settlements.reduce((sum, item) => sum + item.summary.platformFee, 0);
  const received = settlements.reduce((sum, item) => sum + item.paid, 0);
  const pending = settlements.reduce((sum, item) => sum + item.due, 0);

  const copyPix = async () => {
    await navigator.clipboard?.writeText(platformSettings.pixKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const markPaid = ({ tenant, summary }) => updateTenant(tenant.id, {
    repassedAmount: summary.platformFee,
    lastRepassAt: new Date().toISOString().slice(0, 10),
    status: 'Active',
  });

  return (
    <div className="animate-enter">
      <PageHeader eyebrow="Controle financeiro" title="Repasses sobre pedidos" description="Acompanhe a comissão gerada pelas entregas concluídas e confirme os valores repassados por cada mercado." />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Receita gerada" value={currency(generated)} detail="Comissão de pedidos entregues" icon={CircleDollarSign} />
        <MetricCard label="Repasses recebidos" value={currency(received)} detail="Valores já confirmados" icon={CheckCircle2} tone="green" />
        <MetricCard label="Total pendente" value={currency(pending)} detail={`${settlements.filter((item) => item.due > 0).length} mercado(s) com saldo`} icon={Clock3} tone="coral" />
        <MetricCard label="Faturamento entregue" value={currency(gmv)} detail="Vendas concluídas na rede" icon={Landmark} tone="blue" />
      </div>

      <div className="mb-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="panel overflow-hidden">
          <div className="border-b border-[#e8ebe9] px-5 py-5 sm:px-6"><h2 className="font-display text-lg font-extrabold">Fechamento por mercado</h2><p className="mt-1 text-xs text-[#7b8881]">Valores calculados exclusivamente a partir dos pedidos entregues.</p></div>
          <div className="divide-y divide-[#edf0ed] md:hidden">
            {settlements.map((item) => <article key={item.tenant.id} className="p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-extrabold">{item.tenant.name}</p><p className="mt-0.5 text-[10px] text-[#849089]">{item.summary.completedCount} entregas · {currency(item.summary.totalCollected)} faturados</p></div><p className="text-sm font-extrabold text-[#d45235]">{currency(item.due)}</p></div><div className="mt-3 grid grid-cols-2 gap-2 rounded-2xl bg-[#f4f5f2] p-3 text-xs"><div><p className="text-[#849089]">Comissão gerada</p><p className="mt-1 font-extrabold">{currency(item.summary.platformFee)}</p></div><div><p className="text-[#849089]">Já repassado</p><p className="mt-1 font-extrabold text-[#527441]">{currency(item.paid)}</p></div></div>{item.due > 0 ? <button onClick={() => markPaid(item)} className="btn-primary mt-3 w-full py-2.5"><Check size={14} />Confirmar repasse</button> : <p className="mt-3 text-center text-xs font-extrabold text-[#527441]">Repasse em dia{item.tenant.lastRepassAt ? ` · ${shortDate(item.tenant.lastRepassAt)}` : ''}</p>}</article>)}
          </div>
          <div className="hidden overflow-x-auto md:block"><table className="w-full min-w-[820px] text-left"><thead><tr className="bg-[#fafaf8] text-[10px] uppercase tracking-[0.12em] text-[#85918b]"><th className="px-6 py-3.5">Mercado</th><th className="px-5 py-3.5">Faturamento</th><th className="px-5 py-3.5">Comissão gerada</th><th className="px-5 py-3.5">Recebido</th><th className="px-5 py-3.5">Pendente</th><th className="px-6 py-3.5 text-right">Ação</th></tr></thead><tbody className="divide-y divide-[#edf0ed]">
            {settlements.map((item) => <tr key={item.tenant.id} className="text-sm"><td className="px-6 py-4"><p className="font-extrabold">{item.tenant.name}</p><p className="mt-0.5 text-[10px] text-[#8a958f]">{item.summary.completedCount} entregas concluídas</p></td><td className="px-5 py-4 font-bold">{currency(item.summary.totalCollected)}</td><td className="px-5 py-4 font-extrabold">{currency(item.summary.platformFee)}</td><td className="px-5 py-4 font-bold text-[#527441]">{currency(item.paid)}</td><td className="px-5 py-4 font-extrabold text-[#d45235]">{currency(item.due)}</td><td className="px-6 py-4 text-right">{item.due > 0 ? <button onClick={() => markPaid(item)} className="inline-flex items-center gap-1.5 rounded-xl bg-[#e8f3df] px-3 py-2 text-xs font-extrabold text-[#426239] transition hover:bg-[#dcefd0]"><Check size={14} />Confirmar repasse</button> : <span className="text-[11px] font-bold text-[#6f7d75]">Em dia{item.tenant.lastRepassAt ? ` · ${shortDate(item.tenant.lastRepassAt)}` : ''}</span>}</td></tr>)}
          </tbody></table></div>
        </section>

        <aside className="rounded-[24px] bg-[#17251f] p-6 text-white">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#ff5a36]"><CreditCard size={20} /></span>
          <p className="mt-6 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#a6d17b]">Recebimento Pix</p>
          <h2 className="mt-2 font-display text-xl font-extrabold">Dados para o repasse</h2>
          <p className="mt-2 text-sm leading-relaxed text-white/55">Estes dados aparecem para mercados que possuem comissão pendente.</p>
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.06] p-4"><p className="text-[9px] font-bold uppercase tracking-wider text-white/40">Chave Pix</p><p className="mt-1 break-all text-sm font-extrabold">{platformSettings.pixKey}</p><button onClick={copyPix} className="mt-4 flex items-center gap-2 text-xs font-extrabold text-[#ff9279]">{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? 'Chave copiada' : 'Copiar chave'}</button></div>
          <div className="mt-4"><p className="text-[9px] font-bold uppercase tracking-wider text-white/40">Favorecido</p><p className="mt-1 text-sm font-bold">{platformSettings.receiverName}</p></div>
        </aside>
      </div>
    </div>
  );
}

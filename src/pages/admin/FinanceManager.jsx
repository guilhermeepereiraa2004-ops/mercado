import { CircleDollarSign, Download, Percent, ReceiptText, TrendingUp, Truck } from 'lucide-react';
import { MetricCard, PageHeader } from '../../components/AdminUI';
import { useAppData } from '../../context/AppDataContext';
import { currency, shortDate } from '../../lib/format';
import { getOrderPlatformFee } from '../../lib/finance';

export default function FinanceManager() {
  const { tenantOrders, finances, commissionAgreement } = useAppData();
  const completed = tenantOrders.filter((order) => order.status === 'delivered');

  const exportCsv = () => {
    const rows = [['Pedido', 'Data', 'Cliente', 'Subtotal', 'Repasse', 'Entrega', 'Total'], ...completed.map((order) => [order.id, order.createdAt, order.customer, order.subtotal, getOrderPlatformFee(order, commissionAgreement), order.deliveryFee, order.total])];
    const csv = rows.map((row) => row.join(';')).join('\n');
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    link.download = 'financeiro-mercado.csv';
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="animate-enter">
      <PageHeader eyebrow="Saúde financeira" title="Financeiro" description="Veja o faturamento das entregas concluídas e o valor acumulado a repassar ao administrador master."><button onClick={exportCsv} className="btn-secondary"><Download size={16} />Exportar CSV</button></PageHeader>
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Faturamento entregue" value={currency(finances.totalCollected)} detail={`${finances.completedCount} pedidos concluídos`} icon={TrendingUp} />
        <MetricCard label="Receita de entregas" value={currency(finances.deliveryRevenue)} detail="Taxas pagas pelos clientes" icon={Truck} tone="blue" />
        <MetricCard label="Total a repassar" value={currency(finances.amountDue)} detail={`${commissionAgreement.commissionRate}% · ${commissionAgreement.commissionMode === 'product' ? 'acréscimo nos produtos' : 'sobre cada compra'}`} icon={Percent} tone="coral" />
        <MetricCard label="Receita líquida" value={currency(finances.netRevenue)} detail="Após o repasse ao master" icon={CircleDollarSign} tone="green" />
      </div>

      <div className="grid min-w-0 gap-5 2xl:grid-cols-[minmax(0,1fr)_340px]">
        <section className="panel overflow-hidden">
          <div className="border-b border-[#e8ebe9] px-5 py-5 sm:px-6"><h2 className="font-display text-lg font-extrabold">Pedidos faturados</h2><p className="mt-1 text-xs text-[#7c8982]">Somente entregas concluídas entram no resultado.</p></div>
          <div className="divide-y divide-[#edf0ed] sm:hidden">{completed.map((order) => { const fee = getOrderPlatformFee(order, commissionAgreement); return <article key={order.id} className="p-4"><div className="flex items-center justify-between"><div><p className="font-mono text-[10px] font-extrabold text-[#75827b]">{order.id}</p><p className="mt-1 text-sm font-extrabold">{order.customer}</p></div><p className="text-sm font-extrabold">{currency(order.total)}</p></div><div className="mt-3 flex items-center justify-between rounded-xl bg-[#f3f5f2] p-3 text-xs"><span className="text-[#748179]">Repasse: <strong className="text-[#d45235]">{currency(fee)}</strong></span><span className="font-extrabold text-[#527441]">Líquido {currency(order.total - fee)}</span></div></article>; })}</div>
          <div className="hidden overflow-x-auto sm:block"><table className="w-full min-w-[620px] table-fixed text-left"><thead><tr className="bg-[#fafaf8] text-[9px] uppercase tracking-[0.1em] text-[#85918b]"><th className="w-[13%] px-4 py-3.5">Pedido</th><th className="w-[27%] px-3 py-3.5">Cliente</th><th className="w-[17%] px-3 py-3.5">Data</th><th className="w-[14%] px-3 py-3.5 text-right">Venda</th><th className="w-[14%] px-3 py-3.5 text-right">Repasse</th><th className="w-[15%] px-4 py-3.5 text-right">Líquido</th></tr></thead><tbody className="divide-y divide-[#edf0ed]">{completed.map((order) => { const fee = getOrderPlatformFee(order, commissionAgreement); return <tr key={order.id} className="text-xs"><td className="break-words px-4 py-4 font-mono text-[11px] font-extrabold text-[#65736b]">{order.id}</td><td className="px-3 py-4 font-extrabold leading-snug">{order.customer}</td><td className="px-3 py-4 text-[11px] leading-snug text-[#748179]">{shortDate(order.createdAt)}</td><td className="whitespace-nowrap px-3 py-4 text-right font-bold">{currency(order.total)}</td><td className="whitespace-nowrap px-3 py-4 text-right font-extrabold text-[#d45235]">{currency(fee)}</td><td className="whitespace-nowrap px-4 py-4 text-right font-extrabold text-[#527441]">{currency(order.total - fee)}</td></tr>; })}</tbody></table></div>
        </section>

        <aside className="h-fit rounded-[24px] bg-[#17251f] p-6 text-white">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#ff5a36]"><ReceiptText size={20} /></span><p className="mt-6 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#a6d17b]">Total a repassar</p><h2 className="mt-2 font-display text-3xl font-extrabold text-[#ff9a83]">{currency(finances.amountDue)}</h2><p className="mt-1 text-xs text-white/45">Saldo pendente com o administrador master</p>
          <div className="mt-7 space-y-3 border-t border-white/10 pt-5 text-sm"><div className="flex justify-between gap-3 text-white/55"><span>Total recebido</span><span className="font-bold text-white">{currency(finances.totalCollected)}</span></div><div className="flex justify-between gap-3 text-white/55"><span>Produtos base</span><span className="font-bold text-white">{currency(finances.baseProductRevenue)}</span></div><div className="flex justify-between gap-3 text-white/55"><span>Entregas</span><span className="font-bold text-white">{currency(finances.deliveryRevenue)}</span></div><div className="flex justify-between gap-3 border-t border-white/10 pt-3 text-white/55"><span>Líquido do mercado</span><span className="font-bold text-[#a6d17b]">{currency(finances.netRevenue)}</span></div></div>
        </aside>
      </div>
    </div>
  );
}

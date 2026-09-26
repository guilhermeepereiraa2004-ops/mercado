import { useState } from 'react';
import { AlertTriangle, ArrowRight, Box, Check, CircleDollarSign, Clock3, Copy, Landmark, Package, Percent, ReceiptText, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MetricCard, Modal, PageHeader } from '../../components/AdminUI';
import { useAppData } from '../../context/AppDataContext';
import { currency, orderAge } from '../../lib/format';

const statusLabel = { new: 'Novo', preparing: 'Em preparo', route: 'Em rota', delivered: 'Entregue' };
const statusStyle = { new: 'bg-[#fff0e9] text-[#b54d31]', preparing: 'bg-[#fff3d9] text-[#8a6419]', route: 'bg-[#e3eff5] text-[#37677c]', delivered: 'bg-[#e8f3df] text-[#426239]' };

export default function Dashboard() {
  const { activeTenant, products, tenantOrders, finances, platformSettings, commissionAgreement } = useAppData();
  const newOrders = tenantOrders.filter((order) => order.status === 'new').length;
  const lowStock = products.filter((product) => product.stock > 0 && product.stock <= 20).length;
  const salesBars = [44, 61, 51, 74, 68, 92, 79];
  const [showPaymentInstructions, setShowPaymentInstructions] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyPix = async () => {
    await navigator.clipboard?.writeText(platformSettings.pixKey);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="animate-enter">
      {activeTenant?.status === 'Past Due' && finances.amountDue > 0 && <div className="mb-6 flex flex-col gap-3 rounded-[20px] border border-[#f0caa0] bg-[#fff5e9] p-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex min-w-0 items-start gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-[14px] bg-[#f6d9b7] text-[#93551a]"><AlertTriangle size={19} /></span><div className="min-w-0"><p className="text-sm font-extrabold text-[#704116]">Repasse pendente de {currency(finances.amountDue)}</p><p className="mt-0.5 break-words text-xs leading-relaxed text-[#98652f]">Regularize via Pix: <strong className="break-all">{platformSettings.pixKey}</strong> · {platformSettings.receiverName}</p></div></div><button onClick={() => setShowPaymentInstructions(true)} className="btn-secondary w-full border-[#ebc08f] bg-white/60 py-2 text-[#81501f] sm:w-auto">Ver instruções</button></div>}
      <PageHeader eyebrow="Bom dia, Mara" title={`Visão geral do ${activeTenant?.settings?.logoText || activeTenant?.name}`} description="Acompanhe o ritmo da operação e saiba onde agir agora.">
        <Link to="/admin/orders" className="btn-primary"><ReceiptText size={17} />Abrir pedidos{newOrders > 0 && <span className="rounded-full bg-[#ff5a36] px-2 py-0.5 text-[10px]">{newOrders}</span>}</Link>
      </PageHeader>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Receita líquida" value={currency(finances.netRevenue)} detail={`Já descontada a taxa de ${commissionAgreement.commissionRate}%`} icon={CircleDollarSign} />
        <MetricCard label="Pedidos" value={finances.ordersCount} detail={`${newOrders} aguardando confirmação`} icon={ShoppingBag} tone="coral" />
        <MetricCard label="Total a repassar" value={currency(finances.amountDue)} detail={`${commissionAgreement.commissionRate}% · ${commissionAgreement.commissionMode === 'product' ? 'nos produtos' : 'por compra'}`} icon={Percent} tone="green" />
        <MetricCard label="Estoque" value={`${products.length} itens`} detail={`${lowStock} com estoque baixo`} icon={Package} tone="blue" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_.85fr]">
        <section className="panel p-5 sm:p-7">
          <div className="mb-8 flex items-start justify-between"><div><h2 className="font-display text-lg font-extrabold">Vendas da semana</h2><p className="mt-1 text-xs text-[#7c8982]">Desempenho diário do faturamento</p></div><div className="rounded-xl bg-[#eef1ee] px-3 py-2 text-xs font-extrabold">Últimos 7 dias</div></div>
          <div className="flex h-[230px] items-end gap-2 sm:gap-4">{salesBars.map((height, index) => <div key={index} className="flex h-full flex-1 flex-col justify-end gap-3"><div className="group relative flex flex-1 items-end rounded-xl bg-[#f0f2ef]"><div className="w-full rounded-xl bg-[#17251f] transition hover:bg-[#ff5a36]" style={{ height: `${height}%` }}><span className="absolute -top-6 left-1/2 hidden -translate-x-1/2 text-[10px] font-bold group-hover:block">{height}%</span></div></div><span className="text-center text-[10px] font-extrabold uppercase text-[#89948f]">{['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'][index]}</span></div>)}</div>
        </section>

        <section className="panel overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#e9ecea] px-6 py-5"><div><h2 className="font-display text-lg font-extrabold">Pedidos recentes</h2><p className="mt-1 text-xs text-[#7c8982]">Atualização em tempo real</p></div><Link to="/admin/orders" className="grid h-9 w-9 place-items-center rounded-xl bg-[#eff1ee]"><ArrowRight size={16} /></Link></div>
          <div className="divide-y divide-[#edf0ed]">{tenantOrders.slice(0, 5).map((order) => <div key={order.id} className="flex items-center gap-3 px-6 py-4"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-[14px] bg-[#f0f2ef] text-[#526159]"><Box size={17} /></span><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-2"><p className="truncate text-sm font-extrabold">{order.customer}</p><p className="shrink-0 text-sm font-extrabold">{currency(order.total)}</p></div><div className="mt-1 flex items-center justify-between"><p className="flex items-center gap-1 text-[10px] text-[#8a958f]"><Clock3 size={11} />{orderAge(order.createdAt)}</p><span className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase ${statusStyle[order.status]}`}>{statusLabel[order.status]}</span></div></div></div>)}</div>
        </section>
      </div>

      {showPaymentInstructions && <Modal title="Instruções para repasse" description="Confira os dados antes de realizar o pagamento." onClose={() => setShowPaymentInstructions(false)} width="max-w-xl">
        <div className="p-5 sm:p-6">
          <div className="rounded-[20px] bg-[#17251f] p-5 text-white"><div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-[15px] bg-[#ff5a36]"><Landmark size={19} /></span><div><p className="text-[9px] font-extrabold uppercase tracking-[0.18em] text-white/45">Valor pendente</p><p className="mt-1 font-display text-2xl leading-none text-[#ff9a83]">{currency(finances.amountDue)}</p></div></div><p className="mt-5 border-t border-white/10 pt-4 text-xs leading-relaxed text-white/60">{platformSettings.paymentInstructions || 'Realize o pagamento pela chave Pix e envie o comprovante para confirmação.'}</p></div>
          <div className="mt-4 rounded-[18px] border border-[#e1e5e1] bg-[#fafbf9] p-4"><p className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#8a958f]">Chave Pix</p><div className="mt-2 flex items-center gap-2"><p className="min-w-0 flex-1 break-all text-sm font-extrabold text-[#26372f]">{platformSettings.pixKey}</p><button onClick={copyPix} className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-[#526159] shadow-sm ring-1 ring-[#dfe3df]" aria-label="Copiar chave Pix">{copied ? <Check size={17} className="text-[#527441]" /> : <Copy size={17} />}</button></div>{copied && <p className="mt-2 text-[10px] font-extrabold text-[#527441]">Chave Pix copiada.</p>}</div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2"><div className="rounded-[16px] bg-[#f2f4f1] p-4"><p className="text-[9px] font-extrabold uppercase tracking-wider text-[#8a958f]">Favorecido</p><p className="mt-1.5 text-xs font-extrabold">{platformSettings.receiverName}</p></div><div className="rounded-[16px] bg-[#f2f4f1] p-4"><p className="text-[9px] font-extrabold uppercase tracking-wider text-[#8a958f]">Enviar comprovante</p><p className="mt-1.5 break-all text-xs font-extrabold">{platformSettings.supportEmail}</p></div></div>
          <button onClick={() => setShowPaymentInstructions(false)} className="btn-primary mt-5 w-full">Entendi</button>
        </div>
      </Modal>}
    </div>
  );
}

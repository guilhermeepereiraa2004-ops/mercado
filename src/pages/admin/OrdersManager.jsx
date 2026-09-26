import { useCallback, useEffect, useRef, useState } from 'react';
import { BellRing, ChevronRight, Clock3, MapPin, PackageCheck, ShoppingBag, Truck, Volume2, VolumeX } from 'lucide-react';
import { Modal, PageHeader } from '../../components/AdminUI';
import { useAppData } from '../../context/AppDataContext';
import { currency, orderAge, shortTime } from '../../lib/format';

const columns = [
  { id: 'new', label: 'Novos pedidos', icon: BellRing, color: '#ff5a36', next: 'preparing', nextLabel: 'Aceitar pedido' },
  { id: 'preparing', label: 'Em preparo', icon: ShoppingBag, color: '#d69b2d', next: 'route', nextLabel: 'Saiu para entrega' },
  { id: 'route', label: 'Em rota', icon: Truck, color: '#4a829a', next: 'delivered', nextLabel: 'Marcar entregue' },
  { id: 'delivered', label: 'Entregues', icon: PackageCheck, color: '#658d50', next: null, nextLabel: null },
];

function playChime() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  const context = new AudioContext();
  [0, 0.16].forEach((delay, index) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.value = index ? 880 : 660;
    gain.gain.setValueAtTime(0.0001, context.currentTime + delay);
    gain.gain.exponentialRampToValueAtTime(0.18, context.currentTime + delay + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + delay + 0.28);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(context.currentTime + delay);
    oscillator.stop(context.currentTime + delay + 0.3);
  });
}

export default function OrdersManager() {
  const { tenantOrders, updateOrderStatus } = useAppData();
  const [soundEnabled, setSoundEnabled] = useState(() => localStorage.getItem('cesta_order_sound') === 'on');
  const [selected, setSelected] = useState(null);
  const previousNew = useRef(tenantOrders.filter((order) => order.status === 'new').map((order) => order.id));

  useEffect(() => {
    const current = tenantOrders.filter((order) => order.status === 'new').map((order) => order.id);
    const hasFreshOrder = current.some((id) => !previousNew.current.includes(id));
    if (soundEnabled && hasFreshOrder) playChime();
    previousNew.current = current;
  }, [tenantOrders, soundEnabled]);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    localStorage.setItem('cesta_order_sound', next ? 'on' : 'off');
    if (next) playChime();
  };

  const onDrop = useCallback((event, status) => {
    event.preventDefault();
    const id = event.dataTransfer.getData('text/order-id');
    if (id) updateOrderStatus(id, status);
  }, [updateOrderStatus]);

  return (
    <div className="animate-enter">
      <PageHeader eyebrow="Operação em tempo real" title="Pedidos" description="Arraste os cards entre as etapas ou use as ações rápidas para atualizar cada entrega.">
        <button onClick={toggleSound} className={soundEnabled ? 'btn-primary' : 'btn-secondary'}>{soundEnabled ? <Volume2 size={17} /> : <VolumeX size={17} />}{soundEnabled ? 'Som ativo' : 'Ativar som'}</button>
      </PageHeader>

      <div className="mb-5 flex items-start gap-2.5 rounded-2xl border border-[#dfe4e0] bg-white px-4 py-3 text-xs leading-relaxed text-[#65736b]"><span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${soundEnabled ? 'bg-[#6e9c57] animate-pulse' : 'bg-[#b5bdb8]'}`} /><p><strong className="text-[#26372f]">Notificação de novos pedidos: </strong>{soundEnabled ? 'ativa neste navegador' : 'clique em “Ativar som” para permitir o alerta sonoro'}</p></div>

      <div className="hide-scrollbar flex snap-x snap-mandatory items-start gap-4 overflow-x-auto pb-3 xl:grid xl:grid-cols-4 xl:overflow-visible xl:pb-0">
        {columns.map((column) => {
          const Icon = column.icon;
          const orders = tenantOrders.filter((order) => order.status === column.id);
          return (
            <section key={column.id} onDragOver={(event) => event.preventDefault()} onDrop={(event) => onDrop(event, column.id)} className="min-h-[420px] w-[84vw] max-w-[350px] shrink-0 snap-start rounded-[22px] border border-[#dfe3df] bg-[#eceeea]/70 p-3 sm:w-[360px] xl:w-auto xl:max-w-none xl:shrink">
              <div className="mb-3 flex items-center justify-between px-1 py-1"><div className="flex items-center gap-2"><span className="grid h-8 w-8 place-items-center rounded-xl text-white" style={{ backgroundColor: column.color }}><Icon size={15} /></span><h2 className="text-xs font-extrabold">{column.label}</h2></div><span className="grid h-6 min-w-6 place-items-center rounded-full bg-white px-1 text-[10px] font-black text-[#64726a]">{orders.length}</span></div>
              <div className="space-y-3">
                {orders.map((order) => <article key={order.id} draggable onDragStart={(event) => event.dataTransfer.setData('text/order-id', order.id)} onClick={() => setSelected(order)} className="cursor-grab rounded-[18px] border border-[#e1e5e2] bg-white p-4 shadow-[0_2px_8px_rgba(20,40,30,.04)] transition hover:-translate-y-0.5 hover:shadow-lg active:cursor-grabbing">
                  <div className="flex items-center justify-between"><span className="font-mono text-[10px] font-extrabold text-[#7d8983]">{order.id}</span><span className="flex items-center gap-1 text-[10px] font-bold text-[#8a958f]"><Clock3 size={11} />{orderAge(order.createdAt)}</span></div>
                  <h3 className="mt-3 text-sm font-extrabold">{order.customer}</h3>
                  <p className="mt-1 flex items-center gap-1 text-[10px] text-[#849089]"><MapPin size={11} />{order.address.split('·')[0]}</p>
                  <div className="my-3 h-px bg-[#edf0ed]" />
                  <div className="flex items-center justify-between"><span className="text-[11px] font-bold text-[#69776f]">{order.items.reduce((sum, item) => sum + item.qty, 0)} itens · {order.payment}</span><span className="text-sm font-extrabold">{currency(order.total)}</span></div>
                  {column.next && <button onClick={(event) => { event.stopPropagation(); updateOrderStatus(order.id, column.next); }} className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#17251f] px-3 py-2.5 text-[11px] font-extrabold text-white transition hover:bg-[#ff5a36]">{column.nextLabel}<ChevronRight size={13} /></button>}
                </article>)}
                {!orders.length && <div className="rounded-[18px] border border-dashed border-[#ccd3ce] p-6 text-center"><p className="text-[11px] font-bold text-[#909a95]">Solte um pedido aqui</p></div>}
              </div>
            </section>
          );
        })}
      </div>

      {selected && <Modal title={`${selected.id} · ${selected.customer}`} description={`Pedido recebido às ${shortTime(selected.createdAt)}`} onClose={() => setSelected(null)}>
        <div className="p-6">
          <div className="grid gap-3 rounded-2xl bg-[#f4f5f2] p-4 text-xs sm:grid-cols-2"><div><p className="text-[#8a958f]">Entrega</p><p className="mt-1 font-bold">{selected.address}</p></div><div><p className="text-[#8a958f]">Contato</p><p className="mt-1 font-bold">{selected.phone}</p></div><div><p className="text-[#8a958f]">Pagamento</p><p className="mt-1 font-bold">{selected.payment}</p></div><div><p className="text-[#8a958f]">Status</p><p className="mt-1 font-bold">{columns.find((column) => column.id === selected.status)?.label}</p></div></div>
          <h3 className="mb-3 mt-6 text-xs font-extrabold uppercase tracking-wider text-[#76837c]">Itens do pedido</h3>
          <div className="divide-y divide-[#edf0ed]">{selected.items.map((item, index) => <div key={`${item.productId}-${index}`} className="flex items-center justify-between py-3 text-sm"><div className="flex items-center gap-3"><span className="grid h-8 w-8 place-items-center rounded-xl bg-[#eef1ee] text-xs font-extrabold">{item.qty}×</span><span className="font-bold">{item.name}</span></div><span className="font-extrabold">{currency(item.price * item.qty)}</span></div>)}</div>
          <div className="mt-4 space-y-2 border-t border-[#dfe3df] pt-4 text-sm"><div className="flex justify-between text-[#6f7d75]"><span>Subtotal</span><span>{currency(selected.subtotal)}</span></div><div className="flex justify-between text-[#6f7d75]"><span>Entrega</span><span>{selected.deliveryFee ? currency(selected.deliveryFee) : 'Grátis'}</span></div><div className="flex justify-between pt-1 font-display text-lg font-extrabold"><span>Total</span><span>{currency(selected.total)}</span></div></div>
        </div>
      </Modal>}
    </div>
  );
}

import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Beef, Check, CheckCircle2, ChevronRight, Clock3, Cookie, Croissant, CupSoda, Leaf, Menu, Milk, Minus, Package, Plus, Search, ShieldCheck, ShoppingBag, Trash2, Truck, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StoreBrand } from '../components/Brand';
import { Modal } from '../components/AdminUI';
import { useAppData } from '../context/AppDataContext';
import { currency } from '../lib/format';
import { roundMoney } from '../lib/finance';

const iconMap = { Leaf, Package, Beef, Milk, Croissant, CupSoda, Cookie };
const initialCheckout = { customer: '', phone: '', address: '', payment: 'Pix' };

function ProductCard({ product, variants, category, cartItem, onAdd, onUpdate, onChoose }) {
  const hasVariants = variants.length > 1;
  const discount = !hasVariants && product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;
  const [imageFailed, setImageFailed] = useState(false);
  const CategoryIcon = iconMap[category?.icon] || Package;
  return (
    <article onClick={hasVariants ? onChoose : undefined} className={`group flex h-full flex-col overflow-hidden rounded-[26px] border border-[#e3e3dd] bg-white p-2.5 transition duration-300 hover:-translate-y-1.5 hover:border-[#cfd4cf] hover:shadow-[0_24px_60px_rgba(25,42,33,.13)] sm:p-3 ${hasVariants ? 'cursor-pointer' : ''}`}>
      <div className="relative aspect-[1.18] overflow-hidden rounded-[21px] bg-[#eef1ed]">
        {!imageFailed ? (
          <img src={product.img} alt={product.name} loading="lazy" onError={() => setImageFailed(true)} className="h-full w-full object-cover saturate-[.92] contrast-[1.04] transition duration-700 ease-out group-hover:scale-[1.065] group-hover:saturate-110" />
        ) : (
          <div className="relative grid h-full w-full place-items-center overflow-hidden" style={{ backgroundColor: category?.color || '#e8eee9' }}>
            <span className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/35" />
            <span className="absolute -bottom-14 -left-10 h-40 w-40 rounded-full bg-[#17251f]/5" />
            <div className="relative text-center text-[#405349]"><span className="mx-auto grid h-16 w-16 place-items-center rounded-[22px] bg-white/65 shadow-sm backdrop-blur"><CategoryIcon size={28} strokeWidth={1.5} /></span><p className="mt-3 max-w-[150px] text-[10px] font-extrabold uppercase tracking-[0.14em] opacity-65">{category?.name || 'Produto'}</p></div>
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 rounded-[21px] ring-1 ring-inset ring-white/35" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0f1d17]/45 via-[#0f1d17]/5 to-transparent opacity-70" />
        {discount > 0 && <span className="absolute left-3 top-3 rounded-full bg-[#ff5a36] px-2.5 py-1.5 text-[10px] font-extrabold text-white shadow-[0_5px_15px_rgba(255,90,54,.3)]">−{discount}%</span>}
        {hasVariants && <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-[#ff5a36] px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.08em] text-white shadow-[0_5px_15px_rgba(255,90,54,.3)]"><Package size={12} />Escolha a marca</span>}
        <span className="absolute bottom-3 left-3 rounded-full border border-white/25 bg-[#17251f]/65 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.12em] text-white backdrop-blur-md">{category?.name || 'Mercado'}</span>
        {hasVariants ? <button onClick={(event) => { event.stopPropagation(); onChoose(); }} className="absolute bottom-3 right-3 flex h-11 items-center gap-1.5 rounded-[15px] bg-white px-3.5 text-[10px] font-extrabold uppercase tracking-wide text-[#17251f] shadow-[0_8px_20px_rgba(12,27,19,.22)] transition hover:scale-105 hover:bg-[var(--store-accent)] hover:text-white">Ver opções <ChevronRight size={15} /></button> : cartItem ? <div className="absolute bottom-3 right-3 flex h-10 items-center rounded-[14px] bg-white text-[#17251f] shadow-lg"><button onClick={() => onUpdate(product.id, -1)} className="grid h-full w-9 place-items-center" aria-label="Diminuir"><Minus size={14} /></button><span className="min-w-5 text-center text-xs font-black">{cartItem.qty}</span><button onClick={() => onUpdate(product.id, 1)} className="grid h-full w-9 place-items-center" aria-label="Aumentar"><Plus size={14} /></button></div> : <button onClick={() => onAdd(product)} disabled={product.stock === 0} className="absolute bottom-3 right-3 grid h-11 w-11 place-items-center rounded-[15px] bg-white text-[#17251f] shadow-[0_8px_20px_rgba(12,27,19,.22)] transition hover:scale-105 hover:bg-[var(--store-accent)] hover:text-white disabled:bg-[#ccd2ce]" aria-label="Adicionar ao carrinho"><Plus size={19} strokeWidth={2.4} /></button>}
      </div>
      <div className="flex flex-1 flex-col px-2 pb-2 pt-4 sm:px-2.5">
        <h3 className="line-clamp-2 min-h-11 text-[15px] font-extrabold leading-[1.35] text-[#1d2d25] sm:text-base">{product.name}</h3>
        {hasVariants ? <div className="mt-2 flex items-center gap-2 rounded-xl bg-[#fff2ed] px-3 py-2 text-[#b7492f]"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-white"><Package size={13} /></span><p className="text-[10px] font-extrabold leading-tight">Escolha entre {variants.length} marcas e preços</p></div> : <p className="mt-1.5 text-[11px] font-medium text-[#89958f]">{product.unit}</p>}
        <div className="mt-auto flex items-end justify-between gap-2 pt-5">
          <div>{product.oldPrice && <p className="mb-0.5 text-[10px] font-bold text-[#a0a8a4] line-through">{currency(product.oldPrice)}</p>}{hasVariants && <p className="mb-1 text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#89958f]">A partir de</p>}<p className="font-display text-[21px] leading-none tracking-[-0.02em]">{currency(product.price)}</p></div>
          <span className="hidden text-[9px] font-bold uppercase tracking-[0.12em] text-[#9aa39e] min-[460px]:block">{hasVariants ? 'Clique para escolher' : 'Em estoque'}</span>
        </div>
      </div>
    </article>
  );
}

export default function Store() {
  const { activeTenant, products, categories, productGroups: registeredProductGroups, createOrder, commissionAgreement } = useAppData();
  const settings = activeTenant?.settings || {};
  const cartKey = `cesta_cart_${activeTenant?.id}`;
  const [cart, setCart] = useState(() => { try { return JSON.parse(localStorage.getItem(cartKey)) || []; } catch { return []; } });
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState(null);
  const [checkout, setCheckout] = useState(initialCheckout);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('all');
  const [toast, setToast] = useState('');
  const [cartPulse, setCartPulse] = useState(0);

  useEffect(() => { localStorage.setItem(cartKey, JSON.stringify(cart)); }, [cart, cartKey]);

  const customerProducts = useMemo(() => products.map((product) => {
    const productMarkup = commissionAgreement.commissionMode === 'product';
    const multiplier = productMarkup ? 1 + Number(commissionAgreement.commissionRate || 0) / 100 : 1;
    return {
      ...product,
      basePrice: Number(product.price),
      price: roundMoney(Number(product.price) * multiplier),
      oldPrice: product.oldPrice ? roundMoney(Number(product.oldPrice) * multiplier) : null,
    };
  }), [products, commissionAgreement.commissionMode, commissionAgreement.commissionRate]);
  const productGroups = useMemo(() => {
    const groups = new Map();
    customerProducts.forEach((product) => {
      const registeredGroup = registeredProductGroups.find((group) => group.id === product.groupId)
        || registeredProductGroups.find((group) => group.name.toLocaleLowerCase('pt-BR') === product.groupName?.trim().toLocaleLowerCase('pt-BR'));
      const groupName = registeredGroup?.name || product.groupName?.trim();
      const key = registeredGroup?.id || (groupName ? `${product.categoryId}:${groupName.toLocaleLowerCase('pt-BR')}` : `sku:${product.id}`);
      if (!groups.has(key)) groups.set(key, { key, name: groupName || product.name, categoryId: product.categoryId, variants: [] });
      groups.get(key).variants.push(product);
    });
    return [...groups.values()].map((group) => {
      const variants = [...group.variants].sort((a, b) => a.price - b.price);
      return { ...group, variants, product: { ...variants[0], name: group.name } };
    });
  }, [customerProducts, registeredProductGroups]);
  const filtered = useMemo(() => productGroups.filter((group) => {
    const searchable = `${group.name} ${group.variants.map((item) => `${item.name} ${item.brand || ''}`).join(' ')}`.toLowerCase();
    return (categoryId === 'all' || group.categoryId === categoryId) && searchable.includes(search.toLowerCase());
  }), [productGroups, categoryId, search]);
  const categoryCounts = useMemo(() => Object.fromEntries(categories.map((category) => [category.id, productGroups.filter((group) => group.categoryId === category.id).length])), [categories, productGroups]);
  const maxCategoryCount = Math.max(1, ...Object.values(categoryCounts));
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const deliveryFee = subtotal >= 120 || subtotal === 0 ? 0 : 7.9;
  const total = subtotal + deliveryFee;
  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);

  useEffect(() => {
    setCart((current) => current.map((item) => {
      const currentProduct = customerProducts.find((product) => product.id === item.id);
      return currentProduct ? { ...item, ...currentProduct, qty: item.qty } : item;
    }));
  }, [customerProducts]);

  const flash = (message) => { setToast(message); window.setTimeout(() => setToast(''), 2400); };
  const add = (product) => {
    setCart((current) => { const found = current.find((item) => item.id === product.id); return found ? current.map((item) => item.id === product.id ? { ...item, qty: Math.min(item.qty + 1, product.stock) } : item) : [...current, { ...product, qty: 1 }]; });
    setCartPulse((value) => value + 1);
    flash(`${product.name} adicionado`);
  };
  const update = (id, amount) => setCart((current) => current.map((item) => item.id === id ? { ...item, qty: item.qty + amount } : item).filter((item) => item.qty > 0));
  const goProducts = () => document.getElementById('produtos')?.scrollIntoView({ behavior: 'smooth' });

  const placeOrder = (event) => {
    event.preventDefault();
    const baseSubtotal = roundMoney(cart.reduce((sum, item) => sum + Number(item.basePrice ?? item.price) * item.qty, 0));
    const platformFee = commissionAgreement.commissionMode === 'product'
      ? roundMoney(subtotal - baseSubtotal)
      : roundMoney(baseSubtotal * (Number(commissionAgreement.commissionRate || 0) / 100));
    const order = createOrder({
      ...checkout, subtotal, baseSubtotal, platformFee, deliveryFee, total,
      commissionMode: commissionAgreement.commissionMode,
      commissionRate: Number(commissionAgreement.commissionRate || 0),
      items: cart.map((item) => ({ productId: item.id, name: item.name, qty: item.qty, price: item.price, basePrice: item.basePrice ?? item.price })),
    });
    setCompletedOrder(order);
    setCart([]);
    setCheckout(initialCheckout);
    setCheckoutOpen(false);
    setCartOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#fffaf3] text-[#17251f]" style={{ '--store-accent': settings.accent || '#ff5a36' }}>
      <header className="sticky top-0 z-40 border-b border-[#ece8df] bg-[#fffaf3]/92 backdrop-blur-xl">
        <div className="mx-auto flex h-[68px] min-w-0 max-w-[1320px] items-center gap-2.5 px-3 sm:h-[74px] sm:gap-4 sm:px-6">
          <button className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[#e1ded6] lg:hidden" onClick={() => setMenuOpen(true)} aria-label="Abrir menu"><Menu size={19} /></button>
          <div className="min-w-0 flex-1 md:flex-none"><StoreBrand name={settings.logoText || activeTenant?.name} accent={settings.accent} logoUrl={settings.logoUrl} /></div>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-[1320px] px-4 pb-8 pt-5 sm:px-6 sm:pt-7">
          <div className="relative grid min-w-0 overflow-hidden rounded-[24px] bg-[#eee9df] sm:rounded-[30px] lg:min-h-[510px] lg:grid-cols-[1.05fr_.95fr]">
            <div className="relative z-10 flex min-w-0 flex-col justify-center p-6 sm:p-12 lg:p-16">
              <div className="mb-7 inline-flex w-fit items-center gap-3 rounded-full border border-white/80 bg-white/75 px-4 py-2.5 shadow-[0_8px_30px_rgba(23,37,31,.06)] backdrop-blur"><span className="h-0.5 w-5 rounded-full" style={{ backgroundColor: settings.accent }} /><span className="font-display text-[15px] leading-none tracking-[0.055em]" style={{ color: settings.accent }}>{settings.heroEyebrow}</span></div>
              <h1 className="max-w-full break-words font-display text-[clamp(2.75rem,13vw,5.25rem)] leading-[.92] tracking-[-0.025em]">{settings.heroTitle}</h1>
              <p className="mt-6 max-w-lg text-sm leading-relaxed text-[#617067] sm:text-base">{settings.heroDescription}</p>
              <div className="mt-8 flex flex-wrap gap-3"><button onClick={goProducts} className="flex items-center gap-2 rounded-[15px] px-5 py-3.5 text-sm font-extrabold text-white shadow-lg transition hover:-translate-y-0.5" style={{ backgroundColor: settings.accent }}>Comprar agora <ArrowRight size={17} /></button><div className="flex items-center gap-2 rounded-[15px] bg-white/75 px-4 py-3 text-xs font-bold backdrop-blur"><Clock3 size={17} style={{ color: settings.accent }} /><span><strong className="block text-[#17251f]">{settings.deliveryTime}</strong><span className="text-[#76837c]">tempo médio</span></span></div></div>
            </div>
            <div className="relative min-h-[270px] sm:min-h-[310px] lg:min-h-full"><img src="/mercado_hero.png" alt="Seleção de frutas e verduras frescas" className="absolute inset-0 h-full w-full object-cover object-center" /><div className="absolute inset-0 hidden bg-gradient-to-r from-[#eee9df] via-transparent to-transparent lg:block" /><div className="absolute bottom-4 left-4 right-4 flex min-w-0 items-center justify-between gap-4 rounded-[20px] border border-white/60 bg-white/90 p-4 shadow-[0_18px_50px_rgba(23,37,31,.18)] backdrop-blur-xl sm:bottom-6 sm:left-auto sm:right-6 sm:w-[310px] sm:p-5"><div className="min-w-0"><p className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#7c8982]">Escolha do mercado</p><p className="mt-1.5 font-display text-[18px] leading-[1.05] tracking-[-0.01em] text-[#17251f] sm:text-[20px]">Frescor selecionado todos os dias</p></div><span className="grid h-11 w-11 shrink-0 place-items-center rounded-[15px] bg-[#e8f3df] text-[#547545]"><Leaf size={20} /></span></div></div>
          </div>
          <div className="relative z-10 mx-3 -mt-3 grid gap-px overflow-hidden rounded-[22px] border border-[#e5e3dc] bg-[#e5e3dc] shadow-sm sm:grid-cols-3 lg:mx-10"><div className="flex items-center gap-3 bg-white p-4"><Truck size={20} style={{ color: settings.accent }} /><div><p className="text-xs font-extrabold">Entrega rápida</p><p className="text-[10px] text-[#85918b]">Acompanhe cada etapa</p></div></div><div className="flex items-center gap-3 bg-white p-4"><ShieldCheck size={20} style={{ color: settings.accent }} /><div><p className="text-xs font-extrabold">Compra protegida</p><p className="text-[10px] text-[#85918b]">Pagamento seguro</p></div></div><div className="flex items-center gap-3 bg-white p-4"><CheckCircle2 size={20} style={{ color: settings.accent }} /><div><p className="text-xs font-extrabold">Qualidade garantida</p><p className="text-[10px] text-[#85918b]">Só o melhor chega até você</p></div></div></div>
        </section>

        <section id="produtos" className="scroll-mt-32 py-10 sm:py-14">
          <div className="mx-auto max-w-[1320px] px-4 sm:px-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-[10px] font-extrabold uppercase tracking-[0.2em]" style={{ color: settings.accent }}>Compre por categoria</p><h2 className="mt-2 font-display text-[38px] leading-none sm:text-[50px]">Tudo para a sua casa</h2></div><p className="max-w-md text-sm leading-relaxed text-[#748179]">Produtos selecionados, preços honestos e uma compra que cabe na sua rotina.</p></div>
            <div className="relative mt-7 max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#849089]" size={17} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full rounded-[16px] border border-[#e0e3df] bg-white py-3.5 pl-11 pr-11 text-sm outline-none transition focus:border-[var(--store-accent)] focus:ring-4 focus:ring-[#ff5a36]/10"
                placeholder="O que você procura hoje?"
              />
              {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-lg bg-[#eff1ee] text-[#68766f]" aria-label="Limpar busca"><X size={13} /></button>}
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2.5 min-[480px]:grid-cols-3 sm:gap-3 lg:grid-cols-4 xl:grid-cols-7">
              <button
                onClick={() => setCategoryId('all')}
                aria-pressed={categoryId === 'all'}
                className={`group flex min-h-[142px] min-w-0 flex-col rounded-[19px] border bg-white p-3.5 text-left shadow-[0_2px_0_rgba(23,37,31,.04)] transition duration-200 sm:min-h-[148px] sm:rounded-[21px] sm:p-4 ${categoryId === 'all' ? 'border-[#17251f] -translate-y-0.5 shadow-[0_10px_24px_rgba(23,37,31,.11)]' : 'border-[#e4e5e1] hover:-translate-y-0.5 hover:border-[#cbd0cc] hover:shadow-[0_10px_24px_rgba(23,37,31,.08)]'}`}
              >
                <span className="grid h-10 w-10 place-items-center rounded-[14px] bg-[#e9efeb] text-[#30453a] transition-transform duration-200 group-hover:scale-105"><ShoppingBag size={18} strokeWidth={1.9} /></span>
                <div className="mt-4">
                  <h3 className="font-display text-[16px] leading-none">Todos</h3>
                  <p className="mt-1.5 text-[10px] font-medium text-[#87938d]">{products.length} produtos cadastrados</p>
                </div>
                <span className="mt-auto block h-1.5 w-full overflow-hidden rounded-full bg-[#e9eeeb]"><span className="block h-full w-full rounded-full" style={{ backgroundColor: categoryId === 'all' ? settings.accent : '#17251f' }} /></span>
              </button>
              {categories.map((category) => {
                const Icon = iconMap[category.icon] || Package;
                const count = categoryCounts[category.id] || 0;
                const selected = categoryId === category.id;
                return (
                  <button
                    key={category.id}
                    onClick={() => setCategoryId(selected ? 'all' : category.id)}
                    aria-pressed={selected}
                    className={`group flex min-h-[142px] min-w-0 flex-col rounded-[19px] border bg-white p-3.5 text-left shadow-[0_2px_0_rgba(23,37,31,.04)] transition duration-200 sm:min-h-[148px] sm:rounded-[21px] sm:p-4 ${selected ? 'border-[#17251f] -translate-y-0.5 shadow-[0_10px_24px_rgba(23,37,31,.11)]' : 'border-[#e4e5e1] hover:-translate-y-0.5 hover:border-[#cbd0cc] hover:shadow-[0_10px_24px_rgba(23,37,31,.08)]'}`}
                  >
                    <span className="grid h-10 w-10 place-items-center rounded-[14px] text-[#30453a] transition-transform duration-200 group-hover:scale-105" style={{ backgroundColor: category.color }}><Icon size={18} strokeWidth={1.9} /></span>
                    <div className="mt-4">
                      <h3 className="font-display text-[16px] leading-none">{category.name}</h3>
                      <p className="mt-1.5 text-[10px] font-medium text-[#87938d]">{count} {count === 1 ? 'produto cadastrado' : 'produtos cadastrados'}</p>
                    </div>
                    <span className="mt-auto block h-1.5 w-full overflow-hidden rounded-full bg-[#e9eeeb]">
                      <span className="block h-full rounded-full transition-all duration-300" style={{ width: `${Math.max(10, (count / maxCategoryCount) * 100)}%`, backgroundColor: selected ? settings.accent : '#17251f' }} />
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="mt-7 flex items-center justify-between"><p className="text-xs font-bold text-[#7d8983]"><strong className="text-[#17251f]">{filtered.length}</strong> produtos encontrados</p>{(search || categoryId !== 'all') && <button onClick={() => { setSearch(''); setCategoryId('all'); }} className="text-xs font-extrabold" style={{ color: settings.accent }}>Mostrar todos</button>}</div>
            {filtered.length ? <div className="mt-5 grid grid-cols-1 gap-3 min-[430px]:grid-cols-2 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">{filtered.map((group) => <ProductCard key={group.key} product={group.product} variants={group.variants} category={categories.find((item) => item.id === group.categoryId)} cartItem={group.variants.length === 1 ? cart.find((item) => item.id === group.product.id) : null} onAdd={add} onUpdate={update} onChoose={() => setSelectedVariants(group)} />)}</div> : <div className="mt-6 rounded-[24px] border border-dashed border-[#cfd5d1] py-20 text-center"><Search className="mx-auto text-[#9ba49f]" /><h3 className="mt-4 font-display text-lg font-extrabold">Nada por aqui ainda</h3><p className="mt-1 text-sm text-[#7f8b85]">Tente buscar outro produto ou categoria.</p></div>}
          </div>
        </section>

        <section className="mx-auto max-w-[1320px] px-4 pb-14 pt-4 sm:px-6"><div className="relative overflow-hidden rounded-[24px] bg-[#17251f] p-6 text-white sm:rounded-[28px] sm:p-12"><div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#ff5a36]/20" /><div className="relative max-w-2xl"><p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#a6d17b]">Compromisso {settings.logoText}</p><h2 className="mt-3 break-words font-display text-[34px] leading-[.96] sm:text-[52px]">Sua compra bem cuidada, do clique à entrega.</h2><p className="mt-4 text-sm leading-relaxed text-white/55">Se algo não chegar como você esperava, fale com a gente. Nosso time resolve de verdade.</p><p className="mt-6 text-sm font-extrabold" style={{ color: '#ff8e75' }}>{settings.whatsapp}</p></div></div></section>
      </main>

      <footer className="border-t border-[#e8e4dc] bg-white"><div className="mx-auto flex max-w-[1320px] flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between"><StoreBrand name={settings.logoText || activeTenant?.name} accent={settings.accent} logoUrl={settings.logoUrl} /><p className="text-xs text-[#849089]">© 2026 {activeTenant?.name}. Todos os direitos reservados.</p><div className="flex gap-4 text-xs font-bold text-[#68766f]"><Link to="/admin">Painel do mercado</Link><Link to="/superadmin">Admin master</Link></div></div></footer>

      {menuOpen && <div className="fixed inset-0 z-50 lg:hidden"><button className="absolute inset-0 bg-[#17251f]/50 backdrop-blur-sm" onClick={() => setMenuOpen(false)} /><aside className="relative h-full w-[290px] max-w-[88vw] bg-[#fffaf3] p-5 shadow-2xl sm:p-6"><div className="flex min-w-0 items-center justify-between gap-3"><div className="min-w-0"><StoreBrand name={settings.logoText} accent={settings.accent} logoUrl={settings.logoUrl} /></div><button className="shrink-0" onClick={() => setMenuOpen(false)}><X size={20} /></button></div><nav className="mt-10 space-y-2"><button onClick={() => { setMenuOpen(false); goProducts(); }} className="flex w-full items-center justify-between rounded-2xl bg-white p-4 text-sm font-extrabold">Produtos <ChevronRight size={16} /></button><button onClick={() => { setMenuOpen(false); setCartOpen(true); }} className="flex w-full items-center justify-between rounded-2xl bg-white p-4 text-sm font-extrabold">Meu carrinho <span className="rounded-full bg-[#ff5a36] px-2 py-0.5 text-[10px] text-white">{itemCount}</span></button></nav></aside></div>}

      <button key={cartPulse} onClick={() => setCartOpen(true)} className={`animate-cart-pop group fixed bottom-4 right-4 z-50 flex min-h-[76px] min-w-[228px] items-center gap-3 overflow-hidden rounded-[26px] border border-[#dedfd9] bg-[#fffdf8]/95 p-2.5 pr-3 text-[#17251f] shadow-[0_20px_60px_rgba(22,38,30,.22),0_3px_10px_rgba(22,38,30,.08)] backdrop-blur-xl transition duration-300 hover:-translate-y-1.5 hover:border-[var(--store-accent)] hover:shadow-[0_28px_75px_rgba(22,38,30,.28)] sm:bottom-7 sm:right-7 ${cartOpen || menuOpen ? 'pointer-events-none translate-y-5 opacity-0' : 'translate-y-0 opacity-100'}`} aria-label={`Abrir sacola com ${itemCount} itens`}>
        <span className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
        <span className="relative grid h-14 w-14 shrink-0 place-items-center overflow-visible rounded-[19px] bg-[#17251f] text-white shadow-[0_10px_26px_rgba(23,37,31,.2)] transition-transform duration-300 group-hover:rotate-[-3deg] group-hover:scale-[1.04]"><span className="absolute inset-1 rounded-[15px] border border-white/10" /><ShoppingBag size={22} strokeWidth={1.9} />{itemCount > 0 && <span className="absolute -right-2 -top-2 grid h-6 min-w-6 place-items-center rounded-full bg-[var(--store-accent)] px-1 text-[10px] font-black text-white ring-[3px] ring-[#fffdf8]">{itemCount}</span>}</span>
        <span className="min-w-0 flex-1 text-left"><span className="block text-[9px] font-extrabold uppercase tracking-[0.18em] text-[#8a958f]">Sua sacola</span><span className="mt-1 block whitespace-nowrap text-sm font-extrabold tracking-[-0.015em]">{itemCount ? currency(subtotal) : 'Comece sua compra'}</span>{itemCount > 0 && <span className="mt-0.5 block text-[9px] font-bold text-[#89958f]">{itemCount} {itemCount === 1 ? 'item selecionado' : 'itens selecionados'}</span>}</span>
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#eef1ed] text-[#607068] transition duration-300 group-hover:bg-[var(--store-accent)] group-hover:text-white"><ChevronRight size={16} className="transition-transform group-hover:translate-x-0.5" /></span>
        <span className="absolute bottom-0 left-[86px] right-4 h-[3px] origin-left scale-x-0 rounded-full bg-[var(--store-accent)] transition-transform duration-300 group-hover:scale-x-100" />
      </button>

      <div className={`fixed inset-0 z-[60] transition duration-300 ${cartOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}><button className={`absolute inset-0 bg-[#17251f]/45 backdrop-blur-sm transition duration-300 ${cartOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setCartOpen(false)} /><aside className={`absolute right-0 top-0 flex h-full w-full max-w-[430px] flex-col bg-[#f7f5ef] shadow-2xl transition duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${cartOpen ? 'translate-x-0' : 'translate-x-full'}`}><div className="flex items-center justify-between bg-[#17251f] px-5 py-5 text-white sm:px-6 sm:py-6"><div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-[15px] bg-[var(--store-accent)] shadow-[0_8px_22px_rgba(255,90,54,.25)]"><ShoppingBag size={19} /></span><div><p className="text-[9px] font-extrabold uppercase tracking-[0.18em] text-white/45">Sua compra</p><h2 className="mt-1 font-display text-xl leading-none">Minha sacola</h2><p className="mt-1.5 text-[10px] font-bold text-white/50">{itemCount} {itemCount === 1 ? 'item selecionado' : 'itens selecionados'}</p></div></div><button onClick={() => setCartOpen(false)} className="grid h-10 w-10 place-items-center rounded-[14px] border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white"><X size={18} /></button></div>{cart.length ? <><div className="flex-1 space-y-3 overflow-y-auto p-4 sm:p-5">{cart.map((item) => <div key={item.id} className="flex gap-3 rounded-[20px] border border-[#e7e6df] bg-white p-3 shadow-[0_4px_16px_rgba(23,37,31,.04)] transition hover:border-[#d8ddd8] hover:shadow-[0_8px_24px_rgba(23,37,31,.07)]"><img src={item.img} alt="" className="h-20 w-20 rounded-[15px] bg-[#eef1ed] object-cover" /><div className="min-w-0 flex-1"><div className="flex justify-between gap-2"><div><p className="line-clamp-2 text-sm font-extrabold leading-snug">{item.name}</p><p className="mt-1 text-[10px] font-medium text-[#87938c]">{item.brand ? `${item.brand} · ` : ''}{item.unit}</p></div><button onClick={() => setCart((current) => current.filter((entry) => entry.id !== item.id))} className="grid h-8 w-8 shrink-0 place-items-center rounded-xl text-[#9a827b] transition hover:bg-[#fff0eb] hover:text-[#e25435]"><Trash2 size={14} /></button></div><div className="mt-3 flex items-center justify-between"><div className="flex items-center rounded-xl border border-[#e3e6e2] bg-[#f4f5f2]"><button onClick={() => update(item.id, -1)} className="grid h-8 w-8 place-items-center"><Minus size={13} /></button><span className="min-w-6 text-center text-xs font-black">{item.qty}</span><button onClick={() => update(item.id, 1)} className="grid h-8 w-8 place-items-center"><Plus size={13} /></button></div><p className="text-sm font-extrabold">{currency(item.price * item.qty)}</p></div></div></div>)}</div><div className="border-t border-[#e1e2dc] bg-white p-5 shadow-[0_-12px_35px_rgba(23,37,31,.05)] sm:p-6"><div className="space-y-2.5 text-sm"><div className="flex justify-between text-[#748179]"><span>Subtotal</span><span className="font-bold text-[#3d4c44]">{currency(subtotal)}</span></div><div className="flex justify-between text-[#748179]"><span>Entrega</span><span className="font-bold text-[#3d4c44]">{deliveryFee ? currency(deliveryFee) : 'Grátis'}</span></div><div className="mt-3 flex items-end justify-between border-t border-[#e8e9e4] pt-4"><span className="text-xs font-extrabold uppercase tracking-wider text-[#7b8881]">Total</span><span className="font-display text-2xl leading-none">{currency(total)}</span></div></div>{subtotal < Number(settings.minimumOrder || 0) && <p className="mt-4 rounded-xl bg-[#fff2df] p-3 text-[10px] font-bold leading-relaxed text-[#8d601f]">Pedido mínimo de {currency(settings.minimumOrder)}. Faltam {currency(settings.minimumOrder - subtotal)}.</p>}<button disabled={subtotal < Number(settings.minimumOrder || 0)} onClick={() => setCheckoutOpen(true)} className="mt-4 flex w-full items-center justify-center gap-2 rounded-[16px] bg-[#17251f] py-4 text-sm font-extrabold text-white shadow-[0_10px_25px_rgba(23,37,31,.16)] transition hover:-translate-y-0.5 hover:bg-[var(--store-accent)] disabled:translate-y-0 disabled:bg-[#c7ceca] disabled:shadow-none">Continuar para entrega <ArrowRight size={16} /></button></div></> : <div className="grid flex-1 place-items-center p-8 text-center"><div className="max-w-xs"><span className="relative mx-auto grid h-20 w-20 place-items-center rounded-[26px] bg-white text-[#50635a] shadow-[0_14px_40px_rgba(23,37,31,.1)]"><span className="absolute inset-2 rounded-[20px] border border-[#e9ece8]" /><ShoppingBag size={29} /></span><p className="mt-7 text-[9px] font-extrabold uppercase tracking-[0.2em] text-[var(--store-accent)]">Sua seleção começa aqui</p><h3 className="mt-2 font-display text-2xl leading-none">Sua sacola está vazia</h3><p className="mt-3 text-sm leading-relaxed text-[#7d8983]">Explore os produtos e escolha tudo o que precisa para sua casa.</p><button onClick={() => { setCartOpen(false); goProducts(); }} className="btn-primary mt-6 w-full">Explorar produtos <ArrowRight size={15} /></button></div></div>}</aside></div>

      {selectedVariants && <Modal title={`Escolha seu ${selectedVariants.name}`} description={`${selectedVariants.variants.length} marcas disponíveis · compare e escolha a melhor opção.`} onClose={() => setSelectedVariants(null)} width="max-w-3xl">
        <div className="max-h-[70vh] space-y-3 overflow-y-auto p-4 sm:p-6">
          {selectedVariants.variants.map((variant, index) => {
            const cartItem = cart.find((item) => item.id === variant.id);
            return <article key={variant.id} className="relative flex flex-col gap-4 rounded-[20px] border border-[#e2e6e2] bg-white p-3 transition hover:border-[#cbd3cc] hover:shadow-md sm:flex-row sm:items-center sm:p-4">
              {index === 0 && <span className="absolute left-2 top-2 z-10 rounded-full bg-[#17251f] px-2.5 py-1 text-[8px] font-extrabold uppercase tracking-wider text-white sm:left-auto sm:right-3">Menor preço</span>}
              <img src={variant.img} alt={variant.name} className="h-28 w-full rounded-[16px] bg-[#eef1ed] object-cover sm:h-24 sm:w-24 sm:shrink-0" />
              <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2">{variant.brand && <span className="rounded-lg bg-[#e8f1e4] px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider text-[#4d7043]">{variant.brand}</span>}<span className={`text-[9px] font-bold uppercase tracking-wider ${variant.stock > 0 ? 'text-[#718079]' : 'text-[#d45235]'}`}>{variant.stock > 0 ? `${variant.stock} em estoque` : 'Indisponível'}</span></div><h3 className="mt-2 text-sm font-extrabold leading-snug sm:text-base">{variant.name}</h3><p className="mt-1 text-xs text-[#849089]">{variant.unit}</p></div>
              <div className="flex items-end justify-between gap-4 border-t border-[#edf0ed] pt-3 sm:block sm:min-w-28 sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0 sm:text-right"> <div>{variant.oldPrice && <p className="text-[10px] font-bold text-[#a0a8a4] line-through">{currency(variant.oldPrice)}</p>}<p className="font-display text-xl font-extrabold">{currency(variant.price)}</p></div><button disabled={variant.stock === 0} onClick={() => { add(variant); setSelectedVariants(null); }} className="mt-2 inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-[#17251f] px-3 text-xs font-extrabold text-white transition hover:bg-[var(--store-accent)] disabled:bg-[#c7ceca]"><Plus size={14} />{cartItem ? `Adicionar mais (${cartItem.qty})` : 'Adicionar'}</button></div>
            </article>;
          })}
        </div>
      </Modal>}

      {checkoutOpen && <Modal title="Dados para entrega" description="Revise seus dados antes de confirmar o pedido." onClose={() => setCheckoutOpen(false)}>
        <form onSubmit={placeOrder} className="space-y-4 p-6"><div><label className="label">Nome completo</label><input className="field" required autoFocus value={checkout.customer} onChange={(event) => setCheckout({ ...checkout, customer: event.target.value })} placeholder="Quem vai receber?" /></div><div><label className="label">WhatsApp</label><input className="field" required value={checkout.phone} onChange={(event) => setCheckout({ ...checkout, phone: event.target.value })} placeholder="(71) 99999-9999" /></div><div><label className="label">Endereço completo</label><textarea className="field min-h-20" required value={checkout.address} onChange={(event) => setCheckout({ ...checkout, address: event.target.value })} placeholder="Rua, número, complemento e bairro" /></div><div><label className="label">Pagamento</label><div className="grid grid-cols-3 gap-2">{['Pix','Cartão','Dinheiro'].map((method) => <button type="button" key={method} onClick={() => setCheckout({ ...checkout, payment: method })} className={`rounded-xl border px-2 py-3 text-xs font-extrabold ${checkout.payment === method ? 'border-[#17251f] bg-[#17251f] text-white' : 'border-[#dde2de]'}`}>{method}</button>)}</div></div><div className="flex items-center justify-between rounded-2xl bg-[#f2f3ef] p-4"><span className="text-sm font-bold">Total do pedido</span><span className="font-display text-lg font-extrabold">{currency(total)}</span></div><button className="btn-accent w-full py-4" type="submit"><Check size={17} />Confirmar pedido</button></form>
      </Modal>}

      {completedOrder && <Modal title="Pedido confirmado!" description="O mercado já recebeu os detalhes da sua compra." onClose={() => setCompletedOrder(null)}>
        <div className="p-7 text-center"><span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#e8f3df] text-[#557747]"><Check size={28} /></span><p className="mt-5 font-mono text-xs font-extrabold text-[#7d8983]">{completedOrder.id}</p><h3 className="mt-2 font-display text-2xl font-extrabold">Agora é com a gente.</h3><p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-[#748179]">Seu pedido entrou na fila de separação. A entrega está prevista para {settings.deliveryTime}.</p><button onClick={() => setCompletedOrder(null)} className="btn-primary mt-6 w-full">Continuar comprando</button></div>
      </Modal>}

      {toast && <div className="animate-toast fixed bottom-6 left-1/2 z-[90] flex items-center gap-2 rounded-full bg-[#17251f] px-4 py-3 text-xs font-extrabold text-white shadow-xl"><Check size={14} className="text-[#a6d17b]" />{toast}</div>}
    </div>
  );
}

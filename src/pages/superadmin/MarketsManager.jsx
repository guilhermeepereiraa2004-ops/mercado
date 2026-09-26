import { useMemo, useState } from 'react';
import { Building2, ExternalLink, KeyRound, Pencil, Plus, Search, Store, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { EmptyState, Modal, PageHeader, StatusBadge } from '../../components/AdminUI';
import { useAppData } from '../../context/AppDataContext';
import { currency } from '../../lib/format';
import { getTenantCommission, summarizeOrders } from '../../lib/finance';

const initialForm = { name: '', subdomain: '', login: '', password: '', commissionMode: 'order', commissionRate: 1 };

export default function MarketsManager() {
  const { tenants, orders, platformSettings, addTenant, updateTenant, setActiveTenantId } = useAppData();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);

  const filtered = useMemo(() => tenants.filter((tenant) => {
    const text = `${tenant.name} ${tenant.subdomain} ${tenant.login}`.toLowerCase();
    return text.includes(search.toLowerCase()) && (status === 'all' || tenant.status === status);
  }), [tenants, search, status]);

  const marketSummary = (tenant) => summarizeOrders(
    orders.filter((order) => order.tenantId === tenant.id),
    getTenantCommission(tenant, platformSettings),
  );
  const openCreate = () => { setEditingId(null); setForm(initialForm); setShowModal(true); };
  const openEdit = (tenant) => {
    setEditingId(tenant.id);
    const agreement = getTenantCommission(tenant, platformSettings);
    setForm({ name: tenant.name, subdomain: tenant.subdomain, login: tenant.login || '', password: tenant.password || '', ...agreement });
    setShowModal(true);
  };

  const submit = (event) => {
    event.preventDefault();
    if ((form.login && !form.password) || (!form.login && form.password)) {
      window.alert('Preencha login e senha juntos ou deixe os dois campos vazios para acesso livre.');
      return;
    }
    if (editingId) updateTenant(editingId, form); else addTenant(form);
    setForm(initialForm);
    setEditingId(null);
    setShowModal(false);
  };

  const changeName = (name) => setForm((current) => ({
    ...current,
    name,
    subdomain: editingId ? current.subdomain : name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '').slice(0, 24),
  }));

  const manage = (id) => {
    setActiveTenantId(id);
    sessionStorage.setItem(`cesta_admin_authenticated_${id}`, 'master');
    navigate('/admin');
  };

  return (
    <div className="animate-enter">
      <PageHeader eyebrow="Rede de mercados" title="Mercados e acessos" description="Acompanhe o faturamento entregue, configure credenciais e gerencie cada operação.">
        <button onClick={openCreate} className="btn-accent"><Plus size={17} />Novo mercado</button>
      </PageHeader>

      <div className="panel overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-[#e7ebe8] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="relative w-full sm:max-w-sm"><Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#89958f]" size={17} /><input className="field pl-10" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar mercado, domínio ou login" /></div>
          <div className="flex w-full rounded-[14px] bg-[#eff1ee] p-1 sm:w-auto">{[['all','Todos'],['Active','Ativos'],['Past Due','Pendentes']].map(([value,label]) => <button key={value} onClick={() => setStatus(value)} className={`flex-1 rounded-[11px] px-3 py-2 text-xs font-extrabold transition sm:flex-none ${status === value ? 'bg-white text-[#17251f] shadow-sm' : 'text-[#77847d]'}`}>{label}</button>)}</div>
        </div>

        {filtered.length ? <>
          <div className="divide-y divide-[#e8ece9] md:hidden">{filtered.map((tenant) => { const summary = marketSummary(tenant); const agreement = getTenantCommission(tenant, platformSettings); const amountDue = Math.max(0, summary.platformFee - Number(tenant.repassedAmount || 0)); return <article key={tenant.id} className="p-4"><div className="flex items-start justify-between gap-3"><div className="flex min-w-0 items-center gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-[14px] bg-[#e8f1e4] font-brand font-black text-[#45633c]">{tenant.name.charAt(0)}</span><div className="min-w-0"><p className="truncate text-sm font-extrabold">{tenant.name}</p><p className="truncate text-[10px] text-[#849089]">{tenant.subdomain}.cesta.app</p></div></div><StatusBadge status={tenant.status} /></div><div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl bg-[#f4f5f2] p-3"><div><p className="text-[9px] font-bold uppercase tracking-wider text-[#8a958f]">Faturamento entregue</p><p className="mt-1 text-sm font-extrabold">{currency(summary.totalCollected)}</p></div><div><p className="text-[9px] font-bold uppercase tracking-wider text-[#8a958f]">Receita master</p><p className="mt-1 text-sm font-extrabold text-[#d45235]">{currency(summary.platformFee)}</p></div></div><p className="mt-3 text-[10px] font-bold text-[#77847d]">Acordo: {agreement.commissionRate}% · {agreement.commissionMode === 'product' ? 'acréscimo por produto' : 'percentual por compra'} · {currency(amountDue)} pendente</p><div className="mt-3 flex gap-2"><button onClick={() => manage(tenant.id)} className="btn-primary flex-1 py-2.5"><ExternalLink size={14} />Gerenciar</button><button onClick={() => openEdit(tenant)} className="grid h-11 w-11 place-items-center rounded-xl border border-[#dfe3df]"><Pencil size={15} /></button></div></article>; })}</div>
          <div className="hidden overflow-x-auto md:block"><table className="w-full min-w-[1050px] text-left"><thead><tr className="bg-[#fafaf8] text-[10px] uppercase tracking-[0.12em] text-[#85918b]"><th className="px-6 py-3.5">Mercado</th><th className="px-5 py-3.5">Acesso</th><th className="px-5 py-3.5">Faturamento entregue</th><th className="px-5 py-3.5">Receita master</th><th className="px-5 py-3.5">Status</th><th className="px-6 py-3.5 text-right">Ações</th></tr></thead><tbody className="divide-y divide-[#edf0ed]">
            {filtered.map((tenant) => { const summary = marketSummary(tenant); const agreement = getTenantCommission(tenant, platformSettings); const amountDue = Math.max(0, summary.platformFee - Number(tenant.repassedAmount || 0)); return <tr key={tenant.id} className="group text-sm transition hover:bg-[#fbfbf8]"><td className="px-6 py-4"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-[14px] bg-[#e8f1e4] font-brand font-black text-[#45633c]">{tenant.name.charAt(0)}</span><div><p className="font-extrabold">{tenant.name}</p><p className="mt-0.5 text-[11px] text-[#849089]">{tenant.subdomain}.cesta.app</p></div></div></td><td className="px-5 py-4">{tenant.login && tenant.password ? <><p className="text-xs font-bold">{tenant.login}</p><p className="mt-1 flex items-center gap-1 text-[10px] text-[#8b9690]"><KeyRound size={11} />••••••••</p></> : <span className="rounded-full bg-[#e8f3df] px-2.5 py-1 text-[10px] font-extrabold uppercase text-[#426239]">Acesso livre</span>}</td><td className="px-5 py-4"><p className="font-extrabold">{currency(summary.totalCollected)}</p><p className="text-[10px] text-[#849089]">{summary.completedCount} entregas</p></td><td className="px-5 py-4"><p className="font-extrabold text-[#d45235]">{currency(summary.platformFee)}</p><p className="text-[10px] text-[#849089]">{currency(amountDue)} pendente · {agreement.commissionRate}% {agreement.commissionMode === 'product' ? 'por produto' : 'por compra'}</p></td><td className="px-5 py-4"><StatusBadge status={tenant.status} /></td><td className="px-6 py-4"><div className="flex justify-end gap-2"><button onClick={() => manage(tenant.id)} className="btn-secondary py-2"><ExternalLink size={14} />Gerenciar</button><button onClick={() => openEdit(tenant)} className="grid h-9 w-9 place-items-center rounded-xl border border-[#dfe3df] text-[#77847d] hover:text-[#17251f]" title="Editar mercado"><Pencil size={15} /></button><button onClick={() => updateTenant(tenant.id, { status: tenant.status === 'Active' ? 'Past Due' : 'Active' })} className="grid h-9 w-9 place-items-center rounded-xl border border-[#dfe3df] text-[#77847d] transition hover:border-[#ff5a36] hover:text-[#ff5a36]" title="Alterar status">{tenant.status === 'Active' ? <XCircle size={16} /> : <Store size={16} />}</button></div></td></tr>; })}
          </tbody></table></div>
        </> : <EmptyState icon={Building2} title="Nenhum mercado encontrado" description="Ajuste os filtros ou crie um novo ambiente." />}
      </div>

      {showModal && <Modal title={editingId ? 'Editar mercado e acesso' : 'Criar novo mercado'} description="Login e senha são opcionais. Se ambos ficarem vazios, o painel terá acesso livre." onClose={() => setShowModal(false)} width="max-w-2xl">
        <form onSubmit={submit} className="grid gap-5 p-4 sm:grid-cols-2 sm:p-6">
          <div className="sm:col-span-2"><label className="label">Nome do mercado</label><input required autoFocus className="field" value={form.name} onChange={(event) => changeName(event.target.value)} placeholder="Ex.: Mercado Boa Praça" /></div>
          <div className="sm:col-span-2"><label className="label">Subdomínio</label><div className="flex min-w-0"><input required className="field min-w-0 rounded-r-none" value={form.subdomain} onChange={(event) => setForm({ ...form, subdomain: event.target.value.toLowerCase().replace(/[^a-z0-9]/g, '') })} /><span className="flex shrink-0 items-center rounded-r-[14px] border border-l-0 border-[#dde2de] bg-[#f2f4f1] px-3 text-[10px] font-bold text-[#748179] sm:px-4 sm:text-xs">.cesta.app</span></div></div>
          <div><label className="label">Login do administrador <span className="font-normal text-[#9aa39e]">(opcional)</span></label><input type="email" className="field" value={form.login} onChange={(event) => setForm({ ...form, login: event.target.value })} placeholder="admin@mercado.com" /></div>
          <div><label className="label">Senha <span className="font-normal text-[#9aa39e]">(opcional)</span></label><input minLength="6" type="text" className="field" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="Mínimo de 6 caracteres" /></div>
          <div className="sm:col-span-2 rounded-[20px] border border-[#e1e5e1] bg-[#fafbf9] p-4 sm:p-5">
            <div className="mb-4"><p className="text-sm font-extrabold">Acordo comercial deste mercado</p><p className="mt-1 text-xs leading-relaxed text-[#7c8982]">Defina individualmente como a receita do master será calculada neste estabelecimento.</p></div>
            <div className="grid gap-3 sm:grid-cols-2">
              <button type="button" onClick={() => setForm({ ...form, commissionMode: 'product' })} className={`rounded-2xl border p-4 text-left transition ${form.commissionMode === 'product' ? 'border-[#17251f] bg-[#17251f] text-white shadow-lg' : 'border-[#dfe3df] bg-white hover:border-[#aeb8b2]'}`}><p className="text-sm font-extrabold">Acréscimo por produto</p><p className={`mt-1.5 text-[11px] leading-relaxed ${form.commissionMode === 'product' ? 'text-white/55' : 'text-[#7c8982]'}`}>Cada produto recebe o acréscimo definido, destinado ao master.</p></button>
              <button type="button" onClick={() => setForm({ ...form, commissionMode: 'order' })} className={`rounded-2xl border p-4 text-left transition ${form.commissionMode === 'order' ? 'border-[#17251f] bg-[#17251f] text-white shadow-lg' : 'border-[#dfe3df] bg-white hover:border-[#aeb8b2]'}`}><p className="text-sm font-extrabold">Percentual por compra</p><p className={`mt-1.5 text-[11px] leading-relaxed ${form.commissionMode === 'order' ? 'text-white/55' : 'text-[#7c8982]'}`}>Os preços não mudam e o mercado repassa parte do subtotal.</p></button>
            </div>
            <div className="mt-4 max-w-xs"><label className="label">Porcentagem acordada</label><div className="relative"><input required className="field pr-12 text-base font-extrabold" type="number" min="0" max="100" step="0.1" value={form.commissionRate} onChange={(event) => setForm({ ...form, commissionRate: Number(event.target.value) })} /><span className="absolute right-4 top-1/2 -translate-y-1/2 font-extrabold text-[#7a8780]">%</span></div></div>
          </div>
          <div className="sm:col-span-2 flex flex-col-reverse gap-2 border-t border-[#edf0ed] pt-5 sm:flex-row sm:justify-end"><button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button><button className="btn-accent" type="submit">{editingId ? <Pencil size={16} /> : <Plus size={16} />}{editingId ? 'Salvar alterações' : 'Criar mercado'}</button></div>
        </form>
      </Modal>}
    </div>
  );
}

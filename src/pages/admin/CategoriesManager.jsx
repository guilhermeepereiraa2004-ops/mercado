import { useMemo, useState } from 'react';
import { Beef, Cookie, Croissant, CupSoda, Leaf, Milk, Package, Pencil, Plus, Search, Shapes, Trash2 } from 'lucide-react';
import { EmptyState, Modal, PageHeader } from '../../components/AdminUI';
import { useAppData } from '../../context/AppDataContext';

const icons = { Leaf, Package, Beef, Milk, Croissant, CupSoda, Cookie };
const colors = ['#e8f3df', '#f4ead7', '#f8dfdd', '#e2eef8', '#e9e5f8', '#fde8dc'];

export default function CategoriesManager() {
  const { categories, products, addCategory, updateCategory, deleteCategory } = useAppData();
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', icon: 'Package', color: colors[0] });
  const filtered = useMemo(() => categories.filter((item) => item.name.toLowerCase().includes(search.toLowerCase())), [categories, search]);

  const open = (category) => { setEditingId(category?.id || null); setForm(category ? { name: category.name, icon: category.icon, color: category.color } : { name: '', icon: 'Package', color: colors[0] }); setModal(true); };
  const submit = (event) => { event.preventDefault(); if (editingId) updateCategory(editingId, form); else addCategory(form); setModal(false); };
  const remove = (category) => { const count = products.filter((item) => item.categoryId === category.id).length; if (count) return window.alert('Mova os produtos desta categoria antes de removê-la.'); if (window.confirm(`Remover a categoria “${category.name}”?`)) deleteCategory(category.id); };

  return (
    <div className="animate-enter">
      <PageHeader eyebrow="Organização do catálogo" title="Categorias" description="Crie uma navegação simples para seus clientes encontrarem tudo mais rápido."><button onClick={() => open()} className="btn-accent"><Plus size={17} />Nova categoria</button></PageHeader>
      <div className="panel mb-6 p-4"><div className="relative max-w-sm"><Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8a958f]" size={17} /><input className="field pl-10" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar categoria" /></div></div>
      {filtered.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{filtered.map((category) => { const Icon = icons[category.icon] || Package; const count = products.filter((item) => item.categoryId === category.id).length; return <article key={category.id} className="panel group p-5 transition hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(20,40,30,.08)]"><div className="flex items-start justify-between"><span className="grid h-12 w-12 place-items-center rounded-[17px] text-[#33483d]" style={{ backgroundColor: category.color }}><Icon size={21} /></span><div className="flex opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100"><button onClick={() => open(category)} className="grid h-8 w-8 place-items-center rounded-lg text-[#7a8780] hover:bg-[#eff1ee]"><Pencil size={14} /></button><button onClick={() => remove(category)} className="grid h-8 w-8 place-items-center rounded-lg text-[#a07b73] hover:bg-[#fff0eb] hover:text-[#dc5133]"><Trash2 size={14} /></button></div></div><h2 className="mt-5 font-display text-lg font-extrabold">{category.name}</h2><p className="mt-1 text-xs text-[#849089]">{count} {count === 1 ? 'produto' : 'produtos'} cadastrados</p><div className="mt-5 h-1.5 overflow-hidden rounded-full bg-[#edf0ed]"><div className="h-full rounded-full bg-[#17251f]" style={{ width: `${Math.min(100, count * 12)}%` }} /></div></article>; })}</div> : <div className="panel"><EmptyState icon={Shapes} title="Nenhuma categoria encontrada" description="Crie uma categoria para começar a organizar o catálogo." /></div>}

      {modal && <Modal title={editingId ? 'Editar categoria' : 'Nova categoria'} description="Escolha um nome, ícone e cor para a vitrine." onClose={() => setModal(false)}>
        <form onSubmit={submit} className="p-6"><label className="label">Nome da categoria</label><input className="field" autoFocus required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Ex.: Carnes" />
          <label className="label mt-5">Ícone</label><div className="grid grid-cols-7 gap-2">{Object.entries(icons).map(([name, Icon]) => <button type="button" key={name} onClick={() => setForm({ ...form, icon: name })} className={`grid aspect-square place-items-center rounded-xl border transition ${form.icon === name ? 'border-[#ff5a36] bg-[#fff0e9] text-[#ff5a36]' : 'border-[#dfe3df] text-[#718078] hover:bg-[#f5f6f4]'}`}><Icon size={18} /></button>)}</div>
          <label className="label mt-5">Cor</label><div className="flex gap-2">{colors.map((color) => <button type="button" key={color} onClick={() => setForm({ ...form, color })} className={`h-9 w-9 rounded-xl transition ${form.color === color ? 'ring-2 ring-[#17251f] ring-offset-2' : ''}`} style={{ backgroundColor: color }} aria-label={`Cor ${color}`} />)}</div>
          <div className="mt-6 flex justify-end gap-2 border-t border-[#edf0ed] pt-5"><button type="button" className="btn-secondary" onClick={() => setModal(false)}>Cancelar</button><button className="btn-accent" type="submit">Salvar categoria</button></div>
        </form>
      </Modal>}
    </div>
  );
}

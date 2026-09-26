import { useMemo, useState } from 'react';
import { AlertTriangle, Boxes, Eye, Image, Package, Pencil, Plus, Search, Star, Trash2 } from 'lucide-react';
import { EmptyState, Modal, PageHeader } from '../../components/AdminUI';
import { useAppData } from '../../context/AppDataContext';
import { currency } from '../../lib/format';

const emptyProduct = { name: '', groupId: '', brand: '', unit: '', price: '', oldPrice: '', categoryId: '', img: '', stock: 0, featured: false };
const emptyGroup = { name: '', categoryId: '' };
const normalize = (value = '') => value.trim().toLocaleLowerCase('pt-BR');

export default function ProductsManager() {
  const {
    products, categories, productGroups,
    addProduct, updateProduct, deleteProduct,
    addProductGroup, updateProductGroup, deleteProductGroup,
  } = useAppData();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [productModal, setProductModal] = useState(false);
  const [groupModal, setGroupModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [editingGroupId, setEditingGroupId] = useState(null);
  const [viewingGroupId, setViewingGroupId] = useState(null);
  const [productForm, setProductForm] = useState(emptyProduct);
  const [groupForm, setGroupForm] = useState(emptyGroup);

  const categoryName = (id) => categories.find((item) => item.id === id)?.name || 'Sem categoria';
  const variantsFor = (group) => products.filter((product) => product.groupId === group.id || (!product.groupId && normalize(product.groupName) === normalize(group.name)));
  const groupedIds = new Set(productGroups.flatMap((group) => variantsFor(group).map((product) => product.id)));

  const catalogEntries = useMemo(() => {
    const groups = productGroups.map((group) => ({ type: 'group', group, variants: variantsFor(group) }));
    const singles = products.filter((product) => !groupedIds.has(product.id)).map((product) => ({ type: 'product', product }));
    return [...groups, ...singles].filter((entry) => {
      const categoryId = entry.type === 'group' ? entry.group.categoryId : entry.product.categoryId;
      const text = entry.type === 'group'
        ? `${entry.group.name} ${entry.variants.map((item) => `${item.name} ${item.brand || ''}`).join(' ')}`
        : `${entry.product.name} ${entry.product.brand || ''}`;
      return (category === 'all' || categoryId === category) && normalize(text).includes(normalize(search));
    });
  // variantsFor and groupedIds are derived from the listed dependencies.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, productGroups, search, category]);

  const viewingGroup = productGroups.find((group) => group.id === viewingGroupId);
  const viewingVariants = viewingGroup ? variantsFor(viewingGroup) : [];

  const openNewProduct = (group = null) => {
    setViewingGroupId(null);
    setEditingProductId(null);
    setProductForm({ ...emptyProduct, groupId: group?.id || '', categoryId: group?.categoryId || categories[0]?.id || '' });
    setProductModal(true);
  };
  const openEditProduct = (product) => {
    const matchedGroup = productGroups.find((group) => group.id === product.groupId) || productGroups.find((group) => normalize(group.name) === normalize(product.groupName));
    setViewingGroupId(null);
    setEditingProductId(product.id);
    setProductForm({ ...emptyProduct, ...product, groupId: matchedGroup?.id || '', oldPrice: product.oldPrice || '' });
    setProductModal(true);
  };
  const openNewGroup = () => {
    setEditingGroupId(null);
    setGroupForm({ ...emptyGroup, categoryId: categories[0]?.id || '' });
    setGroupModal(true);
  };
  const openEditGroup = (group) => {
    setEditingGroupId(group.id);
    setGroupForm({ name: group.name, categoryId: group.categoryId });
    setGroupModal(true);
  };

  const submitProduct = (event) => {
    event.preventDefault();
    const selectedGroup = productGroups.find((group) => group.id === productForm.groupId);
    const data = {
      ...productForm,
      categoryId: selectedGroup?.categoryId || productForm.categoryId,
      groupName: selectedGroup?.name || '',
      brand: productForm.brand.trim(),
      price: Number(productForm.price),
      oldPrice: productForm.oldPrice ? Number(productForm.oldPrice) : null,
      stock: Number(productForm.stock),
    };
    if (editingProductId) updateProduct(editingProductId, data); else addProduct(data);
    setProductModal(false);
  };
  const submitGroup = (event) => {
    event.preventDefault();
    if (editingGroupId) updateProductGroup(editingGroupId, groupForm);
    else {
      const id = addProductGroup(groupForm);
      setViewingGroupId(id);
    }
    setGroupModal(false);
  };
  const removeProduct = (product) => {
    if (window.confirm(`Remover “${product.name}”?`)) deleteProduct(product.id);
  };
  const removeGroup = (group) => {
    if (window.confirm(`Remover o grupo “${group.name}”? As marcas continuarão cadastradas como produtos avulsos.`)) deleteProductGroup(group.id);
  };

  return (
    <div className="animate-enter">
      <PageHeader eyebrow="Catálogo" title="Produtos e grupos" description={`${products.length} itens em ${productGroups.length} grupo(s) · organize marcas semelhantes em uma única vitrine`}>
        <button onClick={openNewGroup} className="btn-secondary"><Boxes size={17} />Novo grupo</button>
        <button onClick={() => openNewProduct()} className="btn-accent"><Plus size={17} />Novo produto</button>
      </PageHeader>

      <div className="panel overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-[#e7ebe8] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"><div className="relative w-full sm:max-w-sm"><Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8a958f]" size={17} /><input className="field pl-10" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar produto, grupo ou marca" /></div><select className="field w-full sm:w-52" value={category} onChange={(event) => setCategory(event.target.value)}><option value="all">Todas as categorias</option>{categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></div>

        {catalogEntries.length ? <>
          <div className="divide-y divide-[#edf0ed] md:hidden">{catalogEntries.map((entry) => {
            if (entry.type === 'group') {
              const minimum = entry.variants.length ? Math.min(...entry.variants.map((item) => item.price)) : null;
              return <article key={`group-${entry.group.id}`} className="p-4"><div className="flex items-start gap-3"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-[14px] bg-[#e8f1e4] text-[#4d7043]"><Boxes size={19} /></span><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><p className="font-extrabold">{entry.group.name}</p><span className="rounded-md bg-[#17251f] px-2 py-0.5 text-[8px] font-extrabold uppercase text-white">Grupo</span></div><p className="mt-1 text-[10px] text-[#849089]">{entry.variants.length} {entry.variants.length === 1 ? 'marca' : 'marcas'} · {categoryName(entry.group.categoryId)}</p><p className="mt-2 text-sm font-extrabold">{minimum === null ? 'Sem marcas cadastradas' : `A partir de ${currency(minimum)}`}</p></div></div><div className="mt-3 flex gap-2"><button onClick={() => setViewingGroupId(entry.group.id)} className="btn-primary flex-1 py-2.5"><Eye size={14} />Ver grupo</button><button onClick={() => openEditGroup(entry.group)} className="grid h-11 w-11 place-items-center rounded-xl border border-[#dfe3df]"><Pencil size={15} /></button></div></article>;
            }
            const product = entry.product;
            return <article key={product.id} className="p-4"><div className="flex gap-3"><div className="h-14 w-14 shrink-0 overflow-hidden rounded-[14px] bg-[#f0f2ef]">{product.img ? <img src={product.img} alt="" className="h-full w-full object-cover" /> : <span className="grid h-full place-items-center text-[#98a19c]"><Image size={18} /></span>}</div><div className="min-w-0 flex-1"><p className="font-extrabold">{product.name}</p><p className="mt-1 text-[10px] text-[#849089]">{product.brand ? `${product.brand} · ` : ''}{product.unit}</p><p className="mt-2 text-sm font-extrabold">{currency(product.price)}</p></div><button onClick={() => openEditProduct(product)} className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[#dfe3df]"><Pencil size={15} /></button></div></article>;
          })}</div>

          <div className="hidden overflow-x-auto md:block"><table className="w-full min-w-[900px] text-left"><thead><tr className="bg-[#fafaf8] text-[10px] uppercase tracking-[0.12em] text-[#85918b]"><th className="px-6 py-3.5">Produto ou grupo</th><th className="px-5 py-3.5">Categoria</th><th className="px-5 py-3.5">Preço</th><th className="px-5 py-3.5">Estoque</th><th className="px-6 py-3.5 text-right">Ações</th></tr></thead><tbody className="divide-y divide-[#edf0ed]">
            {catalogEntries.map((entry) => {
              if (entry.type === 'group') {
                const minimum = entry.variants.length ? Math.min(...entry.variants.map((item) => item.price)) : null;
                const stock = entry.variants.reduce((sum, item) => sum + Number(item.stock || 0), 0);
                return <tr key={`group-${entry.group.id}`} className="bg-[#fbfdf9] text-sm transition hover:bg-[#f5f9f2]"><td className="px-6 py-4"><div className="flex items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded-[14px] bg-[#e8f1e4] text-[#4d7043]"><Boxes size={20} /></span><div><div className="flex items-center gap-2"><p className="font-extrabold">{entry.group.name}</p><span className="rounded-md bg-[#17251f] px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-wide text-white">Grupo</span></div><p className="mt-1 text-[11px] text-[#85918b]">{entry.variants.length} {entry.variants.length === 1 ? 'marca cadastrada' : 'marcas cadastradas'}</p></div></div></td><td className="px-5 py-4"><span className="rounded-lg bg-[#eff2ef] px-2.5 py-1 text-xs font-bold text-[#607068]">{categoryName(entry.group.categoryId)}</span></td><td className="px-5 py-4 font-extrabold">{minimum === null ? '—' : <><span className="mr-1 text-[10px] font-bold text-[#8a958f]">A partir de</span>{currency(minimum)}</>}</td><td className="px-5 py-4 text-xs font-bold">{stock} un.</td><td className="px-6 py-4"><div className="flex justify-end gap-1"><button onClick={() => setViewingGroupId(entry.group.id)} className="btn-secondary py-2"><Eye size={14} />Ver grupo</button><button onClick={() => openEditGroup(entry.group)} className="grid h-9 w-9 place-items-center rounded-xl text-[#738078] hover:bg-[#eef1ee]" title="Editar grupo"><Pencil size={16} /></button><button onClick={() => removeGroup(entry.group)} className="grid h-9 w-9 place-items-center rounded-xl text-[#9a7770] hover:bg-[#fff0eb] hover:text-[#db4f31]" title="Remover grupo"><Trash2 size={16} /></button></div></td></tr>;
              }
              const product = entry.product;
              return <tr key={product.id} className="group text-sm transition hover:bg-[#fbfbf8]"><td className="px-6 py-4"><div className="flex items-center gap-3"><div className="h-12 w-12 shrink-0 overflow-hidden rounded-[14px] bg-[#f0f2ef]">{product.img ? <img src={product.img} alt="" className="h-full w-full object-cover" /> : <span className="grid h-full place-items-center text-[#98a19c]"><Image size={18} /></span>}</div><div className="min-w-0"><div className="flex items-center gap-1.5"><p className="max-w-[320px] truncate font-extrabold">{product.name}</p>{product.featured && <Star size={13} className="fill-[#efad35] text-[#efad35]" />}</div><p className="mt-0.5 text-[11px] text-[#85918b]">{product.brand ? `${product.brand} · ` : ''}{product.unit}</p></div></div></td><td className="px-5 py-4"><span className="rounded-lg bg-[#eff2ef] px-2.5 py-1 text-xs font-bold text-[#607068]">{categoryName(product.categoryId)}</span></td><td className="px-5 py-4"><p className="font-extrabold">{currency(product.price)}</p>{product.oldPrice && <p className="text-[10px] text-[#98a19c] line-through">{currency(product.oldPrice)}</p>}</td><td className="px-5 py-4"><div className="flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${product.stock === 0 ? 'bg-red-500' : product.stock <= 20 ? 'bg-amber-500' : 'bg-green-500'}`} /><span className="text-xs font-bold">{product.stock} un.</span>{product.stock <= 20 && <AlertTriangle size={13} className="text-amber-500" />}</div></td><td className="px-6 py-4"><div className="flex justify-end gap-1"><button onClick={() => openEditProduct(product)} className="grid h-9 w-9 place-items-center rounded-xl text-[#738078] hover:bg-[#eef1ee]" title="Editar"><Pencil size={16} /></button><button onClick={() => removeProduct(product)} className="grid h-9 w-9 place-items-center rounded-xl text-[#9a7770] hover:bg-[#fff0eb] hover:text-[#db4f31]" title="Remover"><Trash2 size={16} /></button></div></td></tr>;
            })}
          </tbody></table></div>
        </> : <EmptyState icon={Package} title="Nenhum item encontrado" description="Ajuste sua busca ou crie um novo produto ou grupo." />}
      </div>

      {groupModal && <Modal title={editingGroupId ? 'Editar grupo' : 'Novo grupo de produtos'} description="O grupo reúne várias marcas do mesmo tipo de produto." onClose={() => setGroupModal(false)}>
        <form onSubmit={submitGroup} className="space-y-5 p-5 sm:p-6"><div><label className="label">Nome do grupo</label><input required autoFocus className="field" value={groupForm.name} onChange={(event) => setGroupForm({ ...groupForm, name: event.target.value })} placeholder="Ex.: Feijão" /><p className="mt-2 text-xs leading-relaxed text-[#7d8983]">Na vitrine aparecerá apenas “Feijão”; o cliente abrirá o grupo para escolher a marca.</p></div><div><label className="label">Categoria</label><select required className="field" value={groupForm.categoryId} onChange={(event) => setGroupForm({ ...groupForm, categoryId: event.target.value })}>{categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></div><div className="flex flex-col-reverse gap-2 border-t border-[#edf0ed] pt-5 sm:flex-row sm:justify-end"><button type="button" className="btn-secondary" onClick={() => setGroupModal(false)}>Cancelar</button><button type="submit" className="btn-accent"><Boxes size={16} />{editingGroupId ? 'Salvar grupo' : 'Criar grupo'}</button></div></form>
      </Modal>}

      {productModal && <Modal title={editingProductId ? 'Editar produto' : productForm.groupId ? 'Adicionar marca ao grupo' : 'Novo produto'} description={productForm.groupId ? 'Cadastre uma marca com preço, embalagem e estoque próprios.' : 'O item aparecerá individualmente na vitrine.'} onClose={() => setProductModal(false)} width="max-w-2xl">
        <form onSubmit={submitProduct} className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
          <div className="sm:col-span-2"><label className="label">Grupo <span className="font-normal text-[#98a19c]">(opcional)</span></label><select className="field" value={productForm.groupId || ''} onChange={(event) => { const group = productGroups.find((item) => item.id === event.target.value); setProductForm({ ...productForm, groupId: event.target.value, categoryId: group?.categoryId || productForm.categoryId }); }}><option value="">Produto avulso</option>{productGroups.map((group) => <option key={group.id} value={group.id}>{group.name}</option>)}</select></div>
          <div className="sm:col-span-2"><label className="label">Nome completo do produto</label><input className="field" required autoFocus value={productForm.name} onChange={(event) => setProductForm({ ...productForm, name: event.target.value })} placeholder="Ex.: Feijão carioca Camil" /></div>
          <div><label className="label">Marca {productForm.groupId && <span className="text-[#d45235]">*</span>}</label><input className="field" required={Boolean(productForm.groupId)} value={productForm.brand || ''} onChange={(event) => setProductForm({ ...productForm, brand: event.target.value })} placeholder="Ex.: Camil" /></div>
          <div><label className="label">Apresentação</label><input className="field" required value={productForm.unit} onChange={(event) => setProductForm({ ...productForm, unit: event.target.value })} placeholder="Ex.: Pacote 1kg" /></div>
          <div><label className="label">Categoria</label><select className="field disabled:bg-[#f0f2ef]" disabled={Boolean(productForm.groupId)} required value={productForm.categoryId} onChange={(event) => setProductForm({ ...productForm, categoryId: event.target.value })}>{categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></div>
          <div><label className="label">Preço</label><input className="field" required type="number" min="0" step="0.01" value={productForm.price} onChange={(event) => setProductForm({ ...productForm, price: event.target.value })} /></div>
          <div><label className="label">Preço anterior <span className="font-normal text-[#98a19c]">(opcional)</span></label><input className="field" type="number" min="0" step="0.01" value={productForm.oldPrice} onChange={(event) => setProductForm({ ...productForm, oldPrice: event.target.value })} /></div>
          <div><label className="label">Estoque disponível</label><input className="field" required type="number" min="0" value={productForm.stock} onChange={(event) => setProductForm({ ...productForm, stock: event.target.value })} /></div>
          <label className="flex items-center gap-3 self-end rounded-[14px] border border-[#dde2de] px-4 py-3 text-sm font-bold"><input type="checkbox" checked={productForm.featured} onChange={(event) => setProductForm({ ...productForm, featured: event.target.checked })} className="h-4 w-4 accent-[#ff5a36]" />Destacar na vitrine</label>
          <div className="sm:col-span-2"><label className="label">URL da imagem</label><div className="flex gap-3"><input className="field" value={productForm.img} onChange={(event) => setProductForm({ ...productForm, img: event.target.value })} placeholder="https://..." />{productForm.img && <img src={productForm.img} alt="Prévia" className="h-12 w-12 rounded-xl object-cover" />}</div></div>
          <div className="sm:col-span-2 flex flex-col-reverse gap-2 border-t border-[#edf0ed] pt-5 sm:flex-row sm:justify-end"><button type="button" className="btn-secondary" onClick={() => setProductModal(false)}>Cancelar</button><button className="btn-accent" type="submit">{editingProductId ? 'Salvar alterações' : 'Adicionar produto'}</button></div>
        </form>
      </Modal>}

      {viewingGroup && <Modal title={viewingGroup.name} description={`${viewingVariants.length} ${viewingVariants.length === 1 ? 'marca cadastrada' : 'marcas cadastradas'} neste grupo.`} onClose={() => setViewingGroupId(null)} width="max-w-3xl">
        <div className="border-b border-[#e8ebe9] p-4 sm:p-5"><button onClick={() => openNewProduct(viewingGroup)} className="btn-accent w-full sm:w-auto"><Plus size={16} />Adicionar marca</button></div>
        {viewingVariants.length ? <div className="max-h-[62vh] divide-y divide-[#edf0ed] overflow-y-auto">{viewingVariants.map((product) => <article key={product.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:p-5"><div className="flex min-w-0 flex-1 items-center gap-3"><div className="h-14 w-14 shrink-0 overflow-hidden rounded-[15px] bg-[#eef1ed]">{product.img ? <img src={product.img} alt="" className="h-full w-full object-cover" /> : <span className="grid h-full place-items-center text-[#98a19c]"><Image size={18} /></span>}</div><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><p className="font-extrabold">{product.name}</p>{product.brand && <span className="rounded-md bg-[#e8f1e4] px-2 py-0.5 text-[9px] font-extrabold uppercase text-[#4d7043]">{product.brand}</span>}</div><p className="mt-1 text-[11px] text-[#849089]">{product.unit} · {product.stock} em estoque</p></div></div><div className="flex items-center justify-between gap-3 border-t border-[#edf0ed] pt-3 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0"><p className="font-extrabold">{currency(product.price)}</p><div className="flex gap-1"><button onClick={() => openEditProduct(product)} className="grid h-9 w-9 place-items-center rounded-xl border border-[#dfe3df]"><Pencil size={15} /></button><button onClick={() => removeProduct(product)} className="grid h-9 w-9 place-items-center rounded-xl border border-[#f0ddd8] text-[#d45235]"><Trash2 size={15} /></button></div></div></article>)}</div> : <EmptyState icon={Boxes} title="Grupo sem marcas" description="Adicione a primeira marca para exibir este grupo na vitrine." />}
      </Modal>}
    </div>
  );
}

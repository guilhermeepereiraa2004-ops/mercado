import { CheckCircle2, ImageUp, Palette, Save, Store, Type } from 'lucide-react';
import { useState } from 'react';
import { PageHeader } from '../../components/AdminUI';
import { StoreBrand } from '../../components/Brand';
import { useAppData } from '../../context/AppDataContext';

const palette = ['#ff5a36', '#26705f', '#4c7b42', '#c64b62', '#6b58a6', '#c17a22'];

export default function StoreSettings() {
  const { activeTenant, updateTenantSettings } = useAppData();
  const [form, setForm] = useState(activeTenant.settings);
  const [saved, setSaved] = useState(false);

  const uploadLogo = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((current) => ({ ...current, logoUrl: reader.result }));
    reader.readAsDataURL(file);
  };

  const submit = (event) => {
    event.preventDefault();
    updateTenantSettings({ ...form, minimumOrder: Number(form.minimumOrder) });
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  return (
    <div className="animate-enter">
      <PageHeader eyebrow="Personalização" title="Loja & site" description="Ajuste a identidade, a mensagem principal e as informações operacionais da sua vitrine." />
      <form onSubmit={submit} className="grid gap-6 xl:grid-cols-[1fr_470px]">
        <div className="space-y-6">
          <section className="panel p-6 sm:p-7"><div className="mb-6 flex items-start gap-3"><span className="grid h-10 w-10 place-items-center rounded-[14px] bg-[#e8f3df] text-[#4c6e42]"><Store size={18} /></span><div><h2 className="font-display text-lg font-extrabold">Identidade da marca</h2><p className="mt-1 text-xs text-[#7c8982]">Logo, nome curto e cor principal da loja.</p></div></div>
            <div className="grid gap-5 sm:grid-cols-[120px_1fr]"><div><label className="label">Logo</label><label className="relative grid aspect-square cursor-pointer place-items-center overflow-hidden rounded-[22px] border-2 border-dashed border-[#d4dad6] bg-[#f5f6f4] text-center transition hover:border-[#ff5a36]">{form.logoUrl ? <img src={form.logoUrl} alt="Logo" className="h-full w-full object-cover" /> : <span className="flex flex-col items-center gap-2 text-[10px] font-bold text-[#839089]"><ImageUp size={20} />Enviar logo</span>}<input type="file" accept="image/*" className="hidden" onChange={uploadLogo} /></label></div><div className="space-y-5"><div><label className="label">Nome exibido</label><input className="field" value={form.logoText} onChange={(event) => setForm({ ...form, logoText: event.target.value })} required /></div><div><label className="label">Cor principal</label><div className="flex flex-wrap gap-2">{palette.map((color) => <button type="button" key={color} onClick={() => setForm({ ...form, accent: color })} className={`h-9 w-9 rounded-xl ${form.accent === color ? 'ring-2 ring-[#17251f] ring-offset-2' : ''}`} style={{ backgroundColor: color }} />)}<input type="color" value={form.accent} onChange={(event) => setForm({ ...form, accent: event.target.value })} className="h-9 w-9 cursor-pointer overflow-hidden rounded-xl border-0 bg-transparent" /></div></div></div></div>
          </section>

          <section className="panel p-6 sm:p-7"><div className="mb-6 flex items-start gap-3"><span className="grid h-10 w-10 place-items-center rounded-[14px] bg-[#fff0e9] text-[#ff5a36]"><Type size={18} /></span><div><h2 className="font-display text-lg font-extrabold">Hero da vitrine</h2><p className="mt-1 text-xs text-[#7c8982]">A primeira mensagem que o cliente vê.</p></div></div><div className="grid gap-5"><div><label className="label">Chamada curta</label><input className="field" value={form.heroEyebrow} onChange={(event) => setForm({ ...form, heroEyebrow: event.target.value })} /></div><div><label className="label">Frase principal</label><input className="field" value={form.heroTitle} onChange={(event) => setForm({ ...form, heroTitle: event.target.value })} /></div><div><label className="label">Texto de apoio</label><textarea className="field min-h-24 resize-y" value={form.heroDescription} onChange={(event) => setForm({ ...form, heroDescription: event.target.value })} /></div></div></section>

          <section className="panel p-6 sm:p-7"><div className="mb-6 flex items-start gap-3"><span className="grid h-10 w-10 place-items-center rounded-[14px] bg-[#e3eff5] text-[#416f82]"><Palette size={18} /></span><div><h2 className="font-display text-lg font-extrabold">Informações operacionais</h2><p className="mt-1 text-xs text-[#7c8982]">Dados mostrados no topo e no checkout.</p></div></div><div className="grid gap-5 sm:grid-cols-2"><div><label className="label">Tempo de entrega</label><input className="field" value={form.deliveryTime} onChange={(event) => setForm({ ...form, deliveryTime: event.target.value })} /></div><div><label className="label">Pedido mínimo (R$)</label><input className="field" type="number" min="0" value={form.minimumOrder} onChange={(event) => setForm({ ...form, minimumOrder: event.target.value })} /></div><div><label className="label">WhatsApp</label><input className="field" value={form.whatsapp} onChange={(event) => setForm({ ...form, whatsapp: event.target.value })} /></div><div><label className="label">Endereço</label><input className="field" value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} /></div></div></section>
          <button className="btn-accent" type="submit">{saved ? <CheckCircle2 size={17} /> : <Save size={17} />}{saved ? 'Configurações salvas' : 'Salvar e publicar'}</button>
        </div>

        <aside className="h-fit xl:sticky xl:top-28"><p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#85918b]">Prévia da vitrine</p><div className="overflow-hidden rounded-[28px] border-[6px] border-[#17251f] bg-[#fffaf3] shadow-[0_25px_70px_rgba(20,40,30,.15)]"><div className="flex items-center justify-between border-b border-[#ebe7df] bg-white px-5 py-4"><StoreBrand name={form.logoText} accent={form.accent} logoUrl={form.logoUrl} /><span className="h-8 w-8 rounded-xl bg-[#eff1ee]" /></div><div className="relative overflow-hidden p-7 pb-9"><div className="absolute -right-12 -top-8 h-40 w-40 rounded-full opacity-15" style={{ backgroundColor: form.accent }} /><p className="relative text-[9px] font-extrabold uppercase tracking-[0.2em]" style={{ color: form.accent }}>{form.heroEyebrow}</p><h3 className="relative mt-3 max-w-[330px] font-display text-[28px] font-extrabold leading-[1.08] tracking-[-0.05em]">{form.heroTitle}</h3><p className="relative mt-3 max-w-sm text-xs leading-relaxed text-[#6f7c75]">{form.heroDescription}</p><button type="button" className="relative mt-5 rounded-xl px-4 py-2.5 text-xs font-extrabold text-white" style={{ backgroundColor: form.accent }}>Ver produtos</button></div><div className="grid grid-cols-3 gap-2 bg-white p-4">{[1,2,3].map((item) => <div key={item} className="rounded-xl bg-[#f1f2ef] p-2"><div className="aspect-square rounded-lg bg-[#e3e6e2]" /><div className="mt-2 h-1.5 w-4/5 rounded bg-[#d8ddda]" /><div className="mt-1.5 h-1.5 w-1/2 rounded bg-[#17251f]" /></div>)}</div></div></aside>
      </form>
    </div>
  );
}

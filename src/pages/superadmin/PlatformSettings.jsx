import { Building2, CheckCircle2, KeyRound, Save, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { PageHeader } from '../../components/AdminUI';
import { useAppData } from '../../context/AppDataContext';

export default function PlatformSettings() {
  const { platformSettings, updatePlatformSettings } = useAppData();
  const [form, setForm] = useState(platformSettings);
  const [saved, setSaved] = useState(false);

  const submit = (event) => {
    event.preventDefault();
    updatePlatformSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  return (
    <div className="animate-enter">
      <PageHeader eyebrow="Regras da plataforma" title="Configurações globais" description="Defina os dados de pagamento e suporte exibidos aos mercados com cobrança pendente." />
      <form onSubmit={submit} className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <div className="space-y-6">
          <section className="panel flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex items-start gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-[14px] bg-[#fff0e9] text-[#ff5a36]"><Building2 size={18} /></span><div><h2 className="font-display text-lg font-extrabold">Acordos por mercado</h2><p className="mt-1 max-w-xl text-xs leading-relaxed text-[#7c8982]">A modalidade e a porcentagem de comissão agora são definidas individualmente ao criar ou editar cada mercado.</p></div></div>
            <Link to="/superadmin/markets" className="btn-secondary shrink-0">Gerenciar mercados</Link>
          </section>

          <section className="panel p-6 sm:p-7">
            <div className="mb-6 flex items-start gap-3"><span className="grid h-10 w-10 place-items-center rounded-[14px] bg-[#e8f3df] text-[#4b6d41]"><KeyRound size={18} /></span><div><h2 className="font-display text-lg font-extrabold">Dados para pagamento</h2><p className="mt-1 text-xs text-[#7c8982]">Informações mostradas ao estabelecimento inadimplente.</p></div></div>
            <div className="grid gap-5 sm:grid-cols-2"><div><label className="label">Chave Pix</label><input className="field" value={form.pixKey} onChange={(event) => setForm({ ...form, pixKey: event.target.value })} required /></div><div><label className="label">Nome do recebedor</label><input className="field" value={form.receiverName} onChange={(event) => setForm({ ...form, receiverName: event.target.value })} required /></div><div className="sm:col-span-2"><label className="label">E-mail de suporte</label><input className="field" type="email" value={form.supportEmail} onChange={(event) => setForm({ ...form, supportEmail: event.target.value })} required /></div><div className="sm:col-span-2"><label className="label">Instruções ao mercado</label><textarea className="field min-h-28 resize-y" value={form.paymentInstructions} onChange={(event) => setForm({ ...form, paymentInstructions: event.target.value })} /></div></div>
          </section>
          <button className="btn-accent" type="submit">{saved ? <CheckCircle2 size={17} /> : <Save size={17} />}{saved ? 'Alterações salvas' : 'Salvar configurações'}</button>
        </div>

        <aside className="h-fit rounded-[26px] bg-[#17251f] p-7 text-white xl:sticky xl:top-28">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-[#a6d17b]"><ShieldCheck size={21} /></span>
          <p className="mt-7 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#ff8b70]">Prévia para o mercado</p>
          <h2 className="mt-2 font-display text-2xl font-extrabold tracking-[-0.04em]">Regularize seu acesso</h2>
          <p className="mt-3 text-sm leading-relaxed text-white/55">{form.paymentInstructions}</p>
          <div className="mt-7 space-y-4 rounded-2xl border border-white/10 bg-white/[0.06] p-5"><div><p className="text-[9px] font-extrabold uppercase tracking-wider text-white/35">Chave Pix</p><p className="mt-1 break-all text-sm font-extrabold">{form.pixKey || 'Sua chave Pix'}</p></div><div><p className="text-[9px] font-extrabold uppercase tracking-wider text-white/35">Favorecido</p><p className="mt-1 text-sm font-extrabold">{form.receiverName || 'Nome do recebedor'}</p></div></div>
        </aside>
      </form>
    </div>
  );
}

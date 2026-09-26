import { X } from 'lucide-react';

export function PageHeader({ eyebrow, title, description, children }) {
  return (
    <div className="mb-7 flex min-w-0 flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        {eyebrow && <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#ff5a36]">{eyebrow}</p>}
        <h1 className="break-words font-display text-2xl font-extrabold leading-[1.05] tracking-[-0.025em] text-[#17251f] md:text-[30px]">{title}</h1>
        {description && <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-[#68766f]">{description}</p>}
      </div>
      {children && <div className="flex w-full flex-wrap gap-2 md:w-auto">{children}</div>}
    </div>
  );
}

export function MetricCard({ label, value, detail, icon: Icon, tone = 'dark' }) {
  const tones = {
    dark: 'bg-[#17251f] text-white', coral: 'bg-[#ff5a36] text-white',
    green: 'bg-[#e8f3df] text-[#426239]', blue: 'bg-[#e3eff5] text-[#37677c]',
  };
  return (
    <div className="panel p-5">
      <div className="mb-6 flex items-start justify-between">
        <p className="text-xs font-bold text-[#718078]">{label}</p>
        <span className={`grid h-10 w-10 place-items-center rounded-[14px] ${tones[tone]}`}><Icon size={18} /></span>
      </div>
      <p className="font-display text-2xl font-extrabold tracking-[-0.04em] text-[#17251f]">{value}</p>
      {detail && <p className="mt-1 text-xs text-[#7c8983]">{detail}</p>}
    </div>
  );
}

export function StatusBadge({ status }) {
  const map = {
    Active: ['Ativo', 'bg-[#e6f4df] text-[#3d6934]'],
    'Past Due': ['Pagamento pendente', 'bg-[#fff0df] text-[#9b5d1a]'],
    Pending: ['Pendente', 'bg-[#fff0df] text-[#9b5d1a]'],
    Paid: ['Pago', 'bg-[#e6f4df] text-[#3d6934]'],
    Canceled: ['Cancelado', 'bg-[#f3e5e2] text-[#9b4a3d]'],
  };
  const [label, style] = map[status] || [status, 'bg-slate-100 text-slate-600'];
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.08em] ${style}`}>{label}</span>;
}

export function Modal({ title, description, onClose, children, width = 'max-w-lg' }) {
  return (
    <div className="fixed inset-0 z-[100] grid place-items-end bg-[#0f1d17]/55 p-0 backdrop-blur-sm sm:place-items-center sm:p-4" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className={`max-h-[96dvh] w-full min-w-0 overflow-y-auto rounded-t-[26px] bg-white shadow-[0_30px_90px_rgba(8,23,16,.3)] sm:max-h-[92vh] sm:rounded-[28px] ${width}`}>
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-[#e8ebe9] bg-white px-6 py-5">
          <div>
            <h2 className="font-display text-xl font-extrabold tracking-[-0.03em]">{title}</h2>
            {description && <p className="mt-1 text-xs text-[#718078]">{description}</p>}
          </div>
          <button type="button" onClick={onClose} aria-label="Fechar" className="grid h-9 w-9 place-items-center rounded-xl text-[#738078] transition hover:bg-[#f1f3f1] hover:text-[#17251f]"><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="grid min-h-60 place-items-center p-8 text-center">
      <div>
        <span className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-[#eff1ee] text-[#6e7c75]"><Icon size={21} /></span>
        <h3 className="font-display font-extrabold">{title}</h3>
        <p className="mt-1 max-w-sm text-sm text-[#7b8881]">{description}</p>
      </div>
    </div>
  );
}

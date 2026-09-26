export function BrandMark({ className = 'h-10 w-10', tone = 'dark' }) {
  const dark = tone === 'dark';
  return (
    <svg viewBox="0 0 48 48" className={className} role="img" aria-label="CestaOS">
      <rect width="48" height="48" rx="15" fill={dark ? '#17251f' : '#fffaf3'} />
      <path d="M13.5 20.5h21l-2.4 12.2a4 4 0 0 1-3.9 3.3H19.8a4 4 0 0 1-3.9-3.3l-2.4-12.2Z" fill="#ff5a36" />
      <path d="M18 20.5c.8-5.2 3.7-8.2 8.7-9.1" fill="none" stroke={dark ? '#fffaf3' : '#17251f'} strokeWidth="3" strokeLinecap="round" />
      <path d="M27 11.4c4.4-.8 7.1.7 8.1 4.4-4.2.8-6.9-.7-8.1-4.4Z" fill="#a6d17b" />
      <path d="M20 27h8" stroke="#fffaf3" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function Brand({ inverse = false, suffix, compact = false }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <BrandMark className={compact ? 'h-9 w-9' : 'h-11 w-11'} tone={inverse ? 'light' : 'dark'} />
      <div className="min-w-0">
        <div className={`font-brand text-xl font-extrabold tracking-[-0.04em] ${inverse ? 'text-white' : 'text-[#17251f]'}`}>
          cesta<span className="text-[#ff5a36]">OS</span>
        </div>
        {suffix && <div className={`-mt-0.5 text-[9px] font-extrabold uppercase tracking-[0.2em] ${inverse ? 'text-white/45' : 'text-[#66756e]'}`}>{suffix}</div>}
      </div>
    </div>
  );
}

export function StoreBrand({ name, accent = '#ff5a36', light = false, logoUrl }) {
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <div className="relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-[14px] text-white shadow-sm" style={{ background: accent }}>
        {logoUrl ? <img src={logoUrl} alt="" className="h-full w-full object-cover" /> : <span className="font-brand text-lg font-black">{name?.charAt(0) || 'M'}</span>}
        {!logoUrl && <span className="absolute -right-0.5 -top-0.5 h-3 w-4 rotate-[-20deg] rounded-full bg-[#a6d17b] ring-2 ring-white" />}
      </div>
      <div className="min-w-0">
        <p className={`truncate font-brand text-base font-extrabold leading-none tracking-[-0.035em] sm:text-lg ${light ? 'text-white' : 'text-[#17251f]'}`}>{name}</p>
        <p className={`mt-1 text-[9px] font-bold uppercase tracking-[0.22em] ${light ? 'text-white/50' : 'text-[#718078]'}`}>mercado & delivery</p>
      </div>
    </div>
  );
}

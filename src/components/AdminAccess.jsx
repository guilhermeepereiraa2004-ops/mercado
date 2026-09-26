import { useEffect, useState } from 'react';
import { ArrowLeft, Eye, EyeOff, LockKeyhole, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppData } from '../context/AppDataContext';
import { StoreBrand } from './Brand';

const isLocalEnvironment = () => {
  const hostname = window.location.hostname;
  return hostname === 'localhost'
    || hostname === '127.0.0.1'
    || hostname === '0.0.0.0'
    || hostname === '::1'
    || hostname.startsWith('192.168.')
    || hostname.startsWith('10.')
    || /^172\.(1[6-9]|2\d|3[01])\./.test(hostname);
};

export default function AdminAccess({ children }) {
  const { activeTenant } = useAppData();
  const sessionKey = `cesta_admin_authenticated_${activeTenant?.id}`;
  const requiresLogin = !isLocalEnvironment() && Boolean(activeTenant?.login && activeTenant?.password);
  const [authorized, setAuthorized] = useState(() => !requiresLogin || sessionStorage.getItem(sessionKey) !== null);
  const [form, setForm] = useState({ login: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setAuthorized(!requiresLogin || sessionStorage.getItem(sessionKey) !== null);
    setForm({ login: '', password: '' });
    setError('');
  }, [requiresLogin, sessionKey]);

  if (authorized || !requiresLogin) return children;

  const submit = (event) => {
    event.preventDefault();
    if (form.login.trim().toLowerCase() === activeTenant.login.trim().toLowerCase() && form.password === activeTenant.password) {
      sessionStorage.setItem(sessionKey, 'credentials');
      setAuthorized(true);
      return;
    }
    setError('Login ou senha incorretos. Verifique os dados e tente novamente.');
  };

  return (
    <div className="grid min-h-screen bg-[#f4f3ee] lg:grid-cols-[1fr_1.05fr]">
      <section className="relative hidden overflow-hidden bg-[#17251f] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#ff5a36]/15" />
        <StoreBrand name={activeTenant.settings?.logoText || activeTenant.name} accent={activeTenant.settings?.accent} logoUrl={activeTenant.settings?.logoUrl} light />
        <div className="relative max-w-xl"><p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#a6d17b]">Área administrativa</p><h1 className="mt-4 font-display text-6xl leading-[.95]">Sua operação começa aqui.</h1><p className="mt-5 max-w-md text-sm leading-relaxed text-white/55">Acompanhe pedidos, catálogo, financeiro e toda a experiência da sua loja em um só lugar.</p></div>
        <p className="text-xs text-white/30">Protegido pela CestaOS</p>
      </section>
      <main className="flex min-w-0 items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md rounded-[26px] bg-white p-6 shadow-[0_24px_70px_rgba(23,37,31,.1)] sm:p-8">
          <div className="lg:hidden"><StoreBrand name={activeTenant.settings?.logoText || activeTenant.name} accent={activeTenant.settings?.accent} logoUrl={activeTenant.settings?.logoUrl} /></div>
          <span className="mt-8 grid h-11 w-11 place-items-center rounded-2xl bg-[#fff0e9] text-[#ff5a36] lg:mt-0"><LockKeyhole size={20} /></span>
          <h1 className="mt-5 font-display text-3xl leading-none">Acessar o painel</h1>
          <p className="mt-2 text-sm leading-relaxed text-[#748179]">Entre com as credenciais definidas pelo administrador master.</p>
          <form onSubmit={submit} className="mt-7 space-y-4">
            <div><label className="label">Login</label><input autoFocus required type="email" className="field" value={form.login} onChange={(event) => { setForm({ ...form, login: event.target.value }); setError(''); }} placeholder="seu@email.com" /></div>
            <div><label className="label">Senha</label><div className="relative"><input required type={showPassword ? 'text' : 'password'} className="field pr-11" value={form.password} onChange={(event) => { setForm({ ...form, password: event.target.value }); setError(''); }} placeholder="Digite sua senha" /><button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center text-[#7d8983]" aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></div>
            {error && <p className="rounded-xl bg-[#fff0eb] p-3 text-xs font-bold leading-relaxed text-[#b84d35]">{error}</p>}
            <button type="submit" className="btn-accent w-full py-4"><LogIn size={17} />Entrar no painel</button>
          </form>
          <Link to="/" className="mt-5 flex items-center justify-center gap-2 text-xs font-bold text-[#75827b]"><ArrowLeft size={14} />Voltar para a loja</Link>
        </div>
      </main>
    </div>
  );
}

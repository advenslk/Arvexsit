import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AlertCircle, ArrowRight, CheckCircle2, Github, Lock, Mail, Shield, User, X } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, authModalTab, setAuthModalTab, login, setIsAdminOpen } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [busy, setBusy] = useState(false);

  if (!isAuthModalOpen) return null;

  const close = () => {
    if (busy) return;
    setIsAuthModalOpen(false);
    setErrorMsg('');
    setSuccessMsg('');
  };

  const setTab = (tab: 'login' | 'register' | 'admin') => {
    setAuthModalTab(tab);
    setErrorMsg('');
    setSuccessMsg('');
  };

  const serverUserLogin = (result: any) => {
    if (result?.user) login(result.user.email, result.user.role === 'admin' ? 'admin' : 'customer', result.user.name, result.user.provider || 'email');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    if (!email || !password || (authModalTab === 'register' && !name)) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    setBusy(true);
    try {
      const endpoint = authModalTab === 'admin' ? '/api/admin/login' : authModalTab === 'register' ? '/api/auth/register' : '/api/auth/login';
      const body = authModalTab === 'register' ? { name: name.trim(), email: email.trim().toLowerCase(), password } : { email: email.trim().toLowerCase(), password };
      const response = await fetch(endpoint, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'Authentication failed.');

      if (authModalTab === 'register') {
        setSuccessMsg(result.message || 'Account created. Check your email to verify it.');
        setName('');
        setPassword('');
        return;
      }

      if (authModalTab === 'admin' && result.token) localStorage.setItem('arvex_admin_token', result.token);
      serverUserLogin(result);
      setSuccessMsg(authModalTab === 'admin' ? 'Administrator authentication verified.' : 'Signed in successfully.');
      setTimeout(() => {
        close();
        if (authModalTab === 'admin') setIsAdminOpen(true);
      }, 450);
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : 'Unable to reach the authentication service.');
    } finally {
      setBusy(false);
    }
  };

  const googleLogin = () => {
    setErrorMsg('');
    setSuccessMsg('Redirecting to secure Google sign-in…');
    window.location.assign('/api/auth/google/start');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020208]/85 p-4 backdrop-blur-xl">
      <div className="relative w-full max-w-md overflow-hidden rounded-[30px] border border-white/10 bg-[#0b0d16] shadow-2xl shadow-purple-950/30">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-purple-600 via-fuchsia-400 to-indigo-500" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-purple-600/15 blur-3xl" />
        <div className="relative p-6 sm:p-8">
          <button onClick={close} className="absolute right-5 top-5 rounded-xl border border-white/5 bg-white/5 p-2 text-slate-400 transition hover:text-white"><X className="h-4 w-4" /></button>

          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-purple-400/20 bg-purple-500/10">
              <img src="https://www.image2url.com/r2/default/images/1787805975676-5a4d373d-c6bd-4d39-bb64-1336474f4a7a.png" alt="ArveX Hosting" className="h-full w-full object-contain p-1.5" />
            </div>
            <div>
              <h3 className="font-display text-xl font-black text-white">{authModalTab === 'admin' ? 'Admin Portal' : 'ArveX Account'}</h3>
              <p className="text-xs text-slate-500">Secure authentication for ArveX Hosting</p>
            </div>
          </div>

          <div className="mb-5 grid grid-cols-2 rounded-xl border border-white/5 bg-black/20 p-1 text-xs font-bold">
            <button type="button" onClick={() => setTab('login')} className={`rounded-lg py-2.5 transition ${authModalTab === 'login' ? 'bg-white text-black' : 'text-slate-500 hover:text-white'}`}>Sign In</button>
            <button type="button" onClick={() => setTab('register')} className={`rounded-lg py-2.5 transition ${authModalTab === 'register' ? 'bg-white text-black' : 'text-slate-500 hover:text-white'}`}>Create Account</button>
          </div>

          {errorMsg && <div className="mb-4 flex items-start gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs text-rose-300"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /><span>{errorMsg}</span></div>}
          {successMsg && <div className="mb-4 flex items-start gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-300"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /><span>{successMsg}</span></div>}

          {authModalTab !== 'admin' && (
            <>
              <button type="button" onClick={googleLogin} className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white py-3 text-sm font-bold text-slate-900 transition hover:bg-slate-100">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-white text-sm font-black">G</span>
                Continue with Google
              </button>
              <div className="my-5 flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-slate-600"><span className="h-px flex-1 bg-white/5" /> or <span className="h-px flex-1 bg-white/5" /></div>
            </>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {authModalTab === 'register' && <label className="block"><span className="mb-1.5 block text-xs font-semibold text-slate-300">Full Name</span><div className="relative"><User className="absolute left-3 top-3 h-4 w-4 text-slate-600" /><input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className="w-full rounded-xl border border-white/10 bg-black/20 py-3 pl-10 pr-4 text-sm text-white outline-none focus:border-purple-400/50" placeholder="Your name" /></div></label>}
            <label className="block"><span className="mb-1.5 block text-xs font-semibold text-slate-300">Email Address</span><div className="relative"><Mail className="absolute left-3 top-3 h-4 w-4 text-slate-600" /><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className="w-full rounded-xl border border-white/10 bg-black/20 py-3 pl-10 pr-4 text-sm text-white outline-none focus:border-purple-400/50" placeholder="you@example.com" /></div></label>
            <label className="block"><span className="mb-1.5 block text-xs font-semibold text-slate-300">Password</span><div className="relative"><Lock className="absolute left-3 top-3 h-4 w-4 text-slate-600" /><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={authModalTab === 'register' ? 'new-password' : 'current-password'} className="w-full rounded-xl border border-white/10 bg-black/20 py-3 pl-10 pr-4 text-sm text-white outline-none focus:border-purple-400/50" placeholder={authModalTab === 'register' ? 'At least 10 characters' : 'Your password'} /></div></label>
            <button disabled={busy} type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-purple-900/25 transition hover:from-purple-500 hover:to-indigo-500 disabled:opacity-60">
              {busy ? 'Securing…' : authModalTab === 'register' ? 'Create Secure Account' : authModalTab === 'admin' ? 'Sign In to Admin' : 'Sign In'}
              {!busy && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          {authModalTab !== 'admin' && <p className="mt-5 text-center text-[10px] leading-5 text-slate-600">Google accounts are verified by Google. Email accounts require email verification before access.</p>}
          {authModalTab === 'admin' && <p className="mt-5 flex items-center justify-center gap-1.5 text-center text-[10px] leading-5 text-slate-600"><Shield className="h-3 w-3" /> Administrator credentials are verified server-side.</p>}
          {authModalTab !== 'admin' && <button type="button" onClick={() => setTab('admin')} className="mx-auto mt-3 flex items-center gap-1 text-[10px] font-semibold text-slate-600 transition hover:text-purple-300"><Github className="h-3 w-3" /> Staff / administrator sign-in</button>}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AlertCircle, ArrowRight, CheckCircle2, Lock, Mail, Shield, User, X } from 'lucide-react';

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || '';
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || '';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalTab,
    setAuthModalTab,
    login,
    register,
    setIsAdminOpen,
  } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const close = () => {
    setIsAuthModalOpen(false);
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (authModalTab === 'register') {
      if (!email || !password || !name) {
        setErrorMsg('Please fill in all required fields.');
        return;
      }
      register(name.trim(), email.trim().toLowerCase());
      setSuccessMsg('Account created successfully.');
      setTimeout(close, 800);
      return;
    }

    if (!email || !password) {
      setErrorMsg(authModalTab === 'admin' ? 'Enter your administrator credentials.' : 'Please enter your email and password.');
      return;
    }

    if (authModalTab === 'admin') {
      if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
        setErrorMsg('Admin login is not configured. Set VITE_ADMIN_EMAIL and VITE_ADMIN_PASSWORD on the server before building.');
        return;
      }

      if (email.trim().toLowerCase() !== ADMIN_EMAIL.trim().toLowerCase() || password !== ADMIN_PASSWORD) {
        setErrorMsg('Invalid administrator credentials.');
        return;
      }

      login(email.trim().toLowerCase(), 'admin');
      setSuccessMsg('Administrator authentication verified.');
      setTimeout(() => {
        close();
        setIsAdminOpen(true);
      }, 600);
      return;
    }

    login(email.trim().toLowerCase(), 'customer');
    setSuccessMsg('Logged in successfully.');
    setTimeout(close, 700);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-md overflow-hidden rounded-[28px] border border-white/10 bg-[#0d0f18] p-6 shadow-2xl shadow-black/60 sm:p-8">
        <div className="pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full bg-purple-600/15 blur-3xl" />
        <button onClick={close} className="absolute right-5 top-5 rounded-xl bg-white/5 p-2 text-slate-400 transition hover:bg-white/10 hover:text-white">
          <X className="h-4 w-4" />
        </button>

        <div className="relative mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-purple-400/20 bg-purple-500/10 text-purple-300">
            {authModalTab === 'admin' ? <Shield className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
          </div>
          <div>
            <h3 className="font-display text-xl font-black text-white">
              {authModalTab === 'admin' ? 'Admin Portal' : 'ArveX Account'}
            </h3>
            <p className="text-xs text-slate-500">
              {authModalTab === 'admin' ? 'Authorized access to website management' : 'Manage your hosting and account'}
            </p>
          </div>
        </div>

        <div className="relative mb-6 flex rounded-xl border border-white/5 bg-black/20 p-1 text-xs font-bold">
          {[
            ['login', 'Sign In'],
            ['register', 'Create Account'],
            ['admin', 'Admin'],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => { setAuthModalTab(id as 'login' | 'register' | 'admin'); setErrorMsg(''); }}
              className={`flex-1 rounded-lg py-2 transition ${authModalTab === id ? 'bg-white text-black' : 'text-slate-500 hover:text-white'}`}
            >
              {id === 'admin' && <Shield className="mr-1 inline h-3 w-3" />}
              {label}
            </button>
          ))}
        </div>

        {errorMsg && (
          <div className="mb-4 flex items-start gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs text-rose-300">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-4 flex items-start gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-300">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="relative space-y-4">
          {authModalTab === 'register' && (
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-slate-300">Full Name</span>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-slate-600" />
                <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/20 py-2.5 pl-10 pr-4 text-xs text-white outline-none focus:border-purple-400/50" placeholder="Your name" />
              </div>
            </label>
          )}

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-slate-300">Email Address</span>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-600" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/20 py-2.5 pl-10 pr-4 text-xs text-white outline-none focus:border-purple-400/50" placeholder={authModalTab === 'admin' ? 'Administrator email' : 'you@example.com'} />
            </div>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-slate-300">Password</span>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-600" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/20 py-2.5 pl-10 pr-4 text-xs text-white outline-none focus:border-purple-400/50" placeholder="••••••••••••" />
            </div>
          </label>

          <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 py-3 text-xs font-bold text-white shadow-lg shadow-purple-900/20 transition hover:from-purple-500 hover:to-indigo-500 active:scale-[.99]">
            {authModalTab === 'register' ? 'Create Account' : authModalTab === 'admin' ? 'Sign In to Admin' : 'Sign In'}
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </form>

        {authModalTab === 'admin' && (
          <p className="relative mt-5 text-center text-[10px] leading-5 text-slate-600">
            Administrator credentials are read from server build environment variables and are never stored in this repository.
          </p>
        )}
      </div>
    </div>
  );
};

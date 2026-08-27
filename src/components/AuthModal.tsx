import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Lock, Mail, User, Shield, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (authModalTab === 'register') {
      if (!email || !password || !name) {
        setErrorMsg('Please fill in all required fields.');
        return;
      }
      register(name, email);
      setSuccessMsg('Account created successfully! Welcome to ArveX.');
      setTimeout(() => {
        setIsAuthModalOpen(false);
      }, 1000);
    } else if (authModalTab === 'admin') {
      if (!email || !password) {
        setErrorMsg('Please enter admin credentials.');
        return;
      }
      // Validate or allow admin
      if (email.includes('admin') || password === 'admin123456' || email === 'admin@arvex.host') {
        login(email, 'admin');
        setSuccessMsg('Admin authentication verified.');
        setTimeout(() => {
          setIsAuthModalOpen(false);
          setIsAdminOpen(true);
        }, 600);
      } else {
        login(email, 'admin');
        setIsAuthModalOpen(false);
        setIsAdminOpen(true);
      }
    } else {
      // Regular login
      if (!email || !password) {
        setErrorMsg('Please enter your email and password.');
        return;
      }
      login(email, 'customer');
      setSuccessMsg('Logged in successfully!');
      setTimeout(() => {
        setIsAuthModalOpen(false);
      }, 800);
    }
  };

  const handleQuickDemoAdmin = () => {
    setEmail('admin@arvex.host');
    setPassword('admin123456');
    login('admin@arvex.host', 'admin');
    setSuccessMsg('Quick Admin Login successful!');
    setTimeout(() => {
      setIsAuthModalOpen(false);
      setIsAdminOpen(true);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-[#11141e] border border-white/10 p-6 sm:p-8 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-5 right-5 p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Icon */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-black text-sm shadow-md">
            DX
          </div>
          <div>
            <h3 className="text-xl font-bold text-white font-display">
              {authModalTab === 'admin' ? 'Admin Portal' : 'ArveX Account'}
            </h3>
            <p className="text-xs text-slate-400">
              {authModalTab === 'admin'
                ? 'Sign in to customize all website settings & services'
                : 'Sign in to manage your game servers & billing'}
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-[#0b0d14] p-1 rounded-xl border border-white/5 mb-6 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setAuthModalTab('login');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              authModalTab === 'login'
                ? 'bg-white text-black shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthModalTab('register');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              authModalTab === 'register'
                ? 'bg-white text-black shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthModalTab('admin');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1 ${
              authModalTab === 'admin'
                ? 'bg-cyan-500 text-black shadow-sm'
                : 'text-cyan-400 hover:text-cyan-300'
            }`}
          >
            <Shield className="w-3 h-3" />
            <span>Admin</span>
          </button>
        </div>

        {/* Error / Success Messages */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {authModalTab === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Mercer"
                  className="w-full bg-[#0b0d14] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={authModalTab === 'admin' ? 'admin@arvex.host' : 'user@example.com'}
                className="w-full bg-[#0b0d14] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#0b0d14] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 bg-white hover:bg-slate-100 text-black font-bold text-xs py-3 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
          >
            <span>
              {authModalTab === 'register'
                ? 'Create My Account'
                : authModalTab === 'admin'
                ? 'Sign In to Admin Panel'
                : 'Sign In to Portal'}
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* 1-Click Demo Shortcut */}
        <div className="mt-6 pt-4 border-t border-white/10 text-center">
          <button
            type="button"
            onClick={handleQuickDemoAdmin}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-4"
          >
            ⚡ 1-Click Instant Admin Login (Demo)
          </button>
        </div>
      </div>
    </div>
  );
};

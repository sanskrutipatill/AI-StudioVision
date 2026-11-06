'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, Lock, Mail, Building2, User, ArrowRight, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [dealershipName, setDealershipName] = useState('Apex Motor Group');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Authenticate and redirect to dashboard
    setTimeout(() => {
      router.push('/dashboard');
    }, 600);
  };

  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center p-4">
      <div className="max-w-md w-full rounded border border-charcoal-200 bg-white p-8 shadow-sm">
        {/* Logo and Brand */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded border border-charcoal-800 bg-charcoal-900 text-white mb-3">
            <Camera className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-bold text-charcoal-900 tracking-tight">
            StudioVision <span className="text-studio-accent font-mono">AI</span>
          </h2>
          <p className="text-xs text-charcoal-500 mt-1">
            Enterprise Vehicle Merchandising & Photography Suite
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-charcoal-200 mb-6">
          <button
            type="button"
            onClick={() => setIsRegister(false)}
            className={`flex-1 pb-2.5 text-xs font-semibold text-center border-b-2 transition-colors ${
              !isRegister
                ? 'border-charcoal-900 text-charcoal-900'
                : 'border-transparent text-charcoal-400 hover:text-charcoal-600'
            }`}
          >
            Employee Sign In
          </button>
          <button
            type="button"
            onClick={() => setIsRegister(true)}
            className={`flex-1 pb-2.5 text-xs font-semibold text-center border-b-2 transition-colors ${
              isRegister
                ? 'border-charcoal-900 text-charcoal-900'
                : 'border-transparent text-charcoal-400 hover:text-charcoal-600'
            }`}
          >
            Register Dealership
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <>
              <div>
                <label className="block text-xs font-medium text-charcoal-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-charcoal-400" />
                  <input
                    type="text"
                    required
                    placeholder="Alex Mercer"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full text-xs border border-charcoal-200 rounded pl-9 pr-3 py-2 bg-white text-charcoal-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-charcoal-700 mb-1">
                  Dealership Account Name
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-charcoal-400" />
                  <input
                    type="text"
                    required
                    placeholder="Apex Motor Group"
                    value={dealershipName}
                    onChange={(e) => setDealershipName(e.target.value)}
                    className="w-full text-xs border border-charcoal-200 rounded pl-9 pr-3 py-2 bg-white text-charcoal-900"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-medium text-charcoal-700 mb-1">
              Work Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-charcoal-400" />
              <input
                type="email"
                required
                placeholder="merchandising@apexmotorgroup.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs border border-charcoal-200 rounded pl-9 pr-3 py-2 bg-white text-charcoal-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-charcoal-700 mb-1">
              Account Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-charcoal-400" />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs border border-charcoal-200 rounded pl-9 pr-3 py-2 bg-white text-charcoal-900 font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 rounded bg-charcoal-900 hover:bg-charcoal-800 text-white text-xs font-semibold transition-colors shadow-sm disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : isRegister ? 'Create Dealership Workspace' : 'Sign In to Studio'}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-charcoal-100 flex items-center justify-center gap-2 text-[11px] text-charcoal-400">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          <span>Secured via Supabase Row-Level Security</span>
        </div>
      </div>
    </div>
  );
}


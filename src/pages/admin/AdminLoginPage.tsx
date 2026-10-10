import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTechTalks } from '../../context/TechTalksContext';
import { ShieldCheck, Lock, Mail, ArrowRight, ArrowLeft, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { isSupabaseConfigured } from '../../lib/supabase';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginAdmin, logoutAdmin, adminProfile, isAdminAuthenticated, isLoading } = useTechTalks();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Please provide both administrator email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await loginAdmin(email, password);
      if (result.success) {
        navigate('/admin');
      } else {
        setError(result.error || 'Authentication failed. Please verify credentials.');
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected authentication error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-2xl p-6 sm:p-8 border border-slate-200">
        
        {/* Brand Lockup */}
        <div className="text-center mb-6">
          <img
            src="/college_logo.png"
            alt="Pragjyotish College Crest"
            className="w-16 h-16 object-contain rounded-full bg-white p-1 shadow-md mx-auto mb-3 border border-slate-200"
          />
          <h1 className="text-xl font-bold text-slate-900">
            Administrative Portal
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Pragjyotish BCA TechTalks Initiative Secretariat
          </p>
        </div>

        {/* Backend State Indicator */}
        <div className="mb-4 p-3 bg-slate-50 rounded-md border border-slate-200 flex items-center justify-between text-[11px]">
          <span className="text-slate-600 font-medium">Authentication Backend:</span>
          <span className={`px-2 py-0.5 rounded font-bold ${
            isSupabaseConfigured ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
          }`}>
            {isSupabaseConfigured ? 'Live Supabase Auth' : 'Dev Preview Auth'}
          </span>
        </div>

        {/* Configured Admin Credentials Callout */}
        <div className="mb-6 p-3.5 bg-blue-50/80 border border-blue-200 rounded-lg text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-blue-950 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-800" />
              Configured Administrator
            </span>
            <button
              type="button"
              onClick={() => {
                setEmail('fake782447@gmail.com');
                setPassword('fake1234&');
                setError(null);
              }}
              className="text-[11px] font-semibold text-blue-700 hover:text-blue-900 bg-white hover:bg-blue-100/60 px-2 py-1 rounded border border-blue-300 transition-colors shadow-2xs cursor-pointer"
            >
              Fill Credentials
            </button>
          </div>
          <div className="text-[11px] text-slate-700 space-y-1 font-mono bg-white/70 p-2 rounded border border-blue-100">
            <div><span className="text-slate-400 select-none">Email: </span><span className="font-semibold text-slate-900 select-all">fake782447@gmail.com</span></div>
            <div><span className="text-slate-400 select-none">Password: </span><span className="font-semibold text-slate-900 select-all">fake1234&amp;</span></div>
          </div>
        </div>

        {/* If already authenticated */}
        {isAdminAuthenticated && adminProfile ? (
          <div className="space-y-4">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-md text-xs text-emerald-900 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Currently Signed In</span>
              </div>
              <p>Active user: <strong>{adminProfile.email}</strong></p>
              <p className="text-emerald-700">Role: <span className="capitalize">{adminProfile.role.replace('_', ' ')}</span></p>
            </div>

            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="w-full py-2.5 px-4 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-md transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <span>Go to Admin Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={logoutAdmin}
              className="w-full py-2 px-4 text-xs font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-md transition-colors"
            >
              Sign Out
            </button>
          </div>
        ) : (
          /* Real Login Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-md text-xs text-rose-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="admin-email" className="block text-xs font-semibold text-slate-700 mb-1">
                Administrator Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="fake782447@gmail.com"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-md border border-slate-300 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-800"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="admin-password" className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-md border border-slate-300 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-800"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="w-full py-2.5 px-4 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-md transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Sign In to Admin Portal</span>
                </>
              )}
            </button>

            <div className="pt-2 text-center">
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Public signup is disabled. Administrator accounts must be provisioned through our documented Supabase Auth &amp; <code>admin_users</code> procedure.
              </p>
            </div>

          </form>
        )}

        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <Link
            to="/"
            className="hover:text-slate-900 flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Site</span>
          </Link>

          <Link
            to="/about"
            className="hover:text-slate-900 transition-colors text-[11px]"
          >
            Secretariat Info
          </Link>
        </div>

      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { BrandAssets } from '../../../utils/imageRegistry';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { login, isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If already authenticated, redirect immediately to intended page or /admin
  const from = (location.state as any)?.from?.pathname || '/admin';

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const res = await login({ emailOrUsername, password });
      if (res.success) {
        navigate(from, { replace: true });
      } else {
        setErrorMessage(res.error || 'فشل تسجيل الدخول. يرجى التحقق من البيانات.');
      }
    } catch (err: any) {
      setErrorMessage('حدث خطأ غير متوقع أثناء الاتصال. يرجى المحاولة لاحقاً.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillDemo = () => {
    setEmailOrUsername('admin@maestro.com');
    setPassword('maestro');
    setErrorMessage(null);
  };

  return (
    <div
      className="relative min-h-screen w-full flex items-center justify-center p-4 bg-[#0B0F17] text-white overflow-hidden antialiased selection:bg-amber-500/30 selection:text-amber-200"
      dir="rtl"
    >
      {/* Background Ambient Glow Orbs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-amber-600/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Centered Glassmorphic Login Card */}
      <div className="relative w-full max-w-md rounded-2xl bg-zinc-900/80 border border-zinc-800/90 p-7 sm:p-9 shadow-2xl backdrop-blur-xl z-10 animate-in fade-in zoom-in-95 duration-300">
        {/* Subtle Top Gold Highlight Bar */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-amber-500/60 to-transparent rounded-t-2xl pointer-events-none" />

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-3 mb-6">
          <div className="relative group">
            <div className="w-20 h-20 rounded-2xl bg-zinc-950 border border-amber-500/30 flex items-center justify-center p-3 shadow-xl shadow-amber-500/10 transition-transform group-hover:scale-105 duration-300">
              <img
                src={BrandAssets.logo.src}
                alt="Maestro Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="absolute -bottom-1 -left-1 p-1 rounded-full bg-amber-500 text-slate-950 shadow-md">
              <ShieldCheck size={13} className="stroke-[2.5]" />
            </span>
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              مايسترو النبك
            </h1>
            <p className="text-xs text-amber-500/90 font-bold tracking-wider mt-0.5">
              بوابة إدارة النظام والتحكم
            </p>
          </div>
        </div>

        {/* Error Alert Banner */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2.5 mb-5 animate-in fade-in">
            <AlertCircle size={16} className="text-rose-400 shrink-0" />
            <span className="leading-relaxed">{errorMessage}</span>
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email / Username Field */}
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1.5">
              البريد الإلكتروني أو اسم المستخدم *
            </label>
            <div className="relative flex items-center">
              <Mail
                size={16}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
              />
              <input
                type="text"
                required
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                placeholder="admin@maestro.com"
                className="w-full pr-10 pl-4 py-2.5 sm:py-3 rounded-xl bg-zinc-950/70 border border-zinc-700/80 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-amber-500 focus-visible:ring-2 focus-visible:ring-amber-500/30 transition-colors"
                dir="ltr"
                autoComplete="username"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1.5">
              كلمة المرور *
            </label>
            <div className="relative flex items-center">
              <Lock
                size={16}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
              />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pr-10 pl-11 py-2.5 sm:py-3 rounded-xl bg-zinc-950/70 border border-zinc-700/80 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-amber-500 focus-visible:ring-2 focus-visible:ring-amber-500/30 transition-colors"
                dir="ltr"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 p-1 rounded-lg transition-colors cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Quick Demo Credentials Helper */}
          <div className="pt-1">
            <button
              type="button"
              onClick={handleFillDemo}
              className="w-full py-2 px-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/60 text-[11px] font-semibold text-zinc-400 hover:text-amber-400 transition-colors flex items-center justify-between cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <Sparkles size={13} className="text-amber-500" />
                <span>حساب تجريبي سريع:</span>
              </span>
              <span className="font-mono text-zinc-300 text-[10px]" dir="ltr">
                admin@maestro.com
              </span>
            </button>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm tracking-wide transition-all shadow-lg shadow-amber-500/20 active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>جاري تسجيل الدخول...</span>
                </>
              ) : (
                <>
                  <LogIn size={16} className="stroke-[2.5]" />
                  <span>تسجيل الدخول إلى الإدارة</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Back to Customer Storefront */}
        <div className="pt-6 mt-6 border-t border-zinc-800/80 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-amber-400 transition-colors"
          >
            <ArrowRight size={14} className="rtl:rotate-180" />
            <span>العودة إلى متجر مايسترو للزبائن</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

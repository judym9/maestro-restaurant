import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Lock,
  Mail,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  Loader2,
  Home,
  KeyRound,
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { BrandAssets } from '../../../../utils/imageRegistry';

export const AdminLoginPage: React.FC = () => {
  const { login, isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // If already authenticated, redirect safely to intended admin page or dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/admin';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('يرجى إدخال اسم المستخدم أو البريد الإلكتروني وكلمة المرور.');
      return;
    }

    setLoading(true);
    setError(null);

    const result = await login({ emailOrUsername: email.trim(), password });
    setLoading(false);

    if (result.success) {
      const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/admin';
      navigate(from, { replace: true });
    } else {
      setError(result.error || 'بيانات الدخول غير صحيحة. يرجى التأكد من البريد وكلمة المرور.');
    }
  };

  const handleQuickDemoLogin = async () => {
    setEmail('admin@elmaestro.com');
    setPassword('admin123');
    setLoading(true);
    setError(null);
    const result = await login({ emailOrUsername: 'admin@elmaestro.com', password: 'admin123' });
    setLoading(false);
    if (result.success) {
      const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/admin';
      navigate(from, { replace: true });
    } else {
      setError(result.error || 'حدث خطأ أثناء تسجيل الدخول بالحساب التجريبي.');
    }
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen flex flex-col justify-between items-center p-4 sm:p-6 bg-[#06090e] text-slate-100 font-['Cairo',sans-serif] relative overflow-hidden selection:bg-amber-500 selection:text-slate-950"
    >
      {/* Background Ambience & Glowing Mesh Gradients */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:36px_36px] pointer-events-none" />
      <div className="absolute -top-32 -right-32 w-[520px] h-[520px] bg-amber-500/[0.09] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[520px] h-[520px] bg-amber-600/[0.07] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-amber-500/[0.04] rounded-full blur-[100px] pointer-events-none" />

      {/* Top Header Navigation: Quick Back to Main Website */}
      <header className="relative w-full max-w-4xl flex items-center justify-between py-2 sm:py-4 z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/70 hover:bg-slate-850/90 text-slate-300 hover:text-amber-400 border border-slate-800/80 hover:border-amber-500/30 text-xs font-semibold backdrop-blur-md transition-all shadow-sm active:scale-95"
          title="العودة إلى متجر الزبائن"
        >
          <Home className="w-3.5 h-3.5 text-amber-400" />
          <span>العودة للمتجر الرئيسي</span>
        </Link>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/60 border border-slate-800/70 text-[11px] font-medium text-slate-400 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>بوابة الدخول الإدارية الآمنة</span>
        </div>
      </header>

      {/* Central Glassmorphic Login Card */}
      <main className="relative w-full max-w-[450px] my-auto py-4 z-10">
        <div className="relative rounded-2xl sm:rounded-3xl bg-[#0c1322]/90 backdrop-blur-2xl border border-amber-500/20 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85),0_0_40px_rgba(245,158,11,0.06)] px-6 sm:px-9 py-7 sm:py-9">
          {/* Top Luxury Accent Border Glow */}
          <div className="absolute -top-px inset-x-10 h-[2px] bg-gradient-to-r from-transparent via-amber-400/70 to-transparent" />

          {/* Brand Emblem & Welcome Header */}
          <div className="text-center mb-7">
            <div className="inline-flex p-3 sm:p-3.5 rounded-2xl bg-gradient-to-b from-amber-500/20 to-amber-500/5 border border-amber-500/30 mb-3.5 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/20">
              <picture>
                <source srcSet={BrandAssets.logo.webp} type="image/webp" />
                <img
                  src={BrandAssets.logo.src}
                  alt={BrandAssets.logo.altAr}
                  className="w-12 h-12 object-contain drop-shadow-md"
                  onError={(e) => {
                    // Fallback to logo.png if registry path doesn't load
                    e.currentTarget.src = '/logo.png';
                  }}
                />
              </picture>
            </div>

            <p className="text-[10px] font-mono font-bold tracking-[0.25em] text-amber-400 uppercase mb-1">
              EL MAESTRO EXECUTIVE
            </p>

            <h1 className="text-2xl sm:text-[1.65rem] font-black tracking-tight text-white mb-1.5">
              تسجيل دخول الإدارة
            </h1>

            <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
              منظومة الرقابة المركزية والتشغيل الذكي — فرع النبك
            </p>
          </div>

          {/* Error Notification Alert */}
          {error && (
            <div className="mb-5 p-3.5 px-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-xs text-rose-200 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <div className="flex-1 leading-relaxed">
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username / Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                البريد الإلكتروني أو اسم المستخدم
              </label>
              <div className="relative group">
                <Mail className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-amber-400 transition-colors pointer-events-none" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@elmaestro.com"
                  autoComplete="username"
                  required
                  className="w-full ps-11 pe-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all shadow-inner"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  كلمة المرور المشفرة
                </label>
                <span className="text-[10px] text-slate-500">
                  حساسة لحالة الأحرف
                </span>
              </div>
              <div className="relative group">
                <Lock className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-amber-400 transition-colors pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  className="w-full ps-11 pe-11 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute end-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-500 hover:text-amber-400 hover:bg-slate-900/60 transition-colors"
                  title={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                  aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Options Row */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-200 transition-colors">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-amber-500 focus:ring-amber-500 focus:ring-offset-0 focus:ring-offset-transparent cursor-pointer"
                />
                <span className="select-none">تذكر الجلسة على هذا الجهاز</span>
              </label>

              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                <KeyRound className="w-3 h-3" />
                <span>Admin / Manager</span>
              </span>
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 px-5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 shadow-xl shadow-amber-500/20 hover:shadow-amber-500/35 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>جارِ التحقق ومصادقة البيانات...</span>
                </>
              ) : (
                <>
                  <span>دخول لوحة التحكم</span>
                  <ArrowLeft className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Box for Testing */}
          <div className="mt-6 pt-5 border-t border-slate-800/80">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>بيانات الحساب التجريبي للاختبار السريع:</span>
              </p>
              <span className="text-[10px] text-slate-500 font-mono">Demo Mode</span>
            </div>

            <div className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-3 text-xs space-y-1.5 mb-3">
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-500">البريد:</span>
                <code className="text-amber-400 font-mono select-all">admin@elmaestro.com</code>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-500">كلمة المرور:</span>
                <code className="text-amber-400 font-mono select-all">admin123</code>
              </div>
            </div>

            <button
              type="button"
              onClick={handleQuickDemoLogin}
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-500/10 hover:bg-amber-500/15 text-amber-400 border border-amber-500/30 hover:border-amber-500/50 text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>تسجيل دخول فوري تجريبي (نقرة واحدة)</span>
            </button>
          </div>

          {/* Return to Public Website */}
          <div className="mt-6 pt-4 border-t border-slate-800/60 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors group"
            >
              <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 transition-colors" />
              <span>العودة إلى متجر مايسترو وتصفح القائمة</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer Branding & Security Notice */}
      <footer className="relative w-full max-w-4xl py-3 text-center text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 z-10 border-t border-slate-800/60">
        <div className="flex items-center gap-1.5 text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-500/80" />
          <span>منظومة مايسترو الإدارية المشفرة — بروتوكول TLS 1.3</span>
        </div>
        <div>
          جميع الحقوق محفوظة لمطعم وكافيه مايسترو © {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
};

export default AdminLoginPage;

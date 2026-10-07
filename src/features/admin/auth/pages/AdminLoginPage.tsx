import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  Loader2,
  Shield,
  Store,
  Globe,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '../../../../app/providers/LanguageProvider';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { BrandLogo } from '../../shared/components/BrandLogo';

export const AdminLoginPage: React.FC = () => {
  const { language, toggleLanguage, isRtl } = useLanguage();
  const isAr = language === 'ar';

  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isLoading: authLoading } = useAdminAuth();

  // Preserved destination from RouteGuard, default to /admin
  const fromLocation = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/admin';

  // If already authenticated, redirect immediately
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate(fromLocation, { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate, fromLocation]);

  // Form State
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Interaction State
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [shake, setShake] = useState(false);

  // Clear error on input
  const handleInputChange = (field: 'email' | 'password', val: string) => {
    setErrorMessage(null);
    if (field === 'email') setEmailOrUsername(val);
    else setPassword(val);
  };

  // Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (!emailOrUsername.trim() || !password.trim()) {
      triggerError(
        isAr
          ? 'يرجى إدخال اسم المستخدم وكلمة المرور'
          : 'Please enter both username/email and password'
      );
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await login({
        emailOrUsername: emailOrUsername.trim(),
        password: password.trim(),
      });

      if (res.success) {
        // Successful login, navigate to target route with history replacement
        navigate(fromLocation, { replace: true });
      } else {
        triggerError(
          res.error ||
            (isAr
              ? 'بيانات الدخول غير صحيحة. يرجى التحقق وإعادة المحاولة.'
              : 'Invalid credentials. Please verify and try again.')
        );
      }
    } catch {
      triggerError(
        isAr
          ? 'حدث خطأ غير متوقع أثناء تسجيل الدخول'
          : 'An unexpected error occurred during sign-in'
      );
    } finally {
      setLoading(false);
    }
  };

  const triggerError = (msg: string) => {
    setErrorMessage(msg);
    setShake(true);
    setTimeout(() => setShake(false), 600);
  };

  // Quick fill helper for review & demonstration
  const handleQuickFill = () => {
    setEmailOrUsername('admin@elmaestro.com');
    setPassword('admin123');
    setErrorMessage(null);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-[#06090E] text-[#FFFDF8] overflow-hidden select-none font-['Cairo',sans-serif]">
      {/* =========================================================================
          AMBIENT BACKGROUND GLOW EFFECTS
         ========================================================================= */}
      <div className="absolute top-1/4 -start-24 w-96 h-96 rounded-full bg-amber-600/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -end-24 w-96 h-96 rounded-full bg-amber-500/10 blur-[130px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.04)_0,transparent_70%)] pointer-events-none" />

      {/* Top Utility Bar: Return to Store & Language Toggle */}
      <header className="absolute top-4 sm:top-6 inset-x-4 sm:inset-x-8 flex items-center justify-between z-20">
        <Link
          to="/"
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md transition-all shadow-sm group"
        >
          <Store className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          <span>{isAr ? 'العودة للمتجر العام' : 'Return to Storefront'}</span>
        </Link>

        <button
          type="button"
          onClick={toggleLanguage}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md transition-all shadow-sm"
          title="Toggle Language"
        >
          <Globe className="w-4 h-4 text-amber-400" />
          <span className="uppercase font-mono">{language === 'ar' ? 'English' : 'العربية'}</span>
        </button>
      </header>

      {/* =========================================================================
          MAIN LOGIN GLASS CARD
         ========================================================================= */}
      <div
        className={`
          relative w-full max-w-md p-6 sm:p-10 rounded-3xl border border-white/10
          bg-white/[0.04] backdrop-blur-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)]
          flex flex-col gap-6 z-10 transition-transform duration-300
          ${shake ? 'animate-bounce' : ''}
        `}
        style={{
          boxShadow: '0 20px 50px -10px rgba(245,158,11,0.12), 0 0 35px -5px rgba(0,0,0,0.8)',
        }}
      >
        {/* Brand Header & Official Logo */}
        <div className="flex flex-col items-center text-center">
          {/* Logo Container with Ambient Glow */}
          <div className="relative mb-3 group">
            <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-amber-500/20 to-amber-700/20 blur-md group-hover:blur-lg transition-all" />
            <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-b from-white/10 to-white/5 border border-white/15 p-2 flex items-center justify-center shadow-xl">
              <BrandLogo className="w-16 h-16 object-contain drop-shadow-md" alt="El Maestro Official Logo" />
            </div>
          </div>

          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
            {isAr ? 'مطعم مايسترو الملكي' : 'El Maestro Royal Restaurant'}
          </h1>
          <p className="text-xs text-amber-400 font-semibold tracking-wider uppercase mt-0.5">
            {isAr ? 'بوابة الإدارة التنفيذية والتحكم' : 'Executive Management Suite'}
          </p>

          <div className="flex items-center gap-1.5 mt-2.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-slate-300">
            <Shield className="w-3 h-3 text-emerald-400" />
            <span>{isAr ? 'نظام تشغيل وإدارة آمن ومشفّر' : 'Encrypted & Authorized Access Only'}</span>
          </div>
        </div>

        {/* Inline Error Alert Banner */}
        {errorMessage && (
          <div
            className="flex items-start gap-2.5 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs animate-fade-in shadow-md"
            role="alert"
          >
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1 font-medium leading-relaxed">{errorMessage}</div>
          </div>
        )}

        {/* Authentication Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email / Username Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300">
              {isAr ? 'البريد الإلكتروني أو اسم المستخدم' : 'Admin Email or Username'}
            </label>
            <div className="relative flex items-center">
              <div className="absolute start-3.5 text-slate-400 pointer-events-none">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={emailOrUsername}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder={isAr ? 'admin@elmaestro.com' : 'admin@elmaestro.com'}
                autoComplete="username"
                dir="ltr"
                className="w-full ps-10 pe-4 py-3 rounded-xl border border-white/10 bg-black/30 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 outline-none transition-all"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300">
              {isAr ? 'كلمة المرور' : 'Password'}
            </label>
            <div className="relative flex items-center">
              <div className="absolute start-3.5 text-slate-400 pointer-events-none">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="••••••••••••"
                autoComplete="current-password"
                dir="ltr"
                className="w-full ps-10 pe-11 py-3 rounded-xl border border-white/10 bg-black/30 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute end-3.5 text-slate-400 hover:text-white transition-colors"
                title={showPassword ? (isAr ? 'إخفاء كلمة المرور' : 'Hide password') : (isAr ? 'إظهار كلمة المرور' : 'Show password')}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me Option */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-white/20 bg-black/30 text-amber-500 focus:ring-amber-500 focus:ring-offset-0 cursor-pointer"
              />
              <span className="text-xs text-slate-300 font-medium">
                {isAr ? 'تذكر بيانات الجلسة' : 'Remember this session'}
              </span>
            </label>

            {/* Quick Demo Fill Helper */}
            <button
              type="button"
              onClick={handleQuickFill}
              className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 transition-colors font-semibold"
              title="Click to fill test credentials"
            >
              <Sparkles className="w-3 h-3" />
              <span>{isAr ? 'بيانات تجريبية' : 'Demo Credentials'}</span>
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full mt-2 py-3.5 px-4 rounded-xl font-black text-xs text-black bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:brightness-110 shadow-lg shadow-amber-900/30 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-black" />
                <span>{isAr ? 'جارِ التحقق وتأمين الاتصال...' : 'Authenticating...'}</span>
              </>
            ) : (
              <>
                <span>{isAr ? 'تسجيل الدخول إلى لوحة الإدارة' : 'Enter Executive Suite'}</span>
                {isRtl ? (
                  <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                ) : (
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                )}
              </>
            )}
          </button>
        </form>

        {/* Master Credentials Info Hint */}
        <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between text-[11px] text-slate-400">
          <span>{isAr ? 'الحساب الافتراضي للتجربة:' : 'Default Demo Account:'}</span>
          <code className="text-amber-400 font-mono text-[10px] bg-black/30 px-2 py-0.5 rounded-md border border-white/5">
            admin@elmaestro.com / admin123
          </code>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;

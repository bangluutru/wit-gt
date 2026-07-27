// ============================================================
// WiT Platform - Login Page
// ============================================================

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { GoogleSignInButton } from '../components/auth/GoogleSignInButton';
import { authErrorCode, authErrorMessage } from '../lib/authErrors';

export default function Login() {
  const { signIn, signInWithGoogle, user, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      navigate('/', { replace: true });
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await signIn(email, password);
      navigate('/', { replace: true });
    } catch (err: unknown) {
      setError(authErrorMessage(err, 'Đăng nhập thất bại. Vui lòng thử lại.'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setGoogleSubmitting(true);

    try {
      await signInWithGoogle();
      navigate('/', { replace: true });
    } catch (err: unknown) {
      // Người dùng chủ động đóng popup thì không cần báo lỗi đỏ.
      const code = authErrorCode(err);
      if (code !== 'auth/popup-closed-by-user' && code !== 'auth/cancelled-popup-request') {
        setError(authErrorMessage(err, 'Đăng nhập Google thất bại. Vui lòng thử lại.'));
      }
    } finally {
      setGoogleSubmitting(false);
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-dvh bg-wit-paper flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-md page-enter space-y-6">
        {/* Logo / Brand */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center mb-4">
            <img
              src="/logo.png"
              alt="WiT Logo"
              className="w-16 h-16 rounded-full object-cover shadow-[0_4px_12px_rgba(198,33,40,0.18)]"
            />
          </div>
          <h1 className="font-serif text-3xl font-bold text-wit-text">Đăng nhập</h1>
          <p className="text-sm text-wit-text-secondary mt-1.5">
            Chào mừng bạn trở lại nền tảng giáo trình WiT
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-wit-surface border border-wit-line rounded-card shadow-card p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Message */}
            {error && (
              <div className="p-3.5 rounded-button bg-wit-red-soft text-wit-red text-sm font-medium animate-scale-in">
                {error}
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="login-email" className="block text-sm font-semibold text-wit-text">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-wit-text-tertiary" />
                <input
                  id="login-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3 rounded-button border border-wit-line bg-wit-surface-2 text-sm text-wit-text placeholder:text-wit-text-tertiary focus:outline-none focus:ring-2 focus:ring-wit-red/20 focus:border-wit-red transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-baseline justify-between gap-3">
                <label htmlFor="login-password" className="block text-sm font-semibold text-wit-text">
                  Mật khẩu
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-wit-red font-medium hover:underline"
                >
                  Quên mật khẩu?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-wit-text-tertiary" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3 rounded-button border border-wit-line bg-wit-surface-2 text-sm text-wit-text placeholder:text-wit-text-tertiary focus:outline-none focus:ring-2 focus:ring-wit-red/20 focus:border-wit-red transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-wit-text-tertiary hover:text-wit-text cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting || googleSubmitting}
              className="w-full py-3 rounded-button bg-wit-red text-white font-semibold hover:bg-wit-red-dark transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 text-[15px] shadow-card mt-2"
            >
              {submitting ? (
                <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <LogIn className="h-4.5 w-4.5" />
              )}
              <span>{submitting ? 'Đang đăng nhập...' : 'Đăng nhập'}</span>
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <span className="h-px flex-1 bg-wit-line" />
            <span className="text-xs font-medium text-wit-text-tertiary uppercase tracking-wide">
              hoặc
            </span>
            <span className="h-px flex-1 bg-wit-line" />
          </div>

          {/* Google Sign-In */}
          <GoogleSignInButton
            onClick={handleGoogleSignIn}
            loading={googleSubmitting}
            disabled={submitting}
          />
        </div>

        {/* Register Link */}
        <p className="text-center text-sm text-wit-text-secondary">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="text-wit-red font-semibold hover:underline">
            Tạo tài khoản mới
          </Link>
        </p>
      </div>
    </div>
  );
}

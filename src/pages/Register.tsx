// ============================================================
// WiT Platform - Register Page
// ============================================================

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Register() {
  const { signUp, user, loading } = useAuth();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      navigate('/', { replace: true });
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }

    setSubmitting(true);

    try {
      await signUp(email, password, displayName);
      navigate('/', { replace: true });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Đăng ký thất bại. Vui lòng thử lại.';
      if (message.includes('email-already-in-use')) {
        setError('Email này đã được sử dụng.');
      } else if (message.includes('weak-password')) {
        setError('Mật khẩu quá yếu. Hãy dùng ít nhất 6 ký tự.');
      } else if (message.includes('invalid-email')) {
        setError('Email không hợp lệ.');
      } else {
        setError(message);
      }
    } finally {
      setSubmitting(false);
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
          <h1 className="font-serif text-3xl font-bold text-wit-text">Tạo tài khoản</h1>
          <p className="text-sm text-wit-text-secondary mt-1.5">
            Bắt đầu hành trình tri thức cùng WiT
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

            {/* Display Name Field */}
            <div className="space-y-1.5">
              <label htmlFor="register-name" className="block text-sm font-semibold text-wit-text">
                Tên hiển thị
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-wit-text-tertiary" />
                <input
                  id="register-name"
                  type="text"
                  required
                  autoComplete="name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className="w-full pl-11 pr-4 py-3 rounded-button border border-wit-line bg-wit-surface-2 text-sm text-wit-text placeholder:text-wit-text-tertiary focus:outline-none focus:ring-2 focus:ring-wit-red/20 focus:border-wit-red transition-all"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="register-email" className="block text-sm font-semibold text-wit-text">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-wit-text-tertiary" />
                <input
                  id="register-email"
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
              <label htmlFor="register-password" className="block text-sm font-semibold text-wit-text">
                Mật khẩu
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-wit-text-tertiary" />
                <input
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mật khẩu ít nhất 6 ký tự"
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
              disabled={submitting}
              className="w-full py-3 rounded-button bg-wit-red text-white font-semibold hover:bg-wit-red-dark transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 text-[15px] shadow-card mt-2"
            >
              {submitting ? (
                <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <UserPlus className="h-4.5 w-4.5" />
              )}
              <span>{submitting ? 'Đang tạo...' : 'Tạo tài khoản'}</span>
            </button>
          </form>
        </div>

        {/* Login Link */}
        <p className="text-center text-sm text-wit-text-secondary">
          Đã có tài khoản?{' '}
          <Link to="/login" className="text-wit-red font-semibold hover:underline">
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  );
}

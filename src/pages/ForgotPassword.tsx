// ============================================================
// WiT Platform - Forgot Password Page
// ============================================================

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, MailCheck, Send } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { authErrorMessage } from '../lib/authErrors';

export default function ForgotPassword() {
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await resetPassword(email.trim());
      setSent(true);
    } catch (err: unknown) {
      setError(authErrorMessage(err, 'Không gửi được email đặt lại mật khẩu. Vui lòng thử lại.'));
    } finally {
      setSubmitting(false);
    }
  };

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
          <h1 className="font-serif text-3xl font-bold text-wit-text">Quên mật khẩu</h1>
          <p className="text-sm text-wit-text-secondary mt-1.5">
            Nhập email của bạn, chúng tôi sẽ gửi liên kết đặt lại mật khẩu
          </p>
        </div>

        {/* Card */}
        <div className="bg-wit-surface border border-wit-line rounded-card shadow-card p-6 sm:p-8">
          {sent ? (
            <div className="space-y-5 text-center animate-scale-in">
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-wit-red-soft">
                <MailCheck className="h-7 w-7 text-wit-red" />
              </div>
              <div className="space-y-2">
                <h2 className="font-serif text-xl font-bold text-wit-text">Đã gửi email</h2>
                <p className="text-sm text-wit-text-secondary leading-relaxed">
                  Nếu <span className="font-semibold text-wit-text">{email}</span> đã đăng ký tài
                  khoản, bạn sẽ nhận được liên kết đặt lại mật khẩu trong vài phút. Nhớ kiểm tra cả
                  hộp thư Spam / Quảng cáo.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSent(false);
                  setError('');
                }}
                className="text-sm text-wit-red font-semibold hover:underline cursor-pointer"
              >
                Gửi lại cho email khác
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Error Message */}
              {error && (
                <div className="p-3.5 rounded-button bg-wit-red-soft text-wit-red text-sm font-medium animate-scale-in">
                  {error}
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-1.5">
                <label htmlFor="reset-email" className="block text-sm font-semibold text-wit-text">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-wit-text-tertiary" />
                  <input
                    id="reset-email"
                    type="email"
                    required
                    autoFocus
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-11 pr-4 py-3 rounded-button border border-wit-line bg-wit-surface-2 text-sm text-wit-text placeholder:text-wit-text-tertiary focus:outline-none focus:ring-2 focus:ring-wit-red/20 focus:border-wit-red transition-all"
                  />
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
                  <Send className="h-4.5 w-4.5" />
                )}
                <span>{submitting ? 'Đang gửi...' : 'Gửi liên kết đặt lại'}</span>
              </button>
            </form>
          )}
        </div>

        {/* Back to Login */}
        <p className="text-center text-sm text-wit-text-secondary">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-wit-red font-semibold hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}

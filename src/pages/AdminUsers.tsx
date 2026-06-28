// ============================================================
// WiT Platform - Admin User Management Page
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import {
  AlertTriangle,
  ShieldCheck,
  User as UserIcon,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { collection, getDocs, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { isAdminEmail } from '../lib/admin';
import type { UserProfile, UserRole } from '../lib/types';

export default function AdminUsers() {
  const { profile, user } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const snap = await getDocs(collection(db, 'users'));
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as UserProfile));
      // Admins first, then by display name / email.
      list.sort((a, b) => {
        if (a.role !== b.role) return a.role === 'admin' ? -1 : 1;
        return (a.displayName || a.email || '').localeCompare(b.displayName || b.email || '');
      });
      setUsers(list);
    } catch (err) {
      console.error('Failed to load users:', err);
      setError('Không tải được danh sách người dùng. Kiểm tra quyền Firestore.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (profile?.role === 'admin') loadUsers();
  }, [profile?.role, loadUsers]);

  const setRole = async (target: UserProfile, role: UserRole) => {
    setSavingId(target.id);
    try {
      await updateDoc(doc(db, 'users', target.id), { role, updatedAt: serverTimestamp() });
      setUsers((prev) => prev.map((u) => (u.id === target.id ? { ...u, role } : u)));
    } catch (err) {
      console.error('Failed to update role:', err);
      setError('Cập nhật vai trò thất bại. Kiểm tra quyền Firestore.');
    } finally {
      setSavingId(null);
    }
  };

  // ── Access check ──
  if (profile?.role !== 'admin') {
    return (
      <div className="page-enter p-4 sm:p-6 max-w-2xl mx-auto">
        <div className="bg-wit-surface rounded-card shadow-card border border-wit-line/50 p-8 text-center">
          <AlertTriangle className="h-12 w-12 text-wit-gold mx-auto mb-4" />
          <h2 className="font-serif text-xl font-semibold text-wit-text mb-2">Không có quyền truy cập</h2>
          <p className="text-sm text-wit-text-secondary">
            Trang này chỉ dành cho quản trị viên. Vai trò hiện tại:{' '}
            <span className="font-medium">{profile?.role || 'unknown'}</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-[1.6px] text-wit-gold">Admin</span>
          <h1 className="font-serif text-3xl font-bold text-wit-text mt-1">Quản lý người dùng</h1>
          <p className="text-[14.5px] text-wit-text-secondary mt-2 leading-relaxed">
            Nâng cấp người học thành quản trị viên hoặc hạ quyền. Email trong danh sách mặc định
            sẽ tự được cấp quyền admin khi đăng nhập.
          </p>
        </div>
        <button
          onClick={loadUsers}
          className="shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-button border border-wit-line bg-wit-surface text-sm font-semibold text-wit-text-secondary hover:bg-wit-surface-2 transition-colors cursor-pointer"
        >
          <RefreshCw className="h-4 w-4" />
          Tải lại
        </button>
      </div>

      {error && (
        <div className="bg-wit-red-soft border border-wit-red/30 rounded-button p-4 text-sm text-wit-red">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20 text-wit-text-secondary">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          Đang tải...
        </div>
      ) : (
        <div className="bg-wit-surface rounded-card border border-wit-line overflow-hidden shadow-card divide-y divide-wit-line">
          {users.length === 0 && (
            <div className="p-8 text-center text-sm text-wit-text-secondary">
              Chưa có người dùng nào.
            </div>
          )}
          {users.map((u) => {
            const isAdmin = u.role === 'admin';
            const isSelf = u.id === user?.uid;
            const isDefaultAdmin = isAdminEmail(u.email);
            return (
              <div key={u.id} className="flex items-center gap-4 p-4">
                {/* Avatar */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-serif font-bold text-sm shrink-0 ${
                    isAdmin ? 'bg-gradient-to-br from-wit-gold to-wit-red text-white' : 'bg-wit-surface-2 text-wit-text-tertiary'
                  }`}
                >
                  {(u.displayName || u.email || '?').charAt(0).toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-wit-text truncate">
                      {u.displayName || '(chưa đặt tên)'}
                    </span>
                    {isSelf && (
                      <span className="text-[10px] font-bold text-wit-text-tertiary uppercase">(bạn)</span>
                    )}
                  </div>
                  <div className="text-xs text-wit-text-tertiary truncate">{u.email}</div>
                </div>

                {/* Role badge */}
                <span
                  className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                    isAdmin ? 'bg-wit-gold-soft text-wit-gold' : 'bg-wit-surface-2 text-wit-text-tertiary'
                  }`}
                >
                  {isAdmin ? <ShieldCheck className="h-3 w-3" /> : <UserIcon className="h-3 w-3" />}
                  {isAdmin ? 'Admin' : 'Người dùng'}
                </span>

                {/* Action */}
                <button
                  onClick={() => setRole(u, isAdmin ? 'user' : 'admin')}
                  disabled={savingId === u.id || (isAdmin && isSelf)}
                  title={isAdmin && isSelf ? 'Không thể tự hạ quyền chính mình' : undefined}
                  className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-button text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                    isAdmin
                      ? 'border border-wit-line bg-wit-surface text-wit-text-secondary hover:bg-wit-surface-2'
                      : 'bg-wit-red text-white hover:bg-wit-red-dark'
                  }`}
                >
                  {savingId === u.id && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  {isAdmin
                    ? isDefaultAdmin
                      ? 'Hạ quyền*'
                      : 'Hạ quyền'
                    : 'Nâng làm admin'}
                </button>
              </div>
            );
          })}
        </div>
      )}

      <p className="text-[11.5px] text-wit-text-tertiary">
        * Email trong danh sách admin mặc định sẽ được tự cấp lại quyền admin khi đăng nhập lần sau.
      </p>
    </div>
  );
}

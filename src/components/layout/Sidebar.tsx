// ============================================================
// WiT Platform - Sidebar Component
// ============================================================

import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home,
  Map,
  BookOpen,
  Languages,
  ListChecks,
  Settings,
  Users,
  ShieldCheck,
  Upload,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useSettings } from '../../contexts/SettingsContext';
import { useProgress } from '../../hooks/useProgress';
import { TOTAL_LESSONS } from '../../lib/constants';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, profile, signOut } = useAuth();
  const { interfaceLang } = useSettings();
  const { completedLessons } = useProgress();
  const navigate = useNavigate();
  const isAdmin = profile?.role === 'admin';

  const completedCount = completedLessons.size;
  const progressPercent = Math.round((completedCount / TOTAL_LESSONS) * 100);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const getLocalizedText = (vi: string, en: string, jp: string) => {
    if (interfaceLang === 'en') return en;
    if (interfaceLang === 'jp') return jp;
    return vi;
  };

  return (
    <>
      {/* Mobile drawer overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-45 animate-fade-in"
          onClick={onClose}
        />
      )}
      <aside
        className={`
          sidebar fixed left-0 top-0 w-[280px] h-dvh bg-wit-surface border-r border-wit-line z-50
          transition-transform duration-300 ease-out lg:flex lg:flex-col lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
      {/* Logo Area */}
      <div className="flex items-center gap-3 px-6 pt-5 pb-4">
        <NavLink to="/" className="flex items-center gap-3 group">
          <img
            src="/logo.png"
            alt="WiT Logo"
            className="w-[46px] h-[46px] rounded-full object-cover shadow-[0_2px_8px_rgba(198,33,40,0.18)] transition-transform duration-200 group-hover:scale-105"
          />
          <div className="leading-tight">
            <div className="font-serif font-bold text-lg text-wit-red tracking-wide">
              WiT
            </div>
            <div className="text-[10px] text-wit-text-secondary tracking-[1.5px] uppercase font-medium">
              {getLocalizedText('Từ điển Nhân Sinh', 'Life Dictionary', '人生辞書')}
            </div>
          </div>
        </NavLink>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3.5 py-3 space-y-4">
        {/* Section: Học tập */}
        <div className="space-y-0.5">
          <div className="text-[10.5px] font-semibold uppercase tracking-[1.4px] text-wit-text-tertiary px-3 py-1.5">
            {getLocalizedText('Học tập', 'Learning', '学習')}
          </div>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-wit-red-soft text-wit-red font-semibold'
                  : 'text-wit-text-secondary hover:bg-wit-surface-2 hover:text-wit-text'
              }`
            }
          >
            <Home className="h-[19px] w-[19px] shrink-0" />
            <span>{getLocalizedText('Trang chủ', 'Home', 'ホーム')}</span>
          </NavLink>
          <NavLink
            to="/roadmap"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-wit-red-soft text-wit-red font-semibold'
                  : 'text-wit-text-secondary hover:bg-wit-surface-2 hover:text-wit-text'
              }`
            }
          >
            <Map className="h-[19px] w-[19px] shrink-0" />
            <span>{getLocalizedText('Lộ trình học', 'Roadmap', 'ロードマップ')}</span>
          </NavLink>
          <NavLink
            to="/curriculum"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-wit-red-soft text-wit-red font-semibold'
                  : 'text-wit-text-secondary hover:bg-wit-surface-2 hover:text-wit-text'
              }`
            }
          >
            <BookOpen className="h-[19px] w-[19px] shrink-0" />
            <span>{getLocalizedText('Giáo trình', 'Curriculum', 'カリキュラム')}</span>
          </NavLink>
          <NavLink
            to="/dictionary"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-wit-red-soft text-wit-red font-semibold'
                  : 'text-wit-text-secondary hover:bg-wit-surface-2 hover:text-wit-text'
              }`
            }
          >
            <Languages className="h-[19px] w-[19px] shrink-0" />
            <span>{getLocalizedText('Từ điển', 'Dictionary', '辞書')}</span>
          </NavLink>
          <NavLink
            to="/review"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-wit-red-soft text-wit-red font-semibold'
                  : 'text-wit-text-secondary hover:bg-wit-surface-2 hover:text-wit-text'
              }`
            }
          >
            <ListChecks className="h-[19px] w-[19px] shrink-0" />
            <span>{getLocalizedText('Ôn tập', 'Review', '復習')}</span>
          </NavLink>
        </div>

        {/* Section: Cộng đồng */}
        <div className="space-y-0.5">
          <div className="text-[10.5px] font-semibold uppercase tracking-[1.4px] text-wit-text-tertiary px-3 py-1.5">
            {getLocalizedText('Cộng đồng', 'Community', 'コミュニティ')}
          </div>
          <NavLink
            to="/team"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-wit-red-soft text-wit-red font-semibold'
                  : 'text-wit-text-secondary hover:bg-wit-surface-2 hover:text-wit-text'
              }`
            }
          >
            <Users className="h-[19px] w-[19px] shrink-0" />
            <span>{getLocalizedText('Team biên soạn', 'Editorial Team', '編集チーム')}</span>
          </NavLink>
          <NavLink
            to="/advisors"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-wit-red-soft text-wit-red font-semibold'
                  : 'text-wit-text-secondary hover:bg-wit-surface-2 hover:text-wit-text'
              }`
            }
          >
            <ShieldCheck className="h-[19px] w-[19px] shrink-0" />
            <span>{getLocalizedText('Ban cố vấn', 'Advisory Board', '顧問団')}</span>
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-wit-red-soft text-wit-red font-semibold'
                  : 'text-wit-text-secondary hover:bg-wit-surface-2 hover:text-wit-text'
              }`
            }
          >
            <Settings className="h-[19px] w-[19px] shrink-0" />
            <span>{getLocalizedText('Cài đặt giao diện', 'Theme Settings', '画面設定')}</span>
          </NavLink>
        </div>

        {/* Section: Admin panel */}
        {isAdmin && (
          <div className="space-y-0.5">
            <div className="text-[10.5px] font-semibold uppercase tracking-[1.4px] text-wit-text-tertiary px-3 py-1.5">
              Admin
            </div>
            <NavLink
              to="/admin/import"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-wit-red-soft text-wit-red font-semibold'
                    : 'text-wit-text-secondary hover:bg-wit-surface-2 hover:text-wit-text'
                }`
              }
            >
              <Upload className="h-[19px] w-[19px] shrink-0" />
              <span>Import CSV</span>
            </NavLink>
          </div>
        )}
      </nav>

      {/* Progress Card Footer */}
      <div className="mx-4 my-4 p-3.5 rounded-2xl bg-wit-surface-2 border border-wit-line">
        <div className="flex justify-between items-baseline mb-2">
          <span className="text-xs font-semibold text-wit-text-secondary">
            {getLocalizedText('Tiến độ giáo trình', 'Curriculum Progress', '進行状況')}
          </span>
          <span className="text-xs font-bold text-wit-red">{progressPercent}%</span>
        </div>
        <div className="h-[7px] rounded-full bg-wit-line overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-wit-red to-[#E0524F] rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="text-[11.5px] text-wit-text-tertiary mt-2">
          {completedCount}/{TOTAL_LESSONS} {getLocalizedText('học phần', 'lessons', 'レッスン')} · {getLocalizedText('chuỗi 5 ngày', '5-day streak', '5日連続')}
        </div>
      </div>

      {/* User Section / Logout */}
      <div className="px-3.5 pb-4 space-y-1.5">
        <div className="border-t border-wit-line/60 my-2" />
        {user && (
          <div className="px-3 text-xs text-wit-text-tertiary truncate">
            {profile?.displayName || user.email}
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-wit-text-secondary hover:bg-red-50 hover:text-red-600 transition-all duration-200 cursor-pointer"
        >
          <LogOut className="h-[19px] w-[19px] shrink-0" />
          <span>{getLocalizedText('Đăng xuất', 'Log out', 'ログアウト')}</span>
        </button>
      </div>
    </aside>
    </>
  );
}

import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home,
  Map,
  BookOpen,
  Languages,
  Settings,
  Users,
  Upload,
  LogOut,
  type LucideIcon,
} from 'lucide-react';
import { NAV_ITEMS } from '../../lib/constants';
import { useAuth } from '../../contexts/AuthContext';
import { useSettings } from '../../contexts/SettingsContext';
import { getLocalized } from '../../lib/types';

const ICON_MAP: Record<string, LucideIcon> = {
  Home,
  Map,
  BookOpen,
  Languages,
  Settings,
};

const ADMIN_LINKS = [
  { path: '/admin/users', label: 'Quản lý người dùng', icon: Users },
  { path: '/admin/upload', label: 'Upload bài học', icon: Upload },
];

export function Sidebar() {
  const { user, profile, signOut } = useAuth();
  const { interfaceLang } = useSettings();
  const navigate = useNavigate();
  const isAdmin = profile?.role === 'admin';

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <aside className="sidebar hidden lg:flex lg:flex-col fixed left-0 top-0 w-[260px] h-dvh bg-wit-surface shadow-sidebar border-r border-wit-line/50 z-40">
      {/* Logo area */}
      <div className="px-6 pt-6 pb-4">
        <NavLink to="/" className="flex items-center gap-3 group">
          <img
            src="/logo.png"
            alt="WiT Logo"
            className="h-10 w-auto transition-transform duration-200 group-hover:scale-105"
          />
        </NavLink>
        <p className="mt-2 text-xs text-wit-text-tertiary tracking-wide">
          Wisdom in Tradition
        </p>
      </div>

      {/* Divider */}
      <div className="mx-4 border-t border-wit-line/50" />

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = ICON_MAP[item.icon];
          const label = getLocalized(item, 'label', interfaceLang);
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-wit-red-soft text-wit-red'
                    : 'text-wit-text-secondary hover:bg-wit-surface-alt hover:text-wit-text'
                }`
              }
            >
              {Icon && (
                <Icon className="h-[18px] w-[18px] shrink-0 transition-transform duration-200 group-hover:scale-110" />
              )}
              <span>{label}</span>
            </NavLink>
          );
        })}

        {/* Admin links */}
        {isAdmin && (
          <>
            <div className="pt-4 pb-1 px-3">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-wit-text-tertiary">
                Admin
              </span>
            </div>
            {ADMIN_LINKS.map(({ path, label, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                    isActive
                      ? 'bg-wit-red-soft text-wit-red'
                      : 'text-wit-text-secondary hover:bg-wit-surface-alt hover:text-wit-text'
                  }`
                }
              >
                <Icon className="h-[18px] w-[18px] shrink-0" />
                <span>{label}</span>
              </NavLink>
            ))}
          </>
        )}
      </nav>

      {/* User section */}
      <div className="px-3 pb-4 space-y-1">
        <div className="mx-1 border-t border-wit-line/50 mb-3" />

        {/* User info */}
        {user && (
          <div className="px-3 py-2 text-xs text-wit-text-tertiary truncate">
            {profile?.displayName || user.email}
          </div>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-wit-text-secondary hover:bg-red-50 hover:text-red-600 transition-all duration-200 cursor-pointer"
        >
          <LogOut className="h-[18px] w-[18px] shrink-0" />
          <span>
            {interfaceLang === 'vi'
              ? 'Đăng xuất'
              : interfaceLang === 'jp'
                ? 'ログアウト'
                : 'Log out'}
          </span>
        </button>
      </div>
    </aside>
  );
}

import {
  Palette,
  BookOpen,
  Languages,
  User,
  LogOut,
  Sun,
  Sunset,
  Moon,
  Type,
  Monitor,
  Columns2,
} from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { useAuth } from '../contexts/AuthContext';
import type { Theme, FontSize, DisplayMode } from '../lib/types';
import LanguageSwitcher from '../components/dictionary/LanguageSwitcher';

const THEME_OPTIONS: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Sáng', icon: Sun },
  { value: 'warm', label: 'Ấm', icon: Sunset },
  { value: 'dark', label: 'Tối', icon: Moon },
];

const FONT_SIZE_OPTIONS: { value: FontSize; label: string }[] = [
  { value: 'small', label: 'Nhỏ' },
  { value: 'medium', label: 'Trung bình' },
  { value: 'large', label: 'Lớn' },
];

const DISPLAY_MODE_OPTIONS: { value: DisplayMode; label: string; icon: typeof Monitor }[] = [
  { value: 'single', label: 'Một cột', icon: Monitor },
  { value: 'dual', label: 'Hai cột', icon: Columns2 },
];

interface SettingSectionProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

function SettingSection({ icon, title, children }: SettingSectionProps) {
  return (
    <div className="bg-wit-surface rounded-xl shadow-card border border-wit-line/50 p-5 sm:p-6">
      <h2 className="text-base font-semibold text-wit-text flex items-center gap-2.5 mb-5">
        <span className="text-wit-red">{icon}</span>
        {title}
      </h2>
      <div className="space-y-5">{children}</div>
    </div>
  );
}

interface SettingRowProps {
  label: string;
  description?: string;
  children: React.ReactNode;
}

function SettingRow({ label, description, children }: SettingRowProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-sm font-medium text-wit-text">{label}</p>
        {description && (
          <p className="text-xs text-wit-text-tertiary mt-0.5">{description}</p>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

export default function Settings() {
  const {
    theme,
    fontSize,
    interfaceLang,
    preferredSourceLang,
    preferredTargetLang,
    displayMode,
    setTheme,
    setFontSize,
    setInterfaceLang,
    setSourceLang,
    setTargetLang,
    setDisplayMode,
  } = useSettings();
  const { profile, signOut } = useAuth();

  return (
    <div className="page-enter p-4 sm:p-6 max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-wit-text font-serif">Cài đặt</h1>
        <p className="text-sm text-wit-text-secondary mt-1">Tùy chỉnh trải nghiệm học tập</p>
      </div>

      {/* ── Giao diện ── */}
      <SettingSection icon={<Palette className="h-5 w-5" />} title="Giao diện">
        {/* Language */}
        <SettingRow label="Ngôn ngữ giao diện" description="Thay đổi ngôn ngữ hiển thị">
          <LanguageSwitcher value={interfaceLang} onChange={setInterfaceLang} />
        </SettingRow>

        {/* Theme */}
        <SettingRow label="Chủ đề" description="Chọn giao diện sáng, ấm hoặc tối">
          <div className="inline-flex rounded-lg bg-wit-surface-alt p-1 gap-0.5">
            {THEME_OPTIONS.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setTheme(value)}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md
                  transition-all duration-200 cursor-pointer
                  ${
                    theme === value
                      ? 'bg-wit-red text-white shadow-sm'
                      : 'text-wit-text-secondary hover:text-wit-text hover:bg-wit-surface'
                  }
                `}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </button>
            ))}
          </div>
        </SettingRow>

        {/* Font size */}
        <SettingRow label="Cỡ chữ" description="Kích thước chữ khi đọc bài">
          <div className="inline-flex rounded-lg bg-wit-surface-alt p-1 gap-0.5">
            {FONT_SIZE_OPTIONS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setFontSize(value)}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md
                  transition-all duration-200 cursor-pointer
                  ${
                    fontSize === value
                      ? 'bg-wit-red text-white shadow-sm'
                      : 'text-wit-text-secondary hover:text-wit-text hover:bg-wit-surface'
                  }
                `}
              >
                <Type className="h-3.5 w-3.5" />
                {label}
              </button>
            ))}
          </div>
        </SettingRow>
      </SettingSection>

      {/* ── Đọc bài ── */}
      <SettingSection icon={<BookOpen className="h-5 w-5" />} title="Đọc bài">
        <SettingRow label="Chế độ hiển thị" description="Một cột hoặc hai cột song ngữ">
          <div className="inline-flex rounded-lg bg-wit-surface-alt p-1 gap-0.5">
            {DISPLAY_MODE_OPTIONS.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setDisplayMode(value)}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md
                  transition-all duration-200 cursor-pointer
                  ${
                    displayMode === value
                      ? 'bg-wit-red text-white shadow-sm'
                      : 'text-wit-text-secondary hover:text-wit-text hover:bg-wit-surface'
                  }
                `}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </button>
            ))}
          </div>
        </SettingRow>
      </SettingSection>

      {/* ── Từ điển ── */}
      <SettingSection icon={<Languages className="h-5 w-5" />} title="Từ điển">
        <SettingRow label="Ngôn ngữ gốc" description="Ngôn ngữ chính khi tra từ">
          <LanguageSwitcher value={preferredSourceLang} onChange={setSourceLang} />
        </SettingRow>

        <SettingRow label="Ngôn ngữ đích" description="Ngôn ngữ dịch sang">
          <LanguageSwitcher value={preferredTargetLang} onChange={setTargetLang} />
        </SettingRow>
      </SettingSection>

      {/* ── Tài khoản ── */}
      <SettingSection icon={<User className="h-5 w-5" />} title="Tài khoản">
        <SettingRow label="Email" description="Tài khoản đang đăng nhập">
          <span className="text-sm text-wit-text-secondary">{profile?.email || '—'}</span>
        </SettingRow>

        <SettingRow label="Tên hiển thị">
          <span className="text-sm text-wit-text">{profile?.displayName || '—'}</span>
        </SettingRow>

        <SettingRow label="Vai trò">
          <span
            className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-md ${
              profile?.role === 'admin'
                ? 'bg-wit-red-soft text-wit-red'
                : 'bg-wit-surface-alt text-wit-text-secondary'
            }`}
          >
            {profile?.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
          </span>
        </SettingRow>

        <div className="pt-2 border-t border-wit-line/50">
          <button
            type="button"
            onClick={signOut}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-wit-red hover:bg-wit-red-soft transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            Đăng xuất
          </button>
        </div>
      </SettingSection>
    </div>
  );
}

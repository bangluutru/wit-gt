// ============================================================
// WiT Platform - Settings Page
// ============================================================

import { Palette, BookOpen, Languages, User, LogOut, Sun, Moon, Sunset, Type, LayoutGrid } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { useAuth } from '../contexts/AuthContext';
import type { Theme, FontSize, DisplayMode } from '../lib/types';
import LanguageSwitcher from '../components/dictionary/LanguageSwitcher';

const THEME_OPTIONS: { value: Theme; icon: typeof Sun; vi: string; en: string; jp: string }[] = [
  { value: 'light', icon: Sun, vi: 'Sáng', en: 'Light', jp: 'ライト' },
  { value: 'warm', icon: Sunset, vi: 'Ấm', en: 'Warm', jp: 'ウォーム' },
  { value: 'dark', icon: Moon, vi: 'Tối', en: 'Dark', jp: 'ダーク' },
];

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

  const getLocalizedText = (vi: string, en: string, jp: string) => {
    if (interfaceLang === 'en') return en;
    if (interfaceLang === 'jp') return jp;
    return vi;
  };

  const fontBtnClass = (active: boolean) =>
    `flex-1 py-2.5 rounded-button border text-sm font-semibold transition-all cursor-pointer ${
      active
        ? 'border-wit-red bg-wit-red-soft text-wit-red'
        : 'border-wit-line bg-wit-surface text-wit-text-secondary hover:bg-wit-surface-2'
    }`;

  return (
    <div className="page-enter max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-[1.6px] text-wit-gold">
          {getLocalizedText('Cá nhân hoá trải nghiệm đọc', 'Personalize Reading Experience', '読書体験のパーソナライズ')}
        </span>
        <h1 className="font-serif text-3xl font-bold text-wit-text mt-1">
          {getLocalizedText('Cài đặt giao diện', 'Theme Settings', '画面設定')}
        </h1>
      </div>

      {/* Settings Container Panel */}
      <div className="bg-wit-surface border border-wit-line rounded-card shadow-card overflow-hidden divide-y divide-wit-line">
        {/* Theme selector — Sáng / Ấm / Tối */}
        <div className="p-5 space-y-3">
          <div>
            <h3 className="font-serif text-[15px] font-bold text-wit-text">
              {getLocalizedText('Giao diện', 'Theme', '画面テーマ')}
            </h3>
            <p className="text-xs text-wit-text-secondary mt-1 leading-relaxed">
              {getLocalizedText(
                'Sáng, Ấm (nền giấy ngả vàng) hoặc Tối — dịu mắt khi đọc ban đêm.',
                'Light, Warm (cream paper tone) or Dark — easy on the eyes at night.',
                'ライト、ウォーム（クリーム色の紙）、またはダーク — 夜間の読書に優しい。'
              )}
            </p>
          </div>
          <div className="flex gap-2.5">
            {THEME_OPTIONS.map(({ value, icon: Icon, vi, en, jp }) => (
              <button
                key={value}
                onClick={() => setTheme(value)}
                className={`${fontBtnClass(theme === value)} flex items-center justify-center gap-2`}
                aria-pressed={theme === value}
              >
                <Icon className="h-4 w-4" />
                {getLocalizedText(vi, en, jp)}
              </button>
            ))}
          </div>
        </div>

        {/* Font Size Selection */}
        <div className="p-5 space-y-3">
          <div>
            <h3 className="font-serif text-[15px] font-bold text-wit-text">
              {getLocalizedText('Cỡ chữ bài học', 'Lesson Font Size', 'レッスンのフォントサイズ')}
            </h3>
            <p className="text-xs text-wit-text-secondary mt-1">
              {getLocalizedText('Điều chỉnh cỡ chữ phần nội dung đọc.', 'Adjust the text size for reading.', '読書時のテキストサイズを調整します。')}
            </p>
          </div>
          <div className="flex gap-2.5">
            <button
              onClick={() => setFontSize('small')}
              className={fontBtnClass(fontSize === 'small')}
            >
              {getLocalizedText('A nhỏ', 'A Small', 'A 小')}
            </button>
            <button
              onClick={() => setFontSize('medium')}
              className={fontBtnClass(fontSize === 'medium')}
            >
              {getLocalizedText('A vừa', 'A Medium', 'A 中')}
            </button>
            <button
              onClick={() => setFontSize('large')}
              className={fontBtnClass(fontSize === 'large')}
            >
              {getLocalizedText('A lớn', 'A Large', 'A 大')}
            </button>
          </div>
        </div>

        {/* Reading display mode */}
        <div className="p-5 space-y-3">
          <div>
            <h3 className="font-serif text-[15px] font-bold text-wit-text">
              {getLocalizedText('Chế độ hiển thị', 'Display Mode', '表示モード')}
            </h3>
            <p className="text-xs text-wit-text-secondary mt-1">
              {getLocalizedText('Một cột hoặc hai cột song ngữ trên máy tính.', 'Single or dual column bilingual layout on desktop.', 'デスクトップでの1列または2列のバイリンガル表示。')}
            </p>
          </div>
          <div className="flex gap-2.5">
            <button
              onClick={() => setDisplayMode('single')}
              className={fontBtnClass(displayMode === 'single')}
            >
              {getLocalizedText('Một cột', 'Single Column', '1列')}
            </button>
            <button
              onClick={() => setDisplayMode('dual')}
              className={fontBtnClass(displayMode === 'dual')}
            >
              {getLocalizedText('Hai cột', 'Dual Columns', '2列')}
            </button>
          </div>
        </div>

        {/* Dictionary Language Preferences */}
        <div className="p-5 space-y-4">
          <div>
            <h3 className="font-serif text-[15px] font-bold text-wit-text">
              {getLocalizedText('Ngôn ngữ tra cứu mặc định', 'Default Lookup Language', 'デフォルトの検索言語')}
            </h3>
            <p className="text-xs text-wit-text-secondary mt-1">
              {getLocalizedText('Cấu hình mặc định cho ngôn ngữ gốc/đích khi tra từ điển.', 'Configure default source/target languages for search.', '辞書検索のデフォルトの元言語/対象言語を設定します。')}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-6">
            <LanguageSwitcher
              value={preferredSourceLang}
              onChange={setSourceLang}
              label={getLocalizedText('Ngôn ngữ gốc', 'Source Language', '元の言語')}
            />
            <LanguageSwitcher
              value={preferredTargetLang}
              onChange={setTargetLang}
              label={getLocalizedText('Ngôn ngữ dịch sang', 'Translate to', '翻訳先')}
            />
          </div>
        </div>

        {/* Account Details */}
        <div className="p-5 space-y-3.5">
          <h3 className="font-serif text-[15px] font-bold text-wit-text flex items-center gap-2">
            <User className="h-4.5 w-4.5 text-wit-red" />
            <span>{getLocalizedText('Tài khoản học viên', 'Student Account', '受講生アカウント')}</span>
          </h3>
          <div className="grid grid-cols-2 gap-y-2 text-sm max-w-md">
            <span className="text-wit-text-tertiary">Email:</span>
            <span className="text-wit-text font-semibold truncate">{profile?.email || '—'}</span>
            <span className="text-wit-text-tertiary">{getLocalizedText('Tên hiển thị:', 'Name:', '表示名:')}</span>
            <span className="text-wit-text font-semibold">{profile?.displayName || '—'}</span>
            <span className="text-wit-text-tertiary">{getLocalizedText('Vai trò:', 'Role:', '役割:')}</span>
            <span className="text-wit-text">
              <span className={`inline-block px-2.5 py-0.5 rounded-button text-xs font-bold ${
                profile?.role === 'admin'
                  ? 'bg-wit-red-soft text-wit-red'
                  : 'bg-wit-surface-2 text-wit-text-secondary'
              }`}>
                {profile?.role === 'admin'
                  ? getLocalizedText('Quản trị viên', 'Administrator', '管理者')
                  : getLocalizedText('Học viên', 'Student', '受講生')}
              </span>
            </span>
          </div>

          <div className="pt-3 border-t border-wit-line">
            <button
              onClick={signOut}
              className="flex items-center gap-2 px-4 py-2.5 rounded-button border border-wit-line hover:bg-wit-red-soft hover:border-wit-red/30 hover:text-wit-red transition-all font-semibold text-sm text-wit-text-secondary cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>{getLocalizedText('Đăng xuất tài khoản', 'Log out account', 'アカウントからログアウト')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Note under Panel */}
      <div className="p-4 rounded-button bg-wit-surface-2 border border-wit-line text-sm text-wit-text-secondary leading-relaxed">
        {getLocalizedText(
          'Giao diện hỗ trợ mở rộng thêm ngôn ngữ trong tương lai (Trung, Hàn…). Cấu trúc dữ liệu giữ đơn giản: hệ thống chỉ ghi nhận học phần đã hoàn thành để tự mở khoá phần kế tiếp.',
          'The interface supports expanding more languages in the future (Chinese, Korean...). The data structure is kept simple: the system only records completed parts to automatically unlock the next one.',
          'インターフェースは将来的に多言語（中国語、韓国語など）の拡張をサポートします。データ構造はシンプルに保たれており、システムは次のパートのロックを自動的に解除するために完了したパートのみを記録します。'
        )}
      </div>
    </div>
  );
}

// ============================================================
// WiT Platform - Settings Page
// ============================================================

import { Palette, BookOpen, Languages, User, LogOut, Sun, Moon, Type, LayoutGrid } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { useAuth } from '../contexts/AuthContext';
import type { Theme, FontSize, DisplayMode } from '../lib/types';
import LanguageSwitcher from '../components/dictionary/LanguageSwitcher';

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
    `flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
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
      <div className="bg-wit-surface border border-wit-line rounded-2xl shadow-sm overflow-hidden divide-y divide-wit-line">
        {/* Toggle Theme / Dark Mode */}
        <div className="p-5 flex items-center justify-between gap-6">
          <div className="min-w-0">
            <h3 className="text-[15px] font-bold text-wit-text">
              {getLocalizedText('Chế độ tối / sáng', 'Dark / Light Mode', 'ダーク/ライトモード')}
            </h3>
            <p className="text-xs text-wit-text-secondary mt-1 leading-relaxed">
              {getLocalizedText(
                'Nền ấm tối, dịu mắt khi đọc bài học vào ban đêm.',
                'Warm dark background, easy on the eyes for night reading.',
                '夜間の読書に適した、目に優しい温かみのあるダーク背景。'
              )}
            </p>
          </div>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="relative w-14 h-8 rounded-full border-none cursor-pointer transition-colors duration-200"
            style={{ backgroundColor: theme === 'dark' ? 'var(--color-wit-red)' : 'var(--color-wit-line)' }}
            aria-label="Toggle theme"
          >
            <span
              className="absolute top-1 left-1 w-6 h-6 rounded-full bg-white transition-all duration-200 shadow-md flex items-center justify-center text-wit-red-dark"
              style={{ transform: theme === 'dark' ? 'translateX(24px)' : 'none' }}
            >
              {theme === 'dark' ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
            </span>
          </button>
        </div>

        {/* Font Size Selection */}
        <div className="p-5 space-y-3">
          <div>
            <h3 className="text-[15px] font-bold text-wit-text">
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
            <h3 className="text-[15px] font-bold text-wit-text">
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
            <h3 className="text-[15px] font-bold text-wit-text">
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
          <h3 className="text-[15px] font-bold text-wit-text flex items-center gap-2">
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
              <span className={`inline-block px-2.5 py-0.5 rounded-lg text-xs font-bold ${
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
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-wit-line hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all font-semibold text-sm text-wit-text-secondary cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>{getLocalizedText('Đăng xuất tài khoản', 'Log out account', 'アカウントからログアウト')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Note under Panel */}
      <div className="p-4 rounded-xl bg-wit-surface-2 border border-wit-line text-sm text-wit-text-secondary leading-relaxed">
        {getLocalizedText(
          'Giao diện hỗ trợ mở rộng thêm ngôn ngữ trong tương lai (Trung, Hàn…). Cấu trúc dữ liệu giữ đơn giản: hệ thống chỉ ghi nhận học phần đã hoàn thành để tự mở khoá phần kế tiếp.',
          'The interface supports expanding more languages in the future (Chinese, Korean...). The data structure is kept simple: the system only records completed parts to automatically unlock the next one.',
          'インターフェースは将来的に多言語（中国語、韓国語など）の拡張をサポートします。データ構造はシンプルに保たれており、システムは次のパートのロックを自動的に解除するために完了したパートのみを記録します。'
        )}
      </div>
    </div>
  );
}

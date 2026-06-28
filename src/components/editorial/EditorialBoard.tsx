// ============================================================
// WiT Platform - Editorial board (Team / Advisors)
// Renders multilingual member cards; admins can add/edit/delete inline.
// ============================================================

import { useState, type ReactNode } from 'react';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { useEditorial } from '../../hooks/useEditorial';
import { useAuth } from '../../contexts/AuthContext';
import { useSettings } from '../../contexts/SettingsContext';
import { getLocalized } from '../../lib/types';
import type { EditorialMember, EditorialSection } from '../../lib/types';
import { Modal } from '../ui';

interface EditorialBoardProps {
  section: EditorialSection;
  variant: 'team' | 'advisors';
  eyebrow: string;
  title: string;
  subtitle: string;
  footer?: ReactNode;
}

const EMPTY: EditorialMember = {
  id: '',
  initials: '',
  nameVi: '', nameEn: '', nameJp: '',
  roleVi: '', roleEn: '', roleJp: '',
  noteVi: '', noteEn: '', noteJp: '',
};

export function EditorialBoard({ section, variant, eyebrow, title, subtitle, footer }: EditorialBoardProps) {
  const { members, loading, saving, saveMember, deleteMember } = useEditorial(section);
  const { profile } = useAuth();
  const { interfaceLang } = useSettings();
  const isAdmin = profile?.role === 'admin';

  const [editing, setEditing] = useState<EditorialMember | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<EditorialMember | null>(null);

  const L = (vi: string, en: string, jp: string) =>
    interfaceLang === 'en' ? en : interfaceLang === 'jp' ? jp : vi;

  const openAdd = () =>
    setEditing({ ...EMPTY, id: `${section}-${crypto.randomUUID().slice(0, 8)}` });

  const isTeam = variant === 'team';

  return (
    <div className="page-enter max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-[1.6px] text-wit-gold">{eyebrow}</span>
          <h1 className="font-serif text-3xl font-bold text-wit-text mt-1">{title}</h1>
          <p className="text-[14.5px] text-wit-text-secondary mt-2 leading-relaxed">{subtitle}</p>
        </div>
        {isAdmin && (
          <button
            onClick={openAdd}
            className="shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-button bg-wit-red text-white text-sm font-semibold hover:bg-wit-red-dark transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            {L('Thêm', 'Add', '追加')}
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-wit-text-secondary">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          {L('Đang tải...', 'Loading...', '読み込み中...')}
        </div>
      ) : (
        <div className={isTeam ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[18px]' : 'flex flex-col gap-4'}>
          {members.map((m) => (
            <div
              key={m.id}
              className={
                isTeam
                  ? 'relative wit-card p-6 bg-wit-surface border border-wit-line rounded-card shadow-card text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover'
                  : 'relative bg-wit-surface rounded-card border border-wit-line shadow-card flex flex-col sm:flex-row items-center sm:items-start gap-5 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover'
              }
            >
              {/* Admin controls */}
              {isAdmin && (
                <div className="absolute top-2.5 right-2.5 flex gap-1">
                  <button
                    onClick={() => setEditing(m)}
                    className="p-1.5 rounded-button text-wit-text-tertiary hover:bg-wit-surface-2 hover:text-wit-text transition-colors cursor-pointer"
                    title={L('Sửa', 'Edit', '編集')}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setConfirmDelete(m)}
                    className="p-1.5 rounded-button text-wit-text-tertiary hover:bg-wit-red-soft hover:text-wit-red transition-colors cursor-pointer"
                    title={L('Xoá', 'Delete', '削除')}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}

              {/* Avatar */}
              <div
                className={
                  isTeam
                    ? 'w-16 h-16 rounded-full mx-auto bg-gradient-to-br from-wit-red to-[#8E1B1B] text-white flex items-center justify-center font-serif font-bold text-[22px] shadow-card'
                    : 'shrink-0 w-[58px] h-[58px] rounded-card bg-gradient-to-br from-wit-gold to-wit-red text-white flex items-center justify-center font-serif font-bold text-lg shadow-card'
                }
              >
                {m.initials}
              </div>

              <div className={isTeam ? '' : 'flex-1 text-center sm:text-left min-w-0'}>
                <h3 className={isTeam ? 'font-serif font-bold text-[17px] text-wit-text mt-4' : 'font-serif font-bold text-lg text-wit-text'}>
                  {getLocalized(m, 'name', interfaceLang)}
                </h3>
                <div className={isTeam ? 'text-xs font-semibold text-wit-red mt-1' : 'text-sm text-wit-red font-medium mt-0.5'}>
                  {getLocalized(m, 'role', interfaceLang)}
                </div>
                <p className={isTeam ? 'text-[12.5px] text-wit-text-tertiary mt-2 leading-relaxed' : 'text-sm text-wit-text-secondary mt-2 leading-relaxed'}>
                  {getLocalized(m, 'note', interfaceLang)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {footer}

      {/* Add/Edit modal */}
      {editing && (
        <MemberFormModal
          member={editing}
          saving={saving}
          onClose={() => setEditing(null)}
          onSave={async (m) => {
            const ok = await saveMember(m);
            if (ok) setEditing(null);
          }}
          L={L}
        />
      )}

      {/* Delete confirm */}
      <Modal
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title={L('Xoá thành viên?', 'Delete member?', 'メンバーを削除？')}
      >
        <p className="text-sm text-wit-text-secondary">
          {L('Bạn có chắc muốn xoá', 'Are you sure you want to delete', '削除してもよろしいですか')}{' '}
          <span className="font-semibold text-wit-text">
            {confirmDelete && getLocalized(confirmDelete, 'name', interfaceLang)}
          </span>
          ?
        </p>
        <div className="flex justify-end gap-2 mt-5">
          <button
            onClick={() => setConfirmDelete(null)}
            className="px-4 py-2 rounded-button border border-wit-line text-sm font-semibold text-wit-text-secondary hover:bg-wit-surface-2 cursor-pointer"
          >
            {L('Huỷ', 'Cancel', 'キャンセル')}
          </button>
          <button
            onClick={async () => {
              if (confirmDelete) await deleteMember(confirmDelete.id);
              setConfirmDelete(null);
            }}
            disabled={saving}
            className="px-4 py-2 rounded-button bg-wit-red-dark text-white text-sm font-semibold hover:bg-wit-red disabled:opacity-60 cursor-pointer flex items-center gap-2"
          >
            {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {L('Xoá', 'Delete', '削除')}
          </button>
        </div>
      </Modal>
    </div>
  );
}

// ---- Member add/edit form ----

function MemberFormModal({
  member,
  saving,
  onClose,
  onSave,
  L,
}: {
  member: EditorialMember;
  saving: boolean;
  onClose: () => void;
  onSave: (m: EditorialMember) => void;
  L: (vi: string, en: string, jp: string) => string;
}) {
  const [form, setForm] = useState<EditorialMember>(member);
  const set = (key: keyof EditorialMember, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const field = (key: keyof EditorialMember, placeholder: string, textarea = false) =>
    textarea ? (
      <textarea
        value={form[key]}
        onChange={(e) => set(key, e.target.value)}
        placeholder={placeholder}
        rows={2}
        className="w-full px-3 py-2 rounded-button border border-wit-line bg-wit-surface text-sm text-wit-text placeholder:text-wit-text-tertiary focus:outline-none focus:ring-2 focus:ring-wit-red/20 focus:border-wit-red resize-none"
      />
    ) : (
      <input
        value={form[key]}
        onChange={(e) => set(key, e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-button border border-wit-line bg-wit-surface text-sm text-wit-text placeholder:text-wit-text-tertiary focus:outline-none focus:ring-2 focus:ring-wit-red/20 focus:border-wit-red"
      />
    );

  const group = (label: string, vi: keyof EditorialMember, en: keyof EditorialMember, jp: keyof EditorialMember, textarea = false) => (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-wit-text-secondary">{label}</label>
      {field(vi, L('Tiếng Việt', 'Vietnamese', 'ベトナム語'), textarea)}
      {field(en, 'English', textarea)}
      {field(jp, '日本語', textarea)}
    </div>
  );

  return (
    <Modal isOpen onClose={onClose} title={member.nameVi ? L('Sửa thành viên', 'Edit member', 'メンバーを編集') : L('Thêm thành viên', 'Add member', 'メンバーを追加')}>
      <div className="max-h-[68vh] overflow-y-auto pr-1 space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-wit-text-secondary">
            {L('Viết tắt (avatar)', 'Initials (avatar)', '頭文字（アバター）')}
          </label>
          <input
            value={form.initials}
            onChange={(e) => set('initials', e.target.value.slice(0, 3))}
            placeholder="VD: CB"
            className="w-24 px-3 py-2 rounded-button border border-wit-line bg-wit-surface text-sm text-wit-text focus:outline-none focus:ring-2 focus:ring-wit-red/20 focus:border-wit-red"
          />
        </div>
        {group(L('Tên', 'Name', '名前'), 'nameVi', 'nameEn', 'nameJp')}
        {group(L('Vai trò', 'Role', '役割'), 'roleVi', 'roleEn', 'roleJp')}
        {group(L('Ghi chú', 'Note', 'メモ'), 'noteVi', 'noteEn', 'noteJp', true)}
      </div>
      <div className="flex justify-end gap-2 mt-5">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-button border border-wit-line text-sm font-semibold text-wit-text-secondary hover:bg-wit-surface-2 cursor-pointer"
        >
          {L('Huỷ', 'Cancel', 'キャンセル')}
        </button>
        <button
          onClick={() => onSave(form)}
          disabled={saving || !form.initials.trim() || !form.nameVi.trim()}
          className="px-4 py-2 rounded-button bg-wit-red text-white text-sm font-semibold hover:bg-wit-red-dark disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
        >
          {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          {L('Lưu', 'Save', '保存')}
        </button>
      </div>
    </Modal>
  );
}

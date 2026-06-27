import { useState, useRef } from 'react';
import {
  Upload,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  BookOpen,
  Languages,
  Trash2,
  Eye,
} from 'lucide-react';
import { collection, doc, setDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { parseCSV } from '../lib/utils';

type ImportSection = 'lessons' | 'dictionary';

interface ImportState {
  file: File | null;
  preview: Record<string, string>[];
  importing: boolean;
  result: { success: number; errors: string[] } | null;
}

const INITIAL_STATE: ImportState = {
  file: null,
  preview: [],
  importing: false,
  result: null,
};

const LESSON_REQUIRED_FIELDS = [
  'lessonNo',
  'chapterId',
  'titleVi',
  'titleEn',
  'titleJp',
  'contentVi',
  'contentEn',
  'contentJp',
];

const DICTIONARY_REQUIRED_FIELDS = [
  'category',
  'viTerm',
  'enTerm',
  'jpTerm',
];

export default function AdminImport() {
  const { profile } = useAuth();
  const [activeSection, setActiveSection] = useState<ImportSection>('lessons');
  const [lessonState, setLessonState] = useState<ImportState>(INITIAL_STATE);
  const [dictState, setDictState] = useState<ImportState>(INITIAL_STATE);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Access check ──
  if (profile?.role !== 'admin') {
    return (
      <div className="page-enter p-4 sm:p-6 max-w-2xl mx-auto">
        <div className="bg-wit-surface rounded-xl shadow-card border border-wit-line/50 p-8 text-center">
          <AlertTriangle className="h-12 w-12 text-wit-gold mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-wit-text mb-2">Không có quyền truy cập</h2>
          <p className="text-sm text-wit-text-secondary">
            Trang này chỉ dành cho quản trị viên. Vai trò hiện tại:{' '}
            <span className="font-medium">{profile?.role || 'unknown'}</span>
          </p>
        </div>
      </div>
    );
  }

  const state = activeSection === 'lessons' ? lessonState : dictState;
  const setState = activeSection === 'lessons' ? setLessonState : setDictState;
  const requiredFields =
    activeSection === 'lessons' ? LESSON_REQUIRED_FIELDS : DICTIONARY_REQUIRED_FIELDS;
  const collectionName = activeSection === 'lessons' ? 'lessons' : 'dictionary';

  // ── File handling ──
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const rows = parseCSV(text);
      setState((prev) => ({
        ...prev,
        file,
        preview: rows,
        result: null,
      }));
    };
    reader.readAsText(file);
  };

  const clearFile = () => {
    setState(INITIAL_STATE);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ── Validation ──
  const validateRows = (): string[] => {
    const errors: string[] = [];
    if (state.preview.length === 0) {
      errors.push('File CSV không có dữ liệu.');
      return errors;
    }

    const headers = Object.keys(state.preview[0]);
    const missingFields = requiredFields.filter((f) => !headers.includes(f));
    if (missingFields.length > 0) {
      errors.push(`Thiếu cột bắt buộc: ${missingFields.join(', ')}`);
    }

    return errors;
  };

  // ── Import ──
  const handleImport = async () => {
    const errors = validateRows();
    if (errors.length > 0) {
      setState((prev) => ({
        ...prev,
        result: { success: 0, errors },
      }));
      return;
    }

    setState((prev) => ({ ...prev, importing: true }));

    let successCount = 0;
    const importErrors: string[] = [];

    for (let i = 0; i < state.preview.length; i++) {
      const row = state.preview[i];
      try {
        if (activeSection === 'lessons') {
          // Check duplicate by lessonNo
          const lessonNo = parseInt(row.lessonNo, 10);
          const existing = await getDocs(
            query(collection(db, 'lessons'), where('lessonNo', '==', lessonNo))
          );

          const docData = {
            lessonNo,
            chapterId: row.chapterId,
            titleVi: row.titleVi || '',
            titleEn: row.titleEn || '',
            titleJp: row.titleJp || '',
            summaryVi: row.summaryVi || '',
            summaryEn: row.summaryEn || '',
            summaryJp: row.summaryJp || '',
            contentVi: row.contentVi || '',
            contentEn: row.contentEn || '',
            contentJp: row.contentJp || '',
            status: (row.status as 'published' | 'draft') || 'draft',
            updatedAt: serverTimestamp(),
            ...(!existing.empty ? {} : { createdAt: serverTimestamp() }),
          };

          const docId = existing.empty
            ? doc(collection(db, 'lessons')).id
            : existing.docs[0].id;

          await setDoc(doc(db, 'lessons', docId), docData, { merge: true });
        } else {
          // Dictionary: use viTerm as unique key approximation
          const docId = doc(collection(db, 'dictionary')).id;
          await setDoc(doc(db, 'dictionary', docId), {
            category: row.category || '',
            viTerm: row.viTerm || '',
            viDef: row.viDef || '',
            viPos: row.viPos || '',
            viIpa: row.viIpa || '',
            enTerm: row.enTerm || '',
            enDef: row.enDef || '',
            enPos: row.enPos || '',
            enIpa: row.enIpa || '',
            jpTerm: row.jpTerm || '',
            jpDef: row.jpDef || '',
            jpPos: row.jpPos || '',
            jpKana: row.jpKana || '',
            viImg: row.viImg || '',
            enImg: row.enImg || '',
            jpImg: row.jpImg || '',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        }
        successCount++;
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        importErrors.push(`Dòng ${i + 2}: ${msg}`);
      }
    }

    setState((prev) => ({
      ...prev,
      importing: false,
      result: { success: successCount, errors: importErrors },
    }));
  };

  return (
    <div className="page-enter p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-wit-text font-serif">Nhập dữ liệu (Admin)</h1>
        <p className="text-sm text-wit-text-secondary mt-1">
          Import bài học và từ điển từ file CSV vào Firestore
        </p>
      </div>

      {/* Section tabs */}
      <div className="flex border-b border-wit-line">
        {[
          { key: 'lessons' as ImportSection, label: 'Bài học', icon: BookOpen },
          { key: 'dictionary' as ImportSection, label: 'Từ điển', icon: Languages },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveSection(key)}
            className={`
              flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 -mb-px
              transition-all cursor-pointer
              ${
                activeSection === key
                  ? 'border-wit-red text-wit-red'
                  : 'border-transparent text-wit-text-secondary hover:text-wit-text'
              }
            `}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Required fields info */}
      <div className="bg-wit-info-soft rounded-lg p-4">
        <p className="text-sm font-medium text-wit-text mb-1">
          <FileSpreadsheet className="h-4 w-4 inline mr-1.5" />
          Cột bắt buộc trong CSV:
        </p>
        <p className="text-xs text-wit-text-secondary font-mono">
          {requiredFields.join(', ')}
        </p>
      </div>

      {/* Upload area */}
      <div className="bg-wit-surface rounded-xl shadow-card border border-wit-line/50 p-6">
        {!state.file ? (
          <label className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-wit-line rounded-xl hover:border-wit-red/50 hover:bg-wit-red-soft/30 transition-all cursor-pointer">
            <Upload className="h-10 w-10 text-wit-text-tertiary mb-3" />
            <p className="text-sm font-medium text-wit-text">Chọn file CSV để upload</p>
            <p className="text-xs text-wit-text-tertiary mt-1">
              Kéo thả hoặc nhấn để chọn file
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>
        ) : (
          <div className="space-y-4">
            {/* File info */}
            <div className="flex items-center justify-between bg-wit-surface-alt rounded-lg p-3">
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="h-5 w-5 text-wit-red" />
                <div>
                  <p className="text-sm font-medium text-wit-text">{state.file.name}</p>
                  <p className="text-xs text-wit-text-tertiary">
                    {state.preview.length} dòng dữ liệu
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={clearFile}
                className="p-2 rounded-lg text-wit-text-tertiary hover:text-wit-red hover:bg-wit-red-soft transition-colors cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            {/* Preview table */}
            {state.preview.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-wit-text flex items-center gap-1.5 mb-2">
                  <Eye className="h-4 w-4" />
                  Xem trước (5 dòng đầu)
                </h3>
                <div className="overflow-x-auto rounded-lg border border-wit-line">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-wit-surface-alt">
                        {Object.keys(state.preview[0]).map((header) => (
                          <th
                            key={header}
                            className={`px-3 py-2 text-left font-semibold text-wit-text-secondary whitespace-nowrap ${
                              requiredFields.includes(header) ? 'text-wit-red' : ''
                            }`}
                          >
                            {header}
                            {requiredFields.includes(header) && ' *'}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {state.preview.slice(0, 5).map((row, i) => (
                        <tr key={i} className="border-t border-wit-line/50 hover:bg-wit-surface-alt/50">
                          {Object.values(row).map((val, j) => (
                            <td key={j} className="px-3 py-2 text-wit-text max-w-[200px] truncate">
                              {val || <span className="text-wit-text-tertiary italic">trống</span>}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Import button */}
            <button
              type="button"
              onClick={handleImport}
              disabled={state.importing || state.preview.length === 0}
              className="w-full py-3 rounded-lg bg-wit-red text-white font-semibold hover:bg-wit-red-hover transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              {state.importing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang import...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Import {state.preview.length} dòng vào {collectionName}
                </>
              )}
            </button>
          </div>
        )}

        {/* Result */}
        {state.result && (
          <div className="mt-4 space-y-2 animate-scale-in">
            {state.result.success > 0 && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-wit-success-soft text-wit-success text-sm">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                Đã import thành công {state.result.success} dòng.
              </div>
            )}
            {state.result.errors.length > 0 && (
              <div className="p-3 rounded-lg bg-wit-red-soft text-wit-red text-sm space-y-1">
                <div className="flex items-center gap-2 font-medium">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  {state.result.errors.length} lỗi:
                </div>
                <ul className="list-disc list-inside text-xs space-y-0.5 ml-6">
                  {state.result.errors.slice(0, 10).map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                  {state.result.errors.length > 10 && (
                    <li className="text-wit-text-tertiary">
                      ...và {state.result.errors.length - 10} lỗi khác
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// WiT Platform - Advisors Page
// ============================================================

import { ShieldCheck } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

interface Advisor {
  initials: string;
  name: string;
  roleVi: string;
  roleEn: string;
  roleJp: string;
  noteVi: string;
  noteEn: string;
  noteJp: string;
}

const ADVISORS_DATA: Advisor[] = [
  {
    initials: 'CV',
    name: 'Cố vấn Tư tưởng',
    roleVi: 'Định hướng triết lý nhân sinh',
    roleEn: 'Human Philosophy Direction',
    roleJp: '人生哲学の方向性',
    noteVi: 'Bảo trợ tinh thần và chiều sâu tư tưởng cho giáo trình.',
    noteEn: 'Spiritual support and conceptual depth for the curriculum.',
    noteJp: 'カリキュラム의 정신적 サポートと深さを保証する。',
  },
  {
    initials: 'HT',
    name: 'Cố vấn Học thuật',
    roleVi: 'Chuẩn hoá thuật ngữ',
    roleEn: 'Terminology Standardization',
    roleJp: '用語の標準化',
    noteVi: 'Đảm bảo tính nhất quán và chính xác của hệ thống khái niệm.',
    noteEn: 'Ensures the consistency and accuracy of the conceptual system.',
    noteJp: '概念体系の一貫性と正確性を確保する。',
  },
  {
    initials: 'UD',
    name: 'Cố vấn Ứng dụng',
    roleVi: 'Thực tiễn & huấn luyện',
    roleEn: 'Practice & Coaching',
    roleJp: '実践とコーチング',
    noteVi: 'Gắn nội dung với ứng dụng trong cuộc sống và sự nghiệp.',
    noteEn: 'Links content with applications in life and career.',
    noteJp: '内容を生活やキャリアの実践的な応用に結びつける。',
  },
  {
    initials: 'QT',
    name: 'Cố vấn Quốc tế',
    roleVi: 'Mở rộng đa ngôn ngữ',
    roleEn: 'Multilingual Expansion',
    roleJp: '多言語展開',
    noteVi: 'Đưa giáo trình tiếp cận học viên Anh ngữ và Nhật ngữ.',
    noteEn: 'Brings the curriculum to English and Japanese-speaking students.',
    noteJp: '英語および日本語を話す学習者にカリキュラムを届ける。',
  },
];

export default function Advisors() {
  const { interfaceLang } = useSettings();

  const getLocalizedText = (vi: string, en: string, jp: string) => {
    if (interfaceLang === 'en') return en;
    if (interfaceLang === 'jp') return jp;
    return vi;
  };

  return (
    <div className="page-enter space-y-8 max-w-4xl mx-auto">
      {/* Page Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-wit-gold">
          {getLocalizedText('Định hướng & bảo trợ chuyên môn', 'Guidance & Professional Sponsorship', '専門的な指導と後援')}
        </span>
        <h1 className="font-serif text-3xl font-bold text-wit-text mt-1">
          {getLocalizedText('Ban cố vấn', 'Advisory Board', '顧問団')}
        </h1>
        <p className="text-sm text-wit-text-secondary mt-2">
          {getLocalizedText(
            'Hội đồng cố vấn đồng hành cùng giáo trình về tư tưởng, học thuật và ứng dụng thực tiễn.',
            'The advisory board accompanies the curriculum in thought, academia, and practical application.',
            '顧問団は、思想、学問、実践的な応用においてカリキュラムをサポートします。'
          )}
        </p>
      </div>

      {/* Advisors List */}
      <div className="flex flex-col gap-4">
        {ADVISORS_DATA.map((advisor) => (
          <div
            key={advisor.name}
            className="bg-wit-surface rounded-2xl border border-wit-line shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-5 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover"
          >
            {/* Avatar Circle */}
            <div className="shrink-0 w-[58px] h-[58px] rounded-2xl bg-gradient-to-br from-wit-gold to-wit-red text-white flex items-center justify-center font-serif font-bold text-lg shadow-sm">
              {advisor.initials}
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left min-w-0">
              <h3 className="font-serif font-bold text-lg text-wit-text">
                {advisor.name}
              </h3>
              <p className="text-sm text-wit-red font-medium mt-0.5">
                {getLocalizedText(advisor.roleVi, advisor.roleEn, advisor.roleJp)}
              </p>
              <p className="text-sm text-wit-text-secondary mt-2 leading-relaxed">
                {getLocalizedText(advisor.noteVi, advisor.noteEn, advisor.noteJp)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <div className="text-center pt-4">
        <p className="text-xs text-wit-text-tertiary flex items-center justify-center gap-1.5">
          {getLocalizedText('Đồng hành cùng sự nghiệp giáo dục', 'Accompanying the education career', '教育事業とともに')}
          <ShieldCheck className="h-3.5 w-3.5 text-wit-gold" />
        </p>
      </div>
    </div>
  );
}

// ============================================================
// WiT Platform - Team Page
// ============================================================

import { Users, Heart } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

interface TeamMember {
  initials: string;
  nameVi: string;
  nameEn: string;
  nameJp: string;
  roleVi: string;
  roleEn: string;
  roleJp: string;
  noteVi: string;
  noteEn: string;
  noteJp: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    initials: 'CB',
    nameVi: 'Chủ biên',
    nameEn: 'Editor-in-Chief',
    nameJp: '主編',
    roleVi: 'Tổng chủ biên nội dung',
    roleEn: 'Content Editor-in-Chief',
    roleJp: 'コンテンツ総主編',
    noteVi: 'Xây dựng khung 76 học phần và triết lý giáo dục tận gốc.',
    noteEn: 'Building the framework of 76 parts and root education philosophy.',
    noteJp: '76のパートのフレームワークと根本教育哲学を構築する。',
  },
  {
    initials: 'BS',
    nameVi: 'Ban Biên soạn',
    nameEn: 'Editorial Board',
    nameJp: '編集委員会',
    roleVi: 'Biên soạn & hệ thống hoá',
    roleEn: 'Compilation & Systematization',
    roleJp: '編集と系統化',
    noteVi: 'Sắp xếp nội dung theo 9 chương và lộ trình học.',
    noteEn: 'Arranging content into 9 chapters and the learning path.',
    noteJp: 'コンテンツを9つの章と学習ロードマップに整理する。',
  },
  {
    initials: 'DT',
    nameVi: 'Tổ Dịch thuật',
    nameEn: 'Translation Team',
    nameJp: '翻訳チーム',
    roleVi: 'Dịch Việt · Anh · Nhật',
    roleEn: 'Vietnamese · English · Japanese translation',
    roleJp: '越・英・日翻訳',
    noteVi: 'Chuyển ngữ thuật ngữ nhân sinh sang ba ngôn ngữ.',
    noteEn: 'Translating human life terminology into three languages.',
    noteJp: '人生の用語を3つの言語に翻訳する。',
  },
  {
    initials: 'KD',
    nameVi: 'Tổ Kiểm định',
    nameEn: 'Verification Team',
    nameJp: '検証チーム',
    roleVi: 'Hiệu đính & kiểm định',
    roleEn: 'Proofreading & Verification',
    roleJp: '校正と検証',
    noteVi: 'Đối chiếu thuật ngữ với từ điển witdict.',
    noteEn: 'Cross-checking terminology with the witdict dictionary.',
    noteJp: '用語をwitdict辞書とクロスチェックする。',
  },
  {
    initials: 'TK',
    nameVi: 'Tổ Thiết kế',
    nameEn: 'Design Team',
    nameJp: 'デザインチーム',
    roleVi: 'Thiết kế & trải nghiệm',
    roleEn: 'Design & Experience',
    roleJp: 'デザインと体験',
    noteVi: 'Giao diện đọc và tra cứu thân thiện.',
    noteEn: 'Creating user-friendly reading and lookup interfaces.',
    noteJp: '使いやすい読書および検索インターフェースの作成。',
  },
  {
    initials: 'CN',
    nameVi: 'Tổ Công nghệ',
    nameEn: 'Tech Team',
    nameJp: '技術チーム',
    roleVi: 'Phát triển nền tảng',
    roleEn: 'Platform Development',
    roleJp: 'プラットフォーム開発',
    noteVi: 'Vận hành cơ chế mở khoá học phần theo lộ trình.',
    noteEn: 'Operating the lesson unlocking mechanism on the roadmap.',
    noteJp: 'ロードマップ上のレッスンアンロックメカニズムを運用する。',
  },
];

export default function Team() {
  const { interfaceLang } = useSettings();

  const getLocalizedText = (vi: string, en: string, jp: string) => {
    if (interfaceLang === 'en') return en;
    if (interfaceLang === 'jp') return jp;
    return vi;
  };

  return (
    <div className="page-enter max-w-4xl mx-auto space-y-8">
      {/* Page Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-[1.6px] text-wit-gold">
          {getLocalizedText('Những người đứng sau giáo trình', 'People behind the curriculum', 'カリキュラムを支える人々')}
        </span>
        <h1 className="font-serif text-3xl font-bold text-wit-text mt-1">
          {getLocalizedText('Team biên soạn', 'Editorial Team', '編集チーム')}
        </h1>
        <p className="text-[14.5px] text-wit-text-secondary mt-2 leading-relaxed">
          {getLocalizedText(
            'Tập thể biên soạn, dịch thuật và kiểm định nội dung cho giáo trình đa ngôn ngữ WiT.',
            'The collective team compiling, translating, and verifying content for the WiT multilingual curriculum.',
            'WiT多言語カリキュラムのコンテンツを編集、翻訳、および検証する合同チーム。'
          )}
        </p>
      </div>

      {/* Grid of Team Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[18px]">
        {TEAM_MEMBERS.map((member) => (
          <div
            key={member.nameVi}
            className="wit-card p-6 bg-wit-surface border border-wit-line rounded-2xl shadow-sm text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover"
          >
            {/* Avatar Circle */}
            <div className="w-16 h-16 rounded-full mx-auto bg-gradient-to-br from-wit-red to-[#8E1B1B] text-white flex items-center justify-center font-serif font-bold text-[22px] shadow-sm">
              {member.initials}
            </div>

            {/* Name */}
            <h3 className="font-serif font-bold text-[17px] text-wit-text mt-4">
              {getLocalizedText(member.nameVi, member.nameEn, member.nameJp)}
            </h3>

            {/* Role */}
            <div className="text-xs font-semibold text-wit-red mt-1">
              {getLocalizedText(member.roleVi, member.roleEn, member.roleJp)}
            </div>

            {/* Note */}
            <p className="text-[12.5px] text-wit-text-tertiary mt-2 leading-relaxed">
              {getLocalizedText(member.noteVi, member.noteEn, member.noteJp)}
            </p>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <div className="text-center pt-4">
        <p className="text-xs text-wit-text-tertiary flex items-center justify-center gap-1.5">
          {getLocalizedText('Xây dựng với', 'Built with', '構築元')}
          <Heart className="h-3.5 w-3.5 text-wit-red fill-wit-red" />
          {getLocalizedText('bởi đội ngũ WiT', 'by the WiT team', 'WiTチーム')}
        </p>
      </div>
    </div>
  );
}

// ============================================================
// WiT Platform - Editorial board seed defaults
// Used when the Firestore `siteContent/editorial` document does not exist
// yet. Admins can initialise from these and then edit live.
// ============================================================

import type { EditorialMember } from './types';

export const SEED_TEAM: EditorialMember[] = [
  {
    id: 'team-cb',
    initials: 'CB',
    nameVi: 'Chủ biên', nameEn: 'Editor-in-Chief', nameJp: '主編',
    roleVi: 'Tổng chủ biên nội dung', roleEn: 'Content Editor-in-Chief', roleJp: 'コンテンツ総主編',
    noteVi: 'Xây dựng khung 76 học phần và triết lý giáo dục tận gốc.',
    noteEn: 'Building the framework of 76 parts and root education philosophy.',
    noteJp: '76のパートのフレームワークと根本教育哲学を構築する。',
  },
  {
    id: 'team-bs',
    initials: 'BS',
    nameVi: 'Ban Biên soạn', nameEn: 'Editorial Board', nameJp: '編集委員会',
    roleVi: 'Biên soạn & hệ thống hoá', roleEn: 'Compilation & Systematization', roleJp: '編集と系統化',
    noteVi: 'Sắp xếp nội dung theo 9 chương và lộ trình học.',
    noteEn: 'Arranging content into 9 chapters and the learning path.',
    noteJp: 'コンテンツを9つの章と学習ロードマップに整理する。',
  },
  {
    id: 'team-dt',
    initials: 'DT',
    nameVi: 'Tổ Dịch thuật', nameEn: 'Translation Team', nameJp: '翻訳チーム',
    roleVi: 'Dịch Việt · Anh · Nhật', roleEn: 'Vietnamese · English · Japanese translation', roleJp: '越・英・日翻訳',
    noteVi: 'Chuyển ngữ thuật ngữ nhân sinh sang ba ngôn ngữ.',
    noteEn: 'Translating human life terminology into three languages.',
    noteJp: '人生の用語を3つの言語に翻訳する。',
  },
  {
    id: 'team-kd',
    initials: 'KD',
    nameVi: 'Tổ Kiểm định', nameEn: 'Verification Team', nameJp: '検証チーム',
    roleVi: 'Hiệu đính & kiểm định', roleEn: 'Proofreading & Verification', roleJp: '校正と検証',
    noteVi: 'Đối chiếu thuật ngữ với từ điển witdict.',
    noteEn: 'Cross-checking terminology with the witdict dictionary.',
    noteJp: '用語をwitdict辞書とクロスチェックする。',
  },
  {
    id: 'team-tk',
    initials: 'TK',
    nameVi: 'Tổ Thiết kế', nameEn: 'Design Team', nameJp: 'デザインチーム',
    roleVi: 'Thiết kế & trải nghiệm', roleEn: 'Design & Experience', roleJp: 'デザインと体験',
    noteVi: 'Giao diện đọc và tra cứu thân thiện.',
    noteEn: 'Creating user-friendly reading and lookup interfaces.',
    noteJp: '使いやすい読書および検索インターフェースの作成。',
  },
  {
    id: 'team-cn',
    initials: 'CN',
    nameVi: 'Tổ Công nghệ', nameEn: 'Tech Team', nameJp: '技術チーム',
    roleVi: 'Phát triển nền tảng', roleEn: 'Platform Development', roleJp: 'プラットフォーム開発',
    noteVi: 'Vận hành cơ chế mở khoá học phần theo lộ trình.',
    noteEn: 'Operating the lesson unlocking mechanism on the roadmap.',
    noteJp: 'ロードマップ上のレッスンアンロックメカニズムを運用する。',
  },
];

export const SEED_ADVISORS: EditorialMember[] = [
  {
    id: 'adv-cv',
    initials: 'CV',
    nameVi: 'Cố vấn Tư tưởng', nameEn: 'Ideology Advisor', nameJp: '思想顧問',
    roleVi: 'Định hướng triết lý nhân sinh', roleEn: 'Human Philosophy Direction', roleJp: '人生哲学の方向性',
    noteVi: 'Bảo trợ tinh thần và chiều sâu tư tưởng cho giáo trình.',
    noteEn: 'Spiritual support and conceptual depth for the curriculum.',
    noteJp: 'カリキュラムの精神的サポートと思想的深さを保証する。',
  },
  {
    id: 'adv-ht',
    initials: 'HT',
    nameVi: 'Cố vấn Học thuật', nameEn: 'Academic Advisor', nameJp: '学術顧問',
    roleVi: 'Chuẩn hoá thuật ngữ', roleEn: 'Terminology Standardization', roleJp: '用語の標準化',
    noteVi: 'Đảm bảo tính nhất quán và chính xác của hệ thống khái niệm.',
    noteEn: 'Ensures the consistency and accuracy of the conceptual system.',
    noteJp: '概念体系の一貫性と正確性を確保する。',
  },
  {
    id: 'adv-ud',
    initials: 'UD',
    nameVi: 'Cố vấn Ứng dụng', nameEn: 'Application Advisor', nameJp: '応用顧問',
    roleVi: 'Thực tiễn & huấn luyện', roleEn: 'Practice & Coaching', roleJp: '実践とコーチング',
    noteVi: 'Gắn nội dung với ứng dụng trong cuộc sống và sự nghiệp.',
    noteEn: 'Links content with applications in life and career.',
    noteJp: '内容を生活やキャリアの実践的な応用に結びつける。',
  },
  {
    id: 'adv-qt',
    initials: 'QT',
    nameVi: 'Cố vấn Quốc tế', nameEn: 'International Advisor', nameJp: '国際顧問',
    roleVi: 'Mở rộng đa ngôn ngữ', roleEn: 'Multilingual Expansion', roleJp: '多言語展開',
    noteVi: 'Đưa giáo trình tiếp cận học viên Anh ngữ và Nhật ngữ.',
    noteEn: 'Brings the curriculum to English and Japanese-speaking students.',
    noteJp: '英語および日本語を話す学習者にカリキュラムを届ける。',
  },
];

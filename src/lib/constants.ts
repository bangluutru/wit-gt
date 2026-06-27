// ============================================================
// WiT Platform - Constants
// ============================================================

export const TOTAL_LESSONS = 76;
export const TOTAL_CHAPTERS = 9;

export const CHAPTER_NAMES = [
  {
    orderIndex: 1,
    titleVi: 'Khởi nguyên nhận thức',
    titleEn: 'Origins of Awareness',
    titleJp: '認知の起源',
    descriptionVi: 'Khám phá nguồn gốc và bản chất của nhận thức con người',
    descriptionEn: 'Explore the origins and nature of human awareness',
    descriptionJp: '人間の認知の起源と本質を探求する',
  },
  {
    orderIndex: 2,
    titleVi: 'Nội tâm và nhận thức',
    titleEn: 'Inner Self and Awareness',
    titleJp: '内面と認知',
    descriptionVi: 'Hiểu về thế giới nội tâm và cách nhận thức định hình cuộc sống',
    descriptionEn: 'Understanding the inner world and how awareness shapes life',
    descriptionJp: '内面世界と認知が生活を形作る方法を理解する',
  },
  {
    orderIndex: 3,
    titleVi: 'Trí tuệ – Tâm thái – Nhân cách',
    titleEn: 'Intelligence – Mindset – Character',
    titleJp: '知性 – マインドセット – 人格',
    descriptionVi: 'Phát triển trí tuệ, tâm thái và nhân cách toàn diện',
    descriptionEn: 'Developing intelligence, mindset and character holistically',
    descriptionJp: '知性、マインドセット、人格を総合的に発展させる',
  },
  {
    orderIndex: 4,
    titleVi: 'Phẩm chất – Năng lực – Thể chất',
    titleEn: 'Qualities – Abilities – Physicality',
    titleJp: '品質 – 能力 – 身体',
    descriptionVi: 'Rèn luyện phẩm chất, năng lực và sức khoẻ',
    descriptionEn: 'Cultivating qualities, abilities and physical health',
    descriptionJp: '品質、能力、身体の健康を養う',
  },
  {
    orderIndex: 5,
    titleVi: 'Tài chính – Kinh doanh – Đầu tư',
    titleEn: 'Finance – Business – Investment',
    titleJp: '財務 – ビジネス – 投資',
    descriptionVi: 'Hiểu về tài chính, kinh doanh và đầu tư thông minh',
    descriptionEn: 'Understanding finance, business and smart investing',
    descriptionJp: '財務、ビジネス、賢明な投資を理解する',
  },
  {
    orderIndex: 6,
    titleVi: 'Mối quan hệ – Con người',
    titleEn: 'Relationships – Humanity',
    titleJp: '人間関係 – 人間性',
    descriptionVi: 'Xây dựng và nuôi dưỡng các mối quan hệ ý nghĩa',
    descriptionEn: 'Building and nurturing meaningful relationships',
    descriptionJp: '意味のある人間関係を築き育む',
  },
  {
    orderIndex: 7,
    titleVi: 'Quy luật – Nguyên lý – Chìa khóa',
    titleEn: 'Laws – Principles – Keys',
    titleJp: '法則 – 原理 – 鍵',
    descriptionVi: 'Khám phá các quy luật và nguyên lý nền tảng của cuộc sống',
    descriptionEn: 'Discovering the fundamental laws and principles of life',
    descriptionJp: '人生の根本的な法則と原理を発見する',
  },
  {
    orderIndex: 8,
    titleVi: 'Công thức – Phương pháp – Mật mã',
    titleEn: 'Formulas – Methods – Codes',
    titleJp: '公式 – 方法 – コード',
    descriptionVi: 'Ứng dụng công thức và phương pháp vào thực tiễn',
    descriptionEn: 'Applying formulas and methods to practice',
    descriptionJp: '公式と方法を実践に適用する',
  },
  {
    orderIndex: 9,
    titleVi: 'Giáo dục tận gốc – Di sản',
    titleEn: 'Root Education – Legacy',
    titleJp: '根本教育 – 遺産',
    descriptionVi: 'Giáo dục tận gốc và để lại di sản bền vững',
    descriptionEn: 'Root education and leaving a lasting legacy',
    descriptionJp: '根本教育と持続的な遺産を残す',
  },
];

/** Lesson distribution across chapters */
export const CHAPTER_LESSON_RANGES: Record<number, [number, number]> = {
  1: [1, 8],
  2: [9, 16],
  3: [17, 25],
  4: [26, 34],
  5: [35, 43],
  6: [44, 52],
  7: [53, 61],
  8: [62, 70],
  9: [71, 76],
};

/** Navigation items for sidebar/bottom nav */
export const NAV_ITEMS = [
  { path: '/', labelVi: 'Trang chủ', labelEn: 'Home', labelJp: 'ホーム', icon: 'Home' },
  { path: '/roadmap', labelVi: 'Lộ trình', labelEn: 'Roadmap', labelJp: 'ロードマップ', icon: 'Map' },
  { path: '/curriculum', labelVi: 'Giáo trình', labelEn: 'Curriculum', labelJp: 'カリキュラム', icon: 'BookOpen' },
  { path: '/dictionary', labelVi: 'Từ điển', labelEn: 'Dictionary', labelJp: '辞書', icon: 'Languages' },
  { path: '/settings', labelVi: 'Cài đặt', labelEn: 'Settings', labelJp: '設定', icon: 'Settings' },
] as const;

/** Inspirational quotes for dashboard */
export const QUOTES = [
  { vi: 'Đi chậm, đi chắc, đi đến tận gốc', en: 'Go slow, go steady, go to the root', jp: 'ゆっくり、確実に、根本まで' },
  { vi: 'Học là hành trình, không phải đích đến', en: 'Learning is a journey, not a destination', jp: '学びは旅であり、目的地ではない' },
  { vi: 'Mỗi bước đi đều có ý nghĩa', en: 'Every step has meaning', jp: 'すべての一歩に意味がある' },
  { vi: 'Tri thức là ánh sáng soi đường', en: 'Knowledge is the light that guides the way', jp: '知識は道を照らす光' },
  { vi: 'Nhận thức là khởi đầu của mọi thay đổi', en: 'Awareness is the beginning of all change', jp: '認知はすべての変化の始まり' },
];

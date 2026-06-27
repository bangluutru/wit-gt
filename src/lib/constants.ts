// ============================================================
// WiT Platform - Constants
// ============================================================

export const TOTAL_LESSONS = 76;
export const TOTAL_CHAPTERS = 9;

export const CHAPTER_NAMES = [
  {
    orderIndex: 1,
    titleVi: 'Nguyên lý Nền tảng',
    titleEn: 'Nguyên lý Nền tảng',
    titleJp: 'Nguyên lý Nền tảng',
    descriptionVi: 'Nhận thức gốc rễ vận hành cuộc sống.',
    descriptionEn: 'Nhận thức gốc rễ vận hành cuộc sống.',
    descriptionJp: 'Nhận thức gốc rễ vận hành cuộc sống.',
  },
  {
    orderIndex: 2,
    titleVi: 'Cấu trúc Con người',
    titleEn: 'Cấu trúc Con người',
    titleJp: 'Cấu trúc Con người',
    descriptionVi: 'Hiểu trọn vẹn về con người bên trong.',
    descriptionEn: 'Hiểu trọn vẹn về con người bên trong.',
    descriptionJp: 'Hiểu trọn vẹn về con người bên trong.',
  },
  {
    orderIndex: 3,
    titleVi: '7 Sự Giàu Toàn Diện',
    titleEn: '7 Sự Giàu Toàn Diện',
    titleJp: '7 Sự Giàu Toàn Diện',
    descriptionVi: 'Bảy chiều giàu có của một đời người.',
    descriptionEn: 'Bảy chiều giàu có của một đời người.',
    descriptionJp: 'Bảy chiều giàu có của một đời người.',
  },
  {
    orderIndex: 4,
    titleVi: 'Nhân tốt & Mối quan hệ',
    titleEn: 'Nhân tốt & Mối quan hệ',
    titleJp: 'Nhân tốt & Mối quan hệ',
    descriptionVi: 'Nhận dạng, thu hút và trở thành người tốt.',
    descriptionEn: 'Nhận dạng, thu hút và trở thành người tốt.',
    descriptionJp: 'Nhận dạng, thu hút và trở thành người tốt.',
  },
  {
    orderIndex: 5,
    titleVi: 'Lộ trình & Công thức',
    titleEn: 'Lộ trình & Công thức',
    titleJp: 'Lộ trình & Công thức',
    descriptionVi: 'Những công thức chuyển hoá cuộc sống.',
    descriptionEn: 'Những công thức chuyển hoá cuộc sống.',
    descriptionJp: 'Những công thức chuyển hoá cuộc sống.',
  },
  {
    orderIndex: 6,
    titleVi: 'Chuyên gia Tư vấn Nội tâm',
    titleEn: 'Chuyên gia Tư vấn Nội tâm',
    titleJp: 'Chuyên gia Tư vấn Nội tâm',
    descriptionVi: 'Đào tạo bậc chuyên gia huấn luyện nội tâm.',
    descriptionEn: 'Đào tạo bậc chuyên gia huấn luyện nội tâm.',
    descriptionJp: 'Đào tạo bậc chuyên gia huấn luyện nội tâm.',
  },
  {
    orderIndex: 7,
    titleVi: 'Đồ hình & Quy luật Nhân sinh',
    titleEn: 'Đồ hình & Quy luật Nhân sinh',
    titleJp: 'Đồ hình & Quy luật Nhân sinh',
    descriptionVi: 'Các quy luật vận hành của vũ trụ nhân sinh.',
    descriptionEn: 'Các quy luật vận hành của vũ trụ nhân sinh.',
    descriptionJp: 'Các quy luật vận hành của vũ trụ nhân sinh.',
  },
  {
    orderIndex: 8,
    titleVi: 'Lãnh đạo & Di sản',
    titleEn: 'Lãnh đạo & Di sản',
    titleJp: 'Lãnh đạo & Di sản',
    descriptionVi: 'Từ chìa khoá nội tâm đến di sản trường tồn.',
    descriptionEn: 'Từ chìa khoá nội tâm đến di sản trường tồn.',
    descriptionJp: 'Từ chìa khoá nội tâm đến di sản trường tồn.',
  },
  {
    orderIndex: 9,
    titleVi: 'Giáo dục Tận gốc',
    titleEn: 'Giáo dục Tận gốc',
    titleJp: 'Giáo dục Tận gốc',
    descriptionVi: 'Sự nghiệp giáo dục triết lý cho nhân sinh.',
    descriptionEn: 'Sự nghiệp giáo dục triết lý cho nhân sinh.',
    descriptionJp: 'Sự nghiệp giáo dục triết lý cho nhân sinh.',
  },
];

/** Lesson distribution across chapters */
export const CHAPTER_LESSON_RANGES: Record<number, [number, number]> = {
  1: [1, 6],
  2: [7, 15],
  3: [16, 23],
  4: [24, 31],
  5: [32, 41],
  6: [42, 48],
  7: [49, 60],
  8: [61, 72],
  9: [73, 76],
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

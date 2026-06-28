// ============================================================
// WiT Platform - Gratitude page data
// Edit these lists to add/update contributors and editors.
// ============================================================

/** People who compiled the curriculum & dictionary content. */
export const CONTRIBUTORS: string[] = [
  'Mai Kent',
  'Tâm Phúc',
  'Trịnh Phương Mai',
  'Phạm Thu Sương',
  'Vũ Thị Kim Oanh',
  'Đức Trịnh',
  'Nguyễn Thanh Hà',
  'Trà Nga',
  'Stephanie Xuân',
  'Phan Tường Vân',
  'Hồ Xuân Thuỷ',
  'Bùi Huỳnh Cúc Phương',
  'Hồng Nhi',
  'Trương Thị Hải Yến',
  'Nguyễn Thị Thu Hằng',
  'Nguyễn Thị Bích Thuỷ',
  'Trần Hoàng Điệp',
  'Thanh Tâm',
  'Thuỳ Lê',
  'Nguyễn Thị Thùy Trang',
  'Vương Nguyễn Phương Chi',
  'Nghiêm Thị Thủy',
];

/** Editing & proofreading team (paired names). */
export const EDITORS: string[] = [
  'Miley – Yến Nhi',
  'Gemma – Phương Mai',
  'Khánh Trâm – Romi',
  'Xuân Ý – Trà Mi',
  'Thiên Hương – Thảo Nhi',
  'Ann Trang – Frank',
];

/** First letter of a name, for placeholder avatars. */
export function initialOf(name: string): string {
  return name.trim().charAt(0).toUpperCase();
}

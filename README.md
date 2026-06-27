# WiT — Nền tảng Giáo trình Đa ngôn ngữ

> *"Đi chậm, đi chắc, đi đến tận gốc"*

Website giáo trình đa ngôn ngữ WiT: 76 học phần, 9 chương, từ điển VI/EN/JP, học tuần tự.

## ✨ Tính năng

- 🔐 Đăng ký/đăng nhập email
- 📚 76 học phần chia 9 chương, mở khoá tuần tự
- 🌏 Nội dung đa ngôn ngữ: Việt / Anh / Nhật
- 📖 Lesson Reader với song ngữ, highlight thuật ngữ
- 📕 Từ điển đa ngôn ngữ + Flashcard
- 🎨 3 theme: Sáng / Ấm / Tối
- 📱 Responsive: desktop sidebar + mobile bottom nav
- 👨‍💼 Admin: import CSV cho bài học và từ điển

## 🛠 Công nghệ

| Layer | Công nghệ |
|-------|-----------|
| Frontend | React 19 + Vite 6 + TypeScript |
| Routing | React Router v7 |
| Styling | Tailwind CSS v4 |
| Auth + DB | Firebase (Auth + Firestore) |
| Icons | lucide-react |
| Markdown | react-markdown + remark-gfm |
| Deploy | Cloudflare Pages |

## 🚀 Setup

### 1. Clone & Install

```bash
git clone <repo-url>
cd wit-gt
npm install
```

### 2. Firebase Setup

1. Tạo project mới trên [Firebase Console](https://console.firebase.google.com/)
2. Bật **Authentication** → Email/Password
3. Tạo **Firestore Database** (chế độ test hoặc production)
4. Vào **Project Settings** → lấy Firebase config

### 3. Environment Variables

Copy `.env.example` → `.env.local` và điền thông tin Firebase:

```bash
cp .env.example .env.local
```

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

### 4. Firestore Security Rules

Copy nội dung `firebase/firestore.rules` vào **Firestore → Rules** trong Firebase Console.

### 5. Seed Data

Có 2 cách import dữ liệu mẫu:

**Cách 1: Qua Admin Import (khuyến khích)**
1. Đăng ký tài khoản trên website
2. Trong Firestore Console, vào collection `users` → tìm document user của bạn → sửa field `role` thành `"admin"`
3. Truy cập `/admin/import` trên website
4. Upload file CSV

**Cách 2: Qua Firestore Console**
1. Vào Firestore Console
2. Tạo collections `chapters`, `lessons`, `dictionary` thủ công
3. Tham khảo cấu trúc trong `firebase/seed-data.ts`

### 6. Run Development Server

```bash
npm run dev
```

Mở http://localhost:5173

## 📁 Cấu trúc dự án

```
src/
├── pages/              # Route pages (Dashboard, Roadmap, etc.)
├── components/
│   ├── layout/         # AppShell, Sidebar, Header, MobileNav
│   ├── ui/             # Button, Card, Badge, Modal, etc.
│   ├── auth/           # ProtectedRoute
│   ├── curriculum/     # FilterBar, LessonCard
│   ├── reader/         # TermHighlighter, TermPopover, BottomSheet
│   └── dictionary/     # DictionaryCard, FlashcardSession
├── contexts/           # AuthContext, SettingsContext
├── hooks/              # useProgress, useLessons, useDictionary
└── lib/                # firebase, types, constants, utils
```

## 📊 Firestore Data Model

```
📁 chapters/{id}        — 9 chương
📁 lessons/{id}         — 76 học phần
📁 dictionary/{id}      — Thuật ngữ đa ngôn ngữ
📁 users/{uid}          — Profile người dùng
  └── 📁 progress/{id}  — Tiến độ học tập
```

## 📋 CSV Import Format

### Dictionary CSV
```csv
ID,VI_Term,VI_Cat,VI_Def,VI_POS,VI_IPA,EN_Term,EN_Cat,EN_Def,EN_POS,EN_IPA,JP_Term,JP_Cat,JP_Def,JP_POS,JP_Kana,VI_Img,EN_Img,JP_Img
```

### Lessons CSV
```csv
lesson_no,chapter_no,title_vi,title_en,title_jp,summary_vi,summary_en,summary_jp,content_vi,content_en,content_jp
```

Nội dung `content` hỗ trợ Markdown.

## 🌐 Deploy to Cloudflare Pages

### Qua CLI

```bash
npm run build
npx wrangler pages deploy dist
```

### Qua GitHub

1. Connect repo với Cloudflare Pages
2. Build command: `npm run build`
3. Output directory: `dist`
4. Thêm Environment Variables trong Cloudflare Dashboard

## 🔒 Bảo mật

- Firebase Auth xử lý authentication
- Firestore Rules bảo vệ dữ liệu (xem `firebase/firestore.rules`)
- Service role key không expose trên frontend
- Lesson access kiểm tra server-side qua Firestore rules
- Admin role kiểm tra trong Firestore

## 📝 Mở rộng sau

- [ ] Admin panel CRUD đầy đủ
- [ ] Quiz/assessment đơn giản
- [ ] Spaced Repetition System cho flashcard
- [ ] Streak tracking
- [ ] Chia sẻ tiến độ
- [ ] PDF export bài học
- [ ] Push notifications

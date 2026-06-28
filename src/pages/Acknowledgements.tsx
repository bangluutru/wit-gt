// ============================================================
// WiT Platform - Acknowledgements ("Trân trọng biết ơn")
// Static, multilingual credits page recognising everyone who helped
// build the platform. Edit the arrays below to update contributors.
// ============================================================

import { HeartHandshake, Heart, ExternalLink } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

interface Credit {
  nameVi: string; nameEn: string; nameJp: string;
  noteVi: string; noteEn: string; noteJp: string;
}

// ── Groups of contributors (edit here) ──
const GROUPS: { titleVi: string; titleEn: string; titleJp: string; people: Credit[] }[] = [
  {
    titleVi: 'Cố vấn & Định hướng', titleEn: 'Advisors & Direction', titleJp: '顧問・方向性',
    people: [
      {
        nameVi: 'Hội đồng cố vấn WiT', nameEn: 'WiT Advisory Board', nameJp: 'WiT顧問団',
        noteVi: 'Định hướng tư tưởng, học thuật và ứng dụng cho toàn bộ giáo trình.',
        noteEn: 'Ideological, academic and practical direction for the whole curriculum.',
        noteJp: 'カリキュラム全体への思想的・学術的・実践的な方向付け。',
      },
    ],
  },
  {
    titleVi: 'Biên soạn & Dịch thuật', titleEn: 'Editing & Translation', titleJp: '編集・翻訳',
    people: [
      {
        nameVi: 'Team biên soạn nội dung', nameEn: 'Content editorial team', nameJp: 'コンテンツ編集チーム',
        noteVi: 'Biên soạn 76 học phần và hệ thống thuật ngữ nhân sinh.',
        noteEn: 'Compiling 76 lessons and the life-terminology system.',
        noteJp: '76レッスンと人生用語体系の編集。',
      },
      {
        nameVi: 'Tổ dịch thuật Việt · Anh · Nhật', nameEn: 'VI · EN · JP translation team', nameJp: '越・英・日翻訳チーム',
        noteVi: 'Chuyển ngữ nội dung sang nhiều ngôn ngữ.',
        noteEn: 'Translating the content into multiple languages.',
        noteJp: 'コンテンツの多言語翻訳。',
      },
    ],
  },
  {
    titleVi: 'Thiết kế & Công nghệ', titleEn: 'Design & Technology', titleJp: 'デザイン・技術',
    people: [
      {
        nameVi: 'Tổ thiết kế & phát triển', nameEn: 'Design & development team', nameJp: 'デザイン・開発チーム',
        noteVi: 'Xây dựng giao diện đọc, tra cứu và nền tảng học tập.',
        noteEn: 'Building the reading, lookup and learning platform.',
        noteJp: '読書・検索・学習プラットフォームの構築。',
      },
    ],
  },
];

// ── Open-source / data acknowledgements (edit here) ──
const OSS: { label: string; url: string; noteVi: string; noteEn: string; noteJp: string }[] = [
  {
    label: 'dict.minhqnd.com', url: 'https://dict.minhqnd.com',
    noteVi: 'Dữ liệu từ điển đa ngôn ngữ (CC BY-SA 4.0).',
    noteEn: 'Multilingual dictionary data (CC BY-SA 4.0).',
    noteJp: '多言語辞書データ（CC BY-SA 4.0）。',
  },
  {
    label: 'React · Vite · Tailwind CSS', url: 'https://vite.dev',
    noteVi: 'Nền tảng giao diện và công cụ xây dựng.',
    noteEn: 'UI framework and build tooling.',
    noteJp: 'UIフレームワークとビルドツール。',
  },
  {
    label: 'Lucide Icons', url: 'https://lucide.dev',
    noteVi: 'Bộ biểu tượng mã nguồn mở.',
    noteEn: 'Open-source icon set.',
    noteJp: 'オープンソースのアイコンセット。',
  },
  {
    label: 'Firebase · Cloudflare Pages', url: 'https://firebase.google.com',
    noteVi: 'Hạ tầng xác thực, dữ liệu và lưu trữ.',
    noteEn: 'Authentication, data and hosting infrastructure.',
    noteJp: '認証・データ・ホスティング基盤。',
  },
];

export default function Acknowledgements() {
  const { interfaceLang } = useSettings();
  const L = (vi: string, en: string, jp: string) =>
    interfaceLang === 'en' ? en : interfaceLang === 'jp' ? jp : vi;
  const suffix = interfaceLang === 'en' ? 'En' : interfaceLang === 'jp' ? 'Jp' : 'Vi';
  const pick = (o: object, base: string) =>
    ((o as Record<string, string>)[`${base}${suffix}`]) || '';

  return (
    <div className="page-enter max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-[1.6px] text-wit-gold">
          {L('Lời tri ân', 'A note of gratitude', '感謝の言葉')}
        </span>
        <h1 className="font-serif text-3xl font-bold text-wit-text mt-1 flex items-center gap-2.5">
          <HeartHandshake className="h-7 w-7 text-wit-red" />
          {L('Trân trọng biết ơn', 'With Gratitude', '感謝を込めて')}
        </h1>
        <p className="text-[14.5px] text-wit-text-secondary mt-2 leading-relaxed">
          {L(
            'Trang web này được hình thành nhờ tâm huyết và đóng góp của rất nhiều người. Chúng tôi xin trân trọng ghi nhận và biết ơn tất cả những ai đã chung tay vun đắp.',
            'This platform exists thanks to the heart and contribution of many people. We gratefully acknowledge everyone who helped bring it to life.',
            'このプラットフォームは多くの人々の心と貢献によって実現しました。支えてくださったすべての方々に感謝いたします。'
          )}
        </p>
      </div>

      {/* Hero quote */}
      <div className="rounded-3xl overflow-hidden p-7 sm:p-9 bg-gradient-to-br from-wit-red-dark via-wit-red to-[#A6201F] text-[#FDF3EC] shadow-lg">
        <Heart className="h-8 w-8 mb-3 fill-current opacity-90" />
        <p className="font-serif text-xl sm:text-2xl font-bold leading-snug">
          {L(
            '“Gieo một nhân thiện lành hôm nay, là gặt một quả an vui mai sau.”',
            '“Sowing a wholesome seed today harvests a peaceful fruit tomorrow.”',
            '「今日善い種を蒔けば、明日穏やかな果実が実ります。」'
          )}
        </p>
        <p className="text-sm opacity-90 mt-3">
          {L(
            'Xin gửi lời tri ân sâu sắc tới mọi đóng góp, dù lớn hay nhỏ.',
            'Our deep gratitude for every contribution, large or small.',
            '大小を問わず、すべての貢献に深く感謝します。'
          )}
        </p>
      </div>

      {/* Contributor groups */}
      <div className="space-y-6">
        {GROUPS.map((g) => (
          <div key={g.titleVi} className="bg-wit-surface rounded-2xl border border-wit-line shadow-sm p-5">
            <h2 className="font-serif text-lg font-bold text-wit-text mb-3">{pick(g, 'title')}</h2>
            <div className="space-y-3">
              {g.people.map((p) => (
                <div key={p.nameVi} className="flex items-start gap-3">
                  <div className="mt-1.5 h-2 w-2 rounded-full bg-wit-gold shrink-0" />
                  <div>
                    <div className="font-semibold text-wit-text text-sm">{pick(p, 'name')}</div>
                    <div className="text-[13px] text-wit-text-secondary leading-relaxed">{pick(p, 'note')}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Open-source & data */}
      <div className="bg-wit-surface rounded-2xl border border-wit-line shadow-sm p-5">
        <h2 className="font-serif text-lg font-bold text-wit-text mb-1">
          {L('Công nghệ & dữ liệu mã nguồn mở', 'Open-source technology & data', 'オープンソース技術・データ')}
        </h2>
        <p className="text-[13px] text-wit-text-secondary mb-4">
          {L(
            'Trang web được xây dựng trên vai những người khổng lồ của cộng đồng mã nguồn mở.',
            'Built on the shoulders of the open-source community.',
            'オープンソースコミュニティの礎の上に構築されています。'
          )}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {OSS.map((o) => (
            <a
              key={o.label}
              href={o.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2.5 p-3 rounded-xl border border-wit-line hover:border-wit-red/40 transition-colors group"
            >
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-wit-text group-hover:text-wit-red transition-colors flex items-center gap-1">
                  {o.label} <ExternalLink className="h-3 w-3 text-wit-text-tertiary" />
                </div>
                <div className="text-[12px] text-wit-text-tertiary mt-0.5">{pick(o, 'note')}</div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Closing */}
      <div className="text-center pt-2 pb-4">
        <p className="text-sm text-wit-text-secondary flex items-center justify-center gap-1.5">
          {L('Trân trọng,', 'With respect,', '敬具')}
          <span className="font-serif font-bold text-wit-red">WiT</span>
        </p>
      </div>
    </div>
  );
}

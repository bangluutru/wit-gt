import { Sparkles } from 'lucide-react';
import type { Language } from '../../lib/types';

interface Props {
  lang: Language;
}

export function Wit365Hero({ lang }: Props) {
  const L = (vi: string, en: string, jp: string) =>
    lang === 'en' ? en : lang === 'jp' ? jp : vi;

  return (
    <header className="text-center pt-11 pb-7">
      {/* Eyebrow */}
      <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[2.4px] text-wit-gold animate-fade-in">
        <Sparkles className="h-[15px] w-[15px]" />
        WiT365
      </div>

      {/* Title */}
      <h1 className="mt-3.5 mx-auto max-w-[520px] font-serif text-4xl sm:text-[42px] font-bold text-wit-text leading-[1.16] text-balance animate-slide-up">
        {L(
          'Mỗi ngày một hạt giống nhận thức',
          'A seed of awareness, every day',
          '毎日ひとつの気づきの種'
        )}
      </h1>

      {/* Inline subtitle with gold dots */}
      <div
        className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-[14.5px] text-wit-text-secondary animate-slide-up"
        style={{ animationDelay: '100ms' }}
      >
        <span>{L('Một câu nói', 'A single quote', 'ひとつの言葉')}</span>
        <span className="text-wit-gold text-[9px]">●</span>
        <span>{L('Một phút dừng lại', 'A moment to pause', 'ひと息の間')}</span>
        <span className="text-wit-gold text-[9px]">●</span>
        <span>{L('Một góc nhìn mới', 'A new perspective', '新しい視点')}</span>
      </div>

      {/* Description */}
      <p
        className="mt-3 mx-auto max-w-[460px] text-[13px] text-wit-text-tertiary leading-relaxed animate-slide-up"
        style={{ animationDelay: '160ms' }}
      >
        {L(
          '365 hạt giống được chắt lọc từ những bài giảng của Thầy Trần Thanh Toàn và Tổ chức WiT.',
          '365 seeds distilled from the teachings of Teacher Trần Thanh Toàn and the WiT Organization.',
          'トラン・タイン・トアン先生とWiT組織の教えから厳選された365の種。'
        )}
      </p>
    </header>
  );
}

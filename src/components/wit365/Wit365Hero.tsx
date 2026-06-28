import { Sparkles } from 'lucide-react';
import type { Language } from '../../lib/types';

interface Props {
  lang: Language;
}

export function Wit365Hero({ lang }: Props) {
  const L = (vi: string, en: string, jp: string) =>
    lang === 'en' ? en : lang === 'jp' ? jp : vi;

  return (
    <section className="relative -mx-4 sm:-mx-6 px-4 sm:px-6 min-h-[72vh] flex flex-col justify-center overflow-hidden">
      {/* Warm paper radial background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            'radial-gradient(circle at 25% 35%, rgba(184,137,52,0.07), transparent 40%), radial-gradient(circle at 80% 65%, rgba(198,33,40,0.04), transparent 45%)',
        }}
      />

      <div className="relative max-w-2xl py-20 mx-auto text-center">
        <div className="inline-flex items-center gap-2 text-xs sm:text-[13px] font-bold uppercase tracking-[2.4px] text-wit-gold animate-fade-in">
          <Sparkles className="h-4 w-4" />
          WiT365
        </div>

        <h1 className="mt-5 font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-wit-text leading-[1.18] animate-slide-up">
          {L(
            'Mỗi ngày một hạt giống nhận thức',
            'A seed of awareness, every day',
            '毎日ひとつの気づきの種'
          )}
        </h1>

        <div className="mt-8 space-y-1 text-[15px] sm:text-base text-wit-text-secondary leading-relaxed animate-slide-up" style={{ animationDelay: '120ms' }}>
          <p>{L('Một câu nói.', 'A single quote.', 'ひとつの言葉。')}</p>
          <p>{L('Một phút dừng lại.', 'A moment to pause.', 'ひと息の間。')}</p>
          <p>{L('Một góc nhìn mới.', 'A new perspective.', '新しい視点。')}</p>
          <p className="mt-4 text-sm text-wit-text-tertiary max-w-lg mx-auto">
            {L(
              '365 hạt giống được chắt lọc từ những bài giảng của Thầy Trần Thanh Toàn và Tổ chức WiT.',
              '365 seeds distilled from the teachings of Teacher Trần Thanh Toàn and the WiT Organization.',
              'トラン・タイン・トアン先生とWiT組織の教えから厳選された365の種。'
            )}
          </p>
        </div>
      </div>
    </section>
  );
}

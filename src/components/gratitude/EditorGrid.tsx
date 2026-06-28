import { Reveal } from './Reveal';
import { EDITORS, initialOf } from '../../lib/gratitudeData';
import type { Language } from '../../lib/types';

interface Props { lang: Language }

export function EditorGrid({ lang }: Props) {
  const L = (vi: string, en: string, jp: string) =>
    lang === 'en' ? en : lang === 'jp' ? jp : vi;

  return (
    <section className="py-20 sm:py-24">
      <Reveal>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-wit-text leading-tight max-w-2xl">
          {L(
            'Đội ngũ biên tập & hiệu đính',
            'Editorial & Proofreading Team',
            '編集・校正チーム'
          )}
        </h2>
      </Reveal>

      <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-4">
        {EDITORS.map((name, i) => (
          <Reveal key={name} delay={Math.min(i, 6) * 60}>
            <div className="h-full flex items-center gap-4 p-5 rounded-2xl bg-wit-surface border border-wit-line shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover">
              <div className="shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-wit-gold to-wit-red text-white flex items-center justify-center font-serif font-bold text-lg shadow-sm">
                {initialOf(name)}
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-wit-text text-sm leading-snug">{name}</div>
                <span className="inline-block mt-1.5 text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full bg-wit-gold-soft text-wit-gold">
                  {L('Biên tập & Hiệu đính', 'Edit & Proofread', '編集・校正')}
                </span>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={120}>
        <p className="mt-12 max-w-2xl text-[15px] text-wit-text-secondary leading-relaxed">
          {L(
            'Nhờ sự cẩn trọng trong từng lần rà soát, đối chiếu và hiệu đính, những nội dung trên nền tảng ngày càng rõ ràng, chính xác và dễ tiếp cận hơn với người học.',
            'Thanks to the care in each review, cross-check, and proofreading, the content on the platform has become increasingly clear, accurate, and accessible to learners.',
            '丁寧な見直し、照合、校正のおかげで、プラットフォーム上のコンテンツは学習者にとってますます明確で、正確で、アクセスしやすいものになっています。'
          )}
        </p>
      </Reveal>
    </section>
  );
}

import React from 'react';
import { Reveal } from './Reveal';
import type { Language } from '../../lib/types';

interface Props { lang: Language }

const LINES_VI = [
  'Mỗi góp ý.',
  'Mỗi lần phát hiện lỗi.',
  'Mỗi đề xuất cải tiến.',
  'Mỗi bài học mới.',
  'Mỗi thuật ngữ mới.',
];

const LINES_EN = [
  'Every suggestion.',
  'Every bug discovered.',
  'Every improvement proposed.',
  'Every new lesson.',
  'Every new term.',
];

const LINES_JP = [
  'すべての提案。',
  '発見されたすべての誤り。',
  'すべての改善提案。',
  'すべての新しいレッスン。',
  'すべての新しい用語。',
];

export function JourneySection({ lang }: Props) {
  const L = (vi: React.ReactNode, en: React.ReactNode, jp: React.ReactNode): React.ReactNode =>
    lang === 'en' ? en : lang === 'jp' ? jp : vi;

  const lines = lang === 'en' ? LINES_EN : lang === 'jp' ? LINES_JP : LINES_VI;

  return (
    <section className="-mx-4 sm:-mx-6 px-4 sm:px-6 bg-wit-surface">
      <div className="py-24 sm:py-32 max-w-3xl mx-auto">
        <Reveal>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-wit-text leading-[1.18]">
            {L(
              'Những người tiếp tục viết nên hành trình',
              'Those who continue to write the journey',
              '旅を書き続ける人々'
            )}
          </h2>
        </Reveal>

        <Reveal delay={120}>
          <p className="mt-8 text-lg text-wit-text-secondary leading-relaxed">
            {L(
              'Website này sẽ còn tiếp tục được hoàn thiện mỗi ngày.',
              'This website will continue to be refined every day.',
              'このウェブサイトは毎日改善され続けます。'
            )}
          </p>
        </Reveal>

        <div className="mt-8 space-y-2">
          {lines.map((line, i) => (
            <Reveal key={i} delay={i * 90}>
              <p className="font-serif text-2xl sm:text-3xl font-bold text-wit-text/90">{line}</p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <div className="mt-10 space-y-5 text-[15px] sm:text-base text-wit-text-secondary leading-relaxed">
            <p className="text-wit-red font-semibold font-serif text-xl">
              {L(
                'Đều là một phần của hành trình đồng sáng tạo.',
                'All are part of the co-creation journey.',
                'すべてが共同創造の旅の一部です。'
              )}
            </p>
            <p>
              {L(
                'Chúng tôi trân trọng biết ơn tất cả những học viên, cộng sự, tình nguyện viên và những người sẽ tiếp tục góp phần phát triển nền tảng này.',
                'We are deeply grateful to all learners, collaborators, volunteers, and those who will continue to contribute to the development of this platform.',
                'すべての学習者、協力者、ボランティア、そしてこのプラットフォームの発展に貢献し続ける方々に、心から感謝いたします。'
              )}
            </p>
            <p>
              {L(
                <><span>Có những đóng góp được ghi tên.</span><br /><span>Cũng có những đóng góp diễn ra trong thầm lặng.</span><br /><span className="text-wit-text font-medium">Nhưng tất cả đều đáng được trân trọng.</span></>,
                <><span>Some contributions are named.</span><br /><span>Others happen in silence.</span><br /><span className="text-wit-text font-medium">But all deserve to be cherished.</span></>,
                <><span>名前が記される貢献もあります。</span><br /><span>沈黙の中で行われる貢献もあります。</span><br /><span className="text-wit-text font-medium">しかし、すべては大切にされるべきものです。</span></>
              )}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

import React from 'react';
import { Sprout } from 'lucide-react';
import { Reveal } from './Reveal';
import type { Language } from '../../lib/types';

interface Props { lang: Language }

export function GratitudeHero({ lang }: Props) {
  const L = (vi: React.ReactNode, en: React.ReactNode, jp: React.ReactNode): React.ReactNode =>
    lang === 'en' ? en : lang === 'jp' ? jp : vi;

  return (
    <section className="relative -mx-4 sm:-mx-6 px-4 sm:px-6 min-h-[82vh] flex flex-col justify-center overflow-hidden">
      {/* Faint growing-seed motif behind the content */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-end opacity-[0.05]">
        <Sprout className="h-[460px] w-[460px] text-wit-red translate-x-12" strokeWidth={0.8} />
      </div>
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 18% 30%, rgba(184,137,52,0.08), transparent 38%), radial-gradient(circle at 85% 70%, rgba(198,33,40,0.06), transparent 40%)',
        }}
      />

      <div className="relative max-w-3xl py-20">
        <Reveal>
          <span className="text-xs sm:text-[13px] font-bold uppercase tracking-[2.4px] text-wit-gold">
            {L('Tri ân & Đồng sáng tạo', 'Gratitude & Co-Creation', '感謝と共同創造')}
          </span>
        </Reveal>
        <Reveal delay={120}>
          <h1 className="mt-5 font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-wit-text leading-[1.18]">
            {L(
              'Mỗi tri thức được lưu giữ là một hạt giống của sự thấu hiểu.',
              'Every piece of knowledge preserved is a seed of understanding.',
              '保存されたすべての知識は、理解の種です。'
            )}
          </h1>
        </Reveal>
        <Reveal delay={240}>
          <div className="mt-8 space-y-4 text-[15px] sm:text-base text-wit-text-secondary leading-relaxed max-w-2xl">
            <p>
              {L(
                'Nền tảng Giáo trình & Từ điển Nội tâm WiT được xây dựng từ sự chung tay của rất nhiều con người.',
                'The WiT Curriculum & Inner Dictionary Platform was built through the collective effort of many people.',
                'WiTカリキュラム・内面辞書プラットフォームは、多くの人々の共同努力によって構築されました。'
              )}
            </p>
            <p>
              {L(
                'Mỗi bài học, mỗi thuật ngữ, mỗi ví dụ và mỗi nội dung trên website đều là kết quả của quá trình học tập, nghiên cứu, biên soạn, hiệu đính và phụng sự không ngừng nghỉ.',
                'Every lesson, every term, every example and every piece of content on the website is the result of tireless learning, research, writing, editing and dedication.',
                'ウェブサイト上のすべてのレッスン、用語、例、コンテンツは、たゆまぬ学習、研究、執筆、編集、そして献身の結果です。'
              )}
            </p>
            <p>
              {L(
                <>Website này là thành quả của tinh thần{' '}<span className="text-wit-red font-semibold">Đồng sáng tạo</span> – nơi mỗi người góp một phần nhỏ để tạo nên một giá trị lớn hơn cho cộng đồng.</>,
                <>This website is the result of the spirit of{' '}<span className="text-wit-red font-semibold">Co-Creation</span> – where each person contributes a small part to create a greater value for the community.</>,
                <>このウェブサイトは{' '}<span className="text-wit-red font-semibold">共同創造</span>の精神の産物です。それぞれの人が小さな貢献をすることで、コミュニティにより大きな価値を生み出します。</>
              )}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

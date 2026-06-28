import { Reveal } from './Reveal';
import type { Language } from '../../lib/types';

interface Props { lang: Language }

export function FinalMessage({ lang }: Props) {
  const L = (vi: string, en: string, jp: string) =>
    lang === 'en' ? en : lang === 'jp' ? jp : vi;

  return (
    <section className="-mx-4 sm:-mx-6 px-4 sm:px-6 min-h-[78vh] flex items-center justify-center bg-gradient-to-b from-wit-paper via-wit-red-soft/40 to-wit-paper">
      <div className="max-w-2xl mx-auto text-center py-20">
        <Reveal>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-wit-text leading-snug">
            {L(
              'Tri thức sẽ tiếp tục được viết bởi những người biết học hỏi.',
              'Knowledge will continue to be written by those who know how to learn.',
              '知識は、学び方を知る人々によって書き続けられます。'
            )}
          </p>
        </Reveal>
        <Reveal delay={150}>
          <p className="mt-7 text-[15px] sm:text-base text-wit-text-secondary leading-relaxed">
            {L(
              'Hy vọng rằng, khi sử dụng Nền tảng Giáo trình & Từ điển Nội tâm WiT, mỗi người không chỉ tiếp nhận thêm kiến thức, mà còn tiếp nối hành trình lan tỏa những giá trị tốt đẹp đến gia đình, cộng đồng và xã hội.',
              'We hope that when using the WiT Curriculum & Inner Dictionary Platform, each person not only gains more knowledge, but also continues the journey of spreading good values to their family, community, and society.',
              'WiTカリキュラム・内面辞書プラットフォームを使用する際、それぞれの人が知識を得るだけでなく、家族、コミュニティ、そして社会へと善い価値を広める旅を続けてくれることを願っています。'
            )}
          </p>
        </Reveal>
        <Reveal delay={320}>
          <p className="mt-12 font-serif text-2xl sm:text-3xl md:text-[34px] font-bold text-wit-red leading-snug">
            {L(
              'Xin trân trọng biết ơn tất cả những người đã góp phần tạo nên hành trình này.',
              'With heartfelt gratitude to all who have contributed to making this journey possible.',
              'この旅を実現するために貢献してくださったすべての方々に、心から感謝いたします。'
            )}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

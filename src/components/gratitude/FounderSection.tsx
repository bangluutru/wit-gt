import { Reveal } from './Reveal';
import type { Language } from '../../lib/types';

interface Props { lang: Language }

export function FounderSection({ lang }: Props) {
  const L = (vi: string, en: string, jp: string) =>
    lang === 'en' ? en : lang === 'jp' ? jp : vi;

  return (
    <section className="py-20 sm:py-28">
      <div className="grid grid-cols-1 md:grid-cols-[0.85fr_1.15fr] gap-10 md:gap-14 items-center">
        {/* Portrait placeholder */}
        <Reveal>
          <div className="relative mx-auto md:mx-0 w-full max-w-xs aspect-[4/5] rounded-3xl overflow-hidden bg-gradient-to-br from-wit-red-soft to-wit-surface-2 border border-wit-line shadow-card flex flex-col items-center justify-center">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-wit-red to-wit-red-dark text-white flex items-center justify-center font-serif font-bold text-4xl shadow-md">
              TT
            </div>
            <p className="mt-5 font-serif font-bold text-wit-text text-lg">Thầy Trần Thanh Toàn</p>
            <p className="text-xs text-wit-text-tertiary mt-1">
              {L('Nhà sáng lập Tổ chức WiT', 'Founder of WiT Organization', 'WiT組織の創設者')}
            </p>
          </div>
        </Reveal>

        {/* Text */}
        <Reveal delay={120}>
          <div>
            <span className="text-xs font-bold uppercase tracking-[1.8px] text-wit-gold">
              {L('Người khởi nguồn', 'The Founder', '創設者')}
            </span>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl font-bold text-wit-text leading-tight">
              {L('Người khởi nguồn', 'The Founder', '創設者')}
            </h2>
            <div className="mt-6 space-y-4 text-[15px] text-wit-text-secondary leading-relaxed">
              <p>
                {L(
                  <>Với tất cả sự trân trọng và biết ơn, chúng tôi xin tri ân{' '}<span className="text-wit-text font-semibold">Thầy Trần Thanh Toàn</span> – Nhà sáng lập Tổ chức WiT.</>,
                  <>With the utmost respect and gratitude, we honor{' '}<span className="text-wit-text font-semibold">Teacher Trần Thanh Toàn</span> – Founder of the WiT Organization.</>,
                  <>深い敬意と感謝を込めて、WiT組織の創設者である{' '}<span className="text-wit-text font-semibold">トラン・タイン・トアン先生</span>に感謝申し上げます。</>
                )}
              </p>
              <p>
                {L(
                  <><span className="text-wit-red font-semibold">Thầy là người đã khởi xướng và không ngừng phát triển Triết lý Giáo dục Tận gốc</span>, đặt nền móng cho hành trình giúp con người phát triển từ gốc rễ của nhận thức, nội tâm và trí tuệ.</>,
                  <>The teacher was the one who initiated and continuously developed the{' '}<span className="text-wit-red font-semibold">Root Education Philosophy</span>, laying the foundation for a journey of helping people grow from the roots of awareness, inner self, and intellect.</>,
                  <>先生は{' '}<span className="text-wit-red font-semibold">根源教育哲学</span>を提唱し、発展させ続けた方で、人が認識・内面・知性の根底から成長するための旅の礎を築かれました。</>
                )}
              </p>
              <p>
                {L(
                  'Từ những hạt giống đầu tiên ấy, cộng đồng WiT đã và đang tiếp tục cùng nhau học tập, thực hành, nghiên cứu và lan tỏa những giá trị tốt đẹp đến nhiều người hơn.',
                  'From those first seeds, the WiT community has continued to learn, practice, research, and spread good values to more and more people.',
                  'その最初の種から、WiTコミュニティはともに学び、実践し、研究し、より多くの人々へ善い価値を広め続けています。'
                )}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

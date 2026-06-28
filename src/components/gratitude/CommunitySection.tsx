import { Users } from 'lucide-react';
import { Reveal } from './Reveal';
import type { Language } from '../../lib/types';

interface Props { lang: Language }

export function CommunitySection({ lang }: Props) {
  const L = (vi: string, en: string, jp: string) =>
    lang === 'en' ? en : lang === 'jp' ? jp : vi;

  return (
    <section className="-mx-4 sm:-mx-6 px-4 sm:px-6 bg-wit-red-soft">
      <div className="py-20 sm:py-24 max-w-3xl mx-auto text-center">
        <Reveal>
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-card bg-wit-red text-white shadow-card">
            <Users className="h-8 w-8" />
          </div>
        </Reveal>
        <Reveal delay={120}>
          <h2 className="mt-6 font-serif text-3xl sm:text-4xl font-bold text-wit-text leading-tight">
            {L('Tri ân Quý Thầy Cô Tổ chức WiT', 'Gratitude to WiT Teachers & Educators', 'WiT組織の先生方への感謝')}
          </h2>
        </Reveal>
        <Reveal delay={220}>
          <div className="mt-6 space-y-4 text-[15px] text-wit-text-secondary leading-relaxed">
            <p>
              {L(
                'Xin gửi lời biết ơn sâu sắc đến toàn thể Quý Thầy Cô của Tổ chức WiT.',
                'We extend our deepest gratitude to all Teachers and Educators of the WiT Organization.',
                'WiT組織の全ての先生方に、深い感謝の意を捧げます。'
              )}
            </p>
            <p>
              {L(
                'Bằng sự tận tâm, tinh thần phụng sự và tình yêu dành cho giáo dục, Quý Thầy Cô đã và đang bền bỉ lan tỏa Triết lý Giáo dục Tận gốc, đồng hành cùng hàng ngàn học viên trên hành trình trưởng thành về nhận thức, trí tuệ và nhân cách.',
                'Through their dedication, spirit of service, and love of education, our teachers have steadfastly spread the Root Education Philosophy, accompanying thousands of learners on their journey of growth in awareness, intellect, and character.',
                'その献身、奉仕の精神、そして教育への愛をもって、先生方は根源教育哲学を粘り強く広め、認識・知性・人格の成長の旅において何千人もの学習者に寄り添ってきました。'
              )}
            </p>
            <p>
              {L(
                'Chính sự bền bỉ ấy đã tạo nên nền tảng để những giá trị của WiT tiếp tục được gìn giữ và phát triển.',
                "It is precisely that perseverance that has created the foundation for WiT's values to continue to be preserved and developed.",
                'まさにその粘り強さこそが、WiTの価値観が守られ、発展し続けるための礎を築いてきたのです。'
              )}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

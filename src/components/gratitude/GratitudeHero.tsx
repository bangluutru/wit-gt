import { Sprout } from 'lucide-react';
import { Reveal } from './Reveal';

export function GratitudeHero() {
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
            Tri ân &amp; Đồng sáng tạo
          </span>
        </Reveal>
        <Reveal delay={120}>
          <h1 className="mt-5 font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-wit-text leading-[1.18]">
            Mỗi tri thức được lưu giữ là một hạt giống của sự thấu hiểu.
          </h1>
        </Reveal>
        <Reveal delay={240}>
          <div className="mt-8 space-y-4 text-[15px] sm:text-base text-wit-text-secondary leading-relaxed max-w-2xl">
            <p>
              Nền tảng Giáo trình &amp; Từ điển Nội tâm WiT được xây dựng từ sự chung tay của rất
              nhiều con người.
            </p>
            <p>
              Mỗi bài học, mỗi thuật ngữ, mỗi ví dụ và mỗi nội dung trên website đều là kết quả của
              quá trình học tập, nghiên cứu, biên soạn, hiệu đính và phụng sự không ngừng nghỉ.
            </p>
            <p>
              Website này là thành quả của tinh thần{' '}
              <span className="text-wit-red font-semibold">Đồng sáng tạo</span> – nơi mỗi người góp
              một phần nhỏ để tạo nên một giá trị lớn hơn cho cộng đồng.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

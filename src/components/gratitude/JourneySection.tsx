import { Reveal } from './Reveal';

const LINES = [
  'Mỗi góp ý.',
  'Mỗi lần phát hiện lỗi.',
  'Mỗi đề xuất cải tiến.',
  'Mỗi bài học mới.',
  'Mỗi thuật ngữ mới.',
];

export function JourneySection() {
  return (
    <section className="-mx-4 sm:-mx-6 px-4 sm:px-6 bg-wit-surface">
      <div className="py-24 sm:py-32 max-w-3xl mx-auto">
        <Reveal>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-wit-text leading-[1.18]">
            Những người tiếp tục viết nên hành trình
          </h2>
        </Reveal>

        <Reveal delay={120}>
          <p className="mt-8 text-lg text-wit-text-secondary leading-relaxed">
            Website này sẽ còn tiếp tục được hoàn thiện mỗi ngày.
          </p>
        </Reveal>

        <div className="mt-8 space-y-2">
          {LINES.map((line, i) => (
            <Reveal key={line} delay={i * 90}>
              <p className="font-serif text-2xl sm:text-3xl font-bold text-wit-text/90">{line}</p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <div className="mt-10 space-y-5 text-[15px] sm:text-base text-wit-text-secondary leading-relaxed">
            <p className="text-wit-red font-semibold font-serif text-xl">
              Đều là một phần của hành trình đồng sáng tạo.
            </p>
            <p>
              Chúng tôi trân trọng biết ơn tất cả những học viên, cộng sự, tình nguyện viên và những
              người sẽ tiếp tục góp phần phát triển nền tảng này.
            </p>
            <p>
              Có những đóng góp được ghi tên.
              <br />
              Cũng có những đóng góp diễn ra trong thầm lặng.
              <br />
              <span className="text-wit-text font-medium">Nhưng tất cả đều đáng được trân trọng.</span>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

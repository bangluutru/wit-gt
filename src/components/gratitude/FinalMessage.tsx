import { Reveal } from './Reveal';

export function FinalMessage() {
  return (
    <section className="-mx-4 sm:-mx-6 px-4 sm:px-6 min-h-[78vh] flex items-center justify-center bg-gradient-to-b from-wit-paper via-wit-red-soft/40 to-wit-paper">
      <div className="max-w-2xl mx-auto text-center py-20">
        <Reveal>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-wit-text leading-snug">
            Tri thức sẽ tiếp tục được viết bởi những người biết học hỏi.
          </p>
        </Reveal>
        <Reveal delay={150}>
          <p className="mt-7 text-[15px] sm:text-base text-wit-text-secondary leading-relaxed">
            Hy vọng rằng, khi sử dụng Nền tảng Giáo trình &amp; Từ điển Nội tâm WiT, mỗi người không
            chỉ tiếp nhận thêm kiến thức, mà còn tiếp nối hành trình lan tỏa những giá trị tốt đẹp
            đến gia đình, cộng đồng và xã hội.
          </p>
        </Reveal>
        <Reveal delay={320}>
          <p className="mt-12 font-serif text-2xl sm:text-3xl md:text-[34px] font-bold text-wit-red leading-snug">
            Xin trân trọng biết ơn tất cả những người đã góp phần tạo nên hành trình này.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

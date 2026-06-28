import { Reveal } from './Reveal';

export function FounderSection() {
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
            <p className="text-xs text-wit-text-tertiary mt-1">Nhà sáng lập Tổ chức WiT</p>
          </div>
        </Reveal>

        {/* Text */}
        <Reveal delay={120}>
          <div>
            <span className="text-xs font-bold uppercase tracking-[1.8px] text-wit-gold">
              Người khởi nguồn
            </span>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl font-bold text-wit-text leading-tight">
              Người khởi nguồn
            </h2>
            <div className="mt-6 space-y-4 text-[15px] text-wit-text-secondary leading-relaxed">
              <p>
                Với tất cả sự trân trọng và biết ơn, chúng tôi xin tri ân{' '}
                <span className="text-wit-text font-semibold">Thầy Trần Thanh Toàn</span> – Nhà sáng
                lập Tổ chức WiT.
              </p>
              <p>
                Thầy là người đã khởi xướng và không ngừng phát triển{' '}
                <span className="text-wit-red font-semibold">Triết lý Giáo dục Tận gốc</span>, đặt
                nền móng cho hành trình giúp con người phát triển từ gốc rễ của nhận thức, nội tâm và
                trí tuệ.
              </p>
              <p>
                Từ những hạt giống đầu tiên ấy, cộng đồng WiT đã và đang tiếp tục cùng nhau học tập,
                thực hành, nghiên cứu và lan tỏa những giá trị tốt đẹp đến nhiều người hơn.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

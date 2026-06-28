import { Users } from 'lucide-react';
import { Reveal } from './Reveal';

export function CommunitySection() {
  return (
    <section className="-mx-4 sm:-mx-6 px-4 sm:px-6 bg-wit-red-soft">
      <div className="py-20 sm:py-24 max-w-3xl mx-auto text-center">
        <Reveal>
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-wit-red text-white shadow-md">
            <Users className="h-8 w-8" />
          </div>
        </Reveal>
        <Reveal delay={120}>
          <h2 className="mt-6 font-serif text-3xl sm:text-4xl font-bold text-wit-text leading-tight">
            Tri ân Quý Thầy Cô Tổ chức WiT
          </h2>
        </Reveal>
        <Reveal delay={220}>
          <div className="mt-6 space-y-4 text-[15px] text-wit-text-secondary leading-relaxed">
            <p>Xin gửi lời biết ơn sâu sắc đến toàn thể Quý Thầy Cô của Tổ chức WiT.</p>
            <p>
              Bằng sự tận tâm, tinh thần phụng sự và tình yêu dành cho giáo dục, Quý Thầy Cô đã và
              đang bền bỉ lan tỏa Triết lý Giáo dục Tận gốc, đồng hành cùng hàng ngàn học viên trên
              hành trình trưởng thành về nhận thức, trí tuệ và nhân cách.
            </p>
            <p>
              Chính sự bền bỉ ấy đã tạo nên nền tảng để những giá trị của WiT tiếp tục được gìn giữ
              và phát triển.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

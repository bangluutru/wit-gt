import { Reveal } from './Reveal';
import { CONTRIBUTORS, initialOf } from '../../lib/gratitudeData';

export function ContributorGrid() {
  return (
    <section className="py-20 sm:py-24">
      <Reveal>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-wit-text leading-tight max-w-2xl">
          Những người đã góp phần xây dựng kho tri thức này
        </h2>
      </Reveal>

      <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {CONTRIBUTORS.map((name, i) => (
          <Reveal key={name} delay={Math.min(i, 8) * 50}>
            <div className="h-full flex flex-col items-center text-center gap-3 p-5 rounded-2xl bg-wit-surface border border-wit-line shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-wit-red to-wit-red-dark text-white flex items-center justify-center font-serif font-bold text-xl shadow-sm">
                {initialOf(name)}
              </div>
              <div className="font-semibold text-wit-text text-sm leading-snug">{name}</div>
              <span className="text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full bg-wit-gold-soft text-wit-gold">
                Biên soạn nội dung
              </span>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={120}>
        <div className="mt-12 max-w-2xl text-[15px] text-wit-text-secondary leading-relaxed">
          <p className="font-serif text-lg text-wit-text">
            Mỗi người mang đến một góc nhìn.
            <br />
            Một trải nghiệm.
            <br />
            Một sự thấu hiểu.
          </p>
          <p className="mt-4">
            Chính sự cộng hưởng ấy đã góp phần làm nên chiều sâu của kho tri thức mà người học đang
            tiếp cận hôm nay.
          </p>
        </div>
      </Reveal>
    </section>
  );
}

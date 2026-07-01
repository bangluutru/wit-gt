// ============================================================
// WiT Platform - Interactive "Cấu trúc con người" diagram
// ============================================================
// Tâm – Tánh – Tình – Thân layers; click a ring to inspect, switch
// "lăng kính" (Dân gian / Khoa học / Nhà Phật), or soi "Nội tâm".
// Ported from the Claude Design lesson framework.

import { useState } from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import type { Language } from '../../lib/types';

type LayerKey = 'tam' | 'tanh' | 'tinh' | 'than';
type Lens = 'dan' | 'khoa' | 'phat';

interface LayerInfo {
  title: string; dan: string; khoa: string; phat: string; ring: string; desc: string; color: string;
}

const LAYERS_VI: Record<LayerKey, LayerInfo> = {
  tam: { title: 'Tâm', dan: 'Tâm', khoa: 'Sự chân thật', phat: 'Phật tánh / Chân tâm', ring: 'Điện từ Quang (cân bằng) — không đổi qua không gian, thời gian.', desc: 'Lớp trong cùng: chữ Ý, bao quanh là Nghe – Thấy – Nói – Biết. Chính là Sự chân thật.', color: '#C62128' },
  tanh: { title: 'Tánh', dan: 'Tánh', khoa: 'Tính cách', phat: '16 Tánh người', ring: 'Điện từ Âm Dương — khiến tánh người luôn dao động.', desc: '16 tánh: Thọ, Tưởng, Hành, Thức, Tài, Sắc, Danh, Thực, Thùy, Tham, Sân, Si, Mạn, Nghi, Ác, Kiến.', color: '#B88934' },
  tinh: { title: 'Tình', dan: 'Tình', khoa: 'Cảm xúc', phat: 'Bong bóng ảo giác', ring: 'Bao bọc bởi điện từ, cảm xúc luôn sinh diệt.', desc: '84.000 bong bóng ảo giác — Khoa học đo được khoảng 34.000 loại cảm xúc.', color: '#CB7A4E' },
  than: { title: 'Thân', dan: 'Thân', khoa: 'Cơ thể người', phat: 'Thân tứ đại', ring: 'Điện từ Âm Dương bảo vệ toàn bộ cơ thể.', desc: 'Thân tứ đại: Đất (dinh dưỡng), Nước, Khí (hơi thở), Lửa (hơi ấm).', color: '#8B8176' },
};

// English labels/copy kept consistent with the terminology already used in the
// translated lesson Markdown (Mind/Nature/Emotion/Body, folk/science/Buddhism lenses,
// "16 human natures", "84,000 bubbles of illusion", "Four-Element Body").
const LAYERS_EN: Record<LayerKey, LayerInfo> = {
  tam: { title: 'Mind', dan: 'Mind', khoa: 'Truth', phat: 'Buddha Nature / True Mind', ring: 'Balanced Radiant Electromagnetism — unchanged across space and time.', desc: 'Innermost layer: Intention, surrounded by Hear – See – Speak – Know. This is Truth itself.', color: '#C62128' },
  tanh: { title: 'Nature', dan: 'Nature', khoa: 'Personality', phat: '16 Human Natures', ring: 'Yin-Yang Electromagnetism — keeps human nature constantly fluctuating.', desc: '16 natures: Reception, Imagination, Expression, Cognition, Wealth, Form, Fame, Eating, Sleep, Want, Temperament, Ignorance, Pride, Discernment, Ethos, View.', color: '#B88934' },
  tinh: { title: 'Emotion', dan: 'Emotion', khoa: 'Emotions', phat: 'Bubbles of illusion', ring: 'Wrapped in electromagnetism, emotions constantly arise and pass away.', desc: '84,000 bubbles of illusion — science has measured around 34,000 types of emotion.', color: '#CB7A4E' },
  than: { title: 'Body', dan: 'Body', khoa: 'Human body', phat: 'Four-Element Body', ring: 'Yin-Yang electromagnetism protects the entire body.', desc: 'Four-Element Body: Earth (nutrition), Water, Air (breath), Fire (warmth).', color: '#8B8176' },
};

const COPY = {
  vi: {
    kicker: 'Sơ đồ tương tác',
    heading: 'Đồ hình Cấu trúc con người',
    hint: 'Bấm từng lớp để xem chi tiết · đổi lăng kính để gọi tên theo 3 góc nhìn.',
    lens: { dan: 'Dân gian', khoa: 'Khoa học', phat: 'Nhà Phật' },
    axisLabel: 'Ý · Nghe Thấy Nói Biết',
    chooseLayer: 'Chọn một lớp',
    noiTamTitle: 'Nội tâm = Tâm + Tánh + Tình',
    noiTamDesc: 'Buông lớp Thân tứ đại ra, phần còn lại — Tâm, Tánh, Tình — chính là Nội tâm.',
    defaultDesc: 'Bấm một vòng trong đồ hình để xem tên gọi theo 3 góc nhìn.',
    ringLabel: 'Vỏ điện từ:',
    noiTamOn: '◐ Đang soi: Nội tâm (Tâm · Tánh · Tình)',
    noiTamOff: '◐ Soi "Nội tâm" gồm những lớp nào?',
    tinhAsPhat: 'Bong bóng ảo giác',
  },
  en: {
    kicker: 'Interactive Diagram',
    heading: 'Human Structure Diagram',
    hint: 'Tap each layer for details · switch lenses to see the 3 naming perspectives.',
    lens: { dan: 'Folk', khoa: 'Science', phat: 'Buddhism' },
    axisLabel: 'Intention · Hear See Speak Know',
    chooseLayer: 'Select a layer',
    noiTamTitle: 'Inner Being = Mind + Nature + Emotion',
    noiTamDesc: 'Set aside the Four-Element Body — what remains (Mind, Nature, Emotion) is the Inner Being.',
    defaultDesc: 'Tap a ring in the diagram to see its name from the 3 perspectives.',
    ringLabel: 'Electromagnetic shell:',
    noiTamOn: '◐ Viewing: Inner Being (Mind · Nature · Emotion)',
    noiTamOff: '◐ Which layers make up the "Inner Being"?',
    tinhAsPhat: 'Bubbles of illusion',
  },
};

const BASE_FILL: Record<LayerKey, string> = { tam: '#F4E3C4', tanh: '#F8EAE0', tinh: '#FBF1E7', than: '#F1ECE2' };
const DARK_FILL: Record<LayerKey, string> = { tam: '#4a3a22', tanh: '#3f2a26', tinh: '#3a2e26', than: '#2e2a26' };

export function StructureDiagram({ lang = 'vi' }: { lang?: Language }) {
  const { theme } = useSettings();
  const dark = theme === 'dark';
  const [lens, setLens] = useState<Lens>('dan');
  const [layer, setLayer] = useState<LayerKey | null>(null);
  const [noiTam, setNoiTam] = useState(false);

  const isVi = lang === 'vi';
  const LAYERS = isVi ? LAYERS_VI : LAYERS_EN;
  const t = isVi ? COPY.vi : COPY.en;

  const fill = (k: LayerKey): string => {
    const active = layer === k || (noiTam && k !== 'than');
    const noiDim = noiTam && k === 'than';
    let f = (dark ? DARK_FILL : BASE_FILL)[k];
    if (active) f = LAYERS[k].color;
    if (noiDim) f = dark ? '#262320' : '#EDE8DF';
    return f;
  };
  const stroke = (k: LayerKey): string => {
    const active = layer === k || (noiTam && k !== 'than');
    return active ? LAYERS[k].color : 'var(--color-wit-line)';
  };
  const name = (k: LayerKey): string => (k === 'tinh' && lens === 'phat' ? t.tinhAsPhat : LAYERS[k][lens]);

  const L = layer ? LAYERS[layer] : null;
  const lensBtn = (w: Lens, label: string) => (
    <button
      type="button"
      onClick={() => setLens(w)}
      className={`flex-1 py-2 px-1.5 rounded-button border text-[12.5px] font-semibold transition-colors cursor-pointer ${
        lens === w ? 'bg-wit-red border-wit-red text-white' : 'bg-wit-surface border-wit-line text-wit-text-secondary hover:bg-wit-surface-2'
      }`}
    >
      {label}
    </button>
  );

  const layerCircle = (k: LayerKey, r: number) => (
    <circle
      cx="200" cy="200" r={r}
      fill={fill(k)} stroke={stroke(k)} strokeWidth="1.5"
      onClick={() => { setLayer(k); setNoiTam(false); }}
      style={{ cursor: 'pointer', transition: 'fill .25s, stroke .25s' }}
    />
  );

  return (
    <div>
      <div className="flex items-center gap-2.5 mb-1">
        <span className="text-[10.5px] font-bold uppercase tracking-[1.4px] text-wit-red">{t.kicker}</span>
        <span className="h-px flex-1 bg-wit-line" />
      </div>
      <h3 className="font-serif font-semibold text-xl text-wit-text mt-0.5 mb-0.5">{t.heading}</h3>
      <p className="text-[13px] text-wit-text-tertiary mb-3.5">{t.hint}</p>

      <div className="grid gap-5 items-center md:grid-cols-2">
        <div className="relative w-full max-w-[400px] mx-auto">
          <svg viewBox="0 0 400 400" className="w-full h-auto block overflow-visible">
            <circle cx="200" cy="200" r="192" fill="none" stroke={dark ? '#5a544a' : '#C9BCA6'} strokeWidth="2" strokeDasharray="2 6" />
            {layerCircle('than', 184)}
            {layerCircle('tinh', 142)}
            {layerCircle('tanh', 96)}
            <circle cx="200" cy="200" r="50" fill="none" stroke="var(--color-wit-gold)" strokeWidth="2.5" style={{ animation: layer === 'tam' || noiTam ? 'hp-ring 1.6s ease-in-out infinite' : undefined }} />
            {layerCircle('tam', 46)}
            <text x="200" y="33" textAnchor="middle" style={{ font: "700 13px 'Be Vietnam Pro'", fill: 'var(--color-wit-text-secondary)', pointerEvents: 'none' }}>{name('than')}</text>
            <text x="200" y="86" textAnchor="middle" style={{ font: "700 13px 'Be Vietnam Pro'", fill: 'var(--color-wit-text-secondary)', pointerEvents: 'none' }}>{name('tinh')}</text>
            <text x="200" y="128" textAnchor="middle" style={{ font: "700 13px 'Be Vietnam Pro'", fill: 'var(--color-wit-text-secondary)', pointerEvents: 'none' }}>{name('tanh')}</text>
            <text x="200" y="196" textAnchor="middle" style={{ font: "700 13.5px 'Be Vietnam Pro'", fill: 'var(--color-wit-red)', pointerEvents: 'none' }}>{name('tam')}</text>
            <text x="200" y="213" textAnchor="middle" style={{ font: "500 9.5px 'Be Vietnam Pro'", fill: 'var(--color-wit-text-tertiary)', pointerEvents: 'none' }}>{t.axisLabel}</text>
          </svg>
        </div>

        <div className="min-w-0">
          <div className="flex gap-1.5 mb-3.5">
            {lensBtn('dan', t.lens.dan)}
            {lensBtn('khoa', t.lens.khoa)}
            {lensBtn('phat', t.lens.phat)}
          </div>
          <div className="border border-wit-line rounded-card bg-wit-surface p-[17px] min-h-[172px]">
            <div className="flex items-center gap-2.5 mb-2.5">
              <span className="w-3.5 h-3.5 rounded shrink-0" style={{ background: L ? L.color : 'var(--color-wit-gold)' }} />
              <span className="font-serif font-semibold text-lg text-wit-text">
                {L ? L.title : noiTam ? t.noiTamTitle : t.chooseLayer}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {(['dan', 'khoa', 'phat'] as Lens[]).map((k) => (
                <span key={k} className="text-[11.5px] px-2.5 py-1 rounded-full bg-wit-surface-2 text-wit-text-secondary">
                  {t.lens[k]} · {L ? L[k] : '—'}
                </span>
              ))}
            </div>
            <p className="text-[13.5px] leading-[1.6] text-wit-text-secondary mb-2.5">
              {L ? L.desc : noiTam ? t.noiTamDesc : t.defaultDesc}
            </p>
            <div className="text-xs text-wit-text-tertiary">
              <b className="text-wit-gold">{t.ringLabel}</b> {L ? L.ring : '—'}
            </div>
          </div>
          <button
            type="button"
            onClick={() => { setNoiTam((v) => !v); setLayer(null); }}
            className={`w-full mt-2.5 py-2.5 rounded-button border text-[13.5px] font-semibold transition-colors cursor-pointer ${
              noiTam ? 'bg-wit-red border-wit-red text-white' : 'bg-wit-surface border-wit-line text-wit-text-secondary hover:bg-wit-surface-2'
            }`}
          >
            {noiTam ? t.noiTamOn : t.noiTamOff}
          </button>
        </div>
      </div>
    </div>
  );
}

import { useRef, useCallback } from 'react';
import { Share2 } from 'lucide-react';
import { toPng } from 'html-to-image';
import type { Language } from '../../lib/types';

interface Props {
  quoteText: string;
  quoteIndex: number;
  lang: Language;
}

export function ShareButton({ quoteText, quoteIndex, lang }: Props) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const L = (vi: string, en: string, jp: string) =>
    lang === 'en' ? en : lang === 'jp' ? jp : vi;

  const handleShare = useCallback(async () => {
    if (!canvasRef.current) return;

    try {
      const dataUrl = await toPng(canvasRef.current, {
        quality: 0.95,
        pixelRatio: 2,
        cacheBust: true,
      });

      // Download the image
      const link = document.createElement('a');
      link.download = `wit365-${String(quoteIndex).padStart(3, '0')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to generate share image:', err);
    }
  }, [quoteIndex]);

  return (
    <>
      <button
        type="button"
        onClick={handleShare}
        className="flex items-center justify-center w-[38px] h-[38px] rounded-button text-wit-text-tertiary hover:text-wit-text hover:bg-wit-surface-2 transition-all duration-200 cursor-pointer"
        title={L('Chia sẻ', 'Share', 'シェア')}
      >
        <Share2 className="h-[18px] w-[18px]" />
      </button>

      {/* Hidden canvas for image generation */}
      <div className="fixed -left-[9999px] -top-[9999px]" aria-hidden>
        <div
          ref={canvasRef}
          style={{
            width: 800,
            height: 800,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 80,
            background: 'linear-gradient(145deg, #FBF7F0 0%, #F5EEE3 50%, #F0E8DA 100%)',
            fontFamily: "'Noto Serif', Georgia, serif",
            position: 'relative',
          }}
        >
          {/* Subtle top accent line */}
          <div
            style={{
              position: 'absolute',
              top: 40,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 60,
              height: 3,
              background: 'linear-gradient(90deg, #C62128, #B88934)',
              borderRadius: 2,
            }}
          />

          {/* Quote number */}
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 3,
              color: '#B88934',
              textTransform: 'uppercase',
              marginBottom: 24,
              fontFamily: "'Be Vietnam Pro', system-ui, sans-serif",
            }}
          >
            {String(quoteIndex).padStart(3, '0')} / 365
          </div>

          {/* Quote text */}
          <div
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: '#2B2622',
              textAlign: 'center',
              lineHeight: 1.5,
              maxWidth: 600,
            }}
          >
            "{quoteText}"
          </div>

          {/* Footer */}
          <div
            style={{
              position: 'absolute',
              bottom: 40,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: '#C62128',
                letterSpacing: 2,
                fontFamily: "'Be Vietnam Pro', system-ui, sans-serif",
              }}
            >
              WiT365
            </div>
            <div
              style={{
                fontSize: 11,
                color: '#9B9189',
                fontFamily: "'Be Vietnam Pro', system-ui, sans-serif",
              }}
            >
              Mỗi ngày một hạt giống nhận thức
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

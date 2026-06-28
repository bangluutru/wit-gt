import { Sprout } from 'lucide-react';
import type { Language } from '../../lib/types';

interface Props {
  lang: Language;
  onRandom: () => void;
}

export function RandomQuoteButton({ lang, onRandom }: Props) {
  const L = (vi: string, en: string, jp: string) =>
    lang === 'en' ? en : lang === 'jp' ? jp : vi;

  return (
    <button
      type="button"
      onClick={onRandom}
      className="inline-flex items-center gap-2.5 px-6 py-3 rounded-button bg-wit-red text-white font-semibold text-sm hover:bg-wit-red-hover shadow-card hover:shadow-card-hover transition-all duration-200 cursor-pointer active:scale-[0.97]"
    >
      <Sprout className="h-4.5 w-4.5" />
      {L('Gieo một hạt giống khác', 'Plant another seed', '別の種を蒔く')}
    </button>
  );
}

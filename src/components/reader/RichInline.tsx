// Renders a block's text: **bold** / *italic* + dictionary term highlighting.
import { Fragment, type ReactNode } from 'react';
import type { DictionaryTerm, Language } from '../../lib/types';
import { highlightText, type MatchableTerm } from './TermHighlighter';

interface Props {
  text: string;
  matchable: MatchableTerm[];
  lang: Language;
  onTermClick: (t: DictionaryTerm, r: DOMRect) => void;
  onTermHover?: (t: DictionaryTerm, r: DOMRect) => void;
  onTermLeave?: () => void;
}

const EMPH = /\*\*([^*]+)\*\*|\*([^*\n]+)\*/g;

export function RichInline({ text, matchable, lang, onTermClick, onTermHover, onTermLeave }: Props): ReactNode {
  const s = (text || '').replace(/\s+,/g, ',').replace(/\s+\./g, '.').trim();
  const hl = (seg: string) => highlightText(seg, matchable, lang, onTermClick, onTermHover, onTermLeave);

  const out: ReactNode[] = [];
  let key = 0;
  let last = 0;
  let m: RegExpExecArray | null;
  EMPH.lastIndex = 0;
  while ((m = EMPH.exec(s))) {
    if (m.index > last) out.push(<Fragment key={key++}>{hl(s.slice(last, m.index))}</Fragment>);
    if (m[1] != null) {
      out.push(
        <strong key={key++} className="font-bold text-wit-text">
          {hl(m[1])}
        </strong>
      );
    } else {
      out.push(<em key={key++}>{hl(m[2])}</em>);
    }
    last = EMPH.lastIndex;
  }
  if (last < s.length) out.push(<Fragment key={key++}>{hl(s.slice(last))}</Fragment>);

  return <>{out}</>;
}

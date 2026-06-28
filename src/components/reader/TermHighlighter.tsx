import { useCallback, type ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { DictionaryTerm, Language } from '../../lib/types';

interface TermHighlighterProps {
  content: string;
  terms: DictionaryTerm[];
  language: Language;
  onTermClick: (term: DictionaryTerm, rect: DOMRect) => void;
}

interface MatchableTerm {
  lower: string;
  term: DictionaryTerm;
}

/** Get the term string for a given language */
function getTermText(term: DictionaryTerm, lang: Language): string {
  if (lang === 'vi') return term.viTerm;
  if (lang === 'en') return term.enTerm;
  return term.jpTerm;
}

/**
 * Build matchable terms, longest first so multi-word terms win over their
 * sub-words. Terms shorter than 2 chars are skipped. Matching is
 * case-insensitive but diacritic-SENSITIVE: in Vietnamese, accents are
 * meaningful (e.g. "Nhân"/cause ≠ "Nhận"/perceive), so we must not fold them.
 */
function getMatchableTerms(terms: DictionaryTerm[], lang: Language): MatchableTerm[] {
  return terms
    .map((t) => ({ lower: getTermText(t, lang).toLowerCase(), term: t }))
    .filter((m) => m.lower.trim().length >= 2)
    .sort((a, b) => b.lower.length - a.lower.length);
}

const WORD_CHAR = /[a-z0-9]/i;

/**
 * Highlight the first occurrence of each term in a text string. Matching is
 * case-insensitive (lowercasing is 1:1 in length for these scripts, so indices
 * map directly to the original text); English terms require word boundaries so
 * we don't highlight a term inside a longer word. Returns string / ReactNode
 * segments.
 */
function highlightText(
  text: string,
  matchableTerms: MatchableTerm[],
  language: Language,
  onTermClick: (term: DictionaryTerm, rect: DOMRect) => void
): (string | ReactNode)[] {
  if (!text || matchableTerms.length === 0) return [text];

  const lowerText = text.toLowerCase();
  const used = new Array(text.length).fill(false);
  const ranges: { start: number; end: number; term: DictionaryTerm }[] = [];

  for (const { lower: needle, term } of matchableTerms) {
    let from = 0;
    while (from <= lowerText.length - needle.length) {
      const idx = lowerText.indexOf(needle, from);
      if (idx === -1) break;
      const end = idx + needle.length;

      // English: require non-word chars on both sides (word boundary).
      let boundaryOk = true;
      if (language === 'en') {
        const before = idx > 0 ? lowerText[idx - 1] : ' ';
        const after = end < lowerText.length ? lowerText[end] : ' ';
        if (WORD_CHAR.test(before) || WORD_CHAR.test(after)) boundaryOk = false;
      }

      // Skip if it overlaps an already-claimed (longer) term.
      let overlap = false;
      for (let k = idx; k < end; k++) {
        if (used[k]) { overlap = true; break; }
      }

      if (boundaryOk && !overlap) {
        for (let k = idx; k < end; k++) used[k] = true;
        ranges.push({ start: idx, end, term });
        break; // only the first occurrence per term
      }
      from = idx + 1;
    }
  }

  if (ranges.length === 0) return [text];

  ranges.sort((a, b) => a.start - b.start);

  const out: (string | ReactNode)[] = [];
  let cursor = 0;
  for (const r of ranges) {
    if (r.start < cursor) continue; // safety against overlaps
    if (r.start > cursor) out.push(text.slice(cursor, r.start));
    out.push(
      <span
        key={`term-${r.term.id}-${r.start}`}
        className="term-highlight"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const rect = (e.target as HTMLElement).getBoundingClientRect();
          onTermClick(r.term, rect);
        }}
      >
        {text.slice(r.start, r.end)}
      </span>
    );
    cursor = r.end;
  }
  if (cursor < text.length) out.push(text.slice(cursor));

  return out;
}

export function TermHighlighter({
  content,
  terms,
  language,
  onTermClick,
}: TermHighlighterProps) {
  const matchableTerms = getMatchableTerms(terms, language);

  /**
   * Process children of a markdown block element (p, li) to highlight terms.
   * Handles both string children and nested React element children.
   */
  const processChildren = useCallback(
    (children: ReactNode): ReactNode => {
      if (!children) return children;

      if (typeof children === 'string') {
        const segments = highlightText(children, matchableTerms, language, onTermClick);
        return segments.length === 1 && typeof segments[0] === 'string'
          ? segments[0]
          : segments;
      }

      if (Array.isArray(children)) {
        return children.map((child, i) => {
          if (typeof child === 'string') {
            const segments = highlightText(child, matchableTerms, language, onTermClick);
            return segments.length === 1 && typeof segments[0] === 'string' ? (
              segments[0]
            ) : (
              <span key={`seg-${i}`}>{segments}</span>
            );
          }
          return child;
        });
      }

      // Non-string, non-array child — return as-is
      return children;
    },
    [matchableTerms, language, onTermClick]
  );

  return (
    <div className="lesson-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children, ...props }) => (
            <p {...props}>{processChildren(children)}</p>
          ),
          li: ({ children, ...props }) => (
            <li {...props}>{processChildren(children)}</li>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

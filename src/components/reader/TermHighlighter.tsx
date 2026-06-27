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

/** Get the term string for a given language */
function getTermText(term: DictionaryTerm, lang: Language): string {
  if (lang === 'vi') return term.viTerm;
  if (lang === 'en') return term.enTerm;
  return term.jpTerm;
}

/** Build a list of terms sorted by length (longest first) for matching priority */
function getMatchableTerms(
  terms: DictionaryTerm[],
  lang: Language
): { text: string; term: DictionaryTerm }[] {
  return terms
    .map((t) => ({ text: getTermText(t, lang), term: t }))
    .filter((m) => m.text && m.text.length > 0)
    .sort((a, b) => b.text.length - a.text.length);
}

/**
 * Process a text string to highlight the first occurrence of each term.
 * Returns an array of string and ReactNode segments.
 */
function highlightText(
  text: string,
  matchableTerms: { text: string; term: DictionaryTerm }[],
  onTermClick: (term: DictionaryTerm, rect: DOMRect) => void
): (string | ReactNode)[] {
  if (!text || matchableTerms.length === 0) return [text];

  // Track which terms have already been highlighted in this segment
  const highlightedTermIds = new Set<string>();
  let result: (string | ReactNode)[] = [text];

  for (const { text: termText, term } of matchableTerms) {
    if (highlightedTermIds.has(term.id)) continue;

    const newResult: (string | ReactNode)[] = [];
    let found = false;

    for (const segment of result) {
      if (typeof segment !== 'string' || found) {
        newResult.push(segment);
        continue;
      }

      const lowerSegment = segment.toLowerCase();
      const lowerTerm = termText.toLowerCase();
      const index = lowerSegment.indexOf(lowerTerm);

      if (index === -1) {
        newResult.push(segment);
        continue;
      }

      // Found first occurrence — highlight it
      found = true;
      highlightedTermIds.add(term.id);

      const before = segment.slice(0, index);
      const match = segment.slice(index, index + termText.length);
      const after = segment.slice(index + termText.length);

      if (before) newResult.push(before);

      newResult.push(
        <span
          key={`term-${term.id}-${index}`}
          className="term-highlight"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const rect = (e.target as HTMLElement).getBoundingClientRect();
            onTermClick(term, rect);
          }}
        >
          {match}
        </span>
      );

      if (after) newResult.push(after);
    }

    result = newResult;
  }

  return result;
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
        const segments = highlightText(children, matchableTerms, onTermClick);
        return segments.length === 1 && typeof segments[0] === 'string'
          ? segments[0]
          : segments;
      }

      if (Array.isArray(children)) {
        return children.map((child, i) => {
          if (typeof child === 'string') {
            const segments = highlightText(child, matchableTerms, onTermClick);
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
    [matchableTerms, onTermClick]
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

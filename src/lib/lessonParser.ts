// ============================================================
// WiT Platform - Lesson Markdown → structured sections parser
// ============================================================
// Ports the Claude Design "Giáo trình Nội tâm" framework: a lesson's
// Markdown is split into "PHẦN N" sections, each classified by type and
// parsed into rich blocks (heading / list / callout / quote / paragraph);
// quiz sections ("...TRẮC NGHIỆM...") become interactive questions.

export type SectionType =
  | 'info' | 'deep' | 'reflect' | 'essay' | 'quiz' | 'writing' | 'cta' | 'share' | 'other';

export type BlockKind = 'h' | 'li' | 'callout' | 'quote' | 'p';

export interface Block {
  kind: BlockKind;
  text: string;
}

export interface QuizQuestion {
  prompt: string;
  opts: string[];
  correct: number; // index into opts, or -1
  explanation: string;
}

export interface ParsedSection {
  num: string;
  rawLabel: string;
  type: SectionType;
  blocks: Block[];
  quiz: QuizQuestion[];
}

export interface ParsedLesson {
  chuyenDe: string | null;
  sections: ParsedSection[];
}

/** Section-type icons (mirrors the design). */
export const SECTION_ICON: Record<SectionType, string> = {
  info: '◎', deep: '☰', reflect: '❀', essay: '✎', quiz: '✓',
  writing: '✑', cta: '➜', share: '♡', other: '•',
};

/** Classify a section by its heading keywords. */
export function classify(label: string): SectionType {
  const t = (label || '').toUpperCase();
  if (/NGHIỆM|TRẮC NGHI|QUIZ|MULTIPLE.CHOICE/.test(t)) return 'quiz';
  if (/TỰ LUẬN|WEEKLY|THẢO LUẬN|DISCUSSION/.test(t)) return 'essay';
  if (/VIẾT LUẬN|WRITING/.test(t)) return 'writing';
  if (/KÊU GỌI|CALL TO ACTION/.test(t)) return 'cta';
  if (/CHIA SẺ/.test(t)) return 'share';
  if (/BÀI HỌC|TÂM ĐẮC|NGỘ RA|IMPRESSION|REALI[SZ]ATION|TAKEAWAY|REFLECTION/.test(t)) return 'reflect';
  if (/CHI TIẾT|CHUYÊN SÂU|CORE CONTENT|DETAILED CONTENT/.test(t)) return 'deep';
  if (/THÔNG TIN CHUNG|MỤC TIÊU|GENERAL INFORMATION/.test(t)) return 'info';
  return 'other';
}

const SECTION_RE = /^\s*(?:#{1,6}\s*)?(?:\*\*)?\s*(?:PHẦN|PART)\s+(\d+|[IVX]+)\s*[:.\-]\s*(.*?)(?:\*\*)?\s*$/i;

/** Split a lesson's markdown into the "CHUYÊN ĐỀ" subtitle + PHẦN sections. */
export function parseLesson(md: string): ParsedLesson {
  const lines = (md || '').split(/\r?\n/);

  let chuyenDe: string | null = null;
  for (const l of lines) {
    const m = l.match(/(?:CHUYÊN ĐỀ|TOPIC)\s*:\s*(.+)/i);
    if (m) {
      chuyenDe = m[1].replace(/[*#]/g, '').trim();
      break;
    }
  }

  const secs: { num: string; rawLabel: string; lines: string[] }[] = [];
  let cur: { num: string; rawLabel: string; lines: string[] } | null = null;
  for (const raw of lines) {
    const m = raw.match(SECTION_RE);
    if (m) {
      cur = { num: m[1], rawLabel: m[2].replace(/[*]/g, '').trim(), lines: [] };
      secs.push(cur);
      continue;
    }
    if (cur) cur.lines.push(raw);
  }

  return {
    chuyenDe,
    sections: secs.map((s) => {
      const type = classify(s.rawLabel);
      return {
        num: s.num,
        rawLabel: s.rawLabel,
        type,
        blocks: type === 'quiz' ? [] : parseBlocks(s.lines),
        quiz: type === 'quiz' ? parseQuiz(s.lines) : [],
      };
    }),
  };
}

/** Parse a section's lines into styled blocks. */
export function parseBlocks(lines: string[]): Block[] {
  const blocks: Block[] = [];
  for (const raw of lines) {
    const line = (raw || '').trim();
    if (!line) continue;
    if (/^---+$/.test(line)) continue; // horizontal rules

    let kind: BlockKind = 'p';
    let text = line;

    if (/^#{2,6}\s+/.test(line)) {
      kind = 'h';
      text = line.replace(/^#{2,6}\s+/, '').replace(/[*]/g, '');
    } else if (/^\*\*[^*][\s\S]*\*\*$/.test(line) && line.length < 130) {
      kind = 'h';
      text = line.replace(/^\*\*|\*\*$/g, '');
    } else if (/^[A-DĐ]\.\s+/.test(line) && line.length < 140 && !/[.?!]$/.test(line)) {
      kind = 'h';
    } else if (/^\d+(?:\.\d+)+\.?\s+/.test(line) && line.length < 130) {
      kind = 'h';
    } else if (/^\d+\.\s+/.test(line)) {
      const rest = line.replace(/^\d+\.\s+/, '');
      if (rest.length < 90 && rest === rest.toUpperCase()) kind = 'h';
    }

    if (kind === 'p') {
      if (/^[-•]\s+/.test(line)) {
        kind = 'li';
        text = line.replace(/^[-•]\s+/, '');
      } else if (/^👉/.test(line) || /^\(?Lưu ý\s*[:)]/i.test(line) || /^Xác lập nhận thức/i.test(line)) {
        kind = 'callout';
        text = line.replace(/^👉\s*/, '').replace(/^>\s*/, '');
      } else {
        const t2 = text.replace(/^\*+|\*+$/g, '').trim();
        if (/^["“]/.test(t2) && t2.length < 260) {
          kind = 'quote';
          text = t2.replace(/^["“]|["”]$/g, '');
        } else if (/^>\s+/.test(line)) {
          // Markdown blockquote → callout
          kind = 'callout';
          text = line.replace(/^>\s+/, '');
        }
      }
    }

    blocks.push({ kind, text });
  }
  return blocks;
}

/** Parse one question's raw body (prompt + options + answer/explanation) into a QuizQuestion. */
function parseOneQuestion(body: string): QuizQuestion {
  // Answer + trailing explanation in any form: "— text", "(Explanation: text)", "Giải thích: text".
  let answer: string | null = null;
  let explanation = '';
  const ma = body.match(/(?:Đáp án(?:\s+đúng)?|Correct Answer)\s*:?\s*([ABCD])\b\.?\s*([\s\S]*)$/i);
  if (ma) {
    answer = ma[1].toUpperCase();
    const ex = (ma[2] || '').trim()
      .replace(/^[—–\-:]\s*/, '')
      .replace(/^\(/, '').replace(/\)\.?\s*$/, '')
      .replace(/^(?:Explanation|Giải thích)\s*:?\s*/i, '');
    if (ex) explanation = ex.trim().replace(/\s+/g, ' ');
    body = body.slice(0, ma.index);
  }

  // Split prompt from options at the first " A. ".
  const fi = body.search(/(^|\s)[ABCD]\.\s/);
  let prompt = body;
  let optText = '';
  if (fi >= 0) {
    prompt = body.slice(0, fi);
    optText = body.slice(fi);
  }

  const opts: string[] = [];
  const optRe = /([ABCD])\.\s+([\s\S]*?)(?=\s+[ABCD]\.\s+|$)/g;
  let m: RegExpExecArray | null;
  while ((m = optRe.exec(optText))) opts.push(m[2].trim().replace(/\s+/g, ' '));

  return {
    prompt: prompt.trim().replace(/\s+/g, ' '),
    opts,
    correct: answer ? ['A', 'B', 'C', 'D'].indexOf(answer) : -1,
    explanation,
  };
}

/** Parse a quiz section into questions. Handles the real lesson format:
 *  **Câu N:** prompt / - A. opt … / > Đáp án đúng: **X** — explanation
 *  (and the English equivalent: **Question N:** / - A. opt … / > Correct Answer: **X** (Explanation: …))
 *  Falls back to a label-less format used by a handful of lessons: a bolded/bulleted
 *  question ending in the options on the same line, with no "Câu N:"/"Question N:" prefix,
 *  followed by a plain "Đáp án: X." (no "đúng") line. */
export function parseQuiz(lines: string[]): QuizQuestion[] {
  // Strip emphasis, list bullets and blockquote markers per line first.
  const cleanedLines = lines.map((l) => l.replace(/\*\*/g, '').replace(/\*/g, '').replace(/^\s*[-•>]\s+/, '').trimEnd());
  const cleaned = cleanedLines.join('\n');

  const parts = cleaned.split(/(?=(?:Câu|Question)\s*\d+\s*[:.])/i);
  const qs: QuizQuestion[] = [];

  for (const p of parts) {
    const mp = p.match(/^(?:Câu|Question)\s*\d+\s*[:.]\s*([\s\S]*)$/i);
    if (!mp) continue;
    qs.push(parseOneQuestion(mp[1]));
  }
  if (qs.length > 0) return qs;

  // Fallback: no "Câu N:"/"Question N:" labels — detect question-start lines by the
  // presence of at least two inline "X. " option markers on the same line.
  const rawLines = cleanedLines.map((l) => l.trim()).filter(Boolean);
  const isQuestionLine = (l: string) => /[ABCD]\.\s+\S.*[ABCD]\.\s+\S/.test(l);
  let i = 0;
  while (i < rawLines.length) {
    if (!isQuestionLine(rawLines[i])) { i++; continue; }
    let body = rawLines[i];
    let j = i + 1;
    while (j < rawLines.length && !isQuestionLine(rawLines[j])) { body += '\n' + rawLines[j]; j++; }
    const q = parseOneQuestion(body);
    if (q.opts.length >= 2) qs.push(q);
    i = j;
  }
  return qs;
}

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
  if (/NGHIỆM|TRẮC NGHI|QUIZ/.test(t)) return 'quiz';
  if (/TỰ LUẬN|WEEKLY|THẢO LUẬN/.test(t)) return 'essay';
  if (/VIẾT LUẬN|WRITING/.test(t)) return 'writing';
  if (/KÊU GỌI|CALL TO ACTION/.test(t)) return 'cta';
  if (/CHIA SẺ/.test(t)) return 'share';
  if (/BÀI HỌC|TÂM ĐẮC|NGỘ RA/.test(t)) return 'reflect';
  if (/CHI TIẾT|CHUYÊN SÂU|CORE CONTENT/.test(t)) return 'deep';
  if (/THÔNG TIN CHUNG|MỤC TIÊU/.test(t)) return 'info';
  return 'other';
}

const SECTION_RE = /^\s*(?:#{1,6}\s*)?(?:\*\*)?\s*PHẦN\s+(\d+|[IVX]+)\s*[:.\-]\s*(.*?)(?:\*\*)?\s*$/i;

/** Split a lesson's markdown into the "CHUYÊN ĐỀ" subtitle + PHẦN sections. */
export function parseLesson(md: string): ParsedLesson {
  const lines = (md || '').split(/\r?\n/);

  let chuyenDe: string | null = null;
  for (const l of lines) {
    const m = l.match(/CHUYÊN ĐỀ\s*:\s*(.+)/i);
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

/** Parse a quiz section into questions. Handles the real lesson format:
 *  **Câu N:** prompt / - A. opt … / > Đáp án đúng: **X** — explanation */
export function parseQuiz(lines: string[]): QuizQuestion[] {
  // Strip emphasis, list bullets and blockquote markers per line first.
  const cleaned = lines
    .map((l) => l.replace(/\*\*/g, '').replace(/\*/g, '').replace(/^\s*[-•>]\s+/, '').trimEnd())
    .join('\n');

  const parts = cleaned.split(/(?=Câu\s*\d+\s*:)/);
  const qs: QuizQuestion[] = [];

  for (const p of parts) {
    const mp = p.match(/^Câu\s*\d+\s*:\s*([\s\S]*)$/);
    if (!mp) continue;
    let body = mp[1];

    // Answer + inline explanation: "Đáp án đúng: B — ..." or "... Giải thích: ..."
    let answer: string | null = null;
    let explanation = '';
    const ma = body.match(/Đáp án đúng\s*:?\s*([ABCD])\s*(?:[—–-]\s*([\s\S]*))?/i);
    if (ma) {
      answer = ma[1].toUpperCase();
      if (ma[2]) explanation = ma[2].trim().replace(/\s+/g, ' ');
      body = body.slice(0, ma.index);
    }
    const mg = body.match(/Giải thích\s*:?\s*([\s\S]*)$/i);
    if (mg) {
      if (!explanation) explanation = mg[1].trim().replace(/\s+/g, ' ');
      body = body.slice(0, mg.index);
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

    qs.push({
      prompt: prompt.trim().replace(/\s+/g, ' '),
      opts,
      correct: answer ? ['A', 'B', 'C', 'D'].indexOf(answer) : -1,
      explanation,
    });
  }
  return qs;
}

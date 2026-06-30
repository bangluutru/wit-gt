/**
 * Update lesson translations in Firestore (targeted, non-destructive).
 *
 * Reads the bundled English markdown files and writes ONLY `titleEn` +
 * `contentEn` onto the matching lesson docs (looked up by `lessonNo`).
 * No other fields are touched, so Vietnamese content is never overwritten.
 *
 * To add more lessons later, append to LESSON_UPDATES below.
 *
 * Usage:
 *   gcloud auth application-default login   # once
 *   npm run import:lessons
 */

import { initializeApp, cert, applicationDefault } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config({ path: '.env.local' });

const COLLECTION = 'lessons';
const PROJECT_ID = process.env.VITE_FIREBASE_PROJECT_ID || 'wit-gt';
const CONTENT_DIR = path.resolve('src', 'content');

// ── What to update ───────────────────────────────────────────
// Only the listed language fields are written; everything else is left intact.
const LESSON_UPDATES: Array<{ lessonNo: number; titleEn: string; enFile: string }> = [
  {
    lessonNo: 1,
    titleEn: 'Awareness of Cause and Effect',
    enFile: 'lesson-nhan-thuc-ve-nhan-qua.en.md',
  },
  {
    lessonNo: 2,
    titleEn: 'The Principle of Light in Human Life',
    enFile: 'lesson-nguyen-ly-anh-sang.en.md',
  },
  {
    lessonNo: 3,
    titleEn: 'The Brain Activation Principle',
    enFile: 'lesson-nguyen-ly-kich-hoat-nao.en.md',
  },
  {
    lessonNo: 4,
    titleEn: 'The Principle of Inquiry in Line with Desires',
    enFile: 'lesson-nguyen-ly-nghi-van.en.md',
  },
  {
    lessonNo: 5,
    titleEn: 'The Circle of Knowledge Principle',
    enFile: 'lesson-nguyen-ly-vong-tri-thuc.en.md',
  },
  {
    lessonNo: 6,
    titleEn: 'The Formula for the Root Cause of Life',
    enFile: 'lesson-cong-thuc-coi-nguon.en.md',
  },
  {
    lessonNo: 7,
    titleEn: 'Human Structure - Truth',
    enFile: 'lesson-cau-truc-con-nguoi-chan-that.en.md',
  },
  {
    lessonNo: 8,
    titleEn: 'Human Structure - Drawing and Labelling',
    enFile: 'lesson-cau-truc-con-nguoi-ve-goi-ten.en.md',
  },
  {
    lessonNo: 9,
    titleEn: 'Human Structure - Emptiness of Nature',
    enFile: 'lesson-cau-truc-con-nguoi-tanh-khong.en.md',
  },
  {
    lessonNo: 10,
    titleEn: 'Human Structure - 16 Human Natures',
    enFile: 'lesson-cau-truc-con-nguoi-tanh-nguoi.en.md',
  },
  {
    lessonNo: 11,
    titleEn: 'Human Structure - 3 Blocks of Merit',
    enFile: 'lesson-cau-truc-con-nguoi-3-khoi-duc.en.md',
  },
  {
    lessonNo: 12,
    titleEn: 'Human Structure - Total Karma & Operating Principle of the Subconscious',
    enFile: 'lesson-cau-truc-con-nguoi-tong-nghiep-tiem-thuc.en.md',
  },
  {
    lessonNo: 13,
    titleEn: 'Human Structure - Matter, Space, Time',
    enFile: 'lesson-cau-truc-con-nguoi-vat-chat-kgian-tgian.en.md',
  },
  {
    lessonNo: 14,
    titleEn: 'Human Structure - Operating Principle of the Mind',
    enFile: 'lesson-cau-truc-con-nguoi-tam-thuc.en.md',
  },
  {
    lessonNo: 15,
    titleEn: 'The Reality Triangle',
    enFile: 'lesson-tam-giac-hien-thuc.en.md',
  },
  {
    lessonNo: 16,
    titleEn: 'Wealth of Wisdom',
    enFile: 'lesson-giau-tri-tue.en.md',
  },
  {
    lessonNo: 17,
    titleEn: 'Wealth of Mental State',
    enFile: 'lesson-giau-tam-thai.en.md',
  },
  {
    lessonNo: 18,
    titleEn: 'Wealth of Personality',
    enFile: 'lesson-giau-nhan-cach.en.md',
  },
  {
    lessonNo: 19,
    titleEn: 'Wealth of Qualities',
    enFile: 'lesson-giau-pham-chat.en.md',
  },
  {
    lessonNo: 20,
    titleEn: 'Wealth of Capacity',
    enFile: 'lesson-giau-nang-luc.en.md',
  },
  {
    lessonNo: 21,
    titleEn: 'Wealth of Physical Body',
    enFile: 'lesson-giau-the-chat.en.md',
  },
  {
    lessonNo: 22,
    titleEn: 'Wealth of Material Assets',
    enFile: 'lesson-giau-vat-chat.en.md',
  },
  {
    lessonNo: 23,
    titleEn: '7 Dimensions of Holistic Wealth',
    enFile: 'lesson-7-su-giau-toan-dien.en.md',
  },
  {
    lessonNo: 24,
    titleEn: 'Good Cause in Human Life',
    enFile: 'lesson-nhan-tot-trong-nhan-sinh.en.md',
  },
  {
    lessonNo: 25,
    titleEn: '9 Types of People',
    enFile: 'lesson-9-dang-nguoi.en.md',
  },
  {
    lessonNo: 26,
    titleEn: 'Qualities of a Talent',
    enFile: 'lesson-nhan-thuc-to-chat-nhan-tai.en.md',
  },
  {
    lessonNo: 27,
    titleEn: 'Full Awareness of Human Beings',
    enFile: 'lesson-nhan-thuc-du-day-ve-con-nguoi.en.md',
  },
  {
    lessonNo: 28,
    titleEn: 'Identifying and Upgrading Relationships',
    enFile: 'lesson-nhan-dang-nang-cap-moi-quan-he.en.md',
  },
  {
    lessonNo: 29,
    titleEn: '7 Important Offerings',
    enFile: 'lesson-7-bo-thi-quan-trong.en.md',
  },
  {
    lessonNo: 30,
    titleEn: 'Good Connection in Human Life',
    enFile: 'lesson-duyen-lanh-trong-nhan-sinh.en.md',
  },
  {
    lessonNo: 31,
    titleEn: 'Desirable Outcome in Human Life',
    enFile: 'lesson-qua-nhu-y-trong-nhan-sinh.en.md',
  },
];

// ── Firebase init (ADC, with env service-account fallback) ───
function initFirebase() {
  try {
    if (process.env.FIREBASE_PRIVATE_KEY) {
      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID || PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
      });
    } else {
      initializeApp({ credential: applicationDefault(), projectId: PROJECT_ID });
    }
  } catch (err) {
    console.error('❌ Failed to initialize Firebase:', err);
    process.exit(1);
  }
}

async function main() {
  console.log('🔧 Initializing Firebase Admin...');
  initFirebase();
  const db = getFirestore();

  let updated = 0;
  for (const item of LESSON_UPDATES) {
    const mdPath = path.join(CONTENT_DIR, item.enFile);
    if (!fs.existsSync(mdPath)) {
      console.error(`❌ Missing content file: ${mdPath}`);
      continue;
    }
    const contentEn = fs.readFileSync(mdPath, 'utf8');

    const snap = await db
      .collection(COLLECTION)
      .where('lessonNo', '==', item.lessonNo)
      .get();

    if (snap.empty) {
      console.warn(`⚠️  No lesson found with lessonNo=${item.lessonNo} — skipped.`);
      continue;
    }

    for (const docSnap of snap.docs) {
      await docSnap.ref.update({
        titleEn: item.titleEn,
        contentEn,
        updatedAt: FieldValue.serverTimestamp(),
      });
      console.log(
        `✅ lessonNo=${item.lessonNo} [${docSnap.id}] updated · titleEn="${item.titleEn}" · contentEn=${contentEn.length} chars`,
      );
      updated++;
    }
  }

  console.log(`\n🎉 Done. ${updated} lesson doc(s) updated in "${COLLECTION}".`);
}

main().catch((err) => {
  console.error('❌ Unexpected error:', err);
  process.exit(1);
});

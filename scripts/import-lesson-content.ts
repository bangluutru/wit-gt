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

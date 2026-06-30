/**
 * Seed all lessons and chapters from local src/lib/seedContent.ts into Firestore.
 * This ensures the remote database has the exact same content as local.
 *
 * Usage:
 *   npx tsx scripts/seed-db-from-local.ts
 */

import { initializeApp, cert, applicationDefault } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import * as dotenv from 'dotenv';
import { SEED_CHAPTERS, SEED_LESSONS } from '../src/lib/seedContent';

dotenv.config({ path: '.env.local' });

const PROJECT_ID = process.env.VITE_FIREBASE_PROJECT_ID || 'wit-gt';

function initFirebase() {
  try {
    if (process.env.FIREBASE_PRIVATE_KEY) {
      initializeApp({
        credential: cert({
          projectId: process.env.VITE_FIREBASE_PROJECT_ID || PROJECT_ID,
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

  console.log(`\n⏳ Seeding ${SEED_CHAPTERS.length} chapters to Firestore...`);
  for (const ch of SEED_CHAPTERS) {
    const docRef = db.collection('chapters').doc(ch.id);
    await docRef.set({
      orderIndex: ch.orderIndex,
      titleVi: ch.titleVi,
      titleEn: ch.titleEn,
      titleJp: ch.titleJp,
      descriptionVi: ch.descriptionVi,
      descriptionEn: ch.descriptionEn,
      descriptionJp: ch.descriptionJp,
    }, { merge: true });
    console.log(`✅ Chapter [${ch.id}] "${ch.titleVi}" / "${ch.titleEn}" seeded.`);
  }

  console.log(`\n⏳ Seeding ${SEED_LESSONS.length} lessons to Firestore...`);
  let seeded = 0;
  for (const lesson of SEED_LESSONS) {
    const docRef = db.collection('lessons').doc(lesson.id);
    await docRef.set({
      lessonNo: lesson.lessonNo,
      chapterId: lesson.chapterId,
      titleVi: lesson.titleVi,
      titleEn: lesson.titleEn,
      titleJp: lesson.titleJp,
      summaryVi: lesson.summaryVi,
      summaryEn: lesson.summaryEn,
      summaryJp: lesson.summaryJp,
      contentVi: lesson.contentVi,
      contentEn: lesson.contentEn,
      contentJp: lesson.contentJp,
      status: lesson.status,
      updatedAt: FieldValue.serverTimestamp(),
    }, { merge: true });
    seeded++;
    if (seeded % 10 === 0 || seeded === SEED_LESSONS.length) {
      console.log(`✅ Progress: ${seeded}/${SEED_LESSONS.length} lessons seeded.`);
    }
  }

  console.log('\n🎉 Database seeding completed successfully!');
}

main().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});

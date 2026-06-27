/**
 * Import dictionary data from Excel file into Firestore.
 *
 * Usage:
 *   npm run import:dictionary
 *
 * Auth: Uses Application Default Credentials (ADC) via gcloud.
 *   Ensure you have run: gcloud auth application-default login
 */

import XLSX from 'xlsx';
import { initializeApp, cert, applicationDefault } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: '.env.local' });

// ── Config ───────────────────────────────────────────────────
const EXCEL_PATH = path.resolve(
  process.env.HOME || '~',
  'Downloads',
  'Từ điển KNN Nội tâm.xlsx',
);
const SHEET_NAME = 'dict';
const COLLECTION = 'dictionary';
const BATCH_LIMIT = 400;
const PROJECT_ID = process.env.VITE_FIREBASE_PROJECT_ID || 'wit-gt';

// ── Helpers ──────────────────────────────────────────────────
function normalizeDocId(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
}

function clean(val: unknown): string {
  if (val === null || val === undefined) return '';
  return String(val).trim();
}

// ── Main ─────────────────────────────────────────────────────
async function main() {
  console.log('🔧 Initializing Firebase Admin...');

  // Try ADC first, fallback to env-based service account
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
      initializeApp({
        credential: applicationDefault(),
        projectId: PROJECT_ID,
      });
    }
  } catch (err) {
    console.error('❌ Failed to initialize Firebase:', err);
    process.exit(1);
  }

  const db = getFirestore();

  // ── Read Excel ───────────────────────────────────────────
  console.log(`📖 Reading Excel: ${EXCEL_PATH}`);
  const workbook = XLSX.readFile(EXCEL_PATH);

  if (!workbook.SheetNames.includes(SHEET_NAME)) {
    console.error(`❌ Sheet "${SHEET_NAME}" not found. Available: ${workbook.SheetNames.join(', ')}`);
    process.exit(1);
  }

  const sheet = workbook.Sheets[SHEET_NAME];
  const rows: Record<string, unknown>[] = XLSX.utils.sheet_to_json(sheet, { defval: '' });

  console.log(`📊 Total rows in sheet: ${rows.length}`);

  // ── Filter & map ─────────────────────────────────────────
  const documents: Array<{ id: string; data: Record<string, unknown> }> = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const viTerm = clean(row['TIẾNG VIỆT']);
    const enTerm = clean(row['ENGLISH']);
    const enPos = clean(row['TỪ LOẠI (EN)']);
    const enIpa = clean(row['IPA (OXFORD)']);
    const sourceNo = clean(row['No']);

    // Skip empty rows
    if (!viTerm && !enTerm) continue;

    // Build stable document ID
    const idSource = viTerm && enTerm
      ? `${viTerm}-${enTerm}`
      : `term-${sourceNo || i}`;
    const docId = normalizeDocId(idSource);

    documents.push({
      id: docId,
      data: {
        category: 'Nội tâm',
        viTerm,
        viDef: '',
        viPos: '',
        viIpa: '',
        enTerm,
        enDef: '',
        enPos,
        enIpa,
        jpTerm: '',
        jpDef: '',
        jpPos: '',
        jpKana: '',
        viImg: '',
        enImg: '',
        jpImg: '',
        sourceSheet: SHEET_NAME,
        sourceNo,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      },
    });
  }

  console.log(`✅ Valid documents to import: ${documents.length}`);

  if (documents.length === 0) {
    console.log('⚠️  No documents to import. Exiting.');
    return;
  }

  // ── Batch write ──────────────────────────────────────────
  let batchCount = 0;
  let totalWritten = 0;
  let batch = db.batch();

  for (let i = 0; i < documents.length; i++) {
    const { id, data } = documents[i];
    const ref = db.collection(COLLECTION).doc(id);
    batch.set(ref, data, { merge: true });
    batchCount++;

    if (batchCount >= BATCH_LIMIT || i === documents.length - 1) {
      console.log(`  📤 Writing batch (${totalWritten + 1}–${totalWritten + batchCount})...`);
      await batch.commit();
      totalWritten += batchCount;
      batchCount = 0;
      batch = db.batch();
    }
  }

  console.log(`\n🎉 Import complete! ${totalWritten} documents written to "${COLLECTION}".`);

  // ── Sample preview ───────────────────────────────────────
  console.log('\n📋 Sample documents:');
  for (const doc of documents.slice(0, 3)) {
    const d = doc.data;
    console.log(`  • [${doc.id}] viTerm="${d.viTerm}" enTerm="${d.enTerm}" enPos="${d.enPos}" enIpa="${d.enIpa}"`);
  }
}

main().catch((err) => {
  console.error('❌ Unexpected error:', err);
  process.exit(1);
});

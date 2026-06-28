/**
 * Import WiT365 quotes from Excel file into Firestore.
 *
 * Usage:
 *   npm run import:wit365
 *
 * Auth: Uses Application Default Credentials (ADC) via gcloud.
 *   Ensure you have run: gcloud auth application-default login
 */

import XLSX from 'xlsx';
import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: '.env.local' });

// ── Config ───────────────────────────────────────────────────
const EXCEL_PATH = path.resolve(
  process.env.HOME || '~',
  'Downloads',
  'WiT365.xlsx',
);
const SHEET_NAME = 'WiT365';
const COLLECTION = 'wit365_quotes';
const BATCH_LIMIT = 400;
const PROJECT_ID = process.env.VITE_FIREBASE_PROJECT_ID || 'wit-gt';

// ── Helpers ──────────────────────────────────────────────────
function clean(val: unknown): string {
  if (val === null || val === undefined) return '';
  return String(val).trim();
}

function padIndex(n: number): string {
  return String(n).padStart(3, '0');
}

// ── Main ─────────────────────────────────────────────────────
async function main() {
  console.log('🔧 Initializing Firebase Admin...');

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

  // ── Column mapping ────────────────────────────────────────
  // Excel headers:
  //   STT | WIT 365 - CHỌN CÂU NÓI NÀY | Dịch sát | Dịch thoát
  const COL_INDEX = 'STT';
  const COL_VI = 'WIT 365 - CHỌN CÂU NÓI NÀY';
  const COL_EN_LITERAL = 'Dịch sát';
  const COL_EN_NATURAL = 'Dịch thoát';

  // ── Filter & map ─────────────────────────────────────────
  const documents: Array<{ id: string; data: Record<string, unknown> }> = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const index = Number(row[COL_INDEX]);
    const viText = clean(row[COL_VI]);
    const enLiteral = clean(row[COL_EN_LITERAL]);
    const enNatural = clean(row[COL_EN_NATURAL]);

    // Skip empty rows
    if (!viText && !enLiteral) continue;

    const docId = `wit365-${padIndex(index || i + 1)}`;

    documents.push({
      id: docId,
      data: {
        index: index || i + 1,
        viText,
        enLiteral,
        enNatural,
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
  for (const doc of documents.slice(0, 5)) {
    const d = doc.data;
    console.log(`  • [${doc.id}] index=${d.index}`);
    console.log(`    vi: "${String(d.viText).slice(0, 60)}..."`);
    console.log(`    en: "${String(d.enLiteral).slice(0, 60)}..."`);
  }
}

main().catch((err) => {
  console.error('❌ Unexpected error:', err);
  process.exit(1);
});

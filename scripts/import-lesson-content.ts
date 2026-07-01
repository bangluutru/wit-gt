/**
 * Update lesson translations in Firestore (targeted, non-destructive).
 *
 * Reads the bundled English markdown files and writes `titleEn` + `contentEn`
 * onto the matching lesson docs (looked up by `lessonNo`). If an entry also
 * specifies `viFile`/`titleVi` (used for lessons whose Vietnamese source was
 * only a placeholder in Firestore), those fields are updated too. No other
 * fields are touched.
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
const LESSON_UPDATES: Array<{ lessonNo: number; titleEn: string; enFile: string; titleVi?: string; viFile?: string }> = [
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
  {
    lessonNo: 32,
    titleEn: 'Roadmap to Turn Any Job into a Dream Career',
    enFile: 'lesson-lo-trinh-bien-nghe-thanh-nghe-uoc-mo.en.md',
  },
  {
    lessonNo: 33,
    titleEn: 'Roadmap to Conquer Sixfold Life Fulfillment',
    enFile: 'lesson-lo-trinh-chinh-phuc-luc-loc-dai-thuan.en.md',
  },
  {
    lessonNo: 34,
    titleEn: 'Roadmap to Elevate the Realm of Life',
    enFile: 'lesson-lo-trinh-nang-cao-canh-gioi-cuoc-song.en.md',
  },
  {
    lessonNo: 35,
    titleEn: 'Formula for Rising Above All Adversities',
    enFile: 'lesson-cong-thuc-vuot-thoat-van-nan.en.md',
  },
  {
    lessonNo: 36,
    titleEn: 'Formula for Material Wealth',
    enFile: 'lesson-cong-thuc-lam-giau-vat-chat.en.md',
  },
  {
    lessonNo: 38,
    titleEn: 'Formula for Shifting Ordinary to Extraordinary',
    enFile: 'lesson-cong-thuc-bien-binh-thuong-phi-thuong.en.md',
  },
  {
    lessonNo: 39,
    titleEn: 'Coaching and Consultation Formulas of Inner Coaches',
    enFile: 'lesson-cong-thuc-tu-van-huan-luyen.en.md',
  },
  {
    lessonNo: 40,
    titleEn: 'Formula for Shifting Conscious Desires to Inner Belief',
    enFile: 'lesson-cong-thuc-bien-mong-muon-y-thuc.en.md',
  },
  {
    lessonNo: 41,
    titleEn: 'Formula for Activating Desirable Total Karma',
    enFile: 'lesson-cong-thuc-kich-hoat-tong-nghiep.en.md',
  },
  {
    lessonNo: 42,
    titleEn: 'Mastermind Group (Establishment, Assembling, Operation, and Maximization)',
    enFile: 'lesson-tri-tue-uu-tu.en.md',
  },
  {
    lessonNo: 43,
    titleEn: 'The Expert’s Code of the Inner Coach (3773)',
    enFile: 'lesson-mat-ma-chuyen-gia-3773.en.md',
  },
  {
    lessonNo: 44,
    titleEn: 'Standard Concepts in Training of the Inner Coach',
    enFile: 'lesson-quan-niem-chuan-dao-tao.en.md',
  },
  {
    lessonNo: 45,
    titleEn: 'Right Mental State in Training of the Inner Coach',
    enFile: 'lesson-tam-thai-dung-dao-tao.en.md',
  },
  {
    lessonNo: 46,
    titleEn: 'Suitable Capacity in Training of the Inner Coach',
    enFile: 'lesson-nang-luc-phu-hop-dao-tao.en.md',
  },
  {
    lessonNo: 47,
    titleEn: 'Principles in Training of the Inner Coach',
    enFile: 'lesson-nguyen-tac-dao-tao.en.md',
  },
  {
    lessonNo: 48,
    titleEn: 'Acquisition - Acceleration - People Gathering Method',
    enFile: 'lesson-phuong-phap-thu-dac-gia-toc-tu-chung.en.md',
  },
  {
    lessonNo: 49,
    titleEn: 'Four Diagrams of Human Life 1, 2, 3, 4 and Applications',
    enFile: 'lesson-bon-do-hinh-nhan-sinh.en.md',
  },
  {
    lessonNo: 50,
    titleEn: 'Law of Attraction - Influence - Value - Transformation',
    enFile: 'lesson-quy-luat-thu-hut-anh-huong-gia-tri.en.md',
  },
  {
    lessonNo: 51,
    titleEn: 'Law of Symbiosis in Human Life',
    enFile: 'lesson-quy-luat-cong-sinh-trong-nhan-sinh.en.md',
  },
  {
    lessonNo: 52,
    titleEn: 'Law of Paying the Price',
    enFile: 'lesson-quy-luat-tra-gia.en.md',
  },
  {
    lessonNo: 53,
    titleEn: 'Law of Compensation',
    enFile: 'lesson-quy-luat-bu-dap.en.md',
  },
  {
    lessonNo: 54,
    titleEn: 'Law of Arising - Staying - Changing - Vanishing',
    enFile: 'lesson-quy-luat-thanh-tru-hoai-diet.en.md',
  },
  {
    lessonNo: 56,
    titleEn: 'Law of Cycle - Rhythm Principle',
    enFile: 'lesson-quy-luat-chu-ky-nguyen-ly-nhip-dieu.en.md',
  },
  {
    lessonNo: 57,
    titleEn: 'Law of Supply and Demand',
    enFile: 'lesson-quy-luat-cung-cau.en.md',
  },
  {
    lessonNo: 58,
    titleEn: 'Law of Consciousness',
    enFile: 'lesson-quy-luat-tam-thuc.en.md',
  },
  {
    lessonNo: 59,
    titleEn: 'Grape Bunch Principle - Butterfly Gathering Principle',
    enFile: 'lesson-nguyen-ly-chum-nho-nguyen-ly-buom-tu.en.md',
  },
  {
    lessonNo: 60,
    titleEn: 'Operating Principle of the Subconscious',
    enFile: 'lesson-nguyen-ly-van-hanh-cua-tiem-thuc.en.md',
  },
  {
    lessonNo: 61,
    titleEn: 'Key (Recognition - Gratitude & Outreach)',
    enFile: 'lesson-chia-khoa-ghi-nhan-biet-on-quang-ba.en.md',
  },
  // lessonNo 62 intentionally omitted: its source .md files are empty (no VI or
  // EN content has been authored yet) — do not push a blank contentEn over Firestore.
  {
    lessonNo: 63,
    titleEn: 'The True Desires of a Human Being',
    enFile: 'lesson-mong-muon-that-su-cua-mot-con-nguoi.en.md',
  },
  {
    lessonNo: 64,
    titleEn: 'Success Process of an Extraordinary Leader',
    enFile: 'lesson-quy-trinh-thanh-cong-cua-nha-lanh-dao-sieu-pham.en.md',
  },
  {
    lessonNo: 65,
    titleEn: 'Roadmap to Becoming an Omnipotent Leader - Cultural Entrepreneur',
    enFile: 'lesson-lo-trinh-tro-thanh-nha-lanh-dao-toan-nang-doanh-nhan-van-hoa.en.md',
  },
  {
    lessonNo: 66,
    titleEn: 'Building an Omnipotent Leadership Environment',
    enFile: 'lesson-xay-dung-moi-truong-lanh-dao-toan-nang.en.md',
  },
  {
    lessonNo: 67,
    titleEn: 'Self-Anchoring Cycle',
    enFile: 'lesson-chu-trinh-dinh-than.en.md',
  },
  {
    lessonNo: 68,
    titleEn: 'Portrait of WiT Master Mentor',
    enFile: 'lesson-chan-dung-master-mentor-wit.en.md',
  },
  {
    lessonNo: 69,
    titleEn: 'Wise Solutions for 11 Challenging Questions',
    enFile: 'lesson-loi-giai-khon-ngoan-cho-11-cau-hoi-nan-giai.en.md',
  },
  {
    lessonNo: 70,
    titleEn: 'Three Treasured Methods: Outreach - Coordination - Lead',
    enFile: 'lesson-tam-dai-phap-bao-quang-ba-phoi-hop-dan-dat.en.md',
  },
  {
    lessonNo: 71,
    titleEn: 'Code of the Outreach Expert',
    enFile: 'lesson-mat-ma-nha-quang-ba.en.md',
  },
  {
    lessonNo: 72,
    titleEn: 'Legacy for Future Generations',
    enFile: 'lesson-di-san-cho-the-he-sau.en.md',
  },
  {
    lessonNo: 73,
    titleEn: 'Cognitive Education - Education at the Root',
    enFile: 'lesson-giao-duc-nhan-thuc-giao-duc-tan-goc.en.md',
  },
  {
    lessonNo: 74,
    titleEn: 'Philosophy of Education at the Root',
    enFile: 'lesson-triet-ly-giao-duc-tan-goc.en.md',
  },
  {
    lessonNo: 75,
    titleEn: 'Eternal Organization',
    enFile: 'lesson-to-chuc-truong-ton.en.md',
  },
  {
    lessonNo: 76,
    titleEn: 'Career of Philosophical Education for Human Life',
    enFile: 'lesson-su-nghiep-giao-duc-triet-ly-cho-nhan-sinh.en.md',
  },
  {
    lessonNo: 37,
    titleEn: 'Formula for Replicating the Expert Community 1-2-20-500-10,000',
    enFile: 'lesson-cong-thuc-phat-trien-cong-dong-chuyen-gia.en.md',
    titleVi: 'Công thức phát triển Cộng đồng Chuyên gia 1-2-20-500-10.000',
    viFile: 'lesson-cong-thuc-phat-trien-cong-dong-chuyen-gia.vi.md',
  },
  {
    lessonNo: 55,
    titleEn: 'Law of Reincarnation',
    enFile: 'lesson-quy-luat-luan-hoi.en.md',
    titleVi: 'Quy luật Luân hồi',
    viFile: 'lesson-quy-luat-luan-hoi.vi.md',
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

    const patch: Record<string, unknown> = {
      titleEn: item.titleEn,
      contentEn,
      updatedAt: FieldValue.serverTimestamp(),
    };
    if (item.viFile) {
      const viPath = path.join(CONTENT_DIR, item.viFile);
      if (!fs.existsSync(viPath)) {
        console.error(`❌ Missing content file: ${viPath}`);
        continue;
      }
      patch.contentVi = fs.readFileSync(viPath, 'utf8');
      if (item.titleVi) patch.titleVi = item.titleVi;
    }

    const snap = await db
      .collection(COLLECTION)
      .where('lessonNo', '==', item.lessonNo)
      .get();

    if (snap.empty) {
      console.warn(`⚠️  No lesson found with lessonNo=${item.lessonNo} — skipped.`);
      continue;
    }

    for (const docSnap of snap.docs) {
      await docSnap.ref.update(patch);
      console.log(
        `✅ lessonNo=${item.lessonNo} [${docSnap.id}] updated · titleEn="${item.titleEn}" · contentEn=${contentEn.length} chars${item.viFile ? ' · +vi' : ''}`,
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

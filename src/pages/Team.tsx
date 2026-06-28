// ============================================================
// WiT Platform - Team Page (admin-editable, multilingual)
// ============================================================

import { Heart } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { EditorialBoard } from '../components/editorial/EditorialBoard';

export default function Team() {
  const { interfaceLang } = useSettings();
  const L = (vi: string, en: string, jp: string) =>
    interfaceLang === 'en' ? en : interfaceLang === 'jp' ? jp : vi;

  return (
    <EditorialBoard
      section="team"
      variant="team"
      eyebrow={L('Những người đứng sau giáo trình', 'People behind the curriculum', 'カリキュラムを支える人々')}
      title={L('Team biên soạn', 'Editorial Team', '編集チーム')}
      subtitle={L(
        'Tập thể biên soạn, dịch thuật và kiểm định nội dung cho giáo trình đa ngôn ngữ WiT.',
        'The collective team compiling, translating, and verifying content for the WiT multilingual curriculum.',
        'WiT多言語カリキュラムのコンテンツを編集、翻訳、および検証する合同チーム。'
      )}
      footer={
        <div className="text-center pt-4">
          <p className="text-xs text-wit-text-tertiary flex items-center justify-center gap-1.5">
            {L('Xây dựng với', 'Built with', '構築元')}
            <Heart className="h-3.5 w-3.5 text-wit-red fill-wit-red" />
            {L('bởi đội ngũ WiT', 'by the WiT team', 'WiTチーム')}
          </p>
        </div>
      }
    />
  );
}

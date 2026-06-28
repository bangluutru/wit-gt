// ============================================================
// WiT Platform - Advisors Page (admin-editable, multilingual)
// ============================================================

import { ShieldCheck } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { EditorialBoard } from '../components/editorial/EditorialBoard';

export default function Advisors() {
  const { interfaceLang } = useSettings();
  const L = (vi: string, en: string, jp: string) =>
    interfaceLang === 'en' ? en : interfaceLang === 'jp' ? jp : vi;

  return (
    <EditorialBoard
      section="advisors"
      variant="advisors"
      eyebrow={L('Định hướng & bảo trợ chuyên môn', 'Guidance & Professional Sponsorship', '専門的な指導と後援')}
      title={L('Ban cố vấn', 'Advisory Board', '顧問団')}
      subtitle={L(
        'Hội đồng cố vấn đồng hành cùng giáo trình về tư tưởng, học thuật và ứng dụng thực tiễn.',
        'The advisory board accompanies the curriculum in thought, academia, and practical application.',
        '顧問団は、思想、学問、実践的な応用においてカリキュラムをサポートします。'
      )}
      footer={
        <div className="text-center pt-4">
          <p className="text-xs text-wit-text-tertiary flex items-center justify-center gap-1.5">
            {L('Đồng hành cùng sự nghiệp giáo dục', 'Accompanying the education career', '教育事業とともに')}
            <ShieldCheck className="h-3.5 w-3.5 text-wit-gold" />
          </p>
        </div>
      }
    />
  );
}

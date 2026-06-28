// ============================================================
// WiT Platform - "Trân trọng biết ơn" (Acknowledgements)
// A storytelling page about co-creation and the people behind WiT.
// Composed from small section components; data lives in gratitudeData.ts.
// ============================================================

import { useSettings } from '../contexts/SettingsContext';
import { GratitudeHero } from '../components/gratitude/GratitudeHero';
import { FounderSection } from '../components/gratitude/FounderSection';
import { CommunitySection } from '../components/gratitude/CommunitySection';
import { ContributorGrid } from '../components/gratitude/ContributorGrid';
import { EditorGrid } from '../components/gratitude/EditorGrid';
import { JourneySection } from '../components/gratitude/JourneySection';
import { FinalMessage } from '../components/gratitude/FinalMessage';
import type { Language } from '../lib/types';

export default function Acknowledgements() {
  const { interfaceLang } = useSettings();
  const lang = interfaceLang as Language;

  return (
    <div className="page-enter">
      <GratitudeHero lang={lang} />
      <FounderSection lang={lang} />
      <CommunitySection lang={lang} />
      <ContributorGrid lang={lang} />
      <EditorGrid lang={lang} />
      <JourneySection lang={lang} />
      <FinalMessage lang={lang} />
    </div>
  );
}

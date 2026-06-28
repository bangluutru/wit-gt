// ============================================================
// WiT Platform - "Trân trọng biết ơn" (Acknowledgements)
// A storytelling page about co-creation and the people behind WiT.
// Composed from small section components; data lives in gratitudeData.ts.
// ============================================================

import { GratitudeHero } from '../components/gratitude/GratitudeHero';
import { FounderSection } from '../components/gratitude/FounderSection';
import { CommunitySection } from '../components/gratitude/CommunitySection';
import { ContributorGrid } from '../components/gratitude/ContributorGrid';
import { EditorGrid } from '../components/gratitude/EditorGrid';
import { JourneySection } from '../components/gratitude/JourneySection';
import { FinalMessage } from '../components/gratitude/FinalMessage';

export default function Acknowledgements() {
  return (
    <div className="page-enter">
      <GratitudeHero />
      <FounderSection />
      <CommunitySection />
      <ContributorGrid />
      <EditorGrid />
      <JourneySection />
      <FinalMessage />
    </div>
  );
}

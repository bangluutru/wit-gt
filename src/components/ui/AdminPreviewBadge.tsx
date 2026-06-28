import { ShieldCheck } from 'lucide-react';

/**
 * Small badge shown to admin users to indicate they are previewing content
 * that would normally be locked for regular learners.
 */
export function AdminPreviewBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-wit-gold-soft text-wit-gold text-[10px] font-bold uppercase tracking-wide">
      <ShieldCheck className="h-3 w-3" />
      Admin preview
    </span>
  );
}

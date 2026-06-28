// ============================================================
// WiT Platform - Admin role configuration
// ============================================================
//
// Admin designation works on two levels:
//  1. An email allowlist (below) auto-grants the `admin` role on
//     sign-up / sign-in. This solves the bootstrap problem (the first
//     admins) without needing to touch the Firestore console.
//  2. Existing admins can promote/demote any other user from the
//     "Quản lý người dùng" page, which writes the `role` field directly.
//
// The allowlist combines these built-in defaults with an optional
// comma-separated `VITE_ADMIN_EMAILS` environment variable, so it can be
// changed per-deployment without code edits.
// ============================================================

/** Built-in default admin emails. */
const DEFAULT_ADMIN_EMAILS = [
  'bangluutr@gmail.com',
  'haibangtran@gmail.com',
];

function parseEnvAdminEmails(): string[] {
  const raw = import.meta.env.VITE_ADMIN_EMAILS as string | undefined;
  if (!raw) return [];
  return raw.split(',').map((e) => e.trim()).filter(Boolean);
}

/** Normalized set of admin emails (built-in defaults + env override). */
export const ADMIN_EMAILS: Set<string> = new Set(
  [...DEFAULT_ADMIN_EMAILS, ...parseEnvAdminEmails()].map((e) => e.toLowerCase())
);

/** Whether the given email is on the admin allowlist. */
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.has(email.toLowerCase());
}

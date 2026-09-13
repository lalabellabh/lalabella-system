# Lalabella System — Security Status

Updated: 2026-09-13

## Current architecture

- Frontend: GitHub-hosted static pages.
- Authentication and database: Supabase Auth + PostgreSQL.
- Browser uses the Supabase publishable key only.
- No Google Apps Script or Google Sheets endpoint is a runtime dependency in this repository.
- Privileged database operations use authenticated RPCs with server-side authorization checks.

## Verified controls

- 46 public tables have Row Level Security enabled.
- No literal `USING (true)` / `WITH CHECK (true)` policy is used for the protected application tables.
- Profiles are tied to `auth.users` and role/branch access is enforced server-side.
- Orders record `created_by` from `auth.uid()` and derive branch from the authenticated profile.
- Order status is allow-listed by the database function.
- Item transfers validate the destination against `branch_config`.
- Caller identity fields fall back to the authenticated profile rather than requiring a trusted browser secret.
- No OpenAI `sk-` key or Supabase `service_role` key is present in the repository search results.
- Orders have indexes for OR number, delivery date, status, branch, and created-by lookups.

## Remaining security work

1. Supabase Auth leaked-password protection must be enabled in the Supabase Auth settings.
2. The intentional SECURITY DEFINER RPC surface should eventually be reduced by moving privileged mutations behind Edge Functions or another trusted API boundary, then revoking direct `authenticated` EXECUTE where no longer needed.
3. Browser/manual integration testing remains required for login, session refresh, CRUD, printing, and branch-role enforcement.
4. Production deployment should only use the new Lalabella System Supabase project; the legacy Google Apps Script/Sheets backend is not a target runtime.

## Security rule

Never place a database password, Supabase service-role key, OpenAI API key, or other privileged credential in HTML, JavaScript, GitHub Pages, or other browser-delivered assets.

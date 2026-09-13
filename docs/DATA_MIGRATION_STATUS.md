# Lalabella System — Data Migration Status

Updated: 2026-09-13

## Target

Production target is the new Supabase project for Lalabella System. Google Sheets / Google Apps Script is not a runtime dependency.

## Already migrated

Reference/configuration data has been copied and verified:

- `branch_config`
- `flower_staff`
- `flower_suppliers`
- `flower_origins`
- `chocolate_received_by`
- `chocolate_settings`
- `item_settings`
- `card_notes`

## Business data still requiring controlled import

The legacy Supabase database contains historical/application data including:

- flower catalog and receiving/history tables
- chocolate catalog, receiving/release and stock-history tables
- duty schedules
- item inventory/history
- supply-log history
- notes and other operational records

The legacy `users` table must **not** be copied as authentication credentials. Password hashes and session tokens are excluded from the migration plan. New users must be created through Supabase Auth and then linked to `public.profiles`.

## Migration safety rules

1. Preserve source values; do not silently normalize business records.
2. Migrate parent/reference rows before dependent history rows.
3. Validate row counts after every table batch.
4. Reset PostgreSQL sequences after preserving numeric primary keys where applicable.
5. Do not import legacy password hashes, tokens, or privileged secrets.
6. Do not put database credentials or service-role keys into the repository.
7. Keep the legacy project available as a read-only rollback/reference source until parity and browser testing are complete.

## Current limitation

The connected database tools can query each Supabase project independently, but there is no safe direct cross-project database link configured. Full historical data transfer therefore remains a controlled export/import step rather than an implicit cross-database copy. This is intentional: no privileged database credential is being embedded into the app or repository to automate the transfer.

## Verification gate

Full cutover is not considered complete until:

- required table counts match the approved source snapshot;
- key catalog totals and rates match;
- branch-scoped reads/writes pass with real Supabase Auth users;
- order creation and stock mutation RPCs pass;
- no legacy Apps Script/Sheets endpoint is used at runtime;
- security advisor findings are reviewed;
- login/session/printing are manually tested in a real browser.

# Legacy Root Files

Genuine, unmodified snapshot of the pre-restructuring production site — sourced directly from the live `main` branch (`lalabella-calculator`) on 2026-09-14. This is the real rollback safety net for the `modules/` restructuring in this branch.

**Verified distinct from `modules/`:** these files use the full, original `auth-guard.js` (14,392 bytes) directly — not the small per-folder compatibility loader used inside `modules/*/auth-guard.js` (which relies on a `<base href="../../">` trick specific to the new folder depth). An earlier version of this `legacy/` folder was mistakenly a byte-identical copy of the `modules/` content instead of the true original — that has been corrected.

Do not delete or modify these files. If anything in `modules/` needs to be rolled back, these are the known-good files to restore from.

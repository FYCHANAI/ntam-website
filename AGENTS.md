# NTAM official website maintenance

## Scope and source of truth

- This repository is `FYCHANAI/ntam-website`, serving `https://www.ntam.com.hk/` through GitHub Pages.
- The user requested Codex to take over ongoing maintenance on 2026-10-09. Read `MAINTENANCE.md` before the next change and inspect the current branch and live site; the handover snapshot is historical, not a substitute for a fresh read.
- This is the corporate website. Other repositories, including the WRISE interview, research reports, HR and gift portals, have separate scopes. Do not transfer their templates or instructions to this site without task context supporting it.
- Current user instructions govern the task. Continue authorized maintenance without repeatedly requesting approval. A request to inspect or take over does not itself require production code changes.

## Architecture and editing

- Plain HTML, CSS and JavaScript; no application build, package manager, framework, CMS or server-side source exists in the baseline repository.
- English pages are at the root, Traditional Chinese under `tc/`, Simplified Chinese under `sc/`. Maintain corresponding content and navigation together unless the request is language-specific.
- Shared styles: `assets/css/style.css`. Shared behavior: `assets/js/main.js`. Five page families also have inline styles; About pages have identical inline tab scripts.
- Header/footer markup is copied into each full page. Editing one page does not propagate to others. Respect `../assets/` paths in localized pages.
- Preserve existing URLs, brand colors, layout, language switch targets, `hreflang`, news redirects, contact fields, and disclaimer behavior when unrelated to the requested change.
- Use the existing SVG icons and assets for ordinary layout work. Add frameworks, new services or architectural migrations only when they serve the requested scope.
- Person names, job titles, biographies and claims must come from supplied or authoritative material. Do not identify people solely by a matching English name.
- For new factual financial/company material, use authoritative sources. Existing press releases are dated historical content; do not silently rewrite historical roles as current roles.

## Verification and release

- Before edits, record the current production commit and work on a separate branch. Preserve a recoverable baseline and review the exact diff.
- Check affected languages, internal file paths and anchors, JavaScript syntax, and relevant desktop/mobile behavior. Focus verification on the changes and known risks.
- Contact form tests must use a mocked submission unless the user explicitly authorizes sending a real enquiry. This form contacts third parties and may send email.
- `main` deploys to production via GitHub Pages. Follow the release authorization already provided in the task; do not treat a branch push or local preview as a completed production deployment.
- After an authorized release, verify the corresponding Pages workflow and live content. Record the commit, changed files, checks and rollback point.
- Roll back by a new revert/restoration commit, preserving unrelated intervening changes. Do not force-reset production history.

## Handover baseline

- Baseline commit: `9f22a31da60c80e5db7949e4c01d5cdb41ef31c4`.
- Preservation branch: `backup/pre-codex-handover-20261009`.
- Intake findings and limits are in `MAINTENANCE.md`; they are a backlog, not evidence that repairs have been made.

# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased] — Phase 2: Multi-Template Resume Builder

### Added
- Six real resume templates — ATS, Modern, Creative, Minimal, Executive, Two Column — each with distinct layout, typography, spacing, header style, and section arrangement (`components/Resume/templates/{ATS,Modern,Creative,Minimal,Executive,TwoColumn}/`).
- Shared PDF rendering primitives (`components/Resume/templates/shared/`: `Header`, `SectionHeading`, `ListItem`, `Sections.js`) so every template reuses one implementation of "how a section renders" and only supplies its own layout + `styles.js`.
- `components/Resume/templates/registry.js` — code-split `import()` loader per template id, with in-memory caching, so unselected templates are never bundled into the initial preview load.
- `config/templates.js` — metadata registry (id, name, description, thumbnail, ATS score, recommended roles, primary/secondary color, layout type) driving the templates page, editor switcher, and preview modal.
- `selectedTemplate` field + `setTemplate` reducer in `resumeSlice`, persisted to `localStorage` alongside resume content and restored automatically on load.
- `components/Resume/TemplateSwitcher.js` — in-editor template picker (radiogroup, keyboard/focus accessible) that updates the preview instantly, no reload.
- `components/Resume/TemplatePreviewModal.js` — full-size template preview with zoom in/out, next/previous template cycling, Escape-to-close, and focus management (focus moves into the dialog on open, returns to the trigger on close).
- Redesigned `/templates` page: cards with thumbnail, name, description, ATS score badge, recommended roles, "Preview" and "Use Template" actions, and a "Selected" badge for the active template.

### Changed
- `components/Resume/Preview.js` rewritten to resolve the selected template asynchronously, memoize the built PDF document, and refresh the preview/download on template change as well as on save.
- `store/index.js` localStorage schema bumped (additively — existing saved resumes are preserved, not discarded) to persist `selectedTemplate` alongside resume content.
- `app/editor/page.js` now includes a "Template" panel above the section tabs.

### Removed
- `components/Resume/pdf/` and `components/Resume/Styles.js` — superseded by the per-template `components/Resume/templates/*` structure; all logic was migrated, nothing was dropped.

## [Unreleased] — Phase 1: Production Readiness

### Added
- Next.js App Router error boundaries: `app/error.js`, `app/editor/error.js`, and `app/not-found.js` so unexpected errors and bad routes no longer crash the app with a blank screen.
- Graceful, in-app error state for PDF preview generation/rendering failures in `components/Resume/Preview.js`.
- Validation and fallback for the `editor` route's `tab` query parameter — unknown tabs now fall back to `contact` instead of crashing the editor.
- localStorage schema validation, versioning, and safe-parsing in `store/index.js`, with recovery to sane defaults on corrupted or outdated data.
- Bounds checking in `deleteIndex`/`moveIndex` Redux reducers to prevent out-of-range array mutations.
- `aria-label`s on icon-only buttons (mobile menu toggle, card reorder/edit/delete/collapse controls, template modal close button) for screen-reader accessibility.
- `LICENSE` (MIT), `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, and this `CHANGELOG.md`.
- `.github/ISSUE_TEMPLATE/` (bug report, feature request, question) and `.github/PULL_REQUEST_TEMPLATE.md`.

### Changed
- Rewrote `README.md` with an accurate feature list, architecture overview, tech stack, install/dev instructions, project structure, and roadmap.
- Re-enabled the `/templates` link in the site header navigation (the route existed but was not linked).

### Fixed
- Removed a duplicate `name` key in `config/ResumeFields.js` (`contact.name` was declared twice).
- `store/index.js` no longer touches `localStorage` during server-side rendering (guarded with a `typeof window` check), preventing potential SSR crashes.

### Removed
- Unused dependencies: `axios`, `tw-merge`, `react-hot-toast` (none were imported anywhere in the codebase).
- Dead code: unused `components/Resume/html/` directory (an unfinished, never-imported HTML export path).
- Dead/commented-out code in `components/UI/Input.js`, `components/Header.js`, `store/slices/resumeSlice.js`, and `components/Resume/pdf/index.js`.
- Debug `console.log` statements (e.g. in the `deleteIndex` reducer).
- Unused `FaDownload` import in `components/Header.js`.

## [0.1.0] — Initial Release

- Resume editor with live PDF preview (contact, summary, education, experience, projects, skills, certificates, languages sections).
- Auto-save to `localStorage` via Redux Toolkit.
- PDF export/download powered by `@react-pdf/renderer`.
- Templates gallery page and About page.
- Tailwind CSS-based responsive UI.

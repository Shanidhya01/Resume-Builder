# HireReady — Resume Builder

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2-764ABC?logo=redux&logoColor=white)](https://redux-toolkit.js.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

A free, open-source resume builder with a live editor and instant PDF preview — built with Next.js, React, and Redux Toolkit. No sign-up, no watermark.

## Overview

HireReady lets you fill out a structured resume form and see a live, print-ready PDF preview update as you type. Your data is saved automatically to your browser's `localStorage`, so you can close the tab and pick up where you left off. When you're happy with the result, download it as a PDF.

## Features

- **Six resume templates** — ATS, Modern, Creative, Minimal, Executive, and Two Column. Each has a genuinely different layout (single column, sidebar, two-column), typography, spacing, and section order/arrangement — not just a recolor.
- **Live editor with instant PDF preview** — edit contact info, summary, education, experience, projects, skills, certificates, and languages, with the PDF preview panel updating on save or template change.
- **In-editor template switching** — swap templates from inside `/editor` with no page reload; the preview and download both update immediately.
- **Templates gallery** (`/templates`) — browse all templates with ATS-friendliness scores and recommended roles, open a full-size preview modal (zoom, next/previous, keyboard navigation), and select one to jump straight into the editor with it applied.
- **Auto-save** — resume data *and* the selected template are persisted to `localStorage` (debounced) and restored on your next visit, with schema validation so corrupted or stale data never crashes the app.
- **PDF export** — download your resume as a PDF, generated client-side with `@react-pdf/renderer`, matching whichever template is currently selected.
- **Resilient routing** — invalid editor tab query params fall back to a sensible default instead of crashing; unknown routes show a proper 404 page; unexpected errors are caught by React error boundaries instead of a blank screen.
- **Responsive, accessible UI** — built with Tailwind CSS, with `aria-label`s, keyboard navigation, and focus management on icon-only controls and modals.

> Not yet implemented: HTML export and user accounts/cloud sync. See the [Roadmap](#roadmap).

## Architecture

```
┌──────────────┐      ┌───────────────────────┐      ┌────────────────────┐
│  Editor UI   │ ───► │  Redux store           │ ───► │  localStorage       │
│ (Tabs/Input, │ ◄─── │ (resumeSlice: content  │ ◄─── │ (debounced persist, │
│ TemplateSwitcher) │  │  + selectedTemplate)   │      │  schema-validated)  │
└──────────────┘      └───────────────────────┘      └────────────────────┘
        │                         │
        │                         ▼
        │              config/templates.js (metadata: name, ATS score,
        │              recommended roles, colors, thumbnail — no JSX)
        │                         │
        ▼                         ▼
┌───────────────────────────────────────────────────┐
│ components/Resume/templates/registry.js             │
│  → code-split `import()` per template id            │
└───────────────────────────────────────────────────┘
        │
        ▼
┌────────────────────────────┐
│ Template component          │  components/Resume/templates/<Name>/index.js
│ (layout + section order)    │  + styles.js (typography/spacing/color)
│ built from shared renderers │  components/Resume/templates/shared/*
└────────────────────────────┘
        │
        ▼
┌────────────────────┐
│ Live PDF Preview     │  components/Resume/Preview.js (usePDF + react-pdf viewer)
│ + Download button    │
└────────────────────┘
```

- **State**: a single Redux slice (`store/slices/resumeSlice.js`) holds the resume content *and* the `selectedTemplate` id. Every field edit or template switch dispatches an action; the store is subscribed to persist both to `localStorage` on change (see [Template Architecture](#template-architecture)).
- **Rendering**: `components/Resume/Preview.js` resolves the selected template's PDF component via `templates/registry.js` (a plain code-split `import()`, not `next/dynamic`/`React.lazy`, since react-pdf's custom reconciler doesn't support Suspense), builds the document element, and feeds it to `usePDF`.
- **Routing**: Next.js App Router (`app/`) with route groups for the home page, and dedicated routes for `/editor`, `/templates`, and `/about`.

## Template Architecture

Templates live in `components/Resume/templates/`, one folder per template:

```
components/Resume/templates/
  shared/            Rendering logic reused by every template
    Header.js          Name/title/contact-links block
    SectionHeading.js   Titled section wrapper (title + underline + spacing)
    ListItem.js          Bulleted list row
    Sections.js         Summary/Education/Experience/Projects/Skills/
                         Certificates/Languages content renderers
  ATS/
    index.js           <Document>/<Page> layout + section order
    styles.js           StyleSheet.create({...}) — typography, spacing, color
  Modern/  Creative/  Minimal/  Executive/  TwoColumn/
    ...                (same index.js + styles.js shape)
  registry.js          id → code-split import() loader, with caching
```

**Separation of concerns**: a template's `index.js` only decides *layout* — which sections appear, in what order, and how they're arranged (single column vs. sidebar vs. two-column). It never re-implements *how* an experience entry or bullet list renders — that logic lives once in `shared/Sections.js` and is parameterized entirely by the `styles` object each template passes in. This is what keeps six visually distinct templates from duplicating rendering code.

### Adding a new template

1. Create `components/Resume/templates/YourTemplate/styles.js` — a `StyleSheet.create({...})` implementing the same style keys used by the existing templates (`page`, `header`, `headerName`, `sectionTitle`, `entryTitle`, `listRow`, etc. — copy an existing `styles.js` as a starting point).
2. Create `components/Resume/templates/YourTemplate/index.js` — import the shared section components from `../shared/Sections` and `../shared/Header`, and compose your layout (see `TwoColumn/index.js` for a multi-column example, or `Creative/index.js` for a sidebar example).
3. Register it in `components/Resume/templates/registry.js`'s `loaders` map.
4. Add its metadata (id, name, description, thumbnail, ATS score, recommended roles, colors, layout type) to `config/templates.js`.
5. Add a thumbnail image to `public/templates/`.

No other file needs to change — the templates page, editor switcher, and PDF preview all read from `config/templates.js` and `registry.js`.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | [Next.js 14 (App Router)](https://nextjs.org/) |
| UI | [React 18](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/) |
| State | [Redux Toolkit](https://redux-toolkit.js.org/), [React Redux](https://react-redux.js.org/) |
| PDF | [@react-pdf/renderer](https://react-pdf.org/), [react-pdf](https://github.com/wojtekmaj/react-pdf) |
| Icons | [react-icons](https://react-icons.github.io/react-icons/), [lucide-react](https://lucide.dev/) |
| Analytics | [@next/third-parties](https://nextjs.org/docs/app/building-your-application/optimizing/third-party-libraries) (Google Analytics) |

## Installation

**Prerequisites:** Node.js 18+ and npm.

```bash
git clone https://github.com/Shanidhya01/Resume-Builder.git
cd Resume-Builder
npm install
```

## Local Development

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000). The app hot-reloads as you edit files.

Other scripts:

```bash
npm run build   # production build
npm run start   # run the production build locally
npm run lint    # run Next.js/ESLint checks
```

## Project Structure

```
app/                    Next.js App Router routes
  (Home)/                 Landing page
  about/                   About page (fetches GitHub contributors)
  editor/                  Resume editor route (?tab=<section>)
  templates/               Template gallery (cards + preview modal)
  error.js, not-found.js  Error boundary & 404 page
components/
  Editor/                 Editor shell, single-field & repeatable-field editors
  Resume/
    templates/              All 6 template layouts + shared renderers (see above)
    Preview.js               Live PDF preview panel + download/preview actions
    TemplateSwitcher.js       In-editor template picker
    TemplatePreviewModal.js   Full-size preview with zoom/next/prev
  UI/                     Reusable form inputs
  Header.js, Tabs.js      Navigation
config/
  ResumeFields.js         Declarative field schema per resume section
  templates.js            Template metadata registry (name, ATS score, colors, etc.)
store/
  index.js                Redux store + localStorage persistence (content + template)
  slices/resumeSlice.js   Resume state reducers, incl. setTemplate
utils/
  formatDate.js           Date formatting helper used in the PDF
```

## Roadmap

- [ ] Add automated tests (unit tests for reducers/utils, component/visual tests per template).
- [ ] Add a TypeScript migration path for stronger type safety.
- [ ] Add CI (lint + build) via GitHub Actions.
- [ ] Per-template color customization (using each template's `primaryColor`/`secondaryColor` as user-editable accents).
- [ ] Optional account/cloud sync for cross-device resume storage.

## Phase 3: Cloud & Auth

HireReady now supports Firebase Authentication + Firestore for multi-resume, cross-device storage, layered on top of the existing Redux/localStorage editor.

### Firebase project setup

1. Create a project at [Firebase Console](https://console.firebase.google.com).
2. Enable **Authentication > Sign-in method > Email/Password** and **Google**. For Google sign-in, set a support email in the provider config; no extra redirect URI setup is needed for `localhost` or a Vercel deployment domain added under Authentication > Settings > Authorized domains.
3. Create a **Firestore Database** (production mode).
4. Add a Web App (Project Settings > General > Your apps) and copy the SDK config values.
5. Deploy the security rules in `firestore.rules`: `firebase deploy --only firestore:rules` (requires the Firebase CLI and `firebase init` to link the project), or paste the file's contents into Firestore's Rules tab in the console.
6. In Firestore, add a composite index if prompted when querying `resumes` by `ownerId` (Firestore will emit a console link the first time the query is run if one is needed).

Runs entirely on the free Spark plan — Firebase Storage is intentionally not used, since file uploads require the paid Blaze plan. Profile pictures are set via a URL field on the Account page instead of a file upload.

### Environment variables

Copy `.env.example` to `.env.local` and fill in the values from step 4 above:

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

`.env.local` is git-ignored. The Firebase client SDK does not validate these at build time, so `npm run build` succeeds even with placeholder values — only actual network calls (sign up, log in, Firestore reads/writes) require a real project.

### Firestore schema

- `resumes/{resumeId}` — `{ ownerId, name, selectedTemplate, contact, summary, education, experience, projects, skills, certificates, languages, isDefault, createdAt, updatedAt }`. Documents live in a top-level collection (not nested under `users`) so ownership queries are a simple `where('ownerId', '==', uid)`.
- `resumes/{resumeId}/versions/{versionId}` — a snapshot of the resume content fields plus `savedAt`, written on autosave at most once every 2 minutes of active editing (the live document is updated on every autosave regardless).

### Security rules

See `firestore.rules` at the repo root: a resume is only readable/writable by the user whose `uid` matches its `ownerId`; the `versions` subcollection inherits the same check via a `get()` on the parent document. The Firestore service layer (`lib/resumes.js`) also checks ownership client-side before mutating, as defense in depth.

### Local dev

1. `npm install`
2. Set up `.env.local` as above (placeholders are fine for `npm run build`; a real Firebase project is required to actually sign up/log in).
3. `npm run dev`
4. Visit `/register` to create an account, then `/dashboard` to manage resumes.

The original `/editor` route (no resume id) still works as a local/anonymous scratch editor backed by `localStorage`, unchanged from Phase 1/2. The primary authenticated flow is `/dashboard` → pick or create a resume → `/editor/[resumeId]`, which persists to Firestore via a debounced autosave hook (`hooks/useAutoSave.js`) instead of localStorage.

## Phase 4: AI Resume Assistant

### OpenRouter setup

1. Get a free API key at [openrouter.ai](https://openrouter.ai).
2. Add to `.env.local`: `OPENROUTER_API_KEY=<your-key>`. This variable is server-only (no `NEXT_PUBLIC_` prefix) and is only read inside `app/api/ai/*` route handlers — it never reaches the browser bundle.
3. Optionally set `OPENROUTER_MODEL` (defaults to `openai/gpt-oss-20b:free`). Changing this value swaps the model used for every AI feature with no code changes.

### `lib/ai/` architecture

- `openrouter.js` — low-level client that calls the OpenRouter chat-completions endpoint with a 30s timeout (AbortController) and exponential-backoff retries (max 2) on 429/5xx.
- `prompts.js` — one prompt-builder per feature (`buildSummaryPrompt`, `buildExperiencePrompt`, etc.), each returning `{ system, user }` messages. System prompts require the model to use only user-provided information and respond with strict JSON matching a documented shape.
- `parser.js` — `parseAIResponse(rawText)` strips markdown code fences and recovers JSON from a response defensively, throwing `AIParseError` if unrecoverable.
- `validator.js` — one `validate*Response` function per feature checking the parsed JSON's shape/types, throwing `AIValidationError` on mismatch.
- `index.js` — `generateAIResponse({ feature, input })`, the single entry point every API route uses: looks up the prompt builder, calls OpenRouter, parses, validates, and returns structured data.
- `rateLimit.js` — in-memory sliding-window limiter (20 requests/minute per IP) shared by all AI routes.
- `request.js` — shared route handler (`handleAIRoute`) doing rate limiting, JSON body parsing, deep string sanitization (trim + 8000-char cap), and consistent error responses.

### API routes

`app/api/ai/{summary,experience,projects,skills,rewrite,grammar,review,cover-letter,ats,job-match}/route.js` — each a POST handler returning the validated AI JSON on success, or `{ error }` with 400 (bad input), 429 (rate limited), or 502/504 (upstream failure) on failure. These routes are intentionally unauthenticated: they only proxy prompts to OpenRouter and never touch Firestore or user data.

### UI

`components/AIAssistant/AIAssistantPanel.js` is a feature-switcher panel (lazy-loaded via `next/dynamic({ ssr: false })`, matching the existing `VersionHistoryDrawer` pattern) added as a new card in `app/editor/[resumeId]/page.js`. It pulls context from Redux, calls the routes via `hooks/useAI.js`, and offers Accept/Regenerate/Copy actions per result. AI state (loading/error/last response per feature, plus a capped 20-entry history) lives in `store/slices/aiSlice.js`, registered in `store/index.js` alongside the existing `resume` reducer.

## Phase 5: ATS Optimization Platform

### `lib/ats/` engine

Deterministic, dependency-free JS modules — no AI calls, no React — that score and analyze a resume object synchronously:

- `textUtils.js` — shared text helpers (`resumeToText`, `getBullets`, `splitSkills`, syllable/sentence counting).
- `keywords.js` — `extractKeywords`, `analyzeKeywords` (matched/missing vs. a job description, overused, duplicate, unused skills, suggested industry keywords).
- `readability.js` — Flesch Reading Ease approximation.
- `grammar.js` — heuristic grammar/spelling/tone checks (repetition, punctuation, first-person pronouns, capitalization).
- `quality.js` — `analyzeBullets` (weak verbs, passive voice, length, missing numbers/impact) and `analyzeSections` (Excellent/Good/Needs Improvement/Missing per section, with reasons).
- `score.js` — `computeAtsScore` combines the above into a weighted overall score (0-100) plus 10 section scores (header, summary, experience, projects, education, skills, certificates, formatting, keyword match, readability).
- `recruiter.js` — simulates a recruiter's first-pass skim (reading time, first impression, visual hierarchy score, missing recruiter-facing info).
- `recommendations.js` — turns analysis output into a flat, deduplicated, priority-sorted (critical/high/medium/low) suggestion list with stable ids.
- `comparison.js` — diffs two resume snapshots + their analyses (added/removed skills & keywords, section score deltas).
- `analysis.js` — the single entry point, `runAtsAnalysis(resume, jobDescription)`, composing every module above into one result object (`overall`, `grade`, `sectionScores`, `sectionStatus`, `readability`, `keywordAnalysis`, `bulletAnalysis`, `grammar`, `recruiter`, `completion`, `insights`, `recommendations`, `recommendationsByPriority`, `wordCount`, `analyzedAt`).

Job-description-specific recommendations that require reasoning beyond keyword matching (suggested skills/projects/certifications/resume changes) reuse the existing `lib/ai/` OpenRouter pipeline via the `jdInsights` feature (`app/api/ai/jd-insights/route.js`), following the same prompt-builder/validator pattern as every other AI feature — no new AI provider was introduced.

### State: `store/slices/atsSlice.js`

Holds the cached `analysis` result (keyed by a content hash of the current resume so it's only recomputed when the resume actually changes — see `hooks/useAtsAnalysis.js`), the job-description analyzer state (`jobDescription`, `jdAnalysis`, `jdInsights`), per-suggestion Accept/Reject/Complete status (`suggestionStatus`), a saved comparison baseline (`previousSnapshot`), and lightweight analytics counters (`history`, `totalAiGenerations`, `totalResumeEdits`). Registered in `store/index.js` alongside `resume`/`ai`; only the lightweight fields persist to `localStorage` (analysis/loading state recomputes fresh on load).

### Dashboard pages

All pages below share `components/Ats/DashboardNav.js` for sub-navigation and pull data from `useAtsAnalysis()` (cached, resume-hash-gated) rather than recomputing analysis themselves:

- `/dashboard` — resume list (Overview), now with the dashboard sub-nav.
- `/dashboard/analytics` — full Resume Quality Dashboard: ATS score ring, grade, completion %, readability, grammar score, keyword coverage, recruiter impression, word count, last-analyzed timestamp, resume strength meter, section score bars + radar chart, section intelligence, missing sections, weak/strong bullets, insights, recruiter preview summary, job description analyzer, keyword intelligence, resume comparison, ATS score history / completion trend charts, and AI usage statistics.
- `/dashboard/job-match` — dedicated Job Description Analyzer UI using the existing `jobMatch` and `jdInsights` OpenRouter-backed routes (match %, matched/missing keywords, recommended skills/projects/certifications/changes).
- `/dashboard/keywords` — Keyword Dashboard (top resume keywords with a distribution chart, matched/missing keywords against the last analyzed job description, overused/duplicate keywords, unused skills, suggested industry keywords).
- `/dashboard/recruiter` — Recruiter Preview page (reading time, visual hierarchy score, first impression, important sections, missing recruiter info, recruiter/industry/ATS tips).
- `/dashboard/comparison` — Resume Comparison page (current vs. a saved baseline snapshot: added/removed skills & keywords, ATS score difference, improvement %, per-section score deltas).
- `/improvements` — Improvement Center: recommendations grouped into Critical/High/Medium/Low with per-suggestion Accept/Reject/Mark Complete, counts shown per priority filter, status persisted in Redux.

### Charts

`components/Ats/charts/*` use [Recharts](https://recharts.org/) (`AtsHistoryChart`, `CompletionTrendChart`, `SectionRadarChart`, `KeywordDistributionChart`) and are lazy-loaded per page via `next/dynamic({ ssr: false })` with a skeleton fallback (`components/Ats/Skeleton.js`), since chart rendering only makes sense client-side and shouldn't block the initial page load.

### Performance

`useAtsAnalysis` hashes the resume object and only re-runs `runAtsAnalysis` when the content actually changes, caching the result in Redux so every dashboard page reads the same cached analysis instead of recomputing it. Expensive list-rendering subcomponents (section score bars, section intelligence list, suggestion rows) are wrapped in `React.memo`.

## Deployment

The app is a standard Next.js project and deploys cleanly to [Vercel](https://vercel.com/) (recommended) or any Node.js host that supports `next build` / `next start`. Set the `NEXT_PUBLIC_FIREBASE_*` environment variables in your hosting provider's dashboard for Phase 3 auth/cloud features to work in production; the Google Analytics ID is currently hardcoded in `app/layout.js`.

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for setup instructions, coding standards, and PR guidelines, and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## Security

Found a vulnerability? Please see [SECURITY.md](SECURITY.md) for responsible disclosure instructions instead of opening a public issue.

## Acknowledgements

- Built and maintained by [Shanidhya Kumar](https://github.com/Shanidhya01).
- Thanks to all [contributors](https://github.com/Shanidhya01/Resume-Builder/graphs/contributors) who have helped improve this project.
- Built with [Next.js](https://nextjs.org/), [React](https://react.dev/), [Redux Toolkit](https://redux-toolkit.js.org/), and [react-pdf](https://react-pdf.org/).

## License

This project is licensed under the [MIT License](LICENSE).

---

> Made with ❤️ by [Shanidhya Kumar](https://github.com/Shanidhya01)

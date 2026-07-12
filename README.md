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

## Deployment

The app is a standard Next.js project and deploys cleanly to [Vercel](https://vercel.com/) (recommended) or any Node.js host that supports `next build` / `next start`. No environment variables are required for the core app; the Google Analytics ID is currently hardcoded in `app/layout.js`.

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

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

- **Live editor with instant PDF preview** — edit contact info, summary, education, experience, projects, skills, certificates, and languages, with the PDF preview panel updating on save.
- **Auto-save** — resume data is persisted to `localStorage` (debounced) and restored on your next visit, with schema validation so corrupted or stale data never crashes the app.
- **PDF export** — download your resume as a PDF, generated client-side with `@react-pdf/renderer`.
- **Templates gallery** (`/templates`) — browse a set of template previews. Selecting one currently links back to the editor; template switching does not yet change the generated PDF layout (tracked in the [roadmap](#roadmap)).
- **Resilient routing** — invalid editor tab query params fall back to a sensible default instead of crashing; unknown routes show a proper 404 page; unexpected errors are caught by React error boundaries instead of a blank screen.
- **Responsive, accessible UI** — built with Tailwind CSS, with `aria-label`s on icon-only controls and keyboard-reachable interactive elements.

> Not yet implemented: HTML export, multiple selectable resume templates, and user accounts/cloud sync. See the [Roadmap](#roadmap).

## Architecture

```
┌──────────────┐      ┌──────────────────┐      ┌────────────────────┐
│  Editor UI   │ ───► │  Redux store      │ ───► │  localStorage       │
│ (Tabs/Input) │ ◄─── │ (resumeSlice)     │ ◄─── │ (debounced persist) │
└──────────────┘      └──────────────────┘      └────────────────────┘
        │
        ▼
┌────────────────────┐
│ PDF Document tree   │  components/Resume/pdf/*
│ (@react-pdf/renderer)│
└────────────────────┘
        │
        ▼
┌────────────────────┐
│ Live PDF Preview     │  components/Resume/Preview.js (react-pdf viewer)
│ + Download button    │
└────────────────────┘
```

- **State**: a single Redux slice (`store/slices/resumeSlice.js`) holds the entire resume document. Every field edit dispatches an action; the store is subscribed to persist to `localStorage` on change.
- **Rendering**: the same resume state drives a `@react-pdf/renderer` document tree (`components/Resume/pdf/`), which is rendered to a blob URL and displayed with `react-pdf`'s `<Document>`/`<Page>` viewer.
- **Routing**: Next.js App Router (`app/`) with route groups for the home page, and dedicated routes for `/editor`, `/templates`, and `/about`.

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
  templates/               Template gallery
  error.js, not-found.js  Error boundary & 404 page
components/
  Editor/                 Editor shell, single-field & repeatable-field editors
  Resume/
    pdf/                    react-pdf document tree used for preview & export
    Preview.js              Live PDF preview panel + download/preview actions
  UI/                     Reusable form inputs
  Header.js, Tabs.js      Navigation
config/
  ResumeFields.js         Declarative field schema per resume section
store/
  index.js                Redux store + localStorage persistence
  slices/resumeSlice.js   Resume state reducers
utils/
  formatDate.js           Date formatting helper used in the PDF
```

## Roadmap

- [ ] Wire up the templates gallery so selecting a template actually changes the generated resume layout.
- [ ] Add automated tests (unit tests for reducers/utils, component tests for the editor).
- [ ] Add a TypeScript migration path for stronger type safety.
- [ ] Add CI (lint + build) via GitHub Actions.
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

# Contributing to HireReady (Resume Builder)

Thanks for your interest in contributing! This document covers how to set up the project, coding standards, and how to submit changes.

## Getting Started

1. Fork the repository and clone your fork:
   ```bash
   git clone https://github.com/<your-username>/Resume-Builder.git
   cd Resume-Builder
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000).

## Project Structure

See the [README](README.md#project-structure) for an overview of `app/`, `components/`, `store/`, `config/`, and `utils/`.

## Coding Standards

- This project uses **Prettier** (see `.prettierrc`) for formatting and Next.js's built-in ESLint config (`npm run lint`) for linting. Run both before committing.
- Prefer function components with hooks; avoid class components.
- Keep components focused — extract reusable UI into `components/UI/`.
- Avoid introducing new state-management patterns; use the existing Redux Toolkit slice in `store/slices/resumeSlice.js`.
- Don't leave `console.log`/debug statements in committed code. Use `console.warn`/`console.error` sparingly, and only for genuine failure paths.
- Add `aria-label`s to icon-only interactive elements.
- Do not commit generated build output (`.next/`) or environment files.

## Commit Message Conventions

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(optional scope): <short summary>

[optional body]
```

Common types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`.

Examples:
- `fix(editor): guard against invalid tab query param`
- `feat(templates): add two-column resume template`
- `docs(readme): update installation instructions`

## Pull Request Guidelines

1. Create a feature branch off `main`: `git checkout -b feat/short-description`.
2. Keep PRs focused — one logical change per PR.
3. Ensure `npm run lint` and `npm run build` pass locally.
4. Fill out the PR template, describing what changed and why.
5. Link any related issues (`Closes #123`).
6. Be responsive to review feedback — small follow-up commits are fine.

## Reporting Issues

- Search existing issues before opening a new one.
- Use the provided issue templates (Bug Report / Feature Request / Question) under `.github/ISSUE_TEMPLATE/`.
- For bug reports, include steps to reproduce, expected vs. actual behavior, and your browser/OS.
- For security vulnerabilities, follow [SECURITY.md](SECURITY.md) instead of opening a public issue.

## Code of Conduct

By participating in this project, you agree to abide by the [Code of Conduct](CODE_OF_CONDUCT.md).

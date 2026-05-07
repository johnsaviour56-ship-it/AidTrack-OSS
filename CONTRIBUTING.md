# Contributing to AidTrack OSS

Thank you for your interest in contributing! AidTrack OSS is designed to be beginner-friendly and welcomes contributions of all sizes.

---

## Getting Started

### 1. Fork and clone

```bash
git clone https://github.com/your-username/AidTrack-OSS.git
cd AidTrack-OSS
```

### 2. Set up locally

Follow the [local setup instructions in the README](./README.md#local-setup).

### 3. Find something to work on

- Browse [open issues](../../issues)
- Issues labeled [`good first issue`](../../issues?q=label%3A%22good+first+issue%22) are a great starting point
- Comment on an issue to claim it before starting work

---

## Development Workflow

### Branch naming

Use descriptive branch names:

```
feat/search-beneficiaries
fix/attendance-timestamp-bug
docs/update-contributing
chore/upgrade-dependencies
```

### Making changes

1. Create a branch from `main`
2. Make your changes — keep them focused and small
3. Test your changes locally (`npm run dev`)
4. Run the linter: `npm run lint`
5. Open a pull request

### Pull request guidelines

- Keep PRs small and focused on a single change
- Write a clear description of what you changed and why
- Reference the issue number if applicable (e.g. `Closes #12`)
- Screenshots are helpful for UI changes

---

## Coding Conventions

- **TypeScript** — all new files should be `.ts` or `.tsx`
- **Formatting** — run `npm run format` before committing (uses Prettier)
- **Components** — place reusable UI components in `/components`
- **Pages** — use Next.js App Router conventions in `/app`
- **Keep it simple** — prefer readable code over clever abstractions
- **Comments** — add comments where the intent isn't obvious

---

## What We're Looking For

Good contributions include:

- Bug fixes
- UI improvements and accessibility fixes
- New features from the [roadmap](./ROADMAP.md)
- Documentation improvements
- Test coverage
- Performance improvements

Please avoid:

- Large refactors without prior discussion
- Adding new dependencies without a clear reason
- Changes that break existing functionality

---

## Questions?

Open a [GitHub Discussion](../../discussions) or comment on the relevant issue. We're happy to help.

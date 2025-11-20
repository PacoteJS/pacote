# Repository Guidelines

## Project Structure & Module Organization
The repo is a pnpm-managed monorepo. Reusable libraries live under `packages/<name>` with TypeScript sources in `src/` and matching Vitest specs in `test/`. When adding files, keep entry points in `src/index.ts` exporting the public surface. Shared tooling sits in the root (`tsconfig.json`, `vitest.config.mts`, `biome.json`). Scaffolding templates live in `templates/`, and `plopfile.js` drives generators for new packages.

## Build, Test, and Development Commands
- `pnpm install` keeps workspace dependencies in sync.
- `pnpm build` delegates to `lerna run build` to produce CJS and ESM artifacts.
- `pnpm build:docs` generates API documentation via TypeDoc.
- `pnpm lint` runs Biome lint rules; `pnpm format` applies autofixes.
- `pnpm test` executes linting then Vitest; use during local development.
- `pnpm test:coverage` produces a coverage report with V8 instrumentation.
- `pnpm plop` launches the scaffolder for new package boilerplate.

## Coding Style & Naming Conventions
TypeScript is the default; keep modules ESM-first with named exports. Biome enforces two-space indentation, single quotes, trailing commas, and semicolons only when required. Align filenames with their exported symbols (`range.ts` → `range`). Tests use `*.spec.ts`. Prefer pure functions and immutable data structures to stay consistent with existing packages.

## Testing Guidelines
Always adopt test-driven development, following the red-green-refactor cycle. Only exercise the components publicly exposed by the module when testing, and do not couple tests to internal implementation details. Vitest drives unit tests. Place specs under `test/` mirroring `src/` paths and use descriptive `describe` blocks. Property-based checks with `fast-check` are encouraged where meaningful, and `msw` is available for network mocks. If necessary, verify coverage locally with `pnpm test:coverage`.

## Commit & Pull Request Guidelines
Follow Conventional Commits; `pnpm commit` invokes Commitizen under `@commitlint/config-conventional`. Describe behaviour changes as new features or patches as appropriate. Breaking changes should be described in the commit body following Conventional Commit format. PRs should link issues and summarise package-level impact. Run `pnpm lint` and `pnpm test` before opening a PR. Include screenshots or API snippets when adjustments affect consumers.

## Security & Release Notes
Avoid checking secrets into templates or generators. Releases run through `pnpm release` (Lerna publish), so keep semver changes scoped to the packages you touch and document compatibility notes in the PR.

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Next.js version warning

This is Next.js 16 with breaking changes versus older versions. Before writing code, read the relevant guide in `node_modules/next/dist/docs/` and heed deprecation notices (see `AGENTS.md`). `next.config.ts` enables `cacheComponents` and `partialPrefetching`, which change caching/rendering semantics — check the docs before writing any data fetching.

## Commands

- `npm run dev` / `npm run build` / `npm run lint` (runs `eslint` with no path argument)
- No test script and no typecheck script. Typecheck with `npx tsc --noEmit`.

## Conventions

- The `@/*` import alias maps to the repo root (`./*`), not `src/`.
- Tailwind v4 via `@tailwindcss/turbopack` (configured in `next.config.ts`).
- Use Conventional Commits (`feat:`, `fix:`, `chore:`, ...).
- Write code, comments and UI text in English.

# System Patterns & Conventions: roo-rocket--mono

This document details the established architectural patterns, technology choices, and coding conventions used within the `roo-rocket--mono` project.

## 1. Architectural Patterns

*   **Monorepo Management:** `pnpm` workspaces and `Turborepo` for build/task orchestration.

## 2. Technology Choices & Key Libraries

*   **Monorepo/Build:** pnpm, Turborepo, TypeScript, ESLint (`@antfu/eslint-config`), `simple-git-hooks`, `lint-staged`.
*   **Environment:** 
    * Uses `dotenvx` to load `.env` files.
    * Common env files are not ignored by git (e.g: `.env`), ignore pattern is `.env.*.ignored`
    * MUST define local secrets in `.env.local.ignored` if `.env.local` is used.

## 3. Code Organization & Conventions

*   **Shared Packages (`locals/`):** Organized by scope (`tsconfig`).
*   **Language:** TypeScript used throughout.
*   **Modules:** ES Modules (`"type": "module"`) used project-wide.
*   **Type Safety:** High emphasis via TypeScript, shared types, and runtime validation (ArkType).
*   **Linting/Formatting:** Enforced by ESLint (`@antfu/eslint-config`) via config files and pre-commit hooks. Includes automatic import sorting.
*   **Configuration:** Heavy reliance on configuration files (`turbo.json`, `sst.config.ts`, `nuxt.config.ts`, etc.).
*   **AI Development:** Setup for Roo Code AI Agent, including prompting rules (`.roo/`, `.roomodes`) and Memory Bank (`memory-bank/`).
*   **Caching:** Turborepo Remote Caching can be enabled via `npx turbo login` and `npx turbo link`.

# Product Context: roo-rocket--mono

This document outlines the high-level description, goals, features, and overall architecture of the `roo-rocket--mono` project.

## 1. Project Description & Goal

### Initial description:

#### A monorepo for:

***Roo Rocket**, the all-in-one equipment that you and Roo wants!"*

It's a one-for-all (meaning, usable in collaborated projects) config setup for that aims to provide the complete (opionated) setup for anyone to start using **`Roo Code`**.

## 2. Overall Architecture

*   **Monorepo:** Utilizes `pnpm` workspaces (`apps/*`, `locals/*`) and `Turborepo` for task orchestration.
*   **Environment Management:** Uses `.env` files per application managed via `dotenvx`.

## 3. Key Components

### 3.1. Shared Code (`locals/`)

*   **`@local/tsconfig`:** Shared TypeScript configurations.

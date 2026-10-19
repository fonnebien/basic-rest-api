# basic-rest-api

Personal REST API playground (Hono + TypeScript) for practising backend best practices.

## Docs

- Keep `README.md` minimal: description, quick start, links to `docs/`. Do not grow it.
- Put detail in `docs/`: `tech-stack.md`, `architecture.md`, `api.md`, `development.md`.
- When changing endpoints, project structure, scripts or dependencies, update the matching doc in the same change.

## Architecture

- Clean Architecture: dependencies point inward. `src/domain/` must not import Hono, JSON data files or any infrastructure code.
- Endpoints live in `src/api/v1/endpoints/`, one file per resource; business logic belongs in `src/domain/services/`.
- Errors use the typed structures in `src/domain/errors/api-error.types.ts` and are handled by `src/middleware/error-handler.middleware.ts`.
- Validate input with Zod schemas.

## Tooling

- pnpm only (no npm/yarn).
- ESLint + Prettier. Biome was removed deliberately; do not reintroduce it.
- Before finishing a change, run `pnpm lint:check`, `pnpm format:check` and `pnpm build`.
- Jest is configured but there are no tests yet; add tests alongside new logic where sensible.

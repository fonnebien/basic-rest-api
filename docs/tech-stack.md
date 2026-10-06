# Tech Stack

- **Runtime** — [Node.js](https://nodejs.org) (version managed via `.nvmrc`)
- **Framework** — [Hono](https://hono.dev)
- **Server** — [@hono/node-server](https://github.com/honojs/node-server)
- **Language** — TypeScript (run in development with [tsx](https://tsx.is))
- **Validation** — [Zod](https://zod.dev) via `@hono/zod-validator` / `@hono/standard-validator`
- **Logging** — [Pino](https://getpino.io) (`pino-pretty` for readable dev output)
- **Testing** — [Jest](https://jestjs.io) with ts-jest
- **Package Manager** — pnpm (workspace setup)
- **Linting** — ESLint (flat config, `typescript-eslint`, `eslint-plugin-import`)
- **Formatting** — Prettier

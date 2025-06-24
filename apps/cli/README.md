# `tvi` cli

A CLI tool for scaffolding end-to-end type-safe TypeScript projects with best practices and customizable configurations.

## Quick Start

Run without installing globally:

```bash
# Using npm
npx tvi-cli@latest

# Using bun
bun create tvi@latest

# Using pnpm
pnpm create tvi@latest
```

Follow the prompts to configure your project or use the `--yes` flag for defaults.

## Features

| Category                 | Options                                                                                                                                                                                                                                                    |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **TypeScript**           | End-to-end type safety across all parts of your application                                                                                                                                                                                                |
| **Frontend**             | • React with TanStack Router<br>• React with React Router<br>• React with TanStack Start (SSR)<br>• Next.js<br>• SvelteKit<br>• Nuxt (Vue)<br>• SolidJS<br>• React Native with NativeWind (via Expo)<br>• React Native with Unistyles (via Expo)<br>• None |
| **Backend**              | • Hono<br>• Express<br>• Elysia<br>• Next.js API routes<br>• Convex<br>• Fastify<br>• None                                                                                                                                                                              |
| **API Layer**            | • tRPC (type-safe APIs)<br>• oRPC (OpenAPI-compatible type-safe APIs)<br>• None                                                                                                                                                                            |
| **Runtime**              | • Bun<br>• Node.js                                                                                                                                                                                                                                         |
| **Database**             | • SQLite<br>• PostgreSQL<br>• MySQL<br>• MongoDB<br>• None                                                                                                                                                                                                 |
| **ORM**                  | • Drizzle (TypeScript-first)<br>• Prisma (feature-rich)<br>• Mongoose (for MongoDB)<br>• None                                                                                                                                                              |
| **Database Setup**       | • Turso (SQLite)<br>• Neon (PostgreSQL)<br>• Prisma Postgres (via Prisma Accelerate)<br>• MongoDB Atlas<br>• None (manual setup)                                                                                                                           |
| **Authentication**       | Better-Auth (email/password, with more options coming soon)                                                                                                                                                                                                |
| **Styling**              | Tailwind CSS with shadcn/ui components                                                                                                                                                                                                                     |
| **Addons**               | • PWA support<br>• Tauri (desktop applications)<br>• Starlight (documentation site)<br>• Biome (linting and formatting)<br>• Husky (Git hooks)<br>• Turborepo (optimized builds)                                                                           |
| **Examples**             | • Todo app<br>• AI Chat interface (using Vercel AI SDK)                                                                                                                                                                                                    |
| **Developer Experience** | • Automatic Git initialization<br>• Package manager choice (npm, pnpm, bun)<br>• Automatic dependency installation                                                                                                                                         |

## Usage

```bash
Usage: tvi [project-directory] [options]

Options:
  -V, --version                   Output the version number
  -y, --yes                       Use default configuration
  --database <type>               Database type (none, sqlite, postgres, mysql, mongodb)
  --orm <type>                    ORM type (none, drizzle, prisma, mongoose)
  --auth                          Include authentication
  --no-auth                       Exclude authentication
  --frontend <types...>           Frontend types (tanstack-router, react-router, tanstack-start, next, nuxt, svelte, solid, native-nativewind, native-unistyles, none)
  --addons <types...>             Additional addons (pwa, tauri, starlight, biome, husky, turborepo, none)
  --examples <types...>           Examples to include (todo, ai, none)
  --git                           Initialize git repository
  --no-git                        Skip git initialization
  --package-manager <pm>          Package manager (npm, pnpm, bun)
  --install                       Install dependencies
  --no-install                    Skip installing dependencies
  --db-setup <setup>              Database setup (turso, neon, prisma-postgres, mongodb-atlas, none)
  --backend <framework>           Backend framework (hono, express, elysia, next, convex, fastify, none)
  --runtime <runtime>             Runtime (bun, node, none)
  --api <type>                    API type (trpc, orpc, none)
  -h, --help                      Display help
```

## Examples

Create a project with default configuration:

```bash
npx tvi-cli my-app --yes
```

Create a project with specific options:

```bash
npx tvi-cli my-app --database postgres --orm drizzle --auth --addons pwa biome
```

Create a project with Elysia backend and Node.js runtime:

```bash
npx tvi-cli my-app --backend elysia --runtime node
```

Create a project with multiple frontend options:

```bash
npx tvi-cli my-app --frontend tanstack-router native
```

Create a project with examples:

```bash
npx tvi-cli my-app --examples todo ai
```

Create a project with Turso database setup:

```bash
npx tvi-cli my-app --database sqlite --orm drizzle --db-setup turso
```

Create a project with Convex backend:

```bash
npx tvi-cli my-app --backend convex --frontend tanstack-router
```

Create a project with documentation site:

```bash
npx tvi-cli my-app --addons starlight
```

## Compatibility Notes

- **Convex backend**: Automatically disables authentication, database, ORM, and API options
- **Backend 'none'**: If selected, this option will force related options like API, ORM, database, authentication, and runtime to 'none'. Examples will also be disabled (set to none/empty).
- **SvelteKit, Nuxt, and SolidJS** frontends are only compatible with oRPC API layer
- **PWA support** requires React with TanStack Router, React Router, or SolidJS
- **Tauri desktop app** requires React (TanStack Router/React Router), Nuxt, SvelteKit, or SolidJS
- **AI example** is not compatible with Elysia backend or SolidJS frontend

## Project Structure

The created project follows a clean monorepo structure:

```tree
my-tvi-app/
├── apps/
│   ├── web/          # Frontend application
│   ├── server/       # Backend API
│   ├── native/       # (optional) Mobile application
│   └── docs/         # (optional) Documentation site
├── packages/         # Shared packages
└── README.md         # Auto-generated project documentation
```

After project creation, you'll receive detailed instructions for next steps and additional setup requirements.

# tvi

A CLI tool for scaffolding end-to-end type-safe TypeScript projects with best practices and customizable configurations

## Quick Start

```bash
# Using npm
npx tvi-cli@latest

# Using bun
bun create tvi@latest

# Using pnpm
pnpm create tvi@latest
```

## Features

- **Zero-config setup** with interactive CLI wizard
- **End-to-end type safety** from database to frontend via tRPC
- **Modern stack** with React, Hono/Elysia, and TanStack libraries
- **Multi-platform** supporting web, mobile (Expo), and desktop applications
- **Database flexibility** with SQLite (Turso) or PostgreSQL options
- **ORM choice** between Drizzle or Prisma
- **Built-in authentication** with Better-Auth
- **Optional PWA support** for installable web applications
- **Desktop app capabilities** with Tauri integration
- **Monorepo architecture** powered by Turborepo

## Repository Structure

- **CLI**: [`tvi`](apps/cli) - A TypeScript Scaffolding CLI tool

## Development

```bash
# Clone the repository
git clone https://github.com/shaneholloman/tvi.git

# Install dependencies
bun install

# Start CLI development
bun dev:cli
```

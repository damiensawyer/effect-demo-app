# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Effect HTTP Server demo application showcasing modern functional programming patterns in TypeScript. The codebase demonstrates domain-driven design with the Effect ecosystem, featuring clean architecture, type-safe database operations, and comprehensive observability.

## Essential Commands

### Development
- `pnpm dev` - Start development server with hot reload
- `pnpm test` - Run test suite with Vitest
- `pnpm check` - TypeScript compilation check
- `pnpm lint` - Run ESLint with Effect-specific rules

### Environment
- `nix develop` - Enter Nix development shell (recommended)
- The application runs on port 3000, Grafana on port 4000

## Architecture

### Core Structure
The application follows clean architecture with three main bounded contexts:
- **Accounts** (`/src/Accounts/`) - User account management
- **Groups** (`/src/Groups/`) - Group/team management  
- **People** (`/src/People/`) - Person profile management

Each context contains:
- `Api.ts` - HTTP API definition
- `Http.ts` - HTTP handlers
- `Repository.ts` - Data access layer
- `Policy.ts` - Authorization logic

### Key Files
- `src/main.ts` - Application entry point and layer composition
- `src/Http.ts` - HTTP server setup with middleware
- `src/Api.ts` - Combined API from all contexts
- `src/Sql.ts` - Database client and migration runner
- `src/Domain/` - Pure domain models and schemas

## Effect Framework Patterns

This codebase extensively uses Effect's functional programming patterns:

### Layer System
- Services are composed using Effect's Layer system
- Dependencies are injected through layers, not constructor injection
- Test layers mock real implementations

### Effect.gen Syntax
```typescript
const program = Effect.gen(function*() {
  const service = yield* MyService
  const result = yield* service.doSomething()
  return result
})
```

### Schema & Model
- Domain entities extend `Model.Class` for immutability
- All data validation uses Effect's Schema library
- Branded types for IDs (e.g., `AccountId`, `UserId`)

### Error Handling
- Errors are represented as Effect types, not thrown exceptions
- Use `Effect.catchTag` for specific error handling

## Database

- SQLite with Effect SQL for type-safe operations
- Migrations in `/src/migrations/` with format `XXXXX_description.ts`
- Automatic migration on startup
- Database files stored in `/data/`

## Testing

- Uses `@effect/vitest` for Effect-compatible testing
- Test layers provide mock implementations
- Pattern: Create test-specific layers that replace real services
- Tests use Effect.gen syntax for async operations

## Development Notes

- TypeScript strict mode with Effect language service plugin
- Path aliases: `app/*` maps to `src/*.js`
- ES modules with Node.js target
- pnpm as package manager (v9.10.0)
- OpenTelemetry tracing with Honeycomb integration

## Adding New Features

1. Create new bounded context directory under `/src/`
2. Implement the four core modules: Api, Http, Repository, Policy
3. Add domain models to `/src/Domain/`
4. Create database migrations if needed
5. Compose new layers in `main.ts`
6. Add tests with appropriate test layers
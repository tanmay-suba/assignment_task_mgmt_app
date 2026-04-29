# Task Management App

A focused task manager that highlights priorities, makes quick edits frictionless, and demonstrates clean layering across Angular, .NET, and Postgres.

## Stack and Architecture

- Frontend: Angular 17 (standalone components, signals, Angular Material)
- Backend: .NET 8 Web API (Domain / Application / Infrastructure / API)
- Database: PostgreSQL

Architecture split:
- Domain: entity and enums only
- Application: DTOs, validation, and task service
- Infrastructure: EF Core DbContext and seeding
- API: controllers, DI, CORS, Swagger, Problem Details

## Run It

### Prereqs
- Node 20+
- .NET 8 SDK
- Docker (for Postgres and optional compose)

### Local (recommended for dev)

```bash
docker compose up -d postgres
```

```bash
dotnet run --project backend/TaskApp.Api
```

```bash
cd frontend
npm start
```

- API: http://localhost:5050
- Swagger: http://localhost:5050/swagger
- Web: http://localhost:4200

Demo tasks are seeded automatically on first run.

### Full Compose (API + Web + Postgres)

```bash
docker compose up --build
```

- Web: http://localhost:8080
- API: http://localhost:5050

## API Overview

```
GET    /api/tasks?status=&priority=&search=&dueBefore=&sort=&page=&pageSize=
POST   /api/tasks
PUT    /api/tasks/{id}
PATCH  /api/tasks/{id}/complete    body: { "isComplete": true | false }
DELETE /api/tasks/{id}
```

The `/complete` endpoint accepts a JSON body to support both completing and un-completing a task (toggle). Sending no body returns 415.

## UX Highlights

- Optimistic complete toggle and delete
- Inline title editing from the list
- Filter chips, debounced search, due date filter
- Empty state and skeleton loaders
- Keyboard shortcuts: n (new), / (search)
- Overdue highlighting and visual priority cues

## Design Decisions and Trade-offs

- Chose Angular Material for speed, accessibility, and consistency.
- Avoided full CQRS and MediatR to keep the stack light and readable for a small app.
- Server-side filtering/sorting keeps logic centralized and scalable.
- No authentication in v1 to keep scope tight.

## Assumptions

- Single-user, local-only usage
- No auth or multi-tenant needs
- No tags, sub-tasks, or attachments in v1

## AI Tooling

- GitHub Copilot (GPT-5.2-Codex) assisted with scaffolding the layered .NET solution, shaping DTOs/services, and drafting Angular components and styling.
- Claude Code (claude.ai/code) was used for submission testing: running the full build pipeline (`dotnet build`, `dotnet test`, `npm run build`), standing up the Docker stack from a cold start, and smoke-testing every API endpoint end-to-end.
- I reviewed, refactored, and adjusted outputs for architecture alignment, UX requirements, and runtime correctness.

## What I Would Do Next

- Add auth (JWT) and user-scoped tasks
- Add tags, drag-to-reorder, and activity history
- Real-time updates via SignalR
- CI pipeline with linting, tests, and container builds

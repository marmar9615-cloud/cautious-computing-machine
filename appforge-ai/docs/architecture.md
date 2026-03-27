# AppForge AI - Architecture Design Document

AppForge AI is a full-stack web and mobile application builder that generates complete, runnable applications from natural-language descriptions. Users provide a plain-text prompt describing the app they want, and AppForge AI produces a ready-to-run project with frontend, backend, and database code.

---

## System Architecture

AppForge AI is organized as a **monorepo** managed with npm workspaces. The three packages communicate through well-defined boundaries:

```
┌─────────────────────────────────────────────────────────┐
│                      Monorepo Root                      │
│                   (npm workspaces)                       │
│                                                         │
│  ┌───────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │  packages/     │  │  packages/   │  │  packages/   │ │
│  │  frontend      │  │  backend     │  │  mobile      │ │
│  │  (React/Vite)  │  │  (Express)   │  │  (Expo)      │ │
│  │  :5173         │  │  :3001       │  │              │ │
│  └───────┬────────┘  └──────┬───────┘  └──────┬───────┘ │
│          │                  │                  │         │
│          │   HTTP/JSON      │                  │         │
│          └─────────────────►│◄─────────────────┘         │
│                             │                            │
│                      ┌──────▼───────┐                    │
│                      │   SQLite DB  │                    │
│                      │  (via Prisma)│                    │
│                      └──────────────┘                    │
└─────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Frontend** (port 5173) - The React/TypeScript/Tailwind single-page application served by Vite. Users enter a natural-language description and view generated projects.
2. **Backend API** (port 3001) - The Express/TypeScript server that receives generation requests, runs the generation engine, persists results, and serves project data.
3. **SQLite DB** - A file-based database accessed through Prisma ORM. Stores project metadata and generated file contents.

The frontend communicates with the backend exclusively through JSON REST calls. The mobile app consumes the same backend API.

---

## API Design

All endpoints are prefixed with `/api`. Request and response bodies are JSON unless otherwise noted.

### POST /api/generate

Accepts a natural-language description and triggers the generation engine.

- **Request body**
  ```json
  {
    "description": "string"
  }
  ```
- **Response** (`201 Created`)
  ```json
  {
    "project": Project
  }
  ```
- **Behavior**: Creates a new Project record with status `"generating"`, runs the generation pipeline, updates status to `"completed"` (or `"failed"` on error), and returns the finished project.

### GET /api/projects

Returns all projects ordered by most recent first.

- **Response** (`200 OK`)
  ```json
  {
    "projects": Project[]
  }
  ```

### GET /api/projects/:id

Returns a single project by ID.

- **Response** (`200 OK`)
  ```json
  {
    "project": Project
  }
  ```
- **Error** (`404 Not Found`) if the project does not exist.

### GET /api/projects/:id/download

Streams the generated project as a zip archive.

- **Response** (`200 OK`) - binary zip file stream with header `Content-Type: application/zip`.
- **Error** (`404 Not Found`) if the project does not exist.

---

## Data Model

A single `Project` entity captures everything about a generated application.

```
Project {
  id          String    @id @default(cuid())
  name        String
  description String
  status      String    // "generating" | "completed" | "failed"
  files       String    // JSON-serialized array of { path: string, content: string }
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

### Field Notes

| Field       | Type     | Description                                                                 |
|-------------|----------|-----------------------------------------------------------------------------|
| id          | string   | CUID, globally unique identifier.                                           |
| name        | string   | Derived from the description by the generation engine.                      |
| description | string   | The original natural-language prompt provided by the user.                   |
| status      | string   | One of `"generating"`, `"completed"`, or `"failed"`.                        |
| files       | string   | JSON-encoded array of `{ path, content }` objects representing every file.  |
| createdAt   | DateTime | Timestamp of initial creation.                                              |
| updatedAt   | DateTime | Timestamp of last modification (auto-managed by Prisma).                    |

The `files` field stores a serialized JSON array rather than a relational child table. This keeps the schema simple and makes it trivial to zip all files for download.

---

## Component Hierarchy

### Frontend (React / TypeScript / Tailwind)

```
App (BrowserRouter)
└── Layout (Header + Nav)
    ├── HomePage
    │   └── PromptInput          # Text area + submit button for new generation
    ├── ProjectPage
    │   ├── FileTree             # Sidebar listing all generated files
    │   └── CodeViewer           # Syntax-highlighted display of selected file
    └── HistoryPage
        └── ProjectCard[]        # Cards showing name, status, date, actions
```

#### Component Responsibilities

| Component    | Responsibility                                                        |
|--------------|-----------------------------------------------------------------------|
| App          | Top-level router; defines routes for `/`, `/project/:id`, `/history`. |
| Layout       | Persistent shell with header, navigation links, and content outlet.   |
| HomePage     | Landing page; houses the `PromptInput` form.                          |
| PromptInput  | Controlled textarea; calls `POST /api/generate` on submit.            |
| ProjectPage  | Fetches a project by ID; renders file explorer and code viewer.       |
| FileTree     | Recursive tree built from the `files` array paths.                    |
| CodeViewer   | Displays the `content` of the currently selected file.                |
| HistoryPage  | Fetches all projects; renders a list of `ProjectCard` components.     |
| ProjectCard  | Shows project name, status badge, creation date, and action links.    |

---

## Generation Engine Architecture

The generation engine lives entirely in the backend and follows a four-stage pipeline:

```
User Prompt
    │
    ▼
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────────┐
│  Parser  │───►│ Selector │───►│ Composer │───►│ Orchestrator │
└──────────┘    └──────────┘    └──────────┘    └──────────────┘
                                                       │
                                                       ▼
                                                 GeneratedFile[]
```

### 1. Parser

Extracts structured intent from the natural-language description using keyword matching. The parser identifies:

- **App type** - one of: `todo`, `blog`, `ecommerce`, `dashboard`, `chat`, `landing`.
- **Features** - a list of detected capabilities (e.g., authentication, dark mode, search).

The parser scans the description for known keywords and phrases, scores each app type, and selects the best match.

### 2. Selector (Template Selection)

Each supported app type is backed by a **template module** that exports a function:

```ts
(options: TemplateOptions) => GeneratedFile[]
```

The selector maps the parser's app-type output to the corresponding template module.

Supported templates:

| Template    | Description                              |
|-------------|------------------------------------------|
| todo        | Task list with CRUD and completion state. |
| blog        | Post listing, detail view, markdown.      |
| ecommerce   | Product catalog, cart, checkout flow.     |
| dashboard   | Charts, stats cards, data tables.         |
| chat        | Message list, input, real-time feel.      |
| landing     | Hero, features, CTA, footer sections.     |

### 3. Composer

Merges a **base template** (shared boilerplate such as `package.json`, `index.html`, Tailwind config) with the **specific template** selected in the previous step. The composer also applies naming customizations derived from the original description (e.g., replacing placeholder app names).

### 4. Orchestrator

Coordinates the full pipeline in sequence:

1. **Parse** the user description.
2. **Select** the matching template.
3. **Compose** the final file set.
4. **Return** the `GeneratedFile[]` array to the calling route handler for persistence.

If any stage fails the orchestrator catches the error, marks the project status as `"failed"`, and propagates a meaningful error message.

---

## Technology Choices

| Technology        | Role                  | Rationale                                                                                          |
|-------------------|-----------------------|----------------------------------------------------------------------------------------------------|
| React 18          | Frontend UI           | Component-based architecture with a large ecosystem; widely adopted and well-documented.           |
| TypeScript        | Language (all packages) | Static typing catches errors at compile time and improves editor tooling across the monorepo.     |
| Tailwind CSS      | Styling               | Utility-first approach enables rapid UI development without context-switching to CSS files.        |
| Vite              | Frontend build tool   | Near-instant HMR and fast cold starts; native ESM support pairs well with React and TypeScript.    |
| Express           | Backend framework     | Minimal and flexible; provides just enough structure for a REST API without heavy abstractions.    |
| Prisma            | ORM                   | Type-safe database access with auto-generated client; schema-driven migrations keep the DB in sync.|
| SQLite            | Database              | Zero-configuration embedded database; ideal for a self-contained tool with moderate data volume.   |
| React Native/Expo | Mobile app            | Shares React knowledge with the frontend team; Expo simplifies builds and device testing.          |
| npm workspaces    | Monorepo management   | Built into npm; avoids extra tooling while enabling shared dependencies and cross-package scripts.  |
| Archiver (node)   | Zip generation        | Lightweight library for streaming zip creation used by the `/download` endpoint.                   |

---

## File / Folder Plan

```
appforge-ai/
├── package.json                        # Root workspace config and shared scripts
├── tsconfig.base.json                  # Shared TypeScript compiler options
├── .gitignore
├── docs/
│   └── architecture.md                 # This document
│
├── packages/
│   ├── frontend/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── vite.config.ts
│   │   ├── tailwind.config.ts
│   │   ├── postcss.config.js
│   │   ├── index.html
│   │   ├── public/
│   │   │   └── favicon.ico
│   │   └── src/
│   │       ├── main.tsx                # Entry point; mounts <App />
│   │       ├── App.tsx                 # Router setup
│   │       ├── index.css               # Tailwind directives
│   │       ├── components/
│   │       │   ├── Layout.tsx          # Header + Nav + Outlet
│   │       │   ├── PromptInput.tsx     # Generation form
│   │       │   ├── FileTree.tsx        # Sidebar file explorer
│   │       │   ├── CodeViewer.tsx      # Syntax-highlighted code display
│   │       │   └── ProjectCard.tsx     # Summary card for history list
│   │       ├── pages/
│   │       │   ├── HomePage.tsx
│   │       │   ├── ProjectPage.tsx
│   │       │   └── HistoryPage.tsx
│   │       └── lib/
│   │           └── api.ts              # Fetch wrappers for backend endpoints
│   │
│   ├── backend/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── prisma/
│   │   │   ├── schema.prisma           # Project model definition
│   │   │   └── migrations/             # Auto-generated migration files
│   │   └── src/
│   │       ├── index.ts                # Express server entry point
│   │       ├── routes/
│   │       │   └── projects.ts         # /api/generate, /api/projects, etc.
│   │       ├── engine/
│   │       │   ├── orchestrator.ts     # Pipeline coordinator
│   │       │   ├── parser.ts           # NL description → structured intent
│   │       │   ├── composer.ts         # Merges base + specific templates
│   │       │   └── templates/
│   │       │       ├── index.ts        # Template registry / selector
│   │       │       ├── base.ts         # Shared boilerplate files
│   │       │       ├── todo.ts
│   │       │       ├── blog.ts
│   │       │       ├── ecommerce.ts
│   │       │       ├── dashboard.ts
│   │       │       ├── chat.ts
│   │       │       └── landing.ts
│   │       └── lib/
│   │           ├── prisma.ts           # Prisma client singleton
│   │           └── zip.ts              # Archiver helper for downloads
│   │
│   └── mobile/
│       ├── package.json
│       ├── tsconfig.json
│       ├── app.json                    # Expo configuration
│       ├── App.tsx                     # Entry point
│       ├── babel.config.js
│       └── src/
│           ├── screens/
│           │   ├── HomeScreen.tsx
│           │   ├── ProjectScreen.tsx
│           │   └── HistoryScreen.tsx
│           ├── components/
│           │   ├── PromptInput.tsx
│           │   └── ProjectCard.tsx
│           └── lib/
│               └── api.ts              # Fetch wrappers (same contract as frontend)
```

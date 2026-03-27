# AppForge AI - Review Report

**Date:** 2026-03-27
**Reviewer:** Automated Code Review Agent

---

## 1. File Existence Check

### Backend (`packages/backend/src/`)

| Required File | Status |
|---|---|
| `index.ts` | Present |
| `routes/generate.ts` | Present |
| `routes/projects.ts` | Present |
| `engine/index.ts` | Present |
| `engine/parser.ts` | Present |
| `engine/composer.ts` | Present |
| `utils/zip.ts` | Present |

### Backend Templates (`packages/backend/src/engine/templates/`)

| Required File | Status |
|---|---|
| `base.ts` | Present |
| `todo.ts` | Present |
| `blog.ts` | Present |
| `ecommerce.ts` | Present |
| `dashboard.ts` | Present |
| `chat.ts` | Present |
| `landing.ts` | Present |

Note: There is no `templates/index.ts` file. The architecture doc specifies a "Template registry / selector" at `templates/index.ts`, but template selection is instead handled inline in `engine/index.ts` via a `templateGetters` record. This is a minor deviation from the architecture doc but functionally equivalent.

### Frontend (`packages/frontend/src/`)

| Required File | Status |
|---|---|
| `App.tsx` | Present |
| `pages/HomePage.tsx` | Present |
| `pages/ProjectPage.tsx` | Present |
| `pages/HistoryPage.tsx` | Present |
| `components/Layout.tsx` | Present |
| `components/PromptInput.tsx` | Present |
| `components/FileTree.tsx` | Present |
| `components/CodeViewer.tsx` | Present |
| `components/ProjectCard.tsx` | Present |
| `components/LoadingSpinner.tsx` | Present |

### Mobile (`packages/mobile/`)

| Required File | Status |
|---|---|
| `App.tsx` | Present |
| `src/screens/HomeScreen.tsx` | Present |
| `src/screens/ProjectScreen.tsx` | Present |
| `src/screens/HistoryScreen.tsx` | Present |
| `src/api/client.ts` | Present |

### Tests (`packages/backend/src/__tests__/`)

| Required File | Status |
|---|---|
| `parser.test.ts` | Present |
| `engine.test.ts` | Present |
| `routes.test.ts` | Present |

### Docs

| Required File | Status |
|---|---|
| `docs/requirements.md` | Present |
| `docs/architecture.md` | Present |
| `docs/ui-ux.md` | Present |

---

## 2. P0 Requirement Coverage

### P0-1: Natural language input

**Requirement:** A textarea where users describe their app idea in plain English.

| Criterion | Status | Notes |
|---|---|---|
| Textarea present on home page | PASS | `PromptInput.tsx` renders a `<textarea>` with placeholder text. |
| Free-form text input | PASS | No structural constraints on input beyond max length of 2000. |
| Sole interface for specifying app | PASS | No template selector UI; user types freely. |

### P0-2: Template-based code generation engine

**Requirement:** Parses user description using keyword matching, selects from predefined templates.

| Criterion | Status | Notes |
|---|---|---|
| Parser uses keyword matching | PASS | `parser.ts` defines `appTypeKeywords` and scans description against them. |
| Todo template | PASS | Keywords: `todo`, `task`, `checklist`. Template file exists and generates distinct CRUD components. |
| Blog template | PASS | Keywords: `blog`, `post`, `article`, `cms`. Template generates post listing, detail, and new post pages. |
| E-commerce template | PASS | Keywords: `shop`, `store`, `ecommerce`, `product`, `cart`. Template generates product catalog, cart, and checkout pages. |
| Dashboard template | PASS | Keywords: `dashboard`, `analytics`, `admin`, `metrics`. Template generates dashboard page with stats. |
| Chat template | PASS | Keywords: `chat`, `message`, `messenger`, `real-time`. Template generates chat page. |
| Landing page template | PASS | Default fallback when no keywords match. Template generates hero/features page. |
| Names/labels derived from description | PASS | `composer.ts` replaces `{{APP_NAME}}` placeholder; `parser.ts` extracts app name from description patterns. |

### P0-3: Project viewer

**Requirement:** In-browser viewer with file tree and syntax-highlighted code viewer.

| Criterion | Status | Notes |
|---|---|---|
| File tree displayed | PASS | `FileTree.tsx` builds recursive tree from file paths, with expand/collapse folders. |
| Syntax-highlighted code viewer | PASS | `CodeViewer.tsx` uses `highlight.js` with multiple language registrations and line numbers. |
| Click file to view contents | PASS | `onSelectFile` callback updates selected file; `ProjectPage.tsx` passes content to `CodeViewer`. |
| Split-pane layout | PASS | `ProjectPage.tsx` uses flex layout with 25%/75% split (FileTree at `w-64`, CodeViewer at `flex-1`). |

### P0-4: Project download

**Requirement:** Single-click action that bundles project into .zip file.

| Criterion | Status | Notes |
|---|---|---|
| Download button present | PASS | `ProjectPage.tsx` renders "Download ZIP" link pointing to `/api/projects/:id/download`. |
| Backend generates zip | PASS | `utils/zip.ts` uses `archiver` library to create zip buffer from file array. |
| Endpoint serves zip | PASS | `routes/projects.ts` `GET /projects/:id/download` sets `Content-Type: application/zip` and sends buffer. |

### P0-5: Project persistence

**Requirement:** Generated projects saved to SQLite database.

| Criterion | Status | Notes |
|---|---|---|
| SQLite database configured | PASS | Prisma schema uses `provider = "sqlite"` with `file:./dev.db`. |
| Project model with required fields | PASS | Schema has `id`, `name`, `description`, `status`, `files` (JSON string), `createdAt`, `updatedAt`. |
| Files stored as JSON blobs | PASS | `generate.ts` calls `JSON.stringify(generated.files)` before storing; `projects.ts` calls `JSON.parse`. |
| Projects survive page reloads | PASS | Data persisted to SQLite file on disk via Prisma. |

---

## 3. Acceptance Criteria Checklist

| # | Criterion | Status | Evidence |
|---|---|---|---|
| 1 | Home page displays textarea and "Generate" button | PASS | `PromptInput.tsx` renders `<textarea>` and `<button>Generate App</button>`. |
| 2 | Description < 10 chars shows validation error | FAIL | No minimum length validation exists. The backend rejects empty/missing descriptions but not short ones. The frontend only checks `description.trim()` is truthy (non-empty). The 10-character minimum is not enforced anywhere. |
| 3 | Valid description returns project within 2 seconds | PASS (by design) | Generation is synchronous template selection and string interpolation -- no AI/network calls. Should complete in milliseconds. |
| 4 | "todo"/"task" maps to todo template | PASS | `parser.ts` maps keywords `todo`, `task`, `checklist` to `todo` type. Test in `parser.test.ts` confirms. |
| 5 | "blog"/"article" maps to blog template | PASS | `parser.ts` maps `blog`, `post`, `article`, `cms`. Test confirms. |
| 6 | "shop"/"store"/"product" maps to ecommerce template | PASS | `parser.ts` maps `shop`, `store`, `ecommerce`, `product`, `cart`. Test confirms. |
| 7 | Project viewer renders file tree | PASS | `FileTree.tsx` builds and renders recursive tree. `ProjectPage.tsx` integrates it. |
| 8 | Clicking file shows syntax-highlighted contents | PASS | `CodeViewer.tsx` uses highlight.js; `ProjectPage.tsx` passes selected file content. |
| 9 | Download button produces valid .zip | PASS | `utils/zip.ts` creates zip via `archiver`; endpoint sets correct content-type. Route test confirms 200 with `application/zip`. |
| 10 | Downloaded zip has `package.json` at root | PASS | `base.ts` template includes `package.json` at path `package.json` (root level). All templates compose on top of base. |
| 11 | Projects persisted to SQLite, survive restart | PASS | Prisma + SQLite file storage. Projects created via `prisma.project.create()`. |
| 12 | History page lists projects in reverse chronological order | PASS | `routes/projects.ts` queries with `orderBy: { createdAt: 'desc' }`. `HistoryPage.tsx` renders the list. |
| 13 | Clicking history project opens project viewer | PASS | `ProjectCard.tsx` wraps entire card in `<Link to={/project/${project.id}}>`. |
| 14 | UI usable at 360px, 768px, 1440px without horizontal scroll | PARTIAL | Tailwind responsive classes used (e.g., `sm:`, `lg:` prefixes, responsive grid). File tree is hidden on mobile (`hidden sm:block`). However, no mobile menu/drawer mechanism exists on the ProjectPage for accessing the file tree on small screens -- it is simply hidden. |
| 15 | All interactive elements reachable via keyboard | PARTIAL | Standard HTML `<button>` and `<a>` elements are used (inherently focusable). However, no explicit `aria-` attributes, `role` attributes, or custom focus management are present. Focus indicators rely on Tailwind defaults (`focus:ring-2 focus:ring-primary-500` on textarea only). File tree items and nav links lack visible focus styles. |
| 16 | Express API rejects requests from disallowed origins | PASS | CORS configured in `index.ts` with explicit origin whitelist: `['http://localhost:5173', 'http://localhost:3000']`. |
| 17 | No generated file contains hardcoded secrets or API keys | PASS | Reviewed all template files; none contain secrets or API keys. |
| 18 | Dark mode toggle switches scheme, persists preference | FAIL | No dark mode toggle exists anywhere in the frontend. No localStorage persistence for theme preference. The app uses a fixed dark theme via Tailwind utility classes but has no toggle mechanism. |
| 19 | Each template produces distinct components, routes, and API endpoints | PASS | Each template generates unique page components, routes, and server endpoints (e.g., todo has CRUD operations, blog has posts/comments, ecommerce has products/cart/checkout, dashboard has stats, chat has messages). |
| 20 | API returns appropriate HTTP error codes (400, 404, 500) | PASS | 400 for missing/invalid description, 404 for missing project, 500 for server errors. Confirmed in code and route tests. |

---

## 4. P1 Requirement Coverage

| # | Requirement | Status | Notes |
|---|---|---|---|
| 6 | Project history page | PASS | `HistoryPage.tsx` lists all projects with name, description, status, date. Cards link to project viewer. |
| 7 | Templates with distinct features | PASS | Each template produces meaningfully different codebases with unique components, routes, and data models. |
| 8 | Responsive web design | PARTIAL | Responsive classes are used throughout. History page has 1/2/3 column responsive grid. However, ProjectPage file tree is completely hidden on mobile with no alternative access method. |

---

## 5. P2 Requirement Coverage

| # | Requirement | Status | Notes |
|---|---|---|---|
| 9 | Mobile app (React Native/Expo) | PASS | Full mobile app with HomeScreen, ProjectScreen (tabbed files/code view), HistoryScreen. Uses same API contract. |
| 10 | Dark mode support | FAIL | No dark mode toggle implemented. The web app uses a dark theme by default but provides no mechanism to switch between light and dark modes. |

---

## 6. Issues Summary

### Blocking Issues (FAIL)

1. **AC-2: No minimum length validation.** The acceptance criterion requires descriptions shorter than 10 characters to show a validation error. Neither the frontend nor the backend enforces this. The backend only rejects empty/missing descriptions.

2. **AC-18: No dark mode toggle.** The requirements specify a toggle that switches between light and dark color schemes with localStorage persistence. This feature is entirely absent.

### Non-Blocking Issues (PARTIAL)

3. **AC-14: Mobile responsiveness on ProjectPage.** The file tree is hidden on screens below `sm` (640px) breakpoint with `hidden sm:block`, but no alternative navigation (drawer, hamburger menu, or tab view) is provided to access it on mobile. Users on small screens cannot browse the file tree.

4. **AC-15: Keyboard accessibility.** While native HTML elements provide baseline keyboard access, there are no explicit ARIA attributes, no custom focus indicators on file tree items or navigation links, and no skip-navigation link. The requirements call for visible focus indicators and full keyboard operability.

5. **Architecture deviation: `templates/index.ts` missing.** The architecture document specifies a template registry at `engine/templates/index.ts`, but template selection logic is embedded in `engine/index.ts` instead.

6. **Generate endpoint returns 200 instead of 201.** The architecture document specifies `POST /api/generate` should return `201 Created`, but the implementation uses `res.json()` which defaults to 200.

7. **No `"generating"` intermediate status.** The architecture document describes creating a project with `status: "generating"` first, then updating to `"completed"`. The implementation skips this and creates directly as `"completed"`.

---

## 7. Coverage Summary

| Category | Total | Pass | Partial | Fail |
|---|---|---|---|---|
| P0 Requirements (1-5) | 5 | 5 | 0 | 0 |
| P1 Requirements (6-8) | 3 | 2 | 1 | 0 |
| P2 Requirements (9-10) | 2 | 1 | 0 | 1 |
| Acceptance Criteria (1-20) | 20 | 16 | 2 | 2 |
| Required Files | 31 | 31 | 0 | 0 |

**Overall:** All 31 required files are present and functional. 16 of 20 acceptance criteria fully pass. 2 are partially met (responsive layout on ProjectPage, keyboard accessibility). 2 are not met (minimum length validation, dark mode toggle).

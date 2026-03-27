# Product Requirements Document: AppForge AI

## Product Overview

AppForge AI is a full-stack web and mobile app builder MVP. Users describe an app idea in plain English, and the system generates a complete, downloadable project codebase. The generated output includes a React frontend, an Express backend, and an optional React Native mobile app. The goal is to eliminate boilerplate setup and let anyone go from idea to working project in seconds.

## Features (Prioritized)

### P0 - Must Have

1. **Natural language input** - A textarea where users describe their app idea in plain English. The input accepts free-form text and serves as the sole interface for specifying what the generated app should do.

2. **Template-based code generation engine** - Parses the user's description using keyword matching and heuristics, then selects from a set of predefined app templates. Supported templates:
   - Todo list
   - Blog
   - E-commerce storefront
   - Dashboard
   - Chat application
   - Landing page

   The engine populates the selected template with relevant names, labels, and structural choices derived from the description.

3. **Project viewer** - An in-browser viewer that displays the generated project as a file tree alongside a syntax-highlighted code viewer. Users can click any file in the tree to view its contents.

4. **Project download** - A single-click action that bundles the entire generated project into a `.zip` file and downloads it to the user's machine.

5. **Project persistence** - Generated projects are saved to a SQLite database so they survive page reloads and server restarts. Project files are stored as JSON blobs in the database.

### P1 - Should Have

6. **Project history page** - A dedicated page listing all previously generated projects with their name, description snippet, template type, and creation date. Users can click into any past project to view or re-download it.

7. **Multiple app templates with distinct features** - Each template produces a meaningfully different codebase (distinct routes, components, data models, and API endpoints) rather than superficial variations of the same scaffold.

8. **Responsive web design** - The web application is fully usable on screens ranging from mobile (360px) to desktop (1920px+).

### P2 - Nice to Have

9. **Mobile app (React Native/Expo)** - A companion mobile application built with React Native and Expo that provides the same core features: describe an app, view generated code, and download the project.

10. **Dark mode support** - A toggle that switches the UI between light and dark color schemes, with the preference persisted in local storage.

## User Stories

1. **As a user**, I want to type a plain-English description of an app so that I can generate a project without writing any code.

2. **As a user**, I want the system to automatically pick the best template for my description so that I do not have to understand the available templates myself.

3. **As a user**, I want to browse the generated project's file tree so that I can understand the structure before downloading.

4. **As a user**, I want to view any file's contents with syntax highlighting so that I can read the generated code comfortably.

5. **As a user**, I want to download the entire generated project as a zip file so that I can open it in my own editor and start working immediately.

6. **As a user**, I want my generated projects to be saved automatically so that I can return to them later without re-entering my description.

7. **As a user**, I want to see a history of all my previously generated projects so that I can revisit or re-download any of them.

8. **As a user**, I want the interface to work well on my phone so that I can generate a project from any device.

9. **As a user**, I want to switch to dark mode so that I can use the app comfortably in low-light environments.

10. **As a user**, I want generation to feel near-instant so that the tool does not interrupt my creative flow.

## Non-Functional Requirements

### Performance
- Project generation must complete in under 2 seconds from the moment the user submits their description.
- The project viewer must render the file tree and initial file contents within 500 milliseconds of generation completing.

### Storage
- SQLite is the database for the MVP. No external database service is required.
- Generated project files are stored as JSON in the database rather than written to the filesystem.
- The database schema must support future migration to a different storage backend without changing the API layer.

### Security
- All user input is validated and sanitized before processing.
- CORS is configured to allow only the expected frontend origin.
- No secrets, API keys, or credentials are included in generated project code or exposed to the client.
- Generated code does not execute on the server; it is only assembled and returned as text.

### Accessibility
- All pages use semantic HTML elements (nav, main, section, button, etc.).
- The full workflow is operable via keyboard navigation alone.
- Interactive elements have visible focus indicators.
- Color contrast ratios meet WCAG 2.1 AA standards.

## Acceptance Criteria Checklist

1. [ ] The home page displays a textarea input and a "Generate" button.
2. [ ] Submitting a description with fewer than 10 characters shows a validation error.
3. [ ] Submitting a valid description returns a generated project within 2 seconds.
4. [ ] The generation engine correctly maps a description mentioning "todo" or "task" to the todo template.
5. [ ] The generation engine correctly maps a description mentioning "blog" or "article" to the blog template.
6. [ ] The generation engine correctly maps a description mentioning "shop", "store", or "product" to the e-commerce template.
7. [ ] The project viewer renders a file tree showing all generated files and directories.
8. [ ] Clicking a file in the tree displays its contents with syntax highlighting in the code viewer.
9. [ ] Clicking the download button produces a valid `.zip` file containing all project files.
10. [ ] The downloaded zip extracts into a working project structure with a `package.json` at the root.
11. [ ] Generated projects are persisted to the SQLite database and survive a server restart.
12. [ ] The project history page lists all previously generated projects in reverse chronological order.
13. [ ] Clicking a project in the history page opens it in the project viewer.
14. [ ] The web UI is usable at viewport widths of 360px, 768px, and 1440px without horizontal scrolling.
15. [ ] All interactive elements (textarea, buttons, file tree nodes) are reachable and operable via keyboard.
16. [ ] The Express API rejects requests from disallowed origins when CORS is enabled.
17. [ ] No generated file contains hardcoded secrets or API keys.
18. [ ] The dark mode toggle switches the color scheme and persists the preference across page reloads.
19. [ ] Each app template produces a distinct set of components, routes, and API endpoints.
20. [ ] The API returns appropriate HTTP error codes (400, 404, 500) for invalid requests, missing resources, and server errors.

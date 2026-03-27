# AppForge AI - UI/UX Design Document

## Overview

AppForge AI is a web application builder where users describe an app in natural language and receive generated code. The frontend is built with React and Tailwind CSS. This document defines the visual design system, screen layouts, component specifications, and responsive behavior for both web and mobile platforms.

---

## Design System

### Color Palette

| Token            | Value     | Usage                                      |
| ---------------- | --------- | ------------------------------------------ |
| Primary          | `#3B82F6` | Buttons, links, active states, focus rings |
| Primary Hover    | `#2563EB` | Button hover, link hover                   |
| Background Dark  | `#0F172A` | Page background, main canvas               |
| Surface          | `#1E293B` | Cards, panels, sidebar, modals             |
| Surface Light    | `#334155` | Hover states on surfaces, borders          |
| Text Primary     | `#FFFFFF` | Headings, body text                        |
| Text Secondary   | `#94A3B8` | Placeholder text, labels, muted content    |
| Success          | `#22C55E` | Status badges, success notifications       |
| Success Muted    | `#166534` | Success badge backgrounds                  |
| Error            | `#EF4444` | Error states, destructive actions           |
| Warning          | `#F59E0B` | Warning badges, pending states             |
| Border           | `#334155` | Card borders, dividers, input outlines     |

### Typography

- **Font Family:** `Inter, ui-sans-serif, system-ui, -apple-system, sans-serif`
- **Headings:** Bold weight (700), tracking tight
- **Body:** Regular weight (400), 16px base size, 1.6 line height
- **Code:** `JetBrains Mono, Fira Code, ui-monospace, monospace`

| Element          | Size   | Weight | Color          |
| ---------------- | ------ | ------ | -------------- |
| Page Title (h1)  | 2.5rem | 700    | `#FFFFFF`      |
| Section Title (h2)| 1.5rem| 600    | `#FFFFFF`      |
| Body             | 1rem   | 400    | `#FFFFFF`      |
| Caption / Label  | 0.875rem| 400   | `#94A3B8`      |
| Code             | 0.875rem| 400   | mono, themed   |

### Visual Style

- **Theme:** Dark by default. Minimal chrome, generous whitespace.
- **Border Radius:** 8px for cards and buttons, 12px for larger containers, 6px for small elements like badges.
- **Shadows:** Subtle `0 1px 3px rgba(0,0,0,0.3)` on cards; stronger on modals.
- **Transitions:** 150ms ease on interactive elements (buttons, links, hover states).
- **Focus Indicators:** 2px ring in Primary (`#3B82F6`) with 2px offset for keyboard navigation.

---

## Screen Map & Navigation

### Header Navigation

```
[ AppForge AI Logo ]   [ Home ]   [ History ]
```

- Fixed to the top of the viewport.
- Background: `#0F172A` with a subtle bottom border (`#334155`).
- Logo links to `/`. Nav items highlight with Primary underline when active.

### Routes

| Path             | Screen         | Description                          |
| ---------------- | -------------- | ------------------------------------ |
| `/`              | Home Page      | Prompt input and app generation      |
| `/project/:id`   | Project Viewer | File tree and code viewer for a project |
| `/projects`      | History        | Grid of past generated projects      |

---

## Screen Descriptions

### Home Page (`/`)

The landing page is focused on a single action: describing an app and generating it.

#### Layout

```
+--------------------------------------------------+
|  Header Nav                                      |
+--------------------------------------------------+
|                                                  |
|         "Describe your app, we'll build it"      |
|              (subtitle / tagline)                |
|                                                  |
|  +--------------------------------------------+  |
|  |  [PromptInput - large textarea]            |  |
|  |  Placeholder: "e.g., A task management     |  |
|  |  app with user auth, drag-and-drop boards, |  |
|  |  and dark mode..."                         |  |
|  +--------------------------------------------+  |
|                                                  |
|            [ Generate App  ->  ]                 |
|                                                  |
|  Example prompts:                                |
|  [ "Todo app with categories" ]                  |
|  [ "Weather dashboard with charts" ]             |
|  [ "Chat app with real-time messages" ]          |
|                                                  |
+--------------------------------------------------+
```

#### Behavior

- **Hero Section:** Centered vertically in the viewport (above the fold). Tagline in large heading text (`text-3xl` or `text-4xl`), white on dark background.
- **PromptInput:** A large, multi-line textarea (minimum 4 rows). Centered, max-width of 640px. Border in `#334155`, focus ring in Primary.
- **Generate Button:** Full-width (matching textarea width), Primary background, white text, bold. Disabled state when textarea is empty.
- **Example Prompts:** Displayed as clickable pill buttons below the generate button. Clicking one fills the textarea with that prompt text. Styled with Surface background and subtle border.
- **Loading State:** When generation is in progress, an overlay covers the page center with a spinner and the message "Generating your app..." in white text. The textarea and button are disabled during loading.

---

### Project Page (`/project/:id`)

Displays the generated project with a file explorer and code viewer in a split-pane layout.

#### Layout

```
+--------------------------------------------------+
|  Header Nav                                      |
+--------------------------------------------------+
|  Project Name    |  description snippet...  | [Download ZIP] |
+--------------------------------------------------+
|  FileTree (25%)  |  CodeViewer (75%)              |
|                  |                                |
|  > src/          |  src/App.jsx                   |
|    > components/ |  --------------------------------|
|      Button.jsx  |  import React from 'react';    |
|      Card.jsx    |                                |
|    App.jsx  <--  |  function App() {              |
|    index.js      |    return (                    |
|  > public/       |      <div>Hello</div>          |
|    index.html    |    );                          |
|  package.json    |  }                             |
|                  |                                |
|                  |  export default App;           |
+--------------------------------------------------+
```

#### Header Bar

- **Project Name:** Bold, white, left-aligned.
- **Description:** Truncated to a single line with ellipsis, displayed in secondary text color.
- **Download ZIP Button:** Right-aligned. Outlined style with Primary border and text, or solid Primary background.

#### File Tree (Left Panel - 25% width)

- Collapsible folder structure with indentation.
- Folder icons (chevron or folder icon) that rotate/change on expand/collapse.
- File icons vary by extension (e.g., JSX, JSON, HTML, CSS).
- Clicking a file selects it (highlighted with Primary background at low opacity) and loads it into the CodeViewer.
- Active file is visually distinct with a left border accent or background highlight.

#### Code Viewer (Right Panel - 75% width)

- **Breadcrumb:** Shows the full file path at the top of the panel (e.g., `src / components / Button.jsx`). Uses secondary text color with the filename in white.
- **Code Display:** Syntax-highlighted code block with line numbers. Uses a dark code theme consistent with the app palette (e.g., similar to VS Code Dark+).
- **Scroll:** Independent vertical scroll within the panel.
- **Empty State:** When no file is selected, display "Select a file to view its contents" centered in the panel.

---

### History Page (`/projects`)

A browsable grid of all previously generated projects.

#### Layout

```
+--------------------------------------------------+
|  Header Nav                                      |
+--------------------------------------------------+
|  Your Projects                                   |
+--------------------------------------------------+
|  +------------+  +------------+  +------------+  |
|  | Project A  |  | Project B  |  | Project C  |  |
|  | Desc...    |  | Desc...    |  | Desc...    |  |
|  | Mar 27     |  | Mar 25     |  | Mar 20     |  |
|  | [Complete] |  | [Complete] |  | [Failed]   |  |
|  +------------+  +------------+  +------------+  |
|                                                  |
|  +------------+  +------------+                  |
|  | Project D  |  | Project E  |                  |
|  | Desc...    |  | Desc...    |                  |
|  | Mar 18     |  | Mar 15     |                  |
|  | [Complete] |  | [Pending]  |                  |
|  +------------+  +------------+                  |
+--------------------------------------------------+
```

#### Behavior

- **Page Title:** "Your Projects" as a section heading.
- **Grid:** Responsive columns -- 1 column on mobile, 2 on tablet, 3 on desktop.
- **ProjectCard:** Each card displays the project name (bold, white), a truncated description (2 lines max, secondary color), the creation date (caption style), and a status badge.
- **Status Badges:**
  - Complete: Green background (`#166534`), green text (`#22C55E`)
  - Pending: Yellow/amber tint
  - Failed: Red tint
- **Click:** Entire card is clickable and navigates to `/project/:id`. Hover state lifts the card slightly with a brighter border.
- **Empty State:** When no projects exist, display centered text: "No projects yet. Generate your first app!" with a link/button to navigate to the Home page.

---

## Component Specifications

### PromptInput

| Property    | Detail                                                    |
| ----------- | --------------------------------------------------------- |
| Element     | `<textarea>`                                               |
| Min Rows    | 4                                                         |
| Max Width   | 640px, centered                                           |
| Placeholder | "e.g., A task management app with user auth, drag-and-drop boards, and dark mode..." |
| Border      | 1px solid `#334155`, rounded-lg (8px)                     |
| Focus       | Ring 2px `#3B82F6`, border color changes to Primary       |
| Background  | `#1E293B`                                                 |
| Text Color  | `#FFFFFF`                                                 |
| Font Size   | 1rem                                                      |
| Resize      | Vertical only                                             |

### FileTree

| Property       | Detail                                                 |
| -------------- | ------------------------------------------------------ |
| Width          | 25% of the split pane                                  |
| Background     | `#0F172A`                                              |
| Item Height    | 36px                                                   |
| Indent         | 16px per nesting level                                 |
| Icons          | Chevron right/down for folders; file-type icons for files |
| Selected State | Background `#3B82F6` at 15% opacity, left border 2px Primary |
| Hover State    | Background `#1E293B`                                   |
| Overflow       | Vertical scroll, hidden horizontal                     |
| Interaction    | Click folder to toggle expand/collapse; click file to select and display in CodeViewer |

### CodeViewer

| Property       | Detail                                                 |
| -------------- | ------------------------------------------------------ |
| Width          | 75% of the split pane                                  |
| Background     | `#1E293B`                                              |
| Font           | `JetBrains Mono`, monospace, 0.875rem                  |
| Line Numbers   | Displayed in `#94A3B8`, right-aligned, fixed-width column |
| Syntax Theme   | Dark theme matching app palette (blues, greens, oranges for tokens) |
| Breadcrumb     | Top bar with file path segments separated by `/`, secondary text, filename in white |
| Scroll         | Independent vertical and horizontal scroll             |
| Empty State    | "Select a file to view its contents" centered, secondary text |

### ProjectCard

| Property       | Detail                                                 |
| -------------- | ------------------------------------------------------ |
| Background     | `#1E293B`                                              |
| Border         | 1px solid `#334155`, rounded-lg (8px)                  |
| Padding        | 20px                                                   |
| Hover          | Border brightens to `#475569`, subtle translateY(-2px) |
| Title          | Bold, white, 1.125rem, truncated to 1 line             |
| Description    | Secondary color, 0.875rem, truncated to 2 lines (line-clamp-2) |
| Date           | Caption style, `#94A3B8`, 0.75rem                      |
| Status Badge   | Inline pill, 0.75rem, rounded-full, colored per status |
| Cursor         | Pointer on hover                                       |
| Click Target   | Entire card navigates to `/project/:id`                |

### Layout

| Property       | Detail                                                 |
| -------------- | ------------------------------------------------------ |
| Header Height  | 64px                                                   |
| Header BG      | `#0F172A` with bottom border `#334155`                 |
| Logo           | Left-aligned, links to `/`                             |
| Nav Links      | Right-aligned, 1rem, white text, Primary underline on active |
| Content Area   | Below header, full remaining viewport height (`calc(100vh - 64px)`) |
| Max Width      | Content constrained to 1280px on Home and History pages; full width on Project page |
| Page BG        | `#0F172A`                                              |

### LoadingSpinner

| Property       | Detail                                                 |
| -------------- | ------------------------------------------------------ |
| Overlay        | Fixed position, full screen, `#0F172A` at 80% opacity  |
| Spinner        | Animated rotating circle, 48px, Primary stroke color   |
| Animation      | CSS `animate-spin`, 1s linear infinite                 |
| Message        | "Generating your app..." below spinner, white, 1.125rem |
| Z-Index        | Above all content (z-50)                               |

---

## Mobile Screens (React Native)

The mobile experience mirrors the web app across three screens, adapted for native interaction patterns.

### HomeScreen

- **Layout:** `ScrollView` with vertical centering for the main content area.
- **Tagline:** Large heading text at the top.
- **Input:** Multi-line `TextInput` spanning full width with padding, styled to match the web textarea.
- **Button:** Full-width "Generate App" button below the input, using Primary background.
- **Example Prompts:** Horizontal `ScrollView` of tappable chips below the button.
- **Loading:** Full-screen modal overlay with `ActivityIndicator` and loading message.

### ProjectScreen

- **Header:** Project name and description at the top, "Download ZIP" as an icon button in the navigation bar.
- **Tab View:** Two tabs at the top of the content area:
  - **Files Tab:** Displays the FileTree as a full-screen scrollable list. Tapping a file switches to the Code tab with that file selected.
  - **Code Tab:** Displays the CodeViewer full-screen with the breadcrumb path at the top and syntax-highlighted code below.
- **Navigation:** Tabs use a `TabView` or segmented control. Swiping between tabs is supported.

### HistoryScreen

- **Layout:** `FlatList` of ProjectCards, single column, full width.
- **Card:** Same information as web (name, description, date, status badge), styled as a pressable card.
- **Empty State:** Centered message with a button linking to HomeScreen.
- **Pull to Refresh:** Supported via `RefreshControl`.

---

## Responsive Behavior

### Desktop (1024px and above)

- **Home Page:** Content centered, max-width 640px for the prompt area.
- **Project Page:** Side-by-side split pane -- FileTree at 25% width, CodeViewer at 75% width. Both panels scroll independently.
- **History Page:** 3-column grid of ProjectCards.

### Tablet (640px - 1023px)

- **Home Page:** Same centered layout, slightly reduced padding.
- **Project Page:** FileTree is collapsible. A toggle button in the header bar shows/hides the file tree panel. When visible, it overlays the CodeViewer at 280px width. CodeViewer takes full width when the tree is collapsed.
- **History Page:** 2-column grid of ProjectCards.

### Mobile (below 640px)

- **Home Page:** Full-width textarea with horizontal padding (16px). Example prompts wrap or scroll horizontally.
- **Project Page:** Stacked layout. FileTree is hidden by default and accessible as a slide-in drawer from the left edge (triggered by a hamburger/menu icon). CodeViewer takes full screen width. Breadcrumb path may be truncated with horizontal scroll.
- **History Page:** 1-column stack of ProjectCards, full width.
- **Header:** Nav links collapse into a hamburger menu or bottom tab bar.

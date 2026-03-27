# Security Report -- AppForge AI

**Date:** 2026-03-27
**Scope:** Backend routes, frontend components, utility modules, configuration
**Severity Scale:** Critical / High / Medium / Low / Informational

---

## Summary

The codebase demonstrates reasonable baseline security practices: Prisma parameterized queries prevent SQL injection, React's default JSX escaping mitigates most XSS, error responses do not leak stack traces, and `.gitignore` excludes `.env` and database files. However, several issues were identified that should be addressed before production deployment.

---

## Findings

### 1. Path Traversal in Zip Generation

**Severity:** High
**File:** `packages/backend/src/utils/zip.ts` (line 24)
**Description:** The `file.path` value from the database is passed directly to `archive.append()` without sanitization. If a malicious or corrupted project record contains paths like `../../etc/passwd` or absolute paths like `/etc/shadow`, the resulting zip archive will contain entries at those paths. When a user extracts the zip, files could be written outside the intended directory (Zip Slip vulnerability).

```typescript
// Current -- no validation on file.path
archive.append(file.content, { name: file.path });
```

**Recommendation:** Normalize and validate each `file.path` before adding it to the archive:
- Reject or strip leading `/` and any `..` path segments.
- Use `path.normalize()` and confirm the result stays within the project root.

---

### 2. Content-Disposition Header Injection

**Severity:** Medium
**File:** `packages/backend/src/routes/projects.ts` (line 69)
**Description:** The `project.name` value is interpolated directly into the `Content-Disposition` header without sanitization or encoding. A project name containing double quotes, newlines, or other special characters could corrupt the header or enable HTTP response splitting.

```typescript
'Content-Disposition': `attachment; filename="${project.name}.zip"`,
```

**Recommendation:** Sanitize `project.name` by stripping or encoding characters that are invalid in HTTP header values (double quotes, backslashes, control characters). Alternatively, use a fixed or UUID-based filename and provide the human-readable name only as a `filename*` parameter with proper RFC 5987 encoding.

---

### 3. Missing Input Validation on Project Name at Generation Time

**Severity:** Medium
**File:** `packages/backend/src/routes/generate.ts` (lines 20-28)
**Description:** The `description` field is validated for presence and length, which is good. However, `generated.name` (derived from the engine) is stored directly in the database without any validation or length constraint. If the engine produces an unexpectedly long or malicious name, it flows into database storage and subsequently into the `Content-Disposition` header (see finding #2).

**Recommendation:** Validate and sanitize `generated.name` before database insertion -- enforce a maximum length, strip control characters, and ensure it contains only safe characters for filenames.

---

### 4. CORS Configuration -- Hardcoded Development Origins Only

**Severity:** Medium
**File:** `packages/backend/src/index.ts` (line 9)
**Description:** The CORS policy allows only `http://localhost:5173` and `http://localhost:3000`. This is appropriate for development but will break in production. There is no environment-based configuration for production origins.

```typescript
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000'] }));
```

**Recommendation:** Load allowed origins from an environment variable (e.g., `CORS_ORIGINS`). In production, restrict to the actual deployment domain. Avoid setting `origin: true` or `origin: '*'`, which would defeat the purpose of CORS.

---

### 5. No Authentication or Authorization

**Severity:** High
**File:** All route files
**Description:** All API endpoints (generate, list, get, download, delete) are completely unauthenticated. Any client that can reach the server can create, read, and delete any project. The DELETE endpoint at `/api/projects/:id` is particularly sensitive.

**Recommendation:** Implement authentication (e.g., JWT, session-based) and authorization checks before production deployment. At minimum, protect destructive operations (DELETE).

---

### 6. No Rate Limiting

**Severity:** Medium
**File:** `packages/backend/src/index.ts`
**Description:** There is no rate limiting on any endpoint. The `/api/generate` endpoint is especially vulnerable to abuse since it triggers project generation and database writes. An attacker could flood the server with requests, causing resource exhaustion.

**Recommendation:** Add rate limiting middleware (e.g., `express-rate-limit`). Apply stricter limits to the `/api/generate` endpoint (e.g., 5 requests per minute) and more relaxed limits to read endpoints.

---

### 7. Body Parsing Limit Set to 10MB

**Severity:** Low
**File:** `packages/backend/src/index.ts` (line 10)
**Description:** The JSON body parser limit is set to 10MB. Given that the only POST endpoint accepts a description capped at 2000 characters, this limit is far more permissive than necessary. Large payloads could consume memory before route-level validation rejects them.

```typescript
app.use(express.json({ limit: '10mb' }));
```

**Recommendation:** Reduce the body parsing limit to a value appropriate for the application (e.g., `'16kb'` or `'64kb'`).

---

### 8. Multiple PrismaClient Instances

**Severity:** Low
**File:** `packages/backend/src/routes/generate.ts` (line 5), `packages/backend/src/routes/projects.ts` (line 5)
**Description:** Each route file creates its own `new PrismaClient()` instance. While not a direct security vulnerability, multiple client instances lead to multiple database connection pools, which can exhaust database connections under load and create denial-of-service conditions.

**Recommendation:** Create a single shared PrismaClient instance (e.g., in a `db.ts` utility module) and import it across route files.

---

### 9. JSON.parse Without Error Handling on Stored Data

**Severity:** Low
**File:** `packages/backend/src/routes/projects.ts` (lines 44, 64)
**Description:** `JSON.parse(project.files)` is called on data retrieved from the database. If data corruption occurs, this will throw an unhandled exception inside the try/catch, which is caught and returns a generic 500 error. While the error is handled, the generic message provides no indication of data corruption, making debugging difficult.

**Recommendation:** Consider wrapping the parse in a specific try/catch with a more descriptive error or validation of the parsed structure.

---

### 10. Frontend API Client -- No Request Timeout

**Severity:** Low
**File:** `packages/frontend/src/api/client.ts`
**Description:** The `fetch` calls have no timeout configured. If the backend hangs (e.g., during project generation), the frontend will wait indefinitely.

**Recommendation:** Use `AbortController` with a timeout (e.g., 30 seconds for generation, 10 seconds for reads) to prevent indefinitely hanging requests.

---

## Positive Findings

These security practices are already in place and should be maintained:

| Area | Status | Notes |
|---|---|---|
| SQL Injection | **Protected** | Prisma parameterized queries used throughout; no raw SQL detected |
| XSS in CodeViewer | **Protected** | Content is rendered via React JSX (`{content}` in a `<code>` tag), which auto-escapes HTML. No use of `dangerouslySetInnerHTML` anywhere in the codebase |
| Error Handling | **Good** | All route handlers use try/catch; error responses return generic messages without stack traces |
| .gitignore | **Adequate** | Excludes `.env`, `*.db`, `*.db-journal`, `node_modules/`, and build artifacts |
| Sensitive Files | **Clean** | No `.env` files or credentials committed to the repository |
| Body Size Limit | **Present** | JSON body parsing has an explicit size limit (though it could be tightened) |

---

## Recommendations Summary (Prioritized)

| Priority | Finding | Action |
|---|---|---|
| **P0** | #5 No Authentication | Add auth before production deployment |
| **P0** | #1 Path Traversal in Zip | Sanitize file paths before adding to zip archive |
| **P1** | #6 No Rate Limiting | Add `express-rate-limit` middleware |
| **P1** | #2 Header Injection | Sanitize project name in Content-Disposition header |
| **P1** | #3 Missing Name Validation | Validate generated project name before storage |
| **P2** | #4 CORS Config | Make CORS origins configurable via environment variable |
| **P2** | #7 Body Limit | Reduce JSON body limit to match actual needs |
| **P3** | #8 PrismaClient Instances | Consolidate to single shared instance |
| **P3** | #9 JSON.parse Handling | Add specific error handling for data corruption |
| **P3** | #10 Request Timeout | Add AbortController timeouts to frontend fetch calls |

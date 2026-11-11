# Frontend QA Report

## Bugs discovered and root causes

1. **All dashboard controls were blocked on initial load.** The modal backdrop had the `hidden` attribute, but the author stylesheet set `display: grid` on `.modal-backdrop`, overriding the browser's hidden-element rule. The invisible full-screen backdrop intercepted pointer events.
2. **Short/mobile viewports could place modal actions below the viewport.** The modal had no constrained scrolling behavior. The modal now has a viewport-aware maximum height, internal scrolling, and sticky actions.
3. **Modal focus behavior was incomplete.** Focus moved into the form but was not restored to the triggering control. The modal now records its trigger and restores focus on close.
4. **Mobile navigation remained open after navigation.** Navigation clicks now close the sidebar and update `aria-expanded`.
5. **The workspace avatar looked interactive without an action.** It is now a non-interactive decorative element with `aria-hidden`.
6. **Cache could retain stale frontend assets after deployment.** CSS and JavaScript URLs now include a version query string so updated assets are fetched reliably.

## Files modified

- `src/main/resources/static/index.html`
- `src/main/resources/static/styles.css`
- `src/main/resources/static/app.js`
- `FRONTEND_QA_REPORT.md`

## Fixes implemented

- Explicit `.modal-backdrop[hidden] { display: none; }`.
- Viewport-safe modal scrolling and sticky action controls.
- Outside-click, close-button, Cancel, and Escape modal handling.
- Focus restoration and visible keyboard focus indicators.
- Safer title/description filtering and invalid-date handling.
- Mobile sidebar close behavior and `aria-expanded`.
- Cache-busted static asset references.
- Preserved existing API fields and CRUD behavior.

## Tests executed

### Static and build validation

- JavaScript syntax: **PASS** (`node --check`)
- Whitespace validation: **PASS** (`git diff --check`)
- Maven verification with Java 21: **PASS** (12 tests, 0 failures)
- Frontend assets packaged in Spring Boot JAR: **PASS**
- Docker multi-stage build: **PASS**

### Browser coverage

Browser automation was executed with Playwright against the local Spring Boot application.

- Desktop browser workflow: **PASS**
  - Dashboard load and API health
  - New task modal
  - Create task
  - Edit title and description
  - Change status
  - Dynamic statistics
  - Search and combined status filtering
  - Refresh/reload data
  - Delete confirmation and removal
  - Escape and close-button behavior
  - Focus restoration
- Mobile viewport 390×844: **PASS**
  - Responsive layout
  - Mobile menu open/close
  - Navigation closes the sidebar
  - Full CRUD workflow
- Very short 780×301 viewport: **PASS**
  - Modal is constrained and internally scrollable; controls remain reachable.
- Unexpected JavaScript errors during tested flows: **PASS**
  - No application exceptions observed.
  - Browser tooling reported one `ERR_ABORTED` event while handling the native delete confirmation; the DELETE operation completed and the task was removed successfully.

## Backend regression checks

- `GET /api/health`: **PASS**, HTTP 200, status `UP`
- Task CRUD endpoints: **PASS**
- Static frontend at `/`: **PASS**
- API contract changes: **NONE**

## Azure verification

- GitHub Actions `build-and-test`: **NOT TESTED YET FOR THIS FIX COMMIT**
- GitHub Actions `publish-and-deploy`: **NOT TESTED YET FOR THIS FIX COMMIT**
- Live Azure health endpoint: **PASS** before this fix deployment; will be rechecked after deployment.
- Live Azure frontend: **PASS** before this fix deployment; will be rechecked after deployment.

## Final functional checklist

| Feature | Result |
|---|---|
| Dashboard loads | PASS |
| New task button | PASS |
| Edit task | PASS |
| Delete task and confirmation | PASS |
| Save and Cancel | PASS |
| Close and Escape | PASS |
| Search | PASS |
| Status filter | PASS |
| Combined search and filter | PASS |
| Dynamic statistics | PASS |
| Refresh/reload | PASS |
| API health indicator | PASS |
| Demo data button | NOT TESTED IN THIS QA RUN |
| Desktop viewport | PASS |
| Mobile viewport | PASS |
| Keyboard focus handling | PASS |
| No blocking overlay | PASS |
| Maven verification | PASS |
| Docker build | PASS |
| Post-fix Azure deployment | NOT TESTED YET |

## Remaining known issues

- The backend uses an H2 in-memory database, so tasks are not durable across application restarts. This is existing behavior and was not changed.
- The native browser confirmation dialog is intentionally used for deletion; automated browser tooling may report the dialog's interrupted request event even though the DELETE succeeds.

## Purpose

This repository contains Playwright end-to-end tests using a Page Object Model.
When working in this repo, always preserve the existing structure, naming style, and conventions.

## Primary goals

When asked to implement or update UI automation:

1. Inspect the existing Playwright project structure before creating files.
2. Reuse existing helpers, fixtures, utilities, and naming patterns.
3. Prefer extending existing page objects over creating duplicates.
4. Use the browser tooling / Playwright MCP to inspect the real UI before finalizing selectors.
5. Produce code that is ready to run in this repo without placeholder pseudocode.

## Repo conventions

- Tests live under: `tests/`
- Page objects live under: `pages/`
- Shared helpers live under: `utils/`
- Fixtures live under: `fixtures/`
- Keep new files in the closest matching module folder.
- Use TypeScript.
- Do not use `any`.
- Prefer strict typing for locators, method params, and return values.
- Prefer `Locator` fields and small reusable page methods.
- Do not hardcode sleeps unless explicitly required for a known system limitation.
- Prefer Playwright waiting patterns:
  - `await expect(locator).toBeVisible()`
  - `await page.waitForResponse(...)` armed before the user action
  - `await expect.poll(...)` when appropriate

## Page Object rules

When creating a new page object:

- Match the style of existing page objects in this repository.
- Export a class, unless the repository clearly uses factory functions instead.
- Keep selectors private or readonly, following the local pattern.
- Create clear action methods and assertion helpers.
- Avoid test assertions inside page object action methods unless that is already the project style.
- Prefer accessible selectors first (`getByRole`, `getByLabel`, `getByPlaceholder`) before CSS/XPath, unless the app requires otherwise.
- If a stable selector does not exist, document the fallback choice in code comments only when necessary.

## Test creation rules

When creating a new test:

- Follow the module’s existing naming convention.
- Reuse existing fixtures and authenticated contexts.
- Use `test.step(...)` for major business steps if the repo already uses it.
- Keep one business flow per test unless existing local style groups multiple flows.
- Add cleanup only if the repository already does cleanup for similar tests.
- If API cleanup is needed, reuse existing request helpers and auth patterns.

## Browser inspection workflow

Before writing selectors for a new screen:

1. Open the target route with the Playwright MCP/browser tool.
2. Inspect rendered UI, labels, placeholders, button names, dialogs, and network behavior.
3. Prefer selectors that reflect actual visible UX.
4. If the UI is dynamic, verify the interaction in the browser before finalizing code.

## Required implementation workflow

For requests like “build a page object from these test cases”:

1. Read nearby page objects and tests first.
2. Summarize the existing pattern briefly in the response or work log.
3. Inspect the target page in the browser tool.
4. Create or update the page object.
5. Create or update tests using that page object.
6. Run lint/typecheck/tests when feasible.
7. If something cannot be verified, leave a short note explaining exactly what remains uncertain.

## Done criteria

Work is only done when:

- The new page object matches local repository conventions.
- The test file compiles.
- Imports are correct.
- New selectors were checked against the rendered page when browser tooling is available.
- The response lists what was changed and any remaining risks.

## Do not

- Do not invent repo conventions.
- Do not introduce a second pattern when one already exists.
- Do not use brittle nth-child selectors unless there is no practical alternative.
- Do not rewrite unrelated files.
- Do not silently skip verification if the browser tool is available.

## MCP/tool usage preference

If Playwright MCP or browser tooling is available, use it before finalizing selectors or flow assumptions.
If project docs or API docs MCP is available, use it to verify framework-specific details instead of guessing.

<!-- Task: build a Playwright page object and test from a real page.

Use the Playwright MCP/browser tool to open the target page and inspect the actual rendered UI before writing selectors.

Target route:
- /air-request/create

Repository requirements:
- TypeScript only
- no `any`
- follow the existing Page Object Model already used in this repo
- prefer `getByRole`, `getByLabel`, `getByPlaceholder`
- use `test.step(...)` for major business actions if that is the local pattern
- do not use arbitrary timeouts unless there is an existing repo-specific reason
- arm `waitForResponse` before the triggering click when validating API-backed actions

Deliverables:
1. New or updated page object
2. New or updated spec
3. Any small helper additions only if necessary
4. A short summary of exact files changed

Required workflow:
1. Read nearby files first to learn the repo pattern
2. Inspect the page in the browser
3. Build locators from visible labels and actual interactions
4. Verify the flow in the browser if possible
5. Run typecheck or tests if feasible

Scenario to automate:
- Open create air request page
- Fill required fields
- Select partner
- Save request
- Confirm success UI appears
- Verify the request is visible or returned by the expected network flow -->

# Skill: playwright-page-builder

Use this skill when asked to create or update Playwright page objects and tests.

Workflow:

1. Read existing page objects and tests in the same module.
2. Open the target page with Playwright/browser tooling.
3. Inspect labels, controls, dialogs, table columns, toasts, and network calls.
4. Create or update the page object in the project’s style.
5. Create or update the test using existing fixtures and conventions.
6. Run typecheck/tests if feasible.
7. Report files changed and any uncertain selectors.

Rules:

- Prefer accessible selectors
- Avoid `any`
- Avoid brittle nth selectors unless necessary
- Reuse existing helpers
- Keep methods small and composable
- when running test, do it headed mode

Before creating a new page object or test, inspect at least 2 existing files in the same module and mirror their structure exactly.
Do not create debug artifacts or browser snapshots as files.
Do not add .yml, .yaml, .json, or .md files unless explicitly requested.
Use browser/MCP output only to inform selector and test creation.

## Playwright Page Object selector convention

In this repository, always use the following selector style:

- Store selectors as string constants, usually XPath strings.
- Dynamic selectors must be functions that return a string.
- Always use `this.page.locator(...)` inside action/assertion methods.
- Do not create `Locator` properties.
- Do not create getters that return `Locator`.
- Do not create helper methods that return `Locator` unless explicitly requested.
- Do not move selectors into the constructor.
- Keep selectors as simple readonly fields on the class.

### Required examples

Static selector:

```ts
public readonly SAVE_BUTTON = `//button[text()="Save"]`;
public readonly SAVE_BUTTON = `//p[contains(.,"Save")]`;
```

Assertion of simple Selector :
public readonly ALL_CLIENT_TABS = `//button[@role='tab']`;
await expect(page.locator(clients.ALL_CLIENT_TABS)).toHaveCount(4);
Assertion for a dynamic selector :
public readonly CLIENT_TAB = (tabName: string) =>
`//button[@role='tab' and normalize-space(.)='${tabName}']`;
await expect(page.locator(clients.CLIENT_TAB('Inactive'))).toBeVisible();

Try to avoid //\*[] xpaths, always try to find the type of the element for example : p, span, button, input, dialog, textarea, div

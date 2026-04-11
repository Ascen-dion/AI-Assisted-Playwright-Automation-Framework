---
name: brownfield-context
description: >
  Load and apply brownfield project context. Use this skill when generating, reviewing, or fixing
  any automation asset (locators, page objects, specs, API tests) to ensure the output is grounded
  in the project's actual application knowledge, framework conventions, domain rules, and
  prompt guardrails. Always invoke this skill before writing or editing test code.
allowed-tools: read_file Bash(node:*) Bash(npx:*)
---

# Brownfield Context Loader

## Purpose

This skill ensures every automation output is deterministic and project-specific by loading four
knowledge layers before any code is written or edited.

---

## Step 1 — Load all four context files

Read each file in full before proceeding with any task:

```
context/application.md      Application knowledge — URL, routes, selectors, environment
context/framework.md        Framework knowledge — POM conventions, naming, config, assertions
context/domain.md           Domain knowledge — business rules, edge cases, AC patterns
context/project-prompt.md   Always-on guardrails — injected into every generated output
```

---

## Step 2 — Extract critical values into working memory

From `context/application.md`:
- **Target URL** — use in every `goto()` call and Jira story description
- **Known routes** — `/`, `/products`, `/cart`, plus any others defined
- **Selector priority** — data-testid > role > text > stable CSS
- **Environment notes** — timeout values, cold-start warnings, waitUntil strategy

From `context/framework.md`:
- **File naming convention** — `<jira-id>-automated.spec.js`, `<jira-id>.page.js`, `<jira-id>.locators.js`
- **Standard timeouts** — `waitFor: 15000`, `goto timeout: 60000`
- **CommonJS only** — use `require`/`module.exports`, never ES modules
- **Assertion rules** — exact text, exact URL patterns, `toBeVisible()` not `isVisible()` in specs

From `context/domain.md`:
- **Expected text values** — hero title, empty state messages, pricing copy
- **Business rules** — pricing thresholds, cart behaviour, return policy
- **AC patterns** — how to interpret "verify visible", "verify text", "verify navigation"

From `context/project-prompt.md`:
- **Always-do rules** — include target URL, use waitFor, generate three POM files
- **Always-avoid rules** — no TODOs, no raw selectors in specs, no waitForTimeout
- **Output format rules** — `// === FILE: <path> ===` header on every code block

---

## Step 3 — Audit existing assets before creating

Scan and read:
```
src/pages/locators/   → check for existing locator definitions
src/pages/            → check for existing page object methods
src/tests/            → check for existing test coverage
```

Apply these rules:
- **Locator exists?** → import and use it, never redefine
- **Page method exists?** → call it, never reimplement
- **Test already covers this scenario?** → extend the existing spec, do not create a duplicate
- **New file needed?** → only if there is genuinely no existing coverage

---

## Step 4 — Apply context throughout output

Inject context into every part of the generated output:

| Output element | Context source |
|---|---|
| Target URL in `goto()` | `application.md` → Target URL |
| Selector strings | `application.md` → Selector Strategy + live inspection |
| `waitFor` timeouts | `application.md` → Environment Notes |
| File names | `framework.md` → File Naming Convention |
| Assertion values | `domain.md` → Expected text values and business rules |
| Output format | `project-prompt.md` → Code Generation Format |
| Jira story format | `project-prompt.md` → Jira Story Generation Format |
| Test case titles | `project-prompt.md` → Test Case Generation Format |

---

## Verification checklist before any output

- [ ] Target URL matches `context/application.md` — not a placeholder
- [ ] All selectors verified against live DOM or `context/application.md`
- [ ] No existing locator, method, or test has been duplicated
- [ ] File names follow `context/framework.md` convention
- [ ] All assertion values come from `context/domain.md`, not assumptions
- [ ] Three file blocks produced (locators, page object, spec) for UI tests
- [ ] `// === FILE: <path> ===` header on every code block
- [ ] Zero `TODO`, `placeholder`, `your selector here` comments in output

---

## Context file update protocol

When new application knowledge is discovered (new route, new selector, new business rule):

1. Add it to the relevant `context/*.md` file immediately
2. Note the addition clearly in your response
3. This makes the knowledge permanent for all future agent runs

---

## Applying to a new brownfield project

Clone this context structure for any new project:

```bash
mkdir context
# Add application.md with the new app's URL, routes, selectors
# Add domain.md with the new domain's business rules
# Add framework.md if tech stack differs from the default
# Add project-prompt.md with project-specific guardrails
```

The agent reads these files automatically — no code changes needed.

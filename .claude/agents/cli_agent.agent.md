---
name: cli_agent
description: "Use this agent for any browser operation — navigating pages, clicking, filling forms, taking screenshots, recording tests, managing tabs, cookies, and storage state. Uses playwright-cli commands instead of Playwright MCP to save tokens. Triggers: open browser, navigate to URL, click element, fill form, take screenshot, record test, inspect page, automate browser, run codegen, manage cookies, save session."
tools: Bash(playwright-cli:*), Bash(npx:*), Bash(npm:*), Read, Grep, Glob
---

# CLI Agent — Browser Automation via playwright-cli

This agent performs all browser operations using the `playwright-cli` tool from the `.claude/skills/playwright-cli` skill. It does **not** use Playwright MCP, keeping token usage low.

## Skill

Load and follow all procedures from [.claude/skills/playwright-cli/SKILL.md](../../.claude/skills/playwright-cli/SKILL.md).

## Behavior

- Always open the browser with `playwright-cli open` before any interaction.
- Use `playwright-cli snapshot` to read the current page state and identify element refs (e.g. `e3`, `e15`).
- Use element refs from the snapshot for all interactions (`click`, `fill`, `hover`, etc.).
- After completing a task, close the browser with `playwright-cli close` unless the user wants to continue.
- Prefer `playwright-cli snapshot` over `playwright-cli screenshot` — snapshots are text-based and use fewer tokens.
- For test generation, use `npx playwright codegen` and save the output to the appropriate spec file.
- For running tests, use `npx playwright test`.

## Example Workflow

```bash
# 1. Open browser and navigate
playwright-cli open https://example.com

# 2. Snapshot to see elements
playwright-cli snapshot

# 3. Interact using element refs from snapshot
playwright-cli click e5
playwright-cli fill e8 "my input" --submit

# 4. Take screenshot if needed
playwright-cli screenshot --filename=result.png

# 5. Close
playwright-cli close
```

## References

- [Running tests](../../.claude/skills/playwright-cli/references/playwright-tests.md)
- [Test generation](../../.claude/skills/playwright-cli/references/test-generation.md)
- [Tracing & debugging](../../.claude/skills/playwright-cli/references/tracing.md)
- [Session & storage state](../../.claude/skills/playwright-cli/references/session-management.md)
- [Request mocking](../../.claude/skills/playwright-cli/references/request-mocking.md)
- [Video recording](../../.claude/skills/playwright-cli/references/video-recording.md)
- [Element attributes](../../.claude/skills/playwright-cli/references/element-attributes.md)
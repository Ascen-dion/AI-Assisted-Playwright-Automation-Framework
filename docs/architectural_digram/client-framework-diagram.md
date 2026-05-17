# AI-Assisted Test Automation Framework — Multi-Platform Architecture

This diagram shows how the framework turns plain-English requirements into production-grade automation across **Web, API, iOS, Android, macOS, and Windows** — all orchestrated through GitHub Copilot agents.

```mermaid
flowchart TD
    classDef input    fill:#eef4ff,stroke:#3d6dcc,color:#0f172a,stroke-width:1.5px;
    classDef norm     fill:#dbeafe,stroke:#1d4ed8,color:#0f172a,stroke-width:2px;
    classDef ctx      fill:#fdf6ec,stroke:#d97706,color:#111827,stroke-width:1.5px;
    classDef ai       fill:#fff7ed,stroke:#ea580c,color:#111827,stroke-width:1.5px;
    classDef platform fill:#ecfdf3,stroke:#0f9f6e,color:#0f172a,stroke-width:1.5px;
    classDef exec     fill:#fff1f2,stroke:#e11d48,color:#111827,stroke-width:1.5px;
    classDef heal     fill:#fef9c3,stroke:#ca8a04,color:#111827,stroke-width:1.5px;
    classDef output   fill:#f3f0ff,stroke:#6d4aff,color:#1f2937,stroke-width:1.5px;

    subgraph L1["LAYER 1 — INPUT CHANNELS"]
        direction LR
        WEB_UI["A) Web UI — React App\nEnter story/URL · select platform\nWeb / Android / iOS / macOS / Windows\noptionally upload context"]
        IDE_A["B) IDE Agent — GitHub Copilot / CLI\nDeveloper prompts in IDE/CLI\nSpecify platform and framework"]
        JIRA_IN["C) Jira / Test Management\nFetch user stories, acceptance\ncriteria and tags via Jira API"]
    end

    NORM["Normalized Test Intent\nStory + Platform + Context"]

    subgraph L2["LAYER 2 — CONTEXT AND PLATFORM RESOLUTION"]
        direction LR
        CTX_SRC["Context Sources\napplication.md · domain.md · framework.md · project-prompt.md\nPlatform capabilities · guardrails · naming conventions"]
        RESOLVER["Platform Resolver\nDetect platform and select framework"]
        subgraph ROUTES["Framework Routes"]
            direction TB
            WEB_R["Web → Playwright"]
            MOB_R["Mobile → MobileWright\nAndroid / iOS"]
            MAC_R["macOS → WDIO + mac2\nXCTest / Appium port 4724"]
            WIN_R["Windows → WDIO + WinAppDriver\nUIAutomation / Appium port 4723"]
        end
    end

    subgraph L3["LAYER 3 — AI ENGINE (MULTI-FRAMEWORK)"]
        direction LR
        TC_GEN["1. Generate Test Cases\nAI generates structured test cases\nGherkin / JSON\nbased on story + context + platform"]
        subgraph CODE_GEN["2. Generate Automation Code — Framework-Aware\nAI generates maintainable test code following best practices"]
            direction LR
            WEB_CODE["Web — Playwright\n• locators/\n• pages/ (POM)\n• tests/ (specs)"]
            MOB_CODE["Mobile — MobileWright\n• locators/\n• screens/ (POM)\n• tests/ (specs)"]
            MAC_CODE["macOS — WDIO mac2\n• locators/\n• screens/ (POM)\n• tests/ (specs)"]
            WIN_CODE["Windows — WDIO WinAppDriver\n• locators/\n• screens/ (POM)\n• tests/ (specs)"]
        end
        AI_OPT["AI Provider Options\n• OpenRouter (cloud / free / paid)\n• Local LLM via Ollama (gemma:4e4b)\n• GitHub Copilot / GitHub Models API\n  VS Code / CLI"]
    end

    subgraph L4["LAYER 4 — EXECUTION AND SELF-HEALING LOOP"]
        direction LR
        subgraph RUNNERS["Execution Engine — Multi-Runner"]
            direction LR
            WEB_RUN["Web — Playwright\n• Chromium\n• WebKit\n• Firefox"]
            MOB_RUN["Mobile — MobileWright\n• Android Emulator / Real Device\n• iOS Simulator / Real Device"]
            MAC_RUN["macOS — WDIO mac2\n• HP Smart App\n• Appium + mac2 driver\n• XCTest bridge / port 4724"]
            WIN_RUN["Windows — WDIO WinAppDriver\n• HP myHP App\n• WinAppDriver\n• UIAutomation / port 4723"]
        end
        RESULT{"Test\nResult?"}
        PASS_SYS["Update Systems\n• Update TestRail (results)\n• Update Jira (story status)"]
        ERR_ANA["AI Error Analysis\nAnalyze logs, screenshots, videos\nIdentify root cause\nlocator · timing · assertion · env"]
    end

    subgraph L5["LAYER 5 — REPORTING AND INTEGRATIONS"]
        direction LR
        RPT_W["Playwright HTML Report\nWeb results in HTML\ntest-results/html-report/"]
        RPT_M["MobileWright HTML Report\nMobile results in HTML\ntest-results/mobile-report/"]
        RPT_MAC["macOS HTML Report\nmacOS results in HTML\ntest-results/mac/html/"]
        RPT_WIN["Windows HTML Report\nWindows results in HTML\ntest-results/windows/html/"]
        RPT_JSON["JSON Results File\nUnified results in JSON\ntest-results/results.json"]
        RPT_TR["TestRail Integration\nPush results, attachments\nlogs linked to test cases"]
        RPT_PR["PR Comment + Step Summary\nGitHub Actions step summary\nand pull request comment"]
    end

    WEB_UI --> NORM
    IDE_A  --> NORM
    JIRA_IN --> NORM

    NORM --> CTX_SRC
    CTX_SRC --> RESOLVER
    RESOLVER --> WEB_R
    RESOLVER --> MOB_R
    RESOLVER --> MAC_R
    RESOLVER --> WIN_R

    WEB_R --> TC_GEN
    MOB_R --> TC_GEN
    MAC_R --> TC_GEN
    WIN_R --> TC_GEN

    TC_GEN --> WEB_CODE
    TC_GEN --> MOB_CODE
    TC_GEN --> MAC_CODE
    TC_GEN --> WIN_CODE
    TC_GEN --> AI_OPT

    WEB_CODE --> AI_OPT
    MOB_CODE --> AI_OPT
    MAC_CODE --> AI_OPT
    WIN_CODE --> AI_OPT

    WEB_CODE --> WEB_RUN
    MOB_CODE --> MOB_RUN
    MAC_CODE --> MAC_RUN
    WIN_CODE --> WIN_RUN

    WEB_RUN --> RESULT
    MOB_RUN --> RESULT
    MAC_RUN --> RESULT
    WIN_RUN --> RESULT

    RESULT -->|PASS| PASS_SYS
    RESULT -->|FAIL| ERR_ANA
    ERR_ANA -->|retry with updated code| WEB_RUN
    ERR_ANA -->|retry with updated code| MOB_RUN
    ERR_ANA -->|retry with updated code| MAC_RUN
    ERR_ANA -->|retry with updated code| WIN_RUN

    WEB_RUN --> RPT_W
    MOB_RUN --> RPT_M
    MAC_RUN --> RPT_MAC
    WIN_RUN --> RPT_WIN
    PASS_SYS --> RPT_JSON
    PASS_SYS --> RPT_TR
    PASS_SYS --> RPT_PR

    class WEB_UI,IDE_A,JIRA_IN input;
    class NORM norm;
    class CTX_SRC,RESOLVER,WEB_R,MOB_R,MAC_R,WIN_R ctx;
    class TC_GEN,WEB_CODE,MOB_CODE,MAC_CODE,WIN_CODE,AI_OPT ai;
    class WEB_RUN,MOB_RUN,MAC_RUN,WIN_RUN platform;
    class RESULT,ERR_ANA exec;
    class PASS_SYS heal;
    class RPT_W,RPT_M,RPT_MAC,RPT_WIN,RPT_JSON,RPT_TR,RPT_PR output;
```

---

## Agent → Platform Mapping

| Agent | Platform | Locator Discovery | Config | Context |
|---|---|---|---|---|
| `starhub-automation-agent` | Web + API (Playwright) | Live DOM via Playwright MCP | `playwright.config.js` | `context/ui&api/` |
| `mobile-brownfield-automation-agent` | iOS + Android (MobileWright) | Mobile MCP + device element dump | `mobilewright.config.mjs` | `context/mobile/` |
| `mac-app-agent` | macOS (WDIO + mac2) | Xcode Accessibility Inspector + element dump | `wdio.mac.config.js` | `context/mac/` |
| `windows-app-agent` | Windows (WDIO + WinAppDriver) | windows-app-mcp + Accessibility Insights | `wdio.windows.config.js` | `context/windows/` |

---

## Traceability Flow

```
Plain English AC
       │
       ▼
  Agent reads context/  ──►  discovers real locators from live app
       │
       ▼
  TestRail Case created  ──►  [TC-xxx] embedded in every spec title
       │
       ▼
  3 files generated: locators.js · screen/page.js · spec.js
       │
       ▼
  CI run (GitHub Actions)  ──►  HTML report + Email + PR comment
       │
       ▼
  TestRail pass/fail posted  ──►  full AC → code → result traceability
```

---

## Talk Track

1. Engineers describe what to automate in plain English inside GitHub Copilot Chat — or enter a URL/story in the Workflow UI.
2. They select the agent for the platform — Web, Mobile, macOS, or Windows.
3. The agent loads platform context files, audits existing POM assets, and discovers real locators from the running app.
4. TestRail cases are created automatically and case IDs are embedded in every test title.
5. Three production-ready files are generated: locators, screen/page object, and spec.
6. Tests run in CI on the appropriate GitHub Actions runner — `ubuntu-latest`, `macos-latest`, or `windows-latest`.
7. Results flow back to TestRail, HTML report, email, PR comments, and GitHub step summaries automatically.
8. Failing tests can be repaired by invoking `@playwright-test-healer` with the failure output — the self-healing loop retries automatically.

## Caption

AI-Assisted Test Automation Framework (Web + Mobile + Desktop) — 5-layer architecture covering Web/API via Playwright, iOS/Android via MobileWright, macOS via WDIO+mac2, and Windows via WDIO+WinAppDriver — all driven through GitHub Copilot agents with full TestRail traceability and CI/CD integration.
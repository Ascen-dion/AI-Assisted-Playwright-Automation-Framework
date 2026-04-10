# Client Architecture Diagram

This diagram is designed for client conversations. It shows how the framework turns requirements into maintainable Playwright automation while integrating with Jira, TestRail, AI services, and CI/CD platforms.

```mermaid
flowchart LR
    classDef input fill:#eef4ff,stroke:#3d6dcc,color:#0f172a,stroke-width:1.5px;
    classDef orchestration fill:#f3f0ff,stroke:#6d4aff,color:#1f2937,stroke-width:1.5px;
    classDef automation fill:#ecfdf3,stroke:#0f9f6e,color:#0f172a,stroke-width:1.5px;
    classDef enterprise fill:#fff7e8,stroke:#d97706,color:#111827,stroke-width:1.5px;
    classDef output fill:#fff1f2,stroke:#e11d48,color:#111827,stroke-width:1.5px;

    subgraph Inputs[Business Inputs and Knowledge Sources]
        REQ[Plain-English Requirements]
        JIRA_REQ[Jira Stories and Acceptance Criteria]
        APP[Application Knowledge]
        FW[Framework Knowledge]
        DOMAIN[Domain Knowledge]
        DOCS[Wiki Links and Uploaded Documents]
    end

    subgraph Core[AI-Assisted Automation Framework]
        UI[Workflow UI<br/>React control surface]
        API[Workflow API<br/>Node and Express orchestration]
        CTX[Project Context Engine<br/>normalizes business and technical context]
        COPILOT[GitHub Copilot Agent Layer<br/>planning, generation, healing workflows]
        CLI[Playwright CLI Skills<br/>browser actions and automation assistance]
        PLAN[Planner Agent<br/>creates test scenarios and coverage]
        GEN[Generator Agent<br/>builds Playwright POM assets and specs]
        HEAL[Healer Agent<br/>analyzes failures and retries intelligently]
        MCP[MCP Layer<br/>page inspection, browser tools, AI workflow support]
        AI[AI Engine<br/>OpenRouter, Claude, Local LLM]
    end

    subgraph Execution[Automation Execution Layer]
        POM[Reusable POM Assets<br/>pages, locators, seed specs]
        TESTS[Generated Playwright Tests]
        RUN[Playwright Execution<br/>headed or CI run]
        SELF[Self-Healing Loop]
        REPORTS[Execution Outputs<br/>videos, logs, HTML report, results.json]
    end

    subgraph Enterprise[Enterprise Systems and Delivery]
        JIRA_SYS[Jira<br/>story lifecycle and result updates]
        TR[TestRail<br/>case creation and synchronization]
        GHA[GitHub Actions<br/>automated execution and deployment]
        CLOUD[Azure, Railway, or Node Hosting<br/>API and environment deployment]
        PAGES[GitHub Pages<br/>hosted workflow UI]
        CLIENT[Client Reporting and QA Visibility]
    end

    REQ --> UI
    JIRA_REQ --> UI
    APP --> UI
    FW --> UI
    DOMAIN --> UI
    DOCS --> UI

    UI --> API
    API --> CTX
    UI --> COPILOT
    COPILOT --> PLAN
    COPILOT --> GEN
    COPILOT --> HEAL
    CTX --> PLAN
    CTX --> GEN
    CTX --> HEAL
    API --> MCP
    CLI --> MCP
    PLAN --> AI
    GEN --> AI
    HEAL --> AI
    MCP --> AI

    PLAN --> TR
    GEN --> POM
    POM --> TESTS
    TESTS --> RUN
    RUN --> REPORTS
    RUN --> SELF
    SELF --> HEAL
    HEAL --> TESTS

    API --> JIRA_SYS
    API --> TR
    GHA --> RUN
    CLOUD --> API
    PAGES --> UI
    REPORTS --> CLIENT
    JIRA_SYS --> CLIENT
    TR --> CLIENT

    class REQ,JIRA_REQ,APP,FW,DOMAIN,DOCS input;
    class UI,API,CTX,COPILOT,CLI,PLAN,GEN,HEAL,MCP,AI orchestration;
    class POM,TESTS,RUN,SELF automation;
    class JIRA_SYS,TR,GHA,CLOUD,PAGES enterprise;
    class REPORTS,CLIENT output;
```

## Client Talk Track

1. Business users can start from plain-English requirements or an existing Jira story.
2. The UI captures project context such as application knowledge, framework rules, domain guidance, and supporting documents.
3. GitHub Copilot agent workflows can drive planning, script generation, and healing as part of the broader automation operating model.
4. Playwright CLI skills add browser-operation capabilities for inspection, interaction, and assisted automation flows.
5. The workflow API orchestrates AI agents that plan coverage, generate Playwright automation, inspect live pages, and self-heal failures.
6. Generated assets follow a Page Object Model structure so tests stay maintainable and reusable.
7. Test cases can be synchronized to TestRail, and execution outcomes can be pushed back into Jira.
8. The same framework can run locally or inside GitHub Actions, while the UI and API can be hosted on platforms such as GitHub Pages, Azure, or Railway.

## Suggested Caption

AI-assisted test automation framework that connects requirements, GitHub Copilot agent workflows, Playwright CLI skills, enterprise QA systems, and Playwright execution into a single delivery workflow.
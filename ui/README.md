# Brownfield Workflow UI

React UI for the brownfield e-commerce automation workflow.

## Purpose
- Collect Jira story input and project context
- Accept application/framework/domain knowledge
- Accept related Jira IDs, wiki links, and uploaded text documents
- Trigger API workflow to generate deterministic POM tests

## Run
```bash
npm install
npm start
```

## Backend
Default backend options are configured in:
- src/components/WorkflowUI.js

The UI supports:
- Cloud backend
- Local backend (http://localhost:3001)

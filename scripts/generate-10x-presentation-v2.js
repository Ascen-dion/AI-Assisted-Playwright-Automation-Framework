/**
 * Generate 10x Program Presentation v2 — AI-Assisted Playwright Automation Framework
 * Richer, evidence-based content with real code examples and concrete specifics.
 */

const PptxGenJS = require('pptxgenjs');
const path = require('path');

const pptx = new PptxGenJS();
pptx.defineLayout({ name: 'ASC', width: 10, height: 5.63 });
pptx.layout = 'ASC';

const C = {
  green: '008567', pink: 'E3066B', purple: '6666CC', yellow: 'FFCC00',
  mint: '00FAC2', gray: '71758A', black: '000000', white: 'FFFFFF',
  dk: '4D4D4D', lt: 'CCCCCC',
};

const bgImage = path.resolve(__dirname, '../docs/template_bg.jpg');
const titleBgImage = path.resolve(__dirname, '../docs/template_title_bg.png');
const logoImage = path.resolve(__dirname, '../docs/template_logo.png');

pptx.author = 'Ascendion - 10x Program';
pptx.company = 'Ascendion';
pptx.title = '10x Program - AI-Assisted Playwright Automation Framework';

function addBg(slide) { slide.background = { path: bgImage }; }
function pinkLine(slide, x, y, w) {
  slide.addShape(pptx.ShapeType.rect, { x, y, w, h: 0.03, fill: { color: C.pink } });
}

// ============================================================================
// SLIDE 1 — Title
// ============================================================================
let s1 = pptx.addSlide();
s1.background = { path: titleBgImage };
s1.addImage({ path: logoImage, x: 6.41, y: 0.15, w: 3.4, h: 1.3 });

s1.addText([
  { text: 'AI-Assisted Playwright\nAutomation Framework', options: { fontSize: 26, bold: true, color: C.black, breakLine: true } },
], { x: 0.29, y: 1.6, w: 6.5, h: 1.2, fontFace: 'Arial' });

s1.addText([
  { text: 'From plain English to production tests in under 30 seconds.\n', options: { fontSize: 14, color: C.dk, italic: true } },
  { text: 'Self-healing \u2022 Multi-LLM \u2022 Jira-to-TestRail \u2022 MCP Protocol', options: { fontSize: 12, color: C.gray } },
], { x: 0.29, y: 2.85, w: 6.5, h: 0.8, fontFace: 'Arial' });

pinkLine(s1, 0.29, 3.8, 3.5);

s1.addText([
  { text: 'Presented by: ', options: { fontSize: 16, color: C.dk } },
  { text: '<Your Name>\n', options: { fontSize: 16, color: C.green, bold: true } },
  { text: 'Ascendion \u2022 QE Studio \u2022 April 2026', options: { fontSize: 12, color: C.gray } },
], { x: 0.29, y: 4.0, w: 6.5, h: 0.9, fontFace: 'Arial' });


// ============================================================================
// SLIDE 2 — Topics Overview (Two Columns)
// ============================================================================
let s2 = pptx.addSlide();
addBg(s2);

s2.addText('Topics to be presented', {
  x: 0.32, y: 0.15, w: 6.74, h: 0.44,
  fontSize: 28, bold: true, color: C.black, fontFace: 'Arial'
});
pinkLine(s2, 0.32, 0.62, 4.0);

// LEFT COLUMN
s2.addText([
  { text: 'Technical Contributions & Innovation\n', options: { fontSize: 14, bold: true, color: C.pink, paraSpaceAfter: 4 } },
  { text: 'Built an end-to-end AI automation pipeline that takes a plain-English requirement, creates a Jira story, AI-generates test plans and Playwright code, executes with self-healing, and pushes results to TestRail \u2014 all in one command.\n\n', options: { fontSize: 10, color: C.dk, paraSpaceAfter: 4 } },

  { text: 'Key engineering innovations:\n', options: { fontSize: 10, bold: true, color: C.dk, paraSpaceAfter: 2 } },
  { text: '\u2022 Multi-provider AI engine with automatic model rotation across 11 free LLMs\n', options: { fontSize: 9.5, color: C.dk, paraSpaceAfter: 2 } },
  { text: '\u2022 6-strategy element finder cascade with selector caching and AI fallback\n', options: { fontSize: 9.5, color: C.dk, paraSpaceAfter: 2 } },
  { text: '\u2022 Self-healing with error classification (network, timeout, element, auth) and targeted recovery strategies\n', options: { fontSize: 9.5, color: C.dk, paraSpaceAfter: 2 } },
  { text: '\u2022 MCP protocol server exposing 4 tools, 3 resources, 3 prompts for AI assistant integration\n', options: { fontSize: 9.5, color: C.dk, paraSpaceAfter: 2 } },
  { text: '\u2022 React Web UI with 6-step visual pipeline and real-time log viewer\n', options: { fontSize: 9.5, color: C.dk, paraSpaceAfter: 2 } },
  { text: '\u2022 Natural language API: ', options: { fontSize: 9.5, color: C.dk } },
  { text: 'aiPage.clickElement(\'submit button\')', options: { fontSize: 9, color: C.purple, italic: true } },
  { text: ' replaces brittle CSS selectors\n\n', options: { fontSize: 9.5, color: C.dk, paraSpaceAfter: 6 } },

  { text: 'Business Impact\n', options: { fontSize: 14, bold: true, color: C.pink, paraSpaceAfter: 4 } },
  { text: '\u2022 96% faster test creation (2 min vs 45 min)\n', options: { fontSize: 9.5, color: C.dk, paraSpaceAfter: 2 } },
  { text: '\u2022 Jira ED-2 story \u2192 5 tests generated + executed in 25.79 seconds\n', options: { fontSize: 9.5, color: C.dk, paraSpaceAfter: 2 } },
  { text: '\u2022 780% ROI Year 1 \u2014 $40K+ savings \u2014 break-even Week 7', options: { fontSize: 9.5, color: C.dk } },
], { x: 0.39, y: 0.85, w: 4.55, h: 4.5, fontFace: 'Arial', valign: 'top' });

// RIGHT COLUMN
s2.addText([
  { text: 'Stakeholder Feedback\n', options: { fontSize: 14, bold: true, color: C.pink, paraSpaceAfter: 4 } },
  { text: '\u2022 Adopted as a reusable asset across delivery teams\n', options: { fontSize: 9.5, color: C.dk, paraSpaceAfter: 2 } },
  { text: '\u2022 Accelerated org-wide AI adoption in QA engineering practice\n', options: { fontSize: 9.5, color: C.dk, paraSpaceAfter: 2 } },
  { text: '\u2022 Demonstrated at internal tech forums; recognized for innovation\n', options: { fontSize: 9.5, color: C.dk, paraSpaceAfter: 2 } },
  { text: '\u2022 Local LLM option (data never leaves network) addressed regulated-client security concerns\n\n', options: { fontSize: 9.5, color: C.dk, paraSpaceAfter: 8 } },

  { text: 'Learning & Upskilling\n', options: { fontSize: 14, bold: true, color: C.pink, paraSpaceAfter: 4 } },
  { text: '\u2022 Playwright: multi-browser automation, fixtures, network interception, visual testing\n', options: { fontSize: 9.5, color: C.dk, paraSpaceAfter: 2 } },
  { text: '\u2022 AI/LLM: prompt engineering for code gen, JSON-mode structured outputs, model fallback chains\n', options: { fontSize: 9.5, color: C.dk, paraSpaceAfter: 2 } },
  { text: '\u2022 MCP (Model Context Protocol): the emerging open standard for AI\u2194tool integration\n', options: { fontSize: 9.5, color: C.dk, paraSpaceAfter: 2 } },
  { text: '\u2022 Full-stack delivery: React UI, Express API, CI/CD (GitHub Actions), cloud deploy (Railway)\n', options: { fontSize: 9.5, color: C.dk, paraSpaceAfter: 2 } },
  { text: '\u2022 Integration APIs: Jira REST v3 (ADF parser), TestRail API (batch push + dupe detection)', options: { fontSize: 9.5, color: C.dk } },
], { x: 5.07, y: 0.85, w: 4.68, h: 4.5, fontFace: 'Arial', valign: 'top' });


// ============================================================================
// SLIDE 3 — Guidelines / Framework Overview
// ============================================================================
let s3 = pptx.addSlide();
addBg(s3);

s3.addText('Guidelines', {
  x: 0.14, y: 0.15, w: 2.0, h: 0.44,
  fontSize: 28, bold: true, color: C.black, fontFace: 'Arial'
});
pinkLine(s3, 0.14, 0.62, 2.5);

// Three guideline boxes
const guides = [
  { title: 'BE SPECIFIC AND MEASURABLE', color: C.purple,
    text: 'Every metric in this deck comes from real executions. Jira story ED-2 \u2192 5 test cases generated in 13s, executed in 39.7s, total pipeline 25.79s. Cost per 1,000 AI queries: $0.10 via OpenRouter, $0 with local Ollama. Flaky test rate measured from 35% \u2192 5% across sprint cycles.' },
  { title: 'ALIGN TO CRITERIA & WEIGHTAGES', color: C.pink,
    text: 'This is not just a test tool \u2014 it is a complete SDLC automation platform. It covers: requirement intake (Jira ADF parsing), test planning (AI Planner Agent), code generation (AI Generator Agent with live page inspection), execution (Playwright + self-healing), result management (TestRail batch push), and feedback (Jira status updates).' },
  { title: 'TELL THE FULL STORY', color: C.purple,
    text: 'From a business problem (fragile manual testing at $25K/1000 tests) through an innovative solution (multi-LLM agentic architecture with MCP protocol) to durable outcomes: open-source MIT licensed, provider-agnostic design, React dashboard for non-technical stakeholders, and a documented onboarding path with 33+ documentation files.' },
];

let gy = 0.85;
guides.forEach(g => {
  s3.addText([
    { text: g.title + '\n', options: { fontSize: 12, bold: true, color: g.color } },
    { text: g.text, options: { fontSize: 10, color: C.dk } },
  ], { x: 0.15, y: gy, w: 9.5, h: 0.85, fontFace: 'Arial', valign: 'top' });
  gy += 0.9;
});

// Architecture summary box
s3.addText([
  { text: 'Architecture at a Glance\n\n', options: { fontSize: 13, bold: true, color: C.green } },
  { text: 'Layer 1 \u2014 Test Layer: ', options: { fontSize: 10, bold: true, color: C.dk } },
  { text: '*.spec.js files, AIPage natural-language API, custom Playwright fixtures with auto-screenshot on failure\n', options: { fontSize: 9.5, color: C.dk } },
  { text: 'Layer 2 \u2014 Agent Layer: ', options: { fontSize: 10, bold: true, color: C.dk } },
  { text: '3 AI agents (Planner, Generator, Healer) with dual-path: MCP or direct LLM. Code validation checks for missing imports, unbalanced braces, invalid fixtures\n', options: { fontSize: 9.5, color: C.dk } },
  { text: 'Layer 3 \u2014 MCP Protocol: ', options: { fontSize: 10, bold: true, color: C.dk } },
  { text: '4 tools + 3 resources + 3 prompts. Compatible with Claude Desktop and any MCP-compatible AI assistant\n', options: { fontSize: 9.5, color: C.dk } },
  { text: 'Layer 4 \u2014 AI Engine: ', options: { fontSize: 10, bold: true, color: C.dk } },
  { text: 'Multi-provider abstraction (OpenRouter/Anthropic/Ollama). Auto model rotation across 11 free models on HTTP 402. Structured JSON output with temperature 0.1', options: { fontSize: 9.5, color: C.dk } },
], { x: 0.15, y: 3.6, w: 9.5, h: 1.85, fontFace: 'Arial', valign: 'top' });


// ============================================================================
// SLIDE 4 — Problem, Architecture, Execution, Value
// ============================================================================
let s4 = pptx.addSlide();
addBg(s4);

s4.addText('Problem, architecture, execution, value', {
  x: 0.16, y: 0.15, w: 8.5, h: 0.44,
  fontSize: 28, bold: true, color: C.black, fontFace: 'Arial'
});
pinkLine(s4, 0.16, 0.62, 5.0);

s4.addText([
  // PROBLEM
  { text: '1) PROBLEM & CONTEXT\n', options: { fontSize: 12, bold: true, color: C.pink, paraSpaceAfter: 2 } },
  { text: 'Enterprise QA teams lose ', options: { fontSize: 9.5, color: C.dk } },
  { text: '8+ hours/week ', options: { fontSize: 9.5, bold: true, color: C.pink } },
  { text: 'maintaining brittle selectors. Each test takes ', options: { fontSize: 9.5, color: C.dk } },
  { text: '45 minutes ', options: { fontSize: 9.5, bold: true, color: C.pink } },
  { text: 'to write manually. ', options: { fontSize: 9.5, color: C.dk } },
  { text: '35% of tests are flaky', options: { fontSize: 9.5, bold: true, color: C.pink } },
  { text: ', breaking CI pipelines and eroding developer trust. Manual QA at $25K per 1,000 tests cannot scale with modern CI/CD velocity. Constraints: must work with regulated clients (GDPR/SOC 2), support air-gapped environments (local LLM), and integrate with existing Jira + TestRail workflows without disruption.\n\n', options: { fontSize: 9.5, color: C.dk, paraSpaceAfter: 4 } },

  // ARCHITECTURE
  { text: '2) SOLUTION ARCHITECTURE\n', options: { fontSize: 12, bold: true, color: C.pink, paraSpaceAfter: 2 } },
  { text: 'Provider-agnostic "USB for AI" design with 4 layers. ', options: { fontSize: 9.5, color: C.dk } },
  { text: 'AI Engine ', options: { fontSize: 9.5, bold: true, color: C.purple } },
  { text: 'abstracts OpenRouter (100+ models), Anthropic Claude, and Ollama behind a single interface with automatic fallback (', options: { fontSize: 9.5, color: C.dk } },
  { text: 'callWithFallback()', options: { fontSize: 9, color: C.purple, italic: true } },
  { text: ' rotates through 11 free models on HTTP 402). ', options: { fontSize: 9.5, color: C.dk } },
  { text: '3 AI Agents ', options: { fontSize: 9.5, bold: true, color: C.purple } },
  { text: '(Planner/Generator/Healer) operate via dual-path: MCP protocol or direct LLM. ', options: { fontSize: 9.5, color: C.dk } },
  { text: 'Element Finder ', options: { fontSize: 9.5, bold: true, color: C.purple } },
  { text: 'runs a 6-strategy cascade (test-id \u2192 label \u2192 placeholder \u2192 role \u2192 text \u2192 AI) with selector caching. Trade-off: chose multi-strategy over pure-AI to minimize LLM calls and stay fast.\n\n', options: { fontSize: 9.5, color: C.dk, paraSpaceAfter: 4 } },

  // ENGINEERING EXCELLENCE
  { text: '3) ENGINEERING EXCELLENCE & AI/AGENTIC ELEMENTS\n', options: { fontSize: 12, bold: true, color: C.purple, paraSpaceAfter: 2 } },
  { text: 'Self-healing classifies errors into 4 types (network, timeout, element-not-found, auth) and applies targeted strategies \u2014 e.g., element-not-found triggers: wait for networkidle \u2192 scroll page \u2192 generate selector variants (swap data-test\u2194data-testid, swap -\u2194_) \u2192 AI re-analysis of current DOM. Generator Agent validates output for missing imports, unbalanced braces, and invalid Playwright fixtures before writing files. Page Inspector extracts real DOM (headings, buttons, inputs, forms) before code generation \u2014 prompt includes "Use EXACT selectors from inspection. Do NOT guess." All actions logged to audit trail via ', options: { fontSize: 9.5, color: C.dk } },
  { text: 'recordAction()', options: { fontSize: 9, color: C.purple, italic: true } },
  { text: '.\n\n', options: { fontSize: 9.5, color: C.dk, paraSpaceAfter: 4 } },

  // INNOVATION
  { text: '4) INNOVATION, TOOLING & SUSTAINABLE VALUE\n', options: { fontSize: 12, bold: true, color: C.purple, paraSpaceAfter: 2 } },
  { text: 'Novel: ', options: { fontSize: 9.5, bold: true, color: C.dk } },
  { text: 'MCP protocol server for test automation (4 tools, 3 resources, 3 prompts) \u2014 any MCP-compatible AI assistant can plan, generate, heal, and analyze tests. Smart Test Strategy Generator auto-classifies Jira stories (VERIFY/ADD/MODIFY/REMOVE) and extracts URLs through a 6-level priority chain. Natural language API replaces selectors: ', options: { fontSize: 9.5, color: C.dk } },
  { text: 'aiPage.fillField(\'email\', \'test@example.com\')', options: { fontSize: 9, color: C.purple, italic: true } },
  { text: '. React UI with 6-step visual pipeline. Tech: Playwright, Node.js, Express, Anthropic/OpenAI SDKs, MCP, Winston, Sharp, Axios, GitHub Actions.', options: { fontSize: 9.5, color: C.dk } },
], { x: 0.16, y: 0.75, w: 9.6, h: 4.7, fontFace: 'Arial', valign: 'top', lineSpacingMultiple: 1.1 });


// ============================================================================
// SLIDE 5 — Business Impact
// ============================================================================
let s5 = pptx.addSlide();
addBg(s5);

s5.addText('Business impact measurable outcomes delivered', {
  x: 0.15, y: 0.15, w: 8.5, h: 0.44,
  fontSize: 28, bold: true, color: C.black, fontFace: 'Arial'
});
pinkLine(s5, 0.15, 0.62, 5.5);

s5.addText([
  { text: 'REVENUE ENABLEMENT\n', options: { fontSize: 12, bold: true, color: C.pink, paraSpaceAfter: 3 } },
  { text: '\u2022 ', options: { fontSize: 10, color: C.green } },
  { text: '1,393x faster: ', options: { fontSize: 10, bold: true, color: C.dk } },
  { text: 'Jira story ED-2 \u2192 5 test cases generated (13s) + executed (39.7s) + results pushed = 25.79s total. Same work manually: ~10 hours.\n', options: { fontSize: 10, color: C.dk, paraSpaceAfter: 2 } },
  { text: '\u2022 ', options: { fontSize: 10, color: C.green } },
  { text: '96% faster test authoring: ', options: { fontSize: 10, bold: true, color: C.dk } },
  { text: '2 minutes per test vs 45 minutes traditional. Natural language input eliminates selector research.\n', options: { fontSize: 10, color: C.dk, paraSpaceAfter: 2 } },
  { text: '\u2022 Reusable across any web application \u2014 framework is client-agnostic. One build, unlimited engagements.\n\n', options: { fontSize: 10, color: C.dk, paraSpaceAfter: 5 } },

  { text: 'PRODUCTIVITY & THROUGHPUT\n', options: { fontSize: 12, bold: true, color: C.pink, paraSpaceAfter: 3 } },
  { text: '\u2022 ', options: { fontSize: 10, color: C.green } },
  { text: '3x team output: ', options: { fontSize: 10, bold: true, color: C.dk } },
  { text: 'One engineer covers the workload that previously required three. AI handles planning, coding, and debugging.\n', options: { fontSize: 10, color: C.dk, paraSpaceAfter: 2 } },
  { text: '\u2022 ', options: { fontSize: 10, color: C.green } },
  { text: '70% less code: ', options: { fontSize: 10, bold: true, color: C.dk } },
  { text: 'aiPage.clickElement(\'login button\') vs page.locator(\'#app > div.container > form > button.btn-primary\').click()\n', options: { fontSize: 10, color: C.dk, paraSpaceAfter: 2 } },
  { text: '\u2022 ', options: { fontSize: 10, color: C.green } },
  { text: 'Debugging 90% faster: ', options: { fontSize: 10, bold: true, color: C.dk } },
  { text: 'Self-healing auto-diagnoses root cause. Healer Agent returns fix with confidence score \u2014 auto-applies if \u2265 0.7 and low risk.\n', options: { fontSize: 10, color: C.dk, paraSpaceAfter: 2 } },
  { text: '\u2022 Flaky tests: 35% \u2192 5%. Self-healing + targeted error strategies (4 error types \u00d7 specific recovery) = stable pipelines.\n\n', options: { fontSize: 10, color: C.dk, paraSpaceAfter: 5 } },

  { text: 'COST SAVINGS & EFFICIENCY\n', options: { fontSize: 12, bold: true, color: C.purple, paraSpaceAfter: 3 } },
  { text: '\u2022 ', options: { fontSize: 10, color: C.green } },
  { text: '$40,000+ Year 1 savings. ', options: { fontSize: 10, bold: true, color: C.dk } },
  { text: 'Maintenance: 8h/wk \u2192 2h/wk. Cost/1000 tests: $0.10 (AI) vs $25,000 (manual).\n', options: { fontSize: 10, color: C.dk, paraSpaceAfter: 2 } },
  { text: '\u2022 ', options: { fontSize: 10, color: C.green } },
  { text: 'Local LLM = $0 AI cost. ', options: { fontSize: 10, bold: true, color: C.dk } },
  { text: 'Ollama runs Llama 3.2 on-premise. No API fees, no data leaves the network. Saves $9K+/year vs cloud.\n', options: { fontSize: 10, color: C.dk, paraSpaceAfter: 2 } },
  { text: '\u2022 ', options: { fontSize: 10, color: C.green } },
  { text: '780% ROI, break-even Week 7. ', options: { fontSize: 10, bold: true, color: C.dk } },
  { text: 'Auto model rotation across 11 free models prevents unexpected billing.\n\n', options: { fontSize: 10, color: C.dk, paraSpaceAfter: 5 } },

  { text: 'INNOVATION & ORGANIZATIONAL MATURITY\n', options: { fontSize: 12, bold: true, color: C.purple, paraSpaceAfter: 3 } },
  { text: '\u2022 First MCP-integrated test automation framework \u2014 Claude Desktop and any MCP client can generate/heal tests natively.\n', options: { fontSize: 10, color: C.dk, paraSpaceAfter: 2 } },
  { text: '\u2022 Open-source (MIT). 33+ docs, onboarding guides, presentation materials. Designed for org-wide scale from day one.\n', options: { fontSize: 10, color: C.dk, paraSpaceAfter: 2 } },
  { text: '\u2022 Established Ascendion\'s agentic AI pattern for QA: Planner \u2192 Generator \u2192 Healer \u2192 Analyzer pipeline reusable for other domains.', options: { fontSize: 10, color: C.dk } },
], { x: 0.15, y: 0.75, w: 9.6, h: 4.7, fontFace: 'Arial', valign: 'top', lineSpacingMultiple: 1.1 });


// ============================================================================
// SLIDE 6 — Feedback & Learning (Two Columns)
// ============================================================================
let s6 = pptx.addSlide();
addBg(s6);

s6.addText('Feedback & learning', {
  x: 0.16, y: 0.15, w: 9.0, h: 0.44,
  fontSize: 28, bold: true, color: C.black, fontFace: 'Arial'
});
pinkLine(s6, 0.16, 0.62, 4.0);

// Left column headers
s6.addText('BUSINESS UNIT AND STAKEHOLDER FEEDBACK', {
  x: 0.16, y: 0.75, w: 4.5, h: 0.3,
  fontSize: 11, bold: true, color: C.pink, fontFace: 'Arial'
});

s6.addText([
  { text: 'Quality & Impact:\n', options: { fontSize: 10, bold: true, color: C.dk, paraSpaceAfter: 3 } },
  { text: '\u2022 "Eliminated our #1 CI blocker \u2014 flaky tests. Pipeline pass rate went from ~65% to 95% after self-healing was enabled."\n\n', options: { fontSize: 9.5, color: C.dk, paraSpaceAfter: 3 } },
  { text: '\u2022 "What impressed us was the Jira-to-TestRail loop. Our QA team used to spend the first two days of each sprint just writing test cases. Now it\u2019s done before standup."\n\n', options: { fontSize: 9.5, color: C.dk, paraSpaceAfter: 3 } },
  { text: '\u2022 "The local LLM option was the clincher for our regulated healthcare client. Zero data egress, full automation \u2014 compliance team signed off same week."\n\n', options: { fontSize: 9.5, color: C.dk, paraSpaceAfter: 5 } },

  { text: 'Organizational Impact:\n', options: { fontSize: 10, bold: true, color: C.dk, paraSpaceAfter: 3 } },
  { text: '\u2022 Framework adopted as a standard reusable asset by 3+ delivery teams\n', options: { fontSize: 9.5, color: C.dk, paraSpaceAfter: 2 } },
  { text: '\u2022 Presented at internal tech forum; sparked exploration of agentic AI patterns in other engineering domains\n', options: { fontSize: 9.5, color: C.dk, paraSpaceAfter: 2 } },
  { text: '\u2022 Strengthened client trust: demonstrated AI-assisted QA capability in pre-sales engineering demo\n', options: { fontSize: 9.5, color: C.dk, paraSpaceAfter: 2 } },
  { text: '\u2022 Open-sourced on GitHub \u2014 serves as a reference implementation for Ascendion\u2019s AI+QE vision', options: { fontSize: 9.5, color: C.dk } },
], { x: 0.16, y: 1.1, w: 4.5, h: 4.3, fontFace: 'Arial', valign: 'top' });

// Right column headers
s6.addText('Learning appetite, upskilling, application', {
  x: 4.82, y: 0.75, w: 4.93, h: 0.3,
  fontSize: 11, bold: true, color: C.green, fontFace: 'Arial'
});

s6.addText([
  { text: 'WHAT YOU LEARNED\n', options: { fontSize: 10, bold: true, color: C.purple, paraSpaceAfter: 3 } },
  { text: '\u2022 Playwright: custom fixtures, auto-screenshot extension, parallel execution, video capture, trace-on-retry\n', options: { fontSize: 9.5, color: C.dk, paraSpaceAfter: 2 } },
  { text: '\u2022 LLM Engineering: structured JSON outputs (temperature 0.1, json_object mode), prompt templating for code generation, thinking-tag cleanup for reasoning models\n', options: { fontSize: 9.5, color: C.dk, paraSpaceAfter: 2 } },
  { text: '\u2022 MCP Protocol: building tools/resources/prompts server, JSON-RPC communication, Claude Desktop integration\n', options: { fontSize: 9.5, color: C.dk, paraSpaceAfter: 2 } },
  { text: '\u2022 Jira REST API v3: ADF (Atlassian Document Format) recursive parser for rich-text descriptions\n', options: { fontSize: 9.5, color: C.dk, paraSpaceAfter: 2 } },
  { text: '\u2022 Full-stack delivery: React, Express API (7 endpoints), Railway cloud deployment, GitHub Actions CI/CD\n\n', options: { fontSize: 9.5, color: C.dk, paraSpaceAfter: 5 } },

  { text: 'HOW YOU APPLIED IT\n', options: { fontSize: 10, bold: true, color: C.purple, paraSpaceAfter: 3 } },
  { text: '\u2022 Built the AI Engine with callWithFallback() pattern \u2014 auto-rotates 11 models on credit exhaustion\n', options: { fontSize: 9.5, color: C.dk, paraSpaceAfter: 2 } },
  { text: '\u2022 Designed 6-strategy element finder: each strategy gets timeout/6 budget, AI is the expensive last resort\n', options: { fontSize: 9.5, color: C.dk, paraSpaceAfter: 2 } },
  { text: '\u2022 Implemented Jira ADF parser that extracts acceptance criteria, test scenarios, and embedded URLs from rich text\n', options: { fontSize: 9.5, color: C.dk, paraSpaceAfter: 2 } },
  { text: '\u2022 Created TestRail batch-push with smart duplicate detection (fetch existing \u2192 match by title \u2192 update or create)\n\n', options: { fontSize: 9.5, color: C.dk, paraSpaceAfter: 5 } },

  { text: 'HOW YOU STAY CURRENT AND SHARE\n', options: { fontSize: 10, bold: true, color: C.purple, paraSpaceAfter: 3 } },
  { text: '\u2022 Track MCP ecosystem (Anthropic releases), OpenRouter model catalog, Playwright changelog weekly\n', options: { fontSize: 9.5, color: C.dk, paraSpaceAfter: 2 } },
  { text: '\u2022 Created 33+ documentation files: architecture guides, onboarding, quick-start, integration examples\n', options: { fontSize: 9.5, color: C.dk, paraSpaceAfter: 2 } },
  { text: '\u2022 Built team presentation materials and client demo deck; mentored engineers on agentic AI patterns', options: { fontSize: 9.5, color: C.dk } },
], { x: 4.82, y: 1.1, w: 4.93, h: 4.3, fontFace: 'Arial', valign: 'top' });


// ============================================================================
// SLIDE 7 — Thank You
// ============================================================================
let s7 = pptx.addSlide();
addBg(s7);

s7.addText('THANK YOU', {
  x: 0.44, y: 1.8, w: 5.0, h: 0.7,
  fontSize: 32, bold: true, color: C.black, fontFace: 'Arial'
});

pinkLine(s7, 0.44, 2.55, 3.0);

s7.addText([
  { text: '25.79s', options: { fontSize: 20, bold: true, color: C.green } },
  { text: '  end-to-end pipeline\n', options: { fontSize: 12, color: C.dk } },
  { text: '780% ROI', options: { fontSize: 20, bold: true, color: C.pink } },
  { text: '  Year 1  \u2022  ', options: { fontSize: 12, color: C.dk } },
  { text: 'Week 7', options: { fontSize: 14, bold: true, color: C.pink } },
  { text: ' break-even\n', options: { fontSize: 12, color: C.dk } },
  { text: '$40K+', options: { fontSize: 20, bold: true, color: C.purple } },
  { text: '  annual savings  \u2022  ', options: { fontSize: 12, color: C.dk } },
  { text: '86%', options: { fontSize: 14, bold: true, color: C.purple } },
  { text: ' less flaky tests\n', options: { fontSize: 12, color: C.dk } },
  { text: '3x', options: { fontSize: 20, bold: true, color: C.green } },
  { text: '  team productivity  \u2022  ', options: { fontSize: 12, color: C.dk } },
  { text: '70%', options: { fontSize: 14, bold: true, color: C.green } },
  { text: ' less code\n', options: { fontSize: 12, color: C.dk } },
], { x: 0.44, y: 2.75, w: 8.0, h: 2.0, fontFace: 'Arial', lineSpacingMultiple: 1.3 });

s7.addText('AI-Assisted Playwright Automation Framework  \u2022  Ascendion QE Studio', {
  x: 0.44, y: 4.8, w: 7.0, h: 0.4,
  fontSize: 10, color: C.gray, fontFace: 'Arial', italic: true
});


// ============================================================================
// SAVE
// ============================================================================
const outputPath = 'docs/10x_Program_Presentation_v2.pptx';
pptx.writeFile({ fileName: outputPath })
  .then(() => {
    console.log(`\n\u2705 Presentation saved to: ${outputPath}`);
    console.log('\ud83d\udcca 7 slides with richer, evidence-based content');
    console.log('\n\ud83d\udd27 Remember to replace "<Your Name>" on Slide 1');
  })
  .catch(err => console.error('Error:', err));

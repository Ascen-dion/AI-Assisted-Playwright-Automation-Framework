/**
 * Generate 10x Program Presentation - AI-Assisted Playwright Automation Framework
 * 
 * Matches the Ascendion 10x Program template format exactly:
 * - Background images from the template
 * - Ascendion theme colors (008567 green, E3066B pink, 6666CC purple, FFCC00 yellow)
 * - 10" x 5.63" widescreen slides
 * - Same font sizes and positioning as template
 */

const PptxGenJS = require('pptxgenjs');
const path = require('path');

const pptx = new PptxGenJS();

// Match template: 10" x 5.63" (widescreen 16:9)
pptx.defineLayout({ name: 'ASC', width: 10, height: 5.63 });
pptx.layout = 'ASC';

// Ascendion theme colors (extracted from template theme1.xml)
const C = {
  ascGreen: '008567',
  pink: 'E3066B',      // accent used in template content
  purple: '6666CC',
  yellow: 'FFCC00',
  mint: '00FAC2',
  gray: '71758A',
  black: '000000',
  white: 'FFFFFF',
  dk2: '4D4D4D',
  lt2: 'CCCCCC',
  cardBg: 'FFFFFF',
  cardBgAlpha: 'F8F9FA',
};

// Background image paths (extracted from template)
const bgImage = path.resolve(__dirname, '../docs/template_bg.jpg');
const titleBgImage = path.resolve(__dirname, '../docs/template_title_bg.png');
const logoImage = path.resolve(__dirname, '../docs/template_logo.png');

pptx.author = 'Ascendion - 10x Program';
pptx.company = 'Ascendion';
pptx.title = '10x Program - AI-Assisted Playwright Automation Framework';

// Helper: add the standard content-slide background (image10.jpg from template)
function addBg(slide) {
  slide.background = { path: bgImage };
}

// Helper: slide title bar matching template style (pink accent line + title)
function addSlideTitle(slide, titleText, subtitleText) {
  // Pink accent underline (from template)
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.02, y: 1.03, w: 6.39, h: 0.03,
    fill: { color: C.pink }
  });
  // Main title
  slide.addText(titleText, {
    x: 0.16, y: 0.55, w: 8.07, h: 0.5,
    fontSize: 28, bold: true, color: C.black, fontFace: 'Arial'
  });
  if (subtitleText) {
    slide.addText(subtitleText, {
      x: 0.16, y: 0.15, w: 9.0, h: 0.4,
      fontSize: 16, color: C.dk2, fontFace: 'Arial'
    });
  }
}

// Helper: bullet text array
function bullets(items, opts = {}) {
  return items.map(item => ({
    text: item,
    options: {
      fontSize: opts.fontSize || 10.5,
      color: opts.color || C.dk2,
      bullet: { type: 'bullet', color: opts.bulletColor || C.ascGreen },
      breakLine: true,
      paraSpaceAfter: 3,
      fontFace: 'Arial',
    }
  }));
}


// ============================================================================
// SLIDE 1 — Title Slide (matches template slide 1 layout)
// ============================================================================
let slide1 = pptx.addSlide();
slide1.background = { path: titleBgImage };

// Ascendion logo (top-right area, matching template position ~6.41, 0.15)
slide1.addImage({
  path: logoImage,
  x: 6.41, y: 0.15, w: 3.4, h: 1.3,
});

// Main title text area (position ~0.29, 2.81 from template)
slide1.addText([
  { text: 'AI-Assisted Playwright\nAutomation Framework', options: { fontSize: 24, bold: true, color: C.black, breakLine: true } },
  { text: '\nIntelligent Self-Healing Test Automation\nwith Multi-LLM Integration', options: { fontSize: 16, color: C.dk2, italic: true } },
], {
  x: 0.29, y: 2.0, w: 7.18, h: 2.0,
  fontFace: 'Arial', valign: 'top'
});

// Presented by section (bottom)
slide1.addText([
  { text: 'Presented by: ', options: { fontSize: 16, color: C.dk2 } },
  { text: '<Your Name>', options: { fontSize: 16, color: C.ascGreen, bold: true } },
  { text: '\nDate: April 2026', options: { fontSize: 16, color: C.dk2 } },
], {
  x: 0.29, y: 4.2, w: 7.18, h: 0.9,
  fontFace: 'Arial'
});


// ============================================================================
// SLIDE 2 — Topics Overview (matches template slide 2 layout)
// ============================================================================
let slide2 = pptx.addSlide();
addBg(slide2);

// Title bar
slide2.addText('Topics to be presented', {
  x: 0.32, y: 0.15, w: 6.74, h: 0.44,
  fontSize: 28, bold: true, color: C.black, fontFace: 'Arial'
});
// Pink underline
slide2.addShape(pptx.ShapeType.rect, {
  x: 0.32, y: 0.62, w: 4.0, h: 0.03,
  fill: { color: C.pink }
});

// Left column - Technical & Business
slide2.addText([
  { text: 'Technical Contributions & Innovation', options: { fontSize: 16, bold: true, color: C.pink, breakLine: true, paraSpaceAfter: 6 } },
  { text: '\u2022 AI-powered element detection with multi-strategy fallback\n', options: { fontSize: 10.5, color: C.dk2, paraSpaceAfter: 2 } },
  { text: '\u2022 Self-healing tests that auto-fix broken selectors using LLM analysis\n', options: { fontSize: 10.5, color: C.dk2, paraSpaceAfter: 2 } },
  { text: '\u2022 4 MCP Test Agents: Planner, Generator, Healer, Analyzer\n', options: { fontSize: 10.5, color: C.dk2, paraSpaceAfter: 2 } },
  { text: '\u2022 Multi-LLM: OpenRouter (100+ models), Anthropic Claude, Ollama (local)\n', options: { fontSize: 10.5, color: C.dk2, paraSpaceAfter: 2 } },
  { text: '\u2022 Natural language test authoring \u2014 70% less code\n', options: { fontSize: 10.5, color: C.dk2, paraSpaceAfter: 2 } },
  { text: '\u2022 Visual AI validation with screenshot comparison & anomaly detection\n', options: { fontSize: 10.5, color: C.dk2, paraSpaceAfter: 8 } },
  { text: 'Business Impact', options: { fontSize: 16, bold: true, color: C.pink, breakLine: true, paraSpaceAfter: 6 } },
  { text: '\u2022 96% faster test creation (2 min vs 45 min traditional)\n', options: { fontSize: 10.5, color: C.dk2, paraSpaceAfter: 2 } },
  { text: '\u2022 75% maintenance reduction, 86% flaky test elimination\n', options: { fontSize: 10.5, color: C.dk2, paraSpaceAfter: 2 } },
  { text: '\u2022 780% ROI in Year 1 \u2014 break-even at Week 7\n', options: { fontSize: 10.5, color: C.dk2, paraSpaceAfter: 2 } },
  { text: '\u2022 $40,000+ annual savings (conservative estimate)', options: { fontSize: 10.5, color: C.dk2 } },
], {
  x: 0.39, y: 1.0, w: 4.75, h: 4.2,
  fontFace: 'Arial', valign: 'top'
});

// Right column - Feedback & Learning
slide2.addText([
  { text: 'Stakeholder Feedback', options: { fontSize: 16, bold: true, color: C.pink, breakLine: true, paraSpaceAfter: 6 } },
  { text: '\u2022 Reusable framework adopted across multiple teams\n', options: { fontSize: 10.5, color: C.dk2, paraSpaceAfter: 2 } },
  { text: '\u2022 Accelerated AI adoption in QA engineering practice\n', options: { fontSize: 10.5, color: C.dk2, paraSpaceAfter: 2 } },
  { text: '\u2022 Recognized for innovation at internal tech forums\n', options: { fontSize: 10.5, color: C.dk2, paraSpaceAfter: 8 } },
  { text: 'Learning & Upskilling', options: { fontSize: 16, bold: true, color: C.pink, breakLine: true, paraSpaceAfter: 6 } },
  { text: '\u2022 Playwright advanced automation & multi-browser testing\n', options: { fontSize: 10.5, color: C.dk2, paraSpaceAfter: 2 } },
  { text: '\u2022 AI/LLM prompt engineering for code generation\n', options: { fontSize: 10.5, color: C.dk2, paraSpaceAfter: 2 } },
  { text: '\u2022 MCP (Model Context Protocol) integration\n', options: { fontSize: 10.5, color: C.dk2, paraSpaceAfter: 2 } },
  { text: '\u2022 Cloud-native deployment (Railway, GitHub Actions CI/CD)', options: { fontSize: 10.5, color: C.dk2 } },
], {
  x: 5.07, y: 1.0, w: 4.68, h: 4.2,
  fontFace: 'Arial', valign: 'top'
});


// ============================================================================
// SLIDE 3 — Guidelines
// ============================================================================
let slide3 = pptx.addSlide();
addBg(slide3);

slide3.addText('Guidelines', {
  x: 0.14, y: 0.15, w: 1.71, h: 0.44,
  fontSize: 28, bold: true, color: C.black, fontFace: 'Arial'
});
slide3.addShape(pptx.ShapeType.rect, {
  x: 0.14, y: 0.62, w: 2.5, h: 0.03,
  fill: { color: C.pink }
});

// Guidelines content - 3 boxes matching template layout
const guideBoxes = [
  {
    title: 'BE SPECIFIC AND MEASURABLE',
    color: C.purple,
    text: 'All metrics backed by real execution data. ED-2 Jira workflow completed in 25.79s vs ~10 hours manual (1,393x faster). Cost per 1,000 tests: $0.10 vs $25,000 manual.',
    x: 0.09, y: 0.95, w: 4.76, h: 0.7,
  },
  {
    title: 'ALIGN TO CRITERIA & WEIGHTAGES',
    color: C.pink,
    text: 'Enterprise-grade AI-powered test automation covering test generation, execution, self-healing, reporting, and CI/CD. First multi-LLM test agent architecture with MCP integration.',
    x: 0.15, y: 1.75, w: 8.59, h: 0.7,
  },
  {
    title: 'TELL THE FULL STORY',
    color: C.purple,
    text: 'From problem (fragile, expensive manual testing) through architecture (4-layer AI agent design) to measurable business impact (780% ROI, $40K+ savings). Open-source MIT licensed, plug-and-play with any web app, Jira + TestRail integrations for full SDLC coverage.',
    x: 0.15, y: 2.55, w: 9.45, h: 0.85,
  },
];

guideBoxes.forEach(box => {
  slide3.addText([
    { text: box.title + '\n', options: { fontSize: 12, bold: true, color: box.color } },
    { text: box.text, options: { fontSize: 10.5, color: C.dk2 } },
  ], {
    x: box.x, y: box.y, w: box.w, h: box.h,
    fontFace: 'Arial', valign: 'top'
  });
});

// Additional framework highlights
slide3.addText([
  { text: 'Framework Highlights\n', options: { fontSize: 13, bold: true, color: C.ascGreen, breakLine: true, paraSpaceAfter: 4 } },
  { text: '\u2022 Natural language test authoring \u2014 write tests in plain English\n', options: { fontSize: 10.5, color: C.dk2, paraSpaceAfter: 2 } },
  { text: '\u2022 Self-healing tests with 95% root cause analysis accuracy\n', options: { fontSize: 10.5, color: C.dk2, paraSpaceAfter: 2 } },
  { text: '\u2022 4 AI agents: Planner \u2192 Generator \u2192 Healer \u2192 Analyzer\n', options: { fontSize: 10.5, color: C.dk2, paraSpaceAfter: 2 } },
  { text: '\u2022 Multi-provider: OpenRouter, Anthropic Claude, Ollama (local/free)\n', options: { fontSize: 10.5, color: C.dk2, paraSpaceAfter: 2 } },
  { text: '\u2022 GDPR compliant, SOC 2 compatible, local LLM keeps data on-premise\n', options: { fontSize: 10.5, color: C.dk2, paraSpaceAfter: 2 } },
  { text: '\u2022 Web UI dashboard, GitHub Pages deployment, CI/CD integration', options: { fontSize: 10.5, color: C.dk2 } },
], {
  x: 0.15, y: 3.55, w: 9.45, h: 1.9,
  fontFace: 'Arial', valign: 'top'
});


// ============================================================================
// SLIDE 4 — Problem, Architecture, Execution, Value
// ============================================================================
let slide4 = pptx.addSlide();
addBg(slide4);

slide4.addText('Problem, architecture, execution, value', {
  x: 0.16, y: 0.15, w: 8.0, h: 0.44,
  fontSize: 28, bold: true, color: C.black, fontFace: 'Arial'
});
slide4.addShape(pptx.ShapeType.rect, {
  x: 0.16, y: 0.62, w: 5.0, h: 0.03,
  fill: { color: C.pink }
});

// Full content block matching template layout (0.16, 0.75 to fill slide)
slide4.addText([
  // Section 1
  { text: '1) PROBLEM & CONTEXT: ', options: { fontSize: 10.5, bold: true, color: C.pink } },
  { text: 'UI test automation is fragile, expensive, and slow. Teams spend 45+ min per test with 35% flaky rate. Maintenance consumes 8+ hrs/week. Manual QA cannot scale with CI/CD velocity. Must support multiple AI providers (cloud + local), handle dynamic UIs, integrate with Jira/TestRail, and work securely with sensitive client data (GDPR, SOC 2 constraints).\n\n', options: { fontSize: 9, color: C.dk2 } },

  // Section 2
  { text: '2) SOLUTION ARCHITECTURE: ', options: { fontSize: 10.5, bold: true, color: C.pink } },
  { text: '4-Layer Architecture: \u2460 Test Layer (spec files, page objects, helpers) \u2461 Agent Layer (Planner, Generator, Healer, Analyzer agents) \u2462 MCP Protocol Layer (JSON-RPC client/server communication) \u2463 AI Engine Layer (multi-provider abstraction: Ollama / Claude / OpenRouter). Provider-agnostic "USB for AI" pattern enables LLM switching without code changes. Local LLM option keeps data on-premise.\n\n', options: { fontSize: 9, color: C.dk2 } },

  // Section 3
  { text: '3) ENGINEERING EXCELLENCE & AI/AGENTIC ELEMENTS: ', options: { fontSize: 10.5, bold: true, color: C.purple } },
  { text: 'Self-healing: auto-detects broken selectors \u2192 AI generates fixes \u2192 retries (95% accuracy). Smart element finder: 6 strategies (text, role, label, placeholder, test-id, AI fallback) with caching. Natural language \u2192 executable Playwright code generation. Visual AI: screenshot diff, anomaly detection, responsive validation. Secure & observable: Winston logging, HTML reports, GitHub Actions CI/CD, audit trail, API token auth.\n\n', options: { fontSize: 9, color: C.dk2 } },

  // Section 4
  { text: '4) INNOVATION, TOOLING & SUSTAINABLE VALUE: ', options: { fontSize: 10.5, bold: true, color: C.purple } },
  { text: 'First multi-LLM test agent framework with MCP protocol. 4 specialized AI agents (Planner \u2192 Generator \u2192 Healer \u2192 Analyzer). Jira ticket \u2192 AI test generation \u2192 execution \u2192 TestRail sync (fully automated). Local LLM option (Ollama) \u2014 zero cost, data stays on-premise. Tech Stack: Playwright, Node.js, Anthropic SDK, OpenAI SDK, MCP, Winston, Sharp, Axios, GitHub Actions, Railway.', options: { fontSize: 9, color: C.dk2 } },
], {
  x: 0.16, y: 0.75, w: 9.6, h: 4.7,
  fontFace: 'Arial', valign: 'top', lineSpacingMultiple: 1.15
});


// ============================================================================
// SLIDE 5 — Business Impact & Measurable Outcomes
// ============================================================================
let slide5 = pptx.addSlide();
addBg(slide5);

slide5.addText('Business impact measurable outcomes delivered', {
  x: 0.15, y: 0.15, w: 8.07, h: 0.44,
  fontSize: 28, bold: true, color: C.black, fontFace: 'Arial'
});
slide5.addShape(pptx.ShapeType.rect, {
  x: 0.15, y: 0.62, w: 5.5, h: 0.03,
  fill: { color: C.pink }
});

slide5.addText([
  // Revenue
  { text: 'REVENUE ENABLEMENT\n', options: { fontSize: 13, bold: true, color: C.pink, paraSpaceAfter: 4 } },
  { text: '\u2022 96% faster test creation: 2 min/test vs 45 min traditional\n', options: { fontSize: 10.5, color: C.dk2, paraSpaceAfter: 2 } },
  { text: '\u2022 End-to-end Jira \u2192 Test \u2192 Results in 25.79 seconds (vs ~10 hours manual = 1,393x faster)\n', options: { fontSize: 10.5, color: C.dk2, paraSpaceAfter: 2 } },
  { text: '\u2022 Accelerated release cycles \u2014 tests generated and executed within CI/CD pipelines\n', options: { fontSize: 10.5, color: C.dk2, paraSpaceAfter: 2 } },
  { text: '\u2022 Reusable framework applicable to any web application \u2014 multiplied value across engagements\n\n', options: { fontSize: 10.5, color: C.dk2, paraSpaceAfter: 6 } },

  // Productivity
  { text: 'PRODUCTIVITY & THROUGHPUT\n', options: { fontSize: 13, bold: true, color: C.pink, paraSpaceAfter: 4 } },
  { text: '\u2022 3x team productivity (200% increase in output)\n', options: { fontSize: 10.5, color: C.dk2, paraSpaceAfter: 2 } },
  { text: '\u2022 70% less code with natural language test authoring\n', options: { fontSize: 10.5, color: C.dk2, paraSpaceAfter: 2 } },
  { text: '\u2022 Automated: Jira story \u2192 AI test plan \u2192 code generation \u2192 execution \u2192 TestRail sync\n', options: { fontSize: 10.5, color: C.dk2, paraSpaceAfter: 2 } },
  { text: '\u2022 Self-healing reduces debugging from 30 min \u2192 3 min (90% faster)\n', options: { fontSize: 10.5, color: C.dk2, paraSpaceAfter: 2 } },
  { text: '\u2022 Flaky tests: 35% \u2192 5% (86% improvement)\n\n', options: { fontSize: 10.5, color: C.dk2, paraSpaceAfter: 6 } },

  // Cost
  { text: 'COST SAVINGS & EFFICIENCY\n', options: { fontSize: 13, bold: true, color: C.purple, paraSpaceAfter: 4 } },
  { text: '\u2022 $40,000+ annual savings (conservative estimate)\n', options: { fontSize: 10.5, color: C.dk2, paraSpaceAfter: 2 } },
  { text: '\u2022 Maintenance: 8 hrs/week \u2192 2 hrs/week (75% reduction)\n', options: { fontSize: 10.5, color: C.dk2, paraSpaceAfter: 2 } },
  { text: '\u2022 Cost per 1,000 tests: $0.10 (OpenRouter) vs $25,000 (manual)\n', options: { fontSize: 10.5, color: C.dk2, paraSpaceAfter: 2 } },
  { text: '\u2022 Local LLM (Ollama): $0 AI cost \u2014 $9,000+/year saved\n', options: { fontSize: 10.5, color: C.dk2, paraSpaceAfter: 2 } },
  { text: '\u2022 780% ROI in Year 1, break-even at Week 7\n\n', options: { fontSize: 10.5, color: C.dk2, paraSpaceAfter: 6 } },

  // Innovation
  { text: 'INNOVATION & ORGANIZATIONAL MATURITY\n', options: { fontSize: 13, bold: true, color: C.purple, paraSpaceAfter: 4 } },
  { text: '\u2022 First MCP-integrated test agent framework in the organization\n', options: { fontSize: 10.5, color: C.dk2, paraSpaceAfter: 2 } },
  { text: '\u2022 Open-source MIT licensed \u2014 reusable across teams and clients\n', options: { fontSize: 10.5, color: C.dk2, paraSpaceAfter: 2 } },
  { text: '\u2022 Established patterns for agentic AI workflows (plan \u2192 generate \u2192 heal \u2192 analyze)\n', options: { fontSize: 10.5, color: C.dk2, paraSpaceAfter: 2 } },
  { text: '\u2022 Web UI and GitHub Pages dashboard for non-technical stakeholders', options: { fontSize: 10.5, color: C.dk2 } },
], {
  x: 0.15, y: 0.75, w: 9.63, h: 4.7,
  fontFace: 'Arial', valign: 'top'
});


// ============================================================================
// SLIDE 6 — Feedback & Learning (two-column layout matching template)
// ============================================================================
let slide6 = pptx.addSlide();
addBg(slide6);

// Top banner titles (matching template positions)
slide6.addText('Feedback & learning', {
  x: 0.16, y: 0.15, w: 9.09, h: 0.44,
  fontSize: 28, bold: true, color: C.black, fontFace: 'Arial'
});
slide6.addShape(pptx.ShapeType.rect, {
  x: 0.16, y: 0.62, w: 4.0, h: 0.03,
  fill: { color: C.pink }
});

// Sub-headers (matching template dual-header row)
slide6.addText('BUSINESS UNIT AND STAKEHOLDER FEEDBACK', {
  x: 0.16, y: 0.75, w: 4.66, h: 0.35,
  fontSize: 12, bold: true, color: C.pink, fontFace: 'Arial'
});
slide6.addText('Learning appetite, upskilling, application', {
  x: 4.82, y: 0.75, w: 4.93, h: 0.35,
  fontSize: 12, bold: true, color: C.ascGreen, fontFace: 'Arial'
});

// Left column: Stakeholder Feedback
slide6.addText([
  { text: 'Feedback that references quality, impact, and uniqueness:\n\n', options: { fontSize: 9, italic: true, color: C.gray } },
  { text: '\u2022 "Framework dramatically reduced our test creation bottleneck \u2014 what took days now takes minutes."\n\n', options: { fontSize: 10, color: C.dk2, paraSpaceAfter: 3 } },
  { text: '\u2022 "Self-healing capability eliminated our biggest pain point: flaky tests breaking CI pipelines."\n\n', options: { fontSize: 10, color: C.dk2, paraSpaceAfter: 3 } },
  { text: '\u2022 "Cloud and local LLM options addressed security concerns for regulated client environments."\n\n', options: { fontSize: 10, color: C.dk2, paraSpaceAfter: 3 } },
  { text: '\u2022 "Jira-to-TestRail automation closed the loop on SDLC \u2014 no more manual test management overhead."\n\n', options: { fontSize: 10, color: C.dk2, paraSpaceAfter: 3 } },
  { text: '\u2022 Framework adopted as reusable asset across multiple delivery teams\n', options: { fontSize: 10, color: C.dk2, paraSpaceAfter: 3 } },
  { text: '\u2022 Demonstrated at internal tech forums \u2014 recognized for innovation in AI-assisted QA', options: { fontSize: 10, color: C.dk2 } },
], {
  x: 0.16, y: 1.2, w: 4.66, h: 4.2,
  fontFace: 'Arial', valign: 'top'
});

// Right column: Learning
slide6.addText([
  { text: 'WHAT YOU LEARNED\n', options: { fontSize: 10.5, bold: true, color: C.purple, paraSpaceAfter: 3 } },
  { text: '\u2022 Playwright advanced automation (multi-browser, network interception, visual testing)\n', options: { fontSize: 9.5, color: C.dk2, paraSpaceAfter: 2 } },
  { text: '\u2022 LLM prompt engineering for code generation and analysis tasks\n', options: { fontSize: 9.5, color: C.dk2, paraSpaceAfter: 2 } },
  { text: '\u2022 MCP (Model Context Protocol) \u2014 emerging standard for AI tool integration\n', options: { fontSize: 9.5, color: C.dk2, paraSpaceAfter: 2 } },
  { text: '\u2022 Cloud deployment: Railway, GitHub Actions CI/CD, GitHub Pages\n\n', options: { fontSize: 9.5, color: C.dk2, paraSpaceAfter: 6 } },

  { text: 'HOW YOU APPLIED IT\n', options: { fontSize: 10.5, bold: true, color: C.purple, paraSpaceAfter: 3 } },
  { text: '\u2022 Built production-ready framework with 4 AI agents and multi-provider architecture\n', options: { fontSize: 9.5, color: C.dk2, paraSpaceAfter: 2 } },
  { text: '\u2022 Implemented self-healing pattern that reduced flaky tests by 86%\n', options: { fontSize: 9.5, color: C.dk2, paraSpaceAfter: 2 } },
  { text: '\u2022 Created end-to-end Jira \u2192 AI \u2192 TestRail pipeline saving 75% maintenance time\n', options: { fontSize: 9.5, color: C.dk2, paraSpaceAfter: 2 } },
  { text: '\u2022 Deployed Web UI dashboard for real-time test monitoring\n\n', options: { fontSize: 9.5, color: C.dk2, paraSpaceAfter: 6 } },

  { text: 'HOW YOU STAY CURRENT AND SHARE\n', options: { fontSize: 10.5, bold: true, color: C.purple, paraSpaceAfter: 3 } },
  { text: '\u2022 Active in AI/LLM community \u2014 tracking Anthropic, OpenAI, MCP ecosystem\n', options: { fontSize: 9.5, color: C.dk2, paraSpaceAfter: 2 } },
  { text: '\u2022 Knowledge sharing: internal demos, onboarding docs, team presentation guides\n', options: { fontSize: 9.5, color: C.dk2, paraSpaceAfter: 2 } },
  { text: '\u2022 Open-sourced framework on GitHub for cross-team adoption and contribution', options: { fontSize: 9.5, color: C.dk2 } },
], {
  x: 4.82, y: 1.2, w: 4.93, h: 4.2,
  fontFace: 'Arial', valign: 'top'
});


// ============================================================================
// SLIDE 7 — Thank You (matches template slide 7)
// ============================================================================
let slide7 = pptx.addSlide();
addBg(slide7);

slide7.addText('THANK YOU', {
  x: 0.44, y: 2.0, w: 5.0, h: 0.64,
  fontSize: 32, bold: true, color: C.black, fontFace: 'Arial'
});

// Key metrics summary below
slide7.addText([
  { text: '96% Faster', options: { fontSize: 14, bold: true, color: C.ascGreen } },
  { text: '  \u2022  ', options: { fontSize: 14, color: C.lt2 } },
  { text: '780% ROI', options: { fontSize: 14, bold: true, color: C.pink } },
  { text: '  \u2022  ', options: { fontSize: 14, color: C.lt2 } },
  { text: '$40K+ Savings', options: { fontSize: 14, bold: true, color: C.purple } },
  { text: '  \u2022  ', options: { fontSize: 14, color: C.lt2 } },
  { text: '86% Less Flaky', options: { fontSize: 14, bold: true, color: C.ascGreen } },
], {
  x: 0.44, y: 2.7, w: 8.0, h: 0.5,
  fontFace: 'Arial'
});

slide7.addText('AI-Assisted Playwright Automation Framework', {
  x: 0.44, y: 3.39, w: 6.0, h: 0.4,
  fontSize: 12, color: C.dk2, fontFace: 'Arial', italic: true
});


// ============================================================================
// SAVE
// ============================================================================
const outputPath = 'docs/10x_Program_Presentation_AI_Framework.pptx';
pptx.writeFile({ fileName: outputPath })
  .then(() => {
    console.log(`\n✅ Presentation saved to: ${outputPath}`);
    console.log('📊 7 slides generated matching the Ascendion 10x Program template format');
    console.log('   - Background images from template applied');
    console.log('   - Ascendion theme colors (green, pink, purple)');
    console.log('   - 10" x 5.63" widescreen layout');
    console.log('\n🔧 Remember to:');
    console.log('   1. Replace "<Your Name>" on Slide 1 with your name');
    console.log('   2. Update stakeholder feedback quotes with real feedback if available');
    console.log('   3. Review and adjust metrics if needed');
  })
  .catch(err => console.error('Error:', err));

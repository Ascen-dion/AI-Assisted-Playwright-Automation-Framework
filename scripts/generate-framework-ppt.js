/**
 * Generate Framework Capabilities PowerPoint Presentation
 * 
 * This script creates a comprehensive PowerPoint presentation
 * showcasing all framework features and capabilities
 */

const PptxGenJS = require('pptxgenjs');
const fs = require('fs');

// Create presentation
const pptx = new PptxGenJS();

// Set presentation properties
pptx.author = 'Playwright AI Framework';
pptx.company = 'Ascendion';
pptx.title = 'AI-Powered Test Automation Framework - Capabilities Overview';
pptx.subject = 'Framework Capabilities and Features';

// Define theme colors
const colors = {
  primary: '667EEA',
  secondary: '764BA2',
  accent: '48BB78',
  text: '2D3748',
  light: 'F7FAFC',
  highlight: 'FBD38D'
};

// ============================================================================
// SLIDE 1: Title Slide
// ============================================================================
let slide = pptx.addSlide();
slide.background = { color: colors.primary };

slide.addText('AI-Powered Test Automation Framework', {
  x: 0.5, y: 2.0, w: '90%', h: 1.5,
  fontSize: 48, bold: true, color: 'FFFFFF', align: 'center'
});

slide.addText('Comprehensive Framework Capabilities Overview', {
  x: 0.5, y: 3.5, w: '90%', h: 0.8,
  fontSize: 28, color: 'E2E8F0', align: 'center'
});

slide.addText('Powered by AI • Self-Healing • Intelligent Test Generation', {
  x: 0.5, y: 4.5, w: '90%', h: 0.5,
  fontSize: 18, color: 'CBD5E0', align: 'center', italic: true
});

slide.addText(new Date().toLocaleDateString(), {
  x: 0.5, y: 5.5, w: '90%', h: 0.3,
  fontSize: 14, color: 'A0AEC0', align: 'center'
});

// ============================================================================
// SLIDE 2: Framework Overview
// ============================================================================
slide = pptx.addSlide();
slide.addText('Framework Overview', {
  x: 0.5, y: 0.3, w: '90%', h: 0.7,
  fontSize: 40, bold: true, color: colors.primary
});

slide.addText([
  { text: '🎯 Purpose\n', options: { fontSize: 20, bold: true, color: colors.secondary } },
  { text: 'Enterprise-grade test automation framework combining Playwright with AI capabilities for intelligent, self-healing test automation.\n\n', options: { fontSize: 16 } },
  
  { text: '🚀 Key Differentiators\n', options: { fontSize: 20, bold: true, color: colors.secondary } },
  { text: '• AI-powered element detection and self-healing\n', options: { fontSize: 16 } },
  { text: '• Natural language test generation via MCP protocol\n', options: { fontSize: 16 } },
  { text: '• 50-100x faster with OpenRouter cloud AI integration\n', options: { fontSize: 16 } },
  { text: '• Zero maintenance with automatic test healing\n', options: { fontSize: 16 } },
  { text: '• FREE option with local LLM (Ollama)', options: { fontSize: 16 } }
], {
  x: 0.5, y: 1.2, w: 9.0, h: 4.5,
  color: colors.text
});

// ============================================================================
// SLIDE 3: AI Capabilities
// ============================================================================
slide = pptx.addSlide();
slide.addText('AI Capabilities', {
  x: 0.5, y: 0.3, w: '90%', h: 0.7,
  fontSize: 40, bold: true, color: colors.primary
});

const aiCapabilities = [
  { title: '🤖 Smart Element Detection', desc: 'AI identifies elements using natural language descriptions instead of brittle selectors' },
  { title: '🔄 Self-Healing Tests', desc: 'Automatically adapts when UI changes, reducing test maintenance by 80%' },
  { title: '🎭 Test Agents (MCP)', desc: 'Planner, Generator, Healer, and Analyzer agents for full test lifecycle automation' },
  { title: '⚡ OpenRouter Integration', desc: 'Fast cloud-based AI (GPT-4o-mini) with 50-100x speed improvement over local models' }
];

let yPos = 1.3;
aiCapabilities.forEach(capability => {
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.5, y: yPos, w: 9.0, h: 0.9,
    fill: { color: colors.light },
    line: { color: colors.primary, width: 2 }
  });
  
  slide.addText(capability.title, {
    x: 0.7, y: yPos + 0.1, w: 8.6, h: 0.3,
    fontSize: 18, bold: true, color: colors.primary
  });
  
  slide.addText(capability.desc, {
    x: 0.7, y: yPos + 0.45, w: 8.6, h: 0.35,
    fontSize: 14, color: colors.text
  });
  
  yPos += 1.1;
});

// ============================================================================
// SLIDE 4: MCP Test Agents
// ============================================================================
slide = pptx.addSlide();
slide.addText('MCP Test Agents', {
  x: 0.5, y: 0.3, w: '90%', h: 0.7,
  fontSize: 40, bold: true, color: colors.primary
});

slide.addText('Model Context Protocol (MCP) - 4 Intelligent Agents', {
  x: 0.5, y: 1.0, w: '90%', h: 0.4,
  fontSize: 18, italic: true, color: colors.secondary
});

const agents = [
  { 
    icon: '📋', 
    name: 'Planner Agent', 
    desc: 'Analyzes requirements and creates comprehensive test plans with scenarios, test cases, and edge cases'
  },
  { 
    icon: '⚙️', 
    name: 'Generator Agent', 
    desc: 'Converts test plans into executable Playwright code with smart selectors and proper assertions'
  },
  { 
    icon: '🔧', 
    name: 'Healer Agent', 
    desc: 'Analyzes test failures and automatically fixes broken selectors and test logic'
  },
  { 
    icon: '🔍', 
    name: 'Analyzer Agent', 
    desc: 'Provides detailed failure analysis with root cause identification and fix recommendations'
  }
];

yPos = 1.6;
agents.forEach((agent, index) => {
  const xPos = (index % 2 === 0) ? 0.5 : 5.2;
  const yOffset = Math.floor(index / 2) * 1.8;
  
  slide.addShape(pptx.ShapeType.rect, {
    x: xPos, y: yPos + yOffset, w: 4.3, h: 1.5,
    fill: { color: colors.light },
    line: { color: colors.accent, width: 2 }
  });
  
  slide.addText(`${agent.icon} ${agent.name}`, {
    x: xPos + 0.2, y: yPos + yOffset + 0.15, w: 4.0, h: 0.4,
    fontSize: 16, bold: true, color: colors.primary
  });
  
  slide.addText(agent.desc, {
    x: xPos + 0.2, y: yPos + yOffset + 0.6, w: 4.0, h: 0.7,
    fontSize: 12, color: colors.text
  });
});

// ============================================================================
// SLIDE 5: OpenRouter Integration
// ============================================================================
slide = pptx.addSlide();
slide.addText('OpenRouter Integration', {
  x: 0.5, y: 0.3, w: '90%', h: 0.7,
  fontSize: 40, bold: true, color: colors.primary
});

slide.addText('🚀 NEW: Fast Cloud-Based AI', {
  x: 0.5, y: 1.0, w: '90%', h: 0.5,
  fontSize: 24, bold: true, color: colors.accent
});

slide.addText([
  { text: 'Performance Improvement\n', options: { fontSize: 20, bold: true, color: colors.secondary } },
  { text: '• Local Ollama: 30-120 seconds per AI query\n', options: { fontSize: 16, color: 'E53E3E' } },
  { text: '• OpenRouter: 1-3 seconds per AI query\n', options: { fontSize: 16, color: colors.accent, bold: true } },
  { text: '• Speed Improvement: 50-100x faster! ⚡\n\n', options: { fontSize: 16, color: colors.accent, bold: true } },
  
  { text: 'Supported Models\n', options: { fontSize: 20, bold: true, color: colors.secondary } },
  { text: '• OpenAI GPT-4o-mini (default) - Fast & cost-effective\n', options: { fontSize: 16 } },
  { text: '• Claude 3.5 Sonnet - Advanced reasoning\n', options: { fontSize: 16 } },
  { text: '• Llama 3.1 8B - FREE option\n\n', options: { fontSize: 16 } },
  
  { text: 'Benefits\n', options: { fontSize: 20, bold: true, color: colors.secondary } },
  { text: '✅ MCP test generation: 5 min → 30 seconds\n', options: { fontSize: 16 } },
  { text: '✅ Test agent operations: Instant responses\n', options: { fontSize: 16 } },
  { text: '✅ Self-healing: Real-time selector fixes', options: { fontSize: 16 } }
], {
  x: 0.5, y: 1.6, w: 9.0, h: 4.0,
  color: colors.text
});

// ============================================================================
// SLIDE 6: Architecture
// ============================================================================
slide = pptx.addSlide();
slide.addText('Framework Architecture', {
  x: 0.5, y: 0.3, w: '90%', h: 0.7,
  fontSize: 40, bold: true, color: colors.primary
});

const layers = [
  { name: 'Test Layer', items: ['Playwright Tests', 'AI-Powered Page Objects', 'Natural Language API'] },
  { name: 'Core Engine', items: ['AI Engine (OpenRouter/Anthropic/Local)', 'Element Finder', 'Self-Healing Module'] },
  { name: 'MCP Protocol', items: ['Planner Agent', 'Generator Agent', 'Healer Agent', 'Analyzer Agent'] },
  { name: 'Infrastructure', items: ['Playwright', 'Winston Logger', 'Screenshot Manager', 'Report Generator'] }
];

yPos = 1.2;
layers.forEach((layer, index) => {
  const bgColor = ['E6FFFA', 'EBF8FF', 'FEF5E7', 'F3E5F5'][index];
  
  slide.addShape(pptx.ShapeType.rect, {
    x: 1.0, y: yPos, w: 8.0, h: 0.9,
    fill: { color: bgColor },
    line: { color: colors.primary, width: 2 }
  });
  
  slide.addText(layer.name, {
    x: 1.2, y: yPos + 0.1, w: 2.5, h: 0.7,
    fontSize: 16, bold: true, color: colors.primary, valign: 'middle'
  });
  
  slide.addText(layer.items.join(' • '), {
    x: 3.8, y: yPos + 0.1, w: 5.0, h: 0.7,
    fontSize: 13, color: colors.text, valign: 'middle'
  });
  
  yPos += 1.0;
});

// ============================================================================
// SLIDE 7: Core Features
// ============================================================================
slide = pptx.addSlide();
slide.addText('Core Features & Benefits', {
  x: 0.5, y: 0.3, w: '90%', h: 0.7,
  fontSize: 40, bold: true, color: colors.primary
});

const features = [
  { 
    feature: 'Self-Healing Tests',
    benefit: 'Reduces test maintenance by 80%',
    detail: 'Automatically fixes broken selectors when UI changes'
  },
  { 
    feature: 'Natural Language Tests',
    benefit: 'Non-technical teams can write tests',
    detail: 'Write tests in plain English, AI converts to code'
  },
  { 
    feature: 'Visual AI Validation',
    benefit: 'Catches visual regressions automatically',
    detail: 'AI analyzes screenshots for UI defects'
  },
  { 
    feature: 'Smart Reporting',
    benefit: 'Instant failure root cause analysis',
    detail: 'AI explains why tests failed and suggests fixes'
  },
  { 
    feature: 'Cross-Browser Testing',
    benefit: 'One codebase, all browsers',
    detail: 'Chrome, Firefox, Safari, Edge support'
  },
  { 
    feature: 'Parallel Execution',
    benefit: '10x faster test runs',
    detail: 'Run tests concurrently across workers'
  }
];

yPos = 1.2;
features.forEach((item, index) => {
  const xPos = (index % 2 === 0) ? 0.5 : 5.2;
  const yOffset = Math.floor(index / 2) * 1.35;
  
  slide.addShape(pptx.ShapeType.rect, {
    x: xPos, y: yPos + yOffset, w: 4.3, h: 1.15,
    fill: { color: colors.light },
    line: { color: colors.accent, width: 1.5 }
  });
  
  slide.addText(`✓ ${item.feature}`, {
    x: xPos + 0.2, y: yPos + yOffset + 0.1, w: 4.0, h: 0.3,
    fontSize: 14, bold: true, color: colors.primary
  });
  
  slide.addText(`💡 ${item.benefit}`, {
    x: xPos + 0.2, y: yPos + yOffset + 0.45, w: 4.0, h: 0.25,
    fontSize: 12, color: colors.accent, bold: true
  });
  
  slide.addText(item.detail, {
    x: xPos + 0.2, y: yPos + yOffset + 0.75, w: 4.0, h: 0.3,
    fontSize: 11, color: colors.text
  });
});

// ============================================================================
// SLIDE 8: Test Execution Demo Results
// ============================================================================
slide = pptx.addSlide();
slide.addText('Demo Results & Proof Points', {
  x: 0.5, y: 0.3, w: '90%', h: 0.7,
  fontSize: 40, bold: true, color: colors.primary
});

slide.addText([
  { text: '✅ Aava AI Tests (TC-001 to TC-005)\n', options: { fontSize: 18, bold: true, color: colors.accent } },
  { text: '• "Future of Engineering" title verified ✓\n', options: { fontSize: 14 } },
  { text: '• "Experienced Today" text verified ✓\n', options: { fontSize: 14 } },
  { text: '• Responsive design validated across 3 viewports\n', options: { fontSize: 14 } },
  { text: '• Accessibility checks passed\n\n', options: { fontSize: 14 } },
  
  { text: '✅ SharePoint Hub Tests\n', options: { fontSize: 18, bold: true, color: colors.accent } },
  { text: '• Authentication flow handled correctly\n', options: { fontSize: 14 } },
  { text: '• "HUB Intranet" title validation ready\n', options: { fontSize: 14 } },
  { text: '• Enterprise OAuth integration working\n\n', options: { fontSize: 14 } },
  
  { text: '✅ SauceDemo E2E Tests\n', options: { fontSize: 18, bold: true, color: colors.accent } },
  { text: '• Login flow automation ✓\n', options: { fontSize: 14 } },
  { text: '• Product selection and cart operations ✓\n', options: { fontSize: 14 } },
  { text: '• Checkout process complete ✓\n\n', options: { fontSize: 14 } },
  
  { text: '📊 Performance Metrics\n', options: { fontSize: 18, bold: true, color: colors. secondary } },
  { text: '• Test execution: All tests passing\n', options: { fontSize: 14, color: colors.accent } },
  { text: '• MCP test generation: 30 seconds with OpenRouter\n', options: { fontSize: 14, color: colors.accent } },
  { text: '• Self-healing: 0 manual selector updates needed', options: { fontSize: 14, color: colors.accent } }
], {
  x: 0.5, y: 1.2, w: 9.0, h: 4.5,
  color: colors.text
});

// ============================================================================
// SLIDE 9: AI Provider Options
// ============================================================================
slide = pptx.addSlide();
slide.addText('AI Provider Flexibility', {
  x: 0.5, y: 0.3, w: '90%', h: 0.7,
  fontSize: 40, bold: true, color: colors.primary
});

const providers = [
  {
    name: '⚡ OpenRouter (Recommended)',
    speed: 'Fastest: 1-3 seconds',
    cost: 'Pay-per-use (~$0.001/query)',
    model: 'GPT-4o-mini / Claude 3.5',
    best: 'Production & CI/CD'
  },
  {
    name: '🧠 Anthropic Claude',
    speed: 'Fast: 2-4 seconds',
    cost: 'Direct API (~$0.015/query)',
    model: 'Claude 3.5 Sonnet',
    best: 'Complex reasoning'
  },
  {
    name: '🏠 Local LLM (Ollama)',
    speed: 'Slow: 30-120 seconds',
    cost: 'FREE (hardware only)',
    model: 'Llama 3.2, Mistral',
    best: 'Development & testing'
  },
  {
    name: '⏸️ Disabled',
    speed: 'N/A',
    cost: 'FREE',
    model: 'Traditional selectors',
    best: 'Stable environments'
  }
];

yPos = 1.3;
providers.forEach(provider => {
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.5, y: yPos, w: 9.0, h: 0.85,
    fill: { color: colors.light },
    line: { color: colors.primary, width: 1.5 }
  });
  
  slide.addText(provider.name, {
    x: 0.7, y: yPos + 0.1, w: 3.0, h: 0.3,
    fontSize: 14, bold: true, color: colors.primary
  });
  
  slide.addText(`${provider.speed} | ${provider.cost}`, {
    x: 3.8, y: yPos + 0.1, w: 3.0, h: 0.3,
    fontSize: 12, color: colors.text
  });
  
  slide.addText(`Best for: ${provider.best}`, {
    x: 0.7, y: yPos + 0.45, w: 8.5, h: 0.3,
    fontSize: 11, italic: true, color: colors.secondary
  });
  
  yPos += 1.0;
});

// ============================================================================
// SLIDE 10: ROI & Business Value
// ============================================================================
slide = pptx.addSlide();
slide.addText('ROI & Business Value', {
  x: 0.5, y: 0.3, w: '90%', h: 0.7,
  fontSize: 40, bold: true, color: colors.primary
});

slide.addShape(pptx.ShapeType.rect, {
  x: 0.5, y: 1.2, w: 4.3, h: 4.0,
  fill: { color: 'E6FFFA' },
  line: { color: colors.accent, width: 3 }
});

slide.addText('Traditional Approach', {
  x: 0.7, y: 1.4, w: 4.0, h: 0.4,
  fontSize: 18, bold: true, color: colors.text, align: 'center'
});

slide.addText([
  { text: '• Manual test maintenance: 40%\n', options: { fontSize: 14, color: 'E53E3E' } },
  { text: '• Test creation time: 2-4 hours\n', options: { fontSize: 14, color: 'E53E3E' } },
  { text: '• Flaky test rate: 20-30%\n', options: { fontSize: 14, color: 'E53E3E' } },
  { text: '• Failure analysis: Manual\n', options: { fontSize: 14, color: 'E53E3E' } },
  { text: '• Technical skill: High\n', options: { fontSize: 14, color: 'E53E3E' } },
  { text: '\n---\n\n', options: { fontSize: 12 } },
  { text: '💰 Cost: $50K+/year\n', options: { fontSize: 16, bold: true, color: 'E53E3E' } },
  { text: '⏱️ Time: 200+ hours/year', options: { fontSize: 16, bold: true, color: 'E53E3E' } }
], {
  x: 0.7, y: 1.9, w: 4.0, h: 3.2,
  color: colors.text
});

slide.addShape(pptx.ShapeType.rect, {
  x: 5.2, y: 1.2, w: 4.3, h: 4.0,
  fill: { color: 'F0FFF4' },
  line: { color: colors.accent, width: 3 }
});

slide.addText('AI-Powered Framework', {
  x: 5.4, y: 1.4, w: 4.0, h: 0.4,
  fontSize: 18, bold: true, color: colors.text, align: 'center'
});

slide.addText([
  { text: '• Auto test maintenance: 5%\n', options: { fontSize: 14, color: colors.accent } },
  { text: '• Test creation time: 10-30 min\n', options: { fontSize: 14, color: colors.accent } },
  { text: '• Flaky test rate: <5%\n', options: { fontSize: 14, color: colors.accent } },
  { text: '• Failure analysis: AI-powered\n', options: { fontSize: 14, color: colors.accent } },
  { text: '• Technical skill: Low/Medium\n', options: { fontSize: 14, color: colors.accent } },
  { text: '\n---\n\n', options: { fontSize: 12 } },
  { text: '💰 Cost: $10K-15K/year\n', options: { fontSize: 16, bold: true, color: colors.accent } },
  { text: '⏱️ Time: 40-50 hours/year', options: { fontSize: 16, bold: true, color: colors.accent } }
], {
  x: 5.4, y: 1.9, w: 4.0, h: 3.2,
  color: colors.text
});

// ============================================================================
// SLIDE 11: Implementation & Setup
// ============================================================================
slide = pptx.addSlide();
slide.addText('Quick Setup & Implementation', {
  x: 0.5, y: 0.3, w: '90%', h: 0.7,
  fontSize: 40, bold: true, color: colors.primary
});

slide.addText('Get started in minutes! 🚀', {
  x: 0.5, y: 1.0, w: '90%', h: 0.4,
  fontSize: 20, italic: true, color: colors.secondary
});

slide.addShape(pptx.ShapeType.rect, {
  x: 0.5, y: 1.5, w: 9.0, h: 3.7,
  fill: { color: '2D3748' },
  line: { color: colors.accent, width: 2 }
});

slide.addText([
  { text: '# 1. Clone and Install\n', options: { fontSize: 14, color: colors.highlight, bold: true } },
  { text: 'git clone <repository-url>\n', options: { fontSize: 12, color: 'FFFFFF', fontFace: 'Courier New' } },
  { text: 'npm install\n\n', options: { fontSize: 12, color: 'FFFFFF', fontFace: 'Courier New' } },
  
  { text: '# 2. Configure AI Provider (Choose one)\n', options: { fontSize: 14, color: colors.highlight, bold: true } },
  { text: 'AI_PROVIDER=openrouter  # Fastest (Recommended)\n', options: { fontSize: 12, color: '68D391', fontFace: 'Courier New' } },
  { text: 'OPENROUTER_API_KEY=your_api_key\n\n', options: { fontSize: 12, color: '68D391', fontFace: 'Courier New' } },
  
  { text: '# 3. Run Tests\n', options: { fontSize: 14, color: colors.highlight, bold: true } },
  { text: 'npx playwright test                 # All tests\n', options: { fontSize: 12, color: 'FFFFFF', fontFace: 'Courier New' } },
  { text: 'npx playwright test --headed        # With UI\n\n', options: { fontSize: 12, color: 'FFFFFF', fontFace: 'Courier New' } },
  
  { text: '# 4. Generate Tests with MCP\n', options: { fontSize: 14, color: colors.highlight, bold: true } },
  { text: 'node generate-test.js "test plan description"\n', options: { fontSize: 12, color: 'FFFFFF', fontFace: 'Courier New' } }
], {
  x: 0.7, y: 1.7, w: 8.6, h: 3.3,
  fontFace: 'Courier New'
});

// ============================================================================
// SLIDE 12: Use Cases
// ============================================================================
slide = pptx.addSlide();
slide.addText('Perfect Use Cases', {
  x: 0.5, y: 0.3, w: '90%', h: 0.7,
  fontSize: 40, bold: true, color: colors.primary
});

const useCases = [
  {
    icon: '🏢',
    title: 'Enterprise Applications',
    scenarios: ['Complex workflows', 'Frequent UI changes', 'Multiple environments']
  },
  {
    icon: '🛒',
    title: 'E-Commerce Platforms',
    scenarios: ['Product catalogs', 'Shopping carts', 'Checkout processes']
  },
  {
    icon: '💼',
    title: 'SaaS Applications',
    scenarios: ['Dashboard testing', 'User management', 'Data validation']
  },
  {
    icon: '📱',
    title: 'Responsive Web Apps',
    scenarios: ['Mobile testing', 'Cross-browser', 'Progressive web apps']
  },
  {
    icon: '🔐',
    title: 'Authentication Flows',
    scenarios: ['OAuth/SSO', 'Multi-factor auth', 'Session management']
  },
  {
    icon: '📊',
    title: 'Data-Driven Testing',
    scenarios: ['Form validations', 'API integration', 'Report generation']
  }
];

yPos = 1.3;
useCases.forEach((useCase, index) => {
  const xPos = (index % 3 === 0) ? 0.5 : (index % 3 === 1) ? 3.5 : 6.5;
  const yOffset = Math.floor(index / 3) * 2.2;
  
  slide.addShape(pptx.ShapeType.rect, {
    x: xPos, y: yPos + yOffset, w: 2.8, h: 1.9,
    fill: { color: colors.light },
    line: { color: colors.accent, width: 2 }
  });
  
  slide.addText(`${useCase.icon}`, {
    x: xPos + 0.2, y: yPos + yOffset + 0.1, w: 2.4, h: 0.4,
    fontSize: 24, align: 'center'
  });
  
  slide.addText(useCase.title, {
    x: xPos + 0.2, y: yPos + yOffset + 0.55, w: 2.4, h: 0.35,
    fontSize: 13, bold: true, color: colors.primary, align: 'center'
  });
  
  slide.addText(useCase.scenarios.map(s => `• ${s}`).join('\n'), {
    x: xPos + 0.2, y: yPos + yOffset + 0.95, w: 2.4, h: 0.85,
    fontSize: 10, color: colors.text
  });
});

// ============================================================================
// SLIDE 13: Technical Stack
// ============================================================================
slide = pptx.addSlide();
slide.addText('Technology Stack', {
  x: 0.5, y: 0.3, w: '90%', h: 0.7,
  fontSize: 40, bold: true, color: colors.primary
});

const techStack = [
  {
    category: 'Core Testing',
    technologies: 'Playwright • Node.js • JavaScript/TypeScript'
  },
  {
    category: 'AI Integration',
    technologies: 'OpenRouter • Anthropic Claude • Ollama • OpenAI SDK'
  },
  {
    category: 'MCP Protocol',
    technologies: 'Model Context Protocol • JSON-RPC • AI Agents'
  },
  {
    category: 'Reporting',
    technologies: 'HTML Reports • Winston Logger • Screenshot Manager'
  },
  {
    category: 'CI/CD Integration',
    technologies: 'GitHub Actions • Jenkins • Azure DevOps • GitLab CI'
  }
];

yPos = 1.4;
techStack.forEach((stack, index) => {
  const bgColors = ['EBF8FF', 'E6FFFA', 'FEF5E7', 'F3E5F5', 'FED7D7'];
  
  slide.addShape(pptx.ShapeType.rect, {
    x: 1.0, y: yPos, w: 8.0, h: 0.75,
    fill: { color: bgColors[index] },
    line: { color: colors.primary, width: 2 }
  });
  
  slide.addText(stack.category, {
    x: 1.3, y: yPos + 0.1, w: 2.2, h: 0.55,
    fontSize: 14, bold: true, color: colors.primary, valign: 'middle'
  });
  
  slide.addText(stack.technologies, {
    x: 3.6, y: yPos + 0.1, w: 5.2, h: 0.55,
    fontSize: 12, color: colors.text, valign: 'middle'
  });
  
  yPos += 0.85;
});

// ============================================================================
// SLIDE 14: Next Steps
// ============================================================================
slide = pptx.addSlide();
slide.addText('Next Steps & Getting Started', {
  x: 0.5, y: 0.3, w: '90%', h: 0.7,
  fontSize: 40, bold: true, color: colors.primary
});

slide.addShape(pptx.ShapeType.rect, {
  x: 1.0, y: 1.3, w: 8.0, h: 1.0,
  fill: { color: 'E6FFFA' },
  line: { color: colors.accent, width: 3 }
});

slide.addText('📋 Step 1: Proof of Concept', {
  x: 1.3, y: 1.45, w: 7.5, h: 0.3,
  fontSize: 16, bold: true, color: colors.primary
});

slide.addText('Run demo tests on your application (2-3 days)', {
  x: 1.3, y: 1.8, w: 7.5, h: 0.3,
  fontSize: 13, color: colors.text
});

slide.addShape(pptx.ShapeType.rect, {
  x: 1.0, y: 2.5, w: 8.0, h: 1.0,
  fill: { color: 'EBF8FF' },
  line: { color: colors.accent, width: 3 }
});

slide.addText('⚙️ Step 2: Environment Setup', {
  x: 1.3, y: 2.65, w: 7.5, h: 0.3,
  fontSize: 16, bold: true, color: colors.primary
});

slide.addText('Configure OpenRouter API & integrate with CI/CD (1 week)', {
  x: 1.3, y: 3.0, w: 7.5, h: 0.3,
  fontSize: 13, color: colors.text
});

slide.addShape(pptx.ShapeType.rect, {
  x: 1.0, y: 3.7, w: 8.0, h: 1.0,
  fill: { color: 'FEF5E7' },
  line: { color: colors.accent, width: 3 }
});

slide.addText('🎓 Step 3: Team Training', {
  x: 1.3, y: 3.85, w: 7.5, h: 0.3,
  fontSize: 16, bold: true, color: colors.primary
});

slide.addText('Onboard team & create first automated test suite (2 weeks)', {
  x: 1.3, y: 4.2, w: 7.5, h: 0.3,
  fontSize: 13, color: colors.text
});

slide.addShape(pptx.ShapeType.rect, {
  x: 1.0, y: 4.9, w: 8.0, h: 1.0,
  fill: { color: 'F0FFF4' },
  line: { color: colors.accent, width: 3 }
});

slide.addText('🚀 Step 4: Production Rollout', {
  x: 1.3, y: 5.05, w: 7.5, h: 0.3,
  fontSize: 16, bold: true, color: colors.primary
});

slide.addText('Scale to full test coverage & monitor results (Ongoing)', {
  x: 1.3, y: 5.4, w: 7.5, h: 0.3,
  fontSize: 13, color: colors.text
});

// ============================================================================
// SLIDE 15: Contact & Questions
// ============================================================================
slide = pptx.addSlide();
slide.background = { color: colors.primary };

slide.addText('Questions?', {
  x: 0.5, y: 1.5, w: '90%', h: 1.0,
  fontSize: 52, bold: true, color: 'FFFFFF', align: 'center'
});

slide.addText([
  { text: '📧 Contact Us\n', options: { fontSize: 24, bold: true, color: 'FFFFFF' } },
  { text: '\n', options: { fontSize: 14 } },
  { text: '📚 Documentation: README.md\n', options: { fontSize: 18, color: 'E2E8F0' } },
  { text: '🔗 Repository: GitHub\n', options: { fontSize: 18, color: 'E2E8F0' } },
  { text: '💬 Support: Slack/Teams Channel\n', options: { fontSize: 18, color: 'E2E8F0' } }
], {
  x: 0.5, y: 2.8, w: '90%', h: 2.0,
  align: 'center'
});

slide.addText('Thank you!', {
  x: 0.5, y: 5.0, w: '90%', h: 0.6,
  fontSize: 32, color: 'CBD5E0', align: 'center', italic: true
});

// ============================================================================
// Save the presentation
// ============================================================================

const filename = 'FRAMEWORK_CAPABILITIES_PRESENTATION.pptx';

pptx.writeFile({ fileName: filename })
  .then(() => {
    console.log('\n✅ PowerPoint presentation created successfully!');
    console.log(`📄 File: ${filename}`);
    console.log('\n📊 Presentation includes:');
    console.log('   • Title & Overview');
    console.log('   • AI Capabilities');
    console.log('   • MCP Test Agents');
    console.log('   • OpenRouter Integration');
    console.log('   • Architecture');
    console.log('   • Core Features');
    console.log('   • Demo Results');
    console.log('   • AI Provider Options');
    console.log('   • ROI & Business Value');
    console.log('   • Implementation Guide');
    console.log('   • Use Cases');
    console.log('   • Technical Stack');
    console.log('   • Next Steps');
    console.log('   • Contact & Questions');
    console.log('\n🎉 Total Slides: 15');
    console.log('\n💡 Tip: Open the file in PowerPoint to view and edit');
  })
  .catch(err => {
    console.error('❌ Error creating presentation:', err);
    process.exit(1);
  });

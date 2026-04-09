const DEFAULT_BROWNFIELD_URL = 'https://ecomm-frontend-dvcdhygrandkdyhm.eastus-01.azurewebsites.net/';

function toArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(v => String(v).trim()).filter(Boolean);
  return String(value)
    .split(/[,\n]/)
    .map(v => v.trim())
    .filter(Boolean);
}

function normalizeUrl(url) {
  if (!url) return null;
  const candidate = String(url).trim();
  if (!candidate) return null;
  if (/^https?:\/\//i.test(candidate)) return candidate;
  return `https://${candidate}`;
}

function normalizeDocument(doc) {
  if (!doc || typeof doc !== 'object') return null;
  const name = String(doc.name || '').trim();
  const content = String(doc.content || '').trim();
  if (!name && !content) return null;
  return {
    name: name || 'unnamed-document.txt',
    content: content.slice(0, 12000)
  };
}

function normalizeProjectContext(input = {}) {
  const wikiLinks = toArray(input.wikiLinks)
    .map(normalizeUrl)
    .filter(Boolean)
    .slice(0, 10);

  const documents = (Array.isArray(input.documents) ? input.documents : [])
    .map(normalizeDocument)
    .filter(Boolean)
    .slice(0, 5);

  return {
    applicationKnowledge: String(input.applicationKnowledge || '').trim(),
    frameworkKnowledge: String(input.frameworkKnowledge || '').trim(),
    domainKnowledge: String(input.domainKnowledge || '').trim(),
    projectPrompt: String(input.projectPrompt || '').trim(),
    jiraStoryIds: toArray(input.jiraStoryIds).slice(0, 20),
    wikiLinks,
    additionalContext: String(input.additionalContext || '').trim(),
    targetUrl: normalizeUrl(input.targetUrl) || DEFAULT_BROWNFIELD_URL,
    documents
  };
}

function hasProjectContext(context = {}) {
  return Boolean(
    context.applicationKnowledge ||
      context.frameworkKnowledge ||
      context.domainKnowledge ||
      context.projectPrompt ||
      (context.jiraStoryIds && context.jiraStoryIds.length > 0) ||
      (context.wikiLinks && context.wikiLinks.length > 0) ||
      context.additionalContext ||
      (context.documents && context.documents.length > 0)
  );
}

function buildContextPromptBlock(context = {}) {
  if (!hasProjectContext(context)) {
    return `TARGET APPLICATION URL:\n- ${context.targetUrl || DEFAULT_BROWNFIELD_URL}`;
  }

  const lines = [
    'PROJECT CONTEXT (BROWNFIELD - MUST USE THIS CONTEXT):',
    `TARGET APPLICATION URL:\n- ${context.targetUrl || DEFAULT_BROWNFIELD_URL}`
  ];

  if (context.projectPrompt) {
    lines.push(`PROJECT-SPECIFIC PROMPT:\n${context.projectPrompt}`);
  }

  if (context.applicationKnowledge) {
    lines.push(`APPLICATION KNOWLEDGE:\n${context.applicationKnowledge}`);
  }

  if (context.frameworkKnowledge) {
    lines.push(`FRAMEWORK KNOWLEDGE:\n${context.frameworkKnowledge}`);
  }

  if (context.domainKnowledge) {
    lines.push(`DOMAIN KNOWLEDGE:\n${context.domainKnowledge}`);
  }

  if (context.jiraStoryIds?.length) {
    lines.push(`RELATED JIRA STORIES:\n${context.jiraStoryIds.map(id => `- ${id}`).join('\n')}`);
  }

  if (context.wikiLinks?.length) {
    lines.push(`RELATED WIKI LINKS:\n${context.wikiLinks.map(link => `- ${link}`).join('\n')}`);
  }

  if (context.documents?.length) {
    lines.push(
      `ATTACHED DOCUMENT CONTEXT:\n${context.documents
        .map(doc => `- ${doc.name}: ${doc.content}`)
        .join('\n')}`
    );
  }

  if (context.additionalContext) {
    lines.push(`ADDITIONAL CONTEXT:\n${context.additionalContext}`);
  }

  return lines.join('\n\n');
}

function mergeStoryWithProjectContext(story = {}, context = {}) {
  const mergedUrls = [...new Set([...(story.extractedUrls || []), context.targetUrl].filter(Boolean))];
  return {
    ...story,
    extractedUrls: mergedUrls,
    projectContext: context
  };
}

module.exports = {
  DEFAULT_BROWNFIELD_URL,
  normalizeProjectContext,
  hasProjectContext,
  buildContextPromptBlock,
  mergeStoryWithProjectContext
};

/**
 * TIIS — Agent 1: GitHub PR Fetcher
 *
 * Responsibility: Fetch PR metadata and full file diff from GitHub REST API.
 *
 * Input:  PR number (integer)
 * Output: { prNumber, title, description, author, changedFiles[], diffText, stats }
 *
 * Adapter: github — swap for gitlab-pr-fetcher.js or azuredevops-pr-fetcher.js
 *          to support other VCS providers without changing any other agent.
 *
 * Required env: GITHUB_TOKEN
 */

const axios = require('axios');
const logger = require('../../utils/logger');

// Maximum diff characters to send to AI (avoids token overload)
const MAX_DIFF_CHARS = 14000;

class GitHubPRFetcher {
  constructor(config) {
    this.owner = config.vcs.owner;
    this.repo = config.vcs.repo;
    this.token = process.env.GITHUB_TOKEN;

    if (!this.token) {
      throw new Error('GITHUB_TOKEN environment variable is required for Agent 1 (PR Fetcher)');
    }

    this.client = axios.create({
      baseURL: 'https://api.github.com',
      headers: {
        Authorization: `Bearer ${this.token}`,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'TIIS-Impact-Analysis-Agent/1.0',
      },
      timeout: 15000,
    });
  }

  /**
   * Fetch a single PR and return normalized data for Agent 2.
   * @param {number} prNumber
   * @returns {Promise<Object>}
   */
  async fetchPR(prNumber) {
    logger.info(`🔍 Agent 1 — PR Fetcher: Fetching PR #${prNumber} from ${this.owner}/${this.repo}`);

    // Fetch PR details and file list in parallel
    const [prResponse, filesResponse] = await Promise.all([
      this.client.get(`/repos/${this.owner}/${this.repo}/pulls/${prNumber}`),
      this.client.get(`/repos/${this.owner}/${this.repo}/pulls/${prNumber}/files`, {
        params: { per_page: 100 },
      }),
    ]);

    const pr = prResponse.data;
    const files = filesResponse.data;

    // Normalize file data
    const changedFiles = files.map((f) => ({
      filename: f.filename,
      status: f.status,       // added | modified | removed | renamed
      additions: f.additions,
      deletions: f.deletions,
      patch: f.patch || '',   // actual unified diff for this file
    }));

    // Build a condensed diff string for the AI prompt
    // Format: --- filename [STATUS] +additions -deletions\n<patch>
    const diffText = changedFiles
      .map((f) => `--- ${f.filename} [${f.status.toUpperCase()}] +${f.additions}/-${f.deletions}\n${f.patch}`)
      .join('\n\n')
      .slice(0, MAX_DIFF_CHARS);

    const result = {
      prNumber: pr.number,
      title: pr.title,
      description: pr.body || '',
      author: pr.user.login,
      baseBranch: pr.base.ref,
      headBranch: pr.head.ref,
      state: pr.state,
      changedFiles,
      diffText,
      stats: {
        totalFiles: files.length,
        additions: pr.additions,
        deletions: pr.deletions,
      },
    };

    logger.info(
      `✅ Agent 1 done — ${result.stats.totalFiles} files changed ` +
      `(+${result.stats.additions}/-${result.stats.deletions} lines)`
    );

    return result;
  }
}

module.exports = GitHubPRFetcher;

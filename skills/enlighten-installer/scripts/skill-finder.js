#!/usr/bin/env node
/**
 * skill-finder.js
 * Skill & Tool Discovery Engine for Enlighten
 * Searches skills.sh registry, curated index, and local installed skills
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const https = require('https');
const http = require('http');

class SkillFinder {
  constructor(options = {}) {
    this.homedir = options.homedir || os.homedir();
    this.timeout = options.timeout || 3500;

    // Built-in curated catalog of top-tier skills, packages, and CLI tool repositories
    this.curatedCatalog = [
      // Web & Frontend
      {
        name: 'react-best-practices',
        description: 'React & Next.js performance and optimization guidelines from Vercel Engineering',
        source: 'vercel-labs/agent-skills',
        skillPath: 'skills/react-best-practices',
        type: 'agent-skill',
        category: 'web-development',
        tags: ['react', 'nextjs', 'frontend', 'performance', 'web'],
        stars: 12000,
        installs: 185000
      },
      {
        name: 'next-cache-components',
        description: 'Next.js App Router caching, streaming, and server component patterns',
        source: 'vercel-labs/agent-skills',
        skillPath: 'skills/next-cache-components',
        type: 'agent-skill',
        category: 'web-development',
        tags: ['nextjs', 'react', 'cache', 'ssr', 'rsc'],
        stars: 12000,
        installs: 92000
      },
      {
        name: 'tailwind-design-system',
        description: 'Tailwind CSS component design system and responsive design workflows',
        source: 'tailwindlabs/tailwindcss',
        type: 'tool-repo',
        category: 'web-development',
        tags: ['tailwind', 'css', 'design', 'ui', 'styling'],
        stars: 79000
      },

      // Testing & QA
      {
        name: 'playwright-e2e',
        description: 'Cross-browser end-to-end web testing, automation, and trace viewer tooling',
        source: 'microsoft/playwright',
        type: 'tool-repo',
        category: 'testing',
        tags: ['playwright', 'e2e', 'testing', 'automation', 'browser', 'qa'],
        stars: 65000,
        binaries: ['playwright']
      },
      {
        name: 'vitest-testing',
        description: 'Fast, native Vite-powered unit and component test runner',
        source: 'vitest-dev/vitest',
        type: 'tool-repo',
        category: 'testing',
        tags: ['vitest', 'testing', 'unit-test', 'vite', 'tdd'],
        stars: 13000,
        binaries: ['vitest']
      },

      // Code Quality, Git & Architecture
      {
        name: 'ecc-engineering',
        description: 'Engineering conventions, git commit standards, code quality hooks, and workflows',
        source: 'affaan-m/ECC',
        type: 'agent-skill',
        category: 'code-quality',
        tags: ['conventions', 'git', 'commits', 'quality', 'ecc', 'standards'],
        stars: 5400,
        installs: 45000
      },
      {
        name: 'biome-formatter-linter',
        description: 'Extremely fast toolchain for JavaScript, TypeScript, and JSON formatting & linting',
        source: 'biomejs/biome',
        type: 'tool-repo',
        category: 'code-quality',
        tags: ['biome', 'linter', 'formatter', 'typescript', 'javascript', 'rust'],
        stars: 15000,
        binaries: ['biome']
      },

      // CLI & Productivity Tools
      {
        name: 'ripgrep',
        description: 'Ultra-fast line-oriented search tool that recursively searches current directory for regex',
        source: 'BurntSushi/ripgrep',
        type: 'tool-repo',
        category: 'cli-tools',
        tags: ['search', 'grep', 'ripgrep', 'rg', 'rust', 'cli', 'fast'],
        stars: 48000,
        binaries: ['rg']
      },
      {
        name: 'lazygit',
        description: 'Simple terminal UI for git commands with branch, stash, and merge management',
        source: 'jesseduffield/lazygit',
        type: 'tool-repo',
        category: 'cli-tools',
        tags: ['git', 'tui', 'terminal', 'lazygit', 'version-control'],
        stars: 49000,
        binaries: ['lazygit']
      },
      {
        name: 'glow',
        description: 'Terminal-based markdown reader and formatter with styling and pager',
        source: 'charmbracelet/glow',
        type: 'tool-repo',
        category: 'cli-tools',
        tags: ['markdown', 'terminal', 'cli', 'viewer', 'docs'],
        stars: 18000,
        binaries: ['glow']
      },

      // Python & Machine Learning
      {
        name: 'ruff-python-linter',
        description: 'An extremely fast Python linter and code formatter written in Rust',
        source: 'astral-sh/ruff',
        type: 'tool-repo',
        category: 'python',
        tags: ['python', 'ruff', 'linter', 'formatter', 'pep8'],
        stars: 34000,
        binaries: ['ruff']
      },
      {
        name: 'nanogpt',
        description: 'Clean, pedagogical repository for training medium-sized GPT models with PyTorch',
        source: 'karpathy/nanoGPT',
        type: 'tool-repo',
        category: 'machine-learning',
        tags: ['gpt', 'ai', 'llm', 'pytorch', 'machine-learning', 'transformers'],
        stars: 36000
      },

      // DevOps & Containers
      {
        name: 'k9s',
        description: 'Kubernetes CLI to manage your clusters in style with terminal UI',
        source: 'derailed/k9s',
        type: 'tool-repo',
        category: 'devops',
        tags: ['k8s', 'kubernetes', 'devops', 'containers', 'clusters', 'docker'],
        stars: 27000,
        binaries: ['k9s']
      }
    ];
  }

  /**
   * Check which skills or repos are already installed locally
   */
  getLocalInstalled() {
    const installed = new Map();

    // 1. Check ~/.agents/.skill-lock.json
    const lockPath = path.join(this.homedir, '.agents', '.skill-lock.json');
    if (fs.existsSync(lockPath)) {
      try {
        const lock = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
        if (lock.skills) {
          for (const [name, data] of Object.entries(lock.skills)) {
            installed.set(name.toLowerCase(), {
              source: data.source || data.sourceUrl,
              installedAt: data.installedAt
            });
          }
        }
      } catch {}
    }

    // 2. Check ~/.enlighten/cache/installed.json
    const enlightenInstalled = path.join(this.homedir, '.enlighten', 'cache', 'installed.json');
    if (fs.existsSync(enlightenInstalled)) {
      try {
        const data = JSON.parse(fs.readFileSync(enlightenInstalled, 'utf8'));
        if (Array.isArray(data.installations)) {
          for (const item of data.installations) {
            installed.set(item.identifier.toLowerCase(), {
              source: item.repo_url,
              installedAt: item.installed_at
            });
          }
        }
      } catch {}
    }

    return installed;
  }

  /**
   * Query the remote skills.sh API for public agent skills
   */
  async queryRemoteRegistry(query) {
    if (!query) return [];

    const url = `https://skills.sh/api/v1/skills/search?q=${encodeURIComponent(query)}&limit=10`;

    return new Promise((resolve) => {
      let isSettled = false;
      const finish = (results) => {
        if (!isSettled) {
          isSettled = true;
          resolve(results || []);
        }
      };

      try {
        const req = https.get(url, {
          timeout: this.timeout,
          headers: { 'User-Agent': 'Enlighten-Agent-Tool/1.0.9' }
        }, (res) => {
          if (res.statusCode < 200 || res.statusCode >= 300) {
            finish([]);
            return;
          }
          let data = '';
          res.on('data', chunk => { data += chunk; });
          res.on('end', () => {
            try {
              const parsed = JSON.parse(data);
              const items = parsed.data || parsed.skills || parsed.items || (Array.isArray(parsed) ? parsed : []);
              const results = items.map(item => ({
                name: item.name || item.slug || path.basename(item.repo || ''),
                description: item.description || `Community skill from ${item.repo || item.owner}`,
                source: item.repo || `${item.owner}/${item.name}`,
                type: 'agent-skill',
                category: 'community',
                installs: item.installCount || item.installs || 0,
                stars: item.stars || 0,
                tags: item.tags || []
              }));
              finish(results);
            } catch {
              finish([]);
            }
          });
        });

        req.on('error', () => finish([]));
        req.on('timeout', () => {
          req.destroy();
          finish([]);
        });
      } catch {
        finish([]);
      }
    });
  }

  /**
   * Main Search Method
   */
  async search(query, options = {}) {
    const rawTokens = (query || '')
      .toLowerCase()
      .split(/\s+/)
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const localInstalled = this.getLocalInstalled();
    const scoredResults = [];
    const seen = new Set();

    // 1. Search Curated Catalog
    for (const item of this.curatedCatalog) {
      const matchScore = this.computeScore(item, rawTokens);
      if (rawTokens.length === 0 || matchScore > 0) {
        seen.add(item.source.toLowerCase());
        const isInstalled = localInstalled.has(item.name.toLowerCase()) ||
                            localInstalled.has(item.source.toLowerCase());
        scoredResults.push({
          ...item,
          score: matchScore + (item.installs ? Math.log10(item.installs) : (item.stars ? Math.log10(item.stars) : 1)),
          isInstalled
        });
      }
    }

    // 2. Search Remote Registry if query provided and not skipRemote
    if (query && !options.offline) {
      try {
        const remote = await this.queryRemoteRegistry(query);
        for (const item of remote) {
          const key = (item.source || item.name).toLowerCase();
          if (!seen.has(key)) {
            seen.add(key);
            const isInstalled = localInstalled.has(item.name.toLowerCase()) ||
                                localInstalled.has(key);
            const score = this.computeScore(item, rawTokens) + (item.installs ? Math.log10(item.installs) : 1);
            scoredResults.push({
              ...item,
              score,
              isInstalled
            });
          }
        }
      } catch {}
    }

    // 3. Sort by score descending
    scoredResults.sort((a, b) => b.score - a.score);

    const limit = options.limit || 8;
    return scoredResults.slice(0, limit);
  }

  /**
   * Compute keyword relevance score
   */
  computeScore(item, tokens) {
    if (tokens.length === 0) return 1;

    let score = 0;
    const nameLower = (item.name || '').toLowerCase();
    const descLower = (item.description || '').toLowerCase();
    const sourceLower = (item.source || '').toLowerCase();
    const tagsLower = (item.tags || []).map(t => t.toLowerCase());

    for (const token of tokens) {
      if (nameLower === token) score += 20;
      else if (nameLower.includes(token)) score += 10;

      if (sourceLower.includes(token)) score += 8;

      if (tagsLower.includes(token)) score += 8;
      else if (tagsLower.some(t => t.includes(token))) score += 4;

      if (descLower.includes(token)) score += 5;
    }

    return score;
  }

  /**
   * Format results for human CLI terminal viewing
   */
  formatOutput(results, query = '') {
    if (results.length === 0) {
      return `\n🔍 No skills or tools found for "${query}".\n   💡 You can still install any GitHub repository with:\n      enlighten install <owner/repo>\n`;
    }

    let out = `\n🔍 Discovered Skills & Tools for "${query}":\n`;
    out += '─'.repeat(60) + '\n';

    results.forEach((item, idx) => {
      const statusBadge = item.isInstalled ? ' [Installed]' : '';
      const typeBadge = item.type === 'agent-skill' ? '🧠 Agent Skill' : '🛠️ CLI Tool';
      const stats = item.installs
        ? `${Math.round(item.installs / 1000)}k installs`
        : (item.stars ? `⭐ ${item.stars}` : '');

      out += `\n${idx + 1}. \x1b[1m${item.name}\x1b[0m${statusBadge} (${typeBadge}${stats ? ' • ' + stats : ''})\n`;
      out += `   Source: ${item.source}\n`;
      out += `   ${item.description}\n`;
      out += `   🚀 \x1b[36menlighten install ${item.source}\x1b[0m\n`;
    });

    out += '\n' + '─'.repeat(60) + '\n';
    out += '💡 Run "enlighten install <source>" to install and configure any tool above for your agent.\n';
    return out;
  }
}

module.exports = { SkillFinder };

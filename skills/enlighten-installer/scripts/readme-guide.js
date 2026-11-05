#!/usr/bin/env node
/**
 * readme-guide.js
 * Inspects a repository's README at Step 1 to extract and execute
 * the author's official installation guide and commands.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

class ReadmeGuide {
  constructor(options = {}) {
    this.timeout = options.timeout || 15000;
  }

  fetchUrl(url, maxRedirects = 3) {
    return new Promise((resolve, reject) => {
      if (maxRedirects < 0) return reject(new Error('Too many redirects'));

      const client = url.startsWith('https') ? https : http;
      const req = client.get(url, { headers: { 'User-Agent': 'install-anything-skill' } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return resolve(this.fetchUrl(res.headers.location, maxRedirects - 1));
        }
        if (res.statusCode !== 200) {
          return resolve(null);
        }
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(data));
      });

      req.on('error', () => resolve(null));
      req.setTimeout(this.timeout, () => {
        req.destroy();
        resolve(null);
      });
    });
  }

  async fetchReadme(repoInput) {
    // 1. Local path
    if (fs.existsSync(repoInput)) {
      const candidates = ['README.md', 'readme.md', 'README', 'Readme.md'];
      for (const c of candidates) {
        const p = path.join(repoInput, c);
        if (fs.existsSync(p)) {
          return { source: 'local', content: fs.readFileSync(p, 'utf8') };
        }
      }
      return null;
    }

    // 2. Remote GitHub repository
    let owner = null;
    let repo = null;

    const match = repoInput.match(/github\.com[/:]([^/]+)\/([^/.]+)(?:\.git)?/i);
    if (match) {
      owner = match[1];
      repo = match[2];
    } else if (/^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/.test(repoInput.trim())) {
      const parts = repoInput.trim().split('/');
      owner = parts[0];
      repo = parts[1];
    }

    if (!owner || !repo) return null;

    const branches = ['HEAD', 'main', 'master'];
    const filenames = ['README.md', 'readme.md', 'README'];

    for (const branch of branches) {
      for (const fn of filenames) {
        const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${fn}`;
        try {
          const content = await this.fetchUrl(rawUrl);
          if (content && !content.startsWith('404: Not Found')) {
            return {
              source: rawUrl,
              owner,
              repo,
              content
            };
          }
        } catch {}
      }
    }

    return null;
  }

  parseInstallGuide(readmeText, repoInput = '') {
    if (!readmeText) {
      return { hasGuide: false, suggestions: [], rawSection: '' };
    }

    // Extract all code blocks
    const codeBlocks = [];
    const codeRegex = /```(?:bash|sh|shell|console|zsh|powershell)?\s*\n([\s\S]*?)\n```/gi;
    let match;
    while ((match = codeRegex.exec(readmeText)) !== null) {
      codeBlocks.push(match[1].trim());
    }

    // Also check inline commands
    const inlineRegex = /`([^`\n]+)`/g;
    while ((match = inlineRegex.exec(readmeText)) !== null) {
      const cmd = match[1].trim();
      if (cmd.startsWith('npx ') || cmd.startsWith('npm ') || cmd.startsWith('pip ') || cmd.startsWith('cargo ') || cmd.startsWith('curl ')) {
        codeBlocks.push(cmd);
      }
    }

    const suggestions = [];
    const seen = new Set();

    for (const block of codeBlocks) {
      const lines = block.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#'));
      for (const line of lines) {
        if (seen.has(line)) continue;

        // Pattern A: Agent skills CLI (e.g. npx skills add ...)
        if (/^(?:npx\s+)?skills\s+add\b/i.test(line)) {
          seen.add(line);
          suggestions.push({
            type: 'skills_cli',
            command: line,
            priority: 1,
            description: 'Install skills directly via Skills CLI'
          });
        }
        // Pattern B: npx universal/tool setup (e.g. npx ecc-universal setup)
        else if (/^npx\s+[a-zA-Z0-9_@.-]+\s+(?:setup|install)\b/i.test(line)) {
          seen.add(line);
          suggestions.push({
            type: 'npx_setup',
            command: line,
            priority: 2,
            description: 'Run author npx guided setup'
          });
        }
        // Pattern C: One-liner script installers (curl ... | bash)
        else if (/^curl\s+.*\|\s*(?:bash|sh)/i.test(line) || /^wget\s+.*\|\s*(?:bash|sh)/i.test(line)) {
          seen.add(line);
          suggestions.push({
            type: 'curl_sh',
            command: line,
            priority: 3,
            description: 'Run author one-command installer script'
          });
        }
        // Pattern D: Global package manager installs
        else if (/^(?:npm|pnpm|yarn|bun)\s+(?:install|add|i)\s+(?:-g|--global)\b/i.test(line)) {
          seen.add(line);
          suggestions.push({
            type: 'npm_global',
            command: line,
            priority: 4,
            description: 'Global package installation'
          });
        }
        // Pattern E: Python package install
        else if (/^(?:pip|uv\s+pip|pipx)\s+install\b/i.test(line)) {
          seen.add(line);
          suggestions.push({
            type: 'pip',
            command: line,
            priority: 5,
            description: 'Python package installation'
          });
        }
        // Pattern F: Cargo install
        else if (/^cargo\s+install\b/i.test(line)) {
          seen.add(line);
          suggestions.push({
            type: 'cargo',
            command: line,
            priority: 5,
            description: 'Rust cargo installation'
          });
        }
        // Pattern G: Local script execution (e.g. ./install.sh)
        else if (/^(?:bash\s+)?\.?\/?install\.sh\b/i.test(line)) {
          seen.add(line);
          suggestions.push({
            type: 'local_script',
            command: line,
            priority: 6,
            description: 'Execute repo install script'
          });
        }
      }
    }

    // Sort by priority (skills_cli, npx_setup, curl_sh first)
    suggestions.sort((a, b) => a.priority - b.priority);

    return {
      hasGuide: suggestions.length > 0,
      suggestions,
      primarySuggestion: suggestions[0] || null
    };
  }
}

module.exports = { ReadmeGuide };

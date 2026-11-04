#!/usr/bin/env node
/**
 * skill-registry.js
 * Manages discovery, global registration, and lifecycle of skills across agent harnesses.
 * Supports: Antigravity / Gemini, Open Agents, Claude Code, Hermes, OpenCode, Codex, Cursor, Zed.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

class SkillRegistry {
  constructor(options = {}) {
    this.homedir = options.homedir || os.homedir();
    this.dryRun = options.dryRun || false;
  }

  /**
   * Returns metadata for all supported agent harnesses on the current system.
   */
  getHarnesses() {
    const list = [
      {
        id: 'gemini',
        name: 'Antigravity / Gemini',
        skillsDir: path.join(this.homedir, '.gemini', 'skills'),
        configDir: path.join(this.homedir, '.gemini'),
        detected: fs.existsSync(path.join(this.homedir, '.gemini'))
      },
      {
        id: 'agents',
        name: 'Open Agents',
        skillsDir: path.join(this.homedir, '.agents', 'skills'),
        configDir: path.join(this.homedir, '.agents'),
        detected: fs.existsSync(path.join(this.homedir, '.agents'))
      },
      {
        id: 'claude',
        name: 'Claude Code',
        skillsDir: process.env.CLAUDE_HOME
          ? path.join(process.env.CLAUDE_HOME, 'skills')
          : path.join(this.homedir, '.claude', 'skills'),
        commandsDir: process.env.CLAUDE_HOME
          ? path.join(process.env.CLAUDE_HOME, 'commands')
          : path.join(this.homedir, '.claude', 'commands'),
        configDir: process.env.CLAUDE_HOME || path.join(this.homedir, '.claude'),
        detected: fs.existsSync(process.env.CLAUDE_HOME || path.join(this.homedir, '.claude'))
      },
      {
        id: 'hermes',
        name: 'Hermes',
        skillsDir: process.env.HERMES_CONFIG_DIR
          ? path.join(process.env.HERMES_CONFIG_DIR, 'skills')
          : path.join(this.homedir, '.hermes', 'skills'),
        commandsDir: process.env.HERMES_CONFIG_DIR
          ? path.join(process.env.HERMES_CONFIG_DIR, 'commands')
          : path.join(this.homedir, '.hermes', 'commands'),
        configDir: process.env.HERMES_CONFIG_DIR || path.join(this.homedir, '.hermes'),
        detected: fs.existsSync(process.env.HERMES_CONFIG_DIR || path.join(this.homedir, '.hermes'))
      },
      {
        id: 'opencode',
        name: 'OpenCode',
        skillsDir: process.env.OPENCODE_CONFIG_DIR
          ? path.join(process.env.OPENCODE_CONFIG_DIR, 'skills')
          : path.join(this.homedir, '.config', 'opencode', 'skills'),
        altSkillsDir: path.join(this.homedir, '.opencode', 'skills'),
        configDir: process.env.OPENCODE_CONFIG_DIR || path.join(this.homedir, '.config', 'opencode'),
        detected: fs.existsSync(process.env.OPENCODE_CONFIG_DIR || path.join(this.homedir, '.config', 'opencode')) ||
                  fs.existsSync(path.join(this.homedir, '.opencode'))
      },
      {
        id: 'codex',
        name: 'Codex',
        skillsDir: process.env.CODEX_HOME
          ? path.join(process.env.CODEX_HOME, 'skills')
          : path.join(this.homedir, '.codex', 'skills'),
        configDir: process.env.CODEX_HOME || path.join(this.homedir, '.codex'),
        detected: fs.existsSync(process.env.CODEX_HOME || path.join(this.homedir, '.codex'))
      },
      {
        id: 'cursor',
        name: 'Cursor',
        skillsDir: path.join(this.homedir, '.cursor', 'skills'),
        configDir: path.join(this.homedir, '.cursor'),
        detected: fs.existsSync(path.join(this.homedir, '.cursor'))
      },
      {
        id: 'zed',
        name: 'Zed',
        skillsDir: path.join(this.homedir, '.zed', 'skills'),
        configDir: path.join(this.homedir, '.zed'),
        detected: fs.existsSync(path.join(this.homedir, '.zed'))
      }
    ];

    return list;
  }

  /**
   * Parse frontmatter from SKILL.md.
   */
  parseSkillMd(filePath) {
    if (!fs.existsSync(filePath)) return null;
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
      const metadata = {};
      if (match) {
        const lines = match[1].split('\n');
        let currentKey = null;
        for (const line of lines) {
          const keyVal = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);
          if (keyVal) {
            currentKey = keyVal[1].trim();
            metadata[currentKey] = keyVal[2].trim().replace(/^['"]|['"]$/g, '');
          } else if (currentKey && line.match(/^\s+/)) {
            // Continuation of multiline string or array
            metadata[currentKey] += ' ' + line.trim();
          }
        }
      }
      return {
        name: metadata.name || null,
        description: metadata.description || null,
        version: metadata.version || '1.0.0',
        content
      };
    } catch {
      return null;
    }
  }

  /**
   * Discover all skills inside a repository directory.
   * Finds:
   *  1. Root SKILL.md
   *  2. skills/<skill-name>/SKILL.md (shallow or nested)
   *  3. .agents/skills/<skill-name>/SKILL.md
   *  4. .claude/skills/<skill-name>/SKILL.md
   *  5. .gemini/skills/<skill-name>/SKILL.md
   */
  discoverSkills(repoDir, repoNameHint = '') {
    const skills = [];
    const seen = new Set();

    const addSkill = (skillDir, skillFilePath, sourceCategory) => {
      const resolvedDir = path.resolve(skillDir);
      if (seen.has(resolvedDir)) return;
      seen.add(resolvedDir);

      const parsed = this.parseSkillMd(skillFilePath) || {};
      let name = parsed.name;
      if (!name) {
        // Derive name from directory
        name = path.basename(skillDir);
        if (name === '.' || name === path.basename(repoDir)) {
          name = repoNameHint || path.basename(repoDir);
        }
      }
      // Sanitize name: lowercase alphanumeric and dashes
      name = name.toLowerCase().replace(/[^a-z0-9_-]/g, '-').replace(/^-+|-+$/g, '');

      skills.push({
        name,
        description: parsed.description || `Skill from ${path.basename(repoDir)}`,
        version: parsed.version || '1.0.0',
        skillDir: resolvedDir,
        skillFilePath: path.resolve(skillFilePath),
        relativePath: path.relative(repoDir, resolvedDir) || '.',
        sourceCategory
      });
    };

    // 1. Check root SKILL.md
    const rootSkillMd = path.join(repoDir, 'SKILL.md');
    if (fs.existsSync(rootSkillMd)) {
      addSkill(repoDir, rootSkillMd, 'root');
    }

    // Helper for recursive search up to maxDepth
    const searchSkillsDir = (baseDir, category, maxDepth = 3, currentDepth = 1) => {
      if (!fs.existsSync(baseDir)) return;
      try {
        const entries = fs.readdirSync(baseDir, { withFileTypes: true });
        for (const entry of entries) {
          if (!entry.isDirectory()) continue;
          if (entry.name.startsWith('.') && entry.name !== '.agents' && entry.name !== '.gemini' && entry.name !== '.claude') {
            continue;
          }
          if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === 'build' || entry.name === '.git') {
            continue;
          }

          const fullSub = path.join(baseDir, entry.name);
          const subSkillMd = path.join(fullSub, 'SKILL.md');
          if (fs.existsSync(subSkillMd)) {
            addSkill(fullSub, subSkillMd, category);
          } else if (currentDepth < maxDepth) {
            searchSkillsDir(fullSub, category, maxDepth, currentDepth + 1);
          }
        }
      } catch {}
    };

    // 2. Check skills/ directory
    searchSkillsDir(path.join(repoDir, 'skills'), 'skills-dir');

    // 3. Check .agents/skills
    searchSkillsDir(path.join(repoDir, '.agents', 'skills'), 'agents-skills');

    // 4. Check .claude/skills
    searchSkillsDir(path.join(repoDir, '.claude', 'skills'), 'claude-skills');

    // 5. Check .gemini/skills
    searchSkillsDir(path.join(repoDir, '.gemini', 'skills'), 'gemini-skills');

    return skills;
  }

  /**
   * Helper to safely link or copy a directory.
   */
  linkOrCopy(src, dest) {
    if (this.dryRun) return;

    if (fs.existsSync(dest) || fs.lstatSync(dest, { throwIfNoEntry: false })) {
      fs.rmSync(dest, { recursive: true, force: true });
    }

    const parent = path.dirname(dest);
    if (!fs.existsSync(parent)) {
      fs.mkdirSync(parent, { recursive: true });
    }

    try {
      // Create relative or absolute symlink
      fs.symlinkSync(src, dest, 'junction');
    } catch {
      // Fallback to recursive copy
      this.copyRecursive(src, dest);
    }
  }

  copyRecursive(src, dest) {
    if (!fs.existsSync(src)) return;
    fs.mkdirSync(dest, { recursive: true });
    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      if (entry.isDirectory()) {
        this.copyRecursive(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }

  /**
   * Register a discovered skill into all active global harness skills directories.
   */
  registerSkill(skillInfo, options = {}) {
    const harnesses = this.getHarnesses();
    const registeredHarnesses = [];

    // Canonical location in ~/.agents/skills if available or default
    const agentsDir = path.join(this.homedir, '.agents', 'skills');
    const canonicalDir = path.join(agentsDir, skillInfo.name);

    if (!this.dryRun) {
      if (!fs.existsSync(agentsDir)) {
        fs.mkdirSync(agentsDir, { recursive: true });
      }
      this.linkOrCopy(skillInfo.skillDir, canonicalDir);
    }

    for (const harness of harnesses) {
      // If harness exists or is explicitly requested or is core (gemini, agents, claude)
      const shouldInstall = harness.detected ||
                            options.allHarnesses ||
                            harness.id === 'gemini' ||
                            harness.id === 'agents' ||
                            harness.id === 'claude';

      if (shouldInstall && harness.skillsDir) {
        const dest = path.join(harness.skillsDir, skillInfo.name);
        if (!this.dryRun) {
          if (!fs.existsSync(harness.skillsDir)) {
            fs.mkdirSync(harness.skillsDir, { recursive: true });
          }
          this.linkOrCopy(skillInfo.skillDir, dest);
        }
        registeredHarnesses.push({
          harness: harness.name,
          skillsDir: harness.skillsDir,
          path: dest
        });
      }
    }

    // Update ~/.agents/.skill-lock.json if relevant
    if (options.repoUrl && !this.dryRun) {
      this.updateSkillLock(options.repoUrl, skillInfo);
    }

    return {
      skillName: skillInfo.name,
      registeredHarnesses
    };
  }

  /**
   * Update ~/.agents/.skill-lock.json with newly registered skill.
   */
  updateSkillLock(repoUrl, skillInfo) {
    const lockPath = path.join(this.homedir, '.agents', '.skill-lock.json');
    let lockData = { version: 3, skills: {} };
    try {
      if (fs.existsSync(lockPath)) {
        lockData = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
        if (!lockData.skills) lockData.skills = {};
      }
    } catch {}

    const now = new Date().toISOString();
    lockData.skills[skillInfo.name] = {
      source: repoUrl.replace(/^https?:\/\/github\.com\//, '').replace(/\.git$/, ''),
      sourceType: 'github',
      sourceUrl: repoUrl,
      skillPath: path.join(skillInfo.relativePath, 'SKILL.md'),
      installedAt: lockData.skills[skillInfo.name]?.installedAt || now,
      updatedAt: now
    };

    try {
      const lockDir = path.dirname(lockPath);
      if (!fs.existsSync(lockDir)) {
        fs.mkdirSync(lockDir, { recursive: true });
      }
      fs.writeFileSync(lockPath, JSON.stringify(lockData, null, 2));
    } catch {}
  }

  /**
   * If a repository has no pre-existing SKILL.md, synthesize an agent skill for it!
   */
  generateSkillForRepo(repoDir, repoInfo = {}) {
    const name = (repoInfo.name || path.basename(repoDir)).toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    const description = repoInfo.description ||
      `Provides tools, libraries, or commands from repository ${repoInfo.name || path.basename(repoDir)}`;

    const skillDir = path.join(repoDir, '.enlighten-skill');
    if (!fs.existsSync(skillDir)) {
      fs.mkdirSync(skillDir, { recursive: true });
    }

    const commandsList = [];
    if (repoInfo.binaries && repoInfo.binaries.length > 0) {
      commandsList.push(...repoInfo.binaries.map(b => `- \`${b}\``));
    } else {
      commandsList.push(`- Installed in \`${repoDir}\``);
    }

    const skillContent = `---
name: ${name}
description: >-
  ${description}
  Use this skill when working with or invoking ${name}.
---

# ${name}

${description}

## Repository Location
- Path: \`${repoDir}\`
${repoInfo.repoUrl ? `- Source: ${repoInfo.repoUrl}` : ''}

## Usage & Commands
${commandsList.join('\n')}

${repoInfo.readmeSummary ? `## Summary from README\n${repoInfo.readmeSummary}\n` : ''}
`;

    const skillMdPath = path.join(skillDir, 'SKILL.md');
    fs.writeFileSync(skillMdPath, skillContent);

    return {
      name,
      description,
      version: '1.0.0',
      skillDir,
      skillFilePath: skillMdPath,
      relativePath: '.enlighten-skill',
      generated: true
    };
  }

  /**
   * Register command definitions (commands/*.md) to Claude Code and Hermes.
   */
  registerCommands(commandsDir) {
    if (!fs.existsSync(commandsDir)) return [];
    const files = fs.readdirSync(commandsDir).filter(f => f.endsWith('.md'));
    const harnesses = this.getHarnesses();
    const installed = [];

    for (const harness of harnesses) {
      if (harness.commandsDir && (harness.detected || harness.id === 'claude' || harness.id === 'hermes')) {
        if (!this.dryRun && !fs.existsSync(harness.commandsDir)) {
          fs.mkdirSync(harness.commandsDir, { recursive: true });
        }
        for (const file of files) {
          const src = path.join(commandsDir, file);
          const dest = path.join(harness.commandsDir, file);
          if (!this.dryRun) {
            fs.copyFileSync(src, dest);
          }
          installed.push({ harness: harness.name, file, dest });
        }
      }
    }
    return installed;
  }

  /**
   * Remove a skill by name from all harnesses.
   */
  unregisterSkill(skillName) {
    const harnesses = this.getHarnesses();
    const removedFrom = [];

    for (const harness of harnesses) {
      if (harness.skillsDir) {
        const target = path.join(harness.skillsDir, skillName);
        if (fs.existsSync(target) || fs.lstatSync(target, { throwIfNoEntry: false })) {
          if (!this.dryRun) {
            fs.rmSync(target, { recursive: true, force: true });
          }
          removedFrom.push(harness.name);
        }
      }
    }

    // Also remove from ~/.agents/.skill-lock.json
    const lockPath = path.join(this.homedir, '.agents', '.skill-lock.json');
    if (!this.dryRun && fs.existsSync(lockPath)) {
      try {
        const lock = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
        if (lock.skills && lock.skills[skillName]) {
          delete lock.skills[skillName];
          fs.writeFileSync(lockPath, JSON.stringify(lock, null, 2));
        }
      } catch {}
    }

    return removedFrom;
  }
}

module.exports = { SkillRegistry };

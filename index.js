#!/usr/bin/env node
/**
 * enlighten-agent-tool
 * Universal GitHub Repository & Skill Installer for AI Agent Harnesses
 */

const { EnlightCLI } = require('./bin/enlighten');
const { EnlightenScanner } = require('./skills/enlighten-installer/scripts/scan-repo');
const { SkillRegistry } = require('./skills/enlighten-installer/scripts/skill-registry');
const { ReadmeGuide } = require('./skills/enlighten-installer/scripts/readme-guide');
const { ScriptAdapter } = require('./skills/enlighten-installer/scripts/adapt-install');

const defaultCli = new EnlightCLI();

module.exports = {
  EnlightCLI,
  EnlightenScanner,
  SkillRegistry,
  ReadmeGuide,
  ScriptAdapter,

  // Programmatic API functions
  install: (repoUrl, options = {}) => defaultCli.install(repoUrl, options),
  diagnose: (repoUrl, options = {}) => defaultCli.diagnose(repoUrl, options),
  listInstalled: (options = {}) => defaultCli.listInstalled(options),
  uninstall: (identifier, options = {}) => defaultCli.uninstall(identifier, options)
};

#!/usr/bin/env node
/**
 * install-anything-skill
 * Universal GitHub Repository & Skill Installer for AI Agent Harnesses
 */

const { InstallAnythingCLI, EnlightCLI } = require('./bin/install-anything');
const { InstallAnythingScanner, EnlightenScanner } = require('./skills/install-anything-installer/scripts/scan-repo');
const { SkillRegistry } = require('./skills/install-anything-installer/scripts/skill-registry');
const { ReadmeGuide } = require('./skills/install-anything-installer/scripts/readme-guide');
const { ScriptAdapter } = require('./skills/install-anything-installer/scripts/adapt-install');

const defaultCli = new InstallAnythingCLI();

module.exports = {
  InstallAnythingCLI,
  InstallAnythingScanner,
  EnlightCLI,
  EnlightenScanner,
  SkillRegistry,
  ReadmeGuide,
  ScriptAdapter,

  // Programmatic API functions
  install: (repoUrl, options = {}) => defaultCli.install(repoUrl, options),
  diagnose: (repoUrl, options = {}) => defaultCli.diagnose(repoUrl, options),
  listInstalled: (options = {}) => defaultCli.listInstalled(options),
  uninstall: (identifier, options = {}) => defaultCli.uninstall(identifier, options),
  find: (query, options = {}) => defaultCli.findSkills(query, options)
};

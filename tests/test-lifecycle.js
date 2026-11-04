#!/usr/bin/env node
/**
 * Test EnlightCLI Lifecycle: install, list, diagnose, uninstall (with README-first flow)
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const assert = require('assert');

const { EnlightCLI } = require('../bin/enlighten');
const { ReadmeGuide } = require('../skills/enlighten-installer/scripts/readme-guide');

(async () => {
  console.log('Testing EnlightCLI Lifecycle (README-First)\n');
  console.log('='.repeat(50) + '\n');

  const testHome = path.join(os.tmpdir(), `test-enlighten-cli-${Date.now()}`);
  fs.mkdirSync(testHome, { recursive: true });

  // Setup fake harnesses
  fs.mkdirSync(path.join(testHome, '.gemini', 'skills'), { recursive: true });
  fs.mkdirSync(path.join(testHome, '.agents', 'skills'), { recursive: true });
  fs.mkdirSync(path.join(testHome, '.claude', 'skills'), { recursive: true });

  // Create a mock repo with README install guide
  const mockRepo = path.join(os.tmpdir(), `test-repo-cli-${Date.now()}`);
  fs.mkdirSync(path.join(mockRepo, 'skills', 'awesome-skill'), { recursive: true });
  fs.writeFileSync(path.join(mockRepo, 'README.md'), `
# Awesome Tool

A test tool for Enlighten.

## Installation

\`\`\`bash
npx skills add test-owner/awesome-tool
\`\`\`
`);
  fs.writeFileSync(path.join(mockRepo, 'skills', 'awesome-skill', 'SKILL.md'), `---
name: awesome-skill
description: An awesome skill for testing
---
# Awesome Skill
`);

  const cli = new EnlightCLI({ homedir: testHome });

  // Test 1: Diagnose using README first
  console.log('Test 1: Diagnose repository via README guide...');
  const diag = await cli.diagnose(mockRepo, { json: true });
  assert.strictEqual(diag.readme.found, true);
  assert.strictEqual(diag.readme.hasInstallationGuide, true);
  assert.strictEqual(diag.readme.primarySuggestion.type, 'skills_cli');
  console.log('✅ Test 1 passed: Diagnose with README guide\n');

  // Test 2: Dry Run Install
  console.log('Test 2: Dry-run install...');
  const dryRes = await cli.install(mockRepo, { dryRun: true, json: true });
  assert.strictEqual(dryRes.status, 'dry_run');
  assert.strictEqual(dryRes.guide_followed, true);
  assert(dryRes.guide_command.includes('skills add'));
  console.log('✅ Test 2 passed: Dry-run install\n');

  // Test 3: Local installation fallback & skill sync
  console.log('Test 3: Install repository...');
  const installRes = await cli.install(mockRepo, { skipGuide: true, json: true });
  assert.strictEqual(installRes.status, 'success');
  assert(installRes.skills_registered.some(s => s.name === 'awesome-skill'));

  // Verify skill registered in harnesses
  assert(fs.existsSync(path.join(testHome, '.gemini', 'skills', 'awesome-skill', 'SKILL.md')), 'Should be in .gemini');
  assert(fs.existsSync(path.join(testHome, '.agents', 'skills', 'awesome-skill', 'SKILL.md')), 'Should be in .agents');
  assert(fs.existsSync(path.join(testHome, '.claude', 'skills', 'awesome-skill', 'SKILL.md')), 'Should be in .claude');
  console.log('✅ Test 3 passed: Install & global registration\n');

  // Test 4: List Installed
  console.log('Test 4: List installed...');
  const list = cli.listInstalled({ json: true });
  assert.strictEqual(list.length, 1);
  assert.strictEqual(list[0].identifier, installRes.identifier);
  console.log('✅ Test 4 passed: List\n');

  // Test 5: Uninstall
  console.log('Test 5: Uninstall repository...');
  const uninstRes = cli.uninstall(installRes.identifier, { force: true, json: true });
  assert.strictEqual(uninstRes.status, 'success');

  // Verify cleaned up
  assert(!fs.existsSync(path.join(testHome, '.gemini', 'skills', 'awesome-skill')), 'Skill should be removed from .gemini');
  const afterList = cli.listInstalled({ json: true });
  assert.strictEqual(afterList.length, 0);
  console.log('✅ Test 5 passed: Uninstall\n');

  // Cleanup
  fs.rmSync(testHome, { recursive: true, force: true });
  fs.rmSync(mockRepo, { recursive: true, force: true });

  console.log('========================================================');
  console.log('🎉 ALL LIFECYCLE TESTS PASSED!');
  console.log('========================================================');
})();

#!/usr/bin/env node
/**
 * Test EnlightCLI Lifecycle: install, list, diagnose, uninstall
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const assert = require('assert');

const { EnlightCLI } = require('../bin/enlighten');

console.log('Testing EnlightCLI Lifecycle\n');
console.log('='.repeat(50) + '\n');

const testHome = path.join(os.tmpdir(), `test-enlighten-cli-${Date.now()}`);
fs.mkdirSync(testHome, { recursive: true });

// Setup fake harnesses
fs.mkdirSync(path.join(testHome, '.gemini', 'skills'), { recursive: true });
fs.mkdirSync(path.join(testHome, '.agents', 'skills'), { recursive: true });
fs.mkdirSync(path.join(testHome, '.claude', 'skills'), { recursive: true });

// Create a mock repo
const mockRepo = path.join(os.tmpdir(), `test-repo-cli-${Date.now()}`);
fs.mkdirSync(path.join(mockRepo, 'skills', 'awesome-skill'), { recursive: true });
fs.writeFileSync(path.join(mockRepo, 'skills', 'awesome-skill', 'SKILL.md'), `---
name: awesome-skill
description: An awesome skill for testing
---
# Awesome Skill
`);
fs.writeFileSync(path.join(mockRepo, 'package.json'), JSON.stringify({
  name: 'awesome-tool',
  version: '1.0.0',
  bin: { 'awesome-cli': './bin/awesome-cli' }
}));
fs.mkdirSync(path.join(mockRepo, 'bin'), { recursive: true });
fs.writeFileSync(path.join(mockRepo, 'bin', 'awesome-cli'), '#!/bin/sh\necho "Awesome!"\n');
fs.chmodSync(path.join(mockRepo, 'bin', 'awesome-cli'), 0o755);

const cli = new EnlightCLI({ homedir: testHome });

// Test 1: Diagnose
console.log('Test 1: Diagnose repository...');
const diag = cli.diagnose(mockRepo, { json: true });
assert.strictEqual(diag.status, 'scanned');
assert(diag.skills.count > 0);
assert(diag.suggestions.binaries.includes('awesome-cli'));
console.log('✅ Test 1 passed: Diagnose\n');

// Test 2: Install
console.log('Test 2: Install repository...');
const installRes = cli.install(mockRepo, { json: true });
assert.strictEqual(installRes.status, 'success');
assert(installRes.skills_registered.some(s => s.name === 'awesome-skill'));

// Verify skill registered in harnesses
assert(fs.existsSync(path.join(testHome, '.gemini', 'skills', 'awesome-skill', 'SKILL.md')), 'Should be in .gemini');
assert(fs.existsSync(path.join(testHome, '.agents', 'skills', 'awesome-skill', 'SKILL.md')), 'Should be in .agents');
assert(fs.existsSync(path.join(testHome, '.claude', 'skills', 'awesome-skill', 'SKILL.md')), 'Should be in .claude');

// Verify binary exposed
assert(fs.existsSync(path.join(testHome, '.local', 'bin', 'awesome-cli')), 'Binary should be in ~/.local/bin');
console.log('✅ Test 2 passed: Install\n');

// Test 3: List Installed
console.log('Test 3: List installed...');
const list = cli.listInstalled({ json: true });
assert.strictEqual(list.length, 1);
assert.strictEqual(list[0].identifier, installRes.identifier);
console.log('✅ Test 3 passed: List\n');

// Test 4: Uninstall
console.log('Test 4: Uninstall repository...');
const uninstRes = cli.uninstall(installRes.identifier, { force: true, json: true });
assert.strictEqual(uninstRes.status, 'success');

// Verify cleaned up
assert(!fs.existsSync(path.join(testHome, '.gemini', 'skills', 'awesome-skill')), 'Skill should be removed from .gemini');
assert(!fs.existsSync(path.join(testHome, '.local', 'bin', 'awesome-cli')), 'Binary should be removed from ~/.local/bin');
const afterList = cli.listInstalled({ json: true });
assert.strictEqual(afterList.length, 0);
console.log('✅ Test 4 passed: Uninstall\n');

// Cleanup
fs.rmSync(testHome, { recursive: true, force: true });
fs.rmSync(mockRepo, { recursive: true, force: true });

console.log('========================================================');
console.log('🎉 ALL LIFECYCLE TESTS PASSED!');
console.log('========================================================');

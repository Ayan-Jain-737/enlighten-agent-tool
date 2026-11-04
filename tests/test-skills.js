#!/usr/bin/env node
/**
 * Test Skill Discovery & Multi-Harness Registration
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const assert = require('assert');

const { SkillRegistry } = require('../skills/enlighten-installer/scripts/skill-registry');
const { EnlightenScanner } = require('../skills/enlighten-installer/scripts/scan-repo');

console.log('Testing Skill Discovery & Registration\n');
console.log('='.repeat(50) + '\n');

const testHarnessHome = path.join(os.tmpdir(), `test-enlighten-harness-${Date.now()}`);
fs.mkdirSync(testHarnessHome, { recursive: true });

// Setup fake harness directories
fs.mkdirSync(path.join(testHarnessHome, '.gemini', 'skills'), { recursive: true });
fs.mkdirSync(path.join(testHarnessHome, '.agents', 'skills'), { recursive: true });
fs.mkdirSync(path.join(testHarnessHome, '.claude', 'skills'), { recursive: true });
fs.mkdirSync(path.join(testHarnessHome, '.hermes', 'skills'), { recursive: true });

// Create a mock multi-skill repository
const mockRepo = path.join(os.tmpdir(), `mock-repo-${Date.now()}`);
fs.mkdirSync(mockRepo, { recursive: true });

// 1. Root skill
fs.writeFileSync(path.join(mockRepo, 'SKILL.md'), `---
name: main-root-skill
description: Main root skill description
version: 1.0.0
---
# Main Root Skill
`);

// 2. Sub-skill 1
const subSkill1 = path.join(mockRepo, 'skills', 'sub-skill-alpha');
fs.mkdirSync(subSkill1, { recursive: true });
fs.writeFileSync(path.join(subSkill1, 'SKILL.md'), `---
name: sub-skill-alpha
description: Sub skill alpha description
version: 1.2.0
---
# Sub Skill Alpha
`);

// 3. Sub-skill 2 without frontmatter name (should infer from folder)
const subSkill2 = path.join(mockRepo, 'skills', 'inferred-skill');
fs.mkdirSync(subSkill2, { recursive: true });
fs.writeFileSync(path.join(subSkill2, 'SKILL.md'), `# Inferred Skill
Just markdown content
`);

// Test 1: Discover skills
console.log('Test 1: Discovering skills in repository...');
const registry = new SkillRegistry({ homedir: testHarnessHome });
const discovered = registry.discoverSkills(mockRepo);

console.log(`Discovered ${discovered.length} skills:`, discovered.map(s => s.name));
assert.strictEqual(discovered.length, 3, 'Should discover all 3 skills');
assert(discovered.some(s => s.name === 'main-root-skill'), 'Should find main-root-skill');
assert(discovered.some(s => s.name === 'sub-skill-alpha'), 'Should find sub-skill-alpha');
assert(discovered.some(s => s.name === 'inferred-skill'), 'Should infer name for inferred-skill');
console.log('✅ Test 1 passed: Skill discovery verified\n');

// Test 2: Global Registration across all harnesses (when allHarnesses: true)
console.log('Test 2: Registering skills globally across harnesses...');
for (const skill of discovered) {
  const result = registry.registerSkill(skill, {
    repoUrl: 'https://github.com/test-owner/test-repo.git',
    allHarnesses: true
  });
  assert(result.registeredHarnesses.length >= 4, 'Should register in at least 4 harnesses');
}

// Verify files exist in harness dirs
assert(fs.existsSync(path.join(testHarnessHome, '.gemini', 'skills', 'main-root-skill', 'SKILL.md')), 'Should exist in .gemini');
assert(fs.existsSync(path.join(testHarnessHome, '.agents', 'skills', 'sub-skill-alpha', 'SKILL.md')), 'Should exist in .agents');
assert(fs.existsSync(path.join(testHarnessHome, '.claude', 'skills', 'inferred-skill', 'SKILL.md')), 'Should exist in .claude');
assert(fs.existsSync(path.join(testHarnessHome, '.hermes', 'skills', 'main-root-skill', 'SKILL.md')), 'Should exist in .hermes');
console.log('✅ Test 2 passed: Global registration verified\n');

// Test 2B: Targeted registration for active agent only (e.g. AGY / Gemini)
console.log('Test 2B: Registering skill targeting only active agent (gemini)...');
const isolatedHome = path.join(os.tmpdir(), `test-isolated-harness-${Date.now()}`);
fs.mkdirSync(path.join(isolatedHome, '.gemini', 'skills'), { recursive: true });
const isolatedRegistry = new SkillRegistry({ homedir: isolatedHome });
const singleSkill = discovered[0];
const targetedResult = isolatedRegistry.registerSkill(singleSkill, {
  repoUrl: 'https://github.com/test-owner/test-repo.git',
  targetHarness: 'gemini'
});
assert.strictEqual(targetedResult.registeredHarnesses.length, 2, 'Should only register in Open Agents and Gemini');
assert(fs.existsSync(path.join(isolatedHome, '.gemini', 'skills', singleSkill.name, 'SKILL.md')), 'Should exist in .gemini');
assert(fs.existsSync(path.join(isolatedHome, '.agents', 'skills', singleSkill.name, 'SKILL.md')), 'Should exist in .agents');
assert(!fs.existsSync(path.join(isolatedHome, '.codex')), 'Must NOT create .codex');
assert(!fs.existsSync(path.join(isolatedHome, '.zed')), 'Must NOT create .zed');
assert(!fs.existsSync(path.join(isolatedHome, '.claude')), 'Must NOT create .claude');
fs.rmSync(isolatedHome, { recursive: true, force: true });
console.log('✅ Test 2B passed: Targeted registration for active agent only verified\n');

// Test 3: Skill lockfile update
console.log('Test 3: Checking .skill-lock.json...');
const lockFile = path.join(testHarnessHome, '.agents', '.skill-lock.json');
assert(fs.existsSync(lockFile), '.skill-lock.json must be created');
const lockContent = JSON.parse(fs.readFileSync(lockFile, 'utf8'));
assert(lockContent.skills['sub-skill-alpha'], 'sub-skill-alpha must be in lockfile');
assert.strictEqual(lockContent.skills['sub-skill-alpha'].source, 'test-owner/test-repo');
console.log('✅ Test 3 passed: Skill lockfile verified\n');

// Test 4: Unregister skill
console.log('Test 4: Unregistering skill...');
const removed = registry.unregisterSkill('sub-skill-alpha');
assert(!fs.existsSync(path.join(testHarnessHome, '.gemini', 'skills', 'sub-skill-alpha')), 'Should be removed from .gemini');
assert(!fs.existsSync(path.join(testHarnessHome, '.agents', 'skills', 'sub-skill-alpha')), 'Should be removed from .agents');
console.log('✅ Test 4 passed: Skill unregistration verified\n');

// Test 5: Tool repo with no skills gets auto-synthesized skill
console.log('Test 5: Auto-synthesizing skill for tool repo without SKILL.md...');
const toolRepo = path.join(os.tmpdir(), `mock-tool-${Date.now()}`);
fs.mkdirSync(toolRepo, { recursive: true });
fs.writeFileSync(path.join(toolRepo, 'package.json'), JSON.stringify({
  name: 'my-cli-tool',
  bin: { 'my-cli': './bin/my-cli' }
}));

const synthesized = registry.generateSkillForRepo(toolRepo, {
  name: 'my-cli-tool',
  repoUrl: 'https://github.com/tools/my-cli-tool',
  binaries: ['my-cli']
});
assert.strictEqual(synthesized.name, 'my-cli-tool');
assert(fs.existsSync(synthesized.skillFilePath), 'Synthesized SKILL.md must exist');
const synthContent = fs.readFileSync(synthesized.skillFilePath, 'utf8');
assert(synthContent.includes('my-cli-tool'), 'Must contain tool name');
assert(synthContent.includes('my-cli'), 'Must list binary');
console.log('✅ Test 5 passed: Auto-synthesizing skill verified\n');

// Cleanup
fs.rmSync(testHarnessHome, { recursive: true, force: true });
fs.rmSync(mockRepo, { recursive: true, force: true });
fs.rmSync(toolRepo, { recursive: true, force: true });

console.log('========================================================');
console.log('🎉 ALL SKILL DISCOVERY & REGISTRATION TESTS PASSED!');
console.log('========================================================');

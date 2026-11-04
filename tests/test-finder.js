#!/usr/bin/env node
/**
 * Test SkillFinder & Discovery Engine
 */

const assert = require('assert');
const path = require('path');
const os = require('os');
const fs = require('fs');
const { SkillFinder } = require('../skills/enlighten-installer/scripts/skill-finder');

(async () => {
  console.log('Testing SkillFinder & Discovery Engine\n');
  console.log('='.repeat(50) + '\n');

  const testHome = path.join(os.tmpdir(), `test-finder-home-${Date.now()}`);
  fs.mkdirSync(path.join(testHome, '.agents', 'skills'), { recursive: true });

  const finder = new SkillFinder({ homedir: testHome });

  // Test 1: Search by exact keyword
  console.log('Test 1: Search for "react"...');
  const reactResults = await finder.search('react');
  assert(reactResults.length > 0, 'Should find results for react');
  assert(reactResults.some(r => r.name.includes('react')), 'Should contain react skill');
  console.log(`✅ Test 1 passed: Found ${reactResults.length} react skills\n`);

  // Test 2: Search for tools & binaries (playwright, ripgrep)
  console.log('Test 2: Search for CLI tool "ripgrep"...');
  const toolResults = await finder.search('ripgrep');
  assert(toolResults.length > 0, 'Should find ripgrep');
  assert.strictEqual(toolResults[0].source, 'BurntSushi/ripgrep');
  assert.strictEqual(toolResults[0].type, 'tool-repo');
  console.log('✅ Test 2 passed: CLI tool discovery verified\n');

  // Test 3: Local installed status detection
  console.log('Test 3: Checking installed status detection...');
  const lockFile = path.join(testHome, '.agents', '.skill-lock.json');
  fs.writeFileSync(lockFile, JSON.stringify({
    version: 3,
    skills: {
      'react-best-practices': {
        source: 'vercel-labs/agent-skills',
        installedAt: new Date().toISOString()
      }
    }
  }));

  const afterInstallResults = await finder.search('react');
  const reactSkill = afterInstallResults.find(r => r.name === 'react-best-practices');
  assert(reactSkill, 'Should find react-best-practices');
  assert.strictEqual(reactSkill.isInstalled, true, 'Should mark as installed');
  console.log('✅ Test 3 passed: Installed status properly reflected\n');

  // Test 4: Format output
  console.log('Test 4: Checking output formatting...');
  const textOutput = finder.formatOutput(reactResults, 'react');
  assert(textOutput.includes('enlighten install'), 'Must contain install command');
  assert(textOutput.includes('react-best-practices'), 'Must contain skill name');
  console.log('✅ Test 4 passed: Terminal output formatting verified\n');

  // Cleanup
  fs.rmSync(testHome, { recursive: true, force: true });

  console.log('========================================================');
  console.log('🎉 ALL SKILL FINDER TESTS PASSED!');
  console.log('========================================================');
})();

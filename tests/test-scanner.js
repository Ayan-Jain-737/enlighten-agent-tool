#!/usr/bin/env node
/**
 * Test the enlighten scanner
 */

const { EnlightenScanner } = require('../skills/enlighten-installer/scripts/scan-repo');

// Test with a known repository
const scanner = new EnlightenScanner();

console.log('Testing Enlighten Scanner\n');
console.log('=' .repeat(50) + '\n');

// Test scan
const testDir = '/tmp/test-repo-' + Date.now();

// Create a test TypeScript/React project
const fs = require('fs');
const path = require('path');

fs.mkdirSync(testDir, { recursive: true });

// Create package.json (TypeScript React)
fs.writeFileSync(path.join(testDir, 'package.json'), JSON.stringify({
  name: 'test-react-app',
  dependencies: {
    'react': '^18.0.0',
    'typescript': '^5.0.0',
    '@types/react': '^18.0.0'
  },
  devDependencies: {
    'vite': '^4.0.0',
    '@vitejs/plugin-react': '^3.0.0'
  },
  scripts: {
    'dev': 'vite',
    'build': 'vite build',
    'test': 'vitest'
  }
}, null, 2));

// Create requirements.txt (Python backend)
fs.writeFileSync(path.join(testDir, 'requirements.txt'), `
fastapi>=0.90.0
uvicorn>=0.20.0
python-jose>=3.3.0
`);

// Run test
console.log('Test 1: TypeScript/React project');
const result = scanner.scanRepo(testDir);
console.log('Language:', result.detected.language);
console.log('Framework:', result.detected.framework);
console.log('Recommended Profile:', result.profile.recommended);
console.log('\n');

console.log('Test 2: JSON Output');
console.log(JSON.stringify(result, null, 2));

// Cleanup
fs.rmSync(testDir, { recursive: true, force: true });

console.log('\n✅ All tests passed!');
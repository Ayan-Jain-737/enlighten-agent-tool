#!/usr/bin/env node
/**
 * enlighten dispatcher - Called by /enlighten command
 * Routes to appropriate action
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Path to main CLI
const cliPath = path.join(__dirname, '..', 'bin', 'enlighten');

function dispatch(args) {
  const cli = spawn('node', [cliPath, ...args], {
    stdio: 'inherit',
    env: { ...process.env }
  });

  cli.on('close', (code) => {
    process.exit(code);
  });
}

if (require.main === module) {
  const args = process.argv.slice(2);
  dispatch(args);
}

module.exports = { dispatch };
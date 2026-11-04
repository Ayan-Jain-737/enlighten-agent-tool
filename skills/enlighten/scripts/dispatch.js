#!/usr/bin/env node
/**
 * enlighten dispatcher - Called by /enlighten slash command or directly by agent
 * Routes to EnlightCLI
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

function resolveCliPath() {
  // 1. Check local bin in PATH
  const localBin = path.join(os.homedir(), '.local', 'bin', 'enlighten');
  if (fs.existsSync(localBin)) return localBin;

  // 2. Check project root relative to this file
  const candidate = path.resolve(__dirname, '..', '..', '..', 'bin', 'enlighten');
  if (fs.existsSync(candidate)) return candidate;

  // 3. Check ~/.enlighten/enlighten-agent-tool/bin/enlighten
  const defaultClone = path.join(os.homedir(), '.enlighten', 'enlighten-agent-tool', 'bin', 'enlighten');
  if (fs.existsSync(defaultClone)) return defaultClone;

  return 'enlighten';
}

function dispatch(args) {
  const cliPath = resolveCliPath();

  if (cliPath === 'enlighten') {
    const cli = spawn('enlighten', args, {
      stdio: 'inherit',
      env: { ...process.env }
    });
    cli.on('close', (code) => process.exit(code || 0));
  } else {
    const cli = spawn('node', [cliPath, ...args], {
      stdio: 'inherit',
      env: { ...process.env }
    });
    cli.on('close', (code) => process.exit(code || 0));
  }
}

if (require.main === module) {
  const args = process.argv.slice(2);
  dispatch(args);
}

module.exports = { dispatch, resolveCliPath };

#!/usr/bin/env node
/**
 * ias dispatcher - Called by /ias slash command or directly by agent
 * Routes to InstallAnythingCLI
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

function resolveCliPath() {
  // 1. Check local bin in PATH
  for (const binName of ['ias', 'install-anything', 'install-anything-skill', 'enlighten']) {
    const localBin = path.join(os.homedir(), '.local', 'bin', binName);
    if (fs.existsSync(localBin)) return localBin;
  }

  // 2. Check project root relative to this file
  const candidate = path.resolve(__dirname, '..', '..', '..', 'bin', 'install-anything');
  if (fs.existsSync(candidate)) return candidate;

  // 3. Check ~/.install-anything/install-anything-skill/bin/install-anything
  const defaultClone = path.join(os.homedir(), '.install-anything', 'install-anything-skill', 'bin', 'install-anything');
  if (fs.existsSync(defaultClone)) return defaultClone;

  const legacyClone = path.join(os.homedir(), '.enlighten', 'install-anything-skill', 'bin', 'install-anything');
  if (fs.existsSync(legacyClone)) return legacyClone;

  return 'ias';
}

function detectCallerHarness() {
  if (process.env.ANTIGRAVITY_AGENT || process.env.ANTIGRAVITY_APP_DATA_DIR || process.env.GEMINI_CLI || process.env.GEMINI_HOME) {
    return 'gemini';
  }
  if (process.env.CLAUDE_CODE_ENTRYPOINT || process.env.CLAUDE_AGENT || process.env.CLAUDE_HOME) {
    return 'claude';
  }
  if (process.env.HERMES_CONFIG_DIR || process.env.HERMES_AGENT) {
    return 'hermes';
  }
  if (process.env.OPENCODE_CONFIG_DIR || process.env.OPENCODE_HOME) {
    return 'opencode';
  }
  if (process.env.CODEX_HOME || process.env.CODEX_AGENT) {
    return 'codex';
  }
  if (process.env.CURSOR_HOME || process.env.CURSOR_AGENT) {
    return 'cursor';
  }
  if (process.env.ZED_HOME || process.env.ZED_AGENT) {
    return 'zed';
  }

  // Check path of this script
  const scriptPath = __filename || __dirname;
  if (scriptPath.includes('/.gemini/') || scriptPath.includes('\\.gemini\\')) return 'gemini';
  if (scriptPath.includes('/.claude/') || scriptPath.includes('\\.claude\\')) return 'claude';
  if (scriptPath.includes('/.hermes/') || scriptPath.includes('\\.hermes\\')) return 'hermes';
  if (scriptPath.includes('/.codex/') || scriptPath.includes('\\.codex\\')) return 'codex';
  if (scriptPath.includes('/.zed/') || scriptPath.includes('\\.zed\\')) return 'zed';
  if (scriptPath.includes('/.cursor/') || scriptPath.includes('\\.cursor\\')) return 'cursor';
  if (scriptPath.includes('opencode')) return 'opencode';

  return null;
}

function dispatch(args) {
  const cliPath = resolveCliPath();
  const caller = detectCallerHarness();
  const env = { ...process.env };
  if (caller && !env.INSTALL_ANYTHING_CALLER_HARNESS) {
    env.INSTALL_ANYTHING_CALLER_HARNESS = caller;
    env.ENLIGHTEN_CALLER_HARNESS = caller;
  }

  if (cliPath === 'ias' || cliPath === 'install-anything' || cliPath === 'enlighten') {
    const cli = spawn(cliPath, args, {
      stdio: 'inherit',
      env
    });
    cli.on('close', (code) => process.exit(code || 0));
  } else {
    const cli = spawn('node', [cliPath, ...args], {
      stdio: 'inherit',
      env
    });
    cli.on('close', (code) => process.exit(code || 0));
  }
}

if (require.main === module) {
  const args = process.argv.slice(2);
  dispatch(args);
}

module.exports = { dispatch, resolveCliPath, detectCallerHarness };

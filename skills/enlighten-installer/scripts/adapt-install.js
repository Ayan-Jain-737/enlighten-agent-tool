#!/usr/bin/env node
/**
 * enlighten-installer: Adapt Script
 * Adapts install commands/scripts for the target OS and harness
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

class ScriptAdapter {
  constructor(options = {}) {
    this.harness = options.harness || 'auto';
    this.targetOS = options.targetOS || this.detectOS();
    this.dryRun = options.dryRun || false;
  }

  detectOS() {
    const platform = os.platform();
    switch (platform) {
      case 'darwin': return 'macos';
      case 'linux': return 'linux';
      case 'win32': return 'windows';
      default: return 'unix';
    }
  }

  detectHarness() {
    if (this.harness !== 'auto') return this.harness;

    // Check environment
    if (process.env.HERMES_CONFIG_DIR) return 'hermes';
    if (process.env.CLAUDE_HOME) return 'claude';
    if (process.env.OPENCODE_CONFIG_DIR) return 'opencode';
    if (process.env.CODEX_HOME) return 'codex';

    // Check for presence
    try {
      execSync('command -v hermes', { stdio: 'pipe' });
      return 'hermes';
    } catch {}

    try {
      execSync('claude --version', { stdio: 'pipe' });
      return 'claude';
    } catch {}

    return 'unknown';
  }

  adaptInstallCommand(command, harness) {
    const adapted = {
      original: command,
      adapted: '',
      harness_specific: false,
      os_adaptations: []
    };

    harness = harness || this.detectHarness();

    // Package managers by harness
    const managers = {
      hermes: {
        install: 'npx ecc plugin add',
        remove: 'npx ecc plugin remove',
        update: 'npx ecc update'
      },
      claude: {
        install: '/plugin marketplace add',
        remove: '/plugin remove',
        update: 'claude plugin update'
      },
      opencode: {
        install: 'opencode --install',
        remove: 'opencode --uninstall',
        update: 'opencode --update'
      },
      codex: {
        install: 'codex plugin add',
        remove: 'codex plugin remove',
        update: 'codex plugin update'
      }
    };

    const manager = managers[harness] || managers.hermes;

    // If command is an npm script, adapt for harness
    if (command.includes('npm install') || command.includes('yarn add')) {
      // Check if it's an ECC plugin
      const pluginMatch = command.match(/(?:ecc-universal|ecc-agentshield)/);
      if (pluginMatch) {
        adapted.adapted = `npx ecc-universal@latest setup`;
        adapted.harness_specific = true;
        adapted.hint = `Use ECC's guided setup for ${harness}`;
      } else {
        adapted.adapted = command;
      }
    } else if (command.includes('./install.sh')) {
      adapted.adapted = this.adaptShellScript(command);
    } else {
      adapted.adapted = command;
    }

    // Add OS-specific prefixes
    if (this.targetOS === 'windows' && !adapted.adapted.startsWith('pwsh') && !adapted.adapted.startsWith('npm')) {
      adapted.os_adaptations.push('Convert to PowerShell or use npm/yarn');
    }

    return adapted;
  }

  adaptShellScript(command) {
    if (this.targetOS === 'windows') {
      return command.replace('./install.sh', '.\\install.ps1');
    }
    return command;
  }

  generateUninstallScript(identifier) {
    const harness = this.detectHarness();
    const uninstallSteps = [];

    switch (harness) {
      case 'hermes':
        uninstallSteps.push(`npx ecc plugin remove ${identifier}`);
        uninstallSteps.push(`rm -rf ~/.hermes/plugins/${identifier}`);
        uninstallSteps.push(`sed -i '/${identifier}/d' ~/.hermes/profiles/*/profile.json 2>/dev/null || true`);
        break;
      case 'claude':
        uninstallSteps.push(`/plugin remove ${identifier}`);
        uninstallSteps.push(`rm -rf ~/.claude/plugins/${identifier}`);
        break;
      default:
        uninstallSteps.push(`# Manual uninstall for ${harness}: remove plugin and config`);
    }

    return {
      identifier: identifier,
      harness: harness,
      steps: uninstallSteps,
      cleanup_files: [
        `~/.hermes/cache/${identifier}`,
        `~/.hermes/logs/${identifier}.log`
      ]
    };
  }

  adapt(diagnostics) {
    return {
      status: 'adapted',
      original_repo: diagnostics.repository,
      detected: diagnostics.detected,
      profile: diagnostics.profile,
      adapted_install: this.adaptInstallCommand('npm install', diagnostics.harness),
      os: this.targetOS,
      harness: this.detectHarness(),
      dry_run: this.dryRun
    };
  }
}

// CLI
if (require.main === module) {
  const action = process.argv[2];
  const identifier = process.argv[3];

  if (!action || !identifier) {
    console.error(JSON.stringify({
      error: 'Usage: adapt-install.js <adapt|uninstall> <identifier>'
    }));
    process.exit(1);
  }

  const adapter = new ScriptAdapter();

  if (action === 'adapt') {
    const mockDiagnostics = {
      repository: identifier,
      detected: { language: 'typescript', framework: 'next' },
      profile: { recommended: 'web-developer' }
    };
    const result = adapter.adapt(mockDiagnostics);
    console.log(JSON.stringify(result, null, 2));
  } else if (action === 'uninstall') {
    const result = adapter.generateUninstallScript(identifier);
    console.log(JSON.stringify(result, null, 2));
  }
}

module.exports = { ScriptAdapter };
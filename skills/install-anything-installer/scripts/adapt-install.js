#!/usr/bin/env node
/**
 * install-anything-installer: Adapt Script
 * Adapts install commands/scripts for the target OS and harness
 * Handles ALL package managers and install methods automatically
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
    if (this.harness && this.harness !== 'auto') return this.harness;

    // Check explicit env vars
    if (process.env.INSTALL_ANYTHING_CALLER_HARNESS) return process.env.INSTALL_ANYTHING_CALLER_HARNESS;
    if (process.env.INSTALL_ANYTHING_TARGET_HARNESS) return process.env.INSTALL_ANYTHING_TARGET_HARNESS;
    if (process.env.INSTALL_ANYTHING_HARNESS) return process.env.INSTALL_ANYTHING_HARNESS;
    if (process.env.ENLIGHTEN_CALLER_HARNESS) return process.env.ENLIGHTEN_CALLER_HARNESS;
    if (process.env.ENLIGHTEN_TARGET_HARNESS) return process.env.ENLIGHTEN_TARGET_HARNESS;
    if (process.env.ENLIGHTEN_HARNESS) return process.env.ENLIGHTEN_HARNESS;

    // Check Antigravity / Gemini runtime
    if (process.env.ANTIGRAVITY_AGENT ||
        process.env.ANTIGRAVITY_APP_DATA_DIR ||
        process.env.ANTIGRAVITY_CONVERSATION_ID ||
        process.env.ANTIGRAVITY_AGENTAPI_EXE ||
        process.env.ANTIGRAVITY_LS_ADDRESS ||
        process.env.GEMINI_CLI ||
        process.env.GEMINI_HOME ||
        process.env.AGY_VERSION) {
      return 'gemini';
    }

    // Check environment
    if (process.env.HERMES_CONFIG_DIR || process.env.HERMES_AGENT) return 'hermes';
    if (process.env.CLAUDE_HOME || process.env.CLAUDE_CODE_ENTRYPOINT || process.env.CLAUDE_AGENT) return 'claude';
    if (process.env.OPENCODE_CONFIG_DIR || process.env.OPENCODE_HOME) return 'opencode';
    if (process.env.CODEX_HOME || process.env.CODEX_AGENT) return 'codex';
    if (process.env.CURSOR_HOME || process.env.CURSOR_AGENT) return 'cursor';
    if (process.env.ZED_HOME || process.env.ZED_AGENT) return 'zed';

    // Check for presence
    try {
      execSync('command -v hermes', { stdio: 'pipe' });
      return 'hermes';
    } catch {}

    try {
      execSync('claude --version', { stdio: 'pipe' });
      return 'claude';
    } catch {}

    try {
      execSync('opencode --version', { stdio: 'pipe' });
      return 'opencode';
    } catch {}

    try {
      execSync('codex --version', { stdio: 'pipe' });
      return 'codex';
    } catch {}

    return 'unknown';
  }

  /**
   * Get the install commands for a specific install method
   */
  getInstallCommands(installMethod) {
    const managers = {
      npm: {
        install: 'npm install',
        installGlobal: 'npm install -g',
        add: 'npm install',
        dev: 'npm install --save-dev',
        global: 'npm install -g',
        ci: 'npm ci'
      },
      yarn: {
        install: 'yarn install',
        add: 'yarn add',
        dev: 'yarn add --dev',
        global: 'yarn global add',
        ci: 'yarn install --frozen-lockfile'
      },
      pnpm: {
        install: 'pnpm install',
        add: 'pnpm add',
        dev: 'pnpm add -D',
        global: 'pnpm add -g',
        ci: 'pnpm install --frozen-lockfile'
      },
      bun: {
        install: 'bun install',
        add: 'bun add',
        dev: 'bun add -d',
        global: 'bun add -g',
        ci: 'bun install --frozen-lockfile'
      },
      pip: {
        install: 'pip install -r requirements.txt',
        installPackage: 'pip install',
        dev: 'pip install -r requirements-dev.txt',
        installEditable: 'pip install -e .',
        installPackageDev: 'pip install --dev'
      },
      poetry: {
        install: 'poetry install',
        add: 'poetry add',
        dev: 'poetry add --group dev',
        installNoDev: 'poetry install --only=main'
      },
      pipenv: {
        install: 'pipenv install',
        dev: 'pipenv install --dev',
        sync: 'pipenv sync'
      },
      uv: {
        install: 'uv pip install -r requirements.txt',
        add: 'uv pip install',
        sync: 'uv sync',
        installProject: 'uv pip install -e .'
      },
      cargo: {
        install: 'cargo build --release',
        installPackage: 'cargo install',
        installLocal: 'cargo install --path .',
        test: 'cargo test',
        check: 'cargo check'
      },
      go: {
        install: 'go build',
        installPackage: 'go install',
        get: 'go get',
        mod: 'go mod tidy',
        build: 'go build -o bin/app .'
      },
      gradle: {
        install: './gradlew build',
        installBoot: './gradlew bootJar',
        test: './gradlew test',
        build: './gradlew build -x test'
      },
      maven: {
        install: 'mvn clean install -DskipTests',
        package: 'mvn package -DskipTests',
        verify: 'mvn verify',
        compile: 'mvn compile'
      },
      composer: {
        install: 'composer install --no-dev --optimize-autoloader',
        installDev: 'composer install',
        require: 'composer require',
        requireDev: 'composer require --dev',
        dumpAutoload: 'composer dump-autoload -o'
      },
      bundler: {
        install: 'bundle install --without development test',
        installAll: 'bundle install',
        update: 'bundle update'
      },
      dotnet: {
        restore: 'dotnet restore',
        build: 'dotnet build --configuration Release',
        publish: 'dotnet publish -c Release',
        test: 'dotnet test'
      },
      cmake: {
        configure: 'cmake -B build -DCMAKE_BUILD_TYPE=Release',
        build: 'cmake --build build --config Release',
        install: 'cmake --install build'
      },
      make: {
        build: 'make',
        install: 'make install',
        clean: 'make clean'
      }
    };

    // Default to npm if unknown
    return managers[installMethod] || managers.npm;
  }

  getInstallCommand(installMethod, pkgName = null, options = {}) {
    const commands = this.getInstallCommands(installMethod);
    const { isDev = false, isGlobal = false, isLocal = false, pkgNameOpt = options.pkg } = options;

    const pkgNameFinal = pkgName || pkgNameOpt;

    if (['npm', 'yarn', 'pnpm', 'bun'].includes(installMethod)) {
      if (pkgNameFinal) {
        if (isDev) return commands.dev ? `${commands.dev} ${pkgNameFinal}` : `${commands.add} ${pkgNameFinal} --dev`;
        if (isGlobal) return commands.global ? `${commands.global} ${pkgNameFinal}` : `${commands.add} -g ${pkgNameFinal}`;
        return commands.add ? `${commands.add} ${pkgNameFinal}` : `${commands.install} ${pkgNameFinal}`;
      }
      if (isDev) return commands.dev || commands.install;
      if (isGlobal) return commands.global || commands.install;
      return commands.ci || commands.install;
    }

    if (['pip', 'uv'].includes(installMethod)) {
      if (pkgNameFinal) {
        if (isDev) return commands.installDev || `${commands.installPackage} ${pkgNameFinal} --dev`;
        return `${commands.installPackage} ${pkgNameFinal}`;
      }
      return commands.ci || commands.install;
    }

    if (installMethod === 'poetry') {
      if (pkgNameFinal) {
        if (isDev) return `${commands.add} ${pkgNameFinal} --group dev`;
        return `${commands.add} ${pkgNameFinal}`;
      }
      return commands.install;
    }

    if (installMethod === 'pipenv') {
      if (pkgNameFinal) {
        if (isDev) return `${commands.dev} ${pkgNameFinal}`;
        return `${commands.install} ${pkgNameFinal}`;
      }
      return commands.sync || commands.install;
    }

    if (installMethod === 'cargo') {
      if (pkgNameFinal) {
        if (isLocal) return `${commands.installLocal} ${pkgNameFinal}`;
        return `${commands.installPackage} ${pkgNameFinal}`;
      }
      if (isDev) return commands.test || commands.build;
      return commands.build || commands.install;
    }

    if (installMethod === 'go') {
      if (pkgNameFinal) return `${commands.get} ${pkgNameFinal}`;
      return commands.build;
    }

    if (installMethod === 'gradle' || installMethod === 'maven') {
      if (isDev) return commands.test || commands.verify;
      return commands.build || commands.install;
    }

    if (installMethod === 'composer') {
      if (pkgNameFinal) {
        if (isDev) return `${commands.requireDev} ${pkgNameFinal}`;
        return `${commands.require} ${pkgNameFinal}`;
      }
      return commands.install;
    }

    if (installMethod === 'bundler') {
      return isDev ? commands.installAll : commands.install;
    }

    if (installMethod === 'dotnet') {
      if (pkgNameFinal) return `${commands.build} ${pkgNameFinal}`;
      return isDev ? commands.test : commands.build;
    }

    if (installMethod === 'cmake') {
      return commands.build;
    }

    if (installMethod === 'make') {
      return commands.build;
    }

    // Default fallback
    return commands.install || 'make';
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
    if (this.harness && this.harness !== 'auto') return this.harness;

    // Check explicit env vars
    if (process.env.INSTALL_ANYTHING_CALLER_HARNESS) return process.env.INSTALL_ANYTHING_CALLER_HARNESS;
    if (process.env.INSTALL_ANYTHING_TARGET_HARNESS) return process.env.INSTALL_ANYTHING_TARGET_HARNESS;
    if (process.env.INSTALL_ANYTHING_HARNESS) return process.env.INSTALL_ANYTHING_HARNESS;
    if (process.env.ENLIGHTEN_CALLER_HARNESS) return process.env.ENLIGHTEN_CALLER_HARNESS;
    if (process.env.ENLIGHTEN_TARGET_HARNESS) return process.env.ENLIGHTEN_TARGET_HARNESS;
    if (process.env.ENLIGHTEN_HARNESS) return process.env.ENLIGHTEN_HARNESS;

    // Check Antigravity / Gemini runtime
    if (process.env.ANTIGRAVITY_AGENT ||
        process.env.ANTIGRAVITY_APP_DATA_DIR ||
        process.env.ANTIGRAVITY_CONVERSATION_ID ||
        process.env.ANTIGRAVITY_AGENTAPI_EXE ||
        process.env.ANTIGRAVITY_LS_ADDRESS ||
        process.env.GEMINI_CLI ||
        process.env.GEMINI_HOME ||
        process.env.AGY_VERSION) {
      return 'gemini';
    }

    // Check environment
    if (process.env.HERMES_CONFIG_DIR || process.env.HERMES_AGENT) return 'hermes';
    if (process.env.CLAUDE_HOME || process.env.CLAUDE_CODE_ENTRYPOINT || process.env.CLAUDE_AGENT) return 'claude';
    if (process.env.OPENCODE_CONFIG_DIR || process.env.OPENCODE_HOME) return 'opencode';
    if (process.env.CODEX_HOME || process.env.CODEX_AGENT) return 'codex';
    if (process.env.CURSOR_HOME || process.env.CURSOR_AGENT) return 'cursor';
    if (process.env.ZED_HOME || process.env.ZED_AGENT) return 'zed';

    // Check for presence
    try {
      execSync('command -v hermes', { stdio: 'pipe' });
      return 'hermes';
    } catch {}

    try {
      execSync('claude --version', { stdio: 'pipe' });
      return 'claude';
    } catch {}

    try {
      execSync('opencode --version', { stdio: 'pipe' });
      return 'opencode';
    } catch {}

    try {
      execSync('codex --version', { stdio: 'pipe' });
      return 'codex';
    } catch {}

    return 'unknown';
  }

  adaptInstallCommand(diagnostics, harness) {
    // installMethod can be at diagnostics.installMethod or diagnostics.detected.installMethod
    const installMethod = diagnostics.installMethod || (diagnostics.detected && diagnostics.detected.installMethod) || 'npm';
    const harnessType = harness || this.detectHarness();
    
    const adapted = {
      original: diagnostics.installCommand || 'auto',
      adapted: '',
      harness_specific: false,
      os_adaptations: [],
      installMethod: installMethod,
      commands: []
    };

    // Get the install commands based on method and harness
    const installCommands = this.getInstallCommands(installMethod);
    const installCmd = this.getInstallCommand(installMethod);

    // Build the command sequence
    const commands = [];

    // Pre-install steps
    if (['npm', 'yarn', 'pnpm', 'bun'].includes(installMethod)) {
      commands.push(installCommands.ci || installCommands.install);
    } else if (['pip', 'uv'].includes(installMethod)) {
      commands.push(installCommands.ci || installCommands.install);
    } else if (installMethod === 'poetry') {
      commands.push(installCommands.install);
    } else if (installMethod === 'cargo') {
      commands.push(installCommands.build || installCommands.install);
    } else if (installMethod === 'go') {
      commands.push(installCommands.build || installCommands.install);
    } else if (['gradle', 'maven'].includes(installMethod)) {
      commands.push(installCommands.install);
    } else if (installMethod === 'dotnet') {
      commands.push(installCommands.restore || installCommands.build);
    }

    // Add harness-specific steps
    const managers = {
      gemini: {
        skillInstall: 'install-anything install',
        skillRemove: 'install-anything uninstall',
        skillUpdate: 'install-anything install --force'
      },
      hermes: {
        skillInstall: 'npx ecc plugin add',
        skillRemove: 'npx ecc plugin remove',
        skillUpdate: 'npx ecc update'
      },
      claude: {
        skillInstall: '/plugin marketplace add',
        skillRemove: '/plugin remove',
        skillUpdate: 'claude plugin update'
      },
      opencode: {
        skillInstall: 'opencode --install',
        skillRemove: 'opencode --uninstall',
        skillUpdate: 'opencode --update'
      },
      codex: {
        skillInstall: 'codex plugin add',
        skillRemove: 'codex plugin remove',
        skillUpdate: 'codex plugin update'
      }
    };

    const manager = managers[harnessType] || managers.hermes;

    adapted.adapted = commands.join(' && ');
    adapted.commands = commands;
    adapted.installMethod = installMethod;
    adapted.harness = harnessType;
    adapted.harnessManager = manager;
    adapted.harness_specific = true;

    // Add OS-specific adaptations
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
      case 'opencode':
        uninstallSteps.push(`opencode --uninstall ${identifier}`);
        uninstallSteps.push(`rm -rf ~/.config/opencode/plugins/${identifier}`);
        break;
      case 'codex':
        uninstallSteps.push(`codex plugin remove ${identifier}`);
        uninstallSteps.push(`rm -rf ~/.codex/plugins/${identifier}`);
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
        `~/.hermes/logs/${identifier}.log`,
        `~/.claude/plugins/${identifier}`,
        `~/.config/opencode/plugins/${identifier}`,
        `~/.codex/plugins/${identifier}`
      ]
    };
  }

  adapt(diagnostics) {
    return {
      status: 'adapted',
      original_repo: diagnostics.repository,
      detected: diagnostics.detected,
      profile: diagnostics.profile,
      adapted_install: this.adaptInstallCommand(diagnostics, diagnostics.harness),
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
      detected: { language: 'typescript', framework: 'next', installMethod: 'npm' },
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
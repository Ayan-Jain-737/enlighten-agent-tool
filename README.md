# enlighten-agent-tool

## What This Tool Does

**Enlighten** is a universal GitHub repository installer for AI agent harnesses. Install any repo with:

```bash
/enlighten install https://github.com/user/repo
```

Works with: **Hermes, Claude Code, Opencode, Codex, and more**.

## Usage

```bash
# Install a repository
/enlighten install https://github.com/user/repo

# Dry-run (preview changes)
/enlighten install https://github.com/user/repo --dry-run

# Install with specific options
/enlight install https://github.com/user/repo --harness hermes --profile cse-core

# List what's installed
/enlighten list-installed

# Uninstall
/enlighten uninstall repo-identifier

# Diagnose before installing
/enlighten diagnose https://github.com/user/repo
```

## Features

✅ **Self-contained** - Works without ECC dependency  
✅ **Harness-agnostic** - Runs in Hermes, Claude, Opencode, Codex  
✅ **Auto-detect** - Finds language, framework, requirements  
✅ **Profile mapping** - Chooses optimal configuration  
✅ **OS adaptation** - Rewrites install scripts for your system  
✅ **Full uninstall** - Removes everything cleanly  
✅ **Safety checks** - Dry-run, confirmation prompts, rollback  

## Architecture

```
enlighten-agent-tool/
├── bin/
│   └── enlighten           # Main CLI binary
├── skills/
│   ├── enlighten/          # Main /enlighten command skill
│   │   └── scripts/dispatch.js
│   ├── enlighten-installer/ # Scanner and analyzer
│   │   └── scripts/scan-repo.js
│   └── enlighten-uninstaller/ # Clean removal
│       └── scripts/
├── scripts/
│   └── install.js          # Installation script
├── tests/
│   └── test-scanner.js     # Verification tests
├── package.json
└── README.md
```

## How It Works

| Step | Component | Action |
|------|-----------|--------|
| 1 | Scanner | Clone repo, detect language/framework from marker files |
| 2 | Mapper | Map to optimal profile (web-developer, python-backend, etc.) |
| 3 | Adapter | Rewrite commands for your OS and harness |
| 4 | Executor | Run installation using harness's native tools |
| 5 | Verifier | Confirm success and register in installation list |

## Language/Framework Detection

| Marker File | Detected As | Profile |
|-------------|-------------|---------|
| package.json | TypeScript/JS | web-developer |
| requirements.txt | Python | python-backend |
| go.mod | Go | go-developer |
| Cargo.toml | Rust | rust-developer |
| build.gradle | Java | java-enterprise |
| *.sln/*.csproj | C# | dotnet-developer |
| CMakeLists.txt | C++ | cpp-developer |

## Installation

### Global (recommended)
```bash
npm install -g @enlighten/agent-tool
# or
curl -fsSL https://enlighten.ai/install.sh | sh
```

### Local
```bash
npm install --save-dev @enlighten/agent-tool
```

### Manual
```bash
git clone https://github.com/Ayan-Jain-737/enlighten-agent-tool
cd enlighten-agent-tool
node scripts/install.js
```

## CLI Commands

```bash
enlighten install <url>         Install a repo
enlighten uninstall <id>        Remove installation
enlighten list-installed        Show all installs
enlighten diagnose <url>        Analyze repo without installing
enlighten version               Show version
```

## Examples

### Install ECC
```
$ enlighten install https://github.com/affaan-m/ECC

🔧 Enlighten Installer v2.0.0

Step 1/5: Scanning repository...
  Language: typescript
  Framework: next
  Profile: web-developer

Step 2/5: Adapting for your system...
  OS: linux
  Harness: hermes

Step 3/5: Preparing installation...
Step 4/5: Executing installation...
✓ Installed 71 agents, 314 skills, 98 commands
✓ Profile 'web-developer' activated

Step 5/5: Verifying...
✅ Installation verified!
```

### Dry-run Installation
```
$ enlighten install https://github.com/user/repo --dry-run

⚠️  DRY RUN MODE

Would install:
• profile: cse-core
• 12 skills
• 5 agents
• CLI commands

No changes made.
```

## Uninstall

```
$ enlighten list-installed
Installed: ec-tools-user-repo

$ enlighten uninstall ec-tools-user-repo

🗑️  Enlighten Uninstaller

Removing: ec-tools-user-repo
Files to remove: 12 items
Proceed? (y/N) y

✅ Successfully uninstalled
```

## Environment

```bash
ENLIGHTEN_CACHE_DIR=~/.enlighten/cache    # Cache location
ENLIGHTEN_LOG_LEVEL=info                    # Debug/info/warn/error
ENLIGHTEN_TIMEOUT=300                       # Command timeout (seconds)
```

## Development

```bash
# Run tests
npm test

# Link globally for development
npm run link

# Test CLI
node bin/enlighten diagnose https://github.com/affaan-m/ECC
```

## Status

✅ **Complete** - Ready for use

| Component | Status |
|-----------|--------|
| Scanner | ✅ Working |
| Mapper | ✅ Complete |
| Adapter | ✅ Built |
| CLI | ✅ Complete |
| Uninstaller | ✅ Built |
| Tests | ✅ Included |

## License

MIT License - Free for commercial and personal use.
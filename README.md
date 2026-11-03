# Enlight Agent Tool

[![npm](https://img.shields.io/npm/v/@enlighten/agent-tool.svg)](https://www.npmjs.com/package/@enlighten/agent-tool)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-lightgreen.svg)](https://nodejs.org/)

**Enlight Agent Tool** is a command-line utility that installs any GitHub repository into your local agent harness environment. It automates the detection, adaptation, and setup process across multiple development platforms.

## Installation

```bash
npm install -g @enlighten/agent-tool
```

## Quick Start

```bash
enlighten install https://github.com/user/repo
```

## Features

### Multi-Platform Support

| Harness | Status |
|---------|--------|
| Claude Code | ✅ Supported |
| Hermes | ✅ Supported |
| Opencode | ✅ Supported |
| Codex | ✅ Supported |

### Language Detection

Automatically identifies your project type and configures appropriately:

```
Repository Type    →    Detected Framework    →    Profile
─────────────────────────────────────────────────────────────
JavaScript/TypeScript →  react/next/vue   →  web-developer
Python                →  django/fastapi    →  python-backend
Go                    →  gin/echo          →  go-developer
Rust                  →  actix/rocket      →  rust-developer
```

### Usage Commands

```bash
# Install a repository
enlighten install https://github.com/user/repo

# Preview installation (dry-run)
enlighten install https://github.com/user/repo --dry-run

# Install with specific configuration
enlighten install https://github.com/user/repo \
  --harness hermes \
  --profile developer

# List installed repositories
enlighten list-installed

# Remove an installation
enlighten uninstall repository-id

# Diagnose a repository
enlighten diagnose https://github.com/user/repo
```

## Development

```bash
# Clone the repository
git clone https://github.com/Ayan-Jain-737/enlighten-agent-tool
cd enlighten-agent-tool

# Install dependencies
npm install

# Run tests
npm test

# Link globally for development
npm link
```

## API

The tool exposes a programmatic API for integration:

```javascript
const { install, uninstall, diagnose } = require('@enlight/agent-tool');

// Install a repository programmatically
await install({
  url: 'https://github.com/user/repo',
  harness: 'hermes',
  profile: 'developer',
  dryRun: false
});

// Get diagnostics without installing
const info = await diagnose('https://github.com/user/repo');
console.log(info.language, info.framework, info.profile);
```

## Configuration

Environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `ENLIGHTEN_CACHE_DIR` | `~/.enlighten/cache` | Cache directory |
| `ENLIGHTEN_LOG_LEVEL` | `info` | Log level (debug, info, warn, error) |
| `ENLIGHTEN_TIMEOUT` | `300` | Operation timeout in seconds |

## Requirements

- Node.js 18.0.0 or higher
- Git 2.0.0 or higher
- Write permissions to configuration directory

## License

MIT License - see [LICENSE](LICENSE) for details.

## Contributing

Contributions are welcome! Please read our [contributing guidelines](CONTRIBUTING.md) before submitting pull requests.

## Support

- [Documentation](https://enlighten.ai/docs)
- [Issue Tracker](https://github.com/Ayan-Jain-737/enlighten-agent-tool/issues)
- [Discussions](https://github.com/Ayan-Jain-737/enlighten-agent-tool/discussions)
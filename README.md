# enlighten-agent-tool

[![npm](https://img.shields.io/npm/v/enlighten-agent-tool.svg)](https://www.npmjs.com/package/enlighten-agent-tool)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-lightgreen.svg)](https://nodejs.org/)
[![Keywords](https://img.shields.io/badge/-GitHub-lightgray.svg?logo=github)](https://github.com/Ayan-Jain-737/enlighten-agent-tool)

<div align="center">

![enlighten-agent-tool Preview](https://raw.githubusercontent.com/Ayan-Jain-737/enlighten-agent-tool/main/assets/preview.png)

</div>

## Universal GitHub Repository Installer for AI Agent Harnesses

Enlighten is a powerful, self-contained tool that automatically installs any GitHub repository into your preferred agent harness. It intelligently detects languages, frameworks, and configuration requirements, then adapts the installation process for your specific environment.

<div align="center">

| ✅ Feature | 🔧 Platform Support | 🌐 Languages |
|------------|---------------------|--------------|
| Auto-detection | Claude Code | TypeScript |
| Profile mapping | Hermes | Python |
| OS adaptation | Opencode | Go |
| Safe uninstall | Codex | Rust |
| Dry-run mode | Cursor | Java |
| Registry tracking | Zed | C# |

</div>

## Installation

> **Requirements**: Node.js 18+ and Git

```bash
npm install -g enlighten-agent-tool
```

After installation completes, the skills are automatically configured:

```bash
# Skills are installed to your detected agent framework
# (Hermes, Claude Code, Opencode, etc.)
```

## Quick Start

```bash
# Install any GitHub repository
enlighten install https://github.com/user/repo

# Preview installation (dry-run)
enlighten install https://github.com/user/repo --dry-run

# Specify your harness
enlighten install https://github.com/user/repo --harness hermes

# Use within agent frameworks
/enlighten install https://github.com/user/repo
/enlighten diagnose https://github.com/affaan-m/ECC
```

## Commands

| Command | Description |
|---------|-------------|
| `enlighten install <url>` | Install a GitHub repository |
| `enlighten uninstall <id>` | Remove an installed repository |
| `enlighten list-installed` | Show all managed installations |
| `enlighten diagnose <url>` | Analyze repository without installing |

## Intelligent Detection

Enlighten automatically scans repositories to detect:

```bash
$ enlighten diagnose https://github.com/vercel/next.js
{
  "language": "typescript",
  "framework": "next",
  "profile": "web-developer",
  "confidence": 0.95
}
```

### Language & Framework Detection Matrix

| Package File | Language | Framework | Profile |
|--------------|----------|-----------|---------|
| `package.json` | TypeScript | Next.js, React, Vue, Svelte | web-developer |
| `requirements.txt` | Python | Django, FastAPI | python-backend |
| `go.mod` | Go | Gin, Echo | go-developer |
| `Cargo.toml` | Rust | Actix, Rocket | rust-developer |
| `build.gradle` | Java | Spring Boot | java-enterprise |
| `*.csproj` | C# | ASP.NET | dotnet-developer |

## Supported Platforms

Enlighten works seamlessly across all major AI agent development environments:

- **Claude Code** - Anthropic's official agent harness
- **Hermes** - Open-source agent management system  
- **Opencode** - Open-source AI coding agent
- **Codex** - OpenAI's Codex CLI tool
- **Cursor** - AI-powered code editor
- **Zed** - High-performance editor with AI features

## Configuration

Enlighten can be configured using environment variables:

```bash
export ENLIGHTEN_CACHE_DIR=~/.enlighten/cache      # Cache location
export ENLIGHTEN_LOG_LEVEL=info                    # Logging level
export ENLIGHTEN_TIMEOUT=300                         # Timeout in seconds
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

## Architecture

```
enlighten-agent-tool/
├── bin/
│   └── enlighten          # CLI executable
├── skills/
│   ├── enlighten/         # Main command skill
│   ├── enlighten-installer/ # Scanner and analyzer
│   └── enlighten-uninstaller/ # Clean removal
├── scripts/
│   ├── postinstall.js     # NPM postinstall script
│   └── install.js         # Installation script
├── tests/
│   └── test-scanner.js    # Verification tests
└── README.md
```

## API Usage

```javascript
const { install, diagnose } = require('enlighten-agent-tool');

// Install programmatically
await install({
  url: 'https://github.com/user/repo',
  harness: 'hermes',
  dryRun: false
});

// Get diagnostic info
const info = await diagnose('https://github.com/user/repo');
console.log(info.language, info.framework);
```

## Safety Features

- **Dry-run mode** - Preview changes before applying
- **Confirmation prompts** - Review destructive operations
- **Rollback capability** - Revert installations if needed
- **Integrity checks** - Verify successful installations

## Troubleshooting

### Command Not Found

If `/enlighten` or `enlighten` command is not recognized:

1. Ensure npm packages are in your PATH:
   ```bash
   export PATH="$HOME/.npm-global/bin:$PATH"
   ```

2. For agent frameworks, manually copy skills:
   ```bash
   # For Hermes
   cp -r skills/* ~/.hermes/skills/
   
   # For Claude Code
   cp -r skills/* ~/.claude/skills/
   ```

### Permission Errors

If you get EACCES errors during installation:

```bash
# Option 1: Use nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Option 2: Configure npm to use home directory
npm config set prefix '~/.npm-global'
```

### Framework Detection Issues

Enlighten auto-detects your agent framework. To override:

```bash
enlighten install <url> --harness hermes
enlighten install <url> --harness claude
```

## Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting pull requests.

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

## Support

- 📖 **Documentation**: [enlighten.ai/docs](https://enlighten.ai/docs)
- 🐛 **Issue Tracker**: [GitHub Issues](https://github.com/Ayan-Jain-737/enlighten-agent-tool/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/Ayan-Jain-737/enlighten-agent-tool/discussions)

## Credits

Created by [Ayan-Jain-737](https://github.com/Ayan-Jain-737)

Thanks to all [contributors](https://github.com/Ayan-Jain-737/enlighten-agent-tool/graphs/contributors) who help make this project better!

---

<div align="center">

Made with ❤️ by the Enlight Team

</div>
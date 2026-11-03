---
name: enlighten
description: Universal AI Agent Installer - Install any GitHub repository into your current agent harness. Handles scanning, adaptation, installation, and uninstallation.
tags:
  - installer
  - github
  - automation
  - cli
author: Ayan-Jain-737
version: "2.0.0"
usage: |
  /enlighten install <repo-url> [--dry-run] [--harness hermes|claude|opencode]
  /enlighten uninstall <identifier> [--force]
  /enlighten list-installed
  /enlighten diagnose <repo-url>
---

# Enlighten - Universal Agent Installer

The **enlighten** command provides a simple interface for installing any GitHub repository into your current agent harness.

## Quick Start

```bash
/enlighten install https://github.com/user/repo
/enlighten list-installed
/enlighten uninstall my-repo
```

## Commands

### Install a Repository
```
/enlighten install https://github.com/affaan-m/ECC
```

Will:
1. Clone and scan the repository
2. Detect language/framework
3. Map to appropriate profile
4. Adapt installation for your harness
5. Execute installation
6. Verify success

### Install with Options
```
/enlighten install https://github.com/user/repo \
  --harness hermes \
  --profile developer \
  --dry-run
```

Options:
- `--harness` - Target harness (hermes, claude, opencode, codex)
- `--profile` - Specific profile to use
- `--dry-run` - Preview without making changes

### Uninstall
```
/enlighten uninstall repo-name-user
/enlighten uninstall repo-name-user --force
/enlighten uninstall repo-name-user --dry-run
```

### List Installations
```
/enlighten list-installed
```

### Diagnose Before Installing
```
/enlighten diagnose https://github.com/user/repo
```
Outputs detected language, framework, recommended profile, and requirements.

## Output Format

Success:
```json
{
  "status": "success",
  "identifier": "user-repo",
  "profile": "cse-core",
  "dry_run": false
}
```

Error:
```json
{
  "status": "error",
  "error": "Clone failed: authentication required"
}
```

## How It Works

| Step | What Happens | Tool Used |
|------|--------------|-----------|
| 1. Scan | Clone repo, detect language/framework | scan-repo.js |
| 2. Map | Map to ECC profile | Profile mapping table |
| 3. Adapt | Rewrite commands for your OS/harness | adapt-install.js |
| 4. Install | Execute installation | harness-native tools |
| 5. Verify | Check installation works | verification scripts |

## Profiles

| Profile | For | When To Use |
|---------|-----|-------------|
| `web-developer` | React, Vue, Svelte, Next.js | Frontend projects |
| `python-backend` | Django, FastAPI, Flask | Python APIs |
| `go-developer` | Go microservices | Go services |
| `rust-developer` | Rust applications | Rust projects |
| `java-enterprise` | Spring Boot, Quarkus | Java apps |
| `dotnet-developer` | ASP.NET, .NET Core | .NET apps |
| `cpp-developer` | C++ projects | C++ codebases |
| `ml-researcher` | PyTorch, TensorFlow | ML projects |
| `developer` | General purpose | Any project |

## Examples

### Install ECC with auto-detection
```
/enlighten install https://github.com/affaan-m/ECC
```
Output:
```
🔧 Enlighten Installer v2.0.0

Step 1/5: Scanning repository...
  Language: typescript
  Framework: next
  Profile: web-developer

Step 2/5: Adapting for your system...
  OS: linux
  Harness: hermes

✅ Installation successful!
```

### Install with dry-run
```
/enlighten install https://github.com/user/repo --dry-run
```
Shows what would happen without making changes.

### List what's installed
```
/enlighten list-installed
```

## Environment Variables

```bash
ENLIGHTEN_CACHE_DIR=~/.enlighten/cache     # Cache location
ENLIGHTEN_LOG_LEVEL=info                    # Logging level
ENLIGHTEN_TIMEOUT=300                       # Command timeout
```

## Related Commands

- `/enlighten install` - Main installation command
- `/enlighten uninstall` - Remove installed repos
- `/enlighten diagnose` - Analyze without installing
- `/enlighten list-installed` - See what's installed

## Requirements

The tool works with:
- Node.js 18+
- Git
- Your agent harness's native install tools

## Self-Sufficient

This tool includes all logic needed - no external dependencies beyond Node.js. It uses its own scanner, adapter, and verifier instead of calling other tools.

## License

MIT License
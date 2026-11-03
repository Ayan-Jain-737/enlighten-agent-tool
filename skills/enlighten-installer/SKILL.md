---
name: enlighten-installer
description: Universal GitHub repository installer that scans, adapts, and installs any repo across all agent harnesses. Includes uninstall capability.
tags:
  - installer
  - github
  - automation
  - profile-management
author: Ayan-Jain-737
version: "2.0.0"
---

# Enlighten Installer

The **Enlighten Installer** is a self-sufficient, harness-agnostic tool for installing GitHub repositories. It includes both **install** and **uninstall** capabilities.

## Features

✅ **Auto-scan** - Detects language, framework, dependencies  
✅ **Profile mapping** - Maps requirements to optimal profiles  
✅ **Cross-platform** - Works on macOS, Linux, Windows  
✅ **Harness agnostic** - Works with Hermes, Claude Code, Opencode, Codex, etc.  
✅ **Full uninstall** - Removes all traces including files, configs, aliases  
✅ **Safety first** - Dry-run mode, confirmation prompts, rollback  

## Usage

### Primary Command
```bash
/enlighten install <repo-url> [--harness <name>] [--profile <name>]
/enlighten uninstall <identifier> [--force]
/enlighten diagnose <repo-url>
/enlighten list-installed
```

### Command Line
```bash
./enlighten install https://github.com/user/repo-name
./enlighten uninstall repo-name-user-123
./enlighten diagnose https://github.com/affaan-m/ECC
./enlighten list-installed --harness hermes
```

## Workflow

```
1. Scan Repository → Detect language, framework, dependencies
2. Map to Profile → Choose optimal agent profile
3. Prepare Install → Generate install script for your harness
4. Execute Install → Run installation with verification
5. Post-Install → Verify and confirm success
```

## Uninstall Workflow

```
1. List Installed → Show all enlighten-managed installations
2. Select Target → Choose what to remove
3. Generate Plan → Create removal manifest
4. Execute Uninstall → Remove all traces
5. Cleanup → Delete config, scripts, aliases
```

## Examples

### Install a plugin
```
/enlighten install https://github.com/affaan-m/ECC
```

### Install with specific options
```
/enlighten install https://github.com/user/my-plugin \
  --harness hermes \
  --profile developer \
  --branch main
```

### List installed items
```
/enlighten list-installed
# Output:
# INSTALLED REPOSITORIES:
# • ECC (user-repo ECC v2.2.3)
# • enlighten-installer (self-managed)
```

### Diagnose before install
```
/enlighten diagnose https://github.com/user/repo
# Output: TypeScript, React, Node.js 18+, npm
# Estimated profile: full-cse
# Required: Node.js, Git, npm
```

## Output Format

Each operation produces structured output:

```json
{
  "status": "success|error|dry_run",
  "identifier": "github-user-repo-sha",
  "harness": "hermes|claude|opencode|codex",
  "profile": "profile-name",
  "steps_completed": ["scan", "map", "prepare", "execute", "verify"],
  "files_affected": ["/path/to/file1", "/path/to/file2"],
  "commands_run": ["npm install", "npm run build"],
  "verification": {
    "passed": true,
    "checks": ["tests_pass", "build_pass", "no_secrets"]
  }
}
```

## Uninstall Safety

### Before Uninstall
⚠️  **CRITICAL**: You are about to uninstall:
- Repository: `repo-name` 
- Files: 12 items in 3 directories
- Config: 1 config file
- CLI: 1 alias/command

**Continue?** (y/N)

### Force Uninstall
```bash
/enlighten uninstall repo-identifier --force
```

## Profile Mapping

| Language | Framework   | Recommended Profile |
|----------|-------------|---------------------|
| TS/JS    | React/Vue   | web-developer       |
| Python   | Django/FastAPI | python-backend   |
| Go       | Gin/Echo    | go-developer        |
| Rust     | Actix/Rocket| rust-developer      |
| Java     | Spring Boot | java-enterprise     |
| C++      | CMake       | cpp-developer       |
| .NET     | ASP.NET     | dotnet-developer    |

## Configuration

Environment variables:
```bash
ENLIGHTEN_CACHE_DIR=~/.enlighten/cache     # Cache directory
ENLIGHTEN_LOG_LEVEL=info                    # Debug, info, warn, error
ENLIGHTEN_TIMEOUT=300                       # Command timeout in seconds
```

## Installation

### Global (recommended)
```bash
npm install -g @enlighten/installer
# or
curl -fsSL https://enlighten.ai/install.sh | sh
```

### Local per-user
```bash
npm install --prefix ~/.local @enlight/installer
```

### Project-level
```bash
npm install @enlight/installer
```

## Support

- Documentation: https://enlighten.ai/docs
- Issues: https://github.com/Ayan-Jain-737/enlighten-agent-tool/issues
- Community: https://discord.gg/enlighten-ai

## License

MIT License - Free for commercial and personal use.
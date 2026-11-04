---
name: enlighten-installer
description: >-
  Repository scanner, adapter, and installation engine.
  Scans any GitHub repository for programming languages, frameworks, package managers,
  binaries, and agent skills. Adapts installation steps for the host OS and agent harness,
  and registers skills into the caller agent folder and global storage without polluting unused agent directories.
---

# Enlighten Installer Engine

The **Enlighten Installer** is the core scanning and adaptation engine for Enlighten.

## Features

- ✅ **Deep Skill Discovery**: Recursively finds `SKILL.md` at root or in `skills/` directories
- ✅ **Active Agent & Global Registration**: Registers skills in the active agent (e.g. Antigravity / Gemini) and global Open Agents store, avoiding unwanted folders for other agents
- ✅ **Package Manager Auto-Detection**: Handles npm, yarn, pnpm, bun, pip, uv, poetry, cargo, go, gradle, maven, cmake, make
- ✅ **Binary Exposure**: Exposes discovered executables to `~/.local/bin`
- ✅ **Dry-Run Safe**: Previews installations and skill registrations without changes

## CLI Commands

```bash
# Direct installer CLI (targets active agent and global):
enlighten install <repo-url> [--agent <name>] [--all-agents] [--dry-run] [--force] [--json]

# Diagnose without installing:
enlighten diagnose <repo-url>
```

## Helper Scripts

- `scripts/scan-repo.js` - Standalone repository scanner
- `scripts/adapt-install.js` - OS and harness command adapter
- `scripts/skill-registry.js` - Skill discovery and targeted active/global registration

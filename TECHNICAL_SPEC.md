# enlighten-agent-tool - Technical Specification

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    enlighten-agent-tool                         │
├─────────────────────────────────────────────────────────────────┤
│  bin/enlighten (CLI Entry Point)                                │
│  ├── EnlightCLI (Lifecycle coordinator)                         │
│  ├── EnlightenScanner (scan-repo.js)                            │
│  ├── SkillRegistry (skill-registry.js)                          │
│  └── ScriptAdapter (adapt-install.js)                           │
├─────────────────────────────────────────────────────────────────┤
│  Skills (Registered across global agent directories)            │
│  ├── enlighten/              # Primary command skill            │
│  ├── enlighten-installer/    # Scanner & adapter engine         │
│  └── enlighten-uninstaller/  # Safe removal & unregistration    │
├─────────────────────────────────────────────────────────────────┤
│  Installers & Automations                                       │
│  ├── scripts/install.sh      # 1-command curl installer         │
│  ├── scripts/install.js      # Unified harness registration     │
│  └── scripts/postinstall.js  # NPM global postinstall hook      │
└─────────────────────────────────────────────────────────────────┘
```

## Core Modules

### 1. EnlightCLI (`bin/enlighten`)
- **Lifecycle Coordinator**: Handles `install`, `diagnose`, `list-installed`, `uninstall`.
- **Repo Normalizer**: Parses GitHub URLs, `owner/repo` shorthands, and local filesystem paths.
- **Auto-Registration**: Discovers skills and registers them globally across all active harnesses.
- **Executable Linker**: Symlinks discovered CLI binaries to `~/.local/bin/`.
- **Registry Persistence**: Maintains `~/.enlighten/cache/installed.json`.

### 2. SkillRegistry (`skills/enlighten-installer/scripts/skill-registry.js`)
- **Multi-Harness Detection**:
  - Antigravity / Gemini (`~/.gemini/skills/`)
  - Open Agents (`~/.agents/skills/` and `.skill-lock.json`)
  - Claude Code (`~/.claude/skills/` and `~/.claude/commands/`)
  - Hermes (`~/.hermes/skills/` and `~/.hermes/commands/`)
  - OpenCode (`~/.config/opencode/skills/` and `~/.opencode/skills/`)
  - Codex (`~/.codex/skills/`)
  - Cursor (`~/.cursor/skills/`)
  - Zed (`~/.zed/skills/`)
- **Deep Skill Discovery**:
  - Root `SKILL.md`
  - `skills/<name>/SKILL.md` (shallow or nested)
  - `.agents/skills/<name>/SKILL.md`
  - `.claude/skills/<name>/SKILL.md`
  - `.gemini/skills/<name>/SKILL.md`
- **Auto-Synthesis**: If a repository has no `SKILL.md`, creates a customized agent skill wrapper documenting its CLI and functions.
- **Skill Lockfile Synchronization**: Keeps `~/.agents/.skill-lock.json` updated so `skills` CLI tools recognize installed skills.
- **Clean Unregistration**: Removes skills and lockfile entries on uninstall.

### 3. EnlightenScanner (`skills/enlighten-installer/scripts/scan-repo.js`)
- **Language & Framework Detection**: Detects 15+ languages and 30+ frameworks.
- **Skill Inspection**: Detects whether the repository provides agent skills.
- **Binary Discovery**: Inspects `package.json` (`bin`), `Cargo.toml`, and `bin/` directories.
- **README Instruction Analysis**: Extracts suggested install commands.

### 4. ScriptAdapter (`skills/enlighten-installer/scripts/adapt-install.js`)
- **Cross-Platform Adaptation**: Generates commands adapted for Linux, macOS, and Windows.
- **Package Manager Support**: npm, yarn, pnpm, bun, pip, uv, poetry, pipenv, cargo, go, gradle, maven, composer, dotnet, cmake, make.

---

## Skill Registration Workflow

```
Target Repository
      │
      ├── Has SKILL.md? ──► YES ──► Extract metadata (name, description)
      │                                       │
      └── NO ─────────────► Synthesize Skill ─┘
                                   │
                                   ▼
             Canonical Link: ~/.agents/skills/<skill-name>
                                   │
       ┌───────────────────────────┼───────────────────────────┐
       ▼                           ▼                           ▼
~/.gemini/skills/           ~/.claude/skills/           ~/.hermes/skills/
(Antigravity)                (Claude Code)                   (Hermes)
```

## Global Skill Locations

- Antigravity: `~/.gemini/skills/<skill-name>`
- Open Agents: `~/.agents/skills/<skill-name>` & `~/.agents/.skill-lock.json`
- Claude Code: `~/.claude/skills/<skill-name>` & `~/.claude/commands/<command>.md`
- Hermes: `~/.hermes/skills/<skill-name>` & `~/.hermes/commands/<command>.md`
- OpenCode: `~/.config/opencode/skills/<skill-name>`
- Codex: `~/.codex/skills/<skill-name>`
- Cursor: `~/.cursor/skills/<skill-name>`
- Zed: `~/.zed/skills/<skill-name>`
- Binaries: `~/.local/bin/<binary>`

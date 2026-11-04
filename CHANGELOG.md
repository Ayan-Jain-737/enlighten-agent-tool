# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-11-04

### Added
- 🔍 **Skill & CLI Tool Discovery Engine** (`enlighten find <query>`):
  - Real-time search across `skills.sh` open agent skills registry.
  - Built-in curated index of top-tier skills, packages, and CLI tool repositories (React, Next.js, Playwright, Vitest, Ripgrep, Biome, Lazygit, Ruff).
  - Offline resilience with local cached fallbacks.
  - Local installed detection: identifies whether found skills are already installed in `~/.agents/.skill-lock.json`.
  - Machine-readable `--json` envelope for programmatic agent tool calling.
- 🎯 **Active-Agent Scoping & Filesystem Discipline**:
  - Automatically detects the active agent harness (e.g. Antigravity / Gemini via `ANTIGRAVITY_AGENT`, Claude Code, Hermes).
  - Installs skills only for the calling agent (e.g., `~/.gemini/skills/`) and canonical global storage (`~/.agents/skills/`).
  - **Zero Ghost Directory Pollution**: No longer creates unused directories for Codex, Zed, Cursor, etc. when running in AGY.
  - Support for explicit target flags: `--agent <name>` (or `--harness <name>`) and opt-in `--all-agents`.
- 📊 **Head-to-Head Comparison Matrix**:
  - Full architectural comparison in README and website between Enlighten and traditional `npx skills` / `find-skills`.
- 🌐 **Website Redesign (`assets/index.html`)**:
  - Added discovery showcase, comparison matrix, active-agent terminal walkthrough, and command ledger.
- 🧪 **Discovery Unit Tests (`tests/test-finder.js`)**:
  - Comprehensive test suite for search, keyword relevance scoring, CLI tool discovery, and installed status detection.

---

## [1.0.0] - 2024-11-03

### Added
- ✅ Initial release with universal GitHub repository installer
- ✅ Multi-platform support: Claude Code, Hermes, Opencode, Codex
- ✅ Intelligent language/framework detection (TypeScript, Python, Go, Rust, Java, C#)
- ✅ Auto-generated profile mapping for detected technologies
- ✅ OS adaptation layer for cross-platform installation
- ✅ Full install/uninstall lifecycle management
- ✅ Dry-run mode for safe previewing
- ✅ Installation registry with status tracking
- ✅ CLI interface with help system
- ✅ Comprehensive test suite
- ✅ Professional documentation and contributing guide

### Features
- **enlighten install** - Install any GitHub repository automatically
- **enlighten uninstall** - Clean removal of installations
- **enlighten list-installed** - View all managed repositories
- **enlighten diagnose** - Analyze repositories without installing

### Supported Languages
- TypeScript/JavaScript (React, Vue, Next.js, Svelte)
- Python (Django, FastAPI, Flask)
- Go (Gin, Echo)
- Rust (Actix, Rocket)
- Java (Spring Boot)
- C# (ASP.NET)

---

## [0.1.0] - 2024-11-02

### Added
- Project initialization
- Basic CLI scaffold
- Repository scanning logic
- Profile mapping system
- Initial README documentation

[1.0.0]: https://github.com/Ayan-Jain-737/enlighten-agent-tool/compare/v0.1.0...v1.0.0
[0.1.0]: https://github.com/Ayan-Jain-737/enlighten-agent-tool/tree/v0.1.0
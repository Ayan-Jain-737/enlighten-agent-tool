# install-anything-skill

[![npm](https://img.shields.io/npm/v/install-anything-skill.svg)](https://www.npmjs.com/package/install-anything-skill)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-lightgreen.svg)](https://nodejs.org/)
[![Keywords](https://img.shields.io/badge/-GitHub-lightgray.svg?logo=github)](https://github.com/Ayan-Jain-737/install-anything-skill)

> [!NOTE]
> **Package Renamed & Migration**: This package was formerly published as `enlighten-agent-tool`. It has been renamed and upgraded to **`install-anything-skill`** (CLI: `install-anything`). The previous package `enlighten-agent-tool` is deprecated.

<div align="center">

![install-anything-skill Preview](https://raw.githubusercontent.com/Ayan-Jain-737/install-anything-skill/main/assets/preview.png)

</div>

## Universal GitHub Repository & Skill Installer for AI Agents

**install-anything** is an autonomous skill and repository installer for AI agent harnesses. It installs in **one command**, automatically registers itself in your active agent's skills folder, discovers community skills across the open registry, and turns **any GitHub repository** into an immediately executable tool for your agent—compiling binaries, synthesizing skill wrappers, and scoping changes cleanly to your active agent.

<div align="center">

| ✅ Core Capabilities | 🔧 Platform Support | 🌐 Build & Package Managers |
|----------------------|---------------------|-----------------------------|
| **Built-in Skill Discovery** (`install-anything find`) | **Antigravity / Gemini** (`~/.gemini/skills/`) | npm, yarn, pnpm, bun |
| **Active-Agent Scoping** (Zero ghost folders) | **Open Agents** (`~/.agents/skills/`) | pip, uv, poetry, pipenv |
| **Auto-Synthesis for Repos without SKILL.md** | **Claude Code** (`~/.claude/skills/`) | cargo (Rust compilation) |
| **README-First Intelligence** | **Hermes** (`~/.hermes/skills/`) | go build, go install |
| **Executable Binary Symlinks** (`~/.local/bin`) | **OpenCode** (`~/.config/opencode/`) | gradle, maven |
| **Full Lifecycle & Safe Rollback** | **Codex**, **Cursor**, **Zed** | cmake, make |

</div>

---

## 🆚 Head-to-Head: install-anything vs Traditional `npx skills`

| Capability | Traditional Skills CLI (`npx skills`) | install-anything (`install-anything-skill`) |
| :--- | :--- | :--- |
| **Any GitHub Repository** | ❌ Fails if not pre-packaged as a skill | ✅ **Works on ANY public or local repo** |
| **Repos without `SKILL.md`** | ❌ Cannot install | ✅ **Auto-synthesizes skill wrapper** |
| **Compiling & Building Code** | ❌ None (copies markdown only) | ✅ **Runs cargo, go, npm, pip, make** |
| **Binary Tool Exposure** | ❌ No binary execution support | ✅ **Symlinks binaries to `~/.local/bin`** |
| **Active Agent Directory Scoping** | ❌ Dumps into single generic folder | ✅ **Scopes to caller agent (AGY, Claude, etc.)** |
| **Zero Clutter Discipline** | ❌ May leave unused agent folders | ✅ **Never creates folders for unused agents** |
| **Skill Discovery** | ✅ Remote registry search | ✅ **Live registry + Curated + Offline fallback** |
| **Tool Repositories & CLIs** | ❌ Prompt skills only | ✅ **Discovers both skills & CLI utilities** |
| **Machine-Readable Agent JSON** | ❌ Plain terminal text | ✅ **Structured JSON with `--json`** |

---

## 🚀 1-Command Installation

Anyone can install install-anything in a single command using any of these methods:

### Method 1: Universal Shell One-Liner (Recommended)
```bash
curl -fsSL https://raw.githubusercontent.com/Ayan-Jain-737/install-anything-skill/main/scripts/install.sh | bash
```

### Method 2: Open Agent Skills CLI
```bash
npx skills add Ayan-Jain-737/install-anything-skill -g -y
```

### Method 3: NPM Global Install
```bash
npm install -g install-anything-skill
```

### Method 4: From Local Clone
```bash
git clone https://github.com/Ayan-Jain-737/install-anything-skill.git
cd install-anything-skill
./scripts/install.sh
```

### What Happens on Installation:
- ✅ Links the `install-anything` executable directly to `~/.local/bin/install-anything` (with aliases `install-anything-skill` and `enlighten`).
- ✅ Registers `install-anything`, `install-anything-installer`, and `install-anything-uninstaller` skills into your active agent folder (e.g., `~/.gemini/skills/`) and global canonical storage (`~/.agents/skills/`), avoiding unwanted folders for other unused agents.
- ✅ Installs slash command `/install-anything` for supported agents (Claude Code, Hermes).
- ✅ Updates `~/.agents/.skill-lock.json`.

---

## ⚡ Quick Start

```bash
# 1. Discover skills & CLI tools across the open ecosystem
install-anything find react
install-anything find testing
install-anything find --json

# 2. Install any GitHub repository (cleanly scoped to active agent & global store)
install-anything install vercel-labs/agent-skills

# Install by full URL
install-anything install https://github.com/affaan-m/ECC

# Explicitly target a specific agent harness
install-anything install https://github.com/user/repo --agent gemini

# Preview installation without making changes (dry-run)
install-anything install https://github.com/user/repo --dry-run

# Output machine-readable JSON for agent consumption
install-anything install https://github.com/user/repo --json

# 3. Diagnose repository before installing
install-anything diagnose https://github.com/user/repo

# 4. List all managed repositories, binaries, and registered skills
install-anything list-installed

# 5. Safely remove a repository, unregister skills, and unlink binaries
install-anything uninstall <identifier> --force
```

### Using Inside Agent Conversations
Any AI agent that has loaded the `install-anything` skill can run:
```bash
/install-anything find react
/install-anything install https://github.com/user/repo
```
or execute via the terminal tool:
```bash
install-anything find <query>
install-anything install <repo-url>
```

---

## 🧠 How Auto-Registration & Active Scoping Works

When an agent or developer runs `install-anything install <repo-url>`:

```
┌────────────────────────────────────────────────────────┐
│ 1. Clone / Fetch Repository                            │
│    Cloned into ~/.install-anything/repos/<owner>/<repo>│
└──────────────────────────┬─────────────────────────────┘
                           │
┌──────────────────────────▼─────────────────────────────┐
│ 2. Deep Skill Discovery                                │
│    Finds SKILL.md at root, in skills/*, .agents/*      │
└──────────────────────────┬─────────────────────────────┘
                           │
             Skills found? │
            ┌──────────────┴──────────────┐
       YES  │                             │ NO
┌───────────▼──────────────────┐  ┌───────▼──────────────────────┐
│ Register Discovered Skills   │  │ Auto-Synthesize Skill        │
│ Link into ~/.agents/skills/  │  │ Generate SKILL.md wrapper for│
│ & active agent (~/.gemini/)  │  │ the newly installed tool     │
└───────────┬──────────────────┘  └───────┬──────────────────────┘
            └──────────────┬──────────────┘
                           │
┌──────────────────────────▼─────────────────────────────┐
│ 3. Execute "Whatever That Repo Suggests"                │
│    Runs npm install, pip install, cargo build, etc.    │
│    Symlinks executables to ~/.local/bin/               │
└──────────────────────────┬─────────────────────────────┘
                           │
┌──────────────────────────▼─────────────────────────────┐
│ 4. Active-Agent Scoped Registration                    │
│    • In AGY: registers to ~/.gemini/skills/ + global   │
│    • Zero ghost directories for Codex or Zed           │
│    • Updates ~/.agents/.skill-lock.json                │
└────────────────────────────────────────────────────────┘
```

---

## 📋 Commands

| Command | Description |
|---------|-------------|
| `install-anything find <query>` | Discover agent skills, packages, and CLI tool repos (e.g., `install-anything find react`) |
| `install-anything install <url>` | Clone repo, compile binaries, register skills for active agent & global store |
| `install-anything install <url> --agent <name>` | Explicitly target an agent harness (e.g. `gemini`, `claude`, `codex`) |
| `install-anything diagnose <url>` | Analyze repository without installing (README guide, languages, frameworks, skills) |
| `install-anything list-installed` | Show all managed installations, exposed binaries, and registered skills |
| `install-anything uninstall <id> --force` | Safe removal of repository, binaries (`~/.local/bin`), and registered skills |
| `install-anything --help` | Show command line help and options |

---

## 🌐 Supported Platforms & Active Directory Scoping

| Agent Framework | Skills Directory | Scoping & Integration Behavior |
|-----------------|------------------|--------------------------------|
| **Antigravity / Gemini** | `~/.gemini/skills/` | Automatic runtime detection (`ANTIGRAVITY_AGENT`); zero pollution to unused agents |
| **Open Agents** | `~/.agents/skills/` & `.skill-lock.json` | Canonical global store (`npx skills` compatible) |
| **Claude Code** | `~/.claude/skills/` | Skills directory & `~/.claude/commands/install-anything.md` (`/install-anything`) |
| **Hermes** | `~/.hermes/skills/` | Skills directory & `~/.hermes/commands/install-anything.md` (`/install-anything`) |
| **OpenCode** | `~/.config/opencode/skills/` | Config plugin / skill directory |
| **Codex** | `~/.codex/skills/` | Targeted on demand (`--agent codex`) |
| **Cursor** | `~/.cursor/skills/` | Targeted on demand (`--agent cursor`) |
| **Zed** | `~/.zed/skills/` | Targeted on demand (`--agent zed`) |

---

## 🏗️ Architecture

```
install-anything-skill/
├── bin/
│   └── install-anything             # CLI executable (find, install, diagnose, list, uninstall)
├── skills/
│   ├── install-anything/            # Primary agent skill definition
│   │   ├── SKILL.md
│   │   └── scripts/dispatch.js      # Resilient CLI dispatcher
│   ├── install-anything-installer/  # Scanner, adapter, finder & skill registry engine
│   │   ├── SKILL.md
│   │   └── scripts/
│   │       ├── scan-repo.js         # Deep repo & skill scanner
│   │       ├── skill-finder.js      # Skill & CLI tool discovery engine
│   │       ├── skill-registry.js    # Multi-harness active-scoped registration manager
│   │       ├── adapt-install.js     # OS & harness command adapter
│   │       └── readme-guide.js      # README-first instruction parser
│   └── install-anything-uninstaller/# Safe removal skill
│       └── SKILL.md
├── commands/
│   └── install-anything.md          # Agent slash command definition
├── scripts/
│   ├── install.sh                   # Universal 1-command curl installer
│   ├── install.js                   # Node.js self-registration script
│   └── postinstall.js               # NPM postinstall hook
├── tests/
│   ├── test-scanner.js              # Scanner unit tests
│   ├── test-skills.js               # Multi-harness skill registration tests
│   ├── test-finder.js               # SkillFinder & discovery engine tests
│   └── test-lifecycle.js            # End-to-end install/uninstall lifecycle tests
├── package.json
└── README.md
```

---

## 🧪 Testing

Run the full test suite with:

```bash
npm test
```

Includes:
- Scanner tests for language, framework, dependencies, and skills.
- Skill discovery and multi-harness global registration tests.
- Full CLI lifecycle tests (`diagnose` -> `install` -> `list-installed` -> `uninstall`).

---

## 📄 License

MIT © Ayan Jain

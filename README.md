# install-anything-skill

[![npm](https://img.shields.io/npm/v/install-anything-skill.svg)](https://www.npmjs.com/package/install-anything-skill)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-lightgreen.svg)](https://nodejs.org/)
[![Keywords](https://img.shields.io/badge/-GitHub-lightgray.svg?logo=github)](https://github.com/Ayan-Jain-737/install-anything-skill)

> [!NOTE]
> **Package Renamed & Migration**: This package was formerly published as `enlighten-agent-tool`. It has been renamed and upgraded to **`install-anything-skill`**, callable everywhere via the short acronym **`ias`** (and `install-anything`). The previous package `enlighten-agent-tool` is deprecated.

<div align="center">

![install-anything-skill Preview](preview.png)

</div>

## Universal GitHub Repository & Skill Installer for AI Agents

**ias** (`install-anything-skill`) is an autonomous skill and repository installer for AI agent harnesses. Callable everywhere by the simple acronym **`ias`**, it installs in **one command**, automatically registers itself in your active agent's skills folder, discovers community skills across the open registry, and turns **any GitHub repository** into an immediately executable tool for your agent—compiling binaries, synthesizing skill wrappers, and scoping changes cleanly to your active agent.

<div align="center">

| ✅ Core Capabilities | 🔧 Platform Support | 🌐 Build & Package Managers |
|----------------------|---------------------|-----------------------------|
| **Built-in Skill Discovery** (`ias find`) | **Antigravity / Gemini** (`~/.gemini/skills/ias`) | npm, yarn, pnpm, bun |
| **Active-Agent Scoping** (Zero ghost folders) | **Open Agents** (`~/.agents/skills/ias`) | pip, uv, poetry, pipenv |
| **Auto-Synthesis for Repos without SKILL.md** | **Claude Code** (`~/.claude/skills/ias`) | cargo (Rust compilation) |
| **README-First Intelligence** | **Hermes** (`~/.hermes/skills/ias`) | go build, go install |
| **Executable Binary Symlinks** (`~/.local/bin/ias`) | **OpenCode** (`~/.config/opencode/`) | gradle, maven |
| **Full Lifecycle & Safe Rollback** | **Codex**, **Cursor**, **Zed** | cmake, make |

</div>

---

## 🆚 Head-to-Head: ias vs Traditional `npx skills`

| Capability | Traditional Skills CLI (`npx skills`) | ias (`install-anything-skill`) |
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
- ✅ Links the `ias` executable directly to `~/.local/bin/ias` (along with `install-anything`, `install-anything-skill`, and `enlighten`).
- ✅ Registers `ias`, `install-anything`, `install-anything-installer`, and `install-anything-uninstaller` skills into your active agent folder (e.g., `~/.gemini/skills/ias`) and global canonical storage (`~/.agents/skills/`), avoiding unwanted folders for other unused agents.
- ✅ Installs slash command `/ias` and `/install-anything` for supported agents (Claude Code, Hermes).
- ✅ Updates `~/.agents/.skill-lock.json`.

---

## ⚡ Quick Start

```bash
# 1. Discover skills & CLI tools across the open ecosystem
ias find react
ias find testing
ias find --json

# 2. Install any GitHub repository (cleanly scoped to active agent & global store)
ias install vercel-labs/agent-skills

# Install by full URL
ias install https://github.com/affaan-m/ECC

# Explicitly target a specific agent harness
ias install https://github.com/user/repo --agent gemini

# Preview installation without making changes (dry-run)
ias install https://github.com/user/repo --dry-run

# Output machine-readable JSON for agent consumption
ias install https://github.com/user/repo --json

# 3. Diagnose repository before installing
ias diagnose https://github.com/user/repo

# 4. List all managed repositories, binaries, and registered skills
ias list-installed

# 5. Safely remove a repository, unregister skills, and unlink binaries
ias uninstall <identifier> --force
```

### Using Inside Agent Conversations
Any AI agent that has loaded the `ias` skill can run:
```bash
/ias find react
/ias install https://github.com/user/repo
```
or execute via the terminal tool:
```bash
ias find <query>
ias install <repo-url>
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
| `ias find <query>` | Discover agent skills, packages, and CLI tool repos (e.g., `ias find react`) |
| `ias install <url>` | Clone repo, compile binaries, register skills for active agent & global store |
| `ias install <url> --agent <name>` | Explicitly target an agent harness (e.g. `gemini`, `claude`, `codex`) |
| `ias diagnose <url>` | Analyze repository without installing (README guide, languages, frameworks, skills) |
| `ias list-installed` | Show all managed installations, exposed binaries, and registered skills |
| `ias uninstall <id> --force` | Safe removal of repository, binaries (`~/.local/bin`), and registered skills |
| `ias --help` | Show command line help and options (alias: `install-anything`) |

---

## 🌐 Supported Platforms & Active Directory Scoping

| Agent Framework | Skills Directory | Scoping & Integration Behavior |
|-----------------|------------------|--------------------------------|
| **Antigravity / Gemini** | `~/.gemini/skills/ias` | Automatic runtime detection (`ANTIGRAVITY_AGENT`); zero pollution to unused agents |
| **Open Agents** | `~/.agents/skills/ias` & `.skill-lock.json` | Canonical global store (`npx skills` compatible) |
| **Claude Code** | `~/.claude/skills/ias` | Skills directory & `~/.claude/commands/ias.md` (`/ias`) |
| **Hermes** | `~/.hermes/skills/ias` | Skills directory & `~/.hermes/commands/ias.md` (`/ias`) |
| **OpenCode** | `~/.config/opencode/skills/` | Config plugin / skill directory |
| **Codex** | `~/.codex/skills/` | Targeted on demand (`--agent codex`) |
| **Cursor** | `~/.cursor/skills/` | Targeted on demand (`--agent cursor`) |
| **Zed** | `~/.zed/skills/` | Targeted on demand (`--agent zed`) |

---

## 🏗️ Architecture

```
install-anything-skill/
├── bin/
│   ├── ias                          # Short acronym executable
│   └── install-anything             # Full CLI executable
├── skills/
│   ├── ias/                         # Primary acronym agent skill
│   │   ├── SKILL.md
│   │   └── scripts/dispatch.js
│   ├── install-anything/            # Full-name agent skill definition
│   │   ├── SKILL.md
│   │   └── scripts/dispatch.js
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
│   ├── ias.md                       # /ias slash command
│   └── install-anything.md          # /install-anything slash command
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

# enlighten-agent-tool

A universal repository installer that uses ECC to automatically detect, adapt, and install any GitHub project across different harnesses.

## Project Overview

This project builds on ECC (Everything Claude Code) to create a universal installer that scans, adapts, and installs GitHub repositories based on the user's harness (Hermes, Claude Code, Codex, etc.).

## What's Done ✓

### ECC for Hermes Setup Complete
- ✅ Installed all 71 ECC agents in `~/.hermes/agents/`
- ✅ Installed 355+ skills in `~/.hermes/skills/`
- ✅ Installed 98 commands in `~/.hermes/commands/`
- ✅ Installed rule sets for: TypeScript, Python, Go, Rust, Java, C++
- ✅ Created 5 profiles: `cse-core`, `full-cse`, `researcher`, `devops`, `ml-researcher`
- ✅ Configured basic hooks for command/file validation
- ✅ Created `profile-selector` skill to switch profiles
- ✅ Created `repo-orchestrator` skill for repository installation
- ✅ Created `repo-adapter` skill for scanning repos
- ✅ Implemented `scan-repo.js` script for language/framework detection

### Skills Created (in ~/.hermes/skills/)

| Skill | Purpose | Status |
|-------|---------|--------|
| `repo-adapter` | Scan GitHub repos for language/dependencies | ✅ Complete |
| `repo-orchestrator` | Orchestrate repo installation workflow | ✅ Complete |
| `profile-selector` | Switch between ECC profiles | ✅ Complete |
| `find-right` | Map prompts to correct profile/skill | ⏳ In progress |
| `adapt-install` | Adapt installs for local harness | ⏳ Planned |

### Project Structure
```
enlighten-agent-tool/
├── README.md                 # ✅ This file
├── SETUP_SUMMARY.md          # ✅ ECC installation guide
├── skills/                   # ✅ Active development
│   ├── repo-adapter/         # ✅ Scan repos for language/dependencies
│   ├── repo-orchestrator/    # ✅ Orchestrate repo installation
│   ├── profile-selector/     # ✅ Switch between ECC profiles
│   ├── find-right/           # ⏳ Map prompts to profiles
│   └── adapt-install/        # ⏳ Adapt for local harness (planned)
├── agents/                   # ⏳ In progress
│   └── installer-operator.md # ⏳ Orchestrate installation
├── scripts/                   # ✅ Active development
│   ├── scan-repo.js          # ✅ Repo language/dependency scanner
│   ├── map-harness.js        # ⏳ Plan: profile mapper
│   └── apply-patch.js        # ⏳ Plan: OS-specific script rewriter
├── commands/                  # ⏳ Planned
│   └── /enlighten-setup.md   # Plan: main entry point
│   └── /enlighten-inspect.md # Plan: dry-run mode
├── templates/                 # ⏳ Planned
│   └── install-profile.json  # Plan: profile template
└── tests/                     # ⏳ Planned
    └── test-scan.js          # Plan: unit tests
```

## Usage

### Scan a repository
```bash
/skill-use repo-adapter
```

### Orchestrate repo installation
```bash
/skill-use repo-orchestrator
/repo-orchestrator https://github.com/user/repo --harness hermes --profile cse-core
```

### Dry-run inspection
```bash
/repo-orchestrator https://github.com/user/repo --dry-run
```

### Find right profile for a task
```bash
/skill-use find-right "I need to add JWT auth to my Express API"
# Returns: cse-core profile + auth-related skills
```

## Profile Mapping Reference

| Repo Type | ECC Profile | Key Skills |
|-----------|-------------|------------|
| Web app (React/Vue/Svelte) | cse-core | typescript-reviewer, frontend-patterns |
| Python API (FastAPI/Django) | cse-core | python-reviewer, fastapi-reviewer |
| Go service | cse-core | go-reviewer, golang-patterns |
| Rust project | cse-core | rust-reviewer, rust-patterns |
| Java/Spring | cse-core | java-reviewer, springboot-patterns |
| ML project | ml-researcher | pytorch-patterns, mle-reviewer |
| Research paper | researcher | deep-research, arxiv |
| Infrastructure | devops | terraform-patterns, kubernetes-patterns |

## Architecture

```
User → /enlighten-setup → repo-adapter skill
                         ↓
              scan-repo.js detects language/frameworks
                         ↓
              find-right maps to ECC profile
                         ↓
              adapt-install rewrites scripts
                         ↓
              installer-operator executes
                         ↓
              ECC agents/skills handle the install
```

## API Keys Needed

Add to `~/.hermes/.env`:
```
OPENROUTER_API_KEY=  # For docs-lookup, search skills
EXA_API_KEY=         # For deep-research
GITHUB_TOKEN=        # For repo cloning
```

## Related Projects

- **ECC Repository**: https://github.com/affaan-m/ECC
- **ECC Documentation**: https://ecc.tools
- **Hermes Agent**: https://hermes-agent.nousresearch.com

## License

MIT License - Same as ECC
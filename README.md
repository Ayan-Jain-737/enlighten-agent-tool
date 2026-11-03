# enlighten-agent-tool

A universal repository installer that uses ECC to automatically detect, adapt, and install any GitHub project across different harnesses.

## Project Overview

This project builds on ECC (Everything Claude Code) to create a universal installer that scans, adapts, and installs GitHub repositories based on the user's harness (Hermes, Claude Code, Codex, etc.).

## What's Done ✓

### ECC for Hermes Setup Complete
- Installed all 71 ECC agents in `~/.hermes/agents/`
- Installed 355 skills in `~/.hermes/skills/`
- Installed 98 commands in `~/.hermes/commands/`
- Installed rule sets for: TypeScript, Python, Go, Rust, Java, C++
- Created 5 profiles: `cse-core`, `full-cse`, `researcher`, `devops`, `ml-researcher`
- Configured basic hooks for command/file validation
- Created `profile-selector` skill to switch profiles

### Project Structure Created
```
enlighten-agent-tool/
├── README.md                 # ✓ This file
├── SETUP_SUMMARY.md          # ✓ ECC installation guide
├── skills/                   # ⏳ TODO
│   └── repo-adapter/         # TODO - scan repos for language/dependencies
│   └── adapt-install/        # TODO - adapt for local harness
│   └── find-right/           # TODO - map prompts to profiles
├── agents/                   # ⏳ TODO
│   └── installer-operator.md # TODO - orchestrate installation
├── scripts/                   # ⏳ TODO
│   ├── scan-repo.js          # TODO - repo language/dependency scanner
│   ├── map-harness.js        # TODO - profile mapper
│   └── apply-patch.js        # TODO - OS-specific script rewriter
├── commands/                  # ⏳ TODO
│   └── /enlighten-setup.md   # TODO - main entry point
│   └── /enlighten-inspect.md # TODO - dry-run mode
├── templates/                 # ⏳ TODO
│   └── install-profile.json  # TODO
└── tests/                     # ⏳ TODO
    └── test-scan.js          # TODO
```

## Usage (When Complete)

### Install a repo
```bash
/enlighten-setup https://github.com/user/repo
```

### Dry-run inspection
```bash
/enlighten-inspect https://github.com/user/repo
```

### Find right profile for a task
```bash
/skill-use find-right "I need to add JWT auth to my Express API"
# Returns: cse-core profile + auth-related skills
```

### Profile Mapping Reference

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

## Remaining Tasks

### Phase 1: Core Infrastructure (Priority)
1. [ ] Create `skills/repo-adapter/SKILL.md` - Repo scanning skill
2. [ ] Create `skills/adapt-install/SKILL.md` - Install adaptation skill
3. [ ] Create `skills/find-right/SKILL.md` - Profile/skill mapping skill
4. [ ] Create `agents/installer-operator.md` - Orchestration agent
5. [ ] Implement `scripts/scan-repo.js` - Language detection script

### Phase 2: Harness Support
6. [ ] Implement `scripts/map-harness.js` - Map to correct harness
7. [ ] Implement `scripts/apply-patch.js` - OS/script adaptation
8. [ ] Create `commands/enlighten-setup.md` - Main command
9. [ ] Create `commands/enlighten-inspect.md` - Dry-run command

### Phase 3: Testing & Expansion
10. [ ] Create test suite for scanner
11. [ ] Add more profile templates
12. [ ] Support Windows/macOS/Linux adaptation
13. [ ] Add CI/CD integration tests

## API Keys Needed

Add to `~/.hermes/.env`:
```
OPENROUTER_API_KEY=  # For docs-lookup
EXA_API_KEY=         # For deep-research
GITHUB_TOKEN=        # For repo cloning
```

## Technical Architecture

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

## Related Projects

- **ECC Repository**: https://github.com/affaan-m/ECC
- **ECC Documentation**: https://ecc.tools
- **Hermes Agent**: https://hermes-agent.nousresearch.com

## License

MIT License - Same as ECC
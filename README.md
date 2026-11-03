# enlighten-agent-tool

A universal repository installer that uses ECC to automatically detect, adapt, and install any GitHub project across different harnesses.

## Overview

This project provides an automated installer that:
1. Scans a repo's README, package.json, setup.sh, etc.
2. Detects the language, framework, and dependencies
3. Maps to the right ECC profile/modules
4. Rewrites install scripts for the local OS/harness
5. Executes the installation

## Project Structure

```
enlighten-agent-tool/
├── README.md                 # This file
├── SETUP_SUMMARY.md          # ECC for Hermes installation summary
├── skills/
│   └── repo-adapter/         # Skill to scan and analyze repos
│   └── adapt-install/        # Skill to adapt installs for local environment
│   └── find-right/           # Skill to find correct profile/skill for a prompt
├── agents/
│   └── installer-operator.md # Agent that orchestrates repo installation
├── scripts/
│   ├── scan-repo.js          # Scans a repo for language/dependencies
│   ├── map-harness.js        # Maps repo to correct ECC profile
│   └── apply-patch.js        # Rewrites install scripts for local OS
├── commands/
│   ├── /enlighten-setup      # Main entry point
│   └── /enlighten-inspect    # Dry-run before install
├── templates/
│   └── install-profile.json  # Template for profile creation
└── tests/
    └── test-scan.js          # Unit tests for scanner
```

## Usage

### Install a repo
```bash
/enlighten-setup https://github.com/user/repo
```

### Inspect before install (dry-run)
```bash
/enlighten-inspect https://github.com/user/repo
```

### Select profile manually
```bash
/skill-use find-right "I need to add JWT auth to my Express API"
# Returns: cse-core profile + auth-related skills
```

## Components

### 1. repo-adapter Skill
Scans a repository and extracts:
- Primary language (from package.json, Cargo.toml, requirements.txt, etc.)
- Framework (React, FastAPI, Django, Spring Boot, etc.)
- Dependencies
- Install instructions
- CI/CD setup

### 2. find-right Skill
Maps a prompt or use case to:
- The correct ECC profile (cse-core, researcher, devops, etc.)
- Required skills
- Required agents

### 3. installer-operator Agent
Executes the installation:
1. Clones the repo
2. Runs profile selector
3. Adapts install scripts
4. Executes installation
5. Verifies setup

## Profile Mapping

| Repo Type | ECC Profile | Key Skills |
|-----------|-------------|------------|
| Web app (React/Vue/Svelte) | cse-core | typescript-reviewer, frontend-patterns, react-reviewer, vue-reviewer |
| Python API (FastAPI/Django) | cse-core | python-reviewer, fastapi-reviewer, django-reviewer |
| Go service | cse-core | go-reviewer, golang-patterns |
| Rust project | cse-core | rust-reviewer, rust-patterns |
| Java/Spring | cse-core | java-reviewer, springboot-patterns |
| ML project | ml-researcher | pytorch-patterns, mle-reviewer |
| Research paper | researcher | deep-research, arxiv, grounded-citations |
| Infrastructure | devops | terraform-patterns, kubernetes-patterns |

## Next Steps

1. Create the skill files in the proper directories
2. Implement the scan-repo.js script
3. Test with sample repositories
4. Add more profile templates

## API Keys Needed

Add to `~/.hermes/.env`:
```
OPENROUTER_API_KEY=  # For docs-lookup
EXA_API_KEY=         # For deep-research
GITHUB_TOKEN=        # For repo cloning
```
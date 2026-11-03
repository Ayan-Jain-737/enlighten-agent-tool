# ECC for Hermes - Setup Summary

## What Was Installed

### Profiles Created
1. **cse-core** - Computer Science Engineering core profile
   - 11 essential agents (planner, code-reviewer, tdd-guide, security-reviewer, build-error-resolver, refactor-cleaner, loop-operator, architect, docs-lookup, doc-updater, pr-test-analyzer)
   - 14 key skills (tdd-workflow, security-review, orch-pipeline, team-builder, plan-orchestrate, search-first, continuous-learning, context-budget, token-card, code-tour, verification-loop, issue-review, codehealth-mcp, agent-architecture-audit)
   - 98 commands from ECC
   - 7 rule sets (common, typescript, python, golang, rust, java, cpp)

2. **full-cse** - Complete ECC installation
   - 71 agents (all from ECC)
   - 314 skills (all from ECC)
   - 98 commands
   - 22 rule sets

3. **researcher** - Research-focused profile
   - OSINT, deep research, competitive analysis agents/skills

4. **devops** - Infrastructure profile
   - Network, homelab, automation agents/skills

5. **ml-researcher** - Machine learning profile
   - PyTorch, RAG, evaluation agents/skills

## Directory Structure

```
~/.hermes/
├── agents/                 # 71 ECC agents
├── skills/                 # 355 skills (ECC + enlighten)
├── commands/               # 98 slash commands
├── rules/ecc/              # 28 rule sets
├── hooks/
│   ├── hooks.json          # Basic Hermes hooks config
│   ├── pre-bash-check.py   # Terminal command guard
│   └── post-edit-check.py  # File edit post-processing
├── mcp-config.json         # MCP server definitions
├── profiles/
│   ├── cse-core/           # Student engineering profile
│   ├── full-cse/           # Complete ECC
│   ├── researcher/         # Research profile
│   ├── devops/             # DevOps profile
│   ├── ml-researcher/      # ML research profile
│   └── enlighten-core-skills/
│       └── profile-selector/SKILL.md
└── .env                   # Add API keys as needed
```

## Usage

### Select a profile
```
/skill-use profile-selector
```

### Use ECC agents
```
<use_agent>
agent: planner
task: Plan a feature to add user authentication
</use_agent>
```

### Use ECC skills
```
/skill-use tdd-workflow
/skill-use security-review
/skill-use team-builder
```

### Run orchestrated workflows
```
/orch-add-feature "Add JWT authentication"
/security-review
/tdd-workflow
/code-review
```

### Team Builder (dynamically discovers agents)
```
/team-builder
```

## Next Steps (in /home/furious/Projects/enlighten-agent-tool/)

This project extends ECC for universal repository installation:

1. **repo-adapter skill** - Scan any GitHub repo's README/package.json/setup.sh to extract install instructions
2. **adapt-install skill** - Map detected requirements to the right ECC profile/modules
3. **installer operator agent** - Execute the adapted install in the correct harness
4. **find-right skill** - For any prompt, determine the correct profile/skill to use

## API Keys Needed (add to ~/.hermes/.env)

```
OPENROUTER_API_KEY=  # For docs-lookup, search skills
EXA_API_KEY=         # For deep-research skill
GITHUB_TOKEN=        # For codebase analysis
```

## Verification

Run this to verify the setup:
```
ls ~/.hermes/agents/*.md | wc -l  # Should be 71
ls ~/.hermes/skills/*/ | wc -l    # Should be 355+
ls ~/.hermes/profiles/            # Should show cse-core, full-cse, etc.
```
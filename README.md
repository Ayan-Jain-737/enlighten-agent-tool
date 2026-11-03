# enlighten-agent-tool

## What This Tool Does

A universal installer that takes any GitHub repo URL and installs it into your current agent harness (Claude Code, Hermes, Opencode, Codex, etc.) automatically.

## Usage

```
/enlighten https://github.com/user/repo
/enlighten https://github.com/user/repo --dry-run
/enlighten https://github.com/user/repo --harness hermes --profile cse-core
```

## What's Already Built

✅ **repo-adapter skill** (`~/.hermes/skills/repo-adapter/`)
- Scans GitHub repos for language, framework, dependencies
- Detects: TypeScript, Python, Go, Rust, Java, React, Vue, Django, FastAPI, etc.
- Output: JSON with install requirements

✅ **repo-orchestrator skill** (`~/.hermes/skills/repo-orchestrator/`) 
- Implements the full workflow: scan → adapt → install → verify
- Uses ECC's orch-* pipeline pattern
- Handles profile mapping

✅ **scan-repo.js** - Working scanner script
- Clones repos, detects language from marker files
- Maps to appropriate ECC profile

## What's Missing

1. **repo-adapter scripts**: 
   - `adapt-install.js` - Rewrites install scripts for local OS
   - `map-harness.js` - Determines user's harness
   - `apply-patch.js` - OS-specific adaptations

2. **Commands**:
   - `/enlighten` - Main entry point command
   - `/enlighten-inspect` - Dry-run inspection

3. **installer-operator agent** - Agent that orchestrates the workflow

4. **find-right skill** - Maps prompts to profiles

## Profile Mapping

| Repo Type | ECC Profile | Detected By |
|-----------|-------------|-------------|
| Web app (React/Vue/Svelte) | cse-core | package.json |
| Python API (FastAPI/Django) | cse-core | requirements.txt |
| Go service | cse-core | go.mod |
| Rust project | cse-core | Cargo.toml |
| Java/Spring | cse-core | build.gradle/pom.xml |
| ML project | ml-researcher | pyproject.toml |
| Research paper | researcher | README keywords |
| Infrastructure | devops | terraform/k8s files |

## Local Skills Location

All skills are installed in:
- `~/.hermes/skills/repo-adapter/`
- `~/.hermes/skills/repo-orchestrator/`
- `~/.hermes/skills/profile-selector/`

## Next Steps

1. Copy repo-adapter and repo-orchestrator to project directory
2. Implement `adapt-install.js` and `apply-patch.js`
3. Create `/enlighten` command
4. Test with real repos
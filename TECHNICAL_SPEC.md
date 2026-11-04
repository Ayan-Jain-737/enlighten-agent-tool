# enlighten-agent-tool - Technical Specification

## Architecture Overview

### System Components

```
┌─────────────────────────────────────────────────────────────────┐
│                    enlighten-agent-tool                         │
├─────────────────────────────────────────────────────────────────┤
│  bin/enlighten (CLI Entry Point)                                │
│  ├── EnlightCLI (main class)                                    │
│  ├── EnlightenScanner (scan-repo.js)                            │
│  └── ScriptAdapter (adapt-install.js)                           │
├─────────────────────────────────────────────────────────────────┤
│  Skills (Copied to agent harnesses)                             │
│  ├── enlighten/              # Main command dispatcher          │
│  ├── enlighten-installer/  # Scans, maps, adapts, installs      │
│  └── enlighten-uninstaller/  # Safe removal with deps          │
└─────────────────────────────────────────────────────────────────┘
```

## Core Modules

### 1. EnlightCLI (`bin/enlighten`)
- **Entry point**: CLI argument parsing
- **Version**: Reads from `package.json` dynamically
- **Commands**: install, diagnose, list-installed, uninstall, help
- **Dependencies**: EnlightenScanner, ScriptAdapter

### 2. EnlightenScanner (`skills/enlighten-installer/scripts/scan-repo.js`)
- **Purpose**: Analyzes GitHub repo to detect language, framework, install method
- **Detection Priority**:
  1. package.json → TypeScript/JavaScript + framework detection
  2. requirements.txt/pyproject.toml → Python + framework
  3. go.mod → Go + framework
  4. Cargo.toml → Rust + framework
  5. build.gradle/pom.xml → Java + framework
  6. *.csproj/*.sln → C# 
  7. CMakeLists.txt/Makefile → C++
  8. Other markers (composer.json, Gemfile, etc.)

### 3. ScriptAdapter (`scripts/adapt-install.js`)
- **Purpose**: Adapts install commands for target OS/harness
- **Supported Package Managers**: npm, yarn, pnpm, bun, pip, uv, poetry, pipenv, uv, cargo, go, gradle, maven, composer, bundler, dotnet, cmake, make
- **Harness Managers**: Hermes, Claude Code, Opencode, Codex
- **OS Adapters**: Linux, macOS, Windows

## Language Detection Logic

```javascript
// Priority order in scan-repo.js detectLanguage()
1. package.json → TypeScript/JavaScript (checks for typescript, tsconfig)
2. requirements.txt/pyproject.toml → Python (pip/poetry/uv)
3. go.mod → Go
5. Cargo.toml → Rust (cargo)
6. build.gradle/pom.xml → Java (gradle/maven)
7. *.csproj/*.sln → C# (dotnet)
8. CMakeLists.txt/Makefile → C++ (cmake/make)
9. Other: composer.json, Gemfile, Package.swift, build.gradle.kts, pubspec.yaml
```

## Framework Detection Matrix

| Language | Frameworks Detected |
|----------|---------------------|
| TypeScript/JS | React, Vue, Next, Svelte, Angular, NestJS, Express, Fastify, Vite, Astro, Nuxt, SvelteKit, Remix, Gatsby, Remo |
| Python | Django, FastAPI, Flask, PyTorch, TensorFlow, LangChain, Transformers, Pandas, SQLAlchemy, Celery, Redis |
| Go | Gin, Echo, Fiber, Chi, gRPC |
| Rust | Actix, Axum, Rocket, Warp, Tokio, Serde, Diesel, SQLx, Tauri, Bevy |
| Java | Spring Boot, Quarkus, Micronaut, Vert.x, gRPC |
| C# | ASP.NET, .NET Core |
| C++ | CMake, Make |
| PHP | Composer (Laravel, Symfony) |
| Ruby | Bundler (Rails) |
| PHP | Composer |
| Swift | SwiftPM |
| Kotlin | Gradle (Ktor) |
| Dart | Pub (Flutter) |

## Install Method Mapping

| Language | Install Method | Commands |
|----------|---------------|----------|
| TypeScript/JS | npm/yarn/pnpm/bun | npm ci / yarn install / pnpm install / bun install |
| Python | pip/uv/poetry/pipenv | pip install -r requirements.txt / uv pip install / poetry install |
| Go | go | go build / go mod tidy |
| Rust | cargo | cargo build --release |
| Java | gradle/maven | ./gradlew build / mvn clean install |
| C# | dotnet | dotnet build / dotnet publish |
| C++ | cmake/make | cmake -B build && cmake --build build |
| PHP | composer | composer install --no-dev |
| Ruby | bundler | bundle install |
| Swift | swift | swift build |

## Profile Mapping

| Framework/Method | Profile |
|-----------------|---------|
| React, Vue, Next, Svelte, Angular | web-developer |
| Django, FastAPI, Flask | python-backend |
| PyTorch, TensorFlow, LangChain | ml-researcher |
| Gin, Echo, Fiber, Go | go-developer |
| Actix, Axum, Rocket, Rust | rust-developer |
| Spring Boot, Quarkus, Java | java-enterprise |
| ASP.NET, C# | dotnet-developer |
| CMake, C++ | cpp-developer |
| Go modules | go-developer |
| Cargo (Rust) | rust-developer |

## Postinstall Script Logic

```javascript
// scripts/postinstall.js flow:
1. detectAgents() → Detects Hermes, Claude Code, Opencode, Codex, Cursor, Zed
2. For each agent:
   a. Ensure skillsDir exists
   b. Copy enlighten, enlighten-installer, enlighten-uninstaller skills
   c. Copy commands/ to agent.configDir/commands/
3. Output installation summary
```

## Harness Configuration

| Harness | Skills Dir | Config Dir | Command Registration |
|---------|------------|------------|---------------------|
| Hermes | ~/.hermes/skills/ | ~/.hermes/ | commands/ folder |
| Claude Code | ~/.claude/skills/ | ~/.claude/ | commands/ folder |
| Opencode | ~/.config/opencode/skills/ | ~/.config/opencode/ | commands/ |
| Codex | ~/.codex/skills/ | ~/.codex/ | commands/ |
| Cursor | ~/.cursor/skills/ | ~/.cursor/ | commands/ |
| Zed | ~/.zed/skills/ | ~/.zed/ | commands/ |

## Testing Checklist

### Manual Verification Steps
```bash
# 1. Fresh install test
npm install -g enlighten-agent-tool
export PATH="$HOME/.npm-global/bin:$PATH"
enlighten --help

# 2. Test install flow
enlighten install https://github.com/vercel/next.js
enlighten list-installed

# 3. Test uninstall
enlighten uninstall <id> --dry-run
enlighten uninstall <id> --force

# 4. Test diagnose
enlighten diagnose https://github.com/vercel/next.js

# 4. Test uninstall
enlighten uninstall <id> --force
```

## Known Edge Cases

| Scenario | Handling |
|----------|----------|
| Repo with no package manager files | Falls back to 'manual' install method |
| Polyglot repo (JS + Python) | Prioritizes package.json, falls back to requirements.txt |
| No GitHub URL | Shows usage help |
| Private repo | Requires git credentials (uses git clone) |
| Windows paths | Converts ./install.sh to .\install.ps1 |
| Missing npm global bin | Shows PATH warning |

## Version History
- 1.0.8 - Current (fixed postinstall, version sync)
- 1.0.7 - Fixed version reading from package.json
- 1.0.6 - Fixed adapt-install.js syntax errors
- 1.0.5 - Added postinstall auto-registration
- 1.0.4 - Added uninstall command
- 1.0.3 - Added diagnose command
- 1.0.2 - Added list-installed
- 1.0.1 - Initial npm publish
- 1.0.0 - Initial release

## Environment Variables

| Variable | Purpose | Default |
|----------|---------|---------|
| ENLIGHTEN_CACHE_DIR | Cache directory | ~/.enlighten/cache |
| ENLIGHTEN_TIMEOUT | Command timeout | 300s |
| HERMES_CONFIG_DIR | Hermes config path | ~/.hermes |
| CLAUDE_HOME | Claude Code home | ~/.claude |
| CODEX_HOME | Codex home | ~/.codex |
| OPENCODE_CONFIG_DIR | Opencode config | ~/.config/opencode |
| CODEX_HOME | Codex home | ~/.codex |

---

**Last Updated**: 2026-11-04  
**Maintainer**: Ayan-Jain-737  
**License**: MIT
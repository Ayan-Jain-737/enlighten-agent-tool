# enlighten-agent-tool - Quick Start Guide

## 🚀 Quick Start

### For Your Friend (The End User)

```bash
# 1. Install globally
npm install -g enlighten-agent-tool

# 2. Add to PATH (one-time setup)
export PATH="$HOME/.npm-global/bin:$PATH"

# 3. Use immediately
enlighten install https://github.com/user/repo
```

Or skip PATH setup with **npx**:
```bash
npx enlighten-agent-tool install https://github.com/user/repo
```

---

## 📋 Available Commands

| Command | Description |
|---------|-------------|
| `enlighten install <url>` | Install any GitHub repo |
| `enlighten diagnose <url>` | Analyze repo without installing |
| `enlighten list-installed` | List all installed repositories |
| `enlighten uninstall <id> [--dry-run\|--force]` | Remove installation |
| `enlighten --help` | Show help |

### Examples

```bash
# Install a repo
enlighten install https://github.com/vercel/next.js

# Preview what would happen (dry run)
enlighten install https://github.com/user/repo --dry-run

# Analyze a repo before installing
enlighten diagnose https://github.com/vercel/next.js

# List all installed
enlighten list-installed

# Safe uninstall preview
enlighten uninstall my-repo --dry-run

# Force uninstall
enlighten uninstall my-repo --force
```

---

## 🎯 Supported Repositories

| Type | Example | Detects |
|------|---------|---------|
| **Node.js** | `vercel/next.js` | TypeScript, React, Next.js, npm/yarn/pnpm/bun |
| **Python** | `django/django`, `pytorch/pytorch` | Python, Django, FastAPI, PyTorch, pip/uv/poetry |
| **Go** | `gin-gonic/gin`, `golang/go` | Go modules, Gin, Echo, Fiber |
| **Rust** | `tokio-rs/tokio`, `rust-lang/rust` | Cargo, Actix, Axum, Tokio |
| **Java** | `spring-projects/spring-boot` | Maven/Gradle, Spring Boot |
| **C#** | `dotnet/runtime` | .NET, ASP.NET Core |
| **C++** | `facebookresearch/fastText` | CMake, Make |
| **Rust** | `tokio-rs/tokio` | Cargo, Actix, Axum |
| **Java** | `spring-projects/spring-boot` | Maven/Gradle, Spring Boot |
| **Go** | `gin-gonic/gin` | Go modules, Gin, Echo |

---

## 🎯 Common Use Cases

### Install a Repository
```bash
# Install any GitHub repo
enlighten install https://github.com/user/repo

# Dry run (preview what would happen)
enlighten install https://github.com/user/repo --dry-run

# Specify harness
enlighten install https://github.com/user/repo --harness claude
```

### Analyze Before Installing
```bash
# Analyze a repo before installing
enlighten diagnose https://github.com/user/repo

# Output includes:
# - Language & framework detection
# - Recommended profile
# - Install commands that would run
```

### Manage Installations
```bash
# List all installed
enlighten list-installed

# Preview uninstall
enlighten uninstall my-repo --dry-run

# Force uninstall
enlighten uninstall my-repo --force
```

---

## 🔧 Troubleshooting

### "enlighten: command not found"
```bash
export PATH="$HOME/.npm-global/bin:$PATH"
# Add to ~/.bashrc or ~/.zshrc permanently
echo 'export PATH="$HOME/.npm-global/bin:$PATH"' >> ~/.bashrc
```

### "Permission denied" on install
```bash
npm config set allow-scripts ENLIGHTEN_AGENT_TOOL true
npm install -g enlighten-agent-tool
```

### "Command not found" after install
```bash
export PATH="$HOME/.npm-global/bin:$PATH"
# Add to ~/.bashrc or ~/.zshrc permanently
```

### npx alternative (no PATH needed)
```bash
npx enlighten-agent-tool install https://github.com/user/repo
```

---

## 🤖 Supported Agents

| Agent | Status | Config Path |
|-------|--------|-------------|
| Hermes | ✅ | `~/.hermes/skills/` |
| Claude Code | ✅ | `~/.claude/skills/` |
| Opencode | ✅ | `~/.config/opencode/skills/` |
| Codex | ✅ | `~/.codex/skills/` |
| Cursor | ✅ | `~/.cursor/skills/` |
| Zed | ✅ | `~/.zed/skills/` |

---

## 📦 Supported Languages & Frameworks

| Language | Frameworks | Install Method |
|----------|------------|----------------|
| TypeScript/JS | React, Vue, Next, Svelte, Angular, NestJS, Express, Fastify, Vite, Astro, Nuxt, SvelteKit | npm/yarn/pnpm/bun |
| Python | Django, FastAPI, Flask, PyTorch, TensorFlow, LangChain | pip/uv/poetry |
| Go | Gin, Echo, Fiber, Chi, gRPC | go mod |
| Rust | Actix, Axum, Rocket, Tokio, Tauri | cargo |
| Java | Spring Boot, Quarkus, Micronaut | Maven/Gradle |
| C# | ASP.NET, .NET Core | dotnet |
| C++ | CMake, Make | cmake/make |
| Rust | Actix, Axum, Rocket, Tokio | cargo |
| Go | Gin, Echo, Fiber | go mod |

---

## 📦 Profile Reference

| Detected As | Profile |
|-------------|---------|
| React, Vue, Next, Svelte | `web-developer` |
| Django, FastAPI, Flask | `python-backend` |
| PyTorch, TensorFlow, LangChain | `ml-researcher` |
| Gin, Echo, Fiber | `go-developer` |
| Actix, Axum, Rocket | `rust-developer` |
| Spring Boot, Quarkus | `java-enterprise` |
| ASP.NET, C# | `dotnet-developer` |
| C++ | `cpp-developer` |

---

## 🆘 Quick Help

```bash
# Show all commands
enlighten --help

# Show version
enlighten --version

# Dry run any command
enlighten install <url> --dry-run
enlighten uninstall <id> --dry-run
```

---

**Full Documentation**: [GitHub Wiki](https://github.com/Ayan-Jain-737/enlighten-agent-tool/wiki)  
**Issues**: [GitHub Issues](https://github.com/Ayan-Jain-737/enlighten-agent-tool/issues)  
**NPM**: [npmjs.com/package/enlighten-agent-tool](https://www.npmjs.com/package/enlighten-agent-tool)
---
name: enlighten
description: Universal GitHub repository installer for agent harnesses. Auto-detects language/framework, adapts for your OS, and manages full install/uninstall lifecycle.
tags:
  - installer
  - github
  - automation
  - cli
author: Ayan-Jain-737
version: "2.0.0"
usage: |
  /enlighten install <repo-url> [--dry-run] [--harness hermes|claude|opencode]
  /enlight uninstall <identifier> [--force]
  /enlighten list-installed
  /enlighten diagnose <repo-url>
---

# enlighten - Universal Agent Installer

Install any GitHub repository to your agent harness automatically.

## Commands

### Install
```
/enlighten install https://github.com/user/repo
```

### Dry-run
```
/enlighten install https://github.com/user/repo --dry-run
```

### Uninstall
```
/enlighten uninstall <identifier> --force
```

### List
```
/enlight list-installed
/enlight diagnose <repo-url>
```

## Output

Success:
```json
{"status": "success", "identifier": "user-repo", "profile": "web-developer"}
```

Error:
```json
{"status": "error", "error": "Clone failed"}
```

## Profiles

| Profile | Languages | When |
|---------|-----------|------|
| web-developer | TypeScript, JS, React, Vue | Frontend projects |
| python-backend | Python, Django, FastAPI | Python APIs |
| go-developer | Go microservices | Go services |
| rust-developer | Rust applications | Rust projects |
| java-enterprise | Java, Spring Boot | Java apps |
| dotnet-developer | C#, ASP.NET | .NET apps |
| cpp-developer | C++ projects | C++ codebases |
| ml-researcher | PyTorch, TensorFlow | ML projects |
| developer | All | General purpose |

## Requirements

- Node.js 18+
- Git
- Write access to config directory

## License

MIT
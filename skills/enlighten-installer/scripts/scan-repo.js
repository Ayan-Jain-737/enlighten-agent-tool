#!/usr/bin/env node
/**
 * enlighten-installer: Core Scanner
 * Standalone repository scanner - no external dependencies
 * Detects language, framework, dependencies, and profiles
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class EnlightenScanner {
  constructor(options = {}) {
    this.cacheDir = process.env.ENLIGHTEN_CACHE_DIR || path.join(require('os').homedir(), '.enlighten', 'cache');
    this.timeout = parseInt(process.env.ENLIGHTEN_TIMEOUT || '300');
    this.dryRun = options.dryRun || false;
  }

  detectLanguage(dir) {
    const markers = {
      'python': ['requirements.txt', 'setup.py', 'pyproject.toml', 'Pipfile'],
      'typescript': ['package.json'],
      'javascript': ['package.json'],
      'go': ['go.mod', 'go.sum'],
      'rust': ['Cargo.toml', 'Cargo.lock'],
      'java': ['build.gradle', 'pom.xml', 'settings.gradle'],
      'csharp': ['*.csproj', '*.sln'],
      'cpp': ['CMakeLists.txt', 'Makefile'],
      'ruby': ['Gemfile'],
      'php': ['composer.json'],
      'swift': ['Package.swift'],
      'kotlin': ['build.gradle.kts'],
      'dart': ['pubspec.yaml']
    };

    for (const [lang, files] of Object.entries(markers)) {
      for (const file of files) {
        if (fs.existsSync(path.join(dir, file))) {
          return { language: lang, confidence: 0.9 };
        } else if (globMatch(file, dir)) {
          return { language: lang, confidence: 0.8 };
        }
      }
    }
    return { language: 'unknown', confidence: 0.1 };
  }

  detectFramework(dir, language) {
    const pkgPath = path.join(dir, 'package.json');
    if (pkgPath && fs.existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        const deps = { ...pkg.dependencies, ...pkg.devDependencies };
        const depsStr = JSON.stringify(deps).toLowerCase();
        
        const frameworks = {
          'react': ['react', '@types/react'],
          'vue': ['vue', 'vue-router'],
          'angular': ['@angular/core'],
          'next': ['next'],
          'svelte': ['svelte'],
          'nestjs': ['@nestjs/core']
        };
        
        for (const [fw, keywords] of Object.entries(frameworks)) {
          if (keywords.some(k => depsStr.includes(k))) {
            return { framework: fw, confidence: 0.9 };
          }
        }
      } catch (e) {}
    }

    // Python frameworks
    const reqPath = path.join(dir, 'requirements.txt');
    if (reqPath && fs.existsSync(reqPath)) {
      try {
        const content = fs.readFileSync(reqPath, 'utf8').toLowerCase();
        const frameworks = {
          'django': ['django'],
          'fastapi': ['fastapi'],
          'flask': ['flask'],
          'pytorch': ['torch']
        };
        
        for (const [fw, keywords] of Object.entries(frameworks)) {
          if (keywords.some(k => content.includes(k))) {
            return { framework: fw, confidence: 0.9 };
          }
        }
      } catch (e) {}
    }

    return { framework: 'generic', confidence: 0.5 };
  }

  getInstallProfile(language, framework) {
    const mapping = {
      'react': 'web-developer',
      'vue': 'web-developer',
      'next': 'web-developer',
      'svelte': 'web-developer',
      'nestjs': 'web-developer',
      'django': 'python-backend',
      'fastapi': 'python-backend',
      'flask': 'python-backend',
      'go': 'go-developer',
      'rust': 'rust-developer',
      'java': 'java-enterprise',
      'csharp': 'dotnet-developer',
      'cpp': 'cpp-developer'
    };

    return mapping[framework.framework] || mapping[language.language] || 'developer';
  }

  scanRepo(repoPath) {
    console.log(JSON.stringify({
      status: 'scanning',
      repo: repoPath,
      steps: ['detecting-language', 'detecting-framework', 'mapping-profile']
    }, null, 2));

    const langResult = this.detectLanguage(repoPath);
    const fwResult = this.detectFramework(repoPath, langResult.language);
    const profile = this.getInstallProfile(langResult, fwResult);

    return {
      status: 'scanned',
      repository: repoPath,
      detected: {
        language: langResult.language,
        language_confidence: langResult.confidence,
        framework: fwResult.framework,
        framework_confidence: fwResult.confidence
      },
      profile: {
        recommended: profile,
        reason: `Detected ${langResult.language} project with ${fwResult.framework}`
      },
      diagnostics: {
        cache_dir: this.cacheDir,
        dry_run: this.dryRun
      }
    };
  }
}

function globMatch(pattern, dir) {
  const { globSync } = require('glob');
  try {
    return globSync(pattern, { cwd: dir, absolute: false }).length > 0;
  } catch {
    return false;
  }
}

// CLI
if (require.main === module) {
  const repoPath = process.argv[2];
  if (!repoPath) {
    console.error(JSON.stringify({ error: 'Usage: scan-repo.js <repo-path>' }));
    process.exit(1);
  }

  const scanner = new EnlightenScanner();
  try {
    const result = scanner.scanRepo(repoPath);
    console.log(JSON.stringify(result, null, 2));
  } catch (e) {
    console.error(JSON.stringify({ error: e.message }));
    process.exit(1);
  }
}

module.exports = { EnlightenScanner };
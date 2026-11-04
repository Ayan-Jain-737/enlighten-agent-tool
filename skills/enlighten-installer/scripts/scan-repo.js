#!/usr/bin/env node
/**
 * enlighten-installer: Core Scanner
 * Standalone repository scanner - no external dependencies
 * Detects language, framework, dependencies, profiles, AND install methods
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
    // Check package.json FIRST - it's the most reliable indicator for JS/TS
    if (fs.existsSync(path.join(dir, 'package.json'))) {
      try {
        const pkg = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8'));
        const allDeps = { ...pkg.dependencies, ...pkg.devDependencies, ...pkg.dependencies };
        const scripts = { ...pkg.scripts };
        const content = JSON.stringify(allDeps).toLowerCase() + JSON.stringify(scripts).toLowerCase();
        
        // Check for Python bindings in package.json (means it's a polyglot)
        if (content.includes('python') || content.includes('django') || content.includes('fastapi') || content.includes('flask') || content.includes('pytorch') || content.includes('torch')) {
          // Prioritize Python if requirements.txt exists
          if (fs.existsSync(path.join(dir, 'requirements.txt'))) {
            return { language: 'python', confidence: 0.9, installMethod: 'pip' };
          }
        }
        
        // This is definitely a Node.js/TypeScript project
        if (pkg.types || content.includes('typescript') || path.basename(dir).includes('ts')) {
          return { language: 'typescript', confidence: 0.9, installMethod: 'npm' };
        }
        
        // Default JS
        return { language: 'javascript', confidence: 0.8, installMethod: 'npm' };
      } catch (e) {
        // Fall through to file-based detection
      }
    }
    
    const markers = {
      'python': { files: ['requirements.txt', 'setup.py', 'pyproject.toml', 'Pipfile'], installMethod: 'pip' },
      'go': { files: ['go.mod', 'go.sum'], installMethod: 'go' },
      'rust': { files: ['Cargo.toml', 'Cargo.lock'], installMethod: 'cargo' },
      'java': { files: ['build.gradle', 'pom.xml', 'settings.gradle'], installMethod: 'gradle' },
      'csharp': { files: ['*.csproj', '*.sln'], installMethod: 'dotnet' },
      'cpp': { files: ['CMakeLists.txt', 'Makefile'], installMethod: 'cmake' },
      'ruby': { files: ['Gemfile'], installMethod: 'bundler' },
      'php': { files: ['composer.json'], installMethod: 'composer' },
      'swift': { files: ['Package.swift'], installMethod: 'swift' },
      'kotlin': { files: ['build.gradle.kts'], installMethod: 'gradle' },
      'dart': { files: ['pubspec.yaml'], installMethod: 'pub' }
    };

    for (const [lang, config] of Object.entries(markers)) {
      for (const file of config.files) {
        if (fs.existsSync(path.join(dir, file))) {
          return { language: lang, confidence: 0.9, installMethod: config.installMethod };
        }
      }
    }
    return { language: 'unknown', confidence: 0.1, installMethod: 'manual' };
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
          'nestjs': ['@nestjs/core'],
          'express': ['express'],
          'koa': ['koa'],
          'fastify': ['fastify'],
          'vite': ['vite'],
          'webpack': ['webpack'],
          'astro': ['astro'],
          'remix': ['@remix-run/react'],
          'gatsby': ['gatsby'],
          'nuxt': ['nuxt'],
          'sveltekit': ['@sveltejs/kit']
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
          'pytorch': ['torch'],
          'tensorflow': ['tensorflow'],
          'jax': ['jax'],
          'flax': ['flax'],
          'langchain': ['langchain'],
          'llama-index': ['llama_index'],
          'transformers': ['transformers'],
          'pandas': ['pandas'],
          'numpy': ['numpy'],
          'scikit-learn': ['scikit-learn'],
          'pydantic': ['pydantic'],
          'sqlalchemy': ['sqlalchemy'],
          'alembic': ['alembic'],
          'celery': ['celery'],
          'redis-py': ['redis'],
          'psycopg2': ['psycopg2'],
          'asyncpg': ['asyncpg']
        };
        
        for (const [fw, keywords] of Object.entries(frameworks)) {
          if (keywords.some(k => content.includes(k))) {
            return { framework: fw, confidence: 0.9 };
          }
        }
      } catch (e) {}
    }

    // Go frameworks
    if (language === 'go') {
      const goModPath = path.join(dir, 'go.mod');
      if (fs.existsSync(goModPath)) {
        try {
          const content = fs.readFileSync(goModPath, 'utf8').toLowerCase();
          const frameworks = {
            'gin': ['gin-gonic/gin'],
            'echo': ['labstack/echo'],
            'fiber': ['gofiber/fiber'],
            'chi': ['go-chi/chi'],
            'gorilla/mux': ['gorilla/mux'],
            'grpc': ['google.golang.org/grpc']
          };
          
          for (const [fw, keywords] of Object.entries(frameworks)) {
            if (keywords.some(k => content.includes(k))) {
              return { framework: fw, confidence: 0.9 };
            }
          }
        } catch (e) {}
      }
    }

    // Rust frameworks
    if (language === 'rust') {
      const cargoPath = path.join(dir, 'Cargo.toml');
      if (fs.existsSync(cargoPath)) {
        try {
          const content = fs.readFileSync(cargoPath, 'utf8').toLowerCase();
          const frameworks = {
            'actix': ['actix-web'],
            'rocket': ['rocket'],
            'axum': ['axum'],
            'warp': ['warp'],
            'tokio': ['tokio'],
            'async-std': ['async-std'],
            'serde': ['serde'],
            'diesel': ['diesel'],
            'sqlx': ['sqlx'],
            'tauri': ['tauri'],
            'bevy': ['bevy']
          };
          
          for (const [fw, keywords] of Object.entries(frameworks)) {
            if (keywords.some(k => content.includes(k))) {
              return { framework: fw, confidence: 0.9 };
            }
          }
        } catch (e) {}
      }
    }

    // Java frameworks
    if (language === 'java') {
      const gradlePath = path.join(dir, 'build.gradle');
      const pomPath = path.join(dir, 'pom.xml');
      const content = (fs.existsSync(gradlePath) ? fs.readFileSync(gradlePath, 'utf8') : '') + 
                      (fs.existsSync(pomPath) ? fs.readFileSync(pomPath, 'utf8') : '');
      const lowerContent = content.toLowerCase();
      
      const frameworks = {
        'spring-boot': ['spring-boot'],
        'spring': ['spring-framework', 'spring-web'],
        'quarkus': ['quarkus'],
        'micronaut': ['micronaut'],
        'vertx': ['vertx'],
        'grpc': ['grpc'],
        'kafka': ['kafka'],
        'hibernate': ['hibernate'],
        'mybatis': ['mybatis']
      };
      
      for (const [fw, keywords] of Object.entries(frameworks)) {
        if (keywords.some(k => lowerContent.includes(k))) {
          return { framework: fw, confidence: 0.9 };
        }
      }
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
      'express': 'web-developer',
      'angular': 'web-developer',
      'sveltekit': 'web-developer',
      'nuxt': 'web-developer',
      'remix': 'web-developer',
      'django': 'python-backend',
      'fastapi': 'python-backend',
      'flask': 'python-backend',
      'pytorch': 'ml-researcher',
      'tensorflow': 'ml-researcher',
      'jax': 'ml-researcher',
      'langchain': 'ml-researcher',
      'go': 'go-developer',
      'gin': 'go-developer',
      'echo': 'go-developer',
      'fiber': 'go-developer',
      'rust': 'rust-developer',
      'actix': 'rust-developer',
      'axum': 'rust-developer',
      'tokio': 'rust-developer',
      'tauri': 'rust-developer',
      'java': 'java-enterprise',
      'spring-boot': 'java-enterprise',
      'quarkus': 'java-enterprise',
      'csharp': 'dotnet-developer',
      'cpp': 'cpp-developer',
      'go': 'go-developer',
      'rust': 'rust-developer',
      'python': 'python-backend',
      'typescript': 'web-developer',
      'javascript': 'web-developer'
    };

    return mapping[framework.framework] || mapping[language.language] || 'developer';
  }

  scanRepo(repoPath) {
    console.log(JSON.stringify({
      status: 'scanning',
      repo: repoPath,
      steps: ['detecting-language', 'detecting-framework', 'mapping-profile', 'detecting-install-method']
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
        framework_confidence: fwResult.confidence,
        installMethod: langResult.installMethod
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
    console.log(JSON.stringify(result, null, 2))
  } catch (e) {
    console.error(JSON.stringify({ error: e.message }))
    process.exit(1)
  }
}

module.exports = { EnlightenScanner };
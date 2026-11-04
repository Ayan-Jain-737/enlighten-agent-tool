#!/usr/bin/env node
/**
 * enlighten-agent-tool postinstall
 * Registers skills with detected agent harnesses
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

class PostInstall {
  constructor() {
    this.projectDir = path.join(__dirname, '..');
    this.skillsDir = path.join(this.projectDir, 'skills');
    this.commandsDir = path.join(this.projectDir, 'commands');
  }

  detectAgents() {
    const agents = [];
    
    // Check for Hermes
    if (process.env.HERMES_CONFIG_DIR || fs.existsSync(path.join(os.homedir(), '.hermes'))) {
      this.addAgent('Hermes', {
        skillsDir: path.join(os.homedir(), '.hermes', 'skills'),
        configDir: path.join(os.homedir(), '.hermes')
      });
    }
    
    // Check for Claude Code
    const claudeHome = process.env.CLAUDE_HOME || path.join(os.homedir(), '.claude');
    if (fs.existsSync(claudeHome)) {
      this.addAgent('Claude Code', {
        skillsDir: path.join(claudeHome, 'skills'),
        configDir: path.join(os.homedir(), '.claude')
      });
    }
    
    // Check for Opencode (standard location)
    const opencodeDir = process.env.OPENCODE_CONFIG_DIR || 
                       path.join(os.homedir(), '.config', 'opencode');
    if (fs.existsSync(opencodeDir)) {
      this.addAgent('Opencode', {
        skillsDir: path.join(opencodeDir, 'skills'),
        configDir: opencodeDir
      });
    }
    
    // Check for Codex
    const codexDir = process.env.CODEX_HOME || path.join(os.homedir(), '.codex');
    if (fs.existsSync(codexDir)) {
      this.addAgent('Codex', {
        skillsDir: path.join(codexDir, 'skills'),
        configDir: codexDir
      });
    }
    
    // Check for Cursor
    const cursorDir = path.join(os.homedir(), '.cursor');
    if (fs.existsSync(cursorDir)) {
      this.addAgent('Cursor', {
        skillsDir: path.join(cursorDir, 'skills'),
        configDir: cursorDir
      });
    }
    
    // Check for Zed
    const zedDir = path.join(os.homedir(), '.zed');
    if (fs.existsSync(zedDir)) {
      this.addAgent('Zed', {
        skillsDir: path.join(zedDir, 'skills'),
        configDir: zedDir
      });
    }
    
    // Check for Opencode (alternative location)
    const altOpenCode = process.env.OPENCODE_CONFIG_DIR || 
                       path.join(os.homedir(), '.opencode');
    if (fs.existsSync(altOpenCode) && !this.agents.some(a => a.name === 'Opencode')) {
      this.addAgent('Opencode', {
        skillsDir: path.join(altOpenCode, 'skills'),
        configDir: altOpenCode
      });
    }
    
    return this.agents;
  }
  
  addAgent(name, config) {
    if (!this.agents) this.agents = [];
    this.agents.push({ name, ...config });
  }
  
  copyRecursive(src, dest) {
    if (!fs.existsSync(src)) return;
    
    fs.mkdirSync(dest, { recursive: true });
    const entries = fs.readdirSync(src, { withFileTypes: true });
    
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      
      if (entry.isDirectory()) {
        this.copyRecursive(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
  
  installSkills(agent) {
    const skills = ['enlighten', 'enlighten-installer', 'enlighten-uninstaller'];
    const projectSkillsDir = path.join(__dirname, '..', 'skills');
    const projectCommandsDir = path.join(__dirname, '..', 'commands');
    
    // Ensure target skills directory exists
    if (!fs.existsSync(agent.skillsDir)) {
      fs.mkdirSync(agent.skillsDir, { recursive: true });
    }
    
    const skillsToInstall = ['enlighten', 'enlighten-installer', 'enlighten-uninstaller'];
    let installed = 0;
    
    for (const skill of ['enlighten', 'enlighten-installer', 'enlighten-uninstaller']) {
      const src = path.join(__dirname, '..', 'skills', skill);
      const dest = path.join(agent.skillsDir, skill);
      
      if (!fs.existsSync(src)) {
        console.log(`  ⚠️  Source not found: ${skill}`);
        continue;
      }
      
      try {
        // Remove existing if present
        if (fs.existsSync(dest)) {
          fs.rmSync(dest, { recursive: true, force: true });
        }
        
        // Copy skill directory
        this.copyRecursive(src, dest);
        console.log(`  ✅ ${agent.name}: ${skill}`);
      } catch (err) {
        console.log(`  ⚠️  ${agent.name}: ${skill} - ${err.message}`);
      }
    }
    
    // Copy commands directory if it exists
    if (fs.existsSync(this.commandsDir)) {
      const commandsDest = path.join(agent.configDir, 'commands');
      try {
        if (!fs.existsSync(commandsDir)) {
          fs.mkdirSync(commandsDir, { recursive: true });
        }
        this.copyRecursive(projectCommandsDir, commandsDest);
      } catch (err) {
        // Ignore errors for commands
      }
    }
  }
  
  run() {
    console.log('\n🔧 enlighten-agent-tool postinstall\n');
    
    // Detect agents
    this.agents = [];
    this.detectAgents();
    
    if (this.agents.length === 0) {
      console.log('⚠️  No supported agent harnesses detected.');
      console.log('   Skills installed to project only.');
      console.log('\n   To use with your agent, run:');
      console.log('   cp -r skills/* ~/.hermes/skills/  # for Hermes');
      console.log('   cp -r skills/* ~/.claude/skills/  # for Claude Code');
      console.log('   cp -r skills/* ~/.config/opencode/skills/  # for Opencode');
      return;
    }
    
    console.log(`Detected ${this.agents.length} agent(s): ${this.agents.map(a => a.name).join(', ')}\n`);
    
    for (const agent of this.agents) {
      console.log(`📦 Installing skills for ${agent.name}...`);
      this.installSkills(agent);
    }
    
    console.log(`\n✅ Installed skills for ${this.agents.length} agent(s)`);
    console.log('\n📋 Next steps:');
    console.log('  • Restart your agent to load new skills');
    console.log('  • Use /enlighten install <repo-url> to install repos');
    console.log('  • Use /enlighten diagnose <url> to analyze repos');
    console.log('\n💡 Tip: Restart your agent to load the new /enlighten command');
  }
}

if (require.main === module) {
  const installer = new PostInstall();
  installer.run();
}

module.exports = { PostInstall };
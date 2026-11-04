#!/usr/bin/env node
/**
 * enlighten-installer: Self-Registering Skill Installer
 * Automatically registers skills in Hermes harness and handles repo skill registration
 */
const fs = require('fs');
const path = require('path');
const os = require('os');

class EnlightInstaller {
  constructor() {
    this.harnessDir = this.detectHarnessDir();
    this.installedSkills = [];
    this.installedRepos = [];
  }

  detectHarnessDir() {
    const hermesDir = path.join(os.homedir(), '.hermes');
    if (fs.existsSync(path.join(os.homedir(), '.hermes'))) {
      return {
        name: 'Hermes',
        skillsDir: path.join(os.homedir(), '.hermes', 'skills'),
        configDir: path.join(os.homedir(), '.hermes'),
        isHermes: true
      };
    }
    
    const claudeHome = process.env.CLAUDE_HOME || path.join(os.homedir(), '.claude');
    if (fs.existsSync(claudeHome)) {
      return {
        name: 'Claude Code',
        skillsDir: path.join(claudeHome, 'skills'),
        configDir: claudeHome,
        isHermes: false
      };
    }
    
    return {
      name: 'Hermes',
      skillsDir: path.join(os.homedir(), '.hermes', 'skills'),
      configDir: path.join(os.homedir(), '.hermes'),
      isHermes: true
    };
  }

  registerSkill(skillName, fromPath) {
    const dest = path.join(this.harnessDir.skills, skillName);
    if (fs.existsSync(dest)) {
      fs.rmSync(dest, { recursive: true });
    }
    fs.cpSync(fromPath, dest, { recursive: true });
    this.installedSkills.push(skillName);
    console.log(`✅ Registered skill: ${skillName}`);
  }

  registerRepoSkill(repoId, skillName) {
    const repoSkillDir = path.join(this.harnessDir.skills, `repo-${repoId.replace(/\//g, '-')}`);
    try {
      fs.mkdirSync(path.dirname(repoSkillDir), { recursive: true });
      fs.cpSync(path.join(this.harnessDir.skills, skillName), repoSkillDir, { recursive: true });
      this.installedRepos.push({ repoId, skillName });
      console.log(`✅ Registered repo skill: ${repoId} -> ${skillName}`);
      return true;
    } catch (err) {
      console.log(`⚠️  Failed to register repo skill: ${repoId} - ${err.message}`);
      return false;
    }
  }

  installSkills() {
    const skills = ['enlighten', 'enlighten-installer', 'enlighten-uninstaller'];
    const projectDir = '/home/furious/Projects/enlighten-agent-tool';
    const skillsDir = this.harnessDir.skills;
    
    fs.mkdirSync(this.harnessDir.skills, { recursive: true });
    
    for (const skill of skills) {
      const src = path.join('/home/furious/Projects/enlighten-agent-tool', 'skills', skill);
      const dest = path.join(this.harnessDir.skills, skill);
      if (fs.existsSync(src)) {
        if (fs.existsSync(dest)) {
          fs.rmSync(dest, { recursive: true });
        }
        fs.cpSync(src, dest, { recursive: true });
        this.installedSkills.push(skill);
        console.log(`✅ Installed skill: ${skill}`);
      }
    }
    
    const commandsDir = path.join('/home/furious/Projects/enlighten-agent-tool', 'commands');
    if (fs.existsSync(commandsDir)) {
      const commandFiles = fs.readdirSync(commandsDir).filter(f => f.endsWith('.md'));
      for (const cmdFile of commandFiles) {
        const cmdName = cmdFile.replace('.md', '');
        const cmdDest = path.join(this.harnessDir.skills, cmdName);
        if (fs.existsSync(dest)) {
          fs.rmSync(dest, { recursive: true });
        }
        fs.cpSync(path.join(commandsDir, cmdFile), path.join(dest, cmdFile));
        console.log(`✅ Installed command: /${cmdName}`);
      }
    }
    
    console.log('
✅ Skills installation complete');
  }
}

function installEnlight() {
  const installer = new EnlightInstaller();
  console.log('
Enlight Installer
');
  console.log(`Harness detected: ${installer.harnessDir.name}
`);
  installer.installSkills();
  console.log('
✅ Skills installation complete');
  console.log('
📋 Next steps:');
  console.log('  • Reload skills in your agent harness');
  console.log('  • /skill-use enlighten (Hermes)');
  console.log('  • Or run: /team-builder to discover skills');
  console.log('
📋 Usage:');
  console.log('  /enlighten install <repo-url>');
  console.log('  /enlighten diagnose <repo-url>');
  console.log('  /enlighten list-installed');
  console.log('  /enlighten uninstall <id>');
}

installEnlight();

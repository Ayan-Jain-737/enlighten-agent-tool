#!/usr/bin/env node
/**
 * enlighten - CLI Helper
 * Displays help information
 */

console.log(`
  ███████╗ ██████╗ ███╗   ██╗██╗███╗   ██╗ ██████╗ 
  ██╔════╝██╔═══██╗████╗  ██║██║████╗  ██║██╔════╝ 
  ███████╗██║   ██║██╔██╗ ██║██║██╔██╗ ██║██║  ███╗
  ╚════██║██║   ██║██║╚██╗██║██║██║╚██╗██║██║   ██║
  ███████║╚██████╔╝██║ ╚████║██║██║ ╚████║╚██████╔╝
  ╚══════╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝╚═╝  ╚═══╝ ╚═════╝ 
  
  A universal GitHub repository installer.
  
  Usage:
    enlighten install <repo-url>    Install a repository
    enlighten uninstall <id>        Remove installation
    enlighten list-installed        Show all installs
    enlighten diagnose <url>        Analyze without installing
    
  Examples:
    enlighten install https://github.com/user/repo
    enlighten diagnose https://github.com/vercel/next.js
    enlighten list-installed
    
  For more info: https://github.com/Ayan-Jain-737/enlighten-agent-tool
`);
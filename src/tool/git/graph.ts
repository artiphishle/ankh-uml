#!/usr/bin/env node
const writeFileSync = require('fs').writeFileSync;
const {execSync} = require('child_process');

// Commands
const GIT_BRANCH = 'git branch';
const GIT_LOG_ONELINE = 'git log --oneline';

// Helpers
const execute = (command: string) => execSync(command).toString().trim();
const pipe = (...commands: string[]) => commands.join(' | ');

const getCurrentBranch = () =>
  execute(pipe(GIT_BRANCH, "grep '*'", "awk '{ print $2 }'"));

const getLogs = (n = 100) =>
  execute(pipe(GIT_LOG_ONELINE, `head -n ${n}`))
    .split('\n')
    .map((log) => log.split(' '));

// 1. Get current branch and logs
const checkout = `checkout ${getCurrentBranch()}`;
const commits = getLogs()
  .map((log) => `commit id: "${log[0]}"`)
  .join('\n');

// 2. Generate mermaid graph
const mermaid = `
# Git Graph\n
\`\`\`mermaid\n
gitGraph\n${checkout}\n${commits}
\`\`\`
`;

writeFileSync('git-graph.md', mermaid, 'utf-8');

process.exit(0);

#!/usr/bin/env node
var writeFileSync = require('fs').writeFileSync;
var execSync = require('child_process').execSync;
// Commands
var GIT_BRANCH = 'git branch';
var GIT_LOG_ONELINE = 'git log --oneline';
// Helpers
var execute = function (command) { return execSync(command).toString().trim(); };
var pipe = function () {
    var commands = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        commands[_i] = arguments[_i];
    }
    return commands.join(' | ');
};
var getCurrentBranch = function () {
    return execute(pipe(GIT_BRANCH, "grep '*'", "awk '{ print $2 }'"));
};
var getLogs = function (n) {
    if (n === void 0) { n = 100; }
    return execute(pipe(GIT_LOG_ONELINE, "head -n ".concat(n)))
        .split('\n')
        .map(function (log) { return log.split(' '); });
};
// 1. Get current branch and logs
var checkout = "checkout ".concat(getCurrentBranch());
var commits = getLogs()
    .map(function (log) { return "commit id: \"".concat(log[0], "\""); })
    .join('\n');
// 2. Generate mermaid graph
var mermaid = "\n# Git Graph\n\n```mermaid\n\ngitGraph\n".concat(checkout, "\n").concat(commits, "\n\n```\n");
writeFileSync('git-graph.md', mermaid, 'utf-8');
process.exit(0);

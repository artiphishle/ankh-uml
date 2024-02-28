#!/usr/bin/env node
const path = require('path');
const {spawn} = require('child_process');
const scriptPath = path.join(__dirname, 'bin', 'uml');
const child = spawn(scriptPath, process.argv.slice(2), {stdio: 'inherit'});

child.on('exit', (code, signal) => {
  if (code !== 0) {
    console.error(`Script execution failed with code ${code}`);
  } else {
    console.log('Script executed successfully');
  }
});

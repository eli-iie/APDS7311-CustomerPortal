// Start Backend Server Script
const { spawn } = require('child_process');
const path = require('path');

console.log('Starting backend server...');

const serverPath = path.join(__dirname, 'server');
const backend = spawn('node', ['index.js'], {
    cwd: serverPath,
    stdio: 'inherit'
});

backend.on('error', (error) => {
    console.error('Failed to start backend server:', error);
});

backend.on('exit', (code) => {
    console.log(`Backend server exited with code ${code}`);
});

console.log('Backend server starting...');

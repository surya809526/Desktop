const express = require('express');
const http = require('http');
const path = require('path');
const pty = require('node-pty');

const app = express();
const server = http.createServer(app);

// Public folder ko static link karna
app.use(express.static(path.join(__dirname, 'public')));

// JSON parse karne ke liye backend config
app.use(express.json());

// Jab frontend se command aayegi, toh use asli shell mein chalane ka logic
let shell = pty.spawn(process.platform === 'win32' ? 'cmd.exe' : 'sh', [], {
    name: 'xterm-color',
    cols: 80,
    rows: 24,
    cwd: process.env.HOME,
    env: process.env
});

// Stream buffer handle karne ke liye route API
app.post('/api/cmd', (req, res) => {
    const { command } = req.body;
    
    if (!command) {
        return res.json({ output: "" });
    }

    let outputBuffer = "";
    
    // Command process execution thread listener
    const dataListener = (data) => {
        outputBuffer += data;
    };

    shell.onData(dataListener);
    shell.write(command + '\n');

    // Chota sa delay taaki processing output return ho sake
    setTimeout(() => {
        shell.offData(dataListener);
        // ANSI escape codes ko clear text mein badalna
        let cleanOutput = outputBuffer.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
        res.json({ output: cleanOutput });
    }, 800);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`HackOS Engine Live on port ${PORT}`);
});

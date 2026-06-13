const express = require('express');
const http = require('http');
const path = require('path');
const pty = require('node-pty');

const app = express();
const server = http.createServer(app);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Asli Background Shell Space Engine (Bade code handles karne ke liye)
let shell = pty.spawn(process.platform === 'win32' ? 'cmd.exe' : 'sh', [], {
    name: 'xterm-color',
    cols: 100, // Thoda bada screen space size
    rows: 30,
    cwd: process.env.HOME,
    env: process.env
});

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// OpenAI Calling Pipeline
async function askOpenAICodex(userPrompt) {
    try {
        if (!OPENAI_API_KEY) {
            return "Engine Error: 'OPENAI_API_KEY' nahi mili bhai.";
        }
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENAI_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-4o",
                messages: [
                    { role: "system", content: "You are OpenAI Codex. Provide only direct clean code as output for terminal UI. No markdown blocks." },
                    { role: "user", content: userPrompt }
                ],
                temperature: 0.2
            })
        });
        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        return "OpenAI Codex Connection Failed.";
    }
}

// Global data stream container
let outputLog = "";
shell.onData((data) => {
    outputLog += data;
});

// Terminal API Router Pipeline
app.post('/api/cmd', async (req, res) => {
    const { command } = req.body;
    
    if (!command) return res.json({ output: "" });

    // 🔥 AI Codex Mode Interceptor
    if (command.toLowerCase().startsWith('ai:')) {
        const aiPrompt = command.substring(3).trim();
        const aiResponse = await askOpenAICodex(aiPrompt);
        return res.json({ output: `\n[OpenAI Codex Engine]:\n${aiResponse}\n` });
    }

    // Heavy Stream Process Writer (Bade codes ka buffer lock clear karne ke liye)
    outputLog = ""; // Purana log clear
    shell.write(command + '\n');

    // Bade programs ko processing time dene ke liye timeout delay structure
    setTimeout(() => {
        // Clean ANSI escape garbage colors text
        let cleanOutput = outputLog.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
        res.json({ output: cleanOutput || "Done." });
    }, 1200); // Increased response time for heavy scripts
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`HackOS Heavy Engine Live with Stable Node-PTY Layer`);
});

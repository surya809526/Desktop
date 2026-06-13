const express = require('express');
const http = require('http');
const path = require('path');
const pty = require('node-pty');

const app = express();
const server = http.createServer(app);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Asli System Shell Config (CMD/Terminal framework)
let shell = pty.spawn(process.platform === 'win32' ? 'cmd.exe' : 'sh', [], {
    name: 'xterm-color',
    cols: 80,
    rows: 24,
    cwd: process.env.HOME,
    env: process.env
});

// 🔥 FIXED: Ab ye direct Render ke Environment Variables se key uthayega safely
const GROQ_API_KEY = process.env.GROQ_API_KEY;

// Groq AI Request Router Engine
async function askGroqAI(userPrompt) {
    try {
        // Agar Render pe variable ka naam alag hai toh handle karne ke liye check block
        if (!GROQ_API_KEY) {
            return "Engine Configuration Error: 'GROQ_API_KEY' not found in Render Environment Variables.";
        }

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "qwen-2.5-coder-32b", // Ultra-fast professional coding engine
                messages: [
                    { role: "system", content: "You are HackOS Codex AI. Provide only direct code or short programming answers as output for a terminal UI." },
                    { role: "user", content: userPrompt }
                ],
                temperature: 0.3
            })
        });
        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        return "Groq AI Cloud Engine Error: Connection failed.";
    }
}

// Terminal API Route Pipeline
app.post('/api/cmd', async (req, res) => {
    const { command } = req.body;
    
    if (!command) {
        return res.json({ output: "" });
    }

    // AI Codex Mode Core Engine Interceptor
    if (command.toLowerCase().startsWith('ai:')) {
        const aiPrompt = command.substring(3).trim();
        const aiResponse = await askGroqAI(aiPrompt);
        return res.json({ output: `\n[HackOS Codex AI Engine]:\n${aiResponse}\n` });
    }

    // Normal Linux/Shell core pipeline process
    let outputBuffer = "";
    const dataListener = (data) => { outputBuffer += data; };

    shell.onData(dataListener);
    shell.write(command + '\n');

    setTimeout(() => {
        shell.offData(dataListener);
        let cleanOutput = outputBuffer.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
        res.json({ output: cleanOutput });
    }, 800);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`HackOS Engine Active with Secure Environment Config`);
});

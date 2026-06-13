const express = require('express');
const http = require('http');
const path = require('path');
const { exec } = require('child_process');

const app = express();
const server = http.createServer(app);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Asli OpenAI Key Render Dashboard se uthane ke liye
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Asli OpenAI Engine Calling Function
async function askOpenAICodex(userPrompt) {
    try {
        if (!OPENAI_API_KEY) {
            return "Engine Error: 'OPENAI_API_KEY' environment variable mein nahi mili bhai.";
        }

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENAI_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-4o", // Asli OpenAI replacement code-builder engine
                messages: [
                    { role: "system", content: "You are OpenAI Codex. Provide only direct clean code as output for terminal UI. No explanations." },
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

// Route API Pipeline
app.post('/api/cmd', async (req, res) => {
    const { command } = req.body;
    
    if (!command) return res.json({ output: "" });

    // 🔥 AI Mode Interceptor
    if (command.toLowerCase().startsWith('ai:')) {
        const aiPrompt = command.substring(3).trim();
        const aiResponse = await askOpenAICodex(aiPrompt);
        return res.json({ output: `\n[OpenAI Codex Engine]:\n${aiResponse}\n` });
    }

    // Normal system tools (ls, npm -v)
    exec(command, { cwd: process.env.HOME }, (error, stdout, stderr) => {
        let output = "";
        if (stdout) output += stdout;
        if (stderr) output += stderr;
        res.json({ output: output || "Done." });
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => { console.log(`Asli OpenAI Codex Engine Live.`); });

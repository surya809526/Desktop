const express = require('express');
const http = require('http');
const path = require('path');
const { exec } = require('child_process');

const app = express();
const server = http.createServer(app);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const GROQ_API_KEY = process.env.GROQ_API_KEY;

// Groq AI Request Router
async function askGroqAI(userPrompt) {
    try {
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
                model: "qwen-2.5-coder-32b",
                messages: [
                    { role: "system", content: "You are HackOS Codex AI. Provide only direct code or short programming answers as output for a terminal UI. Do not write introductory prose." },
                    { role: "user", content: userPrompt }
                ],
                temperature: 0.2
            })
        });
        
        const data = await response.json();
        if (data.choices && data.choices[0]) {
            return data.choices[0].message.content;
        } else {
            return "Groq AI Engine Error: Invalid response from API key.";
        }
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

    // Lightweight & Stable Shell Execution Engine for Render
    exec(command, { cwd: process.env.HOME }, (error, stdout, stderr) => {
        let output = "";
        if (stdout) output += stdout;
        if (stderr) output += stderr;
        if (error && !stdout && !stderr) output += `Error: ${error.message}`;
        
        // Output clean response framework
        res.json({ output: output || "Command executed successfully with no output." });
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`HackOS Engine Active with Lightweight execution pipeline.`);
});

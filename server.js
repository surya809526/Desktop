const express = require('express');
const http = require('http');
const path = require('path');
const { exec } = require('child_process');

const app = express();
const server = http.createServer(app);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Render ke Environment Variables se key uthane ke liye
const GROQ_API_KEY = process.env.GROQ_API_KEY;

// Groq AI Request Function
async function askGroqAI(userPrompt) {
    try {
        if (!GROQ_API_KEY) {
            return "Engine Error: 'GROQ_API_KEY' environment variable mein nahi mili bhai. Dashboard check karo.";
        }

        // Groq API Call Standard Endpoints
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "qwen-2.5-coder-32b", // World's best open-source coding model
                messages: [
                    { 
                        role: "system", 
                        content: "You are HackOS Codex AI. Provide ONLY clean, direct code or terminal commands as output. No chat, no explanations, no markdown code blocks like ```. Just raw text code." 
                    },
                    { role: "user", content: userPrompt }
                ],
                temperature: 0.2
            })
        });
        
        const data = await response.json();
        
        // Response check block
        if (data.choices && data.choices[0]) {
            return data.choices[0].message.content;
        } else if (data.error) {
            return `Groq API Error: ${data.error.message}`;
        } else {
            return "Engine Error: API se sahi response nahi aaya.";
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

    // 🔥 AI Codex Mode Interceptor
    if (command.toLowerCase().startsWith('ai:')) {
        const aiPrompt = command.substring(3).trim();
        const aiResponse = await askGroqAI(aiPrompt);
        return res.json({ output: `\n[HackOS Codex AI Engine]:\n${aiResponse}\n` });
    }

    // Normal Linux/Shell Commands Pipeline (ls, npm -v, pwd)
    exec(command, { cwd: process.env.HOME }, (error, stdout, stderr) => {
        let output = "";
        if (stdout) output += stdout;
        if (stderr) output += stderr;
        if (error && !stdout && !stderr) output += `Error: ${error.message}`;
        
        res.json({ output: output || "Command executed successfully with no output." });
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`HackOS Light Engine Live with Codex AI Support`);
});

const express = require('express');
const http = require('http');
const path = require('path');
const { exec } = require('child_process');

const app = express();
const server = http.createServer(app);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const GROQ_API_KEY = process.env.GROQ_API_KEY;

async function askGroqAI(userPrompt) {
    try {
        if (!GROQ_API_KEY) {
            return "Engine Error: 'GROQ_API_KEY' variable nahi mila bhai.";
        }

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-specdec", // FIXED: Groq ka naya active super-fast model
                messages: [
                    { 
                        role: "system", 
                        content: "You are HackOS Codex AI. Provide ONLY clean, direct code or terminal commands as output. No chat, no explanations. Just raw text code." 
                    },
                    { role: "user", content: userPrompt }
                ],
                temperature: 0.2
            })
        });
        
        const data = await response.json();
        
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

app.post('/api/cmd', async (req, res) => {
    const { command } = req.body;
    
    if (!command) {
        return res.json({ output: "" });
    }

    if (command.toLowerCase().startsWith('ai:')) {
        const aiPrompt = command.substring(3).trim();
        const aiResponse = await askGroqAI(aiPrompt);
        return res.json({ output: `\n[HackOS Codex AI Engine]:\n${aiResponse}\n` });
    }

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
    console.log(`HackOS Engine Active with New Llama Model`);
});

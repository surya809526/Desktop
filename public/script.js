const cmdInput = document.getElementById('cmdInput');
const output = document.getElementById('output');
const terminalBody = document.getElementById('terminalBody');

let isSolitaireMode = false;

window.triggerMobileKey = function(key) {
    if (isSolitaireMode) return;
    cmdInput.value = key === 'w' ? 'solitaire' : key === 'a' ? 'clear' : 'ls';
    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    cmdInput.dispatchEvent(enterEvent);
};

cmdInput.addEventListener('keydown', async function(e) {
    if (e.key === 'Enter') {
        const command = cmdInput.value.trim();
        cmdInput.value = '';

        if (!command) return;
        const lowerCmd = command.toLowerCase();

        if (lowerCmd === 'clear') {
            output.innerHTML = '$ ';
            return;
        }

        // 🃏 GRAPHICAL SPIDER SOLITAIRE MODE TRIGGER
        if (lowerCmd === 'solitaire' || lowerCmd === 'cards') {
            isSolitaireMode = true;
            document.body.classList.add('solitaire-active');
            
            // Terminal Window ke andar ek asli graphical game inject karna
            output.innerHTML = `
                <div style="width: 100%; height: 100%; min-height: 450px; background-color: #0f5132; border-radius: 6px; padding: 10px; box-sizing: border-box; font-family: sans-serif; position: relative;">
                    <div style="display: flex; justify-content: space-between; color: white; font-size: 14px; margin-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 5px;">
                        <span>🟢 Microsoft Spider Solitaire Live</span>
                        <button onclick="location.reload()" style="background: #ffbd2e; border: none; padding: 2px 8px; border-radius: 4px; color: black; font-weight: bold; cursor: pointer;">🔄 Restart Game</button>
                    </div>
                    
                    <!-- Exact Iframe Injection of Fully Working Solitaire Game -->
                    <iframe src="https://solitaired.com/g/spider-solitaire-1-suit?embed=true" 
                            style="width: 100%; height: 400px; border: none; border-radius: 4px; background: white;">
                    </iframe>
                    
                    <div style="color: #aaa; font-size: 11px; margin-top: 5px; text-align: center;">
                        💡 Tip: Apne phone ko Landscape mode mein ghumayein aur cards par touch karke khelega!
                    </div>
                </div>
            `;
            
            cmdInput.placeholder = "Game running locally...";
            cmdInput.disabled = true; // Block input while playing graphical game
            terminalBody.scrollTop = terminalBody.scrollHeight;
            return;
        }

        // Normal simulator options
        output.innerHTML += command + '\n';
        if (lowerCmd === 'ls') output.innerHTML += "index.html  script.js  style.css  spider_solitaire.app\n\n$ ";
        else output.innerHTML += "Command executed successfully.\n\n$ ";
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }
});

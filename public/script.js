const cmdInput = document.getElementById('cmdInput');
const output = document.getElementById('output');
const terminalBody = document.getElementById('terminalBody');

let isSolitaireMode = false;
let solitaireDeck = [];
let columns = [[], [], [], [], [], [], []];

window.triggerMobileKey = function(key) {
    if (isSolitaireMode) return; // Solitaire text inputs standard framework overrides
    cmdInput.value = key === 'w' ? 'solitaire' : key === 'a' ? 'clear' : 'ls';
    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    cmdInput.dispatchEvent(enterEvent);
};

// Card Engine Deck Builders
function initSolitaire() {
    const suits = ['H', 'D', 'C', 'S']; // Hearts (Red), Diamonds (Red), Clubs (Black), Spades (Black)
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    solitaireDeck = [];
    
    for (let s of suits) {
        for (let v of values) {
            solitaireDeck.push({ value: v, suit: s, isRed: (s==='H' || s==='D') });
        }
    }
    // Random Shuffler Arrays
    solitaireDeck.sort(() => Math.random() - 0.5);

    // Deal to 7 Columns Grid Structure
    columns = [[], [], [], [], [], [], []];
    for (let i = 0; i < 7; i++) {
        for (let j = i; j < 7; j++) {
            columns[j].push(solitaireDeck.pop());
        }
    }
}

function renderSolitaireBoard() {
    let board = "\n=== HACKOS TERMINAL SOLITAIRE (LANDSCAPE MODE) ===\n";
    board += "Rules: Move cards using format: 'move [source_col] [dest_col]' (e.g., move 1 2)\n";
    board += "Type 'exit' to close game.\n\n";
    board += " COL 1   COL 2   COL 3   COL 4   COL 5   COL 6   COL 7\n";
    board += "=========================================================\n";

    // Max length identifier
    let maxRows = Math.max(...columns.map(c => c.length));
    
    for (let r = 0; r < maxRows; r++) {
        let line = "";
        for (let c = 0; c < 7; c++) {
            if (columns[c] && columns[c][r]) {
                let card = columns[c][r];
                let cardStr = `[${card.value}${card.suit}]`;
                line += cardStr.padEnd(8, ' ');
            } else {
                line += "        ";
            }
        }
        board += line + "\n";
    }
    return board + "\n$ ";
}

cmdInput.addEventListener('keydown', async function(e) {
    if (e.key === 'Enter') {
        const command = cmdInput.value.trim();
        cmdInput.value = '';

        if (!command && !isSolitaireMode) return;
        const lowerCmd = command.toLowerCase();

        // 🃏 SOLITAIRE ENGINE CONTROLLERS
        if (isSolitaireMode) {
            output.textContent += command + '\n';
            
            if (lowerCmd === 'exit') {
                isSolitaireMode = false;
                document.body.classList.remove('solitaire-active');
                output.textContent += "Game ended.\n\n$ ";
                cmdInput.placeholder = "Type command...";
                return;
            }

            if (lowerCmd.startsWith('move')) {
                const parts = lowerCmd.split(' ');
                const fromCol = parseInt(parts[1]) - 1;
                const toCol = parseInt(parts[2]) - 1;

                if (columns[fromCol] && columns[toCol] && columns[fromCol].length > 0) {
                    // Pull top active card
                    let cardToMove = columns[fromCol][columns[fromCol].length - 1];
                    columns[toCol].push(columns[fromCol].pop());
                    
                    // Clear and rewrite game view frames
                    const lines = output.textContent.split('\n');
                    output.textContent = lines.slice(0, -25).join('\n'); // Wipe old grid
                    output.textContent += renderSolitaireBoard();
                } else {
                    output.textContent += "⚠️ Invalid move command parameters format.\n$ ";
                }
            } else {
                output.textContent += "Unknown game script action. Use: 'move 1 2'\n$ ";
            }
            terminalBody.scrollTop = terminalBody.scrollHeight;
            return;
        }

        // NORMAL UTILITIES ROUTERS
        output.textContent += command + '\n';

        if (lowerCmd === 'clear') { output.textContent = '$ '; return; }
        
        if (lowerCmd === 'solitaire' || lowerCmd === 'cards') {
            isSolitaireMode = true;
            document.body.classList.add('solitaire-active');
            initSolitaire();
            output.textContent += renderSolitaireBoard();
            cmdInput.placeholder = "e.g., move 1 2";
            terminalBody.scrollTop = terminalBody.scrollHeight;
            return;
        }

        if (lowerCmd === 'ls') output.textContent += "index.html  script.js  style.css  solitaire.sys\n\n$ ";
        else output.textContent += "Command processed.\n\n$ ";
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }
});

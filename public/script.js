const cmdInput = document.getElementById('cmdInput');
const output = document.getElementById('output');
const terminalBody = document.getElementById('terminalBody');

let isSolitaireMode = false;
let solitaireDeck = [];
let columns = [[], [], [], [], [], [], []];

// 🔄 Centralized Reset and Start Engine for Solitaire
function startFreshSolitaire() {
    initSolitaire();
    // Purana saara text mita kar ekdum fresh board print karna
    output.textContent = '$ solitaire\n' + renderSolitaireBoard();
    cmdInput.placeholder = "e.g., move 1 2";
    terminalBody.scrollTop = terminalBody.scrollHeight;
}

// Mobile touch button clicks handler
window.triggerMobileKey = function(key) {
    if (isSolitaireMode) {
        // Agar game chal raha hai aur user ne 🔄 daba diya
        if (key === 'r') {
            startFreshSolitaire();
        }
        return; 
    }
    cmdInput.value = key === 'w' ? 'solitaire' : key === 'a' ? 'clear' : 'ls';
    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    cmdInput.dispatchEvent(enterEvent);
};

// Card Engine Setup
function initSolitaire() {
    const suits = [
        { icon: '♥️', name: 'H', isRed: true }, 
        { icon: '♦️', name: 'D', isRed: true }, 
        { icon: '♣️', name: 'C', isRed: false }, 
        { icon: '♠️', name: 'S', isRed: false }  
    ];
    
    const values = ['Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King'];
    solitaireDeck = [];
    
    for (let s of suits) {
        for (let v of values) {
            solitaireDeck.push({ value: v, suitIcon: s.icon, isRed: s.isRed });
        }
    }
    
    // Shuffle cards
    solitaireDeck.sort(() => Math.random() - 0.5);

    // Distribute to 7 Columns
    columns = [[], [], [], [], [], [], []];
    for (let i = 0; i < 7; i++) {
        for (let j = i; j < 7; j++) {
            columns[j].push(solitaireDeck.pop());
        }
    }
}

function renderSolitaireBoard() {
    let board = "\n================= HACKOS LIVE SOLITAIRE =================";
    board += "\n👉 Command Rules: 'move [source] [destination]' (e.g., move 1 2)";
    board += "\n👉 Restart Game: Type 'restart' or Touch 🔄 Button";
    board += "\n👉 Close Game: Type 'exit'\n";
    board += "\n  COL 1       COL 2       COL 3       COL 4       COL 5       COL 6       COL 7";
    board += "\n=================================================================================\n";

    let maxRows = maxRowsCount();
    
    for (let r = 0; r < maxRows; r++) {
        let line = " ";
        for (let c = 0; c < 7; c++) {
            if (columns[c] && columns[c][r]) {
                let card = columns[c][r];
                let displayStr = `${card.value}${card.suitIcon}`;
                line += displayStr.padEnd(12, ' ');
            } else {
                line += "            "; 
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

        // GAME CONTROLLER BLOCK INTERCEPTOR
        if (isSolitaireMode) {
            output.textContent += command + '\n';
            
            if (lowerCmd === 'exit') {
                isSolitaireMode = false;
                document.body.classList.remove('solitaire-active');
                output.textContent += "Solitaire application terminated.\n\n$ ";
                cmdInput.placeholder = "Type command...";
                return;
            }

            // 🔄 Text-based restart command interceptor
            if (lowerCmd === 'restart') {
                startFreshSolitaire();
                return;
            }

            if (lowerCmd.startsWith('move')) {
                const parts = lowerCmd.split(' ');
                const fromCol = parseInt(parts[1]) - 1;
                const toCol = parseInt(parts[2]) - 1;

                if (columns[fromCol] && columns[toCol] && columns[fromCol].length > 0) {
                    columns[toCol].push(columns[fromCol].pop());
                    
                    // Clear and refresh board view seamlessly
                    const lines = output.textContent.split('\n');
                    output.textContent = lines.slice(0, - (maxRowsCount() + 9)).join('\n'); 
                    output.textContent += renderSolitaireBoard();
                } else {
                    output.textContent += "⚠️ Invalid column move action syntax!\n$ ";
                }
            } else {
                output.textContent += "⚠️ Unknown syntax. Use: move 1 2, restart, or exit\n$ ";
            }
            terminalBody.scrollTop = terminalBody.scrollHeight;
            return;
        }

        // NORMAL UTILITIES SHELL MODE
        output.textContent += command + '\n';
        if (lowerCmd === 'clear') { output.textContent = '$ '; return; }
        
        if (lowerCmd === 'solitaire' || lowerCmd === 'cards') {
            isSolitaireMode = true;
            document.body.classList.add('solitaire-active');
            startFreshSolitaire();
            return;
        }

        if (lowerCmd === 'ls') output.textContent += "index.html  script.js  style.css  solitaire.sys\n\n$ ";
        else output.textContent += "Command processed.\n\n$ ";
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }
});

function maxRowsCount() {
    return Math.max(...columns.map(c => c.length));
}

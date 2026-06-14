const cmdInput = document.getElementById('cmdInput');
const output = document.getElementById('output');
const terminalBody = document.getElementById('terminalBody');

let isSolitaireMode = false;
let spiderDeck = [];
let columns = [[], [], [], [], [], [], [], [], [], []]; 
let score = 450;
let completedSets = 0;

window.triggerMobileKey = function(key) {
    if (isSolitaireMode) {
        if (key === 'r') startFreshSpider();
        return; 
    }
    cmdInput.value = key === 'w' ? 'solitaire' : key === 'a' ? 'clear' : 'ls';
    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    cmdInput.dispatchEvent(enterEvent);
};

function startFreshSpider() {
    initSpiderSolitaire();
    renderGameToTerminal();
}

function initSpiderSolitaire() {
    const suitIcon = '♠️';
    const values = ['Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King'];
    
    spiderDeck = [];
    for (let deckCount = 0; deckCount < 2; deckCount++) {
        for (let v of values) {
            spiderDeck.push({ value: v, icon: suitIcon });
        }
    }
    
    spiderDeck.sort(() => Math.random() - 0.5);

    columns = [[], [], [], [], [], [], [], [], [], []];
    for (let i = 0; i < 54; i++) {
        let colIndex = i % 10;
        columns[colIndex].push(spiderDeck.pop());
    }
    score = 450;
    completedSets = 0;
}

function renderSpiderBoard() {
    let board = "====================== HACKOS SPIDER SOLITAIRE PRO ======================";
    board += `\n📊 Score: ${score}  |  🏆 Completed Sets: ${completedSets}/8  |  🔄 Touch 🔄 to Restart`;
    board += "\n👉 Move Rules: 'move [source_col] [dest_col]' (e.g., move 1 6)";
    board += "\n=========================================================================\n";
    board += " C1   C2   C3   C4   C5   C6   C7   C8   C9   C10\n";
    board += "-------------------------------------------------------------------------\n";

    let maxRows = Math.max(...columns.map(c => c.length), 1);
    const shortLabel = { 'Ace': 'A', 'Jack': 'J', 'Queen': 'Q', 'King': 'K' };

    for (let r = 0; r < maxRows; r++) {
        let line = "";
        for (let c = 0; c < 10; c++) {
            if (columns[c] && columns[c][r]) {
                let card = columns[c][r];
                let valStr = shortLabel[card.value] || card.value;
                let displayStr = `[${valStr}${card.icon}]`;
                line += displayStr.padEnd(7, ' ');
            } else {
                line += "       "; 
            }
        }
        board += line + "\n";
    }
    return board + "\n$ ";
}

// Full terminal layout rewrite renderer to completely bypass cache slice issues
function renderGameToTerminal() {
    output.textContent = renderSpiderBoard();
    cmdInput.placeholder = "e.g., move 1 2";
    terminalBody.scrollTop = terminalBody.scrollHeight;
}

function checkAndRemoveCompletedSets(colIdx) {
    let col = columns[colIdx];
    if (col.length < 13) return;

    const order = ['Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King'];
    let match = true;
    let startIndex = col.length - 13;
    
    for (let i = 0; i < 13; i++) {
        if (col[startIndex + i].value !== order[i]) {
            match = false;
            break;
        }
    }

    if (match) {
        columns[colIdx].splice(startIndex, 13);
        completedSets++;
        score += 100;
    }
}

cmdInput.addEventListener('keydown', async function(e) {
    if (e.key === 'Enter') {
        const command = cmdInput.value.trim();
        cmdInput.value = '';

        if (!command && !isSolitaireMode) return;
        const lowerCmd = command.toLowerCase();

        if (isSolitaireMode) {
            if (lowerCmd === 'exit') {
                isSolitaireMode = false;
                document.body.classList.remove('solitaire-active');
                output.textContent = "Game exited.\n\n$ ";
                cmdInput.placeholder = "Type command...";
                return;
            }

            if (lowerCmd === 'restart') {
                startFreshSpider();
                return;
            }

            if (lowerCmd.startsWith('move')) {
                const parts = lowerCmd.split(' ');
                const fromCol = parseInt(parts[1]) - 1;
                const toCol = parseInt(parts[2]) - 1;

                if (fromCol >= 0 && fromCol < 10 && toCol >= 0 && toCol < 10) {
                    if (columns[fromCol].length === 0) {
                        alert("Column khali hai bhai!");
                        return;
                    }

                    let movingCard = columns[fromCol][columns[fromCol].length - 1];
                    let targetCol = columns[toCol];
                    let canMove = false;
                    
                    if (targetCol.length === 0) {
                        canMove = true;
                    } else {
                        let targetCard = targetCol[targetCol.length - 1];
                        const order = ['Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King'];
                        let movingRank = order.indexOf(movingCard.value);
                        let targetRank = order.indexOf(targetCard.value);
                        
                        if (targetRank === movingRank + 1) {
                            canMove = true;
                        }
                    }

                    if (canMove) {
                        columns[toCol].push(columns[fromCol].pop());
                        score--;
                        checkAndRemoveCompletedSets(toCol);
                        
                        // 🔥 FIXED: Direct full refresh screen call to avoid line chopping bug
                        renderGameToTerminal();
                    } else {
                        let targetCard = targetCol[targetCol.length - 1];
                        alert(`Rule Error: ${movingCard.value} ko ${targetCard.value} ke neeche nahi rakh sakte bhai!`);
                    }
                } else {
                    alert("Galat column number! 1 se 10 tak hi choose karo.");
                }
                return;
            }
            return;
        }

        output.textContent += command + '\n';
        if (lowerCmd === 'clear') { output.textContent = '$ '; return; }
        
        if (lowerCmd === 'solitaire' || lowerCmd === 'cards') {
            isSolitaireMode = true;
            document.body.classList.add('solitaire-active');
            startFreshSpider();
            return;
        }

        if (lowerCmd === 'ls') output.textContent += "index.html  script.js  style.css  spider_core.sys\n\n$ ";
        else output.textContent += "Command processed.\n\n$ ";
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }
});

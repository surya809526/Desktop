const cmdInput = document.getElementById('cmdInput');
const output = document.getElementById('output');
const terminalBody = document.getElementById('terminalBody');

let isSolitaireMode = false;
let spiderDeck = [];
// Photo ke mutabik exact 10 columns framework setup
let columns = [[], [], [], [], [], [], [], [], [], []]; 
let score = 0;
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
    output.textContent = '$ solitaire\n' + renderSpiderBoard();
    cmdInput.placeholder = "e.g., move 1 2";
    terminalBody.scrollTop = terminalBody.scrollHeight;
}

// 🃏 Spider Deck Creator & Dealer Logic
function initSpiderSolitaire() {
    // Screenshot ke mutabik standard pure Spades (♠️) theme framework logic
    const suitIcon = '♠️';
    const values = ['Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King'];
    
    spiderDeck = [];
    // Spider Solitaire mein 2 full decks (104 cards) use hote hain
    for (let deckCount = 0; deckCount < 2; deckCount++) {
        for (let v of values) {
            spiderDeck.push({ value: v, icon: suitIcon });
        }
    }
    
    // Solid Random Shuffler
    spiderDeck.sort(() => Math.random() - 0.5);

    // Initial Dealing: Photo ki tarah exact 10 columns mein distribute karna
    columns = [[], [], [], [], [], [], [], [], [], []];
    // Pehle 4 columns mein 6 cards, baaki 6 columns mein 5 cards
    for (let i = 0; i < 54; i++) {
        let colIndex = i % 10;
        columns[colIndex].push(spiderDeck.pop());
    }
    score = 450; // Screenshot wale exact default deployment score matching
    completedSets = 0;
}

function renderSpiderBoard() {
    let board = "\n====================== HACKOS SPIDER SOLITAIRE PRO ======================";
    board += `\n📊 Score: ${score}  |  🏆 Completed Sets: ${completedSets}/8  |  🔄 Touch 🔄 to Restart`;
    board += "\n👉 Move Rules: 'move [source_col] [dest_col]' (e.g., move 1 6)";
    board += "\n=========================================================================\n";
    board += " C1   C2   C3   C4   C5   C6   C7   C8   C9   C10\n";
    board += "-------------------------------------------------------------------------\n";

    let maxRows = Math.max(...columns.map(c => c.length));
    
    // Short labels array mapper to make everything perfectly balanced on horizontal space
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

// Sequence matching algorithm logic ($K \rightarrow A$)
function checkAndRemoveCompletedSets(colIdx) {
    let col = columns[colIdx];
    if (col.length < 13) return;

    const order = ['Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King'];
    
    // Last 13 cards verify pipeline
    let match = true;
    let startIndex = col.length - 13;
    
    for (let i = 0; i < 13; i++) {
        if (col[startIndex + i].value !== order[i]) {
            match = false;
            break;
        }
    }

    if (match) {
        // Remove completed set from column execution stack
        columns[colIdx].splice(startIndex, 13);
        completedSets++;
        score += 100;
        output.textContent += `\n🎉 Amazing! Tumne King 👑 se Ace 🃏 tak ek poori sequence complete kar li!\n`;
    }
}

cmdInput.addEventListener('keydown', async function(e) {
    if (e.key === 'Enter') {
        const command = cmdInput.value.trim();
        cmdInput.value = '';

        if (!command && !isSolitaireMode) return;
        const lowerCmd = command.toLowerCase();

        if (isSolitaireMode) {
            output.textContent += command + '\n';
            
            if (lowerCmd === 'exit') {
                isSolitaireMode = false;
                document.body.classList.remove('solitaire-active');
                output.textContent += "Game exited.\n\n$ ";
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

                if (fromCol >= 0 && fromCol < 10 && toCol >= 0 && toCol < 10 && columns[fromCol].length > 0) {
                    // Pull top target element
                    let movingCard = columns[fromCol][columns[fromCol].length - 1];
                    
                    // Spider Rule Check: Any card can move to empty column or on a card with +1 rank value
                    let targetCol = columns[toCol];
                    let canMove = true;
                    
                    if (targetCol.length > 0) {
                        let targetCard = targetCol[targetCol.length - 1];
                        const order = ['Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King'];
                        let movingRank = order.indexOf(movingCard.value);
                        let targetRank = order.indexOf(targetCard.value);
                        
                        // Rule check: Target card ki value moving card se exact 1 badi honi chahiye (e.g. 9 moves to 10)
                        if (targetRank !== movingRank + 1) {
                            canMove = false;
                        }
                    }

                    if (canMove) {
                        columns[toCol].push(columns[fromCol].pop());
                        score--; // Every valid shift reduces point count by 1 in classic rules
                        
                        // Check if a stack got fully completed
                        checkAndRemoveCompletedSets(toCol);

                        // Clear and render fresh frame
                        const lines = output.textContent.split('\n');
                        output.textContent = lines.slice(0, -(maxRowsCount() + 10)).join('\n'); 
                        output.textContent += renderSpiderBoard();
                    } else {
                        output.textContent += "⚠️ Invalid Spider Rule! Choti value hi badi value ke niche ja sakti hai (e.g. 8 can go under 9).\n$ ";
                    }
                } else {
                    output.textContent += "⚠️ Column empty hai ya command parameters format galat hai.\n$ ";
                }
            } else {
                output.textContent += "⚠️ Command syntax mismatch. Use: move 1 10\n$ ";
            }
            terminalBody.scrollTop = terminalBody.scrollHeight;
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

function maxRowsCount() {
    return Math.max(...columns.map(c => c.length), 1);
}

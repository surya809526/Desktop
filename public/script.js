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

        if (lowerCmd === 'solitaire' || lowerCmd === 'cards') {
            isSolitaireMode = true;
            document.body.classList.add('solitaire-active');
            
            // Injecting 100% local canvas-free HTML5 Solitaire board
            output.innerHTML = `
                <div id="gameTable" style="width: 100%; min-height: 480px; background-color: #125a36; border-radius: 8px; padding: 10px; box-sizing: border-box; font-family: Arial, sans-serif;">
                    <div style="display: flex; justify-content: space-between; color: white; font-weight: bold; font-size: 14px; margin-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 5px;">
                        <span>🎮 HackOS Local Spider (1-Suit Easy)</span>
                        <button onclick="initLocalSpider()" style="background: #ffbd2e; border: none; padding: 4px 10px; border-radius: 4px; color: black; font-weight: bold; cursor: pointer;">🔄 Reset Board</button>
                    </div>
                    
                    <!-- 10 Columns Grid Setup -->
                    <div id="spiderColumns" style="display: grid; grid-template-columns: repeat(10, 1fr); gap: 4px; width: 100%;">
                        <!-- Dynamic Columns handle by JS -->
                    </div>
                </div>
            `;
            
            cmdInput.placeholder = "Game Window Active...";
            cmdInput.disabled = true;
            
            // Load Game Engine
            setTimeout(initLocalSpider, 100);
            return;
        }

        output.innerHTML += command + '\n';
        if (lowerCmd === 'ls') output.innerHTML += "index.html  script.js  style.css\n\n$ ";
        else output.innerHTML += "Command processed.\n\n$ ";
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }
});

// 🃏 Local Engine Framework
let localDeck = [];
let localCols = [[], [], [], [], [], [], [], [], [], []];
let selectedSrcCol = null;

function initLocalSpider() {
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    localDeck = [];
    selectedSrcCol = null;
    
    // Create cards (Spades ♠️)
    for (let d = 0; d < 4; d++) {
        for (let v of values) {
            localDeck.push({ value: v, suit: '♠️' });
        }
    }
    
    // Shuffle
    localDeck.sort(() => Math.random() - 0.5);
    
    // Deal 40 cards to 10 columns
    localCols = [[], [], [], [], [], [], [], [], [], []];
    for (let i = 0; i < 40; i++) {
        localCols[i % 10].push(localDeck.pop());
    }
    
    renderLocalBoard();
}

function renderLocalBoard() {
    const container = document.getElementById('spiderColumns');
    if (!container) return;
    container.innerHTML = '';
    
    const valuesOrder = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    
    for (let c = 0; c < 10; c++) {
        let colDiv = document.createElement('div');
        colDiv.style.cssText = "display: flex; flex-direction: column; min-height: 350px; background: rgba(0,0,0,0.15); border-radius: 4px; padding: 2px; border: 1px dashed rgba(255,255,255,0.1); cursor: pointer;";
        
        // Target highlighters
        if (selectedSrcCol === c) {
            colDiv.style.border = "1px solid #ffbd2e";
            colDiv.style.background = "rgba(255, 189, 46, 0.1)";
        }
        
        // Touch to tap move action framework
        colDiv.onclick = function() {
            handleColumnClick(c);
        };
        
        let colCards = localCols[c];
        colCards.forEach((card, r) => {
            let cardDiv = document.createElement('div');
            cardDiv.style.cssText = "background: white; color: black; border-radius: 4px; padding: 6px 2px; text-align: center; font-weight: bold; font-size: 12px; margin-bottom: -25px; box-shadow: 0 2px 4px rgba(0,0,0,0.3); border: 1px solid #ccc; user-select: none;";
            
            // Core Spades Theme Custom Highlight
            cardDiv.innerHTML = `${card.value}<br><span style="font-size:10px;">${card.suit}</span>`;
            colDiv.appendChild(cardDiv);
        });
        
        container.appendChild(colDiv);
    }
}

function handleColumnClick(colIdx) {
    const valuesOrder = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    
    if (selectedSrcCol === null) {
        // Select source
        if (localCols[colIdx].length > 0) {
            selectedSrcCol = colIdx;
        }
    } else {
        // Destination logic
        if (selectedSrcCol === colIdx) {
            selectedSrcCol = null; // Deselect if tapped again
        } else {
            let srcCol = localCols[selectedSrcCol];
            let destCol = localCols[colIdx];
            let movingCard = srcCol[srcCol.length - 1];
            
            let isValid = false;
            if (destCol.length === 0) {
                isValid = true;
            } else {
                let targetCard = destCol[destCol.length - 1];
                let movingRank = valuesOrder.indexOf(movingCard.value);
                let targetRank = valuesOrder.indexOf(targetCard.value);
                
                // Spider Rule: Moving rank must be exactly 1 below target rank
                if (targetRank === movingRank + 1) {
                    isValid = true;
                }
            }
            
            if (isValid) {
                destCol.push(srcCol.pop());
            }
            selectedSrcCol = null;
        }
    }
    renderLocalBoard();
                                   }

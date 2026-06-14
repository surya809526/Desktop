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
            
            output.innerHTML = `
                <div id="gameTable" style="width: 100%; min-height: 500px; background-color: #125a36; border-radius: 8px; padding: 10px; box-sizing: border-box; font-family: Arial, sans-serif; overflow-x: auto;">
                    <div style="display: flex; justify-content: space-between; color: white; font-weight: bold; font-size: 14px; margin-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 5px;">
                        <span>🎮 HackOS Drag & Drop Spider Solitaire</span>
                        <button onclick="initLocalSpider()" style="background: #ffbd2e; border: none; padding: 4px 10px; border-radius: 4px; color: black; font-weight: bold; cursor: pointer;">🔄 Reset Board</button>
                    </div>
                    
                    <div id="spiderColumns" style="display: grid; grid-template-columns: repeat(10, 1fr); gap: 6px; width: 100%; min-width: 600px;">
                        <!-- Columns via JS -->
                    </div>
                </div>
            `;
            
            cmdInput.placeholder = "Game Window Active...";
            cmdInput.disabled = true;
            
            setTimeout(initLocalSpider, 100);
            return;
        }

        output.innerHTML += command + '\n';
        if (lowerCmd === 'ls') output.innerHTML += "index.html  script.js  style.css\n\n$ ";
        else output.innerHTML += "Command processed.\n\n$ ";
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }
});

// 🃏 DRAG & DROP GAME ENGINE
let localDeck = [];
let localCols = [[], [], [], [], [], [], [], [], [], []];
const valuesOrder = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

function initLocalSpider() {
    localDeck = [];
    // Create 4 sets of Spades (♠️)
    for (let d = 0; d < 4; d++) {
        for (let v of valuesOrder) {
            localDeck.push({ value: v, suit: '♠️' });
        }
    }
    
    // Shuffle
    localDeck.sort(() => Math.random() - 0.5);
    
    // Deal 40 cards across 10 columns
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
    
    for (let c = 0; c < 10; c++) {
        let colDiv = document.createElement('div');
        colDiv.id = `col-${c}`;
        colDiv.style.cssText = "display: flex; flex-direction: column; min-height: 400px; background: rgba(0,0,0,0.15); border-radius: 6px; padding: 4px; border: 1px dashed rgba(255,255,255,0.15); position: relative;";
        
        // Drag over handling rules
        colDiv.ondragover = (e) => e.preventDefault();
        colDiv.ondrop = (e) => handleDrop(e, c);
        
        let colCards = localCols[c];
        colCards.forEach((card, r) => {
            let cardDiv = document.createElement('div');
            cardDiv.id = `card-${c}-${r}`;
            cardDiv.draggable = true; // Enable HTML5 drag feature
            
            // Stack overlap look configuration
            cardDiv.style.cssText = "background: white; color: black; border-radius: 4px; padding: 8px 4px; text-align: center; font-weight: bold; font-size: 13px; margin-bottom: -32px; box-shadow: 0 2px 5px rgba(0,0,0,0.4); border: 1px solid #bbb; user-select: none; cursor: grab; position: relative;";
            cardDiv.innerHTML = `${card.value}<br><span style="color:#000; font-size:11px;">${card.suit}</span>`;
            
            // Drag Start tracking
            cardDiv.ondragstart = (e) => {
                e.dataTransfer.setData("text/plain", JSON.stringify({ fromCol: c, fromRow: r }));
            };
            
            colDiv.appendChild(cardDiv);
        });
        
        container.appendChild(colDiv);
    }
}

function handleDrop(e, destColIdx) {
    e.preventDefault();
    try {
        const data = JSON.parse(e.dataTransfer.getData("text/plain"));
        const srcColIdx = data.fromCol;
        const srcRowIdx = data.fromRow;
        
        if (srcColIdx === destColIdx) return; // Same column drop avoidance
        
        let srcCol = localCols[srcColIdx];
        let destCol = localCols[destColIdx];
        
        // Extract the stack of cards from the selected row downward
        let movingCards = srcCol.slice(srcRowIdx);
        
        // Verify if the moving stack is in a valid decreasing sequence
        if (!isValidSequence(movingCards)) {
            alert("⚠️ Galat Sequence! Aap keval ek sahi kram mein lage patton ke group ko hi ek sath utha sakte hain.");
            return;
        }
        
        // Verify destination rule compatibility
        let isValidMove = false;
        if (destCol.length === 0) {
            isValidMove = true; // Free to drop on empty column
        } else {
            let targetCard = destCol[destCol.length - 1];
            let topMovingCard = movingCards[0];
            
            let movingRank = valuesOrder.indexOf(topMovingCard.value);
            let targetRank = valuesOrder.indexOf(targetCard.value);
            
            // Rules: Target card score value must be exactly +1 of moving card value
            if (targetRank === movingRank + 1) {
                isValidMove = true;
            }
        }
        
        if (isValidMove) {
            // Remove from source and push to destination stack array
            localCols[srcColIdx] = srcCol.slice(0, srcRowIdx);
            localCols[destColIdx] = destCol.concat(movingCards);
            renderLocalBoard();
        } else {
            let targetCard = destCol[destCol.length - 1];
            alert(`⚠️ Rule Error: [${movingCards[0].value}] ko [${targetCard.value}] ke neeche nahi rakh sakte bhai!`);
        }
    } catch (err) {
        console.error(err);
    }
}

// Sequence validation framework analyzer
function isValidSequence(cardsList) {
    if (cardsList.length <= 1) return true;
    for (let i = 0; i < cardsList.length - 1; i++) {
        let currentRank = valuesOrder.indexOf(cardsList[i].value);
        let nextRank = valuesOrder.indexOf(cardsList[i+1].value);
        if (currentRank !== nextRank + 1) {
            return false; // Chain layout breaks
        }
    }
    return true;
                     }

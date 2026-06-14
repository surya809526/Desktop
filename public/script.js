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
                <div id="gameTable" style="width: 100%; min-height: 520px; background-color: #125a36; border-radius: 8px; padding: 10px; box-sizing: border-box; font-family: Arial, sans-serif; overflow-x: auto;">
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; color: white; font-weight: bold; font-size: 14px; margin-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 8px;">
                        <div>
                            <span style="background: #222; padding: 4px 8px; border-radius: 4px; margin-right: 10px;">📊 Score: <span id="spiderScore" style="color: #00ff41;">450</span></span>
                            <span style="background: #222; padding: 4px 8px; border-radius: 4px;">🏆 Sets: <span id="spiderSets" style="color: #ffbd2e;">0/4</span></span>
                        </div>
                        <button onclick="initLocalSpider()" style="background: #ffbd2e; border: none; padding: 5px 12px; border-radius: 4px; color: black; font-weight: bold; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">🔄 Reset Board</button>
                    </div>
                    
                    <div id="spiderColumns" style="display: grid; grid-template-columns: repeat(10, 1fr); gap: 6px; width: 100%; min-width: 600px;">
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

// 🃏 DRAG & DROP GAME ENGINE WITH REMOVAL LOGIC
let localDeck = [];
let localCols = [[], [], [], [], [], [], [], [], [], []];
let currentScore = 450;
let completedSetsCount = 0;
const valuesOrder = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

function initLocalSpider() {
    localDeck = [];
    currentScore = 450;
    completedSetsCount = 0;

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
    
    updateScoreboard();
    renderLocalBoard();
}

function updateScoreboard() {
    const scoreEl = document.getElementById('spiderScore');
    const setsEl = document.getElementById('spiderSets');
    if (scoreEl) scoreEl.innerText = currentScore;
    if (setsEl) setsEl.innerText = `${completedSetsCount}/4`;
}

function renderLocalBoard() {
    const container = document.getElementById('spiderColumns');
    if (!container) return;
    container.innerHTML = '';
    
    for (let c = 0; c < 10; c++) {
        let colDiv = document.createElement('div');
        colDiv.id = `col-${c}`;
        colDiv.style.cssText = "display: flex; flex-direction: column; min-height: 400px; background: rgba(0,0,0,0.15); border-radius: 6px; padding: 4px; border: 1px dashed rgba(255,255,255,0.15); position: relative;";
        
        colDiv.ondragover = (e) => e.preventDefault();
        colDiv.ondrop = (e) => handleDrop(e, c);
        
        let colCards = localCols[c];
        colCards.forEach((card, r) => {
            let cardDiv = document.createElement('div');
            cardDiv.id = `card-${c}-${r}`;
            cardDiv.draggable = true;
            
            cardDiv.style.cssText = "background: white; color: black; border-radius: 4px; padding: 8px 4px; text-align: center; font-weight: bold; font-size: 13px; margin-bottom: -32px; box-shadow: 0 2px 5px rgba(0,0,0,0.4); border: 1px solid #bbb; user-select: none; cursor: grab; position: relative;";
            cardDiv.innerHTML = `${card.value}<br><span style="color:#000; font-size:11px;">${card.suit}</span>`;
            
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
        
        if (srcColIdx === destColIdx) return;
        
        let srcCol = localCols[srcColIdx];
        let destCol = localCols[destColIdx];
        let movingCards = srcCol.slice(srcRowIdx);
        
        if (!isValidSequence(movingCards)) {
            alert("⚠️ Galat Sequence! Aap keval ek sahi kram mein lage patton ke group ko hi ek sath utha sakte hain.");
            return;
        }
        
        let isValidMove = false;
        if (destCol.length === 0) {
            isValidMove = true; 
        } else {
            let targetCard = destCol[destCol.length - 1];
            let topMovingCard = movingCards[0];
            
            let movingRank = valuesOrder.indexOf(topMovingCard.value);
            let targetRank = valuesOrder.indexOf(targetCard.value);
            
            if (targetRank === movingRank + 1) {
                isValidMove = true;
            }
        }
        
        if (isValidMove) {
            localCols[srcColIdx] = srcCol.slice(0, srcRowIdx);
            localCols[destColIdx] = destCol.concat(movingCards);
            
            currentScore -= 1; // Har valid move par score 1 point kam hota hai standard rules ke mutabik
            
            // 🔥 CHECK FOR FULL COMPLETED SETS FROM KING TO ACE IN DESTINATION COLUMN
            checkAndClearFullSets(destColIdx);
            
            updateScoreboard();
            renderLocalBoard();
        } else {
            let targetCard = destCol[destCol.length - 1];
            alert(`⚠️ Rule Error: [${movingCards[0].value}] ko [${targetCard.value}] ke neeche nahi rakh sakte!`);
        }
    } catch (err) {
        console.error(err);
    }
}

function isValidSequence(cardsList) {
    if (cardsList.length <= 1) return true;
    for (let i = 0; i < cardsList.length - 1; i++) {
        let currentRank = valuesOrder.indexOf(cardsList[i].value);
        let nextRank = valuesOrder.indexOf(cardsList[i+1].value);
        if (currentRank !== nextRank + 1) {
            return false;
        }
    }
    return true;
}

// 🔥 AUTOMATIC SET GAYAB KARNE AUR BONUS POINTS DENE KA FUNCTION
function checkAndClearFullSets(colIdx) {
    let col = localCols[colIdx];
    if (col.length < 13) return;

    // We need to look for King down to Ace sequence anywhere at the top of the column stack
    const fullSequenceOrder = ['K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2', 'A'];
    
    // Check the last 13 cards of this column
    let startIndex = col.length - 13;
    let isComplete = true;
    
    for (let i = 0; i < 13; i++) {
        if (col[startIndex + i].value !== fullSequenceOrder[i]) {
            isComplete = false;
            break;
        }
    }
    
    if (isComplete) {
        // Remove the 13 cards from the column array (Screen se gayab)
        localCols[colIdx].splice(startIndex, 13);
        
        completedSetsCount += 1;
        currentScore += 100; // 100 Bonus points for complete set!
        
        // Sweet victory notification alert
        setTimeout(() => {
            alert(`🎉 Kamaal kar diya bhai! Tumne King 👑 se le kar Ace 🃏 tak ka ek poora set complete kar liya. +100 Bonus Points!`);
        }, 150);
        
        // Win trigger check
        if (completedSetsCount === 4) {
            setTimeout(() => {
                alert(`🏆 CONGRATULATIONS BHAI! Tumne saare sets complete karke game jeet liya hai! Final Score: ${currentScore}`);
            }, 500);
        }
    }
}

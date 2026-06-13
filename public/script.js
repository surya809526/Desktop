const cmdInput = document.getElementById('cmdInput');
const output = document.getElementById('output');
const terminalBody = document.getElementById('terminalBody');

let isCalcMode = false;
let calcStep = 0;
let calcData = { num1: 0, num2: 0, op: '' };

let isSnakeMode = false;
let snakeInterval = null;
let currentRestartFunction = null;

const filesList = "index.html    script.js    style.css    calculator.py    snake_game.exe";

// Mobile touch button clicks handler
window.triggerMobileKey = function(key) {
    if (isSnakeMode) {
        if (key === 'r' && currentRestartFunction) {
            currentRestartFunction();
        } else if (['w', 'a', 's', 'd'].includes(key)) {
            window.changeDirection(key);
        }
    } else {
        if (key === 'w') cmdInput.value = 'game';
        if (key === 's') cmdInput.value = 'calc';
        if (key === 'a') cmdInput.value = 'clear';
        if (key === 'd') cmdInput.value = 'ls';
        output.textContent += cmdInput.value + ' (Touch Macro)\n';
        cmdInput.focus();
        // Trigger default execution logic simulator
        const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
        cmdInput.dispatchEvent(enterEvent);
    }
};

cmdInput.addEventListener('keydown', async function(e) {
    if (e.key === 'Enter') {
        const command = cmdInput.value.trim();
        cmdInput.value = '';

        if (!command && !isCalcMode && !isSnakeMode) return;
        const lowerCmd = command.toLowerCase();

        // 🎮 1. INTERACTIVE SNAKE MODE CONTROL PANEL
        if (isSnakeMode) {
            if (lowerCmd === 'exit' || lowerCmd === 'q') {
                clearInterval(snakeInterval);
                isSnakeMode = false;
                output.textContent += 'exit\n🎮 Game Over! Terminal back online.\n\n$ ';
                cmdInput.placeholder = "Type command...";
                return;
            }
            if (lowerCmd === 'r' && currentRestartFunction) {
                currentRestartFunction();
                return;
            }
            if (['w', 'a', 's', 'd'].includes(lowerCmd)) {
                window.changeDirection(lowerCmd);
            }
            terminalBody.scrollTop = terminalBody.scrollHeight;
            return;
        }

        // 🧮 2. INTERACTIVE CALCULATOR MODE ENGINE
        if (isCalcMode) {
            output.textContent += command + '\n';
            if (lowerCmd === 'exit') {
                isCalcMode = false;
                calcStep = 0;
                output.textContent += 'Calculator closed.\n\n$ ';
                cmdInput.placeholder = "Type command...";
                return;
            }

            if (calcStep === 1) {
                calcData.num1 = parseFloat(command);
                if (isNaN(calcData.num1)) {
                    output.textContent += '⚠️ Galat number! Pehla number daalo: ';
                    return;
                }
                calcStep = 2;
                output.textContent += 'Operation chuno (+, -, *, /): ';
            } else if (calcStep === 2) {
                if (!['+', '-', '*', '/'].includes(command)) {
                    output.textContent += '⚠️ Galat operation! Sirf +, -, *, / chuno: ';
                    return;
                }
                calcData.op = command;
                calcStep = 3;
                output.textContent += 'Doosra number daalo: ';
            } else if (calcStep === 3) {
                calcData.num2 = parseFloat(command);
                if (isNaN(calcData.num2)) {
                    output.textContent += '⚠️ Galat number! Doosra number daalo: ';
                    return;
                }
                let res = 0;
                if (calcData.op === '+') res = calcData.num1 + calcData.num2;
                else if (calcData.op === '-') res = calcData.num1 - calcData.num2;
                else if (calcData.op === '*') res = calcData.num1 * calcData.num2;
                else if (calcData.op === '/') {
                    if (calcData.num2 === 0) {
                        output.textContent += '❌ Zero division runtime error!\n\n$ ';
                        isCalcMode = false; calcStep = 0; return;
                    }
                    res = calcData.num1 / calcData.num2;
                }
                output.textContent += '\n🎉 Result: ' + res + '\n\n$ ';
                isCalcMode = false; calcStep = 0;
                cmdInput.placeholder = "Type command...";
            }
            terminalBody.scrollTop = terminalBody.scrollHeight;
            return;
        }

        // 🌐 3. NORMAL MODE EXECUTION PIPELINE
        output.textContent += command + '\n';

        if (lowerCmd === 'clear') { output.textContent = '$ '; return; }
        if (lowerCmd === 'calc') {
            isCalcMode = true; calcStep = 1;
            output.textContent += '\n=== HackOS Live Interactive Calculator ===\nPehla number daalo: ';
            cmdInput.placeholder = "Enter number";
            return;
        }

        // 🐍 SNAKE GAME CORE SUBSYSTEM INTERCEPTOR
        if (lowerCmd === 'game' || lowerCmd === 'snake') {
            isSnakeMode = true;
            cmdInput.placeholder = "Game active! Use screen buttons";
            
            function runSnakeEngine() {
                clearInterval(snakeInterval);
                output.textContent += '\n=== Nokia 3310 Snake Game Live ===\nUse Touch Arrows below screen!\nTouch 🔄 button to Restart anytime.\n\n';
                
                const width = 20; const height = 12;
                let snake = [{x: 10, y: 5}, {x: 9, y: 5}];
                let direction = 'd'; let food = {x: 5, y: 3}; let score = 0;

                window.changeDirection = function(dir) {
                    if (dir === 'w' && direction !== 's') direction = 'w';
                    if (dir === 's' && direction !== 'w') direction = 's';
                    if (dir === 'a' && direction !== 'd') direction = 'a';
                    if (dir === 'd' && direction !== 'a') direction = 'd';
                };

                snakeInterval = setInterval(() => {
                    let head = Object.assign({}, snake[0]);
                    if (direction === 'w') head.y--;
                    if (direction === 's') head.y++;
                    if (direction === 'a') head.x--;
                    if (direction === 'd') head.x++;

                    if (head.x < 0 || head.x >= width || head.y < 0 || head.y >= height || snake.some(c => head.x === c.x && head.y === c.y)) {
                        clearInterval(snakeInterval);
                        output.textContent += `\n❌ CRASH! Game Over.\n🏆 Score: ${score}\n👉 Touch 🔄 button to Restart Game!\n\n`;
                        terminalBody.scrollTop = terminalBody.scrollHeight;
                        return;
                    }

                    snake.unshift(head);
                    if (head.x === food.x && head.y === food.y) {
                        score += 10;
                        food.x = Math.floor(Math.random() * width);
                        food.y = Math.floor(Math.random() * height);
                    } else {
                        snake.pop();
                    }

                    let board = "";
                    for (let y = 0; y < height; y++) {
                        let line = "";
                        for (let x = 0; x < width; x++) {
                            if (x === head.x && y === head.y) line += "O";
                            else if (snake.some(c => c.x === x && c.y === y)) line += "o";
                            else if (x === food.x && y === food.y) line += "X";
                            else line += ".";
                        }
                        board += line + "\n";
                    }

                    const lines = output.textContent.split('\n');
                    if (lines.length > height + 6) {
                        output.textContent = lines.slice(0, -(height + 2)).join('\n') + '\n';
                    }
                    output.textContent += board + `Score: ${score}\n`;
                    terminalBody.scrollTop = terminalBody.scrollHeight;
                }, 250);
            }

            currentRestartFunction = runSnakeEngine;
            runSnakeEngine();
            return;
        }

        if (lowerCmd === 'ls') output.textContent += filesList + '\n\n$ ';
        else if (lowerCmd === 'pwd') output.textContent += '/home/render/project/hackos\n\n$ ';
        else output.textContent += 'Command processed.\n\n$ ';
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }
});

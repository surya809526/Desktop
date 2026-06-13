const cmdInput = document.getElementById('cmdInput');
const output = document.getElementById('output');
const terminalBody = document.getElementById('terminalBody');

// App Modes Control
let isCalcMode = false;
let calcStep = 0;
let calcData = { num1: 0, num2: 0, op: '' };

let isSnakeMode = false;
let snakeInterval = null;

const filesList = "index.html    script.js    style.css    calculator.py    snake_game.exe";

cmdInput.addEventListener('keydown', async function(e) {
    if (e.key === 'Enter') {
        const command = cmdInput.value.trim();
        cmdInput.value = '';

        if (!command && !isCalcMode && !isSnakeMode) return;

        const lowerCmd = command.toLowerCase();

        // 🎮 1. INTERACTIVE SNAKE GAME KEYBOARD CONTROLS
        if (isSnakeMode) {
            if (lowerCmd === 'exit' || lowerCmd === 'q') {
                clearInterval(snakeInterval);
                isSnakeMode = false;
                output.textContent += 'exit\n🎮 Game Over! Terminal par wapas aa gaye ho.\n\n$ ';
                cmdInput.placeholder = "Type command...";
                terminalBody.scrollTop = terminalBody.scrollHeight;
                return;
            }
            // Game chalte waqt control keys direction badalne ke liye
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
                terminalBody.scrollTop = terminalBody.scrollHeight;
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
                cmdInput.placeholder = "e.g., +";
            } 
            else if (calcStep === 2) {
                if (!['+', '-', '*', '/'].includes(command)) {
                    output.textContent += '⚠️ Galat operation! Sirf +, -, *, / chuno: ';
                    return;
                }
                calcData.op = command;
                calcStep = 3;
                output.textContent += 'Doosra number daalo: ';
                cmdInput.placeholder = "e.g., 5";
            } 
            else if (calcStep === 3) {
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
                        output.textContent += '❌ Error: Zero se divide nahi ho sakta!\n\n$ ';
                        isCalcMode = false;
                        calcStep = 0;
                        cmdInput.placeholder = "Type command...";
                        return;
                    }
                    res = calcData.num1 / calcData.num2;
                }

                output.textContent += '\n🎉 Result: ' + calcData.num1 + ' ' + calcData.op + ' ' + calcData.num2 + ' = ' + res + '\n\n$ ';
                isCalcMode = false;
                calcStep = 0;
                cmdInput.placeholder = "Type command...";
            }
            terminalBody.scrollTop = terminalBody.scrollHeight;
            return;
        }

        // 🌐 3. NORMAL TERMINAL MODE
        output.textContent += command + '\n';

        if (lowerCmd === 'clear') {
            output.textContent = '$ ';
            return;
        }

        // Calculator mode trigger
        if (lowerCmd === 'calc') {
            isCalcMode = true;
            calcStep = 1;
            output.textContent += '\n=== HackOS Live Interactive Calculator ===\nPehla number daalo: ';
            cmdInput.placeholder = "e.g., 10";
            terminalBody.scrollTop = terminalBody.scrollHeight;
            return;
        }

        // 🐍 Nokia Snake Game Command Trigger
        if (lowerCmd === 'game' || lowerCmd === 'snake') {
            isSnakeMode = true;
            output.textContent += '\n=== Nokia 3310 Snake Game Live ===\nControls: w=UP, s=DOWN, a=LEFT, d=RIGHT\nType "q" or "exit" to Quit.\n\n';
            
            // Game configurations logic
            const width = 20;
            const height = 12;
            let snake = [{x: 10, y: 5}, {x: 9, y: 5}];
            let direction = 'd';
            let food = {x: 5, y: 5};
            let score = 0;

            window.changeDirection = function(dir) {
                if (dir === 'w' && direction !== 's') direction = 'w';
                if (dir === 's' && direction !== 'w') direction = 's';
                if (dir === 'a' && direction !== 'd') direction = 'a';
                if (dir === 'd' && direction !== 'a') direction = 'd';
            };

            function spawnFood() {
                food.x = Math.floor(Math.random() * width);
                food.y = Math.floor(Math.random() * height);
            }

            // Game logic renderer engine loop
            snakeInterval = setInterval(() => {
                let head = Object.assign({}, snake[0]);

                if (direction === 'w') head.y--;
                if (direction === 's') head.y++;
                if (direction === 'a') head.x--;
                if (direction === 'd') head.x++;

                // Collision Wall Checker
                if (head.x < 0 || head.x >= width || head.y < 0 || head.y >= height) {
                    clearInterval(snakeInterval);
                    isSnakeMode = false;
                    output.textContent += `\n❌ CRASH! Game Over.\n🏆 Final Score: ${score}\n\n$ `;
                    cmdInput.placeholder = "Type command...";
                    terminalBody.scrollTop = terminalBody.scrollHeight;
                    return;
                }

                // Self Body Collision Checker
                for (let cell of snake) {
                    if (head.x === cell.x && head.y === cell.y) {
                        clearInterval(snakeInterval);
                        isSnakeMode = false;
                        output.textContent += `\n❌ Eaten Yourself! Game Over.\n🏆 Final Score: ${score}\n\n$ `;
                        cmdInput.placeholder = "Type command...";
                        terminalBody.scrollTop = terminalBody.scrollHeight;
                        return;
                    }
                }

                snake.unshift(head);

                // Food eater condition
                if (head.x === food.x && head.y === food.y) {
                    score += 10;
                    spawnFood();
                } else {
                    snake.pop();
                }

                // UI Screen renderer matrix framework
                let board = "";
                for (let y = 0; y < height; y++) {
                    let line = "";
                    for (let x = 0; x < width; x++) {
                        if (x === head.x && y === head.y) line += "O"; // Snake Head
                        else if (snake.some(c => c.x === x && c.y === y)) line += "o"; // Snake Body
                        else if (x === food.x && y === food.y) line += "X"; // Nokia Food
                        else line += ".";
                    }
                    board += line + "\n";
                }

                // Purana board mita kar naya frame chipkana
                const lines = output.textContent.split('\n');
                if (lines.length > height + 5) {
                    output.textContent = lines.slice(0, -(height + 2)).join('\n') + '\n';
                }
                output.textContent += board + `Score: ${score} | Controls: w/a/s/d\n`;
                terminalBody.scrollTop = terminalBody.scrollHeight;

            }, 300); // Speed configuration thread milliseconds
            return;
        }

        // Fast Simulator commands fallback
        if (lowerCmd === 'ls') {
            output.textContent += filesList + '\n\n$ ';
        } else if (lowerCmd === 'pwd') {
            output.textContent += '/home/render/project/hackos\n\n$ ';
        } else {
            output.textContent += 'Command processed.\n\n$ ';
        }

        terminalBody.scrollTop = terminalBody.scrollHeight;
    }
});

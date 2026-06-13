const cmdInput = document.getElementById('cmdInput');
const output = document.getElementById('output');
const terminalBody = document.getElementById('terminalBody');

let isCalcMode = false;
let calcStep = 0;
let calcData = { num1: 0, num2: 0, op: '' };

const filesList = "index.html    script.js    style.css    calculator.py";

cmdInput.addEventListener('keydown', async function(e) {
    if (e.key === 'Enter') {
        const command = cmdInput.value.trim();
        cmdInput.value = '';

        if (!command && !isCalcMode) return;

        output.textContent += command + '\n';
        const lowerCmd = command.toLowerCase();

        // 1. CALCULATOR MODE ACTIVE
        if (isCalcMode) {
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

        // 2. NORMAL MODE
        if (lowerCmd === 'clear') {
            output.textContent = '$ ';
            return;
        }

        if (lowerCmd === 'calc') {
            isCalcMode = true;
            calcStep = 1;
            output.textContent += '\n=== HackOS Live Interactive Calculator ===\nPehla number daalo: ';
            cmdInput.placeholder = "e.g., 10";
            terminalBody.scrollTop = terminalBody.scrollHeight;
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

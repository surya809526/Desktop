const cmdInput = document.getElementById('cmdInput');
const output = document.getElementById('output');
const terminalBody = document.getElementById('terminalBody');

// States for calculator mode
let isCalcMode = false;
let calcStep = 0;
let calcData = { num1: 0, num2: 0, op: '' };

// Static files info for simulator fallback
const filesList = "index.html    script.js    style.css    calculator.py";

cmdInput.addEventListener('keydown', async function(e) {
    if (e.key === 'Enter') {
        const command = cmdInput.value.trim();
        cmdInput.value = '';

        if (!command && !isCalcMode) return;

        // 🧮 1. INTERACTIVE CALCULATOR MODE ENGINE
        if (isCalcMode) {
            output.textContent += command + '\n';

            if (command.toLowerCase() === 'exit') {
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
                    output.textContent += '⚠️ Galat number hai bhai! Fir se Pehla number daalo: ';
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
                    output.textContent += '⚠️ Galat number hai bhai! Fir se Doosra number daalo: ';
                    return;
                }

                // Calculator Core Logic Engine
                let res = 0;
                if (calcData.op === '+') res = calcData.num1 + calcData.num2;
                else if (calcData.op === '-') res = calcData.num1 - calcData.num2;
                else if (calcData.op === '*') res = calcData.num1 * calcData.num2;
                else if (calcData.op === '/') {
                    if (calcData.num2 === 0) {
                        output.textContent += '❌ Error: Zero se divide nahi ho sakta!\n\nType \'calc\' to restart.\n$ ';
                        isCalcMode = false;
                        calcStep = 0;
                        cmdInput.placeholder = "Type command...";
                        return;
                    }
                    res = calcData.num1 / calcData.num2;
                }

                output.textContent += `\n🎉 Result: ${calcData.num1} ${calcData.op} ${calcData.num2} = ${res}\n\nType 'calc' to use again, or 'exit' to quit.\n$ ';
                isCalcMode = false;
                calcStep = 0;
                cmdInput.placeholder = "Type command...";
            }
            
            terminalBody.scrollTop = terminalBody.scrollHeight;
            return;
        }

        // 🌐 2. SYSTEM SHELL COMMAND HANDLER
        output.textContent += command + '\n';

        const lowerCmd = command.toLowerCase();

        if (lowerCmd === 'clear') {
            output.textContent = '$ ';
            return;
        }

        // Trigger Calculator Command
        if (lowerCmd === 'calc') {
            isCalcMode = true;
            calcStep = 1;
            output.textContent += '\n=== HackOS Live Interactive Calculator ===\nType "exit" anytime to close.\n\nPehla number daalo: ';
            cmdInput.placeholder = "e.g., 10";
            terminalBody.scrollTop = terminalBody.scrollHeight;
            return;
        }

        // Local fast execution simulator loop for standard tools
        if (lowerCmd === 'ls') {
            output.textContent += filesList + '\n\n$ ';
            terminalBody.scrollTop = terminalBody.scrollHeight;
            return;
        }
        if (lowerCmd === 'pwd') {
            output.textContent += '/home/render/project/hackos\n\n$ ';
            terminalBody.scrollTop = terminalBody.scrollHeight;
            return;
        }
        if (lowerCmd === 'node -v') {
            output.textContent += 'v20.11.0\n\n$ ';
            terminalBody.scrollTop = terminalBody.scrollHeight;
            return;
        }
        if (lowerCmd === 'npm -v') {
            output.textContent += '10.2.4\n\n$ ';
            terminalBody.scrollTop = terminalBody.scrollHeight;
            return;
        }
        if (lowerCmd.startsWith('python')) {
            output.textContent += 'Python Engine Execution Framework Live.\nUse \'calc\' command for interactive calculator operations.\n\n$ ';
            terminalBody.scrollTop = terminalBody.scrollHeight;
            return;
        }

        // Backend pipeline integration fallback
        try {
            const response = await fetch('/api/cmd', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ command: command })
            });

            const data = await response.json();
            
            if (data.output && !data.output.includes(command)) {
                output.textContent += data.output + '\n$ ';
            } else {
                output.textContent += 'Command processed locally.\n$ ';
            }
        } catch (error) {
            output.textContent += 'Executed locally.\n$ ';
        }

        terminalBody.scrollTop = terminalBody.scrollHeight;
    }
});

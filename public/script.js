const cmdInput = document.getElementById('cmdInput');
const output = document.getElementById('output');
const terminalBody = document.getElementById('terminalBody');

cmdInput.addEventListener('keydown', async function(e) {
    if (e.key === 'Enter') {
        const command = cmdInput.value.trim();
        cmdInput.value = '';

        if (!command) return;

        // UI screen par user command print karna
        output.textContent += command + '\n';

        if (command === 'clear') {
            output.textContent = '$ ';
            return;
        }

        try {
            // Render engine ko API request fire karna
            const response = await fetch('/api/cmd', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ command: command })
            });

            const data = await response.json();
            
            // Asli server backend execution output render karna
            if (data.output) {
                output.textContent += data.output + '\n$ ';
            } else {
                output.textContent += '\n$ ';
            }
        } catch (error) {
            output.textContent += 'Engine Connection Error: Unable to reach cloud server.\n$ ';
        }

        // Auto scroll to bottom standard layout rule
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }
});

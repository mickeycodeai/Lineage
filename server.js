const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

const app = express();

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());

const publicPath = path.resolve(__dirname, 'public');
app.use(express.static(publicPath));

// --- CONFIGURATION ---
// 🚨 CRITICAL: Ensure this matches the current URL printed in your Colab terminal
const TARGET_URL = "https://unblossomed-mattie-transmentally.ngrok-free.dev/v1/chat";

// 🚨 CRITICAL: Your exact Colab REAL_API_KEY
const SECRET_KEY = "lineage";

// --- ROUTES ---

app.get('/bios', (req, res) => {
    res.sendFile(path.join(publicPath, 'models.html'));
});

app.get('/code-engine', (req, res) => {
    res.sendFile(path.join(publicPath, 'code-engine.html'));
});

/**
 * API PROXY ROUTE - SYNCHRONIZED VERSION
 */
app.post('/api/chat', async (req, res) => {
    try {
        const { mensahe, history, model } = req.body;

        // 1. TRANSLATION LAYER: BIOS Names -> Colab Modes
        let colabMode = "fast"; 
        if (model === "lineage-coder") {
            colabMode = "coder";
        }

        // 2. CONSTRUCT PAYLOAD: Matching ChatRequest in Python
        const payload = {
            mensahe: mensahe,
            history: history || [],
            mode: colabMode 
        };

        console.log(`[UPLINK] Initiating handshake... Model: ${model} -> Mode: ${colabMode}`);

        // 3. UPLINK TO COLAB
        const response = await axios.post(TARGET_URL, payload, {
            headers: { 
                'x-api-key': SECRET_KEY, 
                'Content-Type': 'application/json' 
            },
            timeout: 45000 // Extended for heavy 3B model inference
        });

        res.json(response.data);

    } catch (error) {
        console.error("--- KERNEL PANIC: PROXY FAILURE ---");
        if (error.response) {
            console.error("Colab responded with:", error.response.status, error.response.data);
        } else {
            console.error("System Error Message:", error.message);
        }
        
        res.status(500).json({ 
            error: "M17 Kernel Error", 
            details: error.message,
            tip: "Verify your Ngrok URL is still active in Google Colab." 
        });
    }
});

// --- TERMINAL LOGIC ---
app.post('/api/terminal', (req, res) => {
    const { command, args } = req.body;
    const targetPath = path.join(__dirname, 'public');

    switch (command) {
        case 'ls':
            fs.readdir(targetPath, (err, files) => {
                res.json({ output: err ? "Error reading directory" : files.join('  ') });
            });
            break;
        case 'cat':
            const fileToRead = path.join(targetPath, args[0]);
            fs.readFile(fileToRead, 'utf8', (err, data) => {
                res.json({ output: err ? `cat: ${args[0]}: No such file` : data });
            });
            break;
        default:
            res.json({ output: `Command '${command}' not recognized.` });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`\x1b[32m%s\x1b[0m`, `Kali-M17 Proxy Online: http://localhost:${PORT}`);
    console.log(`Uplink Target: ${TARGET_URL}`);
});

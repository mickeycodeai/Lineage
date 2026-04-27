const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());

// Serve the directory where your white index.html is located
const publicPath = path.resolve(__dirname, 'public');
app.use(express.static(publicPath));

// --- CONFIGURATION ---
// Update this whenever you restart Colab
const COLAB_ENDPOINT = "https://unblossomed-mattie-transmentally.ngrok-free.dev/v1/chat";
const SECRET_KEY = "lineage";

// --- ROUTES ---

/**
 * Clean Academic UI Route
 */
app.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

/**
 * PROFESSIONAL PROXY ROUTE
 * This connects your White UI to your Colab Backend
 */
app.post('/api/chat', async (req, res) => {
    try {
        const { mensahe, mode } = req.body;

        console.log(`[System] Processing ${mode} request...`);

        // Forwarding to Colab
        const response = await axios.post(COLAB_ENDPOINT, {
            mensahe: mensahe,
            mode: mode,
            history: [] // Optional: handle history if you add it to the UI later
        }, {
            headers: { 
                'x-api-key': SECRET_KEY, 
                'Content-Type': 'application/json' 
            },
            timeout: 60000 // 1 minute timeout for deep reasoning
        });

        // Send the data back to your white UI
        res.json(response.data);

    } catch (error) {
        console.error("[Error] Connection to Lineage Intelligence failed.");
        
        res.status(500).json({ 
            error: "Service Temporarily Unavailable", 
            details: "Could not establish a secure connection to the inference engine." 
        });
    }
});

// --- START SERVER ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("------------------------------------------");
    console.log(`Lineage AI Dashboard: http://localhost:${PORT}`);
    console.log(`Connected to Backend: ${COLAB_ENDPOINT}`);
    console.log("------------------------------------------");
});

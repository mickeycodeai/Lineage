const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path'); // 1. Added for serving frontend

const app = express();
app.use(cors());
app.use(express.json());

// 2. Serve static files (your index.html, etc.)
// Put your HTML file in a folder named 'public'
app.use(express.static(path.join(__dirname, 'public')));

const TARGET_URL = "https://unblossomed-mattie-transmentally.ngrok-free.dev/v1/chat";
const SECRET_KEY = process.env.M17_API_KEY; // 3. Use Environment Variables (Security)

app.post('/api/chat', async (req, res) => {
    try {
        const response = await axios.post(TARGET_URL, req.body, {
            headers: { 'x-api-key': SECRET_KEY, 'Content-Type': 'application/json' }
        });
        res.json(response.data);
    } catch (error) {
        console.error("Proxy Error:", error.message);
        res.status(500).json({ error: "M17 Kernel Error" });
    }
});

// 4. Important for Render: Listen on the port provided by the environment
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Kali-M17 Proxy Active on port ${PORT}`));
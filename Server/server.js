const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./database');
const userRoutes = require('./Routes/userRoutes');
const quizRoutes = require('./routes/quizRoutes');
require('dotenv').config({ path: './config.env' });
const openAIRoutes = require('./Routes/openAIRoutes');


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
app.use(bodyParser.json());

// ✅ Connect to database
connectDB();

// ✅ Store latest results
let currentResult = null;
let topSlotResult = null;
let clients = []; // Stores connected clients

// ✅ Log Top Slot Results Before Wheel Lands
app.post('/api/topslot', (req, res) => {
    const { result, multiplier } = req.body;

    if (!result || multiplier === undefined) {
        console.error('❌ Invalid Top Slot data received:', req.body);
        return res.status(400).json({ message: 'Invalid Top Slot data' });
    }

    console.log(`🎰 Top Slot Result: ${result}, Multiplier: ${multiplier}x`);
    topSlotResult = { result, multiplier };

    // ✅ Send update to clients
    clients.forEach(client => client.write(`data: ${JSON.stringify({ topslot: topSlotResult })}\n\n`));

    res.status(200).json({ message: 'Top Slot result received' });
});

// ✅ Log **ALL** Results (Including Bonuses)
app.post('/api/result', (req, res) => {
    const { result, topSlotMultiplier, finalPoints } = req.body;

    if (!result || topSlotMultiplier === undefined || finalPoints === undefined) {
        console.error('❌ Invalid result received:', req.body);
        return res.status(400).json({ message: 'Invalid result or missing points' });
    }

    const timestamp = Date.now(); // ✅ Add a timestamp

    console.log(`✅ Result Received: ${result}, Top Slot Multiplier: ${topSlotMultiplier}x, Final Points: ${finalPoints}`);

    // ✅ Store with timestamp
    currentResult = { result, topSlotMultiplier, finalPoints, timestamp };

    // ✅ Send update to clients
    clients.forEach(client => client.write(`data: ${JSON.stringify({ wheel: currentResult })}\n\n`));

    res.status(200).json({ message: 'Result received' });
});


// ✅ SSE Endpoint for React to listen for updates
app.get('/api/result-stream', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    console.log('🔄 New client connected to result stream.');

    if (topSlotResult) {
        console.log("📡 Sending Top Slot:", topSlotResult);
        res.write(`data: ${JSON.stringify({ topslot: topSlotResult })}\n\n`);
    }
    if (currentResult) {
        console.log("📡 Sending Result:", currentResult);
        res.write(`data: ${JSON.stringify({ wheel: currentResult })}\n\n`);
    }

    clients.push(res);

    req.on('close', () => {
        console.log('❌ Client disconnected from result stream.');
        clients = clients.filter(client => client !== res);
    });
});

// ✅ Other API Routes
app.use('/api/users', userRoutes);
app.use('/api', quizRoutes);
app.use("/api", require("./Routes/quizRoutes"));
app.use('/api', require('./Routes/openAIRoutes'));
app.use('/api', openAIRoutes);

// ✅ Start server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

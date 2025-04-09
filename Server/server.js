const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./database');
const userRoutes = require('./Routes/userRoutes');
const quizRoutes = require('./Routes/quizRoutes');
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
let sessions = {}; // sessionId -> { result, topSlot }
let clients = {};  // sessionId -> array of res objects

// ✅ Log Top Slot Results Before Wheel Lands
app.post('/api/topslot', (req, res) => {
    const { sessionId, result, multiplier } = req.body;

    if (!sessionId || !result || multiplier === undefined) {
        return res.status(400).json({ message: 'Missing or invalid Top Slot data' });
    }

    const topSlotData = { result, multiplier };
    sessions[sessionId] = sessions[sessionId] || {};
    sessions[sessionId].topSlot = topSlotData;

    console.log(`📡 [${sessionId}] Top Slot:`, topSlotData);

    if (clients[sessionId]) {
        clients[sessionId].forEach(client =>
            client.write(`data: ${JSON.stringify({ topslot: topSlotData })}\n\n`)
        );
    }

    res.status(200).json({ message: 'Top Slot result received' });
});


// ✅ Log **ALL** Results (Including Bonuses)
app.post('/api/result', (req, res) => {
    const { sessionId, result, topSlotMultiplier, finalPoints } = req.body;

    if (!sessionId || !result || topSlotMultiplier === undefined || finalPoints === undefined) {
        return res.status(400).json({ message: 'Missing result/session data' });
    }

    const resultData = {
        result,
        topSlotMultiplier,
        finalPoints,
        timestamp: Date.now(),
    };

    sessions[sessionId] = sessions[sessionId] || {};
    sessions[sessionId].result = resultData;

    console.log(`📡 [${sessionId}] Result:`, resultData);

    if (clients[sessionId]) {
        clients[sessionId].forEach(client =>
            client.write(`data: ${JSON.stringify({ wheel: resultData })}\n\n`)
        );
    }

    res.status(200).json({ message: 'Result received' });
});



// ✅ SSE Endpoint for React to listen for updates
app.get('/api/result-stream', (req, res) => {
    console.log("🔎 Incoming stream connection:", req.url);

    const { sessionId } = req.query;
    if (!sessionId) return res.status(400).json({ message: "Missing sessionId" });
  
    // Setup headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
  
    if (!clients[sessionId]) clients[sessionId] = [];
clients[sessionId].push(res);

// Optional: send last known data
const sessionData = sessions[sessionId];
if (sessionData?.topSlot) {
    res.write(`data: ${JSON.stringify({ topslot: sessionData.topSlot })}\n\n`);
}
if (sessionData?.result) {
    res.write(`data: ${JSON.stringify({ wheel: sessionData.result })}\n\n`);
}

req.on('close', () => {
    clients[sessionId] = clients[sessionId].filter(client => client !== res);
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

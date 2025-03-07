const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./database');
const userRoutes = require('./Routes/userRoutes');
const quizRoutes = require('./routes/quizRoutes');
require('dotenv').config({ path: './config.env' });

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

// ✅ Log Wheel Landing Results
// ✅ Log Wheel Landing Results WITH FINAL POINTS
// ✅ Log Wheel Landing Results WITH FINAL POINTS
app.post('/api/result', (req, res) => {
    const { result, topSlotMultiplier, finalPoints } = req.body;  // ✅ Expecting all values

    if (!result || topSlotMultiplier === undefined || finalPoints === undefined) {
        console.error('❌ Invalid wheel result received:', req.body);
        return res.status(400).json({ message: 'Invalid wheel result or missing points' });
    }

    console.log(`✅ Wheel Landed on: ${result}, Top Slot Multiplier: ${topSlotMultiplier}x, Final Points: ${finalPoints}`);

    currentResult = { result, topSlotMultiplier, finalPoints }; // ✅ Store latest result

    // ✅ Send update to clients
    clients.forEach(client => client.write(`data: ${JSON.stringify({ wheel: currentResult })}\n\n`));

    res.status(200).json({ message: 'Wheel result received' });
});



// ✅ Log Final Bonus Round Points (After Bonus Ends)
app.post('/api/bonus-result', (req, res) => {
    const { result, points } = req.body;

    if (!result || points === undefined) {
        console.error('❌ Invalid bonus result received:', req.body);
        return res.status(400).json({ message: 'Invalid bonus result or missing points' });
    }

    console.log(`🎯 Bonus Completed: ${result}, Final Points: ${points}`);
    
    // ✅ Send update to clients
    clients.forEach(client => client.write(`data: ${JSON.stringify({ bonus: { result, points } })}\n\n`));

    res.status(200).json({ message: 'Bonus result received' });
});

// ✅ SSE Endpoint for React to listen for updates
app.get('/api/result-stream', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    console.log('🔄 New client connected to result stream.');

    // ✅ Send latest results if available
    if (topSlotResult) res.write(`data: ${JSON.stringify({ topslot: topSlotResult })}\n\n`);
    if (currentResult) res.write(`data: ${JSON.stringify({ wheel: currentResult })}\n\n`);

    // ✅ Store the response object for future updates
    clients.push(res);

    // ✅ Remove client on disconnect
    req.on('close', () => {
        console.log('❌ Client disconnected from result stream.');
        clients = clients.filter(client => client !== res);
    });
});

// ✅ Other API Routes
app.use('/api/users', userRoutes);
app.use('/api', quizRoutes);

// ✅ New Endpoint: Receive Bonus Game Start from Unity
app.post('/api/bonus-start', (req, res) => {
    const { result } = req.body;

    if (!result) {
        return res.status(400).json({ message: 'Invalid bonus result' });
    }

    console.log(`🎰 Bonus Game Started: ${result}`); // ✅ Debug Log in Server

    res.status(200).json({ message: 'Bonus game start received' });
});
// ✅ New Endpoint: Receive Final Bonus Points from Unity (Plinko & CoinToss)
app.post('/api/bonus-points', (req, res) => {
    const { result, points } = req.body;

    if (!result || points === undefined) {
        return res.status(400).json({ message: 'Invalid bonus game result or points' });
    }

    console.log(`🔥 Bonus Completed: ${result}, Final Points: ${points}`); // ✅ Debug Log

    res.status(200).json({ message: 'Bonus points received' });
});


// ✅ Start server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

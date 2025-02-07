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

// ✅ Store the latest Unity result
let currentResult = null;
let clients = []; // Stores connected clients

// ✅ Endpoint for Unity to send results
app.post('/api/result', (req, res) => {
    const { result } = req.body;

    if (!result) {
        return res.status(400).json({ message: 'Invalid result' });
    }

    console.log('✅ Received result from Unity:', result);
    currentResult = result; // Store the latest result

    // ✅ Send result update to all connected clients
    clients.forEach(client => client.write(`data: ${JSON.stringify({ result })}\n\n`));

    res.status(200).json({ message: 'Result received' });
});

// ✅ SSE Endpoint for React to listen for updates
app.get('/api/result-stream', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // ✅ Send the latest result immediately if available
    if (currentResult) {
        res.write(`data: ${JSON.stringify({ result: currentResult })}\n\n`);
    }

    // ✅ Store the response object for future updates
    clients.push(res);

    // ✅ Remove client on disconnect
    req.on('close', () => {
        clients = clients.filter(client => client !== res);
    });
});

// ✅ Other API Routes
app.use('/api/users', userRoutes);
app.use('/api', quizRoutes);

// ✅ Start server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

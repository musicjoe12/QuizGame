// Assuming you're using Express.js
const express = require('express');
const app = express();
const port = 5000;

let currentResult = null; // To store the current result received from Unity

// Middleware to handle POST request from Unity
app.use(express.json()); // Ensure that JSON data can be parsed

// Endpoint to receive results from Unity (POST)
app.post('/api/result', (req, res) => {
    const { result } = req.body;
    console.log('Received result from Unity:', result);
    currentResult = result; // Store the result
    res.status(200).send({ message: 'Result received' });
});

// Endpoint to send the latest result to the React app (GET)
app.get('/api/result', (req, res) => {
    if (currentResult) {
        return res.status(200).json({ result: currentResult });
    } else {
        return res.status(404).json({ message: 'Result not found' });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

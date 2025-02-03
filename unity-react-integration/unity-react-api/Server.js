
const express = require('express');
const app = express();
const port = 5000;
const cors = require('cors'); 


let currentResult = null; 

app.use(cors());
app.use(express.json()); 

app.post('/api/result', (req, res) => {
    const { result } = req.body;
    console.log('Received result from Unity:', result);
    currentResult = result; // Store the result
    res.status(200).send({ message: 'Result received' });
});


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

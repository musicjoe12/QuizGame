const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./database');
const userRoutes = require('./Routes/userRoutes');
require('dotenv').config({ path: './config.env' });

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({
    origin: "http://localhost:3000", 
    credentials: true
  }));
  app.use(bodyParser.json());
  

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api', require('./routes/quizRoutes'));

// Start server & connect to DB
connectDB();
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

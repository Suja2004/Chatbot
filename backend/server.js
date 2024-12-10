const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const { detectIntent } = require("./chatbot");

const authRoutes = require('./authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('MongoDB connected');
}).catch((err) => {
    console.error('MongoDB connection error:', err);
});

// Routes
app.use('/api', authRoutes);

// Chatbot API endpoint
app.post("/api/chat", async (req, res) => {
    const { query } = req.body;

    try {
        const reply = await detectIntent(query);
        res.json({ reply });
    } catch (error) {
        res.status(500).json({ reply: "Error connecting to the chatbot." });
    }
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

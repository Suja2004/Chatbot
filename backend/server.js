const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const { detectIntent } = require("./chatbot");
const User = require('./models/User');
const authRoutes = require('./authRoutes');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

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

const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
        console.log('No token provided');
        return res.status(403).json({ message: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                console.log('Token expired');
                return res.status(401).json({ message: 'Token expired, please log in again' });
            }
            console.log('Token verification failed:', err);
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};



app.use('/api', authRoutes);

app.post("/api/chat", async (req, res) => {
    const { query } = req.body;

    try {
        const reply = await detectIntent(query);
        res.json({ reply });
    } catch (error) {
        res.status(500).json({ reply: "Error connecting to the chatbot." });
    }
});

app.get("/api/user/:id", authenticateJWT, async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const lastAssessment = user.severityHistory.length > 0
            ? user.severityHistory[user.severityHistory.length - 1]
            : null;

        const nextQuizDate = lastAssessment
            ? calculateNextAssessmentDate(lastAssessment.date, user.frequency)
            : null;

        res.status(200).json({
            user,
            nextQuizDate: nextQuizDate ? nextQuizDate : 'No previous assessments'
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Error fetching user profile', error: error.message });
    }
});

function calculateNextAssessmentDate(lastAssessmentDate, frequency) {
    if (!lastAssessmentDate) return null;

    const currentDate = new Date(lastAssessmentDate);
    let nextDate = new Date(currentDate);

    switch (frequency) {
        case "Weekly":
            nextDate.setDate(currentDate.getDate() + 7);
            break;
        case "Bi-Weekly":
            nextDate.setDate(currentDate.getDate() + 14);
            break;
        case "Monthly":
            nextDate.setMonth(currentDate.getMonth() + 1);
            break;
        default:
            nextDate = currentDate;
    }
    return nextDate;
}


app.put('/api/user', authenticateJWT, async (req, res) => {
    const { username, age, gender, frequency } = req.body;

    try {
        if (age !== undefined && (typeof age !== 'number' || age <= 0)) {
            return res.status(400).json({ message: 'Invalid age provided.' });
        }
        if (gender && !["Male", "Female", "Other"].includes(gender)) {
            return res.status(400).json({ message: 'Invalid gender provided.' });
        }
        if (frequency && !["Weekly", "Bi-Weekly", "Monthly"].includes(frequency)) {
            return res.status(400).json({ message: 'Invalid frequency option provided.' });
        }

        const userDetails = await User.findOne({ username }).select('-password');
        if (!userDetails) {
            return res.status(404).json({ message: 'User details not found.' });
        }

        const updateData = {};
        if (age !== undefined) updateData.age = age;
        if (gender) updateData.gender = gender;
        if (frequency) updateData.frequency = frequency;

        if (frequency) {
            const lastAssessment = userDetails.severityHistory.length > 0
                ? userDetails.severityHistory[userDetails.severityHistory.length - 1]
                : null;

            const nextQuizDate = lastAssessment
                ? calculateNextAssessmentDate(lastAssessment.date, frequency)
                : null;

            updateData.nextQuizDate = nextQuizDate;
        }

        const updatedUser = await User.findByIdAndUpdate(
            userDetails._id,
            updateData,
            { new: true, runValidators: true }).select('-password');

        res.status(200).json({
            message: 'Profile updated successfully!',
            user: updatedUser,
            updateData
        });

    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
});

app.post('/api/user/:id/severity', authenticateJWT, async (req, res) => {
    const { severityScore, severityLevel } = req.body;
    const userId = req.params.id;
    try {
        const userDetails = await User.findById(userId);

        if (!userDetails) {
            return res.status(404).json({ message: 'User details not found.' });
        }

        userDetails.severityHistory.push({ severityScore, severityLevel });

        await userDetails.save();

        res.status(200).json({ message: 'Severity data saved successfully!' });
    } catch (error) {
        console.error('Error saving severity data:', error);
        res.status(500).json({ message: 'Error saving severity data', error: error.message });
    }
});



app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
